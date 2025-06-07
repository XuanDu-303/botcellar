"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle, MinusIcon } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { IProduct } from "@/lib/db/models/product.model";
import Link from "next/link";
import Rating from "./product/rating";
import { formatNumber } from "@/lib/utils";
import ProductPrice from "./product/product-price";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type BotMessage = {
  from: "bot";
  text: string;
  products?: IProduct[];
};

type UserMessage = {
  from: "user";
  text: string;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<(UserMessage | BotMessage)[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname()
  const { data: session, status } = useSession()

  if (
    pathname.startsWith('/admin') || status === 'loading' || !session 
  ) {
    return null
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = input;
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");

    try {
      const res = await fetch("/api/dialogflow/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryInput: {
            text: {
              text: userMessage,
              languageCode: "en",
            },
          },
        }),
      });

      const data = await res.json();
      console.log("data", data);
      const botReply: BotMessage = {
        from: "bot",
        text: data.fulfillmentText || "Sorry, something went wrong.",
        products: data.products || [],
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Failed to connect to the chatbot." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

    return (
    <div className="fixed bottom-6 left-3 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary cursor-pointer hover:bg-primary/90 text-white p-3 rounded-full shadow-lg"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Box with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-box"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-86 h-90 bg-popover border rounded-md shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b text-foreground">
              <button onClick={() => setIsOpen(false)}>
                <MinusIcon size={20} className="cursor-pointer" />
              </button>
              <h3 className="font-semibold text-sm">Mira</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} className="cursor-pointer" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-background text-sm custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx}>
                  <div
                    className={`p-2 rounded-lg max-w-[75%] break-normal whitespace-pre-wrap ${
                      msg.from === "user"
                        ? "ml-auto bg-primary/10 text-primary"
                        : "mr-auto bg-muted"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Product cards (if bot) */}
                  {"products" in msg &&
                    msg.products &&
                    msg.products.length > 0 && (
                      <div className="mt-2 space-y-2 mr-2">
                        {msg.products.map((prod, i) => (
                          <Card
                            key={i}
                            className="flex rounded-sm items-center gap-3 p-0"
                          >
                            <Link
                              href={`/product/${prod.slug}`}
                              className="flex m-0 justify-between gap-2 border-b"
                            >
                              <div className="w-20 bg-gray-200 relative shrink-0">
                                <Image
                                  src={prod?.images?.[0]}
                                  alt={prod.name}
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>
                              <div className="flex p-1 flex-col flex-1 gap-1">
                                <div
                                  className="text-sm text-foreground text-ellipsis overflow-hidden"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {prod.name}
                                </div>
                                <div className="flex gap-1 text-xs">
                                  <span>{prod.avgRating}</span>
                                  <Rating rating={prod.avgRating} size={3} />
                                  <span>({formatNumber(prod.numReviews)})</span>
                                </div>
                                <ProductPrice
                                  isDeal={(prod.tags ?? []).includes(
                                    "todays-deal"
                                  )}
                                  price={prod.price}
                                  listPrice={prod.listPrice}
                                  forListing
                                  hideDiscount={true}
                                />
                              </div>
                            </Link>
                            <div
                              className="mx-3 mb-3 text-ellipsis overflow-hidden"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {prod.description}
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                </div>
              ))}
              {isLoading && (
                <div className="flex ml-2 space-x-1 justify-start items-center bg-transparent">
                  <div className="container">
                    <div className="box"></div>
                    <div className="box"></div>
                    <div className="box"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-2 bg-background">
              <input
                className="w-full border p-2 rounded text-sm bg-background border-input text-foreground"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}