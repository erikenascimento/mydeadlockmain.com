import test from "node:test"
import assert from "node:assert";
import { fetchAbilities } from "@/scripts/fetch/fetch-abilities"

test("Confirm the file is a KV3 by checking its head", async () => {
    const resultString = await fetchAbilities();

    console.log("Head:", resultString.slice(0, 133));

    assert.ok(
        resultString.startsWith("<!--"),
        "Response does not start with '<!--'"
    );
});