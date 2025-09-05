import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Class, ClassFilters } from '../../types/class';

interface ClassState {
  classes: Class[];
  loading: boolean;
  error: string | null;
  filters: ClassFilters;
  selectedClasses: string[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  sortBy: 'name' | 'level' | 'section' | 'created_at' | 'student_count';
  sortOrder: 'asc' | 'desc';
}

const initialState: ClassState = {
  classes: [],
  loading: false,
  error: null,
  filters: {},
  selectedClasses: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 20
  },
  sortBy: 'name',
  sortOrder: 'asc'
};

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    setClasses: (state, action: PayloadAction<Class[]>) => {
      state.classes = action.payload;
    },
    addClass: (state, action: PayloadAction<Class>) => {
      state.classes.unshift(action.payload);
    },
    updateClass: (state, action: PayloadAction<{ id: string; updates: Partial<Class> }>) => {
      const index = state.classes.findIndex(cls => cls.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = { ...state.classes[index], ...action.payload.updates };
      }
    },
    removeClass: (state, action: PayloadAction<string>) => {
      state.classes = state.classes.filter(cls => cls.id !== action.payload);
      state.selectedClasses = state.selectedClasses.filter(id => id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<ClassFilters>) => {
      state.filters = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.currentPage = 1;
    },
    toggleClassSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedClasses.indexOf(action.payload);
      if (index === -1) {
        state.selectedClasses.push(action.payload);
      } else {
        state.selectedClasses.splice(index, 1);
      }
    },
    selectAllClasses: (state) => {
      state.selectedClasses = state.classes.map(cls => cls.id);
    },
    clearClassSelection: (state) => {
      state.selectedClasses = [];
    },
    setSortBy: (state, action: PayloadAction<'name' | 'level' | 'section' | 'created_at' | 'student_count'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setPagination: (state, action: PayloadAction<{
      currentPage: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
    }>) => {
      state.pagination = action.payload;
    }
  }
});

export const {
  setClasses,
  addClass,
  updateClass,
  removeClass,
  setLoading,
  setError,
  setFilters,
  clearFilters,
  toggleClassSelection,
  selectAllClasses,
  clearClassSelection,
  setSortBy,
  setSortOrder,
  setPagination
} = classSlice.actions;

export default classSlice.reducer;
