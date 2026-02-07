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
    BarChart
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
            section: 'Dashboard',
            items: [
                { text: 'Overview', icon: <Dashboard />, path: '/farmer/dashboard' },
            ]
        },
        {
            section: 'Crop Management',
            items: [
                { text: 'Upload Crops', icon: <CloudUpload />, path: '/farmer/upload-assessment' },
                { text: 'My Assessments', icon: <Assignment />, path: '/farmer/assessments' },
            ]
        },
        {
            section: 'Finance',
            items: [
                { text: 'Loans', icon: <MonetizationOn />, path: '/farmer/loans' },
                { text: 'Apply for Loan', icon: <Add />, path: '/farmer/loan/apply' },
            ]
        },
        {
            section: 'Marketplace',
            items: [
                { text: 'My Listings', icon: <Inventory />, path: '/farmer/listings' },
                { text: 'Create Listing', icon: <Add />, path: '/farmer/listing/create' },
                { text: 'Orders Received', icon: <LocalShipping />, path: '/farmer/orders' },
            ]
        },
    ];

    const buyerMenuItems = [
        {
            section: 'Shopping',
            items: [
                { text: 'Marketplace', icon: <Storefront />, path: '/marketplace' },
                { text: 'My Cart', icon: <ShoppingCart />, path: '/buyer/cart' },
            ]
        },
        {
            section: 'Orders',
            items: [
                { text: 'My Orders', icon: <Receipt />, path: '/buyer/orders' },
            ]
        },
        {
            section: 'Account',
            items: [
                { text: 'Wallet', icon: <AccountBalanceWallet />, path: '/buyer/wallet' },
            ]
        },
    ];

    const menuSections = role === 'farmer' ? farmerMenuItems : buyerMenuItems;

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) handleDrawerToggle();
    };

    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar />

            <Box sx={{ flex: 1, px: 2, py: 1, overflowY: 'auto' }}>
                {menuSections.map((section, sectionIndex) => (
                    <Box key={section.section} sx={{ mb: 2 }}>
                        <Typography
                            variant="overline"
                            sx={{
                                px: 1,
                                color: 'text.secondary',
                                fontWeight: 600,
                                letterSpacing: 1.2,
                            }}
                        >
                            {section.section}
                        </Typography>

                        <List sx={{ py: 0.5 }}>
                            {section.items.map((item) => {
                                const isActive = location.pathname === item.path;

                                return (
                                    <ListItemButton
                                        key={item.text}
                                        onClick={() => handleNavigation(item.path)}
                                        selected={isActive}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 0.5,
                                            py: 1.2,
                                            transition: 'all 0.2s ease-in-out',
                                            '&.Mui-selected': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.12),
                                                color: 'primary.main',
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.18),
                                                },
                                                '& .MuiListItemIcon-root': {
                                                    color: 'primary.main',
                                                },
                                            },
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                transform: 'translateX(4px)',
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 40,
                                                color: isActive ? 'primary.main' : 'text.secondary',
                                                transition: 'color 0.2s',
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
                                    </ListItemButton>
                                );
                            })}
                        </List>

                        {sectionIndex < menuSections.length - 1 && (
                            <Divider sx={{ my: 1.5, mx: 1 }} />
                        )}
                    </Box>
                ))}
            </Box>

            {/* Footer */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.disabled" align="center" display="block">
                    AgriChain v1.0.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            {/* Mobile Drawer */}
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
                        boxShadow: 3,
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: 'none',
                        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
