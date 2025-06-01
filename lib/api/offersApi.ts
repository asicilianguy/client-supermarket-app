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
    // GET /api/offers/ - getAllOffers
    getAllOffers: builder.query<Offer[], GetOffersParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString())
          }
        })
        const queryString = searchParams.toString()
        console.log("🔍 getAllOffers query:", `/?${queryString}`)
        return `/?${queryString}`
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Offer" as const, id: _id })), { type: "Offer", id: "LIST" }]
          : [{ type: "Offer", id: "LIST" }],
      transformResponse: (response: OffersResponse) => {
        console.log("✅ getAllOffers response:", response)
        return response.offers
      },
      transformErrorResponse: (response: any) => {
        console.error("❌ getAllOffers error:", response)
        return response
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled
          // Toast di successo solo se ci sono risultati significativi
          if (result.data.length > 0) {
            // Non mostriamo toast per questa query perché è troppo frequente
          }
        } catch (error: any) {
          // Toast di errore
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nel caricamento offerte",
              description: error?.error?.data?.message || "Impossibile caricare le offerte",
            })
          }
        }
      },
    }),

    // GET /api/offers/supermarket/:chainName - getOffersBySupermarket
    getOffersBySupermarket: builder.query<Offer[], { chainName: string; page?: number; limit?: number; sort?: string }>(
      {
        query: ({ chainName, page = 1, limit = 20, sort }) => {
          const searchParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
          })
          if (sort) searchParams.append("sort", sort)
          const endpoint = `/supermarket/${chainName}?${searchParams.toString()}`
          console.log("🏪 getOffersBySupermarket query:", endpoint)
          return endpoint
        },
        providesTags: (result, error, { chainName }) =>
          result
            ? [
                ...result.map(({ _id }) => ({ type: "Offer" as const, id: _id })),
                { type: "Offer", id: `SUPERMARKET-${chainName}` },
              ]
            : [{ type: "Offer", id: `SUPERMARKET-${chainName}` }],
        transformResponse: (response: OffersResponse) => {
          console.log("✅ getOffersBySupermarket response:", response)
          return response.offers
        },
        transformErrorResponse: (response: any) => {
          console.error("❌ getOffersBySupermarket error:", response)
          return response
        },
        async onQueryStarted(arg, { queryFulfilled }) {
          try {
            await queryFulfilled
          } catch (error: any) {
            if (typeof window !== "undefined") {
              const { toast } = await import("@/hooks/use-toast")
              toast({
                variant: "destructive",
                title: "Errore nel caricamento",
                description: `Impossibile caricare le offerte di ${arg.chainName}`,
              })
            }
          }
        },
      },
    ),

    // GET /api/offers/search/:query - searchOffers
    searchOffers: builder.query<Offer[], SearchOffersParams>({
      query: ({ query, page = 1, limit = 20 }) => {
        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        const endpoint = `/search/${encodeURIComponent(query)}?${searchParams.toString()}`
        console.log("🔍 searchOffers query:", endpoint)
        return endpoint
      },
      providesTags: (result, error, { query }) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Offer" as const, id: _id })),
              { type: "Offer", id: `SEARCH-${query}` },
            ]
          : [{ type: "Offer", id: `SEARCH-${query}` }],
      transformResponse: (response: OffersResponse) => {
        console.log("✅ searchOffers response:", response)
        return response.offers
      },
      transformErrorResponse: (response: any) => {
        console.error("❌ searchOffers error:", response)
        return response
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled
          if (typeof window !== "undefined" && result.data.length === 0) {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              title: "Nessun risultato",
              description: `Nessuna offerta trovata per "${arg.query}"`,
            })
          }
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nella ricerca",
              description: `Impossibile cercare "${arg.query}"`,
            })
          }
        }
      },
    }),

    // GET /api/offers/shopping-list - getOffersForShoppingList
    getOffersForShoppingList: builder.query<ProductOffers[], void>({
      query: () => {
        console.log("🛒 getOffersForShoppingList query: /shopping-list")
        return "/shopping-list"
      },
      providesTags: [{ type: "Offer", id: "SHOPPING-LIST" }],
      transformResponse: (response: ProductOffers[]) => {
        console.log("✅ getOffersForShoppingList response:", response)
        return response
      },
      transformErrorResponse: (response: any) => {
        console.error("❌ getOffersForShoppingList error:", response)
        return response
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled
          if (typeof window !== "undefined" && result.data.length > 0) {
            const totalOffers = result.data.reduce((sum, product) => sum + product.offers.length, 0)
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "success",
              title: "🎯 Offerte aggiornate!",
              description: `Trovate ${totalOffers} offerte per i tuoi prodotti`,
            })
          }
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nel caricamento offerte",
              description: "Impossibile caricare le offerte per la tua lista",
            })
          }
        }
      },
    }),

    // GET /api/offers/best - getBestOffers
    getBestOffers: builder.query<Offer[], { limit?: number }>({
      query: ({ limit = 20 } = {}) => {
        const endpoint = `/best?limit=${limit}`
        console.log("⭐ getBestOffers query:", endpoint)
        return endpoint
      },
      providesTags: [{ type: "Offer", id: "BEST" }],
      transformResponse: (response: Offer[]) => {
        console.log("✅ getBestOffers response:", response)
        return response
      },
      transformErrorResponse: (response: any) => {
        console.error("❌ getBestOffers error:", response)
        return response
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled
          if (typeof window !== "undefined" && result.data.length > 0) {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "success",
              title: "⭐ Migliori offerte caricate!",
              description: `${result.data.length} offerte imperdibili disponibili`,
            })
          }
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nel caricamento",
              description: "Impossibile caricare le migliori offerte",
            })
          }
        }
      },
    }),

    // GET /api/offers/aisle/:aisle - getOffersByAisle
    getOffersByAisle: builder.query<Offer[], { aisle: string; page?: number; limit?: number; chainName?: string }>({
      query: ({ aisle, page = 1, limit = 20, chainName }) => {
        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        if (chainName) searchParams.append("chainName", chainName)
        const endpoint = `/aisle/${encodeURIComponent(aisle)}?${searchParams.toString()}`
        console.log("🏷️ getOffersByAisle query:", endpoint)
        return endpoint
      },
      providesTags: (result, error, { aisle }) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Offer" as const, id: _id })), { type: "Offer", id: `AISLE-${aisle}` }]
          : [{ type: "Offer", id: `AISLE-${aisle}` }],
      transformResponse: (response: OffersResponse) => {
        console.log("✅ getOffersByAisle response:", response)
        return response.offers
      },
      transformErrorResponse: (response: any) => {
        console.error("❌ getOffersByAisle error:", response)
        return response
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nel caricamento",
              description: `Impossibile caricare le offerte del reparto ${arg.aisle}`,
            })
          }
        }
      },
    }),

    // GET /api/offers/brand/:brand - getOffersByBrand
    getOffersByBrand: builder.query<Offer[], { brand: string; page?: number; limit?: number }>({
      query: ({ brand, page = 1, limit = 20 }) => {
        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        const endpoint = `/brand/${encodeURIComponent(brand)}?${searchParams.toString()}`
        console.log("🏷️ getOffersByBrand query:", endpoint)
        return endpoint
      },
      providesTags: (result, error, { brand }) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Offer" as const, id: _id })), { type: "Offer", id: `BRAND-${brand}` }]
          : [{ type: "Offer", id: `BRAND-${brand}` }],
      transformResponse: (response: OffersResponse) => {
        console.log("✅ getOffersByBrand response:", response)
        return response.offers
      },
      transformErrorResponse: (response: any) => {
        console.error("❌ getOffersByBrand error:", response)
        return response
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nel caricamento",
              description: `Impossibile caricare le offerte di ${arg.brand}`,
            })
          }
        }
      },
    }),

    // GET /api/offers/aisles - getAllAisles
    getAllAisles: builder.query<string[], void>({
      query: () => {
        console.log("📂 getAllAisles query: /aisles")
        return "/aisles"
      },
      providesTags: [{ type: "Aisle", id: "LIST" }],
      transformResponse: (response: string[]) => {
        console.log("✅ getAllAisles response:", response)
        return response
      },
      transformErrorResponse: (response: any) => {
        console.error("❌ getAllAisles error:", response)
        return response
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nel caricamento",
              description: "Impossibile caricare i reparti disponibili",
            })
          }
        }
      },
    }),

    // GET /api/offers/brands - getAllBrands
    getAllBrands: builder.query<string[], void>({
      query: () => {
        console.log("🏷️ getAllBrands query: /brands")
        return "/brands"
      },
      providesTags: [{ type: "Brand", id: "LIST" }],
      transformResponse: (response: string[]) => {
        console.log("✅ getAllBrands response:", response)
        return response
      },
      transformErrorResponse: (response: any) => {
        console.error("❌ getAllBrands error:", response)
        return response
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: any) {
          if (typeof window !== "undefined") {
            const { toast } = await import("@/hooks/use-toast")
            toast({
              variant: "destructive",
              title: "Errore nel caricamento",
              description: "Impossibile caricare le marche disponibili",
            })
          }
        }
      },
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
