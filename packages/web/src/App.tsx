import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import Layout from './components/Layout';
import AppRoutes from './routes';

const globalStyles = {
  '*::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '*::-webkit-scrollbar-track': {
    background: '#1e1e1e',
  },
  '*::-webkit-scrollbar-thumb': {
    background: '#3f51b5',
    borderRadius: '4px',
  },
  '*::-webkit-scrollbar-thumb:hover': {
    background: '#757de8',
  },
  body: {
    backgroundColor: '#121212',
    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(63, 81, 181, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
    minHeight: '100vh',
  },
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;