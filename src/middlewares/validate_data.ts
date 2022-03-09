import { Request, Response } from "express";
import { validationResult } from "express-validator";

const validate_data = async (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  let arrayErrors: string[] = [];
  Object.entries(errors.mapped()).forEach(([key, val]) => {
    arrayErrors.push(val.msg);
  });
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: arrayErrors });
};

export = validate_data;
