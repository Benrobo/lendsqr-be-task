import { z } from "zod";

export const SignupSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});
