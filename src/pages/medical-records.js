// pages/consultations.js
import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { MedicalConsultationsTable } from 'src/sections/medical-records/register-medical-table';
import { RegisterMedicalSearch } from 'src/sections/medical-records/register-medical-search';

const Page = () => {
  return (
    <>
      <Head>
        <title>Registros Médicos</title>
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
                Registros Médicos
              </Typography>
            </Stack>
            <RegisterMedicalSearch />
            <MedicalConsultationsTable />
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