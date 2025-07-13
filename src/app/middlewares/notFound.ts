import { Request, Response } from "express";
import httpsStatus from "http-status-codes";
export const notFoundErrorHandler = (req: Request, res: Response) => {
  res.status(httpsStatus.NOT_FOUND).json({
    success: false,
    message: "Route Not Found",
  });
};
