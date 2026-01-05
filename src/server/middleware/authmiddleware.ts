import jwt from "jsonwebtoken";

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401).json({
        success: false,
        error: "Token not found",
      });
    } else {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET || "");
      req.userInfo = decodedData;

      next();
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Error in token verification",
    });
  }
};
