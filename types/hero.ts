export type HeroId =
  | "abrams"
  | "apollo"
  // to be extended later

export interface Hero {
  id: HeroId
  name: string
  description: string[]
  tags: [string, string, string]
}
