const Joi = require("joi");

module.exports = (data, validate_type) => {
  let schema = null;
  if (validate_type === "update") {
    schema = Joi.object({
      weight: Joi.number(),
      height: Joi.number(),
      blood_type: Joi.string().max(6),
      emergency_contact: Joi.string(),
      insurance: Joi.string().trim(),
    });
  } else {
    schema = Joi.object({
      user_id: Joi.string().trim(),
      weight: Joi.number().required(),
      height: Joi.number().required(),
      blood_type: Joi.string().max(6).required(),
      emergency_contact: Joi.string(),
      insurance: Joi.string().required().trim(),
    });
  }

  const validate = schema.validate(data);
  return validate;
};
