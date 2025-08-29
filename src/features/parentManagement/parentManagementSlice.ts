import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Parent, ParentFilters, RelationshipFilters, NotificationFilters } from '../../types/parentManagement';

export interface ParentManagementState {
  // Parent Directory Management
  selectedParents: number[];
  parentFilters: ParentFilters;
  showCreateParentDialog: boolean;
  showEditParentDialog: boolean;
  selectedParentForEdit: Parent | undefined;

  // Parent-Student Relationships
  selectedRelationships: number[];
  relationshipFilters: RelationshipFilters;
  showCreateRelationshipDialog: boolean;
  showEditRelationshipDialog: boolean;
  selectedRelationshipForEdit: any | undefined;

  // Communication & Notifications
  selectedNotifications: string[];
  notificationFilters: NotificationFilters;
  showCreateNotificationDialog: boolean;
  showEditNotificationDialog: boolean;
  selectedNotificationForEdit: any | undefined;
}

const initialState: ParentManagementState = {
  // Parent Directory Management
  selectedParents: [],
  parentFilters: {
    search: '',
    is_active: undefined,
    ordering: '-created_at'
  },
  showCreateParentDialog: false,
  showEditParentDialog: false,
  selectedParentForEdit: undefined,

  // Parent-Student Relationships
  selectedRelationships: [],
  relationshipFilters: {
    parent: undefined,
    student: undefined,
    relationship: undefined,
    is_primary: undefined,
    is_emergency_contact: undefined,
    ordering: '-created_at'
  },
  showCreateRelationshipDialog: false,
  showEditRelationshipDialog: false,
  selectedRelationshipForEdit: undefined,

  // Communication & Notifications
  selectedNotifications: [],
  notificationFilters: {
    notification_type: undefined,
    target_type: undefined,
    created_after: undefined,
    created_before: undefined,
    ordering: '-created_at'
  },
  showCreateNotificationDialog: false,
  showEditNotificationDialog: false,
  selectedNotificationForEdit: undefined
};

const parentManagementSlice = createSlice({
  name: 'parentManagement',
  initialState,
  reducers: {
    // Parent Directory Management
    setSelectedParents: (state, action: PayloadAction<number[]>) => {
      state.selectedParents = action.payload;
    },
    toggleParentSelection: (state, action: PayloadAction<number>) => {
      const parentId = action.payload;
      const index = state.selectedParents.indexOf(parentId);
      if (index > -1) {
        state.selectedParents.splice(index, 1);
      } else {
        state.selectedParents.push(parentId);
      }
    },
    clearParentSelection: (state) => {
      state.selectedParents = [];
    },
    setParentFilters: (state, action: PayloadAction<Partial<ParentFilters>>) => {
      state.parentFilters = { ...state.parentFilters, ...action.payload };
    },
    resetParentFilters: (state) => {
      state.parentFilters = initialState.parentFilters;
    },
    setShowCreateParentDialog: (state, action: PayloadAction<boolean>) => {
      state.showCreateParentDialog = action.payload;
    },
    setShowEditParentDialog: (state, action: PayloadAction<boolean>) => {
      state.showEditParentDialog = action.payload;
    },
    setSelectedParentForEdit: (state, action: PayloadAction<Parent | undefined>) => {
      state.selectedParentForEdit = action.payload;
    },

    // Parent-Student Relationships
    setSelectedRelationships: (state, action: PayloadAction<number[]>) => {
      state.selectedRelationships = action.payload;
    },
    toggleRelationshipSelection: (state, action: PayloadAction<number>) => {
      const relationshipId = action.payload;
      const index = state.selectedRelationships.indexOf(relationshipId);
      if (index > -1) {
        state.selectedRelationships.splice(index, 1);
      } else {
        state.selectedRelationships.push(relationshipId);
      }
    },
    clearRelationshipSelection: (state) => {
      state.selectedRelationships = [];
    },
    setRelationshipFilters: (state, action: PayloadAction<Partial<RelationshipFilters>>) => {
      state.relationshipFilters = { ...state.relationshipFilters, ...action.payload };
    },
    resetRelationshipFilters: (state) => {
      state.relationshipFilters = initialState.relationshipFilters;
    },
    setShowCreateRelationshipDialog: (state, action: PayloadAction<boolean>) => {
      state.showCreateRelationshipDialog = action.payload;
    },
    setShowEditRelationshipDialog: (state, action: PayloadAction<boolean>) => {
      state.showEditRelationshipDialog = action.payload;
    },
    setSelectedRelationshipForEdit: (state, action: PayloadAction<any | undefined>) => {
      state.selectedRelationshipForEdit = action.payload;
    },

    // Communication & Notifications
    setSelectedNotifications: (state, action: PayloadAction<string[]>) => {
      state.selectedNotifications = action.payload;
    },
    toggleNotificationSelection: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const index = state.selectedNotifications.indexOf(notificationId);
      if (index > -1) {
        state.selectedNotifications.splice(index, 1);
      } else {
        state.selectedNotifications.push(notificationId);
      }
    },
    clearNotificationSelection: (state) => {
      state.selectedNotifications = [];
    },
    setNotificationFilters: (state, action: PayloadAction<Partial<NotificationFilters>>) => {
      state.notificationFilters = { ...state.notificationFilters, ...action.payload };
    },
    resetNotificationFilters: (state) => {
      state.notificationFilters = initialState.notificationFilters;
    },
    setShowCreateNotificationDialog: (state, action: PayloadAction<boolean>) => {
      state.showCreateNotificationDialog = action.payload;
    },
    setShowEditNotificationDialog: (state, action: PayloadAction<boolean>) => {
      state.showEditNotificationDialog = action.payload;
    },
    setSelectedNotificationForEdit: (state, action: PayloadAction<any | undefined>) => {
      state.selectedNotificationForEdit = action.payload;
    },

    // Reset all state
    resetParentManagementState: (_state) => {
      return initialState;
    }
  }
});

export const {
  // Parent Directory Management
  setSelectedParents,
  toggleParentSelection,
  clearParentSelection,
  setParentFilters,
  resetParentFilters,
  setShowCreateParentDialog,
  setShowEditParentDialog,
  setSelectedParentForEdit,

  // Parent-Student Relationships
  setSelectedRelationships,
  toggleRelationshipSelection,
  clearRelationshipSelection,
  setRelationshipFilters,
  resetRelationshipFilters,
  setShowCreateRelationshipDialog,
  setShowEditRelationshipDialog,
  setSelectedRelationshipForEdit,

  // Communication & Notifications
  setSelectedNotifications,
  toggleNotificationSelection,
  clearNotificationSelection,
  setNotificationFilters,
  resetNotificationFilters,
  setShowCreateNotificationDialog,
  setShowEditNotificationDialog,
  setSelectedNotificationForEdit,

  // Reset all state
  resetParentManagementState
} = parentManagementSlice.actions;

export default parentManagementSlice.reducer;
