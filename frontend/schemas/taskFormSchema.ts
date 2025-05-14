

import { z } from "zod";

export const taskFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    dueDate: z.date({ required_error: "Due date is required" }), // <-- Fix here
    priority: z.enum(["low", "medium", "high"]),
    recurring: z.boolean(),
    recurringType: z.enum(["daily", "weekly", "monthly"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recurring && !data.recurringType) {
      ctx.addIssue({
        path: ["recurringType"],
        code: z.ZodIssueCode.custom,
        message: "Recurring type is required when recurring is enabled.",
      });
    }
  });


