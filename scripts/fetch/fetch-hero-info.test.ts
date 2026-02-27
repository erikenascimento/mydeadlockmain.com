import test from "node:test"
import assert from "node:assert/strict"

import {
  fetchHeroInfo,
  normalizeHeroes,
  toHero,
} from "./fetch-hero-info"

test("toHero maps and normalizes lore/tags", () => {
  const hero = toHero({
    id: "12",
    name: "Kelvin",
    description: { lore: ["line1", "line2"] },
    tags: ["A", 7, null],
  })

  assert.equal(hero.id, 12)
  assert.equal(hero.name, "Kelvin")
  assert.equal(hero.description, "line1\n\nline2")
  assert.deepEqual(hero.tags, ["A", "7", "null"])
})

test("normalizeHeroes supports multiple response shapes", () => {
  const direct = [{ id: 1 }]
  const wrappedHeroes = { heroes: [{ id: 2 }] }
  const wrappedResults = { results: [{ id: 3 }] }
  const single = { id: 4 }

  assert.deepEqual(normalizeHeroes(direct), direct)
  assert.deepEqual(normalizeHeroes(wrappedHeroes), [{ id: 2 }])
  assert.deepEqual(normalizeHeroes(wrappedResults), [{ id: 3 }])
  assert.deepEqual(normalizeHeroes(single), [{ id: 4 }])
})

test("fetchHeroInfo writes generated heroes file", async () => {
  let writtenPath = ""
  let writtenContent = ""
  let writtenEncoding: BufferEncoding | "" = ""

  const fetchFn = async () => ({
    ok: true,
    status: 200,
    text: async () => "",
    json: async () => [
      {
        id: 1,
        name: "Infernus",
        description: { lore: "Fire" },
        tags: ["Arsonist"],
      },
    ],
  })

  const writeFileFn = async (
    path: string | Buffer | URL,
    data: string | NodeJS.ArrayBufferView,
    encoding?: BufferEncoding | null,
  ) => {
    writtenPath = String(path)
    writtenContent = String(data)
    writtenEncoding = (encoding ?? "") as BufferEncoding | ""
  }

  await fetchHeroInfo({
    fetchFn: fetchFn as typeof fetch,
    writeFileFn: writeFileFn as typeof import("fs/promises").writeFile,
    outputPath: "data/heroes.ts",
    logger: { log: () => {} },
  })

  assert.equal(writtenPath, "data/heroes.ts")
  assert.equal(writtenEncoding, "utf8")
  assert.match(writtenContent, /export const heroes: Ihero\[] =/)
  assert.match(writtenContent, /"name": "Infernus"/)
})

test("fetchHeroInfo throws detailed HTTP error", async () => {
  const fetchFn = async () => ({
    ok: false,
    status: 500,
    text: async () => "server exploded",
    json: async () => {
      throw new Error("should not call json")
    },
  })

  await assert.rejects(
    () =>
      fetchHeroInfo({
        fetchFn: fetchFn as typeof fetch,
        writeFileFn: async () => undefined,
        logger: { log: () => {} },
      }),
    /HTTP error! status: 500, message: server exploded/,
  )
})
