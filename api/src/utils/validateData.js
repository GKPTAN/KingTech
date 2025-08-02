const validateName = async (full_name) => {
    const regexName = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

    if (typeof full_name !== "string") {
        return {
            field: "full_name",
            issue: "ERROR_TYPE_VALUE",
            message: "O valor do campo (nome completo) tem que ser do tipo string!"
        };
    };

    if (!full_name || full_name.trim() === "") {
        return {
            field: "full_name",
            issue: "ERROR_EMPTY_INPUT",
            message: "o campo (nome completo) não pode estar vazio!"
        };
    };

    if (full_name.length < 3 || full_name.length > 255) {
        return {
            field: "full_name",
            issue: "ERROR_SIZE_REQUIRED",
            message: "o campo (nome completo) precisa ter no mínimo 3 caracteres e no máximo 255 caracteres!"
        };
    };

    if (/\s{3,}/.test(full_name)) {
        return {
            field: "full_name",
            issue: "ERROR_CONSECUTIVE_SPACE",
            message: "o campo (nome completo) não pode conter mais de dois espaços seguidos!"
        };
    };

    if (!regexName.test(full_name)) {
        return {
            field: "full_name",
            issue: "ERROR_TYPE_DIGIT",
            message: "o campo (nome completo) não pode conter números e símbolos exceto '-"
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
            message: "o campo (gender) não pode estar vazio!"
        };
    };

    if (!validGenders.includes(gender)) {
        return {
            field: "gender",
            issue: "ERROR_VALID_GENDER",
            message: "o gênero informado não é válido!"
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
            message: "o campo (data de nascimento) não pode estar vazio!"
        };
    };

    if (date_birth.length < 10 || !regexDate.test(date_birth)) {
        return {
            field: "date_birth",
            issue: "ERROR_INVALID_DATE",
            message: "formato de data inválido!"
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
            message: "data inexistente!"
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
            message: `é preciso ter a idade mínima de ${minAge} anos para comprar produtos nessa loja!`
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
            message: "o campo (email) não pode estar vazio!"
        };
    };

    if (email.length > 255) {
        return {
            field: "email",
            issue: "ERROR_SIZE_REQUIRED",
            message: "o campo (email) precisa ter no máximo 255 caracteres!"
        };
    };

    if (!emailRegex.test(email)) {
        return {
            field: "email",
            issue: "ERROR_EMAIL_FORMAT",
            message: "formato de e-mail inválido!"
        };
    };

    return true;
};

const validatePassword = async (password) => {

    if (!password) {
        return {
            field: "password",
            issue: "ERROR_EMPTY_INPUT",
            message: "o campo (senha) não pode estar vazio!"
        };
    };

    if (password.length < 8 || password.length > 15) {
        return {
            field: "password",
            issue: "ERROR_SIZE_REQUIRED",
            message: "o campo (senha) precisa ter no mínimo 8 caracteres e no máximo 15 caracteres!"
        };
    };
    
    if (password.includes(" ")) {
        return {
            field: "password",
            issue: "ERROR_SPACE_BETWEEN",
            message: "não pode haver espaços entre os caracteres da senha!"
        };
    };

    return true;
};

const validateData = async (full_name, gender, date_birth, email, password) => {

    const validations = await Promise.all([
        validateName(full_name),
        validateGender(gender),
        validateDateBirth(date_birth),
        validateEmail(email),
        validatePassword(password),
    ]); 

    const errors = validations.filter(v => v !== true);

    if (errors.length > 0) return errors[0];

    return true;
};

export default validateData