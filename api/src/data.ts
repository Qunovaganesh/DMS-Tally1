export const seedData = {
  users: [
    {
      id: 'admin-1',
      email: 'admin@demo.com',
      password: '123456',
      name: 'Admin User',
      role: 'admin',
      disabled: false
    },
    {
      id: 'manu-1',
      email: 'manu@demo.com',
      password: '123456',
      name: 'ABC Manufacturing',
      role: 'manufacturer',
      disabled: false
    },
    {
      id: 'dist-1',
      email: 'dist@demo.com',
      password: '123456',
      name: 'XYZ Distributors',
      role: 'distributor',
      disabled: false
    }
  ],

  manufacturers: [
    {
      id: 'manu-1',
      name: 'ABC Manufacturing',
      email: 'manu@demo.com',
      phone: '+91 98765 43210',
      address: 'Industrial Area, Mumbai'
    },
    {
      id: 'manu-2',
      name: 'DEF Industries',
      email: 'contact@def.com',
      phone: '+91 87654 32109',
      address: 'Sector 18, Gurgaon'
    }
  ],

  distributors: [
    {
      id: 'dist-1',
      name: 'XYZ Distributors',
      email: 'dist@demo.com',
      phone: '+91 76543 21098',
      address: 'Commercial Complex, Delhi'
    }
  ],

  skus: [
    // ABC Manufacturing SKUs
    {
      id: 'sku-1',
      manufacturerId: 'manu-1',
      code: 'ABC001',
      name: 'Premium Widget A',
      category: 'Electronics',
      rate: 150.00,
      gstPercent: 18,
      unit: 'PCS'
    },
    {
      id: 'sku-2',
      manufacturerId: 'manu-1',
      code: 'ABC002',
      name: 'Standard Widget B',
      category: 'Electronics',
      rate: 85.50,
      gstPercent: 18,
      unit: 'PCS'
    },
    {
      id: 'sku-3',
      manufacturerId: 'manu-1',
      code: 'ABC003',
      name: 'Deluxe Component X',
      category: 'Components',
      rate: 220.75,
      gstPercent: 18,
      unit: 'PCS'
    },
    {
      id: 'sku-4',
      manufacturerId: 'manu-1',
      code: 'ABC004',
      name: 'Basic Tool Set',
      category: 'Tools',
      rate: 450.00,
      gstPercent: 18,
      unit: 'SET'
    },
    {
      id: 'sku-5',
      manufacturerId: 'manu-1',
      code: 'ABC005',
      name: 'Professional Kit',
      category: 'Tools',
      rate: 1250.00,
      gstPercent: 18,
      unit: 'KIT'
    },
    // DEF Industries SKUs
    {
      id: 'sku-6',
      manufacturerId: 'manu-2',
      code: 'DEF001',
      name: 'Industrial Pump',
      category: 'Machinery',
      rate: 3500.00,
      gstPercent: 18,
      unit: 'PCS'
    },
    {
      id: 'sku-7',
      manufacturerId: 'manu-2',
      code: 'DEF002',
      name: 'Motor Assembly',
      category: 'Machinery',
      rate: 2800.00,
      gstPercent: 18,
      unit: 'PCS'
    },
    {
      id: 'sku-8',
      manufacturerId: 'manu-2',
      code: 'DEF003',
      name: 'Control Panel',
      category: 'Electronics',
      rate: 1850.00,
      gstPercent: 18,
      unit: 'PCS'
    },
    {
      id: 'sku-9',
      manufacturerId: 'manu-2',
      code: 'DEF004',
      name: 'Safety Switch',
      category: 'Components',
      rate: 125.00,
      gstPercent: 18,
      unit: 'PCS'
    },
    {
      id: 'sku-10',
      manufacturerId: 'manu-2',
      code: 'DEF005',
      name: 'Maintenance Kit',
      category: 'Tools',
      rate: 750.00,
      gstPercent: 18,
      unit: 'KIT'
    }
  ],

  orders: [] as any[],

  inventoryBalances: [
    {
      distributorId: 'dist-1',
      skuId: 'sku-1',
      onHand: 25
    },
    {
      distributorId: 'dist-1',
      skuId: 'sku-2',
      onHand: 50
    },
    {
      distributorId: 'dist-1',
      skuId: 'sku-3',
      onHand: 15
    }
  ]
};