import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Tooltip,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useGetParentStudentRelationshipsQuery, useCreateParentStudentRelationshipMutation, useUpdateParentStudentRelationshipMutation, useDeleteParentStudentRelationshipMutation, useGetParentsQuery } from '../../../../services/api/parentManagementApi';
import { useGetStudentsQuery } from '../../../../features/students/studentApi';
import { RELATIONSHIP_TYPES } from '../../../../types/parentManagement';
import { useAppSelector } from '../../../../hooks/redux';

interface RelationshipFormData {
  parent_id: string;
  student_id: string;
  relationship_type: 'father' | 'mother' | 'guardian' | 'grandparent' | 'aunt' | 'uncle' | 'sibling' | 'other';
  is_emergency_contact: boolean;
  emergency_priority: number;
  can_pickup: boolean;
  can_authorize_medical: boolean;
  notes: string;
}

const relationshipSchema = yup.object({
  parent_id: yup.string().required('Le parent est requis'),
  student_id: yup.string().required('L\'étudiant est requis'),
  relationship_type: yup.string().oneOf(['father', 'mother', 'guardian', 'grandparent', 'aunt', 'uncle', 'sibling', 'other']).required('Le type de relation est requis'),
  is_emergency_contact: yup.boolean().required(),
  emergency_priority: yup.number().min(1, 'La priorité doit être au moins 1').max(5, 'La priorité ne peut pas dépasser 5').required(),
  can_pickup: yup.boolean().required(),
  can_authorize_medical: yup.boolean().required(),
  notes: yup.string().max(500, 'Les notes ne peuvent pas dépasser 500 caractères').required()
});

const ParentStudentRelationships: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<any | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');

  // Get current user's school ID
  const { school } = useAppSelector((state) => state.auth);

  // Fetch real relationships data
  const { data: relationshipsData, isLoading, error, refetch } = useGetParentStudentRelationshipsQuery({
    page: 1,
    page_size: 100,
    ordering: 'created_at'
  });

  // Fetch parents data for dropdown (using the proper parents endpoint)
  const { data: parentsData } = useGetParentsQuery({
    page: 1,
    page_size: 1000, // Get all parents
    search: '',
    ordering: 'first_name'
  });

  // Fetch students data for dropdown
  const { data: studentsData } = useGetStudentsQuery({
    page: 1,
    page_size: 1000, // Get all students
    schoolId: school?.id?.toString() || '',
    ordering: 'first_name'
  });

  // Mutations
  const [createRelationship] = useCreateParentStudentRelationshipMutation();
  const [updateRelationship] = useUpdateParentStudentRelationshipMutation();
  const [deleteRelationship] = useDeleteParentStudentRelationshipMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<RelationshipFormData>({
    resolver: yupResolver(relationshipSchema),
    mode: 'onChange',
    defaultValues: {
      parent_id: '',
      student_id: '',
      relationship_type: 'father',
      is_emergency_contact: false,
      emergency_priority: 1,
      can_pickup: false,
      can_authorize_medical: false,
      notes: ''
    }
  });

  const handleOpenCreateDialog = () => {
    setDialogMode('create');
    setEditingRelationship(null);
    reset();
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (relationship: any) => {
    setDialogMode('edit');
    setEditingRelationship(relationship);
    reset({
      parent_id: relationship.parent.toString(),
      student_id: relationship.student,
      relationship_type: relationship.relationship,
      is_emergency_contact: relationship.is_emergency_contact,
      emergency_priority: 1, // Default value since API doesn't have this field
      can_pickup: true, // Default value since API doesn't have this field
      can_authorize_medical: relationship.is_emergency_contact, // Use emergency contact status
      notes: '' // Default value since API doesn't have this field
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRelationship(null);
    reset();
  };

  const onSubmit = async (data: RelationshipFormData) => {
    try {
      if (dialogMode === 'create') {
        await createRelationship({
          parent: parseInt(data.parent_id),
          student: data.student_id,
          relationship: data.relationship_type,
          is_primary: false, // Default value
          is_emergency_contact: data.is_emergency_contact,
          receive_sms: true, // Default values
          receive_email: true,
          receive_push: true
        }).unwrap();
      } else if (editingRelationship) {
        await updateRelationship({
          id: editingRelationship.id,
          data: {
            relationship: data.relationship_type,
            is_primary: editingRelationship.is_primary,
            is_emergency_contact: data.is_emergency_contact,
            receive_sms: editingRelationship.receive_sms,
            receive_email: editingRelationship.receive_email,
            receive_push: editingRelationship.receive_push
          }
        }).unwrap();
      }
      handleCloseDialog();
      refetch(); // Refresh the data
    } catch (err) {
      console.error('Failed to save relationship:', err);
    }
  };

  const handleDeleteRelationship = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette relation ?')) {
      try {
        await deleteRelationship(id).unwrap();
        refetch(); // Refresh the data
      } catch (err) {
        console.error('Failed to delete relationship:', err);
      }
    }
  };

  const getRelationshipTypeLabel = (type: string) => {
    return RELATIONSHIP_TYPES[type as keyof typeof RELATIONSHIP_TYPES] || type;
  };

  // Transform parents data for dropdown (direct parent data)
  const getUniqueParents = () => {
    if (!parentsData?.results) return [];
    
    return parentsData.results.map(parent => ({
      id: parent.id,
      name: `${parent.first_name} ${parent.last_name}`.trim() || parent.username
    })).sort((a, b) => a.name.localeCompare(b.name));
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Erreur lors du chargement des relations: {error.toString()}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Relations Parent-Étudiant
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Nouvelle Relation
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Gestion des relations :</strong> Créez et gérez les liens entre parents et étudiants, 
        définissez les contacts d'urgence et configurez les autorisations.
      </Alert>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Relations
              </Typography>
              <Typography variant="h4">
                {relationshipsData?.count || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Contacts d'Urgence
              </Typography>
              <Typography variant="h4">
                {relationshipsData?.results?.filter(r => r.is_emergency_contact).length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Relations Primaires
              </Typography>
              <Typography variant="h4">
                {relationshipsData?.results?.filter(r => r.is_primary).length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Notifications SMS
              </Typography>
              <Typography variant="h4">
                {relationshipsData?.results?.filter(r => r.receive_sms).length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loading State */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Relationships Table */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parent</TableCell>
                <TableCell>Étudiant</TableCell>
                <TableCell>Type de Relation</TableCell>
                <TableCell>Contact d'Urgence</TableCell>
                <TableCell>Primaire</TableCell>
                <TableCell>Notifications</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {relationshipsData?.results?.map((relationship) => (
                <TableRow key={relationship.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      {relationship.parent_name || `Parent ${relationship.parent}`}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon />
                      {relationship.student_name || `Étudiant ${relationship.student}`}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getRelationshipTypeLabel(relationship.relationship)}
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {relationship.is_emergency_contact ? (
                      <Chip 
                        icon={<WarningIcon />}
                        label="Oui"
                        color="error"
                        size="small"
                      />
                    ) : (
                      <Chip label="Non" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {relationship.is_primary ? (
                      <Chip 
                        label="Oui"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip label="Non" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {relationship.receive_sms && (
                        <Tooltip title="Notifications SMS">
                          <Chip label="SMS" size="small" color="info" />
                        </Tooltip>
                      )}
                      {relationship.receive_email && (
                        <Tooltip title="Notifications Email">
                          <Chip label="Email" size="small" color="success" />
                        </Tooltip>
                      )}
                      {relationship.receive_push && (
                        <Tooltip title="Notifications Push">
                          <Chip label="Push" size="small" color="warning" />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditDialog(relationship)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteRelationship(relationship.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Nouvelle Relation' : 'Modifier la Relation'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="parent_id"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.parent_id}>
                      <InputLabel>Sélectionner un Parent</InputLabel>
                      <Select {...field} label="Sélectionner un Parent">
                        {getUniqueParents().map((parent) => (
                          <MenuItem key={parent.id} value={parent.id.toString()}>
                            {parent.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.parent_id && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                          {errors.parent_id.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="student_id"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.student_id}>
                      <InputLabel>Sélectionner un Étudiant</InputLabel>
                      <Select {...field} label="Sélectionner un Étudiant">
                        {studentsData?.results?.map((student) => (
                          <MenuItem key={student.id} value={student.id}>
                            {student.first_name} {student.last_name}
                          </MenuItem>
                        )) || []}
                      </Select>
                      {errors.student_id && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                          {errors.student_id.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="relationship_type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.relationship_type}>
                      <InputLabel>Type de Relation</InputLabel>
                      <Select {...field} label="Type de Relation">
                        {Object.entries(RELATIONSHIP_TYPES).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.relationship_type && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                          {errors.relationship_type.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="emergency_priority"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Priorité d'Urgence"
                      type="number"
                      inputProps={{ min: 1, max: 5 }}
                      error={!!errors.emergency_priority}
                      helperText={errors.emergency_priority?.message}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="is_emergency_contact"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel>Contact d'Urgence</InputLabel>
                      <Select {...field} label="Contact d'Urgence">
                        <MenuItem value="true">Oui</MenuItem>
                        <MenuItem value="false">Non</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="can_pickup"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel>Peut Ramasser</InputLabel>
                      <Select {...field} label="Peut Ramasser">
                        <MenuItem value="true">Oui</MenuItem>
                        <MenuItem value="false">Non</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="can_authorize_medical"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel>Autorisation Médicale</InputLabel>
                      <Select {...field} label="Autorisation Médicale">
                        <MenuItem value="true">Oui</MenuItem>
                        <MenuItem value="false">Non</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Notes"
                      multiline
                      rows={3}
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                      size="small"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid}
            >
              {dialogMode === 'create' ? 'Créer' : 'Modifier'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ParentStudentRelationships;
