import type { Types } from "mongoose";
import type { OrderStatus } from "./order.types";

export interface OrderStatusStat {
  _id: OrderStatus;
  count: number;
}

export interface SalesStat {
  _id: string;
  revenue: number;
  totalOrders: number;
}

export interface SalesStatsData {
  date: string;
  revenue: number;
  orders: number;
}

export interface InventoryStats {
  _id: null;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface TotalCustomerStat {
  totalCustomers: number;
}

export interface OrderStats {
  _id: null;
  totalRevenue: number;
  totalOrders: number;
}

export interface RecentOrder {
  _id: Types.ObjectId;
  customer: {
    fullName?: string;
    email?: string;
  };
  items: unknown[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: OrderStatus;
  createdAt: Date;
}

export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export interface InventoryStatsData {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}