import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "./db";
import APIRouter from "./api";

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client build
const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Bonchi v3 API" });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/db-test", async (req: Request, res: Response) => {
  try {
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    res.json({
      status: "success",
      message: "Database connection successful",
      result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    await prisma.$disconnect();
  }
});

app.use("/api", APIRouter);

// Serve client app for all other routes (SPA fallback)
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
