// pages/consultations.js
import { useState } from 'react';
import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Box, Button, Container, Stack, SvgIcon, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { AgentsTable } from 'src/sections/agents/agents-table'
import PlusSmallIcon from '@heroicons/react/24/solid/PlusSmallIcon';
import { RegisterAgentDialog } from 'src/sections/agents/agents-register';

const Page = () => {
  const [openRegister, setOpen] = useState(false);
  const [reloadData, setReloadData] = useState(false);

  const handleDataChange = () => {
    setReloadData(!reloadData);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  

  return (
    <>
      <Head>
        <title>Agentes</title>
      </Head>
      <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4">
                Agentes
              </Typography>
            </Stack>
            <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    onClick={() => handleOpen(true)}
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <PlusSmallIcon />
                      </SvgIcon>
                    )}
                  >
                    Nuevo
                  </Button>                  
                </Stack>
                <AgentsTable key={reloadData} />
                <RegisterAgentDialog onDataAdded={handleDataChange} open={openRegister} onClose={handleClose} />
          </Stack>
        </Container>  
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;