import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../features/store';
import { setFilters, clearFilters } from '../studentSlice';

const StudentSearch: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.students.filters);
  const { school } = useSelector((state: RootState) => state.auth);
  
  // If no school data, don't render the search
  if (!school) {
    return null;
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: event.target.value, page: 1 }));
  };

  const handleClassLevelChange = (event: any) => {
    dispatch(setFilters({ class_level: event.target.value, page: 1 }));
  };

  const handleSectionChange = (event: any) => {
    dispatch(setFilters({ section: event.target.value, page: 1 }));
  };

  const handleGenderChange = (event: any) => {
    dispatch(setFilters({ gender: event.target.value, page: 1 }));
  };

  const handleStatusChange = (event: any) => {
    const value = event.target.value === 'all' ? undefined : event.target.value === 'true';
    dispatch(setFilters({ is_active: value, page: 1 }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const classLevels = [
    'Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th',
    '9th', '10th', '11th', '12th'
  ];

  const sections = ['A', 'B', 'C', 'D', 'E', 'F'];
  const genders = ['male', 'female', 'other'];

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Search & Filter Students
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search by name or ID"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Enter name or student ID..."
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Class Level</InputLabel>
            <Select
              value={filters.class_level || ''}
              onChange={handleClassLevelChange}
              label="Class Level"
            >
              <MenuItem value="">All Levels</MenuItem>
              {classLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Section</InputLabel>
            <Select
              value={filters.section || ''}
              onChange={handleSectionChange}
              label="Section"
            >
              <MenuItem value="">All Sections</MenuItem>
              {sections.map((section) => (
                <MenuItem key={section} value={section}>
                  {section}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Gender</InputLabel>
            <Select
              value={filters.gender || ''}
              onChange={handleGenderChange}
              label="Gender"
            >
              <MenuItem value="">All Genders</MenuItem>
              {genders.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.is_active === undefined ? 'all' : filters.is_active.toString()}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={1}>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            size="small"
            fullWidth
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StudentSearch;
