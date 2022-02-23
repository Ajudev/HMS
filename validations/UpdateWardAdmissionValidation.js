const Joi = require("joi");

module.exports = (data) => {
  const schema = Joi.object({
    discharge_date: Joi.date(),
    discharge_summary: Joi.string(),
    home_treatment_plan: Joi.string(),
  });

  const validate = schema.validate(data);
  return validate;
};
