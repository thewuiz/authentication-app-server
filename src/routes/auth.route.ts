/**
 *
 * RUTA: '/api/login'
 *
 */

import express from "express";
import { check } from "express-validator";
import controller from "../controllers/auth.controller";
import validate_data from "../middlewares/validate_data";
const router = express.Router();

router.post(
  "/",
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
  controller.login
);

//Githud methods
router.get("/github", controller.getAuthPageGithud);
router.get("/github/:code", controller.loginGithud);

export = router;
