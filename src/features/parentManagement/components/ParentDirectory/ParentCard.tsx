import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Checkbox,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  ChildCare as ChildIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { formatDate } from '../../../../utils/formatters';
import type { Parent } from '../../../../types/parentManagement';

interface ParentCardProps {
  parent: Parent;
  isSelected: boolean;
  onSelectionChange: () => void;
  onEdit: () => void;
}

const ParentCard: React.FC<ParentCardProps> = ({
  parent,
  isSelected,
  onSelectionChange,
  onEdit
}) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircleIcon /> : <CancelIcon />;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      {/* Selection Checkbox */}
      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
        <Checkbox
          checked={isSelected}
          onChange={onSelectionChange}
          size="small"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)'
            }
          }}
        />
      </Box>

      {/* Header */}
      <CardContent sx={{ flexGrow: 1, pt: 6 }}>
        {/* Avatar and Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              mr: 2,
              bgcolor: 'primary.main',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            {getInitials(parent.first_name, parent.last_name)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {parent.first_name} {parent.last_name}
            </Typography>
            <Chip
              icon={getStatusIcon(parent.is_active)}
              label={parent.is_active ? 'Actif' : 'Inactif'}
              color={getStatusColor(parent.is_active)}
              size="small"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Contact Information */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {parent.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {parent.phone || 'Non renseigné'}
            </Typography>
          </Box>
        </Box>

        {/* Additional Information */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Inscrit le {formatDate(parent.created_at)}
            </Typography>
          </Box>
          {parent.last_login && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Dernière connexion: {formatDate(parent.last_login)}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChildIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {parent.children_count || 0} enfant(s) lié(s)
            </Typography>
          </Box>
        </Box>

        {/* FCM Token Status */}
        {parent.fcm_token && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label="Notifications Push activées"
              size="small"
              color="info"
              variant="outlined"
            />
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          ID: {parent.id}
        </Typography>
        <Box>
          <IconButton
            size="small"
            onClick={onEdit}
            sx={{ color: 'primary.main' }}
          >
            <EditIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ParentCard;
