const Joi = require("joi");

const addProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.max": "Product Name Should Have a Maximum of 100 characters",
    "string.min": "Product Name Should Have a Minimum of 2 characters",
    "any.required": "Product Name is Required",
  }),
  description: Joi.string().min(10).max(500).required().messages({
    "string.max": "Description Should Have a Maximum of 500 characters",
    "string.min": "Description Should Have a Minimum of 10 characters",
    "any.required": "Description is Required",
  }),
  price: Joi.number().min(1000).required().messages({
    "number.min": "Minimum Price Allowed is 1000",
    "any.required": "Price is Required",
  }),
  color: Joi.string().required().messages({
    "any.required": "Color is Required",
  }),
  category: Joi.string().required().messages({
    "any.required": "Category is Required",
  }),
  image: Joi.object({
    data: Joi.string().required(),
    size: Joi.number().max(2000000).required().messages({
      "number.max": "Maximum File Size is 2MB",
      "any.required": "Image Size is Required",
    }),
    width: Joi.number().max(500).required().messages({
      "number.max": "Maximum Width Allowed is 500px",
      "any.required": "Image Width is Required",
    }),
    height: Joi.number().min(500).required().messages({
      "number.min": "Minimum Height Allowed is 500px",
      "any.required": "Image Height is Required",
    }),
  }),
    admin_id: Joi.string().required()
});

module.exports = { addProductSchema };
