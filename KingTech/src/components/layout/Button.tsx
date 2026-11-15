import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  nameAction: string | React.ReactNode;
  icon?: React.ReactNode;
}

const Button = ({ nameAction, icon, ...props}: ButtonProps) => {
  return (
    <button {...props}>{nameAction} {icon}</button>
  );
};

export default Button