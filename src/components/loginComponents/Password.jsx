import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// This component is a password field that toggles the visibility of the password
const PasswordField = ({ value, onChange, label = "Password", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  // This function toggles the visibility of the password
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      margin="normal"
      required
      fullWidth
      name="password"
      label={label}
      type={showPassword ? 'text' : 'password'}
      id="password"
      autoComplete="current-password"
      value={value}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleTogglePasswordVisibility}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
      {...props}
    />
  );
};

export default PasswordField;