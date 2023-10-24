import { z } from "zod";

export const SignupSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email("Invalid email address"),
  password: z.string({
    required_error: "password is required",
  }),
  username: z.string({
    required_error: "username is required",
  }),
});

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email("Invalid email address"),
  password: z.string({
    required_error: "password is required",
  }),
});

export const TransactionPinSchema = z.object({
  pin: z
    .string({
      required_error: "pin is required",
    })
    .min(6, "Pin length must be 6"),
});
