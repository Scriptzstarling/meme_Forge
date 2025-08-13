import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { clerkMiddleware, requireAuth } from "@clerk/express";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// --------------------- MULTER SETUP FOR IMAGE UPLOAD (OPTIONAL) ---------------------
const upload = multer({ dest: "uploads/" });

// --------------------- HEALTH CHECK ---------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --------------------- IMAGE GENERATION (AI) ---------------------
app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.json({ image: imageUrl });
  } catch (err) {
    console.error("Error generating image:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// Mirror under /api for client proxy
app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.json({ image: imageUrl });
  } catch (err) {
    console.error("Error generating image:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

// --------------------- AI CAPTIONS (PROTECTED) ---------------------
app.post("/api/captions", requireAuth(), async (req, res) => {
  try {
    const { tone = "Neutral", prevCaptions = [] } = req.body || {};

    const prompt = `Generate 5 short, witty meme captions. Tone: ${tone}. Avoid these captions: ${prevCaptions.join(", ")}. Make them under 12 words each, creative, and engaging. Return only the captions in a numbered list.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const captions = text
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);

    res.json({ captions });
  } catch (err) {
    console.error("Error generating captions:", err);
    res.status(500).json({ error: "Caption generation failed" });
  }
});

// --------------------- START SERVER ---------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
