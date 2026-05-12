// src/pages/SignupPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailStep from "../components/signup/EmailStep";
import PasswordStep from "../components/signup/PasswordStep";
import NicknameStep from "../components/signup/NicknameStep";
import useLocalStorage from "../hooks/useLocalStorage";
import { signup } from "../api/auth";
import "../styles/SignupPage.css";

import type {
  NicknameFormData,
  PasswordFormData,
  SignupData,
} from "../schemas/signupSchema";

const initialSignupData: Partial<SignupData> = {
  email: "",
  password: "",
  passwordConfirm: "",
  nickname: "",
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [, setUser] = useLocalStorage<SignupData | null>("signupUser", null);

  const [step, setStep] = useState(1);
  const [signupData, setSignupData] =
    useState<Partial<SignupData>>(initialSignupData);

  const handleEmailNext = (email: string) => {
    setSignupData((prev) => ({ ...prev, email }));
    setStep(2);
  };

  const handlePasswordNext = (data: PasswordFormData) => {
    setSignupData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleComplete = async (data: NicknameFormData) => {
    const finalData = {
      ...signupData,
      ...data,
    } as SignupData;

    try {
      await signup({
        email: finalData.email,
        password: finalData.password,
        name: finalData.nickname,
      });

      setUser(finalData);
      alert("회원가입이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 처음부터 다시 시도해주세요.");

      setUser(null);
      setSignupData(initialSignupData);
      setStep(1);
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-box">
        <div className="signup-title-row">
          <button
            type="button"
            className="signup-back"
            onClick={() => {
              if (step === 1) navigate(-1);
              else setStep((prev) => prev - 1);
            }}
          >
            ‹
          </button>
          <h1>회원가입</h1>
        </div>

        {step === 1 && (
          <EmailStep
            defaultEmail={signupData.email ?? ""}
            onNext={handleEmailNext}
          />
        )}

        {step === 2 && (
          <PasswordStep
            email={signupData.email ?? ""}
            onNext={handlePasswordNext}
          />
        )}

        {step === 3 && <NicknameStep onComplete={handleComplete} />}
      </section>
    </main>
  );
};

export default SignupPage;