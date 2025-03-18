import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Email and password are required");
                }
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [{ email: credentials.identifier }, { username: credentials.identifier }]
                    });

                    if (!user) {
                        throw new Error("User not found with this Email or Username");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return user;
                } catch (error) {
                    console.error("Error in authorize:", error);
                    throw new Error("Authentication failed. Please try again.");
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user = session.user || {}; // Ensure session.user exists
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user?.isVerified;
                token.username = user?.username;
                token.isAcceptingMessage = user?.isAcceptingMessage;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,  // Ensure this is correctly set in .env
    pages: {
        signIn: "/signIn",
    }
};
