// src/components/signup/PasswordStep.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "../../schemas/signupSchema";
import type { PasswordFormData } from "../../schemas/signupSchema";

type PasswordStepProps = {
  email: string;
  onNext: (data: PasswordFormData) => void;
};

const PasswordStep = ({ email, onNext }: PasswordStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  return (
    <form className="signup-form" onSubmit={handleSubmit(onNext)}>
      <div className="signup-email-preview">
        <span>✉</span>
        <p>{email}</p>
      </div>

      <div className="password-input-box">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호를 입력해주세요!"
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? "⊙" : "⌁"}
        </button>
      </div>
      {errors.password && (
        <p className="signup-error">{errors.password.message}</p>
      )}

      <div className="password-input-box">
        <input
          type={showPasswordConfirm ? "text" : "password"}
          placeholder="비밀번호를 다시 한 번 입력해주세요!"
          {...register("passwordConfirm")}
        />
        <button
          type="button"
          onClick={() => setShowPasswordConfirm((prev) => !prev)}
        >
          {showPasswordConfirm ? "⊙" : "⌁"}
        </button>
      </div>
      {errors.passwordConfirm && (
        <p className="signup-error">{errors.passwordConfirm.message}</p>
      )}

      <button className="signup-submit" disabled={!isValid}>
        다음
      </button>
    </form>
  );
};

export default PasswordStep;