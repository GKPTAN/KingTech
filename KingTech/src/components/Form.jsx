import { useState } from "react";
import { RingLoader } from "react-spinners";
import { PiWarning } from "react-icons/pi";
import Button from "./layout/Button";

const Form = ({ onSubmit, children, classname = "", buttonAction, disabled }) => {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await onSubmit(new FormData(e.target));
      if (result.technicalError === true) {
        console.log("Resposta da Api: ", result.message);
        setMessage("Ocorreu um erro!, tente novamente mais tarde.");
        setError("error");
        return;
      }
      if (result?.field === "email") {
        
      }
      setMessage(result?.message || "Operação realizada com sucesso");
      setError(result?.error === true ? "error" : "sucess");
    } catch (error) {
      setMessage("Ocorreu um erro no servidor!, tente novamente mais tarde.");
    } finally {
      setLoading(false);
      // setTimeout(() => {
      //   setMessage("");
      // }, 5000);
    };
  };

  return (
    <form onSubmit={handleSubmit} className={classname}>
      {message && <p className={error}>{error ? <PiWarning /> : ""} {message}</p>}
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