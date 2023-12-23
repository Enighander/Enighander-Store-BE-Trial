const Joi = require("joi");

const registerUserSchema = Joi.object({
  username: Joi.string().alphanum().min(6).max(30).required().messages({
    "string.min": "Username Should Have a Minimum of 6 characters",
    "string.max": "Username Was More Than 30 Characters",
    "string.alphanum": "Username should contain alphanumeric characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Wrong Email Format",
  }),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .min(8)
    .max(25)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least Alphanumberic, Uppercase letter at least one",
    }),
});

const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(6).max(30).required().messages({
    "string.min": "Username Should Have a Minimum of 6 characters",
    "string.max": "Username Was More Than 30 Characters",
    "string.alphanum": "Username should contain alphanumeric characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Wrong Email Format",
  }),
  password: Joi.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .min(8)
    .max(25)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least Alphanumberic, Uppercase letter at least one",
    }),
  image: Joi.object({
    data: Joi.string().required(),
    size: Joi.number().max(2000000).required().messages({
      "number.max": "Maximum File Size is 2MB",
    }),
    width: Joi.number().min(100).max(500).required().messages({
      "number.min": "Maximum Width Allowed is 100px",
      "number.max": "Maximum Width Allowed is 500px",
      "number.base": "Width must be a number",
    }),
    height: Joi.number().min(100).max(500).required().messages({
      "number.min": "Maximum Heigth Allowed is 100px",
      "number.min": "Minimum Height Allowed is 500px",
      "number.base": "Height must be a number",
    }),
  }),
});

module.exports = {
  registerUserSchema,
  updateUserSchema,
};
