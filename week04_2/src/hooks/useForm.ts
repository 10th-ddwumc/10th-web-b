// src/hooks/useForm.ts
import { useState } from "react";

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

const validateLogin = (values: LoginValues): LoginErrors => {
  const errors: LoginErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (values.email.length > 0 && !emailRegex.test(values.email)) {
    errors.email = "올바른 이메일 형식을 입력해주세요.";
  }

  if (values.password.length > 0 && values.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다.";
  }

  return errors;
};

const useForm = (initialValues: LoginValues) => {
  const [values, setValues] = useState<LoginValues>(initialValues);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const errors = validateLogin(values);

  const isValid =
    values.email.length > 0 &&
    values.password.length >= 8 &&
    Object.keys(errors).length === 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  return {
    values,
    touched,
    errors,
    isValid,
    handleChange,
    handleBlur,
  };
};

export default useForm;