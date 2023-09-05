import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, IconButton, ButtonGroup, Button, SvgIcon} from '@mui/material';
import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon'
import TrashIcon from '@heroicons/react/24/solid/TrashIcon'
import { UpdateAgentDialog } from './agents-update';
import Swal from 'sweetalert2';


export const AgentsTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [reload, setReload] = useState(false); 
  const [dataUser, setDataUser] = useState({})

  //Función para consumir la lista de usuarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = window.sessionStorage.getItem('token');
        const response = await axios.get(process.env.NEXT_PUBLIC_URL_HOST+'/get-agents', {
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
    setReload(false);
  }, [reload]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //Función para actualizar el usuario
  const handleEdit = async (data) => {    
    setOpenUpdate(true);
    setDataUser(data)
  };
  
  //Función para eliminar el usuario
  const handleDelete = async (id) => {    
    Swal.fire({
      title: 'Eliminar Agente?',
      text: "Esta acción no se puede reversar",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = process.env.NEXT_PUBLIC_URL_HOST+'/delete-agents/'+id;
        const token = window.sessionStorage.getItem('token');

        const headers = {
          'Authorization': `Bearer ${token}`
        }

        axios.delete(url, {headers})
        .then((response) => {
          if(response.data.status === 200){
            Swal.fire(
              'Eliminado!',
              response.data.message,
              'success'
            )
          }
          setReload(true);
        }).catch((error) => {
          console.log(error)
        })        
      }
    })    
  };
  
  //Función para cerrar el modal
  const handleClose = () => {
    setOpenUpdate(false);
  };
  

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tipo Documento</TableCell>
            <TableCell>Número Documento</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Télefono</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Acciones</TableCell>            
          </TableRow>
        </TableHead>
        <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.tipo_documento}</TableCell>
              <TableCell>{row.numero_documento}</TableCell>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.telefono}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>                
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                  <Button onClick={() => handleEdit(row)}>
                    <SvgIcon fontSize="small">
                      <PencilSquareIcon />
                    </SvgIcon>
                  </Button>
                  <Button onClick={() => handleDelete(row.id)}>                      
                    <SvgIcon fontSize="small">
                      <TrashIcon />
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
      <UpdateAgentDialog open={openUpdate} onClose={handleClose} dataUser={dataUser} onUpdated={() => setReload(true)} />
    </TableContainer>
  );
};