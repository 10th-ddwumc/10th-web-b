// src/components/signup/EmailStep.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema } from "../../schemas/signupSchema";
import type { EmailFormData } from "../../schemas/signupSchema";

type EmailStepProps = {
  defaultEmail: string;
  onNext: (email: string) => void;
};

const EmailStep = ({ defaultEmail, onNext }: EmailStepProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      email: defaultEmail,
    },
  });

  const onSubmit = (data: EmailFormData) => {
    onNext(data.email);
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
      <button type="button" className="google-button">
        <span className="google-mark">G</span>
        <span>구글 로그인</span>
      </button>

      <div className="signup-divider">
        <span />
        <p>OR</p>
        <span />
      </div>

      <input
        className="signup-input"
        placeholder="이메일을 입력해주세요!"
        {...register("email")}
      />

      {errors.email && <p className="signup-error">{errors.email.message}</p>}

      <button className="signup-submit" disabled={!isValid}>
        다음
      </button>
    </form>
  );
};

export default EmailStep;