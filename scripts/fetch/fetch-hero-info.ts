import { writeFile } from "fs/promises"
import { pathToFileURL } from "url"

import { Ihero } from "@/interfaces/Ihero"
import { HERO_API_URL } from "../config/api-url"

// Convert each raw API item into the shape used by the app (Ihero).
export function toHero(item: any): Ihero {
  const lore = item?.description?.lore
  const description = Array.isArray(lore)
    ? lore.map((line: unknown) => String(line)).join("\n\n")
    : String(lore ?? "")

  return {
    id: Number(item.id),
    name: String(item.name ?? ""),
    description,
    // tags are expected to be string[] in Ihero.
    // bellow is just a good practice check.
    tags: Array.isArray(item.tags)
      ? item.tags.map((tag: unknown) => String(tag))
      : [],
  }
}

export function normalizeHeroes(data: any): any[] {
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.heroes)
      ? data.heroes
      : Array.isArray(data?.results)
        ? data.results
        : [data]
}

// the actual async fetch connecting to the API
export async function fetchHeroInfo(options?: {
  fetchFn?: typeof fetch
  writeFileFn?: typeof writeFile
  apiUrl?: string
  outputPath?: string
  logger?: Pick<Console, "log">
}) {
  const fetchFn = options?.fetchFn ?? fetch
  const writeFileFn = options?.writeFileFn ?? writeFile
  const apiUrl = options?.apiUrl ?? HERO_API_URL
  const outputPath = options?.outputPath ?? "data/heroes.ts"
  const logger = options?.logger ?? console

  const response = await fetchFn(apiUrl)

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorBody}`,
    )
  }

  const data = await response.json()

  // normalizes the API response into a consistent array before mapping
  const rawHeroes = normalizeHeroes(data)

  const heroes: Ihero[] = rawHeroes.map(toHero)
  const fileContent = `import { Ihero } from "@/interfaces/Ihero"\n\nexport const heroes: Ihero[] = ${JSON.stringify(heroes, null, 2)}\n`

  // writting the file
  await writeFileFn(outputPath, fileContent, "utf8")
  logger.log(`Saved ${heroes.length} heroes to ${outputPath}`)
}

// fetchHeroInfo throws when something fails (HTTP error, JSON parse, file write).
// .catch here is top-level process handling, so the script logs and exits cleanly.
const isDirectRun =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  fetchHeroInfo().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
