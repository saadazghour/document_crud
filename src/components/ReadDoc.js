// @ts-nocheck
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ButtonGroup from "@mui/material/ButtonGroup";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
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

export default function ExportDefaultToolbar() {
  const [documentData, setDocumentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
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
      .delete(`http://localhost:3001/documents/${id}`)
      .then((res) => {
        handleClose();
        reload();
      })
      .catch((err) => {
        // console.log(err.response);
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

  const loadDocuments = (params) => {
    axios
      .get("http://localhost:3001/documents")
      .then((res) => {
        setDocumentData(res.data);
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handlePdf = (params) => {
    console.log("Pdf Generated!!");
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
              <StyledTable align="right"></StyledTable>
              <StyledTable align="right"></StyledTable>
              <StyledTable align="right"></StyledTable>
              <StyledTable align="right"></StyledTable>
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
                  <Tooltip title="Generate pdf">
                    <IconButton onClick={handlePdf}>
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
    </div>
  );
}
