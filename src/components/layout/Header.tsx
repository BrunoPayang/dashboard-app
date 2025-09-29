import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings,
  Logout,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../features/store';
import { logout } from '../../features/auth/authSlice';
import { useSchoolLogo } from '../../hooks/useSchoolLogo';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, school } = useSelector((state: RootState) => state.auth);
  const { logoUrl, hasLogo } = useSchoolLogo();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {hasLogo && (
            <Box
              component="img"
              src={logoUrl}
              alt={school?.name || 'School Logo'}
              sx={{
                height: 40,
                width: 40,
                mr: 2,
                borderRadius: 1,
                objectFit: 'contain',
              }}
            />
          )}
          <Typography variant="h6" noWrap component="div">
            {school?.name || 'School Dashboard'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.first_name} {user?.last_name}
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={isMenuOpen ? 'primary-search-account-menu' : undefined}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        id="primary-search-account-menu"
        keepMounted
        open={isMenuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleSettings}>
          <Settings sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
