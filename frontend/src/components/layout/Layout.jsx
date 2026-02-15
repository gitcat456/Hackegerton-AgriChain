import { useState } from 'react';
import { Box, CssBaseline, Toolbar, Snackbar, Alert } from '@mui/material';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 260;

const Layout = () => {
    const { user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            <Navbar onMenuClick={handleDrawerToggle} />

            {user && (
                <Sidebar
                    mobileOpen={mobileOpen}
                    handleDrawerToggle={handleDrawerToggle}
                />
            )}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - ${user ? drawerWidth : 0}px)` },
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <Toolbar sx={{ height: 70 }} />
                <Box
                    sx={{
                        flex: 1,
                        p: { xs: 2, sm: 3, md: 4 },
                        maxWidth: '1600px',
                        width: '100%',
                        mx: 'auto',
                    }}
                >
                    <Outlet context={{ showSnackbar }} />
                </Box>
            </Box>

            {/* Global Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Layout;
