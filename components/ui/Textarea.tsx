"use client";

import { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

const Textarea = (props: Props) => {
  const { label, className, ...rest } = props;

  const baseClasses = `w-full rounded-xl p-4
                       focus:outline-none 
                       focus:ring-1
                       focus:ring-[--primary]
                       focus:ring-opacity-50 
                       focus:border-[--primary]
                       transition duration-150
                       resize-none`; 

  const finalClasses = clsx(
    "border",
    "border-gray-300",
    baseClasses,
    className
  );
    
  return (
    <div className="flex flex-col mb-2">
      {label && <label className="mb-1 font-regular text-gray-700">{label}</label>}
      <textarea
        {...rest}
        className={finalClasses}
      />
    </div>
  );
};

export default Textarea;