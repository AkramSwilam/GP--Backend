import Joi from "joi"

const string = Joi.string();
const stringMin16 = Joi.string().min(16);
const number = Joi.number();

export const addStockValidation = Joi.object({
    symbol: string.uppercase().required(),
    description: stringMin16.required(),
    name: string.required(),
    price: number.required(),
    max: number.required(),
    min: number.required(),
    charts: Joi.array().items(Joi.object({
        close: Joi.number().required(),
        date: Joi.date().required(),
        prediction: Joi.number()
    })),
    chartsSixMonths: Joi.array().items(Joi.object({
        close: Joi.number().required(),
        date: Joi.date().required(),
        prediction: Joi.number()
    })),
    chartsYear: Joi.array().items(Joi.object({
        close: Joi.number().required(),
        date: Joi.date().required(),
        prediction: Joi.number()
    })),
    chartsDay: Joi.array().items(Joi.object({
        close: Joi.number().required(),
        date: Joi.date().required(),
        prediction: Joi.number()
    })),
    predictions: Joi.array().items(Joi.number()).max(6),
    categoryId: Joi.string().alphanum().required(),
    sentimentScore:Joi.number(),
    newsData:Joi.array()
}).required();


export const updateStockValidation = Joi.object({
    id: Joi.string().alphanum().required(),
    symbol: string.uppercase(),
    description: stringMin16,
    name: string,
    price: number,
    max: number.required(),
    min: number.required(),
    predictions: Joi.array().items(Joi.number()).max(6),
    charts: Joi.array().items(Joi.object({
        close: Joi.number().required(),
        date: Joi.date().required(),
        prediction: Joi.number()
    })),
    categoryId: Joi.string().alphanum(),
    sentimentScore:Joi.number(),
    newsData:Joi.array()
}).required();

