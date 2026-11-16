import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  externals: {
    external: ["firebase-admin", "@google-cloud/firestore", "@grpc/grpc-js", "google-gax"],
  },
});
