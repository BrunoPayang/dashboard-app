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
    'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2', 
    '6em', '5em', '4em', '3em', 
    'Seconde', 'Premieree', 'Terminale'
  ];

  const sections = ['A', 'B', 'C', 'D', 'E', 'F'];
  const genders = ['male', 'female', 'other'];
  
  const getGenderLabel = (gender: string) => {
    const genderLabels = {
      male: 'Masculin',
      female: 'Féminin',
      other: 'Autre'
    };
    return genderLabels[gender as keyof typeof genderLabels] || gender;
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Rechercher et Filtrer les Étudiants
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Rechercher par nom ou ID"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Entrez le nom ou l'ID de l'étudiant..."
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Niveau de Classe</InputLabel>
            <Select
              value={filters.class_level || ''}
              onChange={handleClassLevelChange}
              label="Niveau de Classe"
            >
              <MenuItem value="">Tous les Niveaux</MenuItem>
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
              <MenuItem value="">Toutes les Sections</MenuItem>
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
            <InputLabel>Genre</InputLabel>
            <Select
              value={filters.gender || ''}
              onChange={handleGenderChange}
              label="Genre"
            >
              <MenuItem value="">Tous les Genres</MenuItem>
              {genders.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {getGenderLabel(gender)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Statut</InputLabel>
            <Select
              value={filters.is_active === undefined ? 'all' : filters.is_active.toString()}
              onChange={handleStatusChange}
              label="Statut"
            >
              <MenuItem value="all">Tous les Statuts</MenuItem>
              <MenuItem value="true">Actif</MenuItem>
              <MenuItem value="false">Inactif</MenuItem>
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
            Effacer
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StudentSearch;
