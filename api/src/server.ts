import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { seedData } from './data.js';

const app = express();
const PORT = 4000;
const JWT_SECRET = 'demo-secret-key';

app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = seedData.users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({ token, user: userWithoutPassword });
});

app.get('/api/me', authenticateToken, (req: any, res) => {
  const user = seedData.users.find(u => u.id === req.user.id);
  if (!user) return res.sendStatus(404);
  
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Distributor routes
app.get('/api/manufacturers', authenticateToken, (req: any, res) => {
  const { q = '' } = req.query;
  const filtered = seedData.manufacturers.filter(m => 
    m.name.toLowerCase().includes(q.toLowerCase())
  );
  res.json(filtered);
});

app.get('/api/manufacturers/:id/skus', authenticateToken, (req: any, res) => {
  const { id } = req.params;
  const { q = '', page = 1, pageSize = 20 } = req.query;
  
  const manufacturer = seedData.manufacturers.find(m => m.id === id);
  if (!manufacturer) return res.sendStatus(404);

  let filtered = seedData.skus.filter(s => 
    s.manufacturerId === id && 
    s.name.toLowerCase().includes(q.toLowerCase())
  );

  const total = filtered.length;
  const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
  const endIndex = startIndex + parseInt(pageSize);
  filtered = filtered.slice(startIndex, endIndex);

  res.json({
    data: filtered,
    pagination: {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      total,
      totalPages: Math.ceil(total / parseInt(pageSize))
    }
  });
});

app.post('/api/orders', authenticateToken, (req: any, res) => {
  const { manufacturerId, items } = req.body;
  const user = seedData.users.find(u => u.id === req.user.id);
  
  if (!user || user.role !== 'distributor') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const orderItems = items.map((item: any) => {
    const sku = seedData.skus.find(s => s.id === item.skuId);
    if (!sku) throw new Error(`SKU ${item.skuId} not found`);
    
    const line_total = item.qty * sku.rate;
    const line_gst = line_total * (sku.gstPercent / 100);
    const line_grand_total = line_total + line_gst;
    
    return {
      skuId: item.skuId,
      skuName: sku.name,
      qty: item.qty,
      rate: sku.rate,
      line_total,
      line_gst,
      line_grand_total
    };
  });

  const order_total = orderItems.reduce((sum, item) => sum + item.line_total, 0);
  const order_gst = orderItems.reduce((sum, item) => sum + item.line_gst, 0);
  const order_grand_total = order_total + order_gst;

  const order = {
    id: `ORD-${Date.now()}`,
    distributorId: user.id,
    distributorName: user.name,
    manufacturerId,
    manufacturerName: seedData.manufacturers.find(m => m.id === manufacturerId)?.name || '',
    status: 'placed',
    items: orderItems,
    order_total,
    order_gst,
    order_grand_total,
    createdAt: new Date().toISOString()
  };

  seedData.orders.push(order);
  res.json(order);
});

// Manufacturer routes
app.get('/api/m/orders', authenticateToken, (req: any, res) => {
  const { status } = req.query;
  const user = seedData.users.find(u => u.id === req.user.id);
  
  if (!user || user.role !== 'manufacturer') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  let filtered = seedData.orders.filter(o => o.manufacturerId === user.id);
  if (status) {
    filtered = filtered.filter(o => o.status === status);
  }
  
  res.json(filtered);
});

app.get('/api/m/orders/:id', authenticateToken, (req: any, res) => {
  const { id } = req.params;
  const order = seedData.orders.find(o => o.id === id);
  
  if (!order) return res.sendStatus(404);
  res.json(order);
});

app.post('/api/m/orders/:id/accept', authenticateToken, (req: any, res) => {
  const { id } = req.params;
  const order = seedData.orders.find(o => o.id === id);
  
  if (!order) return res.sendStatus(404);
  
  order.status = 'accepted';
  res.json(order);
});

app.post('/api/m/orders/:id/reject', authenticateToken, (req: any, res) => {
  const { id } = req.params;
  const order = seedData.orders.find(o => o.id === id);
  
  if (!order) return res.sendStatus(404);
  
  order.status = 'rejected';
  res.json(order);
});

app.post('/api/m/orders/:id/fulfill', authenticateToken, (req: any, res) => {
  const { id } = req.params;
  const order = seedData.orders.find(o => o.id === id);
  
  if (!order) return res.sendStatus(404);
  
  order.status = 'fulfilled';
  
  // Update inventory balances
  order.items.forEach(item => {
    const balance = seedData.inventoryBalances.find(b => 
      b.distributorId === order.distributorId && b.skuId === item.skuId
    );
    
    if (balance) {
      balance.onHand += item.qty;
    } else {
      seedData.inventoryBalances.push({
        distributorId: order.distributorId,
        skuId: item.skuId,
        onHand: item.qty
      });
    }
  });
  
  res.json(order);
});

// Admin routes
app.get('/api/admin/users', authenticateToken, (req: any, res) => {
  const user = seedData.users.find(u => u.id === req.user.id);
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const users = seedData.users.map(({ password, ...user }) => user);
  res.json(users);
});

app.post('/api/admin/users/:id/disable', authenticateToken, (req: any, res) => {
  const { id } = req.params;
  const user = seedData.users.find(u => u.id === id);
  
  if (!user) return res.sendStatus(404);
  
  user.disabled = !user.disabled;
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Inventory route for distributors
app.get('/api/inventory', authenticateToken, (req: any, res) => {
  const user = seedData.users.find(u => u.id === req.user.id);
  
  if (!user || user.role !== 'distributor') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const inventory = seedData.inventoryBalances
    .filter(b => b.distributorId === user.id)
    .map(balance => {
      const sku = seedData.skus.find(s => s.id === balance.skuId);
      return {
        ...balance,
        skuName: sku?.name || 'Unknown SKU',
        skuCode: sku?.code || '',
        rate: sku?.rate || 0
      };
    });
  
  res.json(inventory);
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});