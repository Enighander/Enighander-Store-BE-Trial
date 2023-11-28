const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().min(8).max(25).required(),
  confirmPassword: Joi.ref("password"),
});

const validateUserRequest = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateUserRequest };
