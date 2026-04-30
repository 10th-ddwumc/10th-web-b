import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const emailSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요."),
});

const passwordSchema = z
  .object({
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
    passwordCheck: z.string().min(1, "비밀번호를 다시 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

const nicknameSchema = z.object({
  nickname: z.string().min(1, "닉네임을 입력해주세요."),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type NicknameFormValues = z.infer<typeof nicknameSchema>;

function SignUpPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [savedEmail, setSavedEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState<boolean>(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      passwordCheck: "",
    },
  });

  const nicknameForm = useForm<NicknameFormValues>({
    resolver: zodResolver(nicknameSchema),
    mode: "onChange",
    defaultValues: {
      nickname: "",
    },
  });

  const handleGoBack = () => {
    if (step === 3) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(1);
      return;
    }

    navigate(-1);
  };

  const handleLoginPage = () => {
    navigate("/login");
  };

  const handleEmailSubmit = (data: EmailFormValues) => {
    setSavedEmail(data.email);
    setStep(2);
  };

  const handlePasswordSubmit = () => {
    setStep(3);
  };

  const handleNicknameSubmit = (data: NicknameFormValues) => {
    const signupData = {
      email: savedEmail,
      password: passwordForm.getValues("password"),
      nickname: data.nickname,
    };

    localStorage.setItem("signupData", JSON.stringify(signupData));
    alert("회원가입 완료!");
    navigate("/");
  };

  return (
    <div className="login-page">
      <header className="top-bar">
        <div className="logo">돌려돌려LP판</div>

        <div className="top-buttons">
          <button type="button" className="top-btn login-btn" onClick={handleLoginPage}>
            로그인
          </button>
          <button type="button" className="top-btn signup-btn">
            회원가입
          </button>
        </div>
      </header>

      <main className="login-main">
        <div className="login-box">
          <button type="button" className="back-button" onClick={handleGoBack}>
            &lt;
          </button>

          <h2 className="login-title">회원가입</h2>

          {step === 1 && (
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
              <button type="button" className="google-button">
                <span className="google-icon">G</span>
                <span>구글 로그인</span>
              </button>

              <div className="divider">
                <div className="line"></div>
                <span>OR</span>
                <div className="line"></div>
              </div>

              <input
                type="email"
                placeholder="이메일을 입력해주세요!"
                className={`login-input ${
                  emailForm.formState.errors.email ? "input-error" : ""
                }`}
                {...emailForm.register("email")}
              />

              {emailForm.formState.errors.email && (
                <p className="error-text">
                  {emailForm.formState.errors.email.message}
                </p>
              )}

              <button
                type="submit"
                className={`submit-button ${
                  emailForm.formState.isValid ? "active-button" : ""
                }`}
                disabled={!emailForm.formState.isValid}
              >
                다음
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
              <div className="email-preview">✉ {savedEmail}</div>

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요!"
                  className={`login-input ${
                    passwordForm.formState.errors.password ? "input-error" : ""
                  }`}
                  {...passwordForm.register("password")}
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>

              {passwordForm.formState.errors.password && (
                <p className="error-text">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}

              <div className="password-input-wrapper">
                <input
                  type={showPasswordCheck ? "text" : "password"}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  className={`login-input ${
                    passwordForm.formState.errors.passwordCheck
                      ? "input-error"
                      : ""
                  }`}
                  {...passwordForm.register("passwordCheck")}
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPasswordCheck((prev) => !prev)}
                >
                  {showPasswordCheck ? "HIDE" : "SHOW"}
                </button>
              </div>

              {passwordForm.formState.errors.passwordCheck && (
                <p className="error-text">
                  {passwordForm.formState.errors.passwordCheck.message}
                </p>
              )}

              <button
                type="submit"
                className={`submit-button ${
                  passwordForm.formState.isValid ? "active-button" : ""
                }`}
                disabled={!passwordForm.formState.isValid}
              >
                다음
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={nicknameForm.handleSubmit(handleNicknameSubmit)}>
              <div className="profile-ui">
                <div className="profile-circle">
                  <div className="profile-head"></div>
                  <div className="profile-body"></div>
                </div>
              </div>

              <input
                type="text"
                placeholder="닉네임을 입력해주세요!"
                className={`login-input ${
                  nicknameForm.formState.errors.nickname ? "input-error" : ""
                }`}
                {...nicknameForm.register("nickname")}
              />

              {nicknameForm.formState.errors.nickname && (
                <p className="error-text">
                  {nicknameForm.formState.errors.nickname.message}
                </p>
              )}

              <button
                type="submit"
                className={`submit-button ${
                  nicknameForm.formState.isValid ? "active-button" : ""
                }`}
                disabled={!nicknameForm.formState.isValid}
              >
                회원가입 완료
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default SignUpPage;