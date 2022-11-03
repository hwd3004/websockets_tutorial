import { Request, Response, NextFunction } from "express";

export const home = async (req: Request, res: Response) => {
  return res.send({ home: "connection is successful." });
};
