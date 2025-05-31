import { superoak } from "superoak";
import { assertSnapshot } from "jsr:@std/testing/snapshot";
import { FrontendController } from "../../src/controllers/FrontendController.ts";
import { useFullSoak } from "fullsoak/testing";

const app = await useFullSoak({ controllers: [FrontendController] });

Deno.test("GET / should response with expected HTML content", async (t) => {
  const request = await superoak(app);
  const resp = await request.get("/").expect(200);
  await assertSnapshot(t, resp.text);
});
