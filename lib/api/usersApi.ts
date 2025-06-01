import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"
import { toast } from "@/hooks/use-toast"

export interface User {
  _id: string
  name: string
  phoneNumber: string
  frequentedSupermarkets: string[]
  shoppingList: ShoppingListItem[]
  createdAt: string
  updatedAt: string
}

export interface ShoppingListItem {
  _id: string
  productName: string
  notes?: string
  productPins: string[]
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileRequest {
  name: string
}

export interface UpdateSupermarketsRequest {
  frequentedSupermarkets: string[]
}

export interface AddToShoppingListRequest {
  productName: string
  notes?: string
}

export interface UpdateShoppingListItemRequest {
  productName?: string
  notes?: string
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://server-supermarket-app.onrender.com/api/users",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("x-auth-token", token)
      }
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes: ["Profile", "ShoppingList"],
  endpoints: (builder) => ({
    // Profile endpoints
    getUserProfile: builder.query<User, void>({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),

    updateUserProfile: builder.mutation<{ msg: string; user: User }, UpdateProfileRequest>({
      query: (data) => ({
        url: "/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast({
            variant: "success",
            title: "✅ Profilo aggiornato!",
            description: "Le tue informazioni sono state salvate con successo",
          })
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Errore nell'aggiornamento",
            description: error?.error?.data?.message || "Impossibile aggiornare il profilo",
          })
        }
      },
    }),

    updateFrequentedSupermarkets: builder.mutation<
      { msg: string; frequentedSupermarkets: string[] },
      UpdateSupermarketsRequest
    >({
      query: (data) => ({
        url: "/supermarkets",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast({
            variant: "success",
            title: "🏪 Supermercati aggiornati!",
            description: `Hai selezionato ${arg.frequentedSupermarkets.length} supermercati`,
          })
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Errore nell'aggiornamento",
            description: error?.error?.data?.message || "Impossibile aggiornare i supermercati",
          })
        }
      },
    }),

    deleteAccount: builder.mutation<{ msg: string }, void>({
      query: () => ({
        url: "/account",
        method: "DELETE",
      }),
      invalidatesTags: ["Profile", "ShoppingList"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast({
            variant: "success",
            title: "Account eliminato",
            description: "Il tuo account è stato eliminato con successo",
          })
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Errore nell'eliminazione",
            description: error?.error?.data?.message || "Impossibile eliminare l'account",
          })
        }
      },
    }),

    // Shopping List endpoints
    getShoppingList: builder.query<ShoppingListItem[], void>({
      query: () => "/shopping-list",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "ShoppingList" as const, id: _id })),
              { type: "ShoppingList", id: "LIST" },
            ]
          : [{ type: "ShoppingList", id: "LIST" }],
    }),

    addToShoppingList: builder.mutation<ShoppingListItem, AddToShoppingListRequest>({
      query: (data) => ({
        url: "/shopping-list",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "ShoppingList", id: "LIST" },
        { type: "Offer", id: "SHOPPING-LIST" }, // ✅ Invalida anche le offerte della shopping list
      ],
      // Optimistic update
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData("getShoppingList", undefined, (draft) => {
            const tempId = `temp-${Date.now()}`
            draft.push({
              _id: tempId,
              productName: arg.productName,
              notes: arg.notes || "",
              productPins: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          }),
        )
        try {
          await queryFulfilled
          toast({
            variant: "success",
            title: "✅ Prodotto aggiunto!",
            description: `${arg.productName} è stato aggiunto alla tua lista`,
          })
        } catch (error: any) {
          patchResult.undo()
          toast({
            variant: "destructive",
            title: "Errore nell'aggiunta",
            description: error?.error?.data?.message || "Impossibile aggiungere il prodotto",
          })
        }
      },
    }),

    updateShoppingListItem: builder.mutation<ShoppingListItem, { itemId: string; data: UpdateShoppingListItemRequest }>(
      {
        query: ({ itemId, data }) => ({
          url: `/shopping-list/${itemId}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { itemId }) => [
          { type: "ShoppingList", id: itemId },
          { type: "ShoppingList", id: "LIST" },
          { type: "Offer", id: "SHOPPING-LIST" }, // ✅ Invalida anche le offerte della shopping list
        ],
        async onQueryStarted(arg, { queryFulfilled }) {
          try {
            await queryFulfilled
            toast({
              variant: "success",
              title: "✅ Prodotto aggiornato!",
              description: "Le modifiche sono state salvate",
            })
          } catch (error: any) {
            toast({
              variant: "destructive",
              title: "Errore nell'aggiornamento",
              description: error?.error?.data?.message || "Impossibile aggiornare il prodotto",
            })
          }
        },
      },
    ),

    removeFromShoppingList: builder.mutation<{ msg: string }, string>({
      query: (itemId) => ({
        url: `/shopping-list/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, itemId) => [
        { type: "ShoppingList", id: itemId },
        { type: "ShoppingList", id: "LIST" },
        { type: "Offer", id: "SHOPPING-LIST" }, // ✅ Invalida anche le offerte della shopping list
      ],
      // Optimistic update
      async onQueryStarted(itemId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData("getShoppingList", undefined, (draft) => {
            const index = draft.findIndex((item) => item._id === itemId)
            if (index !== -1) {
              draft.splice(index, 1)
            }
          }),
        )
        try {
          await queryFulfilled
          toast({
            variant: "success",
            title: "🗑️ Prodotto rimosso!",
            description: "Il prodotto è stato rimosso dalla lista",
          })
        } catch (error: any) {
          patchResult.undo()
          toast({
            variant: "destructive",
            title: "Errore nella rimozione",
            description: error?.error?.data?.message || "Impossibile rimuovere il prodotto",
          })
        }
      },
    }),

    clearShoppingList: builder.mutation<{ msg: string }, void>({
      query: () => ({
        url: "/shopping-list/clear",
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "ShoppingList", id: "LIST" },
        { type: "Offer", id: "SHOPPING-LIST" }, // ✅ Invalida anche le offerte della shopping list
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast({
            variant: "success",
            title: "🧹 Lista svuotata!",
            description: "Tutti i prodotti sono stati rimossi dalla lista",
          })
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Errore nello svuotamento",
            description: error?.error?.data?.message || "Impossibile svuotare la lista",
          })
        }
      },
    }),

    // Product Pins endpoints
    pinProductToShoppingItem: builder.mutation<ShoppingListItem, { itemId: string; offerId: string }>({
      query: ({ itemId, offerId }) => ({
        url: `/shopping-list/${itemId}/pin/${offerId}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { itemId }) => [
        { type: "ShoppingList", id: itemId },
        { type: "ShoppingList", id: "LIST" },
      ],
      // Optimistic update
      async onQueryStarted({ itemId, offerId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData("getShoppingList", undefined, (draft) => {
            const item = draft.find((item) => item._id === itemId)
            if (item && !item.productPins.includes(offerId)) {
              item.productPins.push(offerId)
            }
          }),
        )
        try {
          await queryFulfilled
          toast({
            variant: "success",
            title: "📌 Offerta selezionata!",
            description: "L'offerta è stata aggiunta ai tuoi preferiti",
          })
        } catch (error: any) {
          patchResult.undo()
          toast({
            variant: "destructive",
            title: "Errore nella selezione",
            description: error?.error?.data?.message || "Impossibile selezionare l'offerta",
          })
        }
      },
    }),

    unpinProductFromShoppingItem: builder.mutation<ShoppingListItem, { itemId: string; offerId: string }>({
      query: ({ itemId, offerId }) => ({
        url: `/shopping-list/${itemId}/unpin/${offerId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { itemId }) => [
        { type: "ShoppingList", id: itemId },
        { type: "ShoppingList", id: "LIST" },
      ],
      // Optimistic update
      async onQueryStarted({ itemId, offerId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData("getShoppingList", undefined, (draft) => {
            const item = draft.find((item) => item._id === itemId)
            if (item) {
              item.productPins = item.productPins.filter((pin) => pin !== offerId)
            }
          }),
        )
        try {
          await queryFulfilled
          toast({
            variant: "success",
            title: "📌 Offerta rimossa!",
            description: "L'offerta è stata rimossa dai preferiti",
          })
        } catch (error: any) {
          patchResult.undo()
          toast({
            variant: "destructive",
            title: "Errore nella rimozione",
            description: error?.error?.data?.message || "Impossibile rimuovere l'offerta",
          })
        }
      },
    }),
  }),
})

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateFrequentedSupermarketsMutation,
  useDeleteAccountMutation,
  useGetShoppingListQuery,
  useAddToShoppingListMutation,
  useUpdateShoppingListItemMutation,
  useRemoveFromShoppingListMutation,
  useClearShoppingListMutation,
  usePinProductToShoppingItemMutation,
  useUnpinProductFromShoppingItemMutation,
} = usersApi
