import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  IconButton,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'notification';
  category: 'general' | 'academic' | 'emergency' | 'reminder';
  created_at: string;
  updated_at: string;
}

interface Notification {
  id: string;
  template_id: string;
  recipients: string[];
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'notification';
  scheduled_for?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  sent_count: number;
  failed_count: number;
  created_at: string;
  sent_at?: string;
}

interface NotificationFormData {
  template_id: string;
  recipients: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'notification';
  scheduled_for?: string;
  is_urgent: boolean;
}

const notificationSchema = yup.object({
  template_id: yup.string().required('Le modèle est requis'),
  recipients: yup.string().required('Les destinataires sont requis'),
  subject: yup.string().required('Le sujet est requis'),
  content: yup.string().required('Le contenu est requis'),
  type: yup.string().oneOf(['email', 'sms', 'notification']).required('Le type est requis'),
  scheduled_for: yup.string().optional(),
  is_urgent: yup.boolean().required()
});

const MESSAGE_TYPES = [
  { value: 'email', label: 'Email', icon: <EmailIcon /> },
  { value: 'sms', label: 'SMS', icon: <SmsIcon /> },
  { value: 'notification', label: 'Notification', icon: <NotificationsIcon /> }
];

const MESSAGE_CATEGORIES = [
  { value: 'general', label: 'Général', color: 'default' },
  { value: 'academic', label: 'Académique', color: 'primary' },
  { value: 'emergency', label: 'Urgence', color: 'error' },
  { value: 'reminder', label: 'Rappel', color: 'warning' }
];

const ParentCommunication: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');

  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Rappel Paiement',
      subject: 'Rappel de paiement des frais scolaires',
      content: 'Cher parent, veuillez noter que le paiement des frais scolaires est dû le {due_date}.',
      type: 'email',
      category: 'reminder',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Urgence Médicale',
      subject: 'URGENT: Information médicale',
      content: 'URGENT: Votre enfant a besoin d\'une attention médicale immédiate. Contactez l\'école immédiatement.',
      type: 'sms',
      category: 'emergency',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      template_id: '1',
      recipients: ['parent1', 'parent2'],
      subject: 'Rappel de paiement des frais scolaires',
      content: 'Cher parent, veuillez noter que le paiement des frais scolaires est dû le 15 janvier 2024.',
      type: 'email',
      status: 'sent',
      sent_count: 2,
      failed_count: 0,
      created_at: '2024-01-01T00:00:00Z',
      sent_at: '2024-01-01T10:00:00Z'
    }
  ]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<NotificationFormData>({
    resolver: yupResolver(notificationSchema),
    mode: 'onChange',
    defaultValues: {
      template_id: '',
      recipients: '',
      subject: '',
      content: '',
      type: 'email',
      scheduled_for: '',
      is_urgent: false
    }
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenNotificationDialog = () => {
    setOpenNotificationDialog(true);
    reset();
  };

  const handleCloseNotificationDialog = () => {
    setOpenNotificationDialog(false);
    reset();
  };

  const handleOpenTemplateDialog = (template?: MessageTemplate) => {
    if (template) {
      setDialogMode('edit');
      setEditingTemplate(template);
    } else {
      setDialogMode('create');
      setEditingTemplate(null);
    }
    setOpenTemplateDialog(true);
  };

  const handleCloseTemplateDialog = () => {
    setOpenTemplateDialog(false);
    setEditingTemplate(null);
  };

  const onSubmitNotification = async (data: NotificationFormData) => {
    try {
      const newNotification: Notification = {
        id: Date.now().toString(),
        template_id: data.template_id,
        recipients: data.recipients.split(',').map(r => r.trim()),
        subject: data.subject,
        content: data.content,
        type: data.type,
        scheduled_for: data.scheduled_for,
        status: data.scheduled_for ? 'scheduled' : 'draft',
        sent_count: 0,
        failed_count: 0,
        created_at: new Date().toISOString()
      };
      setNotifications(prev => [...prev, newNotification]);
      handleCloseNotificationDialog();
    } catch (err) {
      console.error('Failed to create notification:', err);
    }
  };

  const onSubmitTemplate = async (data: any) => {
    try {
      if (dialogMode === 'create') {
        const newTemplate: MessageTemplate = {
          id: Date.now().toString(),
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setTemplates(prev => [...prev, newTemplate]);
      } else if (editingTemplate) {
        const updatedTemplate: MessageTemplate = {
          ...editingTemplate,
          ...data,
          updated_at: new Date().toISOString()
        };
        setTemplates(prev => 
          prev.map(t => t.id === editingTemplate.id ? updatedTemplate : t)
        );
      }
      handleCloseTemplateDialog();
    } catch (err) {
      console.error('Failed to save template:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'success';
      case 'sending': return 'info';
      case 'failed': return 'error';
      case 'scheduled': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircleIcon />;
      case 'sending': return <AccessTimeIcon />;
      case 'failed': return <AccessTimeIcon />;
      case 'scheduled': return <ScheduleIcon />;
      default: return <AccessTimeIcon />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Communication & Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            onClick={() => handleOpenTemplateDialog()}
          >
            Nouveau Modèle
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleOpenNotificationDialog}
          >
            Nouvelle Notification
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Système de communication :</strong> Créez des modèles de messages, envoyez des notifications 
        individuelles ou en masse, programmez des envois et suivez la livraison.
      </Alert>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Modèles Créés
              </Typography>
              <Typography variant="h4">
                {templates.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Notifications Envoyées
              </Typography>
              <Typography variant="h4">
                {notifications.filter(n => n.status === 'sent').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En Cours
              </Typography>
              <Typography variant="h4">
                {notifications.filter(n => n.status === 'sending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Programmées
              </Typography>
              <Typography variant="h4">
                {notifications.filter(n => n.status === 'scheduled').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Communication tabs">
          <Tab label="Modèles de Messages" />
          <Tab label="Notifications" />
          <Tab label="Historique" />
        </Tabs>

        {/* Templates Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {templates.map((template) => (
                <Grid item xs={12} md={6} key={template.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3">
                          {template.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenTemplateDialog(template)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {template.subject}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip 
                          icon={MESSAGE_TYPES.find(t => t.value === template.type)?.icon}
                          label={MESSAGE_TYPES.find(t => t.value === template.type)?.label}
                          size="small"
                          color="primary"
                        />
                        <Chip 
                          label={MESSAGE_CATEGORIES.find(c => c.value === template.category)?.label}
                          size="small"
                          color={MESSAGE_CATEGORIES.find(c => c.value === template.category)?.color as any}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {template.content}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<SendIcon />}
                        onClick={() => {
                          setActiveTab(1);
                          handleOpenNotificationDialog();
                        }}
                      >
                        Utiliser ce Modèle
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Notifications Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <List>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(notification.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {notification.subject}
                          </Typography>
                          <Chip 
                            label={notification.status}
                            color={getStatusColor(notification.status) as any}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Type: {MESSAGE_TYPES.find(t => t.value === notification.type)?.label} | 
                            Destinataires: {notification.recipients.length} | 
                            Envoyé: {notification.sent_count} | 
                            Échecs: {notification.failed_count}
                          </Typography>
                          {notification.scheduled_for && (
                            <Typography variant="body2" color="textSecondary">
                              Programmé pour: {new Date(notification.scheduled_for).toLocaleString()}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {/* History Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Historique des Communications
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Statistiques par Type
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {MESSAGE_TYPES.map((type) => {
                        const count = notifications.filter(n => n.type === type.value).length;
                        return (
                          <Box key={type.value} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {type.icon}
                              <Typography variant="body2">{type.label}</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="bold">
                              {count}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Taux de Livraison
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Succès</Typography>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          {notifications.reduce((sum, n) => sum + n.sent_count, 0)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Échecs</Typography>
                        <Typography variant="body2" fontWeight="bold" color="error.main">
                          {notifications.reduce((sum, n) => sum + n.failed_count, 0)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Create/Edit Notification Dialog */}
      <Dialog open={openNotificationDialog} onClose={handleCloseNotificationDialog} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle Notification</DialogTitle>
        <form onSubmit={handleSubmit(onSubmitNotification)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="template_id"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.template_id}>
                      <InputLabel>Modèle</InputLabel>
                      <Select {...field} label="Modèle">
                        {templates.map((template) => (
                          <MenuItem key={template.id} value={template.id}>
                            {template.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.type}>
                      <InputLabel>Type de Message</InputLabel>
                      <Select {...field} label="Type de Message">
                        {MESSAGE_TYPES.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {type.icon}
                              {type.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="recipients"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Destinataires (IDs séparés par des virgules)"
                      error={!!errors.recipients}
                      helperText={errors.recipients?.message}
                      size="small"
                      placeholder="parent1, parent2, parent3"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Sujet"
                      error={!!errors.subject}
                      helperText={errors.subject?.message}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contenu"
                      multiline
                      rows={4}
                      error={!!errors.content}
                      helperText={errors.content?.message}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="scheduled_for"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Programmer pour (optionnel)"
                      type="datetime-local"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="is_urgent"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label="Notification Urgente"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNotificationDialog}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid}
              startIcon={<SendIcon />}
            >
              Envoyer
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create/Edit Template Dialog */}
      <Dialog open={openTemplateDialog} onClose={handleCloseTemplateDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Nouveau Modèle' : 'Modifier le Modèle'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitTemplate)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom du Modèle"
                  size="small"
                  defaultValue={editingTemplate?.name || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select defaultValue={editingTemplate?.type || 'email'} label="Type">
                    {MESSAGE_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {type.icon}
                          {type.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Catégorie</InputLabel>
                  <Select defaultValue={editingTemplate?.category || 'general'} label="Category">
                    {MESSAGE_CATEGORIES.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sujet"
                  size="small"
                  defaultValue={editingTemplate?.subject || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contenu"
                  multiline
                  rows={6}
                  size="small"
                  defaultValue={editingTemplate?.content || ''}
                  helperText="Utilisez {variable} pour les variables dynamiques"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTemplateDialog}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<DescriptionIcon />}
            >
              {dialogMode === 'create' ? 'Créer' : 'Modifier'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ParentCommunication;
