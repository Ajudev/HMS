const Joi = require("joi");

module.exports = (data) => {
  const schema = Joi.object({
    weight: Joi.number(),
    height: Joi.number(),
    blood_type: Joi.string().max(6),
    emergency_contact: Joi.string(),
    insurance: Joi.string().trim(),
  });

  const validate = schema.validate(data);
  return validate;
};
