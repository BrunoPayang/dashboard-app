import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TablePagination
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  School as SchoolIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { Class } from '../../../types/class';

interface ClassListProps {
  classes: Class[];
  onEdit: (classData: Class) => void;
  onDelete: (classId: string) => void;
  onView: (classData: Class) => void;
  selectedClasses: string[];
  onSelectClass: (classId: string) => void;
  onSelectAll: () => void;
  isLoading?: boolean;
  error?: string | null;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onPageSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClassList: React.FC<ClassListProps> = ({
  classes,
  onEdit,
  onDelete,
  onView,
  selectedClasses,
  onSelectClass,
  onSelectAll,
  isLoading = false,
  error,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedClass, setSelectedClass] = React.useState<Class | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, classData: Class) => {
    setAnchorEl(event.currentTarget);
    setSelectedClass(classData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClass(null);
  };

  const handleEdit = () => {
    if (selectedClass) {
      onEdit(selectedClass);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedClass) {
      onDelete(selectedClass.id);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedClass) {
      onView(selectedClass);
    }
    handleMenuClose();
  };

  const isAllSelected = classes.length > 0 && selectedClasses.length === classes.length;
  const isIndeterminate = selectedClasses.length > 0 && selectedClasses.length < classes.length;

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Erreur lors du chargement des classes
        </Typography>
        <Typography color="textSecondary">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  disabled={isLoading}
                />
              </TableCell>
              <TableCell>Classe</TableCell>
              <TableCell>Niveau</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Année Académique</TableCell>
              <TableCell align="center">Étudiants</TableCell>
              <TableCell align="center">Capacité</TableCell>
              <TableCell align="center">Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography>Chargement des classes...</Typography>
                </TableCell>
              </TableRow>
            ) : classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="h6" color="textSecondary">
                      Aucune classe trouvée
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Créez votre première classe pour commencer
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              classes.map((classData) => (
                <TableRow key={classData.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedClasses.includes(classData.id)}
                      onChange={() => onSelectClass(classData.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {classData.full_name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {classData.school_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {classData.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {classData.section}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {classData.academic_year}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <PeopleIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {classData.student_count}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {classData.max_students}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={classData.is_active ? 'Active' : 'Inactive'}
                      color={classData.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, classData)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {classes.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100]}
          count={totalCount}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onPageSizeChange}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Voir les détails</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modifier</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default ClassList;
