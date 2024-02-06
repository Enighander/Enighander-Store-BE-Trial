const Joi = require("joi");

const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Password or Email Was incorrect try again",
    "any.required": "Email is required"
  }),

  password: Joi.string().required().messages({
    "string.password": "Password or Email Was incorrect try again",
    "any.required": "Password is required"
  }),
});

const registerUserSchema = Joi.object({
  username: Joi.string().alphanum().min(6).max(30).required().messages({
    "string.min": "Username should have a minimum of 6 characters",
    "string.max": "Username was more than 30 characters",
    "string.alphanum": "Username should contain alphanumeric characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter correct Email format",
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
  phone: Joi.number().min(12).messages({
    "number.base" : "phone number must be a number",
  }),
});

const updateUserImageSchema = Joi.object({
  image_profile: Joi.string().custom((value, helpers) => {
    if (value.length > 2000000) {
      return helpers.message('Maximum File Size is 2MB')
    }
  })
})

const updateUserPasswordSchema = Joi.object({
  password: Joi.string()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  .min(8)
  .max(25)
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain at least Alphanumberic, Uppercase letter at least one",
  }),
})



module.exports = {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
  updateUserPasswordSchema,
  updateUserImageSchema
};
