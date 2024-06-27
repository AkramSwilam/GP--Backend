import { Schema, Types, model } from "mongoose";

const stockSchema = new Schema({
    symbol: {
        unique: true,
        type: String,
        required: true,
        trim: true,
        uppercase:true
    },
    name:{
        unique:true,
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true,
        minlength: [10, "description is too short"],
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    max: {
        type: Number,
        required: true,
        min: 0,
    },
    min:{
        type: Number,
        required: true,
        min: 0,
    },
    logo:{
        type: String,
        set: function (value) {
            if (value && Array.isArray(value) && value.length > 0) {
              return value[0].finalPath;
            }
            return value;
          },
    },
    charts:{
        type: [{}],
        // set: function (value) {
        //     if (Array.isArray(value)) {
        //       return value.map(element => element.finalPath);
        //     }
        //     return value;
        //   },
    },
    chartsDay:{
        type: [{}],
    },
    chartsSixMonths:{
        type: [{}],
    },
    chartsYear:{
        type: [{}],
    },
    predictions:{
        type:[Number]
    },
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category',
        required: true
    },
    sentimentScore:{
        type:Number
    },
    newsData:{
        type:[{}]
    }
},    {
    timestamps:true,
    })

// to do
// stockSchema.pre("save",function(params) {
    
// })
export const Stock = model("Stock", stockSchema)