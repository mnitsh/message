import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/Message.model";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username }).exec();

        if (!user) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                { message: 'User is not accepting messages', success: false },
                { status: 403 }
            );
        }

        const newMessage = { text: content, createdAt: new Date() } as Message;

        user.messages.push(newMessage);
        await user.save();

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
