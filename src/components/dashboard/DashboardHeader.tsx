import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';

const DashboardHeader: React.FC = () => {
  const { user, school } = useSelector((state: RootState) => state.auth);

  if (!user || !school) {
    return null;
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        {/* School Information */}
        <Box display="flex" alignItems="center" gap={2} flex={1}>
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              width: 80, 
              height: 80,
              border: '3px solid rgba(255,255,255,0.3)'
            }}
          >
            <SchoolIcon sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                mb: 1
              }}
            >
              {school.name}
            </Typography>
            
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Chip
                icon={<SchoolIcon />}
                label={`${school.city}, ${school.state}`}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
              
              {school.phone && (
                <Chip
                  label={school.phone}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white' 
                  }}
                />
              )}
              
              {school.email && (
                <Chip
                  label={school.email}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white' 
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* User Information */}
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="flex-end" 
          gap={1}
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.1)', 
            p: 2, 
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <AdminIcon sx={{ color: 'rgba(255,255,255,0.8)' }} />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              School Staff
            </Typography>
          </Box>
          
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 1 }} />
          
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon sx={{ color: 'rgba(255,255,255,0.8)' }} />
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {user.first_name} {user.last_name}
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            @{user.username}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default DashboardHeader;
