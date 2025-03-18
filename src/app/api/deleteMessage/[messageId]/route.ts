import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const { messageId } = params;

    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User is not authenticated"
        }, { status: 401 });
    }

    const user: User = session?.user as unknown as User;

    try {
        const updatedResult = await UserModel.updateOne({ _id: user._id }, { $pull: { messages: { _id: messageId } } });
        if (updatedResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Message Deleted"
        }, { status: 200 });
    } catch (error) {
        console.error("An unexpected error occured: ", error);
        return Response.json({
            success: false,
            message: "Error while deleting messages"
        }, { status: 500 });
    }
}