/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { PiWarning } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";

import Button from "./layout/Button.tsx";

interface FormProps {
  onSubmit: (formData: FormData) => Promise<{message: string, error: boolean, technicalError?: boolean, location?: string, field?: string, issue?: string}>;
  children: React.ReactNode;
  classname?: string;
  buttonAction: string | React.ReactNode;
  disabled: boolean;
  styles?: {[error: string]: string};
}

const Form = ({ onSubmit, children, classname = "", buttonAction, disabled, styles }: FormProps) => {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await onSubmit(new FormData(e.currentTarget));
      if (result.technicalError === true) {
        console.log("Resposta da Api: ", result.message);
        setMessage("Ocorreu um erro!, tente novamente mais tarde.");
        setError("error");
        return;
      }
      setMessage(result?.message || "Operação realizada com sucesso");
      setError(result?.error === true ? "error" : "sucess");
      if (!error) {
        if (result.location) {
          navigate(result.location);
        }; 
      }
    } catch (error) {
      setMessage("Ocorreu um erro no servidor!, tente novamente mais tarde.");
      console.error("Erro no formulário: ", error);
    } finally {
      setLoading(false);
      // setTimeout(() => {
      //   setMessage("");
      // }, 5000);
    };
  };

  return (
    <form onSubmit={handleSubmit} className={classname}>
      {message && <p className={styles ? styles[error] : error}>{error ? <PiWarning /> : ""} {message}</p>}
      {children}
      <Button className="button-form" type="submit" nameAction={loading ? 
      <RingLoader
        className="loader"
        size={27}
        aria-label="Loading Spinner"
      /> : buttonAction} disabled={disabled}/>
    </form>
  );
};

export default Form