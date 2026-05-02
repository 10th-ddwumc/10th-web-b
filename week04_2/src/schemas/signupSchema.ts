// src/schemas/signupSchema.ts
import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요."),
});

export const passwordSchema = z
  .object({
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    passwordConfirm: z.string().min(1, "비밀번호를 다시 한 번 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export const nicknameSchema = z.object({
  nickname: z.string().min(1, "닉네임을 입력해주세요."),
});

export type EmailFormData = z.infer<typeof emailSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type NicknameFormData = z.infer<typeof nicknameSchema>;

export type SignupData = EmailFormData & PasswordFormData & NicknameFormData;