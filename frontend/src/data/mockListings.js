// MARKETPLACE LISTINGS (7 instances with varied products, prices, and health badges)
export const mockListings = [
    {
        id: 'P001',
        farmerId: 'F001',
        productName: 'Premium White Maize',
        cropType: 'Maize',
        quantity: 500,
        unit: 'kg',
        pricePerUnit: 45,
        totalPrice: 22500,
        assessmentId: 'A001',
        healthBadge: 0.87,
        images: [
            'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'
        ],
        status: 'ACTIVE',
        listedDate: '2024-02-06',
        location: 'Kiambu County',
        description: 'High-quality white maize, freshly harvested from our sustainable farm. Perfect for milling and animal feed.',
        viewCount: 145,
        deliveryOptions: ['Pickup', 'Local Delivery']
    },
    {
        id: 'P002',
        farmerId: 'F002',
        productName: 'Organic Red Beans',
        cropType: 'Beans',
        quantity: 200,
        unit: 'kg',
        pricePerUnit: 120,
        totalPrice: 24000,
        assessmentId: null,
        healthBadge: null,
        images: [
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
        ],
        status: 'ACTIVE',
        listedDate: '2024-02-05',
        location: 'Nakuru',
        description: 'Certified organic red beans grown without pesticides. Rich in protein and perfect for traditional dishes.',
        viewCount: 89,
        deliveryOptions: ['Pickup', 'Nationwide Shipping']
    },
    {
        id: 'P003',
        farmerId: 'F005',
        productName: 'High Yield Wheat Grain',
        cropType: 'Wheat',
        quantity: 1000,
        unit: 'kg',
        pricePerUnit: 55,
        totalPrice: 55000,
        assessmentId: 'A005',
        healthBadge: 0.95,
        images: [
            'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'
        ],
        status: 'ACTIVE',
        listedDate: '2024-02-04',
        location: 'Eldoret',
        description: 'Premium grade wheat, ideal for flour milling. AI-verified excellent quality with maximum yield potential.',
        viewCount: 234,
        deliveryOptions: ['Pickup', 'Local Delivery', 'Nationwide Shipping']
    },
    {
        id: 'P004',
        farmerId: 'F004',
        productName: 'Fresh Cassava Tubers',
        cropType: 'Cassava',
        quantity: 300,
        unit: 'kg',
        pricePerUnit: 30,
        totalPrice: 9000,
        assessmentId: null,
        healthBadge: null,
        images: [
            'https://images.unsplash.com/photo-1518977676601-b53f82ber?w=400&h=300&fit=crop'
        ],
        status: 'SOLD',
        listedDate: '2024-01-20',
        location: 'Nyeri',
        description: 'Freshly harvested cassava tubers, perfect for chips, flour, or traditional cooking.',
        viewCount: 167,
        deliveryOptions: ['Pickup']
    },
    {
        id: 'P005',
        farmerId: 'F001',
        productName: 'Yellow Maize - Feed Grade',
        cropType: 'Maize',
        quantity: 400,
        unit: 'kg',
        pricePerUnit: 40,
        totalPrice: 16000,
        assessmentId: 'A001',
        healthBadge: 0.85,
        images: [
            'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop'
        ],
        status: 'ACTIVE',
        listedDate: '2024-02-07',
        location: 'Kiambu County',
        description: 'Quality yellow maize suitable for animal feed. Bulk discounts available for orders over 200kg.',
        viewCount: 78,
        deliveryOptions: ['Pickup', 'Local Delivery']
    },
    {
        id: 'P006',
        farmerId: 'F006',
        productName: 'Premium Sorghum',
        cropType: 'Sorghum',
        quantity: 250,
        unit: 'kg',
        pricePerUnit: 65,
        totalPrice: 16250,
        assessmentId: 'A006',
        healthBadge: 0.78,
        images: [
            'https://images.unsplash.com/photo-1595855759920-86582396bbc3?w=400&h=300&fit=crop'
        ],
        status: 'ACTIVE',
        listedDate: '2024-02-02',
        location: 'Machakos',
        description: 'Drought-resistant sorghum variety, excellent for brewing and porridge. High nutritional value.',
        viewCount: 112,
        deliveryOptions: ['Pickup', 'Local Delivery']
    },
    {
        id: 'P007',
        farmerId: 'F007',
        productName: 'Aromatic Mwea Rice',
        cropType: 'Rice',
        quantity: 800,
        unit: 'kg',
        pricePerUnit: 90,
        totalPrice: 72000,
        assessmentId: 'A007',
        healthBadge: 0.82,
        images: [
            'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
        ],
        status: 'ACTIVE',
        listedDate: '2024-02-01',
        location: 'Meru',
        description: 'Premium aromatic rice from Meru highlands. Long grain, perfect for biryani and pilau.',
        viewCount: 289,
        deliveryOptions: ['Pickup', 'Local Delivery', 'Nationwide Shipping']
    }
];

// Crop type options for filtering
export const cropTypes = [
    'Maize',
    'Beans',
    'Wheat',
    'Rice',
    'Sorghum',
    'Millet',
    'Cassava',
    'Coffee',
    'Tea'
];
