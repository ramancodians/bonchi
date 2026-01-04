import "dotenv/config";
import express, { type Request, type Response } from "express";
import prisma from "./db";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
