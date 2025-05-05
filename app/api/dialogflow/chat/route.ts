import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { randomUUID } from "crypto"
import { handleProductSearch } from "@/lib/dialogflow/handlers"
import { connectToDatabase } from "@/lib/db"
import { getDialogflowToken } from "@/lib/google/getDialogflowToken"
import { IProduct } from "@/lib/db/models/product.model"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const session = await auth()
  const sessionId = session?.user?.id || `anon-${randomUUID()}`

  const token = await getDialogflowToken()
  console.log(process.env.DIALOGFLOW_PROJECT_ID)
  if (!token) {
    return NextResponse.json(
      { fulfillmentText: "Failed to get access token.", products: [] },
      { status: 500 }
    )
  }

  const response = await fetch(
    `https://dialogflow.googleapis.com/v2/projects/${process.env.DIALOGFLOW_PROJECT_ID}/agent/sessions/${sessionId}:detectIntent`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  )
  
  if (!response.ok) {
    const text = await response.text() // fallback để xem nội dung trả về là gì
    console.error("❌ Dialogflow API error:", response.status, text)
    return NextResponse.json({
      fulfillmentText: `Dialogflow API error: ${response.status}`,
      products: [],
    }, { status: 500 })
  }

  const data = await response.json()

  const intentName = data.queryResult?.intent?.displayName
  const parameters = data.queryResult?.parameters || {}

  let fulfillmentText = data.queryResult?.fulfillmentText || "No response from Dialogflow."
  let products: IProduct[] = []

  if (intentName === "product.search") {
    await connectToDatabase()
    const result = await handleProductSearch(parameters)
    fulfillmentText = result.fulfillmentText
    products = result.products
  }

  return NextResponse.json({ fulfillmentText, products })
}
