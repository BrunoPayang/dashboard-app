import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../../../hooks/redux';
import { setParentFilters, resetParentFilters } from '../../parentManagementSlice';

const ParentFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const { parentFilters } = useAppSelector((state) => state.parentManagement);
  
  const [localFilters, setLocalFilters] = useState({
    search: parentFilters.search,
    is_active: parentFilters.is_active,
    ordering: parentFilters.ordering
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Update local filters when Redux filters change
  useEffect(() => {
    setLocalFilters({
      search: parentFilters.search,
      is_active: parentFilters.is_active,
      ordering: parentFilters.ordering
    });
  }, [parentFilters]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, search: value }));
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const newTimeout = setTimeout(() => {
      dispatch(setParentFilters({ search: value }));
    }, 500);
    
    setSearchTimeout(newTimeout);
  };

  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    dispatch(setParentFilters(newFilters));
  };

  const handleResetFilters = () => {
    setLocalFilters({
      search: '',
      is_active: undefined,
      ordering: '-created_at'
    });
    dispatch(resetParentFilters());
  };

  const hasActiveFilters = parentFilters.search || 
    parentFilters.is_active !== undefined || 
    parentFilters.ordering !== '-created_at';

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Box component="span" sx={{ fontWeight: 'medium' }}>
            Filtres
          </Box>
          {hasActiveFilters && (
            <Chip
              label={`${Object.values(parentFilters).filter(Boolean).length} actif(s)`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        <Box>
          <Button
            size="small"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            endIcon={showAdvancedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showAdvancedFilters ? 'Masquer' : 'Avancés'}
          </Button>
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={handleResetFilters}
              startIcon={<ClearIcon />}
              sx={{ ml: 1 }}
            >
              Réinitialiser
            </Button>
          )}
        </Box>
      </Box>

      {/* Basic Filters */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Rechercher un parent"
            placeholder="Nom, prénom, email, téléphone..."
            value={localFilters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Statut</InputLabel>
            <Select
              value={localFilters.is_active ?? ''}
              label="Statut"
              onChange={(e) => handleFilterChange('is_active', e.target.value || undefined)}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="true">Actifs</MenuItem>
              <MenuItem value="false">Inactifs</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Trier par</InputLabel>
            <Select
              value={localFilters.ordering}
              label="Trier par"
              onChange={(e) => handleFilterChange('ordering', e.target.value)}
            >
              <MenuItem value="-created_at">Plus récents</MenuItem>
              <MenuItem value="created_at">Plus anciens</MenuItem>
              <MenuItem value="first_name">Prénom A-Z</MenuItem>
              <MenuItem value="-first_name">Prénom Z-A</MenuItem>
              <MenuItem value="last_name">Nom A-Z</MenuItem>
              <MenuItem value="-last_name">Nom Z-A</MenuItem>
              <MenuItem value="-last_login">Dernière connexion</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      <Collapse in={showAdvancedFilters}>
        <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Notifications Push</InputLabel>
                <Select
                  value=""
                  label="Notifications Push"
                  disabled
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="with_fcm">Avec FCM</MenuItem>
                  <MenuItem value="without_fcm">Sans FCM</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label="Filtre à venir"
                  size="small"
                  variant="outlined"
                  color="default"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Date d'inscription</InputLabel>
                <Select
                  value=""
                  label="Date d'inscription"
                  disabled
                >
                  <MenuItem value="">Toutes les dates</MenuItem>
                  <MenuItem value="last_week">Cette semaine</MenuItem>
                  <MenuItem value="last_month">Ce mois</MenuItem>
                  <MenuItem value="last_quarter">Ce trimestre</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label="Filtre à venir"
                  size="small"
                  variant="outlined"
                  color="default"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Enfants liés</InputLabel>
                <Select
                  value=""
                  label="Enfants liés"
                  disabled
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="with_children">Avec enfants</MenuItem>
                  <MenuItem value="without_children">Sans enfants</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label="Filtre à venir"
                  size="small"
                  variant="outlined"
                  color="default"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {parentFilters.search && (
            <Chip
              label={`Recherche: "${parentFilters.search}"`}
              onDelete={() => handleFilterChange('search', '')}
              size="small"
              color="primary"
            />
          )}
          {parentFilters.is_active !== undefined && (
            <Chip
              label={`Statut: ${parentFilters.is_active ? 'Actifs' : 'Inactifs'}`}
              onDelete={() => handleFilterChange('is_active', undefined)}
              size="small"
              color="primary"
            />
          )}
          {parentFilters.ordering !== '-created_at' && (
            <Chip
              label={`Tri: ${getOrderingLabel(parentFilters.ordering)}`}
              onDelete={() => handleFilterChange('ordering', '-created_at')}
              size="small"
              color="primary"
            />
          )}
        </Box>
      )}
    </Paper>
  );
};

const getOrderingLabel = (ordering: string): string => {
  const labels: Record<string, string> = {
    'created_at': 'Plus anciens',
    'first_name': 'Prénom A-Z',
    '-first_name': 'Prénom Z-A',
    'last_name': 'Nom A-Z',
    '-last_name': 'Nom Z-A',
    '-last_login': 'Dernière connexion'
  };
  return labels[ordering] || ordering;
};

export default ParentFilters;
