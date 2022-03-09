import { Request, Response } from "express";
import bcrypt from "bcrypt";

import generate_jwt from "../helpers/jwt";
import User from "../models/user"; //Importar Schema usuario

//==============================================================================
//======================== CREATE USER =========================================
const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const email_exists = await User.findOne({ email });
    if (email_exists) {
      return res.status(400).json({
        errors: ["The email has already been registered"],
      });
    }
    const userDB = new User(req.body);

    const salt = bcrypt.genSaltSync();
    userDB.password = bcrypt.hashSync(password, salt);
    await userDB.save();

    const token_access = await generate_jwt(userDB.id);

    return res.json({ user: userDB, token: token_access });
  } catch (error) {
    return res.status(500).json({
      errors: ["Unexpected error... check logs: " + error],
    });
  }
};

export default { createUser };
