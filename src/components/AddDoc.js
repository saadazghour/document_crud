// @ts-nocheck
import React, { useState } from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DatePicker from "@material-ui/lab/DatePicker";
import { Link, useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    marginTop: 100,
  },
});

const initialState = {
  title: "",
  author: "",
  upload_date: new Date(),
  description: "",
};

const axios = require("axios");
export default function AddDoc() {
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedDate, handleDateChange] = useState(initialState.upload_date);

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

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      title: state.title,
      author: state.author,
      upload_date: moment(selectedDate).format("YYYY-MM-DD"),
      description: state.description,
    };

    const errors = validate(state);

    if (Object.keys(errors).length === 0 && !isSubmit) {
      setIsSubmit(true);
      axios
        .post("documents", data)
        .then((res) => {
          setIsSubmit(false);

          setState({
            title: "",
            author: "",
            upload_date: new Date(),
            description: "",
          });

          setTimeout(() => {
            navigate("/");
          }, 1000);
        })
        .catch((err) => {
          setErrors(err.response);
          setIsSubmit(false);
        });
    }
  };

  const validate = (newValue) => {
    const errors = {};

    if (!newValue.title) {
      errors.title = "Title is Required!";
    }
    if (!newValue.author) {
      errors.author = "Author is Required!";
    }
    if (!newValue.description) {
      errors.description = "Description is Required!";
    }
    if (!newValue.upload_date) {
      errors.upload_date = "Date is Required!";
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
          <TextField
            id="outlined-title"
            label="Title"
            placeholder="Title of Document "
            error={errors.title ? true : false}
            helperText={errors.title ? errors.title : ""}
            name="title"
            value={state.title}
            onChange={handleChange}
            required
            focused
          />
        </div>
        <div>
          <TextField
            id="outlined-author"
            label="Author"
            placeholder="Author of Document"
            error={errors.author ? true : false}
            helperText={errors.author ? errors.author : ""}
            name="author"
            value={state.author}
            onChange={handleChange}
            required
            focused
          />
        </div>

        <div>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date :"
              value={selectedDate}
              error={errors.upload_date ? true : false}
              helperText={errors.upload_date ? errors.upload_date : ""}
              onChange={handleDateChange}
              renderInput={(props) => <TextField {...props} />}
            />
          </LocalizationProvider>
        </div>
        <div>
          <TextField
            id="outlined-description"
            label="Description"
            placeholder="Description of Document"
            multiline
            error={errors.description ? true : false}
            helperText={errors.description ? errors.description : ""}
            name="description"
            rows={4}
            value={state.description}
            onChange={handleChange}
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
        spacing={8}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="outlined" color="error">
            Cancel
          </Button>
        </Link>
        <Button variant="outlined" onClick={handleSubmit}>
          Register
        </Button>
      </Stack>
    </div>
  );
}
