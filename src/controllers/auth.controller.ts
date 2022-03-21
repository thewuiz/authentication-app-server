import { Request, Response } from "express";
import bcrypt from "bcrypt";
import axios from "axios";

import generate_jwt from "../helpers/jwt";
import User from "../models/user";

//REGULAR LOGIN
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userDB = await User.findOne({ email });
    if (!userDB) {
      return res.status(404).json({ errors: ["The email is not registered"] });
    }

    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(400).json({ errors: ["Wrong username or password"] });
    }

    const token = await generate_jwt(userDB.id);

    return res.json({ token: token, user: userDB });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      errors: [`Error: ${error}`],
    });
  }
};

// GITHUD METHODS
const getAuthPageGithud = async (req: Request, res: Response) => {
  res.send({
    authUrl:
      "https://github.com/login/oauth/authorize?client_id=" +
      process.env.CLIENT_ID +
      "&redirect_uri=" +
      process.env.REDIRECT_URI +
      "&scope=user,user:email&allow_signup=" +
      true,
  });
};

const loginGithud = async (req: Request, res: Response) => {
  const { code } = req.params;
  let usuario = new User();
  try {
    //Githud access token
    const data = await axios({
      url: `https://github.com/login/oauth/access_token`,
      params: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
      },
      headers: { Accept: "application/json" },
      method: "POST",
    }).then((response) => {
      return response.data;
    });

    const access_token = data.access_token;

    if (!access_token) {
      return res
        .status(400)
        .json("Bad verification code: The code passed is incorrect or expired");
    }

    //Githud email
    const email = await axios({
      url: "https://api.github.com/user/emails",
      method: "GET",
      headers: {
        Authorization: `token ${access_token}`,
      },
    }).then((response) => {
      return response.data[0].email;
    });

    //search user on mongo
    const usuariodb = await User.findOne({ email });

    if (usuariodb) {
      usuario = usuariodb;
    } else {
      //Githud user data
      const response = await axios({
        url: "https://api.github.com/user",
        method: "GET",
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
      usuario = new User({
        name: response.data.name || "",
        photo: response.data.avatar_url || "",
        bio: response.data.bio || "",
        email: email,
        password: "@@@@",
      });
      await usuario.save();
    }

    const jwt = await generate_jwt(usuario.id);
    return res.send({ token: jwt, user: usuario });
  } catch (error) {
    return res.status(400).json({ errors: error });
  }
};

export default { login, getAuthPageGithud, loginGithud };
