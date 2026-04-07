import { useState } from "react";

type FormValues = {
  email: string;
  password: string;
};

type FormErrors = {
  email: string;
  password: string;
};

function useForm() {
  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  const validateEmail = (value: string) => {
    if (!value.includes("@") || !value.includes(".")) {
      return "올바른 이메일 형식을 입력해주세요.";
    }
    return "";
  };

  const validatePassword = (value: string) => {
    if (value.length < 6) {
      return "비밀번호는 최소 6자 이상이어야 합니다.";
    }
    return "";
  };

  const handleChange = (name: "email" | "password", value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    let errorMessage = "";

    if (name === "email") {
      if (value === "") {
        errorMessage = "";
      } else {
        errorMessage = validateEmail(value);
      }
    }

    if (name === "password") {
      if (value === "") {
        errorMessage = "";
      } else {
        errorMessage = validatePassword(value);
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const validateAll = () => {
    const emailError =
      values.email === "" ? "" : validateEmail(values.email);
    const passwordError =
      values.password === "" ? "" : validatePassword(values.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return emailError === "" && passwordError === "";
  };

  const isValid =
    values.email !== "" &&
    values.password !== "" &&
    validateEmail(values.email) === "" &&
    validatePassword(values.password) === "";

  return {
    values,
    errors,
    handleChange,
    validateAll,
    isValid,
  };
}

export default useForm;