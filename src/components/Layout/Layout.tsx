import InventoryIcon from '@mui/icons-material/Inventory';
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Link,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  BeachAccess as BeachAccessIcon,
  AccountTree as StructureIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactElement;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { text: 'Zaposleni', path: '/zaposleni', icon: <PeopleIcon /> },
  { text: 'Plate', path: '/plate', icon: <AttachMoneyIcon /> },
  { text: 'Zahtevi za odmor', path: '/zahtevi-za-odmor', icon: <BeachAccessIcon /> },
  { text: 'Struktura', path: '/struktura', icon: <StructureIcon /> },
  { text: 'Inventar', icon: <InventoryIcon />, path: '/inventar' },
];

const pathTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/zaposleni': 'Zaposleni',
  '/plate': 'Plate',
  '/zahtevi-za-odmor': 'Zahtevi za odmor',
  '/struktura': 'Organizaciona struktura',
  '/moj-profil': 'Moj profil',
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfileNavigation = () => {
    handleUserMenuClose();
    navigate('/moj-profil');
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate('/login');
  };

  const getUserInitials = (userName: string) => {
    return userName.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  };

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    return [
      <Link 
        key="home" 
        color="inherit" 
        onClick={() => navigate('/dashboard')}
        sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
      >
        Početna
      </Link>,
      ...pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const title = pathTitles[routeTo] || name;
        
        return isLast ? (
          <Typography key={routeTo} color="text.primary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
        ) : (
          <Link 
            key={routeTo} 
            color="inherit" 
            onClick={() => navigate(routeTo)}
            sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {title}
          </Link>
        );
      })
    ];
  };

  const drawer = (
    <div>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Hogwarts HR
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Sistem za upravljanje ljudskim resursima
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: location.pathname === item.path ? 'inherit' : 'text.secondary'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
              sx={{ mb: 0.5 }}
            >
              {generateBreadcrumbs()}
            </Breadcrumbs>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              {pathTitles[location.pathname] || 'Hogwarts HR'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" color="text.secondary">
                Pozdrav, {user?.userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleUserMenuOpen}
              color="inherit"
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem'
                }}
              >
                {user?.userName ? getUserInitials(user.userName) : <PersonIcon />}
              </Avatar>
            </IconButton>
            
            <Menu
              id="user-menu"
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              onClick={handleUserMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2">{user?.userName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <MenuItem onClick={handleProfileNavigation}>
                <AccountCircleIcon sx={{ mr: 2 }} />
                Moj profil
              </MenuItem>
              <MenuItem onClick={handleUserMenuClose}>
                <SettingsIcon sx={{ mr: 2 }} />
                Podešavanja
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 2 }} />
                Odjavi se
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: 2
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 1,
              borderColor: 'divider'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
