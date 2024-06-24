import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        unique:true,
        type: String,
        required: true,
        trim: true,
        minlength: [2, "name is too short"],
    },
    image: {
        type: String,
        set: function (value) {
            if (value && Array.isArray(value) && value.length > 0) {
              return value[0].finalPath;
            }
            return value;
          },
    },
    stocks: [{ type: Schema.ObjectId, ref: 'Stock' }]

}, { timestamps: true })


export const Category = model("Category", categorySchema)

