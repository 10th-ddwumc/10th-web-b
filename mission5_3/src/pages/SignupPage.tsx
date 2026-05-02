import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않습니다." }),
    password: z.string().min(8, { message: "비밀번호는 8자 이상으로 입력해주세요." }).max(20, { message: "비밀번호는 20자 이하로 입력해주세요." }),
    passwordCheck: z.string().min(8, { message: "비밀번호 확인은 8자 이상으로 입력해주세요." }).max(20, { message: "비밀번호 확인은 20자 이하로 입력해주세요." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." })
}).refine((data) => data.password === data.passwordCheck, { // 불일치 조건
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    path: ["passwordCheck"], 
})

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const navigate = useNavigate();
    // 단계별 입력을 위한 상태 (이메일,비밀번호, 닉네임)
    const [step, setStep] = useState(1);
    // 비밀번호 가시 상태 조정
    const [showPw, setShowPw] = useState(false);
    const [showPwCheck, setShowPwCheck] = useState(false);

    const { register, handleSubmit, watch, trigger, formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordCheck: '',
        },
        resolver: zodResolver(schema),
        mode: "onChange", // 실시간 버튼 유효성 여부
    })

    // 입력값 실시간 감지
    const emailValue = watch("email");
    const passwordValue = watch("password");
    const nameValue = watch("name");

    // 버튼 클릭시 유효성 검사 후 통과하면 다음 단계로
    const handleNextStep = async () => {
        let fieldToValidate: (keyof FormFields)[] = [];
        if (step === 1) fieldToValidate = ["email"];
        if (step === 2) fieldToValidate = ["password", "passwordCheck"];

        const isValid = await trigger(fieldToValidate);
        if (isValid) setStep(step + 1);
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { passwordCheck, ...rest } = data; 
            await postSignup(rest);
            alert("회원가입이 완료되었습니다!");
            navigate("/"); // 홈으로 이동
        } catch (error) {
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const getButtonStyle = (isDisabled: boolean) =>
        `w-full py-3 rounded-md text-lg font-medium transition-colors ${isDisabled
            ? "bg-gray-400 text-black cursor-not-allowed"
            : "bg-[#627550] text-black hover:opacity-90 cursor-pointer"
        }`;
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-[350px] bg-white p-10 rounded-2xl shadow-xl relative">
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="absolute left-5 top-10 text-black text-sm underline cursor-pointer"
                    >
                        이전
                    </button>
                )}

                <h2 className="text-black text-center text-2xl mb-8 font-bold">회원가입</h2>

                <div className="flex flex-col gap-6">
                    {step === 1 && (
                        <>
                            <div className="border-b border-gray-500 py-2">
                                <input
                                    {...register('email')}
                                    className="bg-transparent text-black w-full outline-none placeholder:text-gray-500"
                                    type="text"
                                    placeholder="이메일을 입력해주세요"
                                />
                            </div>
                            {errors.email && <div className="text-red-500 text-xs">{errors.email.message}</div>}

                            <button
                                type='button'
                                onClick={handleNextStep}
                                disabled={!!errors.email || !emailValue}
                                className={getButtonStyle(!!errors.email || !emailValue)}
                            >
                                다음
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="text-gray-400 text-sm mb-[-10px]">{emailValue}</div>

                            <div className="relative border-b border-gray-500 py-2">
                                <input
                                    {...register('password')}
                                    className="bg-transparent text-black w-full outline-none pr-10"
                                    type={showPw ? "text" : "password"}
                                    placeholder="비밀번호 (8자 이상)"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-0 top-2 text-xs text-gray-400"
                                >
                                    {showPw ? "숨기기" : "표시"}
                                </button>
                            </div>
                            {errors.password && <div className="text-red-500 text-xs">{errors.password.message}</div>}

                            <div className="relative border-b border-gray-500 py-2">
                                <input
                                    {...register('passwordCheck')}
                                    className="bg-transparent text-black w-full outline-none pr-10"
                                    type={showPwCheck ? "text" : "password"}
                                    placeholder="비밀번호 확인"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwCheck(!showPwCheck)}
                                    className="absolute right-0 top-2 text-xs text-gray-400"
                                >
                                    {showPwCheck ? "숨기기" : "표시"}
                                </button>
                            </div>
                            {errors.passwordCheck && <div className="text-red-500 text-xs">{errors.passwordCheck.message}</div>}

                            <button
                                type='button'
                                onClick={handleNextStep}
                                disabled={!!errors.password || !!errors.passwordCheck || !passwordValue}
                                className={getButtonStyle(!!errors.password || !!errors.passwordCheck || !passwordValue)}
                            >
                                다음
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                                <div className="w-12 h-12 bg-gray-500 rounded-full"></div>
                            </div>

                            <div className="w-full border-b border-gray-500 py-2">
                                <input
                                    {...register('name')}
                                    className="bg-transparent text-black w-full outline-none text-center"
                                    type="text"
                                    placeholder="사용하실 닉네임을 입력하세요"
                                />
                            </div>
                            {errors.name && <div className="text-red-500 text-xs">{errors.name.message}</div>}

                            <button
                                type='button'
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting || !nameValue}
                                className={getButtonStyle(isSubmitting || !nameValue)}
                            >
                                회원가입 완료
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SignupPage;