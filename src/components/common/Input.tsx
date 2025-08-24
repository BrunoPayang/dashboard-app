import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error = false, 
  helperText, 
  required = false,
  ...props 
}) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      error={error}
      helperText={helperText}
      required={required}
      {...props}
    />
  );
};

export default Input;
