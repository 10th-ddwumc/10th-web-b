import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
    initialValues: T; 
    validate: (values: T) => Record<keyof T, string>; 
    // 값이 올바른지 검증
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
    const [values, setValues] = useState(initialValues)
    const [touched, setTouched] = useState<Record<string, boolean>>({}); 
    const [errors, setErrors] = useState<Record<string, string>>({}); 

    // 입력값 바꿀 때
    const handleChange = (name: keyof T, text: string) => {
        setValues({
            ...values, 
            [name]: text
        });
    };

    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true, 
        });
    };

    //이ㅔㅁ일 패스워드 속성들 가져옴
    const getInputProps = (name: keyof T) => {
        const value = values[name]; 
        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            handleChange(name, e.target.value); 

        const onBlur = () => handleBlur(name); 

        return {
            value,
            onChange,
            onBlur,
        };
    }
    
    // values가 변할 때마다 에러 검증 로직 실행
    useEffect(() => {
        const newErrors = validate(values); 
        setErrors(newErrors);

    }, [values, validate])

    return { values, errors, touched, getInputProps };

}

export default useForm;