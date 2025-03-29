import { Order } from '@/lib/types/order';

export const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => ({
  id: `ORD-${(i + 1).toString().padStart(5, '0')}`,
  customerName: `Customer ${i + 1}`,
  customerEmail: `customer${i + 1}@example.com`,
  status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][
    Math.floor(Math.random() * 5)
  ] as Order['status'],
  items: [
    {
      id: `ITEM-${i}-1`,
      productId: `PROD-${i}-1`,
      productName: `Product ${i}-1`,
      quantity: Math.floor(Math.random() * 5) + 1,
      unitPrice: Math.floor(Math.random() * 100) + 10,
      totalPrice: 0, // Calculated below
    },
  ].map(item => ({
    ...item,
    totalPrice: item.quantity * item.unitPrice,
  })),
  subtotal: 0, // Calculated below
  tax: 0, // Calculated below
  total: 0, // Calculated below
  shippingAddress: `${Math.floor(Math.random() * 999) + 1} Main St\nCity, State 12345`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  updatedAt: new Date().toISOString(),
})).map(order => ({
  ...order,
  subtotal: order.items.reduce((sum, item) => sum + item.totalPrice, 0),
  tax: Math.floor(order.items.reduce((sum, item) => sum + item.totalPrice, 0) * 0.1),
  total: Math.floor(order.items.reduce((sum, item) => sum + item.totalPrice, 0) * 1.1),
}));