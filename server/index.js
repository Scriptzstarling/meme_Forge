import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Example AI meme generation route
app.post("/generate-meme", async (req, res) => {
  const { prompt } = req.body;

  // Here you'll call your AI image generation API
  // For now just return a placeholder
  res.json({
    success: true,
    imageUrl: "https://placekitten.com/600/400"
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
