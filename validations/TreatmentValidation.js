const Joi = require("joi");

module.exports = (data) => {
  const schema = Joi.object({
    admission_id: Joi.string().trim(),
    doctor_id: Joi.string().trim(),
    diagnosis: Joi.string().required(),
    treatment: Joi.string().required(),
    prescription: Joi.string().required()
  });

  const validate = schema.validate(data);
  return validate;
};
