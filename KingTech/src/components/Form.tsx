/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";

import { useAuth } from "@/context/useAuth";

import Button from "./layout/Button";

interface FormProps {
  onSubmit: (formData: FormData) => Promise<{message: string, error: boolean, technicalError?: boolean, location?: string, field?: string, issue?: string}>;
  children: React.ReactNode;
  classname?: string;
  buttonAction: string | React.ReactNode;
  disabled: boolean;
}

const Form = ({ onSubmit, children, classname = "", buttonAction, disabled }: FormProps) => {

  const [loading, setLoading] = useState(false);
  const { setGlobalMessage } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setGlobalMessage("");

    try {
      const result = await onSubmit(new FormData(e.currentTarget));
      if (result.technicalError === true) {
        console.log("Resposta da Api: ", result.message);
        setGlobalMessage("Ocorreu um erro!, tente novamente mais tarde.");
        return;
      }
      setGlobalMessage(result?.message || "Operação realizada com sucesso");
      if (!result.error && result.location) {
        navigate(result.location);
      }
    } catch (error) {
      setGlobalMessage("Ocorreu um erro no servidor!, tente novamente mais tarde.");
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
      {children}
      <Button className="button-form" type="submit" nameAction={loading ? 
      <RingLoader
        className="loader"
        color="var(--loader-color)"
        size={27}
        aria-label="Loading Spinner"
      /> : buttonAction} disabled={disabled}/>
    </form>
  );
};

export default Form