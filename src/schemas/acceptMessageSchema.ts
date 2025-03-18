import { z } from 'zod'

export const acceptMessageScheam = z.object({
    acceptMessages: z.boolean(),
})