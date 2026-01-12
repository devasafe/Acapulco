import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ShareIcon from '@mui/icons-material/Share';
import EmailIcon from '@mui/icons-material/Email';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

export default function Navbar({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);


  // Items para renderizar baseado em login
  const displayMenuItems = user ? [...alwaysVisibleItems, ...userOnlyItems] : alwaysVisibleItems;

  const handleLogoutClick = () => {
    handleMenuClose();
    onLogout();
  };

  const renderMenuItems = () => (
    <>
      {displayMenuItems.map((item) => (
        <ListItem key={item.path} disablePadding>
          <ListItemButton
            onClick={() => {
              navigate(item.path);
              setMobileMenuOpen(false);
            }}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderLeft: '3px solid #667eea'
              }
            }}
          >
            <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: 100 }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5,
          px: { xs: 2, sm: 3, md: 4 },
          background: 'linear-gradient(135deg, #0f1724 0%, #1a202c 100%)',
          borderBottom: '1px solid rgba(230, 238, 248, 0.05)',
        }}
      >
        {/* Logo */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transition: 'transform 200ms',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          💼 Acapulco
        </Box>

        {/* Desktop Menu */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {displayMenuItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  color: '#e6eef8',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  py: 1,
                  px: 1.5,
                  borderRadius: '8px',
                  transition: 'all 200ms',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <>
              <Avatar
                onClick={handleMenuOpen}
                sx={{
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  width: 40,
                  height: 40,
                  fontWeight: 700,
                  transition: 'transform 200ms',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  }
                }}
              >
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: '#1a202c',
                    backgroundClip: 'padding-box',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(230, 238, 248, 0.1)',
                    borderRadius: '12px',
                    mt: 1.5,
                  }
                }}
              >
                <MenuItem
                  onClick={() => { navigate('/profile'); handleMenuClose(); }}
                  sx={{
                    gap: 1.5,
                    '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
                  }}
                >
                  <PersonIcon fontSize="small" />
                  {user.name}
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  onClick={handleLogoutClick}
                  sx={{
                    color: '#f56565',
                    gap: 1.5,
                    '&:hover': { backgroundColor: 'rgba(245, 101, 101, 0.1)' }
                  }}
                >
                  <LogoutIcon fontSize="small" />
                  Sair
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{ color: '#e6eef8' }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="top"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#0f1724',
            backgroundClip: 'padding-box',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(230, 238, 248, 0.1)',
            marginTop: '64px',
            maxHeight: 'calc(100vh - 64px)'
          }
        }}
      >
        <Box sx={{ width: '100%' }}>
          <List>
            {renderMenuItems()}
            {user && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleLogoutClick}
                    sx={{
                      py: 1.5,
                      px: 2,
                      color: '#f56565',
                      '&:hover': {
                        backgroundColor: 'rgba(245, 101, 101, 0.1)',
                      }
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1.5 }} />
                    <ListItemText primary="Sair" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
