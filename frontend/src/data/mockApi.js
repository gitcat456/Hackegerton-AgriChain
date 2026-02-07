import { mockFarmers, mockBuyers } from './mockUsers';
import { mockAssessments } from './mockAssessments';
import { mockLoans } from './mockLoans';
import { mockListings } from './mockListings';
import { mockOrders } from './mockOrders';

// Simulates API delay for realistic UX
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory state for dynamic updates
let assessments = [...mockAssessments];
let loans = [...mockLoans];
let listings = [...mockListings];
let orders = [...mockOrders];
let farmers = [...mockFarmers];
let buyers = [...mockBuyers];

export const mockApi = {
    // ========================
    // AUTHENTICATION
    // ========================
    login: async (email, password) => {
        await delay(800);
        // Find by email or name match
        const farmer = farmers.find(f =>
            f.email?.toLowerCase() === email.toLowerCase() ||
            f.name.toLowerCase().includes(email.split('@')[0].toLowerCase())
        );
        if (farmer) return { user: farmer, role: 'farmer' };

        const buyer = buyers.find(b =>
            b.email?.toLowerCase() === email.toLowerCase() ||
            b.name.toLowerCase().includes(email.split('@')[0].toLowerCase())
        );
        if (buyer) return { user: buyer, role: 'buyer' };

        // Default fallback for demo
        return { user: farmers[0], role: 'farmer' };
    },

    register: async (userData, role) => {
        await delay(1000);
        const id = role === 'farmer' ? `F${Date.now()}` : `B${Date.now()}`;
        const newUser = {
            id,
            ...userData,
            walletBalance: 0,
            creditScore: role === 'farmer' ? 600 : undefined,
            totalLoans: 0,
            activeListings: 0,
            totalOrders: 0,
            joinDate: new Date().toISOString().split('T')[0],
            profileImage: `https://i.pravatar.cc/150?u=${id}`
        };

        if (role === 'farmer') {
            farmers.push(newUser);
        } else {
            buyers.push(newUser);
        }

        return { success: true, user: newUser };
    },

    // ========================
    // FARMER ENDPOINTS
    // ========================
    uploadCropImages: async (images, metadata) => {
        await delay(2500); // Simulate AI processing time
        const healthScore = 0.70 + (Math.random() * 0.25); // 0.70 - 0.95
        const yieldMap = { low: 'Low', medium: 'Medium', high: 'High' };
        const yieldEstimate = healthScore > 0.85 ? 'High' : healthScore > 0.70 ? 'Medium' : 'Low';
        const riskLevel = healthScore > 0.85 ? 'Low' : healthScore > 0.65 ? 'Medium' : 'High';

        const newAssessment = {
            id: `A${Date.now()}`,
            farmerId: metadata.farmerId,
            cropType: metadata.cropType || 'Maize',
            healthScore: Math.round(healthScore * 100) / 100,
            yieldEstimate,
            riskLevel,
            images: images.map((_, i) => `https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&sig=${i}`),
            assessmentDate: new Date().toISOString().split('T')[0],
            areaCovered: metadata.areaCovered || '1.0 acres',
            recommendations: generateRecommendations(healthScore, metadata.cropType),
            creditScoreImpact: Math.floor(healthScore * 60)
        };

        assessments.push(newAssessment);
        return newAssessment;
    },

    getCropAssessments: async (farmerId) => {
        await delay(500);
        return assessments.filter(a => a.farmerId === farmerId);
    },

    getAssessmentById: async (assessmentId) => {
        await delay(400);
        return assessments.find(a => a.id === assessmentId);
    },

    applyForLoan: async (loanData) => {
        await delay(1500);
        const newLoan = {
            id: `L${Date.now()}`,
            farmerId: loanData.farmerId,
            amount: loanData.amount,
            interestRate: calculateInterestRate(loanData.amount, loanData.durationMonths),
            duration: `${loanData.durationMonths} months`,
            durationMonths: loanData.durationMonths,
            status: 'PENDING',
            purpose: loanData.purpose,
            requestDate: new Date().toISOString().split('T')[0],
            approvalDate: null,
            dueDate: null,
            amountPaid: 0,
            monthlyPayment: calculateMonthlyPayment(loanData.amount, loanData.durationMonths),
            linkedAssessment: loanData.assessmentId,
            paymentHistory: []
        };

        loans.push(newLoan);
        return { success: true, loanId: newLoan.id, loan: newLoan };
    },

    getLoans: async (farmerId) => {
        await delay(500);
        return loans.filter(l => l.farmerId === farmerId);
    },

    getLoanById: async (loanId) => {
        await delay(400);
        return loans.find(l => l.id === loanId);
    },

    makePayment: async (loanId, amount) => {
        await delay(1000);
        const loan = loans.find(l => l.id === loanId);
        if (loan) {
            loan.amountPaid += amount;
            loan.paymentHistory.push({
                date: new Date().toISOString().split('T')[0],
                amount,
                status: 'PAID'
            });
            if (loan.amountPaid >= loan.amount * (1 + loan.interestRate / 100)) {
                loan.status = 'COMPLETED';
            }
        }
        return { success: true, loan };
    },

    createListing: async (listingData) => {
        await delay(800);
        const newListing = {
            id: `P${Date.now()}`,
            farmerId: listingData.farmerId,
            productName: listingData.productName,
            cropType: listingData.cropType,
            quantity: listingData.quantity,
            unit: listingData.unit || 'kg',
            pricePerUnit: listingData.pricePerUnit,
            totalPrice: listingData.quantity * listingData.pricePerUnit,
            assessmentId: listingData.assessmentId || null,
            healthBadge: listingData.healthBadge || null,
            images: listingData.images || ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'],
            status: 'ACTIVE',
            listedDate: new Date().toISOString().split('T')[0],
            location: listingData.location,
            description: listingData.description || '',
            viewCount: 0,
            deliveryOptions: listingData.deliveryOptions || ['Pickup']
        };

        listings.push(newListing);
        return { success: true, listingId: newListing.id, listing: newListing };
    },

    updateListing: async (listingId, updates) => {
        await delay(600);
        const index = listings.findIndex(l => l.id === listingId);
        if (index !== -1) {
            listings[index] = { ...listings[index], ...updates };
            return { success: true, listing: listings[index] };
        }
        return { success: false, error: 'Listing not found' };
    },

    deleteListing: async (listingId) => {
        await delay(500);
        const index = listings.findIndex(l => l.id === listingId);
        if (index !== -1) {
            listings.splice(index, 1);
            return { success: true };
        }
        return { success: false, error: 'Listing not found' };
    },

    getFarmerListings: async (farmerId) => {
        await delay(600);
        return listings.filter(l => l.farmerId === farmerId);
    },

    getFarmerOrders: async (farmerId) => {
        await delay(500);
        return orders.filter(o => o.farmerId === farmerId);
    },

    // ========================
    // BUYER ENDPOINTS
    // ========================
    getMarketplaceListings: async (filters = {}) => {
        await delay(600);
        let results = listings.filter(l => l.status === 'ACTIVE');

        if (filters.cropType && filters.cropType !== 'All') {
            results = results.filter(l =>
                l.cropType.toLowerCase() === filters.cropType.toLowerCase()
            );
        }

        if (filters.search) {
            const search = filters.search.toLowerCase();
            results = results.filter(l =>
                l.productName.toLowerCase().includes(search) ||
                l.cropType.toLowerCase().includes(search) ||
                l.location.toLowerCase().includes(search)
            );
        }

        if (filters.minHealthScore) {
            results = results.filter(l =>
                l.healthBadge && l.healthBadge >= filters.minHealthScore
            );
        }

        if (filters.maxPrice) {
            results = results.filter(l => l.pricePerUnit <= filters.maxPrice);
        }

        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price_low':
                    results.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
                    break;
                case 'price_high':
                    results.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
                    break;
                case 'health_score':
                    results.sort((a, b) => (b.healthBadge || 0) - (a.healthBadge || 0));
                    break;
                case 'newest':
                default:
                    results.sort((a, b) => new Date(b.listedDate) - new Date(a.listedDate));
            }
        }

        return results;
    },

    getProductDetail: async (productId) => {
        await delay(400);
        const listing = listings.find(l => l.id === productId);
        if (listing) {
            // Increment view count
            listing.viewCount = (listing.viewCount || 0) + 1;
            // Get farmer info
            const farmer = farmers.find(f => f.id === listing.farmerId);
            // Get assessment info if linked
            const assessment = listing.assessmentId
                ? assessments.find(a => a.id === listing.assessmentId)
                : null;
            return { ...listing, farmer, assessment };
        }
        return null;
    },

    getSimilarProducts: async (productId, cropType) => {
        await delay(300);
        return listings
            .filter(l => l.id !== productId && l.cropType === cropType && l.status === 'ACTIVE')
            .slice(0, 4);
    },

    createOrder: async (orderData) => {
        await delay(1200);
        const listing = listings.find(l => l.id === orderData.listingId);
        const farmer = farmers.find(f => f.id === listing?.farmerId);
        const buyer = buyers.find(b => b.id === orderData.buyerId);

        const newOrder = {
            id: `O${Date.now()}`,
            buyerId: orderData.buyerId,
            listingId: orderData.listingId,
            farmerId: listing?.farmerId,
            productName: listing?.productName,
            quantity: orderData.quantity,
            unit: listing?.unit,
            pricePerUnit: listing?.pricePerUnit,
            totalAmount: orderData.quantity * (listing?.pricePerUnit || 0),
            status: 'PAID',
            orderDate: new Date().toISOString().split('T')[0],
            escrowStatus: 'LOCKED',
            estimatedDelivery: getEstimatedDelivery(),
            deliveryAddress: orderData.deliveryAddress,
            farmerName: farmer?.name,
            buyerName: buyer?.name || buyer?.businessName,
            timeline: [
                { status: 'ORDERED', date: new Date().toISOString().split('T')[0], completed: true },
                { status: 'PAID', date: new Date().toISOString().split('T')[0], completed: true },
                { status: 'DISPATCHED', date: null, completed: false },
                { status: 'RECEIVED', date: null, completed: false },
                { status: 'RELEASED', date: null, completed: false }
            ]
        };

        // Update listing quantity
        if (listing) {
            listing.quantity -= orderData.quantity;
            if (listing.quantity <= 0) {
                listing.status = 'SOLD';
            }
        }

        orders.push(newOrder);
        return { success: true, orderId: newOrder.id, order: newOrder };
    },

    getBuyerOrders: async (buyerId) => {
        await delay(500);
        return orders.filter(o => o.buyerId === buyerId);
    },

    getOrderById: async (orderId) => {
        await delay(400);
        return orders.find(o => o.id === orderId);
    },

    confirmReceipt: async (orderId, rating, review) => {
        await delay(1500);
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'COMPLETED';
            order.escrowStatus = 'RELEASED';
            order.completedDate = new Date().toISOString().split('T')[0];
            order.buyerRating = rating;
            order.buyerReview = review;

            // Update timeline
            const receivedStep = order.timeline.find(t => t.status === 'RECEIVED');
            const releasedStep = order.timeline.find(t => t.status === 'RELEASED');
            if (receivedStep) {
                receivedStep.date = new Date().toISOString().split('T')[0];
                receivedStep.completed = true;
            }
            if (releasedStep) {
                releasedStep.date = new Date().toISOString().split('T')[0];
                releasedStep.completed = true;
            }

            // Update farmer wallet
            const farmer = farmers.find(f => f.id === order.farmerId);
            if (farmer) {
                farmer.walletBalance += order.totalAmount;
            }

            return { success: true, escrowReleased: true, order };
        }
        return { success: false, error: 'Order not found' };
    },

    // ========================
    // WALLET ENDPOINTS
    // ========================
    getWalletBalance: async (userId, role) => {
        await delay(300);
        if (role === 'farmer') {
            const user = farmers.find(f => f.id === userId);
            return user ? user.walletBalance : 0;
        } else {
            const user = buyers.find(b => b.id === userId);
            return user ? user.walletBalance : 0;
        }
    },

    addFunds: async (userId, role, amount) => {
        await delay(800);
        if (role === 'farmer') {
            const user = farmers.find(f => f.id === userId);
            if (user) {
                user.walletBalance += amount;
                return { success: true, newBalance: user.walletBalance };
            }
        } else {
            const user = buyers.find(b => b.id === userId);
            if (user) {
                user.walletBalance += amount;
                return { success: true, newBalance: user.walletBalance };
            }
        }
        return { success: false, error: 'User not found' };
    },

    // ========================
    // UTILITY FUNCTIONS
    // ========================
    getFarmerById: async (farmerId) => {
        await delay(300);
        return farmers.find(f => f.id === farmerId);
    },

    getBuyerById: async (buyerId) => {
        await delay(300);
        return buyers.find(b => b.id === buyerId);
    }
};

// Helper functions
function generateRecommendations(healthScore, cropType) {
    const recommendations = [];

    if (healthScore > 0.85) {
        recommendations.push('Maintain current farming practices - excellent results');
        recommendations.push('Consider premium market pricing for this batch');
        recommendations.push('Document methods for future reference');
    } else if (healthScore > 0.70) {
        recommendations.push('Apply balanced fertilizer to boost yield');
        recommendations.push('Monitor for pest activity in coming weeks');
        recommendations.push('Ensure consistent irrigation schedule');
    } else {
        recommendations.push('Immediate pest/disease treatment recommended');
        recommendations.push('Consult agricultural extension officer');
        recommendations.push('Consider partial replanting if damage persists');
    }

    return recommendations;
}

function calculateInterestRate(amount, months) {
    // Lower rates for shorter terms and smaller amounts
    let baseRate = 10;
    if (amount < 1000) baseRate -= 1;
    if (amount > 3000) baseRate += 0.5;
    if (months <= 3) baseRate -= 1.5;
    if (months >= 12) baseRate += 1;
    return Math.round(baseRate * 10) / 10;
}

function calculateMonthlyPayment(amount, months) {
    const rate = calculateInterestRate(amount, months);
    const totalWithInterest = amount * (1 + rate / 100);
    return Math.round((totalWithInterest / months) * 100) / 100;
}

function getEstimatedDelivery() {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 days from now
    return date.toISOString().split('T')[0];
}

export default mockApi;
