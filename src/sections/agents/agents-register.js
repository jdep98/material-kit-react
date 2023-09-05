import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

export const RegisterAgentDialog = ({ onDataAdded, open, onClose }) => {
    const [formData, setFormData] = useState({
      tipoDocumento: '',
      numeroDocumento: '',
      nombre: '',
      email: '',
      telefono: ''
    });
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
    const handleSubmit = async () => {                  
      try {
        const url = process.env.NEXT_PUBLIC_URL_HOST+'/new-agents'; 
        const token = window.sessionStorage.getItem('token');

        const body = {
          "tipo_documento": formData.tipoDocumento,
          "numero_documento": formData.numeroDocumento,
          "nombre": formData.nombre,
          "email": formData.email,
          "telefono": formData.telefono
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type':'application/json'
        }

        const response = await axios.post(url, body, {headers})

        if(response.status === 201){
          onDataAdded();
          Swal.fire({            
            icon: 'success',
            title: response.data.message,
            showConfirmButton: false,
            timer: 2500
          })
        }
              
      } catch (error) {
        console.log(error.status === 400)   
        Swal.fire({            
          icon: 'error',
          title: 'El documento ya está registrado',
          showConfirmButton: false,
          timer: 2500
        })     
      }
      onClose(); // Cierra el diálogo después de guardar
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Agregar nuevo agente</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tipo Documento"
            margin="normal"
            variant="outlined"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Número de documento"
            margin="normal"
            variant="outlined"
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={handleChange}
          />
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
  
  