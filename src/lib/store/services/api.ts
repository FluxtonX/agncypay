import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // On client side, NEXT_PUBLIC_API_BASE_URL is available
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      // Pull token from the auth slice
      const state = getState() as { auth: { token: string | null } };
      let token = state.auth?.token;
      
      // Fallback to localStorage to prevent race conditions during hydration
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('agncypay_token');
      }

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Agency', 'Invitation', 'Invoice', 'Wallet', 'Talent', 'TalentInvitation', 'Notification'],
  endpoints: (builder) => ({
    // --- Agencies & Invitations ---
    getConnectedAgencies: builder.query<any[], void>({
      query: () => '/agencies/connected',
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Agency'],
    }),
    getAgencyInvitations: builder.query<any[], void>({
      query: () => '/agencies/invitations',
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Invitation'],
    }),
    inviteAgency: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/agencies/invite',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Invitation'],
    }),
    resendInvitation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/agencies/invitations/${id}/resend`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation'],
    }),
    cancelInvitation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/agencies/invitations/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation'],
    }),
    acceptInvitationSandbox: builder.mutation<any, string>({
      query: (id) => ({
        url: `/agencies/invitations/${id}/accept-sandbox`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation', 'Agency'],
    }),
    getConnectedBrands: builder.query<any[], void>({
      query: () => '/agencies/brands',
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Agency'],
    }),
    getIncomingInvitations: builder.query<any[], void>({
      query: () => '/agencies/incoming-invitations',
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Invitation'],
    }),
    acceptBrandInvitation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/agencies/invitations/${id}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation', 'Agency'],
    }),

    // --- Talents & Invitations ---
    getConnectedTalents: builder.query<any[], void>({
      query: () => '/talents/connected',
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Talent'],
    }),
    getTalentInvitations: builder.query<any[], void>({
      query: () => '/talents/invitations',
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['TalentInvitation'],
    }),
    inviteTalent: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/talents/invite',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TalentInvitation'],
    }),
    resendTalentInvitation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/talents/invitations/${id}/resend`,
        method: 'POST',
      }),
      invalidatesTags: ['TalentInvitation'],
    }),
    cancelTalentInvitation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/talents/invitations/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['TalentInvitation'],
    }),
    acceptTalentInvitationSandbox: builder.mutation<any, string>({
      query: (id) => ({
        url: `/talents/invitations/${id}/accept-sandbox`,
        method: 'POST',
      }),
      invalidatesTags: ['TalentInvitation', 'Talent'],
    }),

    // --- Unified Connections & Notifications ---
    searchUsers: builder.query<any[], string>({
      query: (query) => `/connections/search?query=${encodeURIComponent(query)}`,
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
    }),
    sendConnectionRequest: builder.mutation<any, { email: string; type: string }>({
      query: (body) => ({
        url: '/connections/request',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Invitation', 'TalentInvitation', 'Agency', 'Talent', 'Notification'],
    }),
    getIncomingConnections: builder.query<any[], void>({
      query: () => '/connections/incoming',
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Invitation'],
    }),
    getOutgoingConnections: builder.query<any[], void>({
      query: () => '/connections/outgoing',
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Invitation'],
    }),
    acceptConnection: builder.mutation<any, string>({
      query: (id) => ({
        url: `/connections/${id}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation', 'TalentInvitation', 'Agency', 'Talent', 'Notification'],
    }),
    declineConnection: builder.mutation<any, string>({
      query: (id) => ({
        url: `/connections/${id}/decline`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation', 'Notification'],
    }),
    cancelConnection: builder.mutation<any, string>({
      query: (id) => ({
        url: `/connections/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation'],
    }),
    getNotifications: builder.query<any[], void>({
      query: () => '/connections/notifications',
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Notification'],
    }),
    getSyncedVendors: builder.query<any[], void>({
      query: () => '/connections/synced-vendors',
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Invitation'],
    }),
    markNotificationsRead: builder.mutation<any, void>({
      query: () => ({
        url: '/connections/notifications/read',
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
    getConnectedPartners: builder.query<any[], void>({
      query: () => '/connections/partners',
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Agency', 'Talent'],
    }),
    deleteRelationship: builder.mutation<any, string>({
      query: (id) => ({
        url: `/connections/relationship/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invitation', 'TalentInvitation', 'Agency', 'Talent', 'Notification'],
    }),

    // --- Invoices & Balances ---
    getInvoicesByWallet: builder.query<any[], { walletId: string; limit?: number; offset?: number }>({
      query: ({ walletId, limit = 20, offset = 0 }) => 
        `/payments/invoices/wallet/${walletId}?limit=${limit}&offset=${offset}`,
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Invoice'],
    }),
    getInvoicesPreview: builder.query<any[], string>({
      query: (walletId) => `/payments/invoices/wallet/${walletId}/preview`,
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
      providesTags: ['Invoice'],
    }),
    getWalletBalances: builder.query<any, string>({
      query: (walletId) => `/wallets/${walletId}/balances`,
      transformResponse: (response: { success: boolean; data: any }) => response.data || null,
      providesTags: ['Wallet'],
    }),
    getPaymentsByWallet: builder.query<any[], { walletId: string; limit?: number; offset?: number }>({
      query: ({ walletId, limit = 20, offset = 0 }) => 
        `/payments/wallet/${walletId}?limit=${limit}&offset=${offset}`,
      transformResponse: (response: { success: boolean; data: any[] }) => response.data || [],
    }),
  }),
});

export const {
  useGetConnectedAgenciesQuery,
  useGetAgencyInvitationsQuery,
  useInviteAgencyMutation,
  useResendInvitationMutation,
  useCancelInvitationMutation,
  useAcceptInvitationSandboxMutation,
  useGetConnectedBrandsQuery,
  useGetIncomingInvitationsQuery,
  useAcceptBrandInvitationMutation,
  useGetConnectedTalentsQuery,
  useGetTalentInvitationsQuery,
  useInviteTalentMutation,
  useResendTalentInvitationMutation,
  useCancelTalentInvitationMutation,
  useAcceptTalentInvitationSandboxMutation,
  useSearchUsersQuery,
  useSendConnectionRequestMutation,
  useGetIncomingConnectionsQuery,
  useGetOutgoingConnectionsQuery,
  useAcceptConnectionMutation,
  useDeclineConnectionMutation,
  useCancelConnectionMutation,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
  useGetSyncedVendorsQuery,
  useGetInvoicesByWalletQuery,
  useGetInvoicesPreviewQuery,
  useGetWalletBalancesQuery,
  useGetConnectedPartnersQuery,
  useDeleteRelationshipMutation,
  useGetPaymentsByWalletQuery,
} = api;
