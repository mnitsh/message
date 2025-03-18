import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User is not authenticated"
        }, { status: 401 });
    }

    const user: User = session?.user as unknown as User;



    const { acceptMessages } = await request.json();

    const userId = new mongoose.Types.ObjectId(user?._id);

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }).select('-password -verifyCode -verifyCodeExpiry');


        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept messages"
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: "updated user status to accept messages successfully",
            updatedUser
        }, { status: 201 });

    } catch (error) {
        console.error("failed to update user status to accept messages");
        return Response.json({
            success: false,
            message: "Error while updating user status to accept message"
        }, { status: 500 });
    }

}


export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "User is not authenticated"
        }, { status: 401 });
    }
    const user: User = session?.user as unknown as User;

    const userId = user?._id;


    try {
        const foundUser = await UserModel.findByIdAndUpdate(userId);

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage,
        }, { status: 201 });
    } catch (error) {
        console.error("Failed to find user");
        return Response.json({
            success: false,
            message: "Error while getting user acceptingMessage status"
        }, { status: 500 });

    }
}