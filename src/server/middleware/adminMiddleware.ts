import jwt from "jsonwebtoken";
import { SUPER_ADMINS_IDS } from "../utils/serverConsts";

export const adminMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401).json({
        success: false,
        error: "Token not found",
      });
    } else {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET || "");
      if (SUPER_ADMINS_IDS.includes(decodedData?.userId)) {
        next();
      } else {
        res.status(403).json({
          success: false,
          error: "Access denied. Admins only.",
        });
      }
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Error in token verification",
    });
  }
};
