import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Alert,
  Skeleton,
  Button,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Download,
  School,
} from '@mui/icons-material';
import { useGetTranscriptsQuery } from '../../../services/api/academicApi';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { 
  toggleTranscriptSelection, 
  selectAllTranscripts, 
  clearTranscriptSelection 
} from '../academicSlice';
import { formatDate, formatGPA } from '../../../utils/formatters';
import type { TranscriptRecord } from '../../../types/academic';

interface TranscriptListProps {
  onEditTranscript: (transcript: TranscriptRecord) => void;
  onDeleteTranscript: (transcriptId: number) => void;
  onViewTranscript: (transcript: TranscriptRecord) => void;
}

const TranscriptList: React.FC<TranscriptListProps> = ({
  onEditTranscript,
  onDeleteTranscript,
  onViewTranscript,
}) => {
  const dispatch = useAppDispatch();
  const { selectedTranscripts, transcriptFilters } = useAppSelector((state) => state.academics);
  
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTranscript, setSelectedTranscript] = useState<TranscriptRecord | null>(null);

  const { data, isLoading, error } = useGetTranscriptsQuery({
    ...transcriptFilters,
    page: page + 1,
    page_size: pageSize,
  });

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && data?.results) {
      dispatch(selectAllTranscripts(data.results.map((transcript) => transcript.id)));
    } else {
      dispatch(clearTranscriptSelection());
    }
  };

  const handleSelectTranscript = (transcriptId: number) => {
    dispatch(toggleTranscriptSelection(transcriptId));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, transcript: TranscriptRecord) => {
    setAnchorEl(event.currentTarget);
    setSelectedTranscript(transcript);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTranscript(null);
  };

  const handleDownload = (transcript: TranscriptRecord) => {
    if (transcript.file_url) {
      window.open(transcript.file_url, '_blank');
    }
    handleMenuClose();
  };

  const isSelected = (transcriptId: number) => selectedTranscripts.includes(transcriptId);

  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Skeleton variant="rectangular" width={20} height={20} />
              </TableCell>
              {['Étudiant', 'Année Académique', 'Semestre', 'Moyenne', 'Date de Téléchargement', 'Actions'].map((header) => (
                <TableCell key={header}>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(10)].map((_, index) => (
              <TableRow key={index}>
                <TableCell padding="checkbox">
                  <Skeleton variant="rectangular" width={20} height={20} />
                </TableCell>
                {[...Array(6)].map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Échec du chargement des enregistrements de relevé de notes. Veuillez réessayer.
      </Alert>
    );
  }

  if (!data?.results?.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <School sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Aucun enregistrement de relevé de notes trouvé
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Essayez d'ajuster vos filtres ou téléchargez un nouveau relevé de notes.
        </Typography>
      </Paper>
    );
  }

  const numSelected = selectedTranscripts.length;
  const rowCount = data.results.length;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Étudiant</TableCell>
              <TableCell>Année Académique</TableCell>
              <TableCell>Semestre</TableCell>
              <TableCell>Moyenne</TableCell>
              <TableCell>Date de Téléchargement</TableCell>
              <TableCell>Fichier</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.results.map((transcript) => (
              <TableRow
                key={transcript.id}
                hover
                role="checkbox"
                aria-checked={isSelected(transcript.id)}
                selected={isSelected(transcript.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isSelected(transcript.id)}
                    onChange={() => handleSelectTranscript(transcript.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {transcript.student_name || 'Étudiant Inconnu'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {transcript.academic_year || 'Année Inconnue'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={transcript.semester || 'Inconnu'}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight="medium">
                      {formatGPA(transcript.gpa)}
                    </Typography>
                    <Chip
                      label={
                        transcript.gpa === null || transcript.gpa === undefined
                          ? 'Pas de Note'
                          : (() => {
                              const numericGPA = typeof transcript.gpa === 'string' ? parseFloat(transcript.gpa) : transcript.gpa;
                              if (isNaN(numericGPA)) return 'Pas de Note';
                              return numericGPA >= 3.5 
                                ? 'Excellent' 
                                : numericGPA >= 2.5 
                                  ? 'Bien' 
                                  : 'Passable';
                            })()
                      }
                      color={
                        transcript.gpa === null || transcript.gpa === undefined
                          ? 'default'
                          : (() => {
                              const numericGPA = typeof transcript.gpa === 'string' ? parseFloat(transcript.gpa) : transcript.gpa;
                              if (isNaN(numericGPA)) return 'default';
                              return numericGPA >= 3.5 
                                ? 'success' 
                                : numericGPA >= 2.5 
                                  ? 'warning' 
                                  : 'error';
                            })()
                      }
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {transcript.upload_date ? formatDate(transcript.upload_date) : 'Pas de date'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    par {transcript.uploaded_by_name || 'Inconnu'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {transcript.file_url ? (
                    <Button
                      size="small"
                      startIcon={<Download />}
                      onClick={() => handleDownload(transcript)}
                    >
                      Télécharger
                    </Button>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Pas de fichier
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, transcript)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={data.count}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setPageSize(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedTranscript) onViewTranscript(selectedTranscript);
          handleMenuClose();
        }}>
          <Visibility sx={{ mr: 2 }} />
          Voir les Détails
        </MenuItem>
        
        <MenuItem onClick={() => {
          if (selectedTranscript) onEditTranscript(selectedTranscript);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 2 }} />
          Modifier le Relevé
        </MenuItem>
        
        {selectedTranscript?.file_url && (
          <MenuItem onClick={() => selectedTranscript && handleDownload(selectedTranscript)}>
            <Download sx={{ mr: 2 }} />
            Télécharger le Fichier
          </MenuItem>
        )}
        
        <MenuItem 
          onClick={() => {
            if (selectedTranscript) onDeleteTranscript(selectedTranscript.id);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 2 }} />
          Supprimer le Relevé
        </MenuItem>
      </Menu>
    </>
  );
};

export default TranscriptList;
