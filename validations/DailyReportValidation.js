const Joi = require("joi");

module.exports = (data) => {
  const schema = Joi.object({
    hourly_temperature: Joi.number().required(),
    blood_pressure: Joi.number().required(),
    pulse_rate: Joi.number().required(),
    treatment_id: Joi.string().trim(),
    report_date: Joi.date()
  });

  const validate = schema.validate(data);
  return validate;
};
