import { Schema, Document } from "mongoose";

export interface Message extends Document {
    text: string,
    createdAt: Date,
}

export const MessageSchema: Schema<Message> = new Schema({
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})



