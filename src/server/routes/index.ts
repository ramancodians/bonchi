import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to Bonchi v3 API" });
});

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
