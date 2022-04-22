// @ts-nocheck
import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";

import {
  Typography,
  TextField,
  TableRow,
  TableHead,
  IconButton,
  TableContainer,
  ButtonGroup,
  Button,
  Paper,
  Tooltip,
  TableCell,
  tableCellClasses,
  styled,
  Stack,
  Modal,
  Table,
  Box,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import QRCode from "qrcode";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

const useStyles = makeStyles({
  table: {
    marginTop: 20,
  },
});

const StyledTable = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.white,
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 26,
  pt: 2,
  px: 4,
  pb: 3,
};

const axios = require("axios");

export default function ReadDoc() {
  const [documentData, setDocumentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [value, setValue] = useState();
  const [name, setName] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const navigate = useNavigate();
  const useStyle = useStyles();

  const handleOpen = (id) => {
    setOpen(true);
    setItemId(id);
  };

  const handleClose = (params) => {
    setOpen(false);
  };

  const reload = (params) => {
    window.location.reload();
  };

  const handleDelete = (event, id) => {
    event.preventDefault();

    axios
      .delete(`documents/${id}`)
      .then((res) => {
        handleClose();
        reload();
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  const renderEditButton = (params) => {
    return (
      <div>
        <ButtonGroup
          key={params.id}
          variant="outlined"
          aria-label="outlined button group"
        >
          <Link to={`/update/${params.id}`} style={{ textDecoration: "none" }}>
            <Button color="primary" style={{ marginRight: "6px" }}>
              Edit
            </Button>
          </Link>
          <Button
            color="secondary"
            onClick={() => handleOpen(params.id)}
            style={{ marginRight: "6px" }}
          >
            Delete
          </Button>

          <Modal
            hideBackdrop
            open={open}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box sx={{ ...style, width: 300 }}>
              <h3>Are you sure you want to delete ?</h3>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                mt={8}
                spacing={4}
              >
                <Button variant="outlined" onClick={handleClose} color="error">
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={(e) => handleDelete(e, itemId)}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </Modal>
        </ButtonGroup>
      </div>
    );
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      sortable: false,
      flex: 1,
      disableColumnSelector: true,
    },
    { field: "author", headerName: "Author", sortable: false, flex: 1 },
    {
      field: "upload_date",
      headerName: "Upload Date",
      sortable: false,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      sortable: false,
      flex: 1,
    },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      disableExport: true,
      renderCell: renderEditButton,
      disableClickEventBubbling: true,
    },
  ];

  const loadDocuments = async (params) => {
    await axios
      .get("documents")
      .then((res) => {
        setDocumentData(res.data);
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  const getUsers = async () => {
    const headers = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tk")}`,
      },
    };

    await axios
      .get("660/users", headers)
      .then((res) => {
        setName(res.data);
      })
      .catch((err) => {
        if (
          err.response.data === "jwt expired" ||
          err.response.data === "jwt malformed"
        ) {
          navigate("/");
        }
      });
  };

  useEffect(() => {
    loadDocuments();
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = (params) => {
    localStorage.removeItem("tk");
  };

  const handleQRCode = async () => {
    console.log("Generate QRCode");
    // try {
    //   const res = await QRCode.toDataURL(value);
    //   console.log("res", res);
    //   setImageUrl(res);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport
          csvOptions={{ disableToolbarButton: true }}
          printOptions={{
            hideFooter: true,
            hideToolbar: true,
            hideHeader: true,
            fileName: "Generating_PDF",
          }}
        />
      </GridToolbarContainer>
    );
  }

  return (
    <div className={useStyle.table} style={{ height: 400, width: "100%" }}>
      <TableContainer component={Paper}>
        <Table
          className={useStyle.table}
          sx={{ minWidth: 800 }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTable align="right">
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined button group"
                >
                  {name[0] && name[0].email ? (
                    <Typography
                      style={{ color: "black", marginRight: "100px" }}
                      variant="h6"
                      component="div"
                    >
                      You are Authenticated, Welcome {name[0].email}
                    </Typography>
                  ) : (
                    <Typography
                      style={{ color: "black", marginRight: "100px" }}
                      variant="h6"
                      component="div"
                    >
                      You are Unauthenticated!
                    </Typography>
                  )}

                  <Link to="/" style={{ textDecoration: "none" }}>
                    <Button
                      onClick={logout}
                      color="primary"
                      style={{ marginRight: "6px" }}
                    >
                      Logout
                    </Button>
                  </Link>
                </ButtonGroup>
              </StyledTable>
            </TableRow>
            <TableRow>
              <StyledTable align="right">
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined button group"
                >
                  <Link to="/add" style={{ textDecoration: "none" }}>
                    <Button color="primary" style={{ marginRight: "6px" }}>
                      Add
                    </Button>
                  </Link>
                  {/* <div>
                    <TextField
                      id="outlined-QrCode"
                      placeholder="Value of Qr-code"
                      name="qrcode"
                      onChange={(e) => setValue(e.target.value)}
                      required
                      focused
                    />
                  </div> */}
                  <Tooltip title="Generate QRCode">
                    <IconButton onClick={handleQRCode}>
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              </StyledTable>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <DataGrid
        pageSize={10}
        rows={documentData}
        columns={columns}
        disableColumnFilter={true}
        disableDensitySelector={true}
        components={{ Toolbar: CustomToolbar }}
      />

      <div style={{ padding: "20px", marginTop: "16px" }}>
        {imageUrl && (
          <a href={imageUrl} download="qr_code">
            <img src={imageUrl} alt="qr_code" />
          </a>
        )}
      </div>
    </div>
  );
}
