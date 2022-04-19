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
    marginBottom: 40,
  },
});

const initialState = {
  email: "",
  password: "",
  showPassword: false,
};

const axios = require("axios");
export default function Login() {
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

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: state.email,
      password: state.password,
    };

    const errors = validate(state);

    if (Object.keys(errors).length === 0 && !isSubmit) {
      setIsSubmit(true);
      await axios
        .post("signin", data)
        .then((res) => {
          setIsSubmit(false);

          setState({
            email: "",
            password: "",
          });

          if (res.data.accessToken) {
            // JWT access token (expiration time of 1 hour)
            localStorage.setItem("tk", res.data.accessToken);
            setTimeout(() => {
              navigate("/review");
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
            Sign In
          </Typography>
        </div>

        <div style={{ color: "red", fontSize: "larger" }}>
          {errors && errors.data ? errors.data : ""}
        </div>

        <div
          style={{
            marginTop: "30px",
          }}
        >
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
      </Box>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        mt={2}
        mb={4}
        spacing={10}
      >
        <Link to="/signup" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Sign Up</Button>
        </Link>
        <Button variant="outlined" onClick={handleSubmit}>
          Login
        </Button>
      </Stack>
    </div>
  );
}
