const Joi = require("joi");

module.exports = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required().trim(),
    contact: Joi.string().length(10).required().trim(),
    gender: Joi.string(),
    address: Joi.string().trim(),
    dob: Joi.date().required(),
    created_date: Joi.date(),
  });

  const validate = schema.validate(data);
  return validate;
};
