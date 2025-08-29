import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Chip,
  Avatar,
  Box,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { formatDate } from '../../../../utils/formatters';
import type { Parent } from '../../../../types/parentManagement';

interface ParentTableProps {
  parents: Parent[];
  selectedParents: number[];
  onParentSelection: (parentId: number) => void;
  onEditParent: (parent: Parent) => void;
}

const ParentTable: React.FC<ParentTableProps> = ({
  parents,
  selectedParents,
  onParentSelection,
  onEditParent
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedParents.length === parents.length && parents.length > 0}
                indeterminate={selectedParents.length > 0 && selectedParents.length < parents.length}
                onChange={() => {
                  if (selectedParents.length === parents.length) {
                    // Deselect all
                    parents.forEach(parent => onParentSelection(parent.id));
                  } else {
                    // Select all
                    parents.forEach(parent => {
                      if (!selectedParents.includes(parent.id)) {
                        onParentSelection(parent.id);
                      }
                    });
                  }
                }}
              />
            </TableCell>
            <TableCell>Parent</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Inscription</TableCell>
            <TableCell>Dernière connexion</TableCell>
            <TableCell>Enfants liés</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parents.map((parent) => (
            <TableRow
              key={parent.id}
              hover
              selected={selectedParents.includes(parent.id)}
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedParents.includes(parent.id)}
                  onChange={() => onParentSelection(parent.id)}
                />
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                      bgcolor: 'primary.main',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {getInitials(parent.first_name, parent.last_name)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {parent.first_name} {parent.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{parent.username}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {parent.email}
                    </Typography>
                  </Box>
                  {parent.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {parent.phone}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </TableCell>
              
              <TableCell>
                <Chip
                  icon={getStatusIcon(parent.is_active)}
                  label={parent.is_active ? 'Actif' : 'Inactif'}
                  color={getStatusColor(parent.is_active)}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {formatDate(parent.created_at)}
                </Typography>
              </TableCell>
              
              <TableCell>
                {parent.last_login ? (
                  <Typography variant="body2">
                    {formatDate(parent.last_login)}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Jamais connecté
                  </Typography>
                )}
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={parent.children_count || 0}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {parent.fcm_token && (
                    <Tooltip title="Notifications Push activées">
                      <Chip
                        label="Push"
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Modifier le parent">
                    <IconButton
                      size="small"
                      onClick={() => onEditParent(parent)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer le parent">
                    <IconButton
                      size="small"
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ParentTable;

