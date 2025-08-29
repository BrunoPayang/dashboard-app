import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCreateParentMutation } from '../../../../services/api/parentManagementApi';
import { useAppSelector } from '../../../../hooks/redux';
import type { CreateParentRequest } from '../../../../types/parentManagement';

interface CreateParentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateParentFormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const createParentSchema = yup.object({
  username: yup
    .string()
    .required('Le nom d\'utilisateur est requis')
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .matches(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  email: yup
    .string()
    .required('L\'email est requis')
    .email('Format d\'email invalide'),
  first_name: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: yup
    .string()
    .required('Le nom de famille est requis')
    .min(2, 'Le nom de famille doit contenir au moins 2 caractères'),
  phone: yup
    .string()
    .required('Le numéro de téléphone est requis')
    .matches(/^[+]?[0-9\s\-()]+$/, 'Format de téléphone invalide'),
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: yup
    .string()
    .required('La confirmation du mot de passe est requise')
    .oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre')
});

const CreateParentForm: React.FC<CreateParentFormProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { school } = useAppSelector((state) => state.auth);
  const [createParent, { isLoading, error }] = useCreateParentMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<CreateParentFormData>({
    resolver: yupResolver(createParentSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: CreateParentFormData) => {
    try {
      // Extract confirmPassword for validation but don't send it to API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...formData } = data;
      const parentData: CreateParentRequest = {
        ...formData,
        user_type: 'parent',
        school: school?.id || ''
      };
      await createParent(parentData).unwrap();
      onSuccess();
    } catch (err) {
      console.error('Failed to create parent:', err);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

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
        <Typography variant="h6">Créer un nouveau parent</Typography>
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
              Erreur lors de la création du parent: {error.toString()}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Informations de connexion</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nom d'utilisateur"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    size="small"
                    placeholder="ex: parent_dupont"
                  />
                )}
              />
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

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Informations personnelles</Typography>
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

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Informations de contact</Typography>
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

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Sécurité</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mot de passe"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirmer le mot de passe"
                    type="password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    size="small"
                  />
                )}
              />
            </Grid>
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
            {isLoading ? 'Création...' : 'Créer le parent'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateParentForm;
