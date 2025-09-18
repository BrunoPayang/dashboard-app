import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon
} from '@mui/icons-material';
// Removed unused Parent import since we're using ParentCreationResponse

// Interface for the actual API response
interface ParentCreationResponse {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  school: number;
  phone: string;
  id?: number; // Optional in case it's included
  is_active?: boolean; // Optional in case it's included
}

interface ParentCreationSuccessProps {
  open: boolean;
  onClose: () => void;
  parent: ParentCreationResponse | null;
  credentials: {
    username: string;
    password: string;
  };
}

const ParentCreationSuccess: React.FC<ParentCreationSuccessProps> = ({
  open,
  onClose,
  parent,
  credentials
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyCredentials = async () => {
    const text = `Nom d'utilisateur: ${credentials.username}\nMot de passe: ${credentials.password}`;
    await copyToClipboard(text, 'credentials');
  };

  const copyUsername = () => copyToClipboard(credentials.username, 'username');
  const copyPassword = () => copyToClipboard(credentials.password, 'password');

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          m: 0, 
          p: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                Parent créé avec succès !
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Le compte parent a été créé et est prêt à être utilisé
              </Typography>
            </Box>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Parent Information */}
          {parent && (
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Informations du parent
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Nom complet
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {parent.first_name} {parent.last_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    {parent.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Téléphone
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    {parent.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Statut
                  </Typography>
                  <Chip 
                    label={parent.is_active !== false ? 'Actif' : 'Inactif'} 
                    color={parent.is_active !== false ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Credentials Section */}
          <Paper sx={{ p: 3, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon color="warning" />
              Identifiants de connexion
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Partagez ces identifiants avec le parent pour qu'il puisse se connecter à son compte.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Nom d'utilisateur
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  p: 1.5,
                  bgcolor: 'white',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontWeight: 500,
                      flex: 1,
                      wordBreak: 'break-all'
                    }}
                  >
                    {credentials.username}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={copyUsername}
                    sx={{ color: 'primary.main' }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Mot de passe
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  p: 1.5,
                  bgcolor: 'white',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontWeight: 500,
                      flex: 1,
                      wordBreak: 'break-all'
                    }}
                  >
                    {credentials.password}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={copyPassword}
                    sx={{ color: 'primary.main' }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CopyIcon />}
                onClick={copyCredentials}
                sx={{ textTransform: 'none' }}
              >
                Copier les identifiants
              </Button>
            </Box>
          </Paper>

          {/* Important Note */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Important :</strong> Ces identifiants ne seront affichés qu'une seule fois. 
              Assurez-vous de les partager avec le parent de manière sécurisée.
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} variant="contained" sx={{ textTransform: 'none' }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copied !== null}
        autoHideDuration={2000}
        onClose={() => setCopied(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setCopied(null)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {copied === 'credentials' && 'Identifiants copiés dans le presse-papiers !'}
          {copied === 'username' && 'Nom d\'utilisateur copié !'}
          {copied === 'password' && 'Mot de passe copié !'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ParentCreationSuccess;
