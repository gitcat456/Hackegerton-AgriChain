import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    Divider,
    Typography,
    useMediaQuery,
    useTheme,
    alpha
} from '@mui/material';
import {
    Dashboard,
    CloudUpload,
    Assignment,
    MonetizationOn,
    Storefront,
    ShoppingCart,
    Receipt,
    AccountBalanceWallet,
    Inventory,
    Add,
    LocalShipping,
    BarChart,
    ChevronRight
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 260;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const farmerMenuItems = [
        {
            section: 'OVERVIEW',
            items: [
                { text: 'Dashboard', icon: <Dashboard />, path: '/farmer/dashboard' },
            ]
        },
        {
            section: 'CROP MANAGEMENT',
            items: [
                { text: 'Assessments', icon: <Assignment />, path: '/farmer/assessments' },
                { text: 'Upload New', icon: <CloudUpload />, path: '/farmer/upload-assessment' },
            ]
        },
        {
            section: 'FINANCE',
            items: [
                { text: 'Loans', icon: <MonetizationOn />, path: '/farmer/loans' },
                { text: 'Apply for Loan', icon: <Add />, path: '/farmer/loan/apply' },
                { text: 'Wallet', icon: <AccountBalanceWallet />, path: '/farmer/wallet' },
            ]
        },
        {
            section: 'MARKETPLACE',
            items: [
                { text: 'My Listings', icon: <Inventory />, path: '/farmer/listings' },
                { text: 'Create New', icon: <Add />, path: '/farmer/listing/create' },
                { text: 'Orders', icon: <LocalShipping />, path: '/farmer/orders' },
            ]
        },
    ];

    const buyerMenuItems = [
        {
            section: 'SHOPPING',
            items: [
                { text: 'Marketplace', icon: <Storefront />, path: '/marketplace' },
                { text: 'Cart', icon: <ShoppingCart />, path: '/buyer/cart' },
            ]
        },
        {
            section: 'ORDERS & FINANCE',
            items: [
                { text: 'My Orders', icon: <Receipt />, path: '/buyer/orders' },
                { text: 'Wallet', icon: <AccountBalanceWallet />, path: '/buyer/wallet' },
            ]
        },
    ];

    const menuSections = role === 'farmer' ? farmerMenuItems : buyerMenuItems;

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) handleDrawerToggle();
    };

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar sx={{ height: 70 }} /> {/* Spacer for Navbar */}

            <Box sx={{ flex: 1, px: 2, py: 3, overflowY: 'auto' }}>
                {menuSections.map((section, index) => (
                    <Box key={section.section} sx={{ mb: 4 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                px: 2,
                                mb: 1,
                                display: 'block',
                                color: 'yellow',
                                fontWeight: 800,
                                letterSpacing: 1.5,
                                fontSize: '0.7rem'
                            }}
                        >
                            {section.section}
                        </Typography>

                        <List disablePadding>
                            {section.items.map((item) => {
                                const isActive = location.pathname === item.path;

                                return (
                                    <ListItemButton
                                        key={item.text}
                                        onClick={() => handleNavigation(item.path)}
                                        selected={isActive}
                                        sx={{
                                            borderRadius: 3,
                                            mb: 0.5,
                                            py: 1.2,
                                            px: 2,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&.Mui-selected': {
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                                                '&:hover': {
                                                    bgcolor: 'primary.dark',
                                                },
                                                '& .MuiListItemIcon-root': {
                                                    color: 'white',
                                                },
                                            },
                                            '&:not(.Mui-selected):hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                transform: 'translateX(4px)',
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 36,
                                                color: isActive ? 'inherit' : 'text.secondary',
                                                transition: 'color 0.3s',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontWeight: isActive ? 600 : 500,
                                                fontSize: '0.9rem',
                                            }}
                                        />
                                        {isActive && <ChevronRight fontSize="small" />}
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Box>
                ))}
            </Box>

            {/* Footer */}
            <Box sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'rgba(255,255,255,0.5)'
            }}>
                <Typography variant="caption" color="text.secondary" align="center" display="block" fontWeight={500}>
                    AgriChain v2.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: 'none',
                        bgcolor: 'rgba(85, 176, 91, 0.3)',
                        backdropFilter: 'blur(16px)',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: '1px solid rgba(255,255,255,0.3)',
                        bgcolor: 'rgba(85, 176, 91, 0.3)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: 'none',
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
