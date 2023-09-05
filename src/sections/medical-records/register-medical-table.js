import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, SvgIcon, ButtonGroup } from '@mui/material';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon'
import { ModalMedical } from './modal-medical';

export const MedicalConsultationsTable = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [reload, setReload] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = window.sessionStorage.getItem('token');
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_HOST+'/medical-consultion', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
        });
        if (response.status === 204) {
          setData([]);
        } else {
          setData(response.data.data);
        }        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

    const handleOpen = (selectedRow) => {
      setSelectedData(selectedRow);
      setOpen(true);
    };

  const handleClose = () => {
    setOpen(false);
    setSelectedData(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Tipo Documento</TableCell>
            <TableCell>Número Documento</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Agente</TableCell>
            <TableCell>Órden</TableCell>
            <TableCell>Acciones</TableCell>
            {/* Agrega más celdas de encabezado según tus campos */}
          </TableRow>
        </TableHead>
        <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{formatDate(row.fecha)}</TableCell>
              <TableCell>{row.tipo_documento}</TableCell>
              <TableCell>{row.numero_documento}</TableCell>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.apellido}</TableCell>
              <TableCell>{row.referido}</TableCell>
              <TableCell>{row.orden}</TableCell>
              <TableCell>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                  <Button onClick={() => handleOpen(row)}>
                    <SvgIcon fontSize="small">
                      <EyeIcon />
                    </SvgIcon>
                  </Button>                  
                </ButtonGroup>
              </TableCell>                              
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Detalles del Registro</DialogTitle>
        <DialogContent>
          <ModalMedical dataUser={selectedData} onClose={handleClose}/>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} color="primary">
            Cerrar
        </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};