import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Badge,
    Divider,
    ListItemIcon,
    ListItemText,
    Chip,
    useMediaQuery,
    useTheme,
    Button
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications,
    AccountBalanceWallet,
    Person,
    Settings,
    Logout,
    ShoppingCart,
    Spa
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user, role, logout } = useAuth();
    const { balance } = useWallet();
    const { items } = useCart();

    const [anchorEl, setAnchorEl] = useState(null);
    const [notifAnchor, setNotifAnchor] = useState(null);

    const handleProfileMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);
    const handleNotifMenu = (event) => setNotifAnchor(event.currentTarget);
    const handleCloseNotif = () => setNotifAnchor(null);

    const handleLogout = () => {
        handleCloseMenu();
        logout();
        navigate('/');
    };

    const mockNotifications = [
        { id: 1, message: 'Your loan application was approved!', time: '2 hours ago', unread: true },
        { id: 2, message: 'New order received for Premium Maize', time: '5 hours ago', unread: true },
        { id: 3, message: 'Your crop assessment is ready', time: '1 day ago', unread: false },
    ];

    const unreadCount = mockNotifications.filter(n => n.unread).length;
    const cartCount = items?.length || 0;

    return (
        <AppBar
            position="fixed"
            elevation={4} // Added elevation for shadow
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                // Background handled by theme MuiAppBar override (Green Gradient)
                color: 'white', // Ensure text is white
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', height: 70 }}>
                {/* Left Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {user && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={onMenuClick}
                            sx={{ display: { md: 'none' }, mr: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            gap: 1.5,
                        }}
                        onClick={() => navigate(user ? (role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard') : '/')}
                    >
                        <Box
                            sx={{
                                bgcolor: 'white',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}
                        >
                            <Spa sx={{ color: 'primary.main' }} fontSize="medium" />
                        </Box>
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight="800"
                                sx={{
                                    lineHeight: 1,
                                    color: 'white', // White text on green navbar
                                    letterSpacing: '-0.5px'
                                }}
                            >
                                AgriChain
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 700, letterSpacing: 1 }}>
                                BLOCKCHAIN • AI • AGRICULTURE
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Right Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    {!user ? (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/login')}
                                sx={{
                                    fontWeight: 600,
                                    borderColor: 'rgba(255,255,255,0.3)'
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/login')}
                                sx={{
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                    fontWeight: 700,
                                    color: 'primary.dark'
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                    ) : (
                        <>
                            {/* Wallet Balance */}
                            <Chip
                                icon={<AccountBalanceWallet sx={{ fontSize: 16, color: 'inherit !important' }} />}
                                label={isMobile ? `KES ${Math.round(balance / 1000)}K` : `KES ${balance.toLocaleString()}`}
                                sx={{
                                    fontWeight: 700,
                                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                                    color: 'white',
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                                }}
                            />

                            {/* Cart (for buyers) */}
                            {role === 'buyer' && (
                                <IconButton
                                    onClick={() => navigate('/buyer/cart')}
                                    sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                                >
                                    <Badge badgeContent={cartCount} color="secondary">
                                        <ShoppingCart />
                                    </Badge>
                                </IconButton>
                            )}

                            {/* Notifications */}
                            <IconButton
                                onClick={handleNotifMenu}
                                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                            >
                                <Badge badgeContent={unreadCount} color="error" variant="dot">
                                    <Notifications />
                                </Badge>
                            </IconButton>

                            {/* Profile */}
                            <IconButton
                                onClick={handleProfileMenu}
                                sx={{
                                    p: 0.5,
                                    border: '2px solid',
                                    borderColor: 'rgba(255,255,255,0.5)',
                                }}
                            >
                                <Avatar
                                    src={user.profileImage}
                                    sx={{ width: 32, height: 32, border: '2px solid white' }}
                                >
                                    {user.name?.charAt(0)}
                                </Avatar>
                            </IconButton>
                        </>
                    )}
                </Box>

                {/* Notifications Menu */}
                <Menu
                    anchorEl={notifAnchor}
                    open={Boolean(notifAnchor)}
                    onClose={handleCloseNotif}
                    PaperProps={{
                        elevation: 4,
                        sx: { width: 320, maxHeight: 400, borderRadius: 3, mt: 1.5 }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #eee' }}>
                        <Typography variant="subtitle2" fontWeight="800" color="primary">
                            NOTIFICATIONS
                        </Typography>
                    </Box>
                    {mockNotifications.map((notif) => (
                        <MenuItem
                            key={notif.id}
                            onClick={handleCloseNotif}
                            sx={{
                                py: 1.5,
                                px: 2,
                                bgcolor: notif.unread ? 'primary.50' : 'transparent',
                                borderLeft: notif.unread ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent'
                            }}
                        >
                            <Box>
                                <Typography variant="body2" fontWeight={notif.unread ? 600 : 400}>
                                    {notif.message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    {notif.time}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                </Menu>

                {/* Profile Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        elevation: 4,
                        sx: { width: 240, borderRadius: 3, mt: 1.5 }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Box sx={{ px: 2.5, py: 2, bgcolor: 'primary.main', color: 'white', m: -1, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {user?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            {role === 'farmer' ? 'Verified Farmer' : 'Verified Buyer'}
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <MenuItem onClick={handleCloseMenu}>
                            <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>My Profile</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>
                            <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                            <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Settings</ListItemText>
                        </MenuItem>
                        <Divider sx={{ my: 1 }} />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                            <ListItemText sx={{ color: 'error.main', fontWeight: 600 }}>Sign Out</ListItemText>
                        </MenuItem>
                    </Box>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
