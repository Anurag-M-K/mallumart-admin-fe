import React from 'react';
import { FieldRenderProps } from 'react-final-form';

interface WrappedInputProps extends FieldRenderProps<string, HTMLElement> {
  label: string;
  placeholder?: string;
  type?: string;
}

const WrappedInput: React.FC<WrappedInputProps> = ({type,...props}) => {
  return (
    <div>
      <label className='text-black'>{props.label}</label>
      <div className="relative text-white-dark">
        <input
          {...props.input}
          type={props.input.type}
          placeholder={props.placeholder}
          className="form-input  placeholder:text-white-dark"
          value={props.input.value} // Display initial value
        />
      </div>
      {props.meta.error && props.meta.touched && <span className="text-red-500">{props.meta.error}</span>}
    </div>
  );
};

export default WrappedInput;



