// LOANS (7 instances with varied statuses and amounts from $500 to $5,000)
export const mockLoans = [
    {
        id: 'L001',
        farmerId: 'F001',
        amount: 2000,
        interestRate: 8.5,
        duration: '6 months',
        durationMonths: 6,
        status: 'APPROVED',
        purpose: 'Seeds',
        requestDate: '2024-02-03',
        approvalDate: '2024-02-05',
        dueDate: '2024-08-05',
        amountPaid: 450,
        monthlyPayment: 358.33,
        linkedAssessment: 'A001',
        paymentHistory: [
            { date: '2024-03-05', amount: 358.33, status: 'PAID' },
            { date: '2024-04-05', amount: 91.67, status: 'PARTIAL' }
        ]
    },
    {
        id: 'L002',
        farmerId: 'F001',
        amount: 5000,
        interestRate: 9.0,
        duration: '12 months',
        durationMonths: 12,
        status: 'PENDING',
        purpose: 'Equipment',
        requestDate: '2024-02-07',
        approvalDate: null,
        dueDate: null,
        amountPaid: 0,
        monthlyPayment: 458.33,
        linkedAssessment: 'A001',
        paymentHistory: []
    },
    {
        id: 'L003',
        farmerId: 'F003',
        amount: 800,
        interestRate: 10.0,
        duration: '3 months',
        durationMonths: 3,
        status: 'COMPLETED',
        purpose: 'Labor',
        requestDate: '2023-09-01',
        approvalDate: '2023-09-02',
        dueDate: '2023-12-02',
        amountPaid: 880,
        monthlyPayment: 293.33,
        linkedAssessment: 'A004',
        paymentHistory: [
            { date: '2023-10-02', amount: 293.33, status: 'PAID' },
            { date: '2023-11-02', amount: 293.33, status: 'PAID' },
            { date: '2023-12-02', amount: 293.34, status: 'PAID' }
        ]
    },
    {
        id: 'L004',
        farmerId: 'F002',
        amount: 3000,
        interestRate: 7.5,
        duration: '9 months',
        durationMonths: 9,
        status: 'ACTIVE',
        purpose: 'Irrigation',
        requestDate: '2023-12-10',
        approvalDate: '2023-12-12',
        dueDate: '2024-09-12',
        amountPaid: 1000,
        monthlyPayment: 361.11,
        linkedAssessment: 'A003',
        paymentHistory: [
            { date: '2024-01-12', amount: 361.11, status: 'PAID' },
            { date: '2024-02-12', amount: 361.11, status: 'PAID' },
            { date: '2024-03-12', amount: 277.78, status: 'PARTIAL' }
        ]
    },
    {
        id: 'L005',
        farmerId: 'F004',
        amount: 1500,
        interestRate: 8.0,
        duration: '6 months',
        durationMonths: 6,
        status: 'REJECTED',
        purpose: 'Seeds',
        requestDate: '2024-01-05',
        approvalDate: null,
        dueDate: null,
        amountPaid: 0,
        monthlyPayment: 0,
        linkedAssessment: null,
        adminNotes: 'Insufficient credit score history',
        paymentHistory: []
    },
    {
        id: 'L006',
        farmerId: 'F006',
        amount: 2500,
        interestRate: 8.0,
        duration: '6 months',
        durationMonths: 6,
        status: 'ACTIVE',
        purpose: 'Fertilizer',
        requestDate: '2024-01-15',
        approvalDate: '2024-01-17',
        dueDate: '2024-07-17',
        amountPaid: 850,
        monthlyPayment: 450.00,
        linkedAssessment: 'A006',
        paymentHistory: [
            { date: '2024-02-17', amount: 450.00, status: 'PAID' },
            { date: '2024-03-17', amount: 400.00, status: 'PARTIAL' }
        ]
    },
    {
        id: 'L007',
        farmerId: 'F007',
        amount: 4500,
        interestRate: 7.0,
        duration: '12 months',
        durationMonths: 12,
        status: 'APPROVED',
        purpose: 'Equipment',
        requestDate: '2024-01-28',
        approvalDate: '2024-01-30',
        dueDate: '2025-01-30',
        amountPaid: 0,
        monthlyPayment: 401.25,
        linkedAssessment: 'A007',
        paymentHistory: []
    }
];

// Loan purpose options for forms
export const loanPurposes = [
    'Seeds',
    'Fertilizer',
    'Equipment',
    'Irrigation',
    'Labor',
    'Land Preparation',
    'Pest Control',
    'Other'
];

// Duration options for loan applications
export const loanDurations = [
    { label: '3 months', value: 3 },
    { label: '6 months', value: 6 },
    { label: '9 months', value: 9 },
    { label: '12 months', value: 12 }
];
