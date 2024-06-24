import Joi from "joi";

export const addCategoryValidation=Joi.object({
    name:Joi.string().required()
}).required()

export const getCategoryValidation=Joi.object({
    populate:Joi.string().alphanum().valid('stocks')
})

export const updateCategoryValidation=Joi.object({
    id:Joi.string().alphanum().required(),
    name:Joi.string().required()
}).required()

