import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Payment,
  Notifications,
  Folder,
  Assessment,
  Settings,
  FamilyRestroom,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { text: 'Tableau de Bord', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Étudiants', icon: <People />, path: '/students' },
  { text: 'Parents', icon: <FamilyRestroom />, path: '/parents' },
  { text: 'Paiements', icon: <Payment />, path: '/payments' },
  { text: 'Académique', icon: <School />, path: '/academics' },
  { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
  { text: 'Fichiers', icon: <Folder />, path: '/files' },
  { text: 'Rapports', icon: <Assessment />, path: '/reports' },
  { text: 'Paramètres', icon: <Settings />, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const drawerWidth = 240;

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8, // Account for header height
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={isActive}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'primary.contrastText' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
