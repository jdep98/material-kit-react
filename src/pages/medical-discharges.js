// pages/consultations.js
import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { MedicalDischargesTable } from 'src/sections/medical-discharges/medical-discharges-table';

const Page = () => {
  return (
    <>
      <Head>
        <title>Altas Médicas</title>
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
                Altas Médicas
              </Typography>
            </Stack>
            <MedicalDischargesTable />
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