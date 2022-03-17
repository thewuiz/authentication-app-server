import { Request, Response } from "express";
import bcrypt from "bcrypt";

import generate_jwt from "../helpers/jwt";
import User from "../models/user"; //Importar Schema usuario

//==============================================================================
//======================== GET USER BY ID ======================================
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userDB = await User.findById(id);

    if (userDB) {
      return res.json({
        user: userDB,
      });
    }

    return res.status(404).json({
      ok: false,
      msg: "The user does not exist",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Unexpected error... check logs: " + error,
    });
  }
};

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

//==============================================================================
//======================== CREATE USER =========================================
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userdb = await User.findById(id);

    if (userdb) {
      const { uid, email, password, ...data } = req.body;

      //Verificar que el nuevo correo es unico
      if (userdb.email !== email) {
        const user = await User.findOne({ email: email });

        if (user) {
          return res
            .status(400)
            .json({ error: "The email is already registered" });
        }
        data.email = email;
      }

      if (password) {
        if (password.length < 8) {
          return res
            .status(400)
            .json({ error: "The password must be greater than 8 characters" });
        }
        const salt = bcrypt.genSaltSync();
        data.password = bcrypt.hashSync(password, salt);
      }

      const updateUser = await User.findByIdAndUpdate(uid, data, {
        new: true,
      });

      return res.send({ user: updateUser });
    }
    return res.send({ error: "User don't exist" });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export default { createUser, getUserById, updateUser };
