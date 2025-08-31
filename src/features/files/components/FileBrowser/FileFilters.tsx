import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Chip,
  Paper,
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { FileType, FILE_TYPES, FileFilters as FiltersType } from '../../types/file';

interface FileFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  onClearFilters: () => void;
  totalFiles: number;
}

const FileFilters: React.FC<FileFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  totalFiles
}) => {
  const [expanded, setExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<FiltersType>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof FiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== false
  );

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== false
    ).length;
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h6">File Filters</Typography>
          {hasActiveFilters && (
            <Chip
              label={`${getActiveFiltersCount()} active`}
              color="primary"
              size="small"
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="textSecondary">
            {totalFiles} files found
          </Typography>
          
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Basic Filters (Always Visible) */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search files..."
          value={localFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          sx={{ minWidth: 250 }}
        />

        {/* File Type */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>File Type</InputLabel>
          <Select
            value={localFilters.file_type || ''}
            label="File Type"
            onChange={(e) => handleFilterChange('file_type', e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            {FILE_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Public/Private Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={localFilters.is_public === true}
              onChange={(e) => handleFilterChange('is_public', e.target.checked ? true : undefined)}
            />
          }
          label="Public Files Only"
        />

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            size="small"
            variant="outlined"
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* Advanced Filters (Collapsible) */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Advanced Filters
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            
            {/* File Size Range */}
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                File Size
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Min (MB)"
                  type="number"
                  sx={{ width: 80 }}
                />
                <Typography variant="body2" color="textSecondary">-</Typography>
                <TextField
                  size="small"
                  placeholder="Max (MB)"
                  type="number"
                  sx={{ width: 80 }}
                />
              </Box>
            </Box>

            {/* Upload Date Range */}
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Upload Date
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  type="date"
                  sx={{ width: 140 }}
                />
                <Typography variant="body2" color="textSecondary">to</Typography>
                <TextField
                  size="small"
                  type="date"
                  sx={{ width: 140 }}
                />
              </Box>
            </Box>

            {/* Uploaded By */}
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Uploaded By
              </Typography>
              <TextField
                size="small"
                placeholder="User name or ID"
                fullWidth
              />
            </Box>

            {/* Content Type */}
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Content Type
              </Typography>
              <TextField
                size="small"
                placeholder="e.g., application/pdf"
                fullWidth
              />
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.search && (
              <Chip
                label={`Search: "${filters.search}"`}
                onDelete={() => handleFilterChange('search', '')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            
            {filters.file_type && (
              <Chip
                label={`Type: ${getFileTypeLabel(filters.file_type)}`}
                onDelete={() => handleFilterChange('file_type', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            
            {filters.is_public === true && (
              <Chip
                label="Public Files Only"
                onDelete={() => handleFilterChange('is_public', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

// Helper function to get file type label
const getFileTypeLabel = (fileType: FileType): string => {
  const type = FILE_TYPES.find(t => t.value === fileType);
  return type ? type.label : fileType;
};

export default FileFilters;
