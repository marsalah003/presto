import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import axios from 'axios';
import { BACKEND_URL } from '../config';

const pages = ['login', 'register'];
const settings = ['dashboard'];

const ResponsiveAppBar = ({ isLoggedIn }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const { token, removeToken, handleBar } = useContext(UserContext);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/admin/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      removeToken(token);
      navigate('/login');
      handleBar('Successfully Logged out', 'success');
    } catch (err) {
      const msg = err.response.data.error;
      alert(msg);
    }
  };
  return (
    <AppBar position='sticky'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={`/${page}`}
                >
                  <Typography textAlign='center'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />

          {
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {!isLoggedIn &&
                pages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 1,
                      display: 'block',
                      color: 'white',
                      outline: '2px solid white',
                      mx: 1,
                    }}
                    variant='contained'
                    component={RouterLink}
                    to={`/${page}`}
                  >
                    {page}
                  </Button>
                ))}
            </Box>
          }

          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn && (
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt='profile picture'
                    src='../../public/default-profile-pic'
                  />
                </IconButton>
              </Tooltip>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={handleCloseUserMenu}
                  component={RouterLink}
                  to={`/${setting}`}
                >
                  <Typography textAlign='center'>{setting}</Typography>
                </MenuItem>
              ))}
              <MenuItem
                onClick={() => {
                  handleLogout();
                  handleCloseUserMenu();
                }}
              >
                <Typography textAlign='center'>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
