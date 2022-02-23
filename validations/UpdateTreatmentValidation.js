const Joi = require("joi");

module.exports = (data) => {
  const schema = Joi.object({
    doctor_id: Joi.string().trim(),
    diagnosis: Joi.string(),
    treatment: Joi.string(),
    prescription: Joi.string(),
  });

  const validate = schema.validate(data);
  return validate;
};
