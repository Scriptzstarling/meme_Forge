import * as fal from "@fal-ai/serverless-client";
import dotenv from "dotenv";

dotenv.config();

console.log("FAL_KEY loaded? ✅", !!process.env.FAL_KEY);

fal.config({
  credentials: process.env.FAL_KEY
});

const run = async () => {
  try {
    const result = await fal.subscribe("fal-ai/ideogram/v2a/turbo", {
      input: {
        prompt: "a cute cat wearing sunglasses"
      }
    });
    console.log(result);
  } catch (err) {
    console.error("Fal.ai error:", err.message);
  }
};

run();
