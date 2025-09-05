import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import {
  Add,
  School,
  Assignment,
  Analytics,
} from '@mui/icons-material';
import TranscriptList from '../../features/academics/components/TranscriptList';
import TranscriptForm from '../../features/academics/components/TranscriptForm';
import BehaviorReportList from '../../features/academics/components/BehaviorReportList';
import BehaviorReportForm from '../../features/academics/components/BehaviorReportForm';
import { 
  useDeleteTranscriptMutation,
  useDeleteBehaviorReportMutation 
} from '../../services/api/academicApi';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setActiveTab } from '../../features/academics/academicSlice';
import type { TranscriptRecord, BehaviorReport } from '../../types/academic';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`academics-tabpanel-${index}`}
      aria-labelledby={`academics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AcademicsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeTab } = useAppSelector((state) => state.academics);
  
  const [transcriptFormOpen, setTranscriptFormOpen] = useState(false);
  const [behaviorFormOpen, setBehaviorFormOpen] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState<TranscriptRecord | null>(null);
  const [selectedBehaviorReport, setSelectedBehaviorReport] = useState<BehaviorReport | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const [deleteTranscript] = useDeleteTranscriptMutation();
  const [deleteBehaviorReport] = useDeleteBehaviorReportMutation();

  const tabMapping = {
    'transcripts': 0,
    'behavior': 1,
    'statistics': 2,
  };

  const reverseTabMapping = {
    0: 'transcripts' as const,
    1: 'behavior' as const,
    2: 'statistics' as const,
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setActiveTab(reverseTabMapping[newValue as keyof typeof reverseTabMapping]));
  };

  // Transcript handlers
  const handleCreateTranscript = () => {
    setSelectedTranscript(null);
    setTranscriptFormOpen(true);
  };

  const handleEditTranscript = (transcript: TranscriptRecord) => {
    setSelectedTranscript(transcript);
    setTranscriptFormOpen(true);
  };

  const handleViewTranscript = (transcript: TranscriptRecord) => {
    // For now, just edit - could open a detail view later
    handleEditTranscript(transcript);
  };

  const handleDeleteTranscript = async (transcriptId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement de relevé de notes ?')) {
      try {
        await deleteTranscript(transcriptId).unwrap();
        showSnackbar('Enregistrement de relevé de notes supprimé avec succès', 'success');
      } catch (error) {
        showSnackbar('Échec de la suppression de l\'enregistrement de relevé de notes', 'error');
      }
    }
  };

  // Behavior report handlers
  const handleCreateBehaviorReport = () => {
    setSelectedBehaviorReport(null);
    setBehaviorFormOpen(true);
  };

  const handleEditBehaviorReport = (report: BehaviorReport) => {
    setSelectedBehaviorReport(report);
    setBehaviorFormOpen(true);
  };

  const handleViewBehaviorReport = (report: BehaviorReport) => {
    // For now, just edit - could open a detail view later
    handleEditBehaviorReport(report);
  };

  const handleDeleteBehaviorReport = async (reportId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport de comportement ?')) {
      try {
        await deleteBehaviorReport(reportId).unwrap();
        showSnackbar('Rapport de comportement supprimé avec succès', 'success');
      } catch (error) {
        showSnackbar('Échec de la suppression du rapport de comportement', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getCreateButtonText = () => {
    switch (activeTab) {
      case 'transcripts':
        return 'Créer un Relevé';
      case 'behavior':
        return 'Créer un Rapport';
      default:
        return 'Créer un Dossier';
    }
  };

  const handleCreateClick = () => {
    switch (activeTab) {
      case 'transcripts':
        handleCreateTranscript();
        break;
      case 'behavior':
        handleCreateBehaviorReport();
        break;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dossiers Académiques
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérer les relevés de notes, rapports de comportement et progrès académiques
          </Typography>
        </Box>
        {activeTab !== 'statistics' && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateClick}
          >
            {getCreateButtonText()}
          </Button>
        )}
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabMapping[activeTab]}
          onChange={handleTabChange}
          aria-label="academic records tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<School />}
            label="Relevés de Notes"
            id="academics-tab-0"
            aria-controls="academics-tabpanel-0"
          />
          <Tab
            icon={<Assignment />}
            label="Rapports de Comportement"
            id="academics-tab-1"
            aria-controls="academics-tabpanel-1"
          />
          <Tab
            icon={<Analytics />}
            label="Statistiques"
            id="academics-tab-2"
            aria-controls="academics-tabpanel-2"
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabMapping[activeTab]} index={0}>
        <TranscriptList
          onEditTranscript={handleEditTranscript}
          onDeleteTranscript={handleDeleteTranscript}
          onViewTranscript={handleViewTranscript}
        />
      </TabPanel>

      <TabPanel value={tabMapping[activeTab]} index={1}>
        <BehaviorReportList
          onEditReport={handleEditBehaviorReport}
          onDeleteReport={handleDeleteBehaviorReport}
          onViewReport={handleViewBehaviorReport}
        />
      </TabPanel>

      <TabPanel value={tabMapping[activeTab]} index={2}>
        <Box textAlign="center" py={8}>
          <Analytics sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Statistiques Académiques Bientôt Disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cette section affichera des analyses académiques complètes et des rapports.
          </Typography>
        </Box>
      </TabPanel>

      {/* Forms */}
      <TranscriptForm
        open={transcriptFormOpen}
        onClose={() => setTranscriptFormOpen(false)}
        transcript={selectedTranscript}
      />

      <BehaviorReportForm
        open={behaviorFormOpen}
        onClose={() => setBehaviorFormOpen(false)}
        report={selectedBehaviorReport}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AcademicsPage;