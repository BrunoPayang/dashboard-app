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
  IconButton,
  Divider,
  CircularProgress
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
import { useAppSelector } from '../../../../hooks/redux';
import { useGetParentsFromRelationshipsQuery } from '../../../../services/api/parentManagementApi';
import { useGetNotificationsQuery, useCreateNotificationMutation, Notification } from '../../../notifications/notificationsApi';

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

interface NotificationFormData {
  title: string;
  body: string;
  notification_type: 'academic' | 'behavior' | 'payment' | 'general';
  target_user_ids: number[];
  data: string;
}

const notificationSchema = yup.object({
  title: yup.string().required('Le titre est requis'),
  body: yup.string().required('Le contenu est requis'),
  notification_type: yup.string().oneOf(['academic', 'behavior', 'payment', 'general']).required('Le type est requis'),
  target_user_ids: yup.array().of(yup.number().required()).required(),
  data: yup.string().default('')
});

const NOTIFICATION_TYPES = [
  { value: 'academic', label: 'Academic Update', icon: <DescriptionIcon /> },
  { value: 'behavior', label: 'Behavior Report', icon: <NotificationsIcon /> },
  { value: 'payment', label: 'Payment Reminder', icon: <DescriptionIcon /> },
  { value: 'general', label: 'General Announcement', icon: <NotificationsIcon /> }
];

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
  
  const { school } = useAppSelector((state: any) => state.auth);
  
  // Fetch parents for the current school
  const { data: parentsData, isLoading: isLoadingParents } = useGetParentsFromRelationshipsQuery({
    page_size: 1000, // Get all parents for the school
    school: school?.id // Filter by current school
  });

  // Fetch notifications for the current school
  const { data: notificationsData, isLoading: isLoadingNotifications } = useGetNotificationsQuery({
    school_id: school?.id,
    page_size: 100
  });

  // Create notification mutation
  const [createNotification, { isLoading: isCreatingNotification }] = useCreateNotificationMutation();

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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<NotificationFormData>({
    resolver: yupResolver(notificationSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      body: '',
      notification_type: 'general',
      target_user_ids: [],
      data: ''
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
      const notificationData = {
        title: data.title,
        body: data.body,
        notification_type: data.notification_type,
        target_user_ids: data.target_user_ids || [],
        school: school?.id || '',
        data: data.data || ''
      };
  
      console.log('Sending notification:', notificationData);
      
      // Use the RTK Query mutation to create notification
      await createNotification(notificationData).unwrap();
      
      console.log('Notification sent successfully');
      handleCloseNotificationDialog();
    } catch (err) {
      console.error('Failed to send notification:', err);
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

  const getNotificationStatus = (notification: Notification) => {
    if (notification.sent_at) return 'sent';
    if (notification.sent_via_fcm || notification.sent_via_email || notification.sent_via_sms) return 'sending';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'success';
      case 'sending': return 'info';
      case 'failed': return 'error';
      case 'scheduled': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircleIcon />;
      case 'sending': return <AccessTimeIcon />;
      case 'failed': return <AccessTimeIcon />;
      case 'scheduled': return <ScheduleIcon />;
      case 'pending': return <AccessTimeIcon />;
      default: return <AccessTimeIcon />;
    }
  };

  const notifications = notificationsData?.results || [];

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
                {notifications.filter(n => getNotificationStatus(n) === 'sent').length}
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
                {notifications.filter(n => getNotificationStatus(n) === 'sending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En Attente
              </Typography>
              <Typography variant="h4">
                {notifications.filter(n => getNotificationStatus(n) === 'pending').length}
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
            {isLoadingNotifications ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Aucune notification trouvée
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Créez votre première notification pour commencer
                </Typography>
              </Box>
            ) : (
              <List>
                {notifications.map((notification) => {
                  const status = getNotificationStatus(notification);
                  return (
                    <React.Fragment key={notification.id}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1">
                                {notification.title}
                              </Typography>
                              <Chip 
                                label={status}
                                color={getStatusColor(status) as any}
                                size="small"
                              />
                              <Chip 
                                label={notification.notification_type}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                {notification.body}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Destinataires: {notification.target_user_ids.length} | 
                                Créé: {new Date(notification.created_at).toLocaleString()} |
                                École: {notification.school_name}
                              </Typography>
                              {notification.sent_at && (
                                <Typography variant="body2" color="textSecondary">
                                  Envoyé: {new Date(notification.sent_at).toLocaleString()}
                                </Typography>
                              )}
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                {notification.sent_via_fcm && <Chip label="FCM" size="small" color="success" />}
                                {notification.sent_via_email && <Chip label="Email" size="small" color="primary" />}
                                {notification.sent_via_sms && <Chip label="SMS" size="small" color="info" />}
                              </Box>
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
                  );
                })}
              </List>
            )}
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
                      {NOTIFICATION_TYPES.map((type) => {
                        const count = notifications.filter(n => n.notification_type === type.value).length;
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
                        <Typography variant="body2">Envoyées</Typography>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          {notifications.filter(n => getNotificationStatus(n) === 'sent').length}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">En cours</Typography>
                        <Typography variant="body2" fontWeight="bold" color="info.main">
                          {notifications.filter(n => getNotificationStatus(n) === 'sending').length}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">En attente</Typography>
                        <Typography variant="body2" fontWeight="bold" color="warning.main">
                          {notifications.filter(n => getNotificationStatus(n) === 'pending').length}
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
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Titre"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="notification_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.notification_type}>
                      <InputLabel>Type de Notification</InputLabel>
                      <Select {...field} label="Type de Notification">
                        {NOTIFICATION_TYPES.map((type) => (
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
                  name="body"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contenu"
                      multiline
                      rows={4}
                      error={!!errors.body}
                      helperText={errors.body?.message}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="target_user_ids"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.target_user_ids}>
                      <InputLabel>Destinataires</InputLabel>
                      <Select
                        {...field}
                        multiple
                        label="Destinataires"
                        value={field.value || []}
                        onChange={(e) => {
                          const selectedValues = e.target.value as number[];
                          // If "all" is selected, select all parent IDs
                          if (selectedValues.includes(-1)) {
                            const allParentIds = parentsData?.results?.map(parent => parent.id) || [];
                            field.onChange(allParentIds);
                          } else {
                            field.onChange(selectedValues);
                          }
                        }}
                        renderValue={(selected) => {
                          if (selected.length === 0) return 'Sélectionner des parents';
                          if (selected.length === (parentsData?.results?.length || 0)) return 'Tous les parents';
                          return `${selected.length} parent(s) sélectionné(s)`;
                        }}
                      >
                        <MenuItem value={-1}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              📢 Envoyer à tous les parents
                            </Typography>
                          </Box>
                        </MenuItem>
                        <Divider />
                        {isLoadingParents ? (
                          <MenuItem disabled>
                            <Typography variant="body2">Chargement des parents...</Typography>
                          </MenuItem>
                        ) : parentsData?.results?.map((parent) => (
                          <MenuItem key={parent.id} value={parent.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">
                                {parent.first_name} {parent.last_name}
                              </Typography>
                              {parent.children_count && (
                                <Chip 
                                  label={`${parent.children_count} enfant(s)`} 
                                  size="small" 
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.target_user_ids && (
                        <Typography variant="caption" color="error">
                          {errors.target_user_ids.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="data"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Données supplémentaires (optionnel)"
                      size="small"
                      placeholder='{"key": "value"}'
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
              disabled={!isValid || isCreatingNotification}
              startIcon={isCreatingNotification ? <CircularProgress size={16} /> : <SendIcon />}
            >
              {isCreatingNotification ? 'Envoi...' : 'Envoyer'}
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

