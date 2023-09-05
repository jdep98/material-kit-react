import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export const UpdateAgentDialog = ({ open, onClose, dataUser, onUpdated }) => {
    const {id, nombre, telefono, email} = dataUser

    const [formData, setFormData] = useState({
      nombre: nombre,
      email: email,
      telefono: telefono
    });

    // Actualizar el estado cuando dataUser cambie
    useEffect(() => {
      setFormData({
        nombre: dataUser.nombre || '',
        email: dataUser.email || '',
        telefono: dataUser.telefono || ''
      });
    }, [dataUser]);
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
    const handleSubmit = async () => {            
      const url = process.env.NEXT_PUBLIC_URL_HOST+'/update-agents/'+id;
      const token = window.sessionStorage.getItem('token');

      const headers = {
        'Authorization': `Bearer ${token}`
      }
      const body = {
        "nombre": formData.nombre,
        "email": formData.email,
        "telefono": formData.telefono
      }

      const response = await axios.put(url, body, {headers})

      if(response.status === 200){
        Swal.fire(
          'Solicitud procesada',
          response.data.message,
          'success'
        )
        onUpdated()
      }
      
      onClose(); // Cierra el diálogo después de guardar
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Actualizar agente</DialogTitle>
        <DialogContent>          
          <TextField
            fullWidth
            label="Nombre"
            margin="normal"
            variant="outlined"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Teléfono"
            margin="normal"
            variant="outlined"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  