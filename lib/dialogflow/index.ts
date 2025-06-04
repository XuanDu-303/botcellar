import { GoogleAuth } from "google-auth-library"

export async function getDialogflowToken(): Promise<string | null> {
  try {
    const raw = process.env.DIALOGFLOW_SERVICE_ACCOUNT_JSON
    if (!raw) {
      console.error("Missing DIALOGFLOW_SERVICE_ACCOUNT_JSON env")
      return null
    }

    let credentials
    try {
      credentials = JSON.parse(raw)
    } catch (err) {
      console.error("Failed to parse service account JSON:", err)
      return null
    }

    const auth = new GoogleAuth({
      credentials,
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    })

    const client = await auth.getClient()
    const tokenResponse = await client.getAccessToken()

    if (!tokenResponse?.token) {
      console.error("Failed to retrieve Dialogflow token.")
      return null
    }

    return tokenResponse.token
  } catch (err) {
    console.error("Unexpected error in getDialogflowToken:", err)
    return null
  }
}