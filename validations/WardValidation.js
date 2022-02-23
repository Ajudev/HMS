const Joi = require("joi");

module.exports = (data, validate_type) => {
  let schema = null;
  if (validate_type === "update") {
    schema = Joi.object({
      name: Joi.string(),
      capacity: Joi.number(),
      department: Joi.string(),
    });
  } else {
    schema = Joi.object({
      name: Joi.string().required(),
      capacity: Joi.number().required(),
      department: Joi.string().required(),
    });
  }

  const validate = schema.validate(data);
  return validate;
};
