// src/components/signup/NicknameStep.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nicknameSchema } from "../../schemas/signupSchema";
import type { NicknameFormData } from "../../schemas/signupSchema";

type NicknameStepProps = {
  onComplete: (data: NicknameFormData) => void;
};

const NicknameStep = ({ onComplete }: NicknameStepProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<NicknameFormData>({
    resolver: zodResolver(nicknameSchema),
    mode: "onChange",
    defaultValues: {
      nickname: "",
    },
  });

  return (
    <form className="signup-form" onSubmit={handleSubmit(onComplete)}>
      <div className="profile-image">
        <div className="profile-head" />
        <div className="profile-body" />
      </div>

      <input
        className="signup-input filled"
        placeholder="닉네임을 입력해주세요!"
        {...register("nickname")}
      />

      <button className="signup-submit" disabled={!isValid}>
        회원가입 완료
      </button>
    </form>
  );
};

export default NicknameStep;