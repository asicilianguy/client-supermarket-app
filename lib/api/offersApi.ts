import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"

export interface Offer {
  _id: string
  productName: string
  productQuantity?: string
  offerPrice: number
  previousPrice?: number
  discountPercentage?: number
  pricePerKg?: number
  pricePerLiter?: number
  offerStartDate: string
  offerEndDate: string
  brand?: string
  supermarketAisle: string[]
  chainName: string
  createdAt: string
  updatedAt: string
}

export interface OffersResponse {
  offers: Offer[]
  totalPages: number
  currentPage: number
}

export interface ProductOffers {
  productName: string
  offers: Offer[]
}

export interface GetOffersParams {
  page?: number
  limit?: number
  chainName?: string
  supermarketAisle?: string
  brand?: string
  sort?: "price" | "discount" | "endDate"
}

export interface SearchOffersParams {
  query: string
  page?: number
  limit?: number
}

export const offersApi = createApi({
  reducerPath: "offersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://server-supermarket-app.onrender.com/api/offers",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("x-auth-token", token)
      }
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes: ["Offer", "Aisle", "Brand"],
  endpoints: (builder) => ({
    // Get all offers with filters
    getAllOffers: builder.query<Offer[], GetOffersParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString())
          }
        })
        return `/?${searchParams.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Offer" as const, id: _id })), { type: "Offer", id: "LIST" }]
          : [{ type: "Offer", id: "LIST" }],
      // Transform response to extract offers array
      transformResponse: (response: OffersResponse) => response.offers,
    }),

    // Get offers by supermarket
    getOffersBySupermarket: builder.query<Offer[], { chainName: string; page?: number; limit?: number; sort?: string }>(
      {
        query: ({ chainName, page = 1, limit = 20, sort }) => {
          const searchParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
          })
          if (sort) searchParams.append("sort", sort)
          return `/supermarket/${chainName}?${searchParams.toString()}`
        },
        providesTags: (result, error, { chainName }) =>
          result
            ? [
                ...result.map(({ _id }) => ({ type: "Offer" as const, id: _id })),
                { type: "Offer", id: `SUPERMARKET-${chainName}` },
              ]
            : [{ type: "Offer", id: `SUPERMARKET-${chainName}` }],
        transformResponse: (response: OffersResponse) => response.offers,
      },
    ),

    // Search offers
    searchOffers: builder.query<Offer[], SearchOffersParams>({
      query: ({ query, page = 1, limit = 20 }) => {
        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        return `/search/${encodeURIComponent(query)}?${searchParams.toString()}`
      },
      providesTags: (result, error, { query }) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Offer" as const, id: _id })),
              { type: "Offer", id: `SEARCH-${query}` },
            ]
          : [{ type: "Offer", id: `SEARCH-${query}` }],
      transformResponse: (response: OffersResponse) => response.offers,
    }),

    // Get offers for shopping list
    getOffersForShoppingList: builder.query<ProductOffers[], void>({
      query: () => "/shopping-list",
      providesTags: [{ type: "Offer", id: "SHOPPING-LIST" }],
    }),

    // Get best offers
    getBestOffers: builder.query<Offer[], { limit?: number }>({
      query: ({ limit = 20 } = {}) => `/best?limit=${limit}`,
      providesTags: [{ type: "Offer", id: "BEST" }],
    }),

    // Get offers by aisle
    getOffersByAisle: builder.query<Offer[], { aisle: string; page?: number; limit?: number; chainName?: string }>({
      query: ({ aisle, page = 1, limit = 20, chainName }) => {
        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        if (chainName) searchParams.append("chainName", chainName)
        return `/aisle/${encodeURIComponent(aisle)}?${searchParams.toString()}`
      },
      providesTags: (result, error, { aisle }) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Offer" as const, id: _id })), { type: "Offer", id: `AISLE-${aisle}` }]
          : [{ type: "Offer", id: `AISLE-${aisle}` }],
      transformResponse: (response: OffersResponse) => response.offers,
    }),

    // Get offers by brand
    getOffersByBrand: builder.query<Offer[], { brand: string; page?: number; limit?: number }>({
      query: ({ brand, page = 1, limit = 20 }) => {
        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        return `/brand/${encodeURIComponent(brand)}?${searchParams.toString()}`
      },
      providesTags: (result, error, { brand }) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Offer" as const, id: _id })), { type: "Offer", id: `BRAND-${brand}` }]
          : [{ type: "Offer", id: `BRAND-${brand}` }],
      transformResponse: (response: OffersResponse) => response.offers,
    }),

    // Get all aisles
    getAllAisles: builder.query<string[], void>({
      query: () => "/aisles",
      providesTags: [{ type: "Aisle", id: "LIST" }],
    }),

    // Get all brands
    getAllBrands: builder.query<string[], void>({
      query: () => "/brands",
      providesTags: [{ type: "Brand", id: "LIST" }],
    }),
  }),
})

export const {
  useGetAllOffersQuery,
  useGetOffersBySupermarketQuery,
  useSearchOffersQuery,
  useGetOffersForShoppingListQuery,
  useGetBestOffersQuery,
  useGetOffersByAisleQuery,
  useGetOffersByBrandQuery,
  useGetAllAislesQuery,
  useGetAllBrandsQuery,
} = offersApi
