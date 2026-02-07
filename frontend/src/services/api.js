import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Users API
export const usersAPI = {
    list: () => api.get('/users/'),
    get: (id) => api.get(`/users/${id}/`),
    create: (data) => api.post('/users/', data),
    update: (id, data) => api.put(`/users/${id}/`, data),
    farmers: () => api.get('/users/farmers/'),
    buyers: () => api.get('/users/buyers/'),
};

// Wallets API
export const walletsAPI = {
    get: (id) => api.get(`/wallets/${id}/`),
    transactions: (id) => api.get(`/wallets/${id}/transactions/`),
    deposit: (id, amount) => api.post(`/wallets/${id}/deposit/`, { amount }),
};

// Farms API
export const farmsAPI = {
    list: (ownerId) => api.get('/crops/farms/', { params: { owner: ownerId } }),
    get: (id) => api.get(`/crops/farms/${id}/`),
    create: (data) => api.post('/crops/farms/', data),
    update: (id, data) => api.put(`/crops/farms/${id}/`, data),
    uploadImages: (id, formData) => api.post(`/crops/farms/${id}/upload_images/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    assess: (id) => api.post(`/crops/farms/${id}/assess/`),
    assessments: (id) => api.get(`/crops/farms/${id}/assessments/`),
};

// Assessments API
export const assessmentsAPI = {
    list: (farmId) => api.get('/crops/assessments/', { params: { farm: farmId } }),
    get: (id) => api.get(`/crops/assessments/${id}/`),
};

// Loans API
export const loansAPI = {
    list: (borrowerId) => api.get('/loans/loans/', { params: { borrower: borrowerId } }),
    get: (id) => api.get(`/loans/loans/${id}/`),
    apply: (data) => api.post('/loans/loans/', data),
    approve: (id, data) => api.post(`/loans/loans/${id}/approve/`, data),
    reject: (id, reason) => api.post(`/loans/loans/${id}/reject/`, { reason }),
    releaseMilestone: (id) => api.post(`/loans/loans/${id}/release_milestone/`),
    pending: () => api.get('/loans/loans/pending/'),
};

// Credit Score API
export const creditScoreAPI = {
    get: (userId) => api.get(`/loans/credit-score/user/${userId}/`),
};

// Listings API
export const listingsAPI = {
    list: (params = {}) => api.get('/marketplace/listings/', { params }),
    get: (id) => api.get(`/marketplace/listings/${id}/`),
    create: (formData) => api.post('/marketplace/listings/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id, data) => api.put(`/marketplace/listings/${id}/`, data),
    featured: () => api.get('/marketplace/listings/featured/'),
    cropTypes: () => api.get('/marketplace/listings/crop_types/'),
    myListings: (farmerId) => api.get('/marketplace/listings/', { params: { farmer: farmerId } }),
};

// Orders API
export const ordersAPI = {
    list: (params = {}) => api.get('/marketplace/orders/', { params }),
    get: (id) => api.get(`/marketplace/orders/${id}/`),
    create: (data) => api.post('/marketplace/orders/', data),
    pay: (id) => api.post(`/marketplace/orders/${id}/pay/`),
    dispatch: (id) => api.post(`/marketplace/orders/${id}/dispatch/`),
    receive: (id) => api.post(`/marketplace/orders/${id}/receive/`),
    dispute: (id) => api.post(`/marketplace/orders/${id}/dispute/`),
    mySales: (farmerId) => api.get('/marketplace/orders/my_sales/', { params: { farmer_id: farmerId } }),
};

// Cart API
export const cartAPI = {
    list: (buyerId) => api.get('/marketplace/cart/', { params: { buyer: buyerId } }),
    add: (data) => api.post('/marketplace/cart/', data),
    remove: (id) => api.delete(`/marketplace/cart/${id}/`),
    summary: (buyerId) => api.get('/marketplace/cart/summary/', { params: { buyer_id: buyerId } }),
    checkout: (buyerId, deliveryAddress) => api.post('/marketplace/cart/checkout/', {
        buyer_id: buyerId,
        delivery_address: deliveryAddress,
    }),
};

// Lending Pools API
export const poolsAPI = {
    list: () => api.get('/loans/pools/'),
    get: (id) => api.get(`/loans/pools/${id}/`),
};

export default api;
