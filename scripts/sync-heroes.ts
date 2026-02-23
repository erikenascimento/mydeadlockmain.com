import fs from "fs/promises"

async function main() {
  const res = await fetch("https://assets.deadlock-api.com/v2/heroes/1")
  const data = await res.json()
  console.log("🚀 ~ main ~ data:", data.description.lore)

const hero: Object = {
    id: data.id,
    name: data.name,
    description: data.description.lore,
    tags: data.tags,
}
console.log("🚀 ~ main ~ hero:", hero)

}

main()