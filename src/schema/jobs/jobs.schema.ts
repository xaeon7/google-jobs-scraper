import { z } from "zod";

export const jobsListRequestSchema = z.object({
  body: z.object({
    searchQuery: z.string({
      required_error: "Search query is required",
    }),
    resultsCount: z
      .number({
        invalid_type_error: "Invalid results number",
      })
      .optional(),
    location: z
      .string({
        invalid_type_error: "Invalid location",
      })
      .optional(),
  }),
});
