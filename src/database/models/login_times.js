import { Schema, Types, model } from "mongoose";

const loginTimesSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        ref:'User'
    },
    times:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
       default:Date.now,
       expires:1*60*60*5 //5 hours
    }

})


export const LoginTimes = model("LoginTimes", loginTimesSchema)

