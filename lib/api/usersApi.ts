import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"

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
    }),
    deleteAccount: builder.mutation<{ msg: string }, void>({
      query: () => ({
        url: "/account",
        method: "DELETE",
      }),
      invalidatesTags: ["Profile", "ShoppingList"],
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
      invalidatesTags: [{ type: "ShoppingList", id: "LIST" }],
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
        } catch {
          patchResult.undo()
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
        ],
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
        } catch {
          patchResult.undo()
        }
      },
    }),
    clearShoppingList: builder.mutation<{ msg: string }, void>({
      query: () => ({
        url: "/shopping-list/clear",
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ShoppingList", id: "LIST" }],
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
        } catch {
          patchResult.undo()
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
        } catch {
          patchResult.undo()
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
