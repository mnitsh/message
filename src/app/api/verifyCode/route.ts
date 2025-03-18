import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { verifySchema } from "@/schemas/verifySchema";

const codeQuerySchema = verifySchema;

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { verifyCode, username } = await request.json();

        // Check if required fields are provided
        if (!verifyCode || !username) {
            return Response.json({
                success: false,
                message: "Missing required fields"
            }, { status: 400 });
        }

        // Validate the verification code
        const queryParams = { code: verifyCode };

        const result = codeQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const verifyCodeError = result.error.format().code?._errors || [];
            return Response.json({
                success: false,
                message: verifyCodeError.length > 0 ? verifyCodeError.join(', ') : 'Invalid verification code'
            }, { status: 400 });
        }

        const { code } = result.data;

        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 400 });
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeNotExpired && isCodeValid) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 });
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code is expired, Signup again to get a new code"
            }, { status: 400 });
        } else {
            return Response.json({
                success: false,
                message: "Verification code is incorrect"
            }, { status: 400 });
        }
    } catch (error) {
        console.error("Error in verifing user: ", error);
        return Response.json({
            success: false,
            message: "Error in verifing user"
        }, { status: 500 });
    }
}