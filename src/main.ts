import { setupDefaultFullsoakLogger, useFullSoak } from "fullsoak";
import { loadDotEnv } from "./utils/dotEnv.ts";
import { FrontendController } from "./controllers/FrontendController.ts";
import { BackendController } from "./controllers/BackendController.ts";
import { authMiddleware } from "./utils/authMiddleware.ts";

if (import.meta.main) {
  setupDefaultFullsoakLogger();
  await loadDotEnv();
  useFullSoak({
    port: 6969,
    middlewares: [authMiddleware],
    controllers: [FrontendController, BackendController],
  });
}
