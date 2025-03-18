import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const user = await UserModel.aggregate([
            {
                $group: {
                    _id: null,
                    user: {
                        $push: {
                            _id: "$_id",
                            username: "$username"
                        }
                    }
                }
            }
        ])
        if (!user || !user[0]?.user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: user[0]?.user
        }, {
            status: 201
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Internal server error in finding the users"
        }, {
            status: 500
        })
    }
}