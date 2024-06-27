import Joi from "joi";

export const addUserSchema = Joi.object({
    name: Joi.string().alphanum().min(1).max(25).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().pattern(new RegExp("^(?=.{6,})")).required(),//RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})")).required(),

}).required()

export const updateUserValidation = Joi.object({
    id:Joi.string(),
    name: Joi.string(),
    //email: Joi.string().alphanum().email(),
    password: Joi.string().min(6),
    oldPassword: Joi.string().min(6),
})

export const updateUserValidationAdmin = Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    //email: Joi.string().alphanum().email(),
    password: Joi.string().min(6),
    role: Joi.string().valid('admin', 'user'),
    emailActivated: Joi.boolean()
})

export const sendCodeValidation = Joi.object(
    {
        id: Joi.string().alphanum().required()
    }).required()


export const confirmCodeValidation = Joi.object(
    {
        id: Joi.string().alphanum().required(),
        code: Joi.number().required()
    }).required()


export const forgetPasswordValidation = Joi.object({
    email: Joi.string().email().required()
})


export const resetPasswordValidation = Joi.object({
    code: Joi.number().required()
})


export const changePassword=Joi.object({
    id:Joi.string(),
    password: Joi.string().min(6),
})


export const wishlist=Joi.object({
    stock:Joi.string(),
    op:Joi.string().valid('add','remove')
})