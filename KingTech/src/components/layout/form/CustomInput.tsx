import React from 'react';

import type { UseFormRegisterReturn } from 'react-hook-form';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    errorZod: string | undefined;
    errorApi?: string | undefined;
    register?: UseFormRegisterReturn;
    errorHookForm?: {message?: string | undefined};
    children?: React.JSX.Element | React.JSX.Element[];
    hasInput?: boolean;
}

const CustomInput = ({errorZod, errorApi, errorHookForm, register, children, hasInput, ...props}: CustomInputProps) => {
  const hasError = !!(errorHookForm?.message || errorZod || errorApi);
  const errorMessage = errorHookForm?.message ? errorHookForm.message : errorZod || errorApi;
  const shouldShowInput = hasInput ?? !children;

  return (
    <div className='input_container'>
        {children}
        {shouldShowInput && <input className={`${props.className || ''} ${hasError ? "error" : ""}`} {...register} {...props}/>}
        {hasError && <span className='error_message'>{errorMessage}</span>}
    </div>
  )
}

export default CustomInput