// Components
export { default as StudentList } from './components/StudentList';
export { default as StudentSearch } from './components/StudentSearch';
export { default as StudentForm } from './components/StudentForm';
export { default as StudentProfile } from './components/StudentProfile';

// API and State
export { studentApi } from './studentApi';
export { default as studentReducer } from './studentSlice';

// Hooks
export {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from './studentApi';

// Actions
export {
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
} from './studentSlice';
