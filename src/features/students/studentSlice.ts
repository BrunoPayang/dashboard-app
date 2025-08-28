import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Student, StudentFilters } from '../../types/student';

interface StudentState {
  students: Student[];
  selectedStudent: Student | null;
  filters: StudentFilters;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  students: [],
  selectedStudent: null,
  filters: {
    search: '',
    class_level: '',
    school: '',
    is_active: undefined,
    ordering: '-enrollment_date',
    page: 1,
    page_size: 10,
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
  },
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<StudentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to first page when filters change
      state.filters.page = 1;
      state.pagination.currentPage = 1;
    },
    setPagination: (state, action: PayloadAction<{ currentPage: number; pageSize: number; totalCount: number }>) => {
      state.pagination = action.payload;
      state.filters.page = action.payload.currentPage;
      state.filters.page_size = action.payload.pageSize;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        class_level: '',
        school: '',
        is_active: undefined,
        ordering: '-enrollment_date',
        page: 1,
        page_size: 10,
      };
      state.pagination.currentPage = 1;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.unshift(action.payload);
      state.pagination.totalCount += 1;
    },
    updateStudentInList: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex(student => student.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
      if (state.selectedStudent?.id === action.payload.id) {
        state.selectedStudent = action.payload;
      }
    },
    removeStudentFromList: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(student => student.id !== action.payload);
      state.pagination.totalCount = Math.max(0, state.pagination.totalCount - 1);
      if (state.selectedStudent?.id === action.payload) {
        state.selectedStudent = null;
      }
    },
  },
});

export const {
  setStudents,
  setSelectedStudent,
  setFilters,
  setPagination,
  setLoading,
  setError,
  clearFilters,
  addStudent,
  updateStudentInList,
  removeStudentFromList,
} = studentSlice.actions;

export default studentSlice.reducer;

