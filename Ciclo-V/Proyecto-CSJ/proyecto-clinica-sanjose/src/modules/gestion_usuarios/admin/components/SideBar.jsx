import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FaUserMd, FaNotesMedical, FaUserInjured, FaBookMedical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '@mui/icons-material';
import { appLogout } from '../../store/admin/adminSlice';
import { startLogout } from '../../../auth/store/auth/thunks';

const menuItems = [
  { text: 'Médicos', icon: <FaUserMd />, path: 'medicos' },
  { text: 'Enfermería', icon: <FaNotesMedical />, path: 'enfermeria' },
  { text: 'Recepcionistas', icon: <FaBookMedical />, path: 'recepcionistas' },
  { text: 'Pacientes', icon: <FaUserInjured />, path: 'pacientes' },
];

export const SideBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Médicos');
  const { resp } = useSelector(state => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item.text);
    navigate(item.path); // Navega al path correspondiente

    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(appLogout());
    dispatch(startLogout());
  }


  const drawerContent = (
    <Box
      sx={{
        bgcolor: '#303030',
        height: '100%',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="img"
        sx={{
          height: '130px',
          width: '100px',
          alignSelf: 'center',
          margin: '10px 0 5px 0',
          justifySelf: 'center',
        }}
        alt="Logo de la clínica San José"
        src="/imgs/logo2.png"
      />
      <Typography fontFamily='Roboto' textAlign='center' variant='subtitle2' mt={-2} mb={2} >
        Clínica San José
      </Typography>

      <Typography
        textAlign='center'
      >
        Bienvenido, {resp.user.nombres}
      </Typography>

      <Divider sx={{ bgcolor: 'white', width: '80%', alignSelf: 'center', mb: 2, mt: 1 }} />

      <List sx={{ overflow: 'hidden' }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleItemClick(item)}
            sx={{
              bgcolor: selectedItem === item.text ? 'rgba(176, 205, 111, 0.15)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Box position='fixed' bottom={7} left={7} >
        <Tooltip title="Cerrar sesión" placement='right' >
          <IconButton onClick={handleLogout} >
            <Logout sx={{ color: 'white' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, ml: '10px', mt: '5px', position: 'fixed', top: 0, left: 8, zIndex: 1100, bgcolor: 'white' }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box
          component="nav"
          sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
        >
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
              }}
            >
              {drawerContent}
            </Drawer>
          ) : (
            <Drawer
              variant="permanent"
              sx={{
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
              }}
              open
            >
              {drawerContent}
            </Drawer>
          )}
        </Box>
      </Box>
    </>
  );
};
