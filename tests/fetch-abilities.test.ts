import test from "node:test"
import assert from "node:assert";
import { fetchAbilities } from "@/scripts/fetch/fetch-abilities"

test("Confirm the file is a KV3 by checking its head", async () => {
    const responseBody = await fetchAbilities();

    console.log("Head:", responseBody.slice(0, 133));

    assert.match(responseBody, /^<!--\s*kv3[^]*-->/i);
});