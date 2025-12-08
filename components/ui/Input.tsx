"use client";

import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Input = (props: Props) => {
  const { label, ...rest } = props;

  return (
    <div className="flex flex-col mb-2">
      {label && <label className="mb-1 font-regular text-gray-700">{label}</label>}
      <input
        {...rest}
        className="w-full border border-gray-300 rounded-xl p-4
                   focus:outline-none 
                   focus:ring-1
                   focus:ring-(--primary)  
                   focus:ring-opacity-50 
                   focus:border-(--primary)
                   transition duration-150"
      />
    </div>
  );
};

export default Input;