import { RAW_URL } from "./RAW_URL"

async function main() {
    const res = await fetch(`${RAW_URL}`)

  if (!res.ok) {
    throw new Error(`Failed to download: ${res.status}`)
  }

  const text = await res.text()
  console.log(text.slice(0, 500))
}

main()