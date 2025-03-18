import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

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

    const userId = new mongoose.Types.ObjectId(user?._id);

    try {
        const user = await UserModel.aggregate([
            {
                $match: { _id: userId }
            },
            {
                $unwind: '$messages'
            },
            {
                $sort: { 'messages.createdAt': -1 }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
        ])

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        if (user.length == 0) {
            return Response.json({
                success: true,
                message: "No anonymous message yet"
            }, { status: 200 });
        }

        return Response.json({
            success: true,
            message: user[0].messages
        }, { status: 201 });
    } catch (error) {
        console.error("An unexpected error occured: ", error);
        return Response.json({
            success: false,
            message: "Error while getting user messages"
        }, { status: 500 });
    }
}