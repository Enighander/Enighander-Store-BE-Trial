const Joi = require("joi");

const registerAdminSchema = Joi.object({
  username: Joi.string().alphanum().min(6).max(30).required().messages({
    'string.min': 'Username should have a minimum of 6 characters',
    'string.max': 'Username was more than of 30 characters',
    'string.alphanum': 'Username should only contain alphanumeric characters',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Wrong Email Format',
  }),
  password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).min(8).max(25).required().messages({
    'string.pattern.base': 'Password must contain at least Alphanumberic, Uppercase letter at least one',
  }),
});


module.exports = { registerAdminSchema };
