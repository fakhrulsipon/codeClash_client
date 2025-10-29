import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Link, useLocation } from "react-router";
import Logo from "../../components/Logo";
import { AuthContext } from "../../provider/AuthProvider";
import toast from "react-hot-toast";
import {
  AccountCircle,
  Notifications,
  Dashboard,
  Code,
  EmojiEvents,
  Home,
  Info,
  History as HistoryIcon,
  SmartToy,
} from "@mui/icons-material";
import { Badge, Typography, useMediaQuery, useTheme } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useUserSubmissions } from "../../hook/useUserSubmissions";

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const { user, logoutUser } = React.use(AuthContext)!;
  const location = useLocation();
  const { totalSubmissions } =
    useUserSubmissions();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };



  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        toast.success("👋 Logged out successfully!");
        handleCloseUserMenu();
      })
      .catch((error) => {
        toast.error("❌ Logout failed: " + error.message);
      });
  };

  const basePages = [
    { name: "Home", path: "/", icon: <Home sx={{ fontSize: 20 }} /> },
    {
      name: "Problem Set",
      path: "/problems",
      icon: <Code sx={{ fontSize: 20 }} />,
    },
    // miskaran's contribution
    {
      name: "AI Agent",
      path: "/ai-agent",
      icon: <SmartToy sx={{ fontSize: 20 }} />, 
    },

    {
      name: "Contests",
      path: "/all-contests",
      icon: <EmojiEvents sx={{ fontSize: 20 }} />,
    },
    { name: "About", path: "/about", icon: <Info sx={{ fontSize: 20 }} /> },
  ];

  const pages = user
    ? [
      ...basePages,
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <Dashboard sx={{ fontSize: 20 }} />,
      },
    ]
    : basePages;

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo - Desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 4 }}>
            <Logo />
          </Box>

          {/* Mobile Menu */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenNavMenu}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo for Mobile */}
            <Box sx={{ ml: 2 }}>
              <Logo />
            </Box>
          </Box>

          {/* Navigation Links - Desktop */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              gap: 1,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                startIcon={page.icon}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 1,
                  color: "white",
                  fontWeight: isActiveLink(page.path) ? "700" : "500",
                  backgroundColor: isActiveLink(page.path)
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                  borderRadius: "12px",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                  transition: "all 0.3s ease",
                  border: isActiveLink(page.path)
                    ? "1px solid rgba(255,255,255,0.3)"
                    : "1px solid transparent",
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Right Section - User Menu & Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Notification Bell */}
            {user && (
              <IconButton
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Notifications />
              </IconButton>
            )}

            {/* User Avatar & Menu */}
            {user ? (
              <>

                {user?.photoURL ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <AccountCircle sx={{ color: "white", fontSize: 32 }} />
                )}


                <Menu
                  sx={{ mt: "45px" }}
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: {
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      mt: 1,
                    },
                  }}
                >
                  {/* History MenuItem with Submission Stats */}
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    component={Link}
                    to="history"
                    sx={{
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                      py: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Badge
                        badgeContent={totalSubmissions}
                        color="secondary"
                        sx={{
                          mr: 2,
                          "& .MuiBadge-badge": {
                            background:
                              "linear-gradient(45deg, #FF6B6B, #FF8E53)",
                            border: "2px solid white",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                          },
                        }}
                      >
                        <HistoryIcon />
                      </Badge>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          History
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>

                  <MenuItem
                    onClick={handleCloseUserMenu}
                    component={Link}
                    to="/dashboard"
                    sx={{
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                      py: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Dashboard sx={{ mr: 2 }} />
                      <Typography variant="body1" fontWeight="medium">
                        Dashboard
                      </Typography>
                    </Box>
                  </MenuItem>

                  {/* Logout MenuItem - Only show on mobile */}
                  {isMobile && (
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        color: "white",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                        py: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <LogoutIcon sx={{ mr: 2 }} />
                        <Typography variant="body1" fontWeight="medium">
                          Logout
                        </Typography>
                      </Box>
                    </MenuItem>
                  )}
                </Menu>

                {/* Logout Button - Only show on desktop */}
                {!isMobile && (
                  <button
                    onClick={handleLogout}
                    className="hidden sm:block px-4 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                  >
                    Logout
                  </button>
                )}
              </>
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                  Login
                </button>
              </Link>
            )}
          </Box>

          {/* Mobile Menu */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: "block", md: "none" } }}
            PaperProps={{
              sx: {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                overflow: "hidden",
                mt: 1,
              },
            }}
          >
            {pages.map((page) => (
              <MenuItem
                key={page.name}
                onClick={handleCloseNavMenu}
                component={Link}
                to={page.path}
                sx={{
                  color: "white",
                  backgroundColor: isActiveLink(page.path)
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  py: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Box sx={{ mr: 2 }}>{page.icon}</Box>
                  <Typography variant="body1" fontWeight="medium">
                    {page.name}
                  </Typography>
                </Box>
              </MenuItem>
            ))}

            {/* Logout in mobile nav menu */}
            {user && isMobile && (
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  py: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <LogoutIcon sx={{ mr: 2 }} />
                  <Typography variant="body1" fontWeight="medium">
                    Logout
                  </Typography>
                </Box>
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;