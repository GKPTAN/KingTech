
const Button = ({type, nameAction, className, disabled, onClick, icon}) => {
  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick}>{nameAction} {icon}</button>
  );
};

export default Button