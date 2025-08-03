
const Button = ({type, nameAction, className, disabled}) => {
  return (
    <button className={className} type={type} disabled={disabled}>{nameAction}</button>
  );
};

export default Button