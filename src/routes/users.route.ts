/**
 *
 * RUTA: '/api/users'
 *
 */
import express from "express";
import { check } from "express-validator";

import controller from "../controllers/users.controller";
import validate_data from "../middlewares/validate_data";
import validate_jwt from "../middlewares/validate_jwt";

const router = express.Router();

//Methods
router.get("/user/:id", controller.getUserById);

router.post(
  "/create",
  [
    check(
      "email",
      "The email does not have a correct format or is emty"
    ).isEmail(),
    check("password", "Password is required").not().isEmpty(),
    check(
      "password",
      "The password must be greater than 8 characters"
    ).isLength({ min: 8 }),
    validate_data,
  ],
  controller.createUser
);

router.put(
  "/user/:id",
  [
    validate_jwt,
    check(
      "photo",
      "The url does not have a correct format or is empty"
    ).isURL(),
    check("name", "The name must be a maximum of 50 characters").isLength({
      max: 50,
    }),
    check("bio", "The name must be a maximum of 200 characters").isLength({
      max: 200,
    }),
    check(
      "email",
      "The email does not have a correct format or is emty"
    ).isEmail(),
    validate_data,
  ],
  controller.updateUser
);

export = router;
