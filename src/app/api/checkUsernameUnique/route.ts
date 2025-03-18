import dbConnect from "@/lib/dbConnect";
import { z } from 'zod';
import UserModel from "@/model/User.model";
import { userNameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username: userNameValidation
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);

        const usernameQuery = searchParams.get('username') || "";

        const queryParam = { username: usernameQuery };

        // Validate with Zod
        const result = usernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameError.length > 0 ? usernameError.join(', ') : 'Invalid query parameters'
            }, { status: 400 });
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "User with this username already exists"
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: "username is unique"
        }, { status: 200 });

    } catch (error) {
        console.error("Error in checking username: ", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 });
    }
}
