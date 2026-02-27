# Architecture

todo

## The function fetch-hero-info.ts

This function fetches from the API all the info related to Deadlock heroes that are relevant to the purpose of this project.

It offers some normalization options since TypeScript types (Ihero, in this case) are compile-time only.
API data is runtime and untrusted. So the check is defensive programming: avoid crashing if tags is missing/wrong, and default to [].
This is mostly good practice, not a strict API requirement.

It also normalizes different possible API response shapes into one consistent array before .map(...).
That lets the rest of the code stay simple (rawHeroes.map(toHero)), instead of repeating conditionals.