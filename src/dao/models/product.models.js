import { Schema, model } from "mongoose";
import paginate  from "mongoose-paginate-v2"
const prodSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    stock : {
        type: String,
        required: true
    },
    category : {
        type: String,
        required: true,
        unique : true
    },
    status : {
        type: Boolean,
        default: true
    },
    code : {
        type: String,
        requerid: true,
        unique: true
    },
    thumbnails: []
})

prodSchema.plugin(paginate)

export const prodModel = model('products' , prodSchema)