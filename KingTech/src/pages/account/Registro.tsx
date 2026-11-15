import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GoInfo } from "react-icons/go";

import { validateDataRegister } from "@/utils/validateData";

import { useAuth } from "@/context/useAuth";

import type { UserDataRegister } from "@/types/userData";
import type { ErrorApiResponse } from "@/types/api";

import CustomInput from "@/components/layout/form/CustomInput";
import Form from "@/components/Form";
import Select from "@/components/layout/form/Select";

import styles from "@/style/pages/auth/Registro.module.css";

type gender = "masculino" | "feminino" | "binary" | "non-binary" | "outros";

type FormErrors = Partial<Record<keyof UserDataRegister | "confirm_password", string>>;
type ErrorApi = Partial<ErrorApiResponse>;

const Registro = () => {
  const [date, setDate] = useState("");
  const [gender, setGender] = useState<gender>("outros");
  const [disabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [registerConfirmed, setRegisterConfirmed] = useState(false);
  const [error, setError] = useState<FormErrors>({});
  const [errorApi, setErrorApi] = useState<ErrorApi>({});

  const options = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "binary", label: "Binário" },
    { value: "non-binary", label: "Não-Binário" },
    { value: "outros", label: "Outros" },
  ];

  const { register, verify } = useAuth();

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleRegister = async (formData: FormData) => {
    const full_name = String(formData.get("full_name"));
    const date_birth = String(formData.get("date_birth"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const confirm_password = String(formData.get("password_confirm"));

    setError({});

    const userData = {
      full_name,
      gender,
      date_birth,
      email,
      password
    }

    console.log("Dados sendo enviados: ", userData);

    const validation = await validateDataRegister(userData, confirm_password);

    if (typeof validation === "object") {
      setDisabled(false);
      setError({
        [validation.field]: validation.message || "campo inválido"
      });
      return validation;
    }

    setDisabled(true);

    const result = await register(userData);

    if (result.error) {
      setDisabled(false);
      console.log("Campo que deu erro: ", result.field)
      if (result.field === "email") {
        setErrorApi({
          field: result.field,
          message: result.message
        });
      } else if (result.field === "password") {
        setErrorApi({
          field: result.field,
          message: result.message
        })
      }
    } else {
      setDisabled(false);
      setRegisterConfirmed(true);
      setErrorApi({});
    };

    return result;
  };

  const handleConfirm = async (formData: FormData) => {
    const code = String(formData.get("code"));

    console.log("Código de confirmação sendo analisado!");

    setDisabled(true);

    const result = await verify(code);

    if (result.error) {
      setDisabled(false);
    } else {
      setDisabled(false);
      setRegisterConfirmed(false);
    }

    return result;
  };

  return (
    <>
      <h2 className={styles.titulo}>Cadastrar conta</h2>
      <section className={styles.registro}>
        <Form
          onSubmit={handleRegister}
          buttonAction="Continuar"
          classname={styles.registro_form}
          disabled={disabled || registerConfirmed} // disabled || registerConfirmed
        >
          <CustomInput 
            errorZod={error.full_name}
            className={styles.input_container}
            type="text"
            name="full_name"
            id="fullname_user"
            placeholder="Nome Completo"
            required
          />
          <CustomInput
            errorZod={error.gender}
          >
            <Select
              id="gender"
              options={options}
              nameDefault="Gênero"
              onChange={(v) => setGender(String(v) as gender)}
            />
          </CustomInput>

          <CustomInput 
            errorZod={error.date_birth}
            className={styles.input_container}
            type="text"
            name="date_birth"
            id="birth_user"
            placeholder="Data de nascimento"
            maxLength={10}
            value={date}
            onChange={handleDataChange}
            onKeyDown={(e) => {
              if (!/[0-9]|Tab|Backspace|Delete|Arrow/.test(e.key)) {
                e.preventDefault();
              }
            }}
            required
          />
          <CustomInput 
            errorZod={error.email}
            errorApi={errorApi.field === "email" ? errorApi.message : undefined}
            className={styles.input_container}
            type="email"
            name="email"
            id="email_user"
            placeholder="E-mail"
            maxLength={255}
            required
          />
          <CustomInput 
            errorZod={error.password}
            errorApi={errorApi.field === "password" ? errorApi.message : undefined}
            className={styles.input_container}
            type={!error.password && !error.confirm_password ? "password" : "text"}
            name="password"
            id="pass"
            placeholder="Senha"
            minLength={8}
            maxLength={16}
            required
          />
          <span className={styles.info} onClick={() => setShowModal(true)}><GoInfo /></span>
          {showModal && (
            <main className={styles.modal_overlay}>
              <article className={styles.modal_content} onClick={() => setShowModal(false)}>
                <h3>Requisitos para a senha:</h3>
                <ul>
                  <li>É recomendado que a sua senha deva ter números e simbolos</li>
                  <li>É recomendado ter letras maiúsculas e minúsculas</li>
                  <li>não coloque informações pessoais!</li>
                  <li>Nunca compartilhe a sua senha!</li>
                  <li>Não use a mesma senha em outros sites!</li>
                </ul>
                <button onClick={() => setShowModal(false)}>Fechar</button>
              </article>
            </main>
          )}
          <CustomInput 
            errorZod={error.confirm_password}
            className={styles.input_container}
            type={!error.confirm_password ? "password" : "text"}
            name="password_confirm"
            id="confirm_pass"
            placeholder="Confirmar Senha"
            minLength={8}
            maxLength={16}
            required
          />
        </Form>
        <p>
          Já tem uma conta? <Link to="/account/login">Faça Login</Link>
        </p>
        <Form onSubmit={handleConfirm} buttonAction="Confirmar" classname={registerConfirmed ? styles.confirm_form : styles.hidden} disabled={disabled}>
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
              maxLength={6}
              placeholder="Código de confirmação" 
              required
            />
        </Form>
      </section>
    </>
  );
};

export default Registro;
