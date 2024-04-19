import { ProductDTO } from "@medusajs/types"

export type RestaurantDTO = {
  id: string
  handle: string
  is_open: boolean
  name: string
  description?: string
  address: string
  phone: string
  email: string
  image_url?: string
  created_at: Date
  updated_at: Date
  products?: ProductDTO[]
}

export type RestaurantAdminDTO = {
  id: string
  restaurant: RestaurantDTO
  first_name: string
  last_name: string
  email: string
  created_at: Date
  updated_at: Date
}

export type RestaurantProductDTO = {
  restaurant_id: string
  product_id: string
}
