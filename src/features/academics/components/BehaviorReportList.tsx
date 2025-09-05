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
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  SentimentVerySatisfied,
  SentimentVeryDissatisfied,
  SentimentNeutral,
  Warning,
  Assignment,
} from '@mui/icons-material';
import { useGetBehaviorReportsQuery } from '../../../services/api/academicApi';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { 
  toggleBehaviorReportSelection, 
  selectAllBehaviorReports, 
  clearBehaviorReportSelection 
} from '../academicSlice';
import { formatDate, getRelativeTime } from '../../../utils/formatters';
import type { BehaviorReport } from '../../../types/academic';

interface BehaviorReportListProps {
  onEditReport: (report: BehaviorReport) => void;
  onDeleteReport: (reportId: number) => void;
  onViewReport: (report: BehaviorReport) => void;
}

const BehaviorReportList: React.FC<BehaviorReportListProps> = ({
  onEditReport,
  onDeleteReport,
  onViewReport,
}) => {
  const dispatch = useAppDispatch();
  const { selectedBehaviorReports, behaviorFilters } = useAppSelector((state) => state.academics);
  
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<BehaviorReport | null>(null);

  const { data, isLoading, error } = useGetBehaviorReportsQuery({
    ...behaviorFilters,
    page: page + 1,
    page_size: pageSize,
  });

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && data?.results) {
      dispatch(selectAllBehaviorReports(data.results.map((report) => report.id)));
    } else {
      dispatch(clearBehaviorReportSelection());
    }
  };

  const handleSelectReport = (reportId: number) => {
    dispatch(toggleBehaviorReportSelection(reportId));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, report: BehaviorReport) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const getReportTypeIcon = (type: string | undefined) => {
    switch (type) {
      case 'positive':
        return <SentimentVerySatisfied color="success" />;
      case 'negative':
        return <SentimentVeryDissatisfied color="error" />;
      default:
        return <SentimentNeutral color="action" />;
    }
  };

  const getReportTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSeverityColor = (severity: string | undefined) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const isSelected = (reportId: number) => selectedBehaviorReports.includes(reportId);

  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Skeleton variant="rectangular" width={20} height={20} />
              </TableCell>
              {['Étudiant', 'Type de Rapport', 'Titre', 'Gravité', 'Date', 'Actions'].map((header) => (
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
        Échec du chargement des rapports de comportement. Veuillez réessayer.
      </Alert>
    );
  }

  if (!data?.results?.length) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Aucun rapport de comportement trouvé
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Essayez d'ajuster vos filtres ou créez un nouveau rapport de comportement.
        </Typography>
      </Paper>
    );
  }

  const numSelected = selectedBehaviorReports.length;
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
              <TableCell>Type</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Gravité</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Suivi</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.results.map((report) => (
              <TableRow
                key={report.id}
                hover
                role="checkbox"
                aria-checked={isSelected(report.id)}
                selected={isSelected(report.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isSelected(report.id)}
                    onChange={() => handleSelectReport(report.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {report.student_name || 'Étudiant Inconnu'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getReportTypeIcon(report.report_type)}
                    <Chip
                      label={report.report_type?.toUpperCase() || 'INCONNU'}
                      color={getReportTypeColor(report.report_type) as any}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {report.title || 'Rapport Sans Titre'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    par {report.reported_by_name || 'Inconnu'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.severity?.toUpperCase() || 'INCONNUE'}
                    color={getSeverityColor(report.severity) as any}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {report.incident_date ? formatDate(report.incident_date) : 'Pas de date'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {report.created_at ? getRelativeTime(report.created_at) : 'Inconnu'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {report.follow_up_required ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Warning color="warning" fontSize="small" />
                      <Typography variant="body2" color="warning.main">
                        {report.follow_up_date ? formatDate(report.follow_up_date) : 'Requis'}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
Aucun
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, report)}
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
          if (selectedReport) onViewReport(selectedReport);
          handleMenuClose();
        }}>
          <Visibility sx={{ mr: 2 }} />
          Voir les Détails
        </MenuItem>
        
        <MenuItem onClick={() => {
          if (selectedReport) onEditReport(selectedReport);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 2 }} />
          Modifier le Rapport
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            if (selectedReport) onDeleteReport(selectedReport.id);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 2 }} />
          Supprimer le Rapport
        </MenuItem>
      </Menu>
    </>
  );
};

export default BehaviorReportList;
