
type Button = "button" | "submit" | "reset";

interface ButtonProps {
  type: Button;
  nameAction: string | React.ReactNode;
  className?: string;
  disabled: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const Button = ({type, nameAction, className, disabled, onClick, icon}: ButtonProps) => {
  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick}>{nameAction} {icon}</button>
  );
};

export default Button