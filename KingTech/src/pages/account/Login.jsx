import { useState } from "react";
import Form from "../../components/Form";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import styles from "../../style/pages/auth/Login.module.css";

const Login = () => {
  const { login } = useAuth();
  const [disabled, setDisabled] = useState(false);

  const handleLogin = async (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    const userData = {
      email,
      password
    }

    const result = await login(userData);

    if (!result.error) {
      setDisabled(true);
    } else {
      setDisabled(false);
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
          styles={styles}
        >
          <input
            type="email"
            name="email"
            id="email_user"
            placeholder="E-mail"
            required
          />
          <input
            type="password"
            name="password"
            id="pass"
            placeholder="Senha"
            required
          />
        </Form>
        <div>
          <p>Não tem uma conta? <Link to="/account/register">Registra-se</Link></p>
          <p><Link>Esqueceu a senha?</Link></p>
        </div>
      </section>
    </>
  );
};

export default Login