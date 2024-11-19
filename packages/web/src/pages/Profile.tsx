import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const Profile: React.FC = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Avatar sx={{ width: 100, height: 100 }}>
              <PersonIcon sx={{ width: 60, height: 60 }} />
            </Avatar>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              defaultValue="John"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              defaultValue="Doe"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              defaultValue="john.doe@example.com"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Currency"
              variant="outlined"
              defaultValue="USD"
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
