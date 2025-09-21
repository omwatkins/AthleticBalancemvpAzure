type Msg = { role: "system" | "user" | "assistant"; content: string }

const hasAzure =
  !!process.env.AZURE_OPENAI_API_KEY &&
  !!process.env.AZURE_OPENAI_ENDPOINT &&
  !!process.env.AZURE_OPENAI_DEPLOYMENT &&
  !!process.env.AZURE_OPENAI_API_VERSION

export async function streamChat(system: string, messages: Msg[]) {
  if (hasAzure) return streamAzure(system, messages)
  return streamOpenAI(system, messages)
}

async function streamAzure(system: string, messages: Msg[]) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT!
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT!
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION!
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "api-key": process.env.AZURE_OPENAI_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.7,
      stream: true,
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res
}

async function streamOpenAI(system: string, messages: Msg[]) {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("OPENAI_API_KEY missing (and Azure not configured).")
  const url = "https://api.openai.com/v1/chat/completions"

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.7,
      stream: true,
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res
}
