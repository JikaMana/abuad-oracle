import test from "node:test";
import assert from "node:assert/strict";
import { cleanTestId } from "./dispatch.mjs";

test("a text test id is kept so the result can sync", () => {
  assert.equal(cleanTestId("m5k2p-ab12cd"), "m5k2p-ab12cd");
  assert.equal(cleanTestId(1731860000000), "1731860000000");
  assert.equal(cleanTestId("bad id/../x"), "badidx");
  assert.equal(cleanTestId(""), "");
});
