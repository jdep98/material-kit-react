import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import jwt_decode from 'jwt-decode';

export const AccountProfile = () => {
  const token = window.sessionStorage.getItem('token');
  let user = null;

  if (token) {
    try {
      user = jwt_decode(token);      
    } catch (error) {
      console.error('Error decoding the token:', error);
    }
  }

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {user.firstName} {user.lastName}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.role}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          variant="text"
        >
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};
