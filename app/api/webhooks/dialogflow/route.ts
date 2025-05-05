// import { NextRequest, NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/db"
// import { handleProductSearch } from "@/lib/dialogflow/handlers"

// export async function POST(req: NextRequest) {
//   if (req.method !== "POST") {
//     return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 })
//   }
//   const rawBody = await req.text()
//   let body
//   try {
//     body = JSON.parse(rawBody)
//     console.log("📥 Parsed Body:", body)
//   } catch (err) {
//     console.error("❌ Failed to parse JSON:", err)
//     return NextResponse.json({ fulfillmentText: "Invalid JSON", products: [] }, { status: 400 })
//   }

//   const intentName = body.queryResult?.intent?.displayName
//   const parameters = body.queryResult?.parameters || {}

//   await connectToDatabase()

//   let response: {
//     fulfillmentText: string
//     products: { name: string; image: string }[]
//   } = {
//     fulfillmentText: "Sorry, I couldn't process your request.",
//     products: [],
//   }

//   switch (intentName) {
//     case "product.search":
//       response = await handleProductSearch(parameters)
//       console.log("response", response)
//       break

//     default:
//       response.fulfillmentText = "I'm not sure how to help with that yet."
//   }

//   return NextResponse.json(response)
// }
