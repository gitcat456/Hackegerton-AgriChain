import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Menu,
    MenuItem,
    Avatar,
    Chip,
    Divider,
    ListItemIcon,
    ListItemText,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Agriculture as AgricultureIcon,
    AccountCircle,
    Storefront,
    AccountBalance,
    AdminPanelSettings,
    Wallet,
    KeyboardArrowDown,
    Home,
    Dashboard,
} from '@mui/icons-material';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, currentRole, switchRole, switchUser, farmers, buyers, admins } = useUser();

    const [roleAnchor, setRoleAnchor] = useState(null);
    const [userAnchor, setUserAnchor] = useState(null);

    const handleRoleClick = (event) => {
        setRoleAnchor(event.currentTarget);
    };

    const handleUserClick = (event) => {
        setUserAnchor(event.currentTarget);
    };

    const handleRoleChange = (role) => {
        switchRole(role);
        setRoleAnchor(null);
        // Navigate to appropriate dashboard
        if (role === 'farmer') navigate('/farmer');
        else if (role === 'buyer') navigate('/marketplace');
        else if (role === 'admin') navigate('/admin');
    };

    const handleUserChange = (user) => {
        switchUser(user);
        setUserAnchor(null);
    };

    const roleColors = {
        farmer: theme.palette.primary.main,
        buyer: theme.palette.secondary.main,
        admin: theme.palette.info.main,
    };

    const roleIcons = {
        farmer: <AgricultureIcon />,
        buyer: <Storefront />,
        admin: <AdminPanelSettings />,
    };

    const navItems = [
        { label: 'Home', path: '/', icon: <Home /> },
        { label: 'Marketplace', path: '/marketplace', icon: <Storefront /> },
        { label: 'Farmer Dashboard', path: '/farmer', icon: <AgricultureIcon />, role: 'farmer' },
        { label: 'Admin Panel', path: '/admin', icon: <AdminPanelSettings />, role: 'admin' },
    ];

    const filteredNavItems = navItems.filter(item => !item.role || item.role === currentRole);

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Logo */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate('/')}
                >
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        }}
                    >
                        <AgricultureIcon sx={{ color: theme.palette.primary.dark, fontSize: 26 }} />
                    </Box>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                color: 'white',
                                letterSpacing: '-0.5px',
                                lineHeight: 1.1,
                            }}
                        >
                            AgriChain
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: alpha(theme.palette.common.white, 0.8),
                                fontSize: '0.65rem',
                                letterSpacing: '0.5px',
                            }}
                        >
                            BLOCKCHAIN • AI • AGRICULTURE
                        </Typography>
                    </Box>
                </Box>

                {/* Navigation */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                    {filteredNavItems.map((item) => (
                        <Button
                            key={item.path}
                            startIcon={item.icon}
                            onClick={() => navigate(item.path)}
                            sx={{
                                color: location.pathname === item.path ? 'white' : alpha('#fff', 0.8),
                                backgroundColor: location.pathname === item.path
                                    ? alpha('#fff', 0.15)
                                    : 'transparent',
                                '&:hover': {
                                    backgroundColor: alpha('#fff', 0.1),
                                },
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>

                {/* Right Side - Role & User */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {!currentUser ? (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/login')}
                                sx={{ fontWeight: 600 }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/signup')}
                                sx={{
                                    fontWeight: 600,
                                    boxShadow: 'none',
                                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }
                                }}
                            >
                                Sign Up
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Wallet Balance */}
                            <Chip
                                icon={<Wallet sx={{ color: 'inherit !important' }} />}
                                label={`${Number(currentUser.wallet_balance || 0).toLocaleString()} KES`}
                                sx={{
                                    bgcolor: alpha('#fff', 0.15),
                                    color: 'white',
                                    fontWeight: 600,
                                    '& .MuiChip-icon': { color: 'white' },
                                }}
                            />

                            {/* Role Switcher */}
                            <Chip
                                icon={roleIcons[currentRole]}
                                label={currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                                onClick={handleRoleClick}
                                onDelete={handleRoleClick}
                                deleteIcon={<KeyboardArrowDown />}
                                sx={{
                                    bgcolor: roleColors[currentRole],
                                    color: 'white',
                                    fontWeight: 600,
                                    '& .MuiChip-icon': { color: 'white' },
                                    '& .MuiChip-deleteIcon': { color: 'white' },
                                    cursor: 'pointer',
                                }}
                            />
                            <Menu
                                anchorEl={roleAnchor}
                                open={Boolean(roleAnchor)}
                                onClose={() => setRoleAnchor(null)}
                            >
                                {['farmer', 'buyer', 'admin'].map((role) => (
                                    <MenuItem
                                        key={role}
                                        onClick={() => handleRoleChange(role)}
                                        selected={role === currentRole}
                                    >
                                        <ListItemIcon sx={{ color: roleColors[role] }}>
                                            {roleIcons[role]}
                                        </ListItemIcon>
                                        <ListItemText>{role.charAt(0).toUpperCase() + role.slice(1)}</ListItemText>
                                    </MenuItem>
                                ))}
                            </Menu>

                            {/* User Switcher */}
                            <IconButton onClick={handleUserClick}>
                                <Avatar
                                    sx={{
                                        bgcolor: alpha('#fff', 0.2),
                                        color: 'white',
                                        width: 36,
                                        height: 36,
                                    }}
                                >
                                    {currentUser?.full_name?.charAt(0) || 'U'}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={userAnchor}
                                open={Boolean(userAnchor)}
                                onClose={() => setUserAnchor(null)}
                            >
                                <Box sx={{ px: 2, py: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Switch Demo User
                                    </Typography>
                                </Box>
                                <Divider />
                                {currentRole === 'farmer' && farmers.map((user) => (
                                    <MenuItem
                                        key={user.id}
                                        onClick={() => handleUserChange(user)}
                                        selected={user.id === currentUser?.id}
                                    >
                                        <ListItemIcon>
                                            <AgricultureIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={user.full_name}
                                            secondary={user.location || user.farm_location}
                                        />
                                    </MenuItem>
                                ))}
                                {currentRole === 'buyer' && buyers.map((user) => (
                                    <MenuItem
                                        key={user.id}
                                        onClick={() => handleUserChange(user)}
                                        selected={user.id === currentUser?.id}
                                    >
                                        <ListItemIcon>
                                            <Storefront color="secondary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={user.full_name}
                                            secondary={user.location}
                                        />
                                    </MenuItem>
                                ))}
                                {currentRole === 'admin' && admins.map((user) => (
                                    <MenuItem
                                        key={user.id}
                                        onClick={() => handleUserChange(user)}
                                        selected={user.id === currentUser?.id}
                                    >
                                        <ListItemIcon>
                                            <AdminPanelSettings color="info" />
                                        </ListItemIcon>
                                        <ListItemText primary={user.full_name} />
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
