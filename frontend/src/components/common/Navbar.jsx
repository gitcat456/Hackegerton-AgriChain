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
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications,
    AccountBalanceWallet,
    Person,
    Settings,
    Logout,
    ShoppingCart
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
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'white',
                color: 'text.primary',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Left Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {user && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={onMenuClick}
                            sx={{ display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            gap: 1,
                        }}
                        onClick={() => navigate(user ? (role === 'farmer' ? '/farmer/dashboard' : '/buyer/marketplace') : '/')}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h6" fontWeight="800" color="white">
                                A
                            </Typography>
                        </Box>
                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            AgriChain
                        </Typography>
                    </Box>
                </Box>

                {/* Right Section */}
                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                        {/* Wallet Balance */}
                        <Chip
                            icon={<AccountBalanceWallet sx={{ fontSize: 18 }} />}
                            label={isMobile ? `KES ${Math.round(balance / 1000)}K` : `KES ${balance.toLocaleString()}`}
                            color="secondary"
                            variant="filled"
                            sx={{
                                fontWeight: 600,
                                '& .MuiChip-icon': { color: 'inherit' },
                            }}
                        />

                        {/* Cart (for buyers) */}
                        {role === 'buyer' && (
                            <IconButton onClick={() => navigate('/buyer/cart')}>
                                <Badge badgeContent={cartCount} color="secondary">
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>
                        )}

                        {/* Notifications */}
                        <IconButton onClick={handleNotifMenu}>
                            <Badge badgeContent={unreadCount} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>

                        {/* Profile */}
                        <IconButton onClick={handleProfileMenu}>
                            <Avatar
                                src={user.profileImage}
                                sx={{ width: 36, height: 36 }}
                            >
                                {user.name?.charAt(0)}
                            </Avatar>
                        </IconButton>
                    </Box>
                )}

                {/* Notifications Menu */}
                <Menu
                    anchorEl={notifAnchor}
                    open={Boolean(notifAnchor)}
                    onClose={handleCloseNotif}
                    PaperProps={{
                        sx: { width: 320, maxHeight: 400 }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Notifications
                        </Typography>
                    </Box>
                    <Divider />
                    {mockNotifications.map((notif) => (
                        <MenuItem
                            key={notif.id}
                            onClick={handleCloseNotif}
                            sx={{
                                py: 1.5,
                                bgcolor: notif.unread ? 'action.hover' : 'transparent',
                            }}
                        >
                            <Box>
                                <Typography variant="body2">{notif.message}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {notif.time}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem onClick={handleCloseNotif} sx={{ justifyContent: 'center' }}>
                        <Typography variant="body2" color="primary" fontWeight={600}>
                            View All Notifications
                        </Typography>
                    </MenuItem>
                </Menu>

                {/* Profile Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        sx: { width: 240 }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {user?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {role === 'farmer' ? 'Farmer Account' : 'Buyer Account'}
                        </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleCloseMenu}>
                        <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                        <ListItemText>My Profile</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                        <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                        <ListItemText>Settings</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                        <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
