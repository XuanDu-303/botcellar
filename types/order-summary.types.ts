import { IOrderList } from "."

// SalesChartData cho biểu đồ
export interface SalesChartData {
  date: string // ví dụ: "2025/4/29"
  totalSales: number
}

// Top bán chạy category
export interface TopSalesCategory {
  _id: string // category id
  totalSales: number // số lượng sản phẩm bán
}

// Gộp MonthlySales và TopSalesProduct
export interface SalesEntry {
  label: string
  value: number
  id?: string
  image?: string
}

// Cuối cùng, kết quả trả về tổng thể
export interface OrderSummary {
  ordersCount: number
  productsCount: number
  usersCount: number
  totalSales: number
  monthlySales: SalesEntry[]
  salesChartData: SalesChartData[]
  topSalesCategories: TopSalesCategory[]
  topSalesProducts: SalesEntry[]
  latestOrders: IOrderList[]
}