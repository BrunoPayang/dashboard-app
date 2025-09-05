import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  People as PeopleIcon,
  Link as LinkIcon,
  Notifications as NotificationsIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import ParentDirectory from '../../features/parentManagement/components/ParentDirectory/ParentDirectory';
import ParentStudentRelationships from '../../features/parentManagement/components/ParentStudentRelationships/ParentStudentRelationships';
import ParentCommunication from '../../features/parentManagement/components/ParentCommunication/ParentCommunication';
import CommunicationAnalytics from '../../features/parentManagement/components/CommunicationAnalytics/CommunicationAnalytics';

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
      id={`parent-tabpanel-${index}`}
      aria-labelledby={`parent-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `parent-tab-${index}`,
    'aria-controls': `parent-tabpanel-${index}`,
  };
}

const ParentsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Gestion des Parents
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez les comptes parents, les relations parent-étudiant et les communications
        </Typography>
      </Box>


      {/* Tabs Navigation */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Parent management tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '0.875rem'
            }
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon />
                Répertoire des Parents
              </Box>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon />
                Relations Parent-Étudiant
              </Box>
            }
            {...a11yProps(1)}
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon />
                Communication & Notifications
              </Box>
            }
            {...a11yProps(2)}
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnalyticsIcon />
                Analytics & Rapports
              </Box>
            }
            {...a11yProps(3)}
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <ParentDirectory />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ParentStudentRelationships />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ParentCommunication />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <CommunicationAnalytics />
      </TabPanel>
    </Container>
  );
};

export default ParentsPage;

