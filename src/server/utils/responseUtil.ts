import { Response } from "express";

export const sendSuccessResponse = (
  res: Response,
  {
    data,
    status = 200,
  }: {
    data: any;
    status?: number;
  }
) => {
  res.status(status).json({
    status: "success",
    data,
  });
};

export const sendErrorResponse = (
  res: Response,
  {
    message,
    status = 500,
    error,
    data,
  }: {
    message: string;
    status?: number;
    error?: any;
    data?: any;
  }
) => {
  res.status(status).json({
    status: "error",
    message,
    error,
    data,
  });
};
