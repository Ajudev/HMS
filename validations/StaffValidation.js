const Joi = require("joi");

module.exports = (data) => {
  const schema = Joi.object({
    user_id: Joi.string().trim(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().required(),
    department: Joi.string().required().trim(),
    education: Joi.string(),
    languages: Joi.string().trim(),
    staff_type: Joi.string().required().trim(),
    join_date: Joi.date(),
  });

  const validate = schema.validate(data);
  return validate;
};
