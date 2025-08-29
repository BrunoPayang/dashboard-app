import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUpdateParentMutation } from '../../../../services/api/parentManagementApi';
import { useAppSelector } from '../../../../hooks/redux';
import type { UpdateParentRequest } from '../../../../types/parentManagement';

interface EditParentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const editParentSchema = yup.object({
  first_name: yup
    .string()
    .optional()
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: yup
    .string()
    .optional()
    .min(2, 'Le nom de famille doit contenir au moins 2 caractères'),
  email: yup
    .string()
    .optional()
    .email('Format d\'email invalide'),
  phone: yup
    .string()
    .optional()
    .matches(/^[+]?[0-9\s\-()]+$/, 'Format de téléphone invalide'),
  is_active: yup.boolean().optional()
});

const EditParentForm: React.FC<EditParentFormProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { selectedParentForEdit } = useAppSelector((state) => state.parentManagement);
  const [updateParent, { isLoading, error }] = useUpdateParentMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<UpdateParentRequest>({
    resolver: yupResolver(editParentSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      is_active: true
    }
  });

  // Update form when selected parent changes
  useEffect(() => {
    if (selectedParentForEdit) {
      reset({
        first_name: selectedParentForEdit.first_name,
        last_name: selectedParentForEdit.last_name,
        email: selectedParentForEdit.email,
        phone: selectedParentForEdit.phone,
        is_active: selectedParentForEdit.is_active
      });
    }
  }, [selectedParentForEdit, reset]);

  const onSubmit = async (data: UpdateParentRequest) => {
    if (!selectedParentForEdit) return;

    try {
      await updateParent({
        id: selectedParentForEdit.id,
        data
      }).unwrap();
      onSuccess();
    } catch (err) {
      console.error('Failed to update parent:', err);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!selectedParentForEdit) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Modifier le parent</Typography>
        <Button
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Erreur lors de la modification du parent: {error.toString()}
            </Alert>
          )}

          {/* Parent Info Header */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Modifier les informations de: <strong>{selectedParentForEdit.first_name} {selectedParentForEdit.last_name}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {selectedParentForEdit.id} | Nom d'utilisateur: @{selectedParentForEdit.username}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations personnelles
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Prénom"
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nom de famille"
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Informations de contact
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Numéro de téléphone"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    size="small"
                    placeholder="+227 90 12 34 56"
                  />
                )}
              />
            </Grid>

            {/* Account Status */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Statut du compte
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="primary"
                      />
                    )}
                  />
                }
                label="Compte actif"
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 4 }}>
                Un compte inactif ne peut pas se connecter à l'application
              </Typography>
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Informations supplémentaires
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date d'inscription"
                value={new Date(selectedParentForEdit.created_at).toLocaleDateString('fr-FR')}
                disabled
                size="small"
                helperText="Non modifiable"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dernière connexion"
                value={selectedParentForEdit.last_login 
                  ? new Date(selectedParentForEdit.last_login).toLocaleDateString('fr-FR')
                  : 'Jamais connecté'
                }
                disabled
                size="small"
                helperText="Non modifiable"
              />
            </Grid>

            {selectedParentForEdit.fcm_token && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1, border: 1, borderColor: 'info.200' }}>
                  <Typography variant="body2" color="info.700">
                    📱 Ce parent a activé les notifications push (FCM Token présent)
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            {isLoading ? 'Modification...' : 'Modifier le parent'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditParentForm;

