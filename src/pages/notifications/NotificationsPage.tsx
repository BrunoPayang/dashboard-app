import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, ListItemIcon, Chip, CircularProgress } from '@mui/material';
import { CheckCircle as CheckCircleIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';
import { useAppSelector } from '../../hooks/redux';
import { useGetNotificationsQuery } from '../../features/notifications/notificationsApi';

const NotificationsPage: React.FC = () => {
  const { school } = useAppSelector((state: any) => state.auth);
  
  const { data: notificationsData, isLoading } = useGetNotificationsQuery({
    school_id: school?.id,
    page_size: 50
  });

  const notifications = notificationsData?.results || [];

  const getNotificationStatus = (notification: any) => {
    if (notification.sent_at) return 'sent';
    if (notification.sent_via_fcm || notification.sent_via_email || notification.sent_via_sms) return 'sending';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircleIcon color="success" />;
      case 'sending': return <AccessTimeIcon color="info" />;
      case 'pending': return <AccessTimeIcon color="warning" />;
      default: return <AccessTimeIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" textAlign="center">
            Aucune notification trouvée pour cette école.
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notifications récentes ({notifications.length})
          </Typography>
          <List>
            {notifications.map((notification) => {
              const status = getNotificationStatus(notification);
              return (
                <ListItem key={notification.id} divider>
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
                          size="small" 
                          color={status === 'sent' ? 'success' : status === 'sending' ? 'info' : 'warning'}
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
                        <Typography variant="caption" color="textSecondary">
                          Destinataires: {notification.target_user_ids.length} | 
                          Créé: {new Date(notification.created_at).toLocaleString()} |
                          École: {notification.school_name}
                        </Typography>
                        {notification.sent_at && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            Envoyé: {new Date(notification.sent_at).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default NotificationsPage;
