const validateName = async (full_name) => {
    const regexName = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

    if (typeof full_name !== "string") {
        return {
            field: "full_name",
            issue: "ERROR_TYPE_VALUE",
            message: "O valor do campo (nome completo) tem que ser do tipo string!",
            technicalError: true
        };
    };

    if (!full_name || full_name.trim() === "") {
        return {
            field: "full_name",
            issue: "ERROR_EMPTY_INPUT",
            message: "o campo (nome completo) não pode estar vazio!",
            technicalError: true
        };
    };

    if (full_name.length < 3 || full_name.length > 255) {
        return {
            field: "full_name",
            issue: "ERROR_SIZE_REQUIRED",
            message: "o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!",
            error: true
        };
    };

    if (/\s{3,}/.test(full_name)) {
        return {
            field: "full_name",
            issue: "ERROR_CONSECUTIVE_SPACE",
            message: "o campo (nome completo) não pode conter mais de dois espaços seguidos!",
            error: true
        };
    };

    if (!regexName.test(full_name)) {
        return {
            field: "full_name",
            issue: "ERROR_TYPE_DIGIT",
            message: "o campo (nome completo) não pode conter números e símbolos exceto '-",
            error: true
        };
    };

    return true;
};

const validateGender = async (gender) => {
    const validGenders = ["masculino", "feminino", "binary", "non-binary", "outros"];

    if (!gender) {
        return {
            field: "gender",
            issue: "ERROR_EMPTY_INPUT",
            message: "Informe um gênero!",
            error: true
        };
    };

    if (!validGenders.includes(gender)) {
        return {
            field: "gender",
            issue: "ERROR_VALID_GENDER",
            message: "o gênero informado não é válido!",
            technicalError: true
        };
    };

    return true;
};

const validateDateBirth = async (date_birth) => {
    const regexDate = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    if (!date_birth) {
        return {
            field: "date_birth",
            issue: "ERROR_EMPTY_INPUT",
            message: "o campo (data de nascimento) não pode estar vazio!",
            error: true
        };
    };

    if (date_birth.length < 10 || !regexDate.test(date_birth)) {
        return {
            field: "date_birth",
            issue: "ERROR_INVALID_DATE",
            message: "formato de data inválido!",
            error: true
        };
    };

    const [day, month, year] = date_birth.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);

    const validDate = (
        dateObj.getDate() === day && dateObj.getMonth() === month - 1 && dateObj.getFullYear() === year
    );

    const today = new Date();

    if (!validDate || dateObj > today) {
        return {
            field: "date_birth",
            issue: "ERROR_INVALID_DATE",
            message: "data inexistente!",
            error: true
        };
    };

    const minAge = 18;
    const age = today.getFullYear() - year;
    const hadBirthDayThisYear = (today.getMonth() > month - 1 || (today.getMonth() === month - 1 && today.getDate() >= day));
    const realAge = hadBirthDayThisYear ? age : age - 1;
    if (realAge < minAge) {
        return {
            field: "date_birth",
            issue: "ERROR_MIN_AGE",
            message: `é preciso ter a idade mínima de ${minAge} anos para comprar produtos nessa loja!`,
            error: true
        };
    };

    return true;
};

const validateEmail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!email) {
        return {
            field: "email",
            issue: "ERROR_EMPTY_INPUT",
            message: "o campo (email) não pode estar vazio!",
            error: true
        };
    };

    if (email.length > 255) {
        return {
            field: "email",
            issue: "ERROR_SIZE_REQUIRED",
            message: "o campo (email) precisa ter no máximo 255 caracteres!",
            error: true
        };
    };

    if (!emailRegex.test(email)) {
        return {
            field: "email",
            issue: "ERROR_EMAIL_FORMAT",
            message: "formato de e-mail inválido!",
            error: true
        };
    };

    return true;
};

const validatePassword = async (password, confirm_password) => {

    if (!password) {
        return {
            field: "password",
            issue: "ERROR_EMPTY_INPUT",
            message: "o campo (senha) não pode estar vazio!",
            error: true
        };
    };

    if (password.length < 8 || password.length > 15) {
        return {
            field: "password",
            issue: "ERROR_SIZE_REQUIRED",
            message: "o campo (senha) precisa ter no mínimo 8 caracteres e no máximo 15 caracteres!",
            error: true
        };
    };
    
    if (password.includes(" ")) {
        return {
            field: "password",
            issue: "ERROR_SPACE_BETWEEN",
            message: "não pode haver espaços entre os caracteres da senha!",
            error: true
        };
    };

    if (password !== confirm_password) {
        return {
            field: "confirm_password",
            issue: "ERROR_PASSWORD_MISMATCH",
            message: "senhas não coincidem! confirme a sua senha",
            error: true
        }
    }

    return true;
};

const validateData = async (full_name, gender, date_birth, email, password, confirm_password) => {

    const validations = await Promise.all([
        validateName(full_name),
        validateGender(gender),
        validateDateBirth(date_birth),
        validateEmail(email),
        validatePassword(password, confirm_password),
    ]); 

    const errors = validations.filter(v => v !== true);

    if (errors.length > 0) return errors[0];

    return true;
};

export default validateData