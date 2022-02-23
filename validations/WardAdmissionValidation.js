const Joi = require("joi");

module.exports = (data) => {
  const schema = Joi.object({
    patient_id: Joi.string().trim(),
    ward_id: Joi.string().trim(),
    admission_date: Joi.date(),
    discharge_date: Joi.date(),
    discharge_summary: Joi.string(),
    home_treatment_plan: Joi.string()
  });

  const validate = schema.validate(data);
  return validate;
};
