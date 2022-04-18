// @ts-nocheck
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Stack,
  Box,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    marginTop: 140,
  },
});

const initialState = {
  email: "",
  password: "",
  password_confirm: "",
  showPassword: false,
  showPasswordConfirm: false,
};

const axios = require("axios");
export default function SignUp() {
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const classe = useStyles();

  const handleChange = (event) => {
    const { name, value } = event.target;

    const newState = {
      ...state,
      [name]: value,
    };

    setState(newState);
    setErrors(validate(newState));
  };

  const handleClickShowPassword = () => {
    const stateShowPassord = {
      ...state,
      showPassword: !state.showPassword,
    };

    setState(stateShowPassord);
  };

  const handlePasswordConfirm = () => {
    const passwordConfirm = {
      ...state,
      showPasswordConfirm: !state.showPasswordConfirm,
    };

    setState(passwordConfirm);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  const handleSignUp = (event) => {
    event.preventDefault();

    const data = {
      email: state.email,
      password: state.password,
      password_confirm: state.password_confirm,
    };

    const errors = validate(state);

    if (Object.keys(errors).length === 0 && !isSubmit) {
      setIsSubmit(true);
      axios
        .post("http://localhost:3001/signup", data)
        .then((res) => {
          setIsSubmit(false);

          setState({
            email: "",
            password: "",
            password_confirm: "",
          });

          // Status Code: 201 Created
          if (res.data.accessToken) {
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        })
        .catch((err) => {
          setErrors(err.response);
          setIsSubmit(false);
        });
    }
  };

  const validate = (newValue) => {
    const errors = {};

    if (!newValue.email) {
      errors.email = "Email is Required!";
    }
    if (!newValue.password) {
      errors.password = "Password is Required!";
    }

    if (!newValue.password_confirm) {
      errors.password_confirm = "Password is Required!";
    }

    if (newValue.password && newValue.password_confirm) {
      if (newValue.password !== newValue.password_confirm) {
        errors.password_confirm = "Password don't match!";
      }
    }

    return errors;
  };

  return (
    <div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 2, width: "30ch" },
        }}
        noValidate
        autoComplete="on"
      >
        <div className={classe.table}>
          <Typography variant="h5" component="div">
            Sign Up
          </Typography>
        </div>
        <div>
          <TextField
            id="outlined-title"
            label="Email"
            placeholder="Email"
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email : ""}
            name="email"
            value={state.email}
            onChange={handleChange}
            required
            focused
          />
        </div>
        <div>
          <TextField
            id="filled-password"
            label="Password"
            type={state.showPassword ? "text" : "password"}
            value={state.password}
            placeholder="Password"
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password : ""}
            name="password"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
            focused
          />
        </div>
        <div>
          <TextField
            id="filled-passwordConfirm"
            label="Password Confirmation"
            type={state.showPasswordConfirm ? "text" : "password"}
            value={state.password_confirm}
            placeholder="Password Confirmation"
            error={errors.password_confirm ? true : false}
            helperText={errors.password_confirm ? errors.password_confirm : ""}
            name="password_confirm"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handlePasswordConfirm}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {state.showPasswordConfirm ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
            focused
          />
        </div>
      </Box>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        mt={2}
        mb={4}
        spacing={10}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="outlined" color="error">
            Cancel
          </Button>
        </Link>
        <Button variant="outlined" onClick={handleSignUp}>
          SignUp
        </Button>
      </Stack>
    </div>
  );
}
