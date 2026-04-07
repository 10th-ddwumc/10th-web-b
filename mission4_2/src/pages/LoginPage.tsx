
import { validateSignin, type UserSigninformaion } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    const { values, errors, touched, getInputProps } = useForm<UserSigninformaion>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: validateSignin,
    });

    const handleSubmit = () => {
        console.log(values);
    }

    // 버튼 비활성화를 위한 로직
    const isDisabled =
        Object.values(errors || {}).some((error) => error && error.length > 0) || 
        Object.values(values).some((value) => value === ''); 

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="relative w-[300px] flex items-center justify-center mb-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute left-0 p-1 text-gray-500 hover:text-[#807bff] transition-colors cursor-pointer"
                    aria-label="뒤로 가기"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <div className="text-2xl font-bold mb-4">LOG IN</div>
            </div>
            <div className="flex flex-col gap-3">
                <input
                    name="email"
                    {...getInputProps('email')}

                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                        ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"email"}
                    placeholder={"이메일"}

                />

                {/* touched를 넣으면 클릭 한 번 한 뒤로 에러 페이지가 뜸 (이게 더 UX가 좋음) */}
                {errors?.email && touched?.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                <input
                    name="password"
                    {...getInputProps('password')}

                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                        ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : " border-gray-300"}`}
                    type={"password"}
                    placeholder={"비밀번호"}

                />
                {errors?.password && touched?.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                )}
                <button type='button' onClick={handleSubmit} disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400">
                    로그인
                </button>

            </div>
        </div>
    )
}

export default LoginPage;
