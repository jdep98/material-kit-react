import { useState, useEffect } from 'react';
import axios from 'axios';
import sha512 from 'crypto-js/sha512';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from '@mui/material';
import Swal from 'sweetalert2';
import qs from 'qs'
import dayjs from 'dayjs';

export const ModalMedical = ({dataUser, onClose}) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true)   
    const [tokenDrOne, setTokenDrOne] = useState(null)

    const [userData, setUserData] = useState(dataUser || {
        id: "",
        fecha: "",
        tipo_documento: "",
        numero_documento: "",
        nombre: "",
        apellido: "",
        nacimiento: "",
        genero: "",
        telefono: "",
        email: "",
        ciudad: "",
        direccion: "",
        referido: "",
        orden: ""
    });        

    const url = process.env.NEXT_PUBLIC_URL_PAYVALIDA;  
    const merchant = process.env.NEXT_PUBLIC_MERCHANT;
    const fixedHash = process.env.NEXT_PUBLIC_FIXEDHASH;

    const checksumData = dataUser?.orden + merchant + fixedHash;
    const checksum = sha512(checksumData).toString();

    useEffect(() => {
        try {
            axios.get(url + dataUser?.orden || userData.orden, {
                params: {
                    merchant: merchant,
                    checksum: checksum
                }
            })
            .then(response => {
                setData(response.data)                
                setLoading(false)                
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
            
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }, [dataUser?.orden])

    useEffect(() => {
        const getUserDoctorOne = async () => {
          try {
            const url = process.env.NEXT_PUBLIC_URL_DOCTORONE+'/login';
            const user = process.env.NEXT_PUBLIC_USER_DOCTORONE;
            const pass = process.env.NEXT_PUBLIC_PASS_DOCTORONE;
    
            const body = {
              "email": user,
              "password": pass
            }
            const encodedBody = qs.stringify(body);
            const headers = {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
    
            const response = await axios.post(url, encodedBody,{headers})
            setTokenDrOne(response.data.access_token)
    
          } catch (error) {
            console.log(error)
          }
        };
    
        getUserDoctorOne()
      }, [])

    const handleMedicalDischargesAndDoctorOne = async () => {
        try {
            // Primera petición: handleMedicalDischarges
            const urlDischarges = process.env.NEXT_PUBLIC_URL_HOST + '/new-register';
            const token = sessionStorage.getItem('token');
    
            const bodyDischarges = {
                "fecha": dataUser?.fecha || userData.fecha,
                "tipo_documento": dataUser?.tipo_documento || userData.tipo_documento,
                "numero_documento": dataUser?.numero_documento || userData.numero_documento,
                "nombre": dataUser?.nombre || userData.nombre,
                "apellido": dataUser?.apellido || userData.apellido,
                "email": dataUser?.email || userData.email,
                "nacimiento": dataUser?.nacimiento || userData.nacimiento,
                "genero": dataUser?.genero || userData.genero,
                "telefono": dataUser?.telefono || userData.telefono,            
                "direccion": dataUser?.direccion || userData.direccion,
                "referido": dataUser?.referido || userData.referido         
            };
    
            const headersDischarges = {
                'Authorization': `Bearer ${token}`
            };
    
            const responseDischarges = await axios.post(urlDischarges, bodyDischarges, { headers: headersDischarges });                
    
            // Segunda petición: handleMedicalDoctorOne
            const dateFormated = dayjs(dataUser?.fecha).format('YYYY-MM-DD');
            const urlDoctorOne = process.env.NEXT_PUBLIC_URL_DOCTORONE + '/adhesiones';
            const bodyDoctorOne = [
                {
                    "patCep": dataUser?.ciudad,
                    "patNumberId": dataUser?.numero_documento,
                    "patName": dataUser?.nombre,
                    "patLastname": dataUser?.apellido,
                    "patEmail": dataUser?.email,
                    "patAaddress": dataUser?.direccion,
                    "patPhone": dataUser?.telefono,
                    "patBirthday": dataUser?.nacimiento,
                    "patSex": dataUser?.genero,
                    "patdateCreation": dateFormated,
                    "patNumberIdTitular": "0"
                }
            ];
    
            const headersDoctorOne = {
                'Authorization': `Bearer ${tokenDrOne}`
            };
    
            const responseDoctorOne = await axios.post(urlDoctorOne, bodyDoctorOne, { headers: headersDoctorOne });
            //console.log(responseDoctorOne.data);

            if (responseDischarges.status === 201 && responseDoctorOne.status === 200) {
                Swal.fire(
                    'Solicitud procesada',
                    responseDischarges.data.message,
                    'success'
                );
            }
    
            // Cerrar el modal al finalizar ambas peticiones
            onClose();
    
        } catch (error) {
            Swal.fire(
                'Error en la solicitud',
                error.response?.data?.message || 'Ocurrió un error inesperado',
                'error'
            );
            onClose();
        }
    }
    
    

  return(
    <>
        {loading ? <CircularProgress/> :
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>Propiedad</TableCell>
                    <TableCell>Valor</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                <TableRow>
                    <TableCell>Currency</TableCell>
                    <TableCell>{data.DATA?.CURRENCY}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{data.DATA?.EMAIL}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>ID Orden</TableCell>
                    <TableCell>{data.DATA?.ORDER}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Codigo</TableCell>
                    <TableCell>{data.DATA?.CODE}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Monto</TableCell>
                    <TableCell>{data.DATA?.AMOUNT}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Descricion</TableCell>
                    <TableCell>{data.DATA?.DESCRIPTION}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Referencia</TableCell>
                    <TableCell>{data.DATA?.REFERENCE}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Metodo de pago</TableCell>
                    <TableCell>{data.DATA?.PAYMNENT_METHOD}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>{data.DATA?.STATE}</TableCell>
                </TableRow>
                {
                    data.DATA.STATE == 'APROBADA' ?
                    <TableRow><TableCell>Acción</TableCell><TableCell><Button onClick={() => handleMedicalDischargesAndDoctorOne()} color="primary">Dar de alta</Button></TableCell></TableRow>
                    : null
                }
                </TableBody>
            </Table>
        </TableContainer>
        }
    </>
  );
}