import { useState } from "react";
import { Link } from "react-router-dom";
import { TbEye, TbEyeOff } from "react-icons/tb";

import { validateDataLogin } from "@/utils/validateData";

import { useAuth } from "@/context/useAuth";

import type { LoginFields } from "@/types/api";

import CustomInput from "@/components/layout/form/CustomInput";
import Form from "@/components/Form";

import styles from "@/style/pages/auth/Login.module.css";

interface LoginProfile {
  email: string;
  password: string;
}

type FormErrors = Partial<Record<keyof LoginProfile, string>>;

const Login = () => {
  const { login } = useAuth();
  const [disabled, setDisabled] = useState(false);
  const [errorZod, setErrorZod] = useState<FormErrors>({});
  const [errorApi, setErrorApi] = useState<FormErrors>({});
  const [displayPass, setDisplayPass] = useState<boolean>(false);

  const handleLogin = async (formData: FormData) => {
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const userData = {
      email,
      password
    }

    const validation = await validateDataLogin(userData);

    if (typeof validation === "object") {
      setDisabled(false);
      setErrorZod({
        [validation.field]: validation.message || "campo inválido"
      });
      return validation;
    }

    const result = await login(userData);

    if (!result.error) {
      setDisabled(true);
      setErrorZod({});
      setErrorApi({});
    } else {
      setDisabled(false);
      const fieldApi = result.field as LoginFields;
      setErrorApi({
        [fieldApi]: result.message || "Ocorreu um erro, tente novamente mais tarde"
      })
    };

    return result;
  }

  return (
    <>
      <h2>Login</h2>
      <section className={styles.login}>
        <Form
          onSubmit={handleLogin}
          classname={styles.login_form}
          buttonAction="Entrar"
          disabled={disabled}
        >
          <CustomInput 
            type="email"
            name="email"
            id="email_user"
            errorZod={errorZod.email}
            errorApi={errorApi.email}
            placeholder="E-mail"
            required
          />
          <CustomInput 
            type={displayPass ? `text` : `password`}
            name="password"
            className="input_password"
            id="pass"
            errorZod={errorZod.password}
            errorApi={errorApi.email}
            hasInput={true}
            placeholder="Senha"
            required
          >
            <button type="button" onClick={() => setDisplayPass((prev) => !prev)}>
              {displayPass ? <TbEye /> : <TbEyeOff />}
            </button>
          </CustomInput>
        </Form>
        <div>
          <p>Não tem uma conta? <Link to="/account/register">Registra-se</Link></p>
          <p><Link to={"/"}>Esqueceu a senha?</Link></p>
        </div>
      </section>
    </>
  );
};

export default Login