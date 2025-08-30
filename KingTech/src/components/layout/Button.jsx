
const Button = ({type, nameAction, className, disabled, onClick}) => {
  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick}>{nameAction}</button>
  );
};

export default Button