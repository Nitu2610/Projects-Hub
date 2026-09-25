import { OrderItem, OrderStatus, PaymentMethod, PaymentStatus } from "./order.types";

export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export interface OrderStatusStats {
  PLACED: number;
  CONFIRMED: number;
  SHIPPED: number;
  DELIVERED: number;
  CANCELLED: number;
}

export interface SalesOverview {
  date: string;
  revenue: number;
  orders: number;
}

export interface InventoryStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface RecentOrder {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
  };
}

export interface DashboardData {
  overview: DashboardOverview;
  orderStatusStats: OrderStatusStats;
  salesOverview: SalesOverview[];
  inventoryStats: InventoryStats;
  recentOrders: RecentOrder[];
}