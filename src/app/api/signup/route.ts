import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

function generateSecureOTP(length = 6): string {
    return Array.from({ length }, () => crypto.randomInt(0, 10).toString()).join("");
}


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return Response.json({
                success: false,
                message: "All fields (username, email, password) are required."
            }, { status: 400 });
        }

        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });

        if (existingUser && existingUser.isVerified) {
            if (existingUser.email === email && existingUser.username === username) {
                return Response.json({
                    success: false,
                    message: "User with this email and username already exists."
                }, { status: 400 });
            } else if (existingUser.username === username) {
                return Response.json({
                    success: false,
                    message: "Username already taken."
                }, { status: 400 });
            } else {
                return Response.json({
                    success: false,
                    message: "User with this email already exists."
                }, { status: 400 });
            }
        }


        const verifyCode = generateSecureOTP();
        const verifyCodeExpiry = new Date(Date.now() + 300000);

        // Hash password and send email **in parallel**
        const hashedPasswordPromise = bcrypt.hash(password, 10);
        const emailPromise = sendVerificationEmail(email, username, verifyCode);

        let user;
        if (existingUser) {
            existingUser.username = username;
            existingUser.verifyCode = verifyCode;
            existingUser.verifyCodeExpiry = verifyCodeExpiry;
            user = existingUser;
        } else {
            user = new UserModel({
                username,
                email,
                password: "",
                verifyCode,
                verifyCodeExpiry,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });
        }

        // Wait for password hashing
        user.password = await hashedPasswordPromise;

        // Save user to DB
        await user.save();

        // Wait for email to send
        const emailResponse = await emailPromise;

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your account",
        }, { status: 201 });

    } catch (error) {
        console.error("Error while registering user: ", error);
        return Response.json({ success: false, message: "Error registering user" }, { status: 500 });
    }
}
