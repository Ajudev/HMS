const Joi = require("joi");

const UserValidate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required().trim(),
    contact: Joi.string().length(10).required().trim(),
    gender: Joi.string(),
    address: Joi.string().trim(),
    dob: Joi.date().required(),
    created_date: Joi.date(),
    //   password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

    //   repeat_password: Joi.ref("password"),

    //   access_token: [Joi.string(), Joi.number()],

    //   birth_year: Joi.number().integer().min(1900).max(2013),

    //   email: Joi.string().email({
    //     minDomainSegments: 2,
    //     tlds: { allow: ["com", "net"] },
    //   }),
  });

  const validate = schema.validate(data);
  return validate;
};

module.exports = UserValidate;
