import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import type {
  Parent,
  CreateParentRequest,
  UpdateParentRequest,
  ParentStudentRelationship,
  CreateRelationshipRequest,
  UpdateRelationshipRequest,
  Notification,
  CreateNotificationRequest,
  BulkNotificationRequest,
  NotificationDelivery,
  ParentFilters,
  RelationshipFilters,
  NotificationFilters
} from '../../types/parentManagement';

export const parentManagementApi = createApi({
  reducerPath: 'parentManagementApi',
  baseQuery,
  tagTypes: ['Parent', 'ParentStudentRelationship', 'Notification', 'NotificationDelivery'],
  endpoints: (builder) => ({
    // Parent Directory Management
    getParents: builder.query<{ results: Parent[]; count: number }, ParentFilters & { page?: number; page_size?: number }>({
      query: (params) => ({
        url: 'auth/users/',
        params: {
          ...params,
          user_type: 'parent',
          page: params.page || 1,
          page_size: params.page_size || 20
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Parent' as const, id })),
              { type: 'Parent', id: 'LIST' }
            ]
          : [{ type: 'Parent', id: 'LIST' }]
    }),

    // New endpoint: Get parents from relationships (more accurate for school filtering)
    getParentsFromRelationships: builder.query<
      { results: Parent[]; count: number },
      { page?: number; page_size?: number; search?: string; status?: string; school?: string }
    >({
      query: (params) => ({
        url: 'parent-students/',
        params: {
          ...params,
          page: params.page || 1,
          page_size: params.page_size || 20,
          ...(params.school && { school: params.school })
        }
      }),
      transformResponse: (response: { results: ParentStudentRelationship[]; count: number }) => {
        // Transform relationships to unique parents
        const uniqueParents = new Map<number, Parent>();
        
        response.results.forEach(relationship => {
          if (relationship.parent && !uniqueParents.has(relationship.parent)) {
            // Create a parent object from the relationship data
            uniqueParents.set(relationship.parent, {
              id: relationship.parent,
              username: `parent_${relationship.parent}`,
              email: '', // Will be filled from parent details if available
              first_name: relationship.parent_name || '',
              last_name: '',
              phone: '',
              is_active: true,
              user_type: 'parent',
              school: '', // Will be filled from parent details if available
              created_at: relationship.created_at,
              last_login: undefined,
              // Add relationship info
              relationships: [relationship],
              // Set children count based on relationships
              children_count: 1
            });
          } else if (uniqueParents.has(relationship.parent)) {
            // Add additional relationship to existing parent
            const parent = uniqueParents.get(relationship.parent)!;
            if (parent.relationships) {
              parent.relationships.push(relationship);
              // Update children count
              parent.children_count = parent.relationships.length;
            }
          }
        });

        return {
          results: Array.from(uniqueParents.values()),
          count: uniqueParents.size
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Parent' as const, id })),
              { type: 'Parent', id: 'LIST' }
            ]
          : [{ type: 'Parent', id: 'LIST' }]
    }),

    getParent: builder.query<Parent, number>({
      query: (id) => `auth/users/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Parent', id }]
    }),

    createParent: builder.mutation<Parent, CreateParentRequest>({
      query: (data) => ({
        url: 'auth/register/',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Parent', id: 'LIST' }]
    }),

    updateParent: builder.mutation<Parent, { id: number; data: UpdateParentRequest }>({
      query: ({ id, data }) => ({
        url: `auth/users/${id}/`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Parent', id },
        { type: 'Parent', id: 'LIST' }
      ]
    }),

    deleteParent: builder.mutation<void, number>({
      query: (id) => ({
        url: `auth/users/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Parent', id: 'LIST' }]
    }),

    // Parent-Student Relationships
    getParentStudentRelationships: builder.query<
      { results: ParentStudentRelationship[]; count: number },
      RelationshipFilters & { page?: number; page_size?: number }
    >({
      query: (params) => ({
        url: 'parent-students/',
        params: {
          ...params,
          page: params.page || 1,
          page_size: params.page_size || 20
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'ParentStudentRelationship' as const, id })),
              { type: 'ParentStudentRelationship', id: 'LIST' }
            ]
          : [{ type: 'ParentStudentRelationship', id: 'LIST' }]
    }),

    getParentStudentRelationship: builder.query<ParentStudentRelationship, number>({
      query: (id) => `parent-students/${id}/`,
      providesTags: (result, error, id) => [{ type: 'ParentStudentRelationship', id }]
    }),

    createParentStudentRelationship: builder.mutation<ParentStudentRelationship, CreateRelationshipRequest>({
      query: (data) => ({
        url: 'parent-students/',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'ParentStudentRelationship', id: 'LIST' }]
    }),

    updateParentStudentRelationship: builder.mutation<
      ParentStudentRelationship,
      { id: number; data: UpdateRelationshipRequest }
    >({
      query: ({ id, data }) => ({
        url: `parent-students/${id}/`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ParentStudentRelationship', id },
        { type: 'ParentStudentRelationship', id: 'LIST' }
      ]
    }),

    deleteParentStudentRelationship: builder.mutation<void, number>({
      query: (id) => ({
        url: `parent-students/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'ParentStudentRelationship', id: 'LIST' }]
    }),

    getStudentParents: builder.query<ParentStudentRelationship[], string>({
      query: (studentId) => `students/${studentId}/parents/`,
      providesTags: (_result, _error, _studentId) => [
        { type: 'ParentStudentRelationship', id: 'STUDENT_PARENTS' },
        { type: 'ParentStudentRelationship', id: 'LIST' }
      ]
    }),

    // Notifications
    getNotifications: builder.query<
      { results: Notification[]; count: number },
      NotificationFilters & { page?: number; page_size?: number }
    >({
      query: (params) => ({
        url: 'notifications/',
        params: {
          ...params,
          page: params.page || 1,
          page_size: params.page_size || 20
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Notification' as const, id })),
              { type: 'Notification', id: 'LIST' }
            ]
          : [{ type: 'Notification', id: 'LIST' }]
    }),

    getNotification: builder.query<Notification, string>({
      query: (id) => `notifications/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Notification', id }]
    }),

    createNotification: builder.mutation<Notification, CreateNotificationRequest>({
      query: (data) => ({
        url: 'notifications/',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Parent', id: 'LIST' }]
    }),

    createBulkNotification: builder.mutation<{ task_id: string }, BulkNotificationRequest>({
      query: (data) => ({
        url: 'notifications/bulk/',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Parent', id: 'LIST' }]
    }),

    getBulkNotificationStatus: builder.query<{ status: string; progress: number }, string>({
      query: (taskId) => `notifications/bulk/${taskId}/status/`,
      providesTags: (_result, _error, taskId) => [{ type: 'Notification', id: `BULK_${taskId}` }]
    }),

    getNotificationAnalytics: builder.query<any, string>({
      query: (id) => `notifications/${id}/analytics/`,
      providesTags: (_result, _error, id) => [{ type: 'Notification', id: `ANALYTICS_${id}` }]
    }),

    // Notification Deliveries
    getNotificationDeliveries: builder.query<
      { results: NotificationDelivery[]; count: number },
      { user?: number; page?: number; page_size?: number }
    >({
      query: (params) => ({
        url: 'notification-deliveries/',
        params: {
          ...params,
          page: params.page || 1,
          page_size: params.page_size || 20
        }
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'NotificationDelivery' as const, id })),
              { type: 'NotificationDelivery', id: 'LIST' }
            ]
          : [{ type: 'NotificationDelivery', id: 'LIST' }]
    })
  })
});

export const {
  // Parent queries and mutations
  useGetParentsQuery,
  useGetParentsFromRelationshipsQuery,
  useGetParentQuery,
  useCreateParentMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,

  // Relationship queries and mutations
  useGetParentStudentRelationshipsQuery,
  useGetParentStudentRelationshipQuery,
  useCreateParentStudentRelationshipMutation,
  useUpdateParentStudentRelationshipMutation,
  useDeleteParentStudentRelationshipMutation,
  useGetStudentParentsQuery,

  // Notification queries and mutations
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useCreateNotificationMutation,
  useCreateBulkNotificationMutation,
  useGetBulkNotificationStatusQuery,
  useGetNotificationAnalyticsQuery,

  // Delivery queries
  useGetNotificationDeliveriesQuery
} = parentManagementApi;
