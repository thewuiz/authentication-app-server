import jwt from "jsonwebtoken";

const generate_jwt = (uid: String) => {
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "",
      { expiresIn: process.env.JWT_EXPIRES_IN || "" },
      (err, token) => {
        if (err) {
          reject(`Failed to generate token: ${err}`);
        }
        resolve(token);
      }
    );
  });
};

export = generate_jwt;
