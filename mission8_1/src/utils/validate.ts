export type UserSigninformaion = {
    email: string;
    password: string;
};

function validateUser(values: UserSigninformaion) {
    const errors = {
        email: '',
        password: '',
    }

    // 제미나이가 이런 거 잘 짜준다고 함
    if (!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(values.email,)) {
        errors.email = '이메일 형식이 올바르지 않습니다.'
    }

    if (!(values.password.length >= 8 && values.password.length <= 20)) {
        errors.password = '비밀번호는 8자 이상 20자 이하로 입력.'
    }
    return errors;
}

function validateSignin(values: UserSigninformaion) {
    return validateUser(values);
}

export { validateSignin };