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
  Chip,
  Autocomplete,
} from '@mui/material';
import { SchoolConfigurationResponse, SchoolConfigurationUpdateRequest } from '../../../types/school';

interface SchoolConfigurationEditFormProps {
  configuration: SchoolConfigurationResponse;
  onSave: (data: SchoolConfigurationUpdateRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}

const SchoolConfigurationEditForm: React.FC<SchoolConfigurationEditFormProps> = ({
  configuration,
  onSave,
  onCancel,
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState<SchoolConfigurationUpdateRequest>({
    academic_year_start: configuration.academic_year_start,
    academic_year_end: configuration.academic_year_end,
    current_semester: configuration.current_semester,
    logo: configuration.logo || '',
    enable_sms_notifications: configuration.enable_sms_notifications,
    enable_email_notifications: configuration.enable_email_notifications,
    enable_push_notifications: configuration.enable_push_notifications,
    currency: configuration.currency,
    payment_reminder_days: configuration.payment_reminder_days,
    max_file_size_mb: configuration.max_file_size_mb,
    allowed_file_types: configuration.allowed_file_types,
  });

  const [newFileType, setNewFileType] = useState('');

  const handleChange = (field: keyof SchoolConfigurationUpdateRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddFileType = () => {
    if (newFileType && !formData.allowed_file_types?.includes(newFileType)) {
      setFormData(prev => ({
        ...prev,
        allowed_file_types: [...(prev.allowed_file_types || []), newFileType],
      }));
      setNewFileType('');
    }
  };

  const handleRemoveFileType = (typeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      allowed_file_types: prev.allowed_file_types?.filter(type => type !== typeToRemove) || [],
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(formData);
  };

  const semesters = [
    { value: 'first', label: 'Premier Semestre' },
    { value: 'second', label: 'Deuxième Semestre' },
    { value: 'third', label: 'Troisième Semestre' },
  ];

  const currencies = [
    { value: 'NGN', label: 'Naira Nigérian (NGN)' },
    { value: 'USD', label: 'Dollar Américain (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'XOF', label: 'Franc CFA (XOF)' },
    { value: 'GBP', label: 'Livre Sterling (GBP)' },
  ];

  const commonFileTypes = [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg',
    '.mp4', '.avi', '.mov', '.mp3', '.wav', '.txt', '.zip', '.rar'
  ];

  return (
    <Card>
      <CardHeader
        title="Modifier la Configuration de l'École"
        subheader="Mettez à jour les paramètres de configuration de votre école"
      />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Academic Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Paramètres Académiques
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Début d'Année Académique"
                type="date"
                value={formData.academic_year_start}
                onChange={handleChange('academic_year_start')}
                InputLabelProps={{ shrink: true }}
                required
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Fin d'Année Académique"
                type="date"
                value={formData.academic_year_end}
                onChange={handleChange('academic_year_end')}
                InputLabelProps={{ shrink: true }}
                required
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required disabled={isLoading}>
                <InputLabel>Semestre Actuel</InputLabel>
                <Select
                  value={formData.current_semester}
                  label="Semestre Actuel"
                  onChange={handleChange('current_semester')}
                >
                  {semesters.map((semester) => (
                    <MenuItem key={semester.value} value={semester.value}>
                      {semester.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Logo de l'École (URL/Chemin du fichier)"
                value={formData.logo || ''}
                onChange={handleChange('logo')}
                placeholder="https://example.com/logo.png ou /uploads/logos/school-logo.png"
                disabled={isLoading}
                helperText="URL complète ou chemin relatif vers le fichier logo de l'école. Ce logo sera utilisé en priorité dans toute l'application."
              />
            </Grid>

            {/* Notification Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Paramètres de Notification
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enable_sms_notifications}
                    onChange={handleChange('enable_sms_notifications')}
                    disabled={isLoading}
                  />
                }
                label="Activer les Notifications SMS"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enable_email_notifications}
                    onChange={handleChange('enable_email_notifications')}
                    disabled={isLoading}
                  />
                }
                label="Activer les Notifications Email"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enable_push_notifications}
                    onChange={handleChange('enable_push_notifications')}
                    disabled={isLoading}
                  />
                }
                label="Activer les Notifications Push"
              />
            </Grid>

            {/* Payment Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Paramètres de Paiement
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={isLoading}>
                <InputLabel>Devise</InputLabel>
                <Select
                  value={formData.currency}
                  label="Devise"
                  onChange={handleChange('currency')}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rappel de Paiement (jours)"
                type="number"
                value={formData.payment_reminder_days}
                onChange={handleChange('payment_reminder_days')}
                inputProps={{ min: 1, max: 30 }}
                required
                disabled={isLoading}
              />
            </Grid>

            {/* File Upload Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Paramètres de Téléchargement
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Taille Maximum des Fichiers (MB)"
                type="number"
                value={formData.max_file_size_mb}
                onChange={handleChange('max_file_size_mb')}
                inputProps={{ min: 1, max: 100 }}
                required
                disabled={isLoading}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Types de Fichiers Autorisés
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.allowed_file_types?.map((type, index) => (
                  <Chip
                    key={index}
                    label={type}
                    onDelete={() => handleRemoveFileType(type)}
                    disabled={isLoading}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Autocomplete
                  freeSolo
                  options={commonFileTypes}
                  value={newFileType}
                  onChange={(_, newValue) => setNewFileType(newValue || '')}
                  onInputChange={(_, newInputValue) => setNewFileType(newInputValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ajouter un type de fichier"
                      size="small"
                      disabled={isLoading}
                      placeholder="Ex: .pdf"
                    />
                  )}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddFileType}
                  disabled={!newFileType || isLoading}
                  size="small"
                >
                  Ajouter
                </Button>
              </Box>
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

export default SchoolConfigurationEditForm;
