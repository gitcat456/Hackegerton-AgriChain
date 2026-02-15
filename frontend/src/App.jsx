import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { CartProvider } from './contexts/CartContext';
import theme from './theme/muiTheme';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';

// Farmer Components
import FarmerDashboard from './components/farmer/Dashboard';
import UploadAssessment from './components/farmer/UploadAssessment';
import AssessmentResults from './components/farmer/AssessmentResults';
import Assessments from './components/farmer/Assessments';
import LoanApplication from './components/farmer/LoanApplication';
import Loans from './components/farmer/Loans';
import CreateListing from './components/farmer/CreateListing';
import Listings from './components/farmer/Listings';
import FarmerOrders from './components/farmer/FarmerOrders';

// Buyer Components
import BuyerDashboard from './components/buyer/Dashboard';
import Marketplace from './components/buyer/Marketplace';
import ProductDetail from './components/buyer/ProductDetail';
import Cart from './components/buyer/Cart';
import BuyerOrders from './components/buyer/Orders';

// Shared Components
import Wallet from './components/common/Wallet';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'} replace />;
  }

  return children;
};

// Public Route with auth redirect (for landing page)
const PublicRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (user) {
    return <Navigate to={role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={
        <PublicRoute>
          <Landing />
        </PublicRoute>
      } />

      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      {/* Protected Routes with Layout */}
      <Route element={<Layout />}>

        {/* ============ FARMER ROUTES ============ */}

        {/* Dashboard */}
        <Route path="/farmer/dashboard" element={
          <ProtectedRoute allowedRole="farmer">
            <FarmerDashboard />
          </ProtectedRoute>
        } />

        {/* Assessments */}
        <Route path="/farmer/assessments" element={
          <ProtectedRoute allowedRole="farmer">
            <Assessments />
          </ProtectedRoute>
        } />
        <Route path="/farmer/upload-assessment" element={
          <ProtectedRoute allowedRole="farmer">
            <UploadAssessment />
          </ProtectedRoute>
        } />
        <Route path="/farmer/assessment/:id" element={
          <ProtectedRoute allowedRole="farmer">
            <AssessmentResults />
          </ProtectedRoute>
        } />

        {/* Loans */}
        <Route path="/farmer/loans" element={
          <ProtectedRoute allowedRole="farmer">
            <Loans />
          </ProtectedRoute>
        } />
        <Route path="/farmer/loan/apply" element={
          <ProtectedRoute allowedRole="farmer">
            <LoanApplication />
          </ProtectedRoute>
        } />

        {/* Listings */}
        <Route path="/farmer/listings" element={
          <ProtectedRoute allowedRole="farmer">
            <Listings />
          </ProtectedRoute>
        } />
        <Route path="/farmer/listing/create" element={
          <ProtectedRoute allowedRole="farmer">
            <CreateListing />
          </ProtectedRoute>
        } />

        {/* Orders */}
        <Route path="/farmer/orders" element={
          <ProtectedRoute allowedRole="farmer">
            <FarmerOrders />
          </ProtectedRoute>
        } />

        {/* Farmer Wallet */}
        <Route path="/farmer/wallet" element={
          <ProtectedRoute allowedRole="farmer">
            <Wallet />
          </ProtectedRoute>
        } />

        <Route path="/farmer/wallet" element={
          <ProtectedRoute allowedRole="farmer">
            <Box sx={{ mt: 4 }}>
              <Wallet userType="farmer" />
            </Box>
          </ProtectedRoute>
        } />

        {/* ============ BUYER ROUTES ============ */}

        {/* Dashboard */}
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute allowedRole="buyer">
            <BuyerDashboard />
          </ProtectedRoute>
        } />

        {/* Marketplace (accessible to both) */}
        <Route path="/marketplace" element={
          <ProtectedRoute>
            <Marketplace />
          </ProtectedRoute>
        } />
        <Route path="/marketplace/product/:id" element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        } />

        {/* Cart & Checkout */}
        <Route path="/buyer/cart" element={
          <ProtectedRoute allowedRole="buyer">
            <Cart />
          </ProtectedRoute>
        } />

        {/* Orders */}
        <Route path="/buyer/orders" element={
          <ProtectedRoute allowedRole="buyer">
            <BuyerOrders />
          </ProtectedRoute>
        } />

        {/* Buyer Wallet */}
        <Route path="/buyer/wallet" element={
          <ProtectedRoute allowedRole="buyer">
            <Wallet />
          </ProtectedRoute>
        } />

      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <WalletProvider>
          <CartProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </CartProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
