import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    email : {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    postTime: {
        type: Date,
        default : Date.now
    }
})

export const messageModel = model('messages', messageSchema)
