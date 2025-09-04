import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { School, SchoolUpdateRequest } from '../../../types/school';

interface SchoolEditFormProps {
  school: School;
  onSave: (data: SchoolUpdateRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}

const SchoolEditForm: React.FC<SchoolEditFormProps> = ({
  school,
  onSave,
  onCancel,
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState<SchoolUpdateRequest>({
    name: school.name,
    school_type: school.school_type,
    academic_year: school.academic_year || '',
    logo: school.logo || '',
    primary_color: school.primary_color || '',
    secondary_color: school.secondary_color || '',
    contact_email: school.contact_email,
    contact_phone: school.contact_phone || '',
    website: school.website || '',
    address: school.address || '',
    city: school.city || '',
    state: school.state || '',
    country: school.country || '',
    postal_code: school.postal_code || '',
    is_active: school.is_active,
    is_verified: school.is_verified,
  });

  const handleChange = (field: keyof SchoolUpdateRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(formData);
  };

  const schoolTypes = [
    { value: 'primary', label: 'Primaire' },
    { value: 'secondary', label: 'Secondaire' },
    { value: 'both', label: 'Primaire & Secondaire' },
    { value: 'university', label: 'Université' },
    { value: 'other', label: 'Autre' },
  ];

  return (
    <Card>
      <CardHeader
        title="Modifier les Informations de l'École"
        subheader="Mettez à jour les informations de votre école"
      />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations de Base
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom de l'École"
                value={formData.name}
                onChange={handleChange('name')}
                required
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={isLoading}>
                <InputLabel>Type d'École</InputLabel>
                <Select
                  value={formData.school_type}
                  label="Type d'École"
                  onChange={handleChange('school_type')}
                >
                  {schoolTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Année Académique"
                value={formData.academic_year}
                onChange={handleChange('academic_year')}
                placeholder="2024-2025"
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Logo URL"
                value={formData.logo}
                onChange={handleChange('logo')}
                placeholder="https://example.com/logo.png"
                disabled={isLoading}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Informations de Contact
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email de Contact"
                type="email"
                value={formData.contact_email}
                onChange={handleChange('contact_email')}
                required
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone de Contact"
                value={formData.contact_phone}
                onChange={handleChange('contact_phone')}
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Site Web"
                value={formData.website}
                onChange={handleChange('website')}
                placeholder="https://example.com"
                disabled={isLoading}
              />
            </Grid>

            {/* Address Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Adresse
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                value={formData.address}
                onChange={handleChange('address')}
                multiline
                rows={2}
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ville"
                value={formData.city}
                onChange={handleChange('city')}
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="État/Province"
                value={formData.state}
                onChange={handleChange('state')}
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Pays"
                value={formData.country}
                onChange={handleChange('country')}
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code Postal"
                value={formData.postal_code}
                onChange={handleChange('postal_code')}
                disabled={isLoading}
              />
            </Grid>

            {/* Branding */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Couleurs de l'École
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Couleur Primaire"
                value={formData.primary_color}
                onChange={handleChange('primary_color')}
                placeholder="#1976D2"
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: formData.primary_color || '#ccc',
                        borderRadius: '4px',
                        mr: 1,
                        border: '1px solid #ccc',
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Couleur Secondaire"
                value={formData.secondary_color}
                onChange={handleChange('secondary_color')}
                placeholder="#424242"
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: formData.secondary_color || '#ccc',
                        borderRadius: '4px',
                        mr: 1,
                        border: '1px solid #ccc',
                      }}
                    />
                  ),
                }}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Statut
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleChange('is_active')}
                    disabled={isLoading}
                  />
                }
                label="École Active"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_verified}
                    onChange={handleChange('is_verified')}
                    disabled={isLoading}
                  />
                }
                label="École Vérifiée"
              />
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default SchoolEditForm;
