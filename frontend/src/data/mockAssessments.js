// CROP ASSESSMENTS (7 instances with varied crop types and health scores)
export const mockAssessments = [
    {
        id: 'A001',
        farmerId: 'F001',
        cropType: 'maize',
        healthScore: 0.87,
        yieldEstimate: 'High',
        riskLevel: 'Low',
        images: [
            'https://images.unsplash.com/photo-1554402100-8d1d9f3dff80?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1701326786998-3688beceadda?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop'
        ],
        assessmentDate: '2024-02-01',
        areaCovered: '1.2 acres',
        recommendations: [
            'Apply nitrogen fertilizer within 2 weeks',
            'Monitor for stem borers - early detection crucial',
            'Maintain current irrigation schedule'
        ],
        creditScoreImpact: 45
    },
    {
        id: 'A002',
        farmerId: 'F001',
        cropType: 'beans',
        healthScore: 0.65,
        yieldEstimate: 'Medium',
        riskLevel: 'Medium',
        images: [
            'https://images.unsplash.com/photo-1700573230908-c655e1e7c27f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhbnMlMjBwbGFudHxlbnwwfHwwfHx8MA%3D%3D',
            'https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxlZ3VtZXN8ZW58MHx8MHx8fDA%3D', 
            'https://images.unsplash.com/photo-1513868853742-e7fb786265db?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJlYW5zfGVufDB8fDB8fHww'
        ],
        assessmentDate: '2023-11-15',
        areaCovered: '0.5 acres',
        recommendations: [
            'Improve field drainage immediately',
            'Check for fungal infection signs',
            'Consider crop rotation next season'
        ],
        creditScoreImpact: 20
    },
    {
        id: 'A003',
        farmerId: 'F002',
        cropType: 'wheat',
        healthScore: 0.92,
        yieldEstimate: 'High',
        riskLevel: 'Low',
        images: [
            'https://plus.unsplash.com/premium_photo-1753983551415-ff1d41b67ed4?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1701326786998-3688beceadda?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        assessmentDate: '2024-01-20',
        areaCovered: '4.0 acres',
        recommendations: [
            'Maintain irrigation schedule',
            'Prepare harvesting equipment',
            'Excellent crop condition - premium pricing possible'
        ],
        creditScoreImpact: 55
    },
    {
        id: 'A004',
        farmerId: 'F003',
        cropType: 'sorghum',
        healthScore: 0.55,
        yieldEstimate: 'Low',
        riskLevel: 'High',
        images: [
            'https://images.unsplash.com/photo-1595855759920-86582396bbc3?w=400&h=300&fit=crop'
        ],
        assessmentDate: '2024-02-05',
        areaCovered: '1.0 acres',
        recommendations: [
            'Treat for pests immediately - critical',
            'Apply micronutrient supplements',
            'Consider partial replanting if treatment fails'
        ],
        creditScoreImpact: 10
    },
    {
        id: 'A005',
        farmerId: 'F005',
        cropType: 'maize',
        healthScore: 0.95,
        yieldEstimate: 'High',
        riskLevel: 'Low',
        images: [
            'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop'
        ],
        assessmentDate: '2024-01-10',
        areaCovered: '8.0 acres',
        recommendations: [
            'Prepare for harvest in 3-4 weeks',
            'Outstanding crop health - document for records',
            'Consider premium buyer partnerships'
        ],
        creditScoreImpact: 60
    },
    {
        id: 'A006',
        farmerId: 'F006',
        cropType: 'cassava',
        healthScore: 0.78,
        yieldEstimate: 'Medium',
        riskLevel: 'Low',
        images: [
            'https://images.unsplash.com/photo-1518977676601-b53f82ber?w=400&h=300&fit=crop'
        ],
        assessmentDate: '2024-01-25',
        areaCovered: '2.5 acres',
        recommendations: [
            'Continue current farming practices',
            'Monitor soil moisture levels',
            'Harvest timing optimal in 6-8 weeks'
        ],
        creditScoreImpact: 35
    },
    {
        id: 'A007',
        farmerId: 'F007',
        cropType: 'rice',
        healthScore: 0.82,
        yieldEstimate: 'High',
        riskLevel: 'Low',
        images: [
            'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
        ],
        assessmentDate: '2024-02-03',
        areaCovered: '5.0 acres',
        recommendations: [
            'Water management is excellent',
            'Apply final fertilizer dose',
            'Expected premium quality rice'
        ],
        creditScoreImpact: 50
    }
];
