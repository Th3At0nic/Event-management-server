// schemas/event.zod.ts

import { z } from 'zod';

export const createEventValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    location: z.string({
      required_error: 'Location is required',
    }),
    dateTime: z
      .string({
        required_error: 'Date and Time are required',
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      }),
    organizerName: z.string({
      required_error: 'Organizer name is required',
    }),
    organizerEmail: z
      .string({
        required_error: 'Organizer email is required',
      })
      .email('Invalid email format'),
    joinedUsers: z.array(z.string().email()).optional(), // optional for create
  }),
});
