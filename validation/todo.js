const Joi = require('@hapi/joi');

const todoSchema = Joi.object().keys({
  name: Joi.string()
    .min(1)
    .max(50)
    .required(),
  description: Joi.string()
    .min(1)
    .max(100)
    .required()
});

module.exports = todoSchema;
