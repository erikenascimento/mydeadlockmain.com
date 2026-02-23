const RAW_URL =
  "https://raw.githubusercontent.com/deadlock-api/deadlock-api-assets/master/res/abilities.vdata"

async function main() {
  const res = await fetch(RAW_URL)

  if (!res.ok) {
    throw new Error(`Failed to download: ${res.status}`)
  }

  const text = await res.text()
  console.log("🚀 ~ main ~ text:", text)
}

main()