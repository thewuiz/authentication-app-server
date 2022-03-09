import { Request, Response } from "express";
import bcrypt from "bcrypt";

import generate_jwt from "../helpers/jwt";
import User from "../models/user";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userDB = await User.findOne({ email });
    if (!userDB) {
      return res.status(404).json({ errors: ["Wrong username or password"] });
    }

    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(400).json({ errors: ["Wrong username or password"] });
    }

    const token = await generate_jwt(userDB.id);

    return res.json({ token: token });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      errors: [`Error: ${error}`],
    });
  }
};

export default { login };
