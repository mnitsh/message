import { z } from 'zod'

export const messageSchema = z.object({
    content: z.string()
        .min(5, { message: "content must be atleast 5 character" })
        .max(300, "content should be less than 300 character"),
})