import mongoose, { Schema, Document } from "mongoose";
import { Message, MessageSchema } from "./Message.model";

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[],
}

const UserScheam: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "User is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is requied"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "VerifyCode expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: {
        type: [MessageSchema]
    }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserScheam));

export default UserModel;