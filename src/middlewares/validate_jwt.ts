import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const validate_jwt = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      msg: "You don't have access permission",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET || "") as any;
    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "You don't have access permission or your session expired",
    });
  }
};

export = validate_jwt;
