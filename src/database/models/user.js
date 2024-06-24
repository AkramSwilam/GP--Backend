import { Schema, Types, model } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    emailActivated: {
        type: Boolean,
        default: false
    },
    wishlist:[{type:Types.ObjectId,ref:'Stock'}]
}, { timestamps: true })

userSchema.pre("findOneAndUpdate", function () {
    if (this._update.password) {
        this._update.password = bcrypt.hashSync(this._update.password, parseInt(process.env.SALT_ROUNDS))
    }


})
userSchema.pre("save", function () {
    console.log(this);
    this.password = bcrypt.hashSync(this.password, parseInt(process.env.SALT_ROUNDS))
})
export const User = model("User", userSchema)