import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Form from "../../components/Form";
import Select from "../../components/layout/form/Select";
import { useState } from "react";
import validateData from "../../utils/validateData";
import { GoInfo } from "react-icons/go";
import "../../style/pages/registro.css";

const Registro = () => {
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const options = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "binary", label: "Binário" },
    { value: "non-binary", label: "Não-Binário" },
    { value: "outros", label: "Outros" },
  ];

  const { register, verify } = useAuth();

  const handleDataChange = (e) => {
    const input = e.target.value;

    const numbersOnly = input.replace(/[^\d]/g, "");

    let formattedDate = "";
    if (numbersOnly.length > 0) {
      formattedDate = numbersOnly.slice(0, 2);
      if (numbersOnly.length >= 3) {
        formattedDate += "/" + numbersOnly.slice(2, 4);

        if (numbersOnly.length >= 5) {
          formattedDate += "/" + numbersOnly.slice(4, 8);
        }
      }
    }

    setDate(formattedDate);
  };

  const handleRegister = async (formData) => {
    const full_name = formData.get("full_name");
    const date_birth = formData.get("date_birth");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirm_password = formData.get("password_confirm");

    const userData = {
      full_name,
      gender,
      date_birth,
      email,
      password
    }

    console.log("Dados sendo enviados: ", userData);

    const validation = await validateData(userData.full_name, userData.gender, userData.date_birth, userData.email, userData.password, confirm_password);

    if (validation !== true) {
      setDisabled(false);
      return validation;
    }

    const result = await register(userData);

    if (!result.error) {
      setDisabled(true);
    } else {
      setDisabled(false);
    };

    return result;
  };

  const handleConfirm = async (formData) => {
    const code = formData.get("code");

    console.log("Código de confirmação sendo analisado!");

    const result = await verify(code);

    return result;
  };

  return (
    <>
      <h2>Cadastrar conta</h2>
      <section className="registro">
        <Form
          onSubmit={handleRegister}
          buttonAction="Continuar"
          classname="registro-form"
          disabled={disabled}
        >
          <input
            type="text"
            name="full_name"
            id="fullname_user"
            placeholder="Nome Completo"
            required
          />
          <Select
            id="gender"
            options={options}
            nameDefault="Gênero"
            onChange={setGender}
          />
          <input
            type="text"
            name="date_birth"
            id="birth_user"
            placeholder="Data de nascimento"
            maxLength="10"
            value={date}
            required
            onChange={handleDataChange}
            onKeyDown={(e) => {
              if (!/[0-9]|Tab|Backspace|Delete|Arrow/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <input
            type="email"
            name="email"
            id="email_user"
            placeholder="E-mail"
            maxLength="255"
            required
          />
          <input
            type="password"
            name="password"
            id="pass"
            placeholder="Senha"
            minLength="8"
            maxLength="16"
            required
          />
          <span className="info" onClick={() => setShowModal(true)}><GoInfo /></span>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content" onClick={() => setShowModal(false)}>
                <h3>Requisitos para a senha:</h3>
                <ul>
                  <li>É recomendado que a sua senha deva ter números e simbolos</li>
                  <li>É recomendado ter letras maiúsculas e minúsculas</li>
                  <li>não coloque informações pessoais!</li>
                  <li>Nunca compartilhe a sua senha!</li>
                  <li>Não use a mesma senha em outros sites!</li>
                </ul>
                <button onClick={() => setShowModal(false)}>Fechar</button>
              </div>
            </div>
          )}
          <input
            type="password"
            name="password_confirm"
            id="confirm_pass"
            placeholder="Confirmar senha"
            minLength="8"
            maxLength="16"
            required
          />
        </Form>
        <p>
          Já tem uma conta? <Link to="/account/login">Faça Login</Link>
        </p>
        <Form onSubmit={handleConfirm} buttonAction="Confirmar" classname={disabled ? "confirm-form" : "hidden"}>
            <h2>código de confirmação</h2>
            <input 
              type="text"
              name="code"
              id="code_confirm"
              onKeyDown={(e) => {
                if (!/[0-9]|Tab|Backspace|Delete|Arrow/.test(e.key)) {
                  e.preventDefault();
                };
              }}
              maxLength="6"
              placeholder="Código de confirmação" 
              required
            />
        </Form>
      </section>
    </>
  );
};

export default Registro;
