import { Schema, Types, model } from "mongoose";

const otpSchema = new Schema({
    code: {
        unique:true,
        type: Number,
        required: true,
    },
    userId:{
        type:Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:Date,
       default:Date.now,
       expires:300
    }

})


export const OTP = model("OTP", otpSchema)

