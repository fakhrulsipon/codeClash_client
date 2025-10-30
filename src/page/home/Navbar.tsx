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
import LogoutIcon from "@mui/icons-material/Logout";
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
  const { totalSubmissions } = useUserSubmissions();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
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
    { name: "Home", path: "/", icon: <Home /> },
    { name: "Problems", path: "/problems", icon: <Code /> },
    { name: "AI Agent", path: "/ai-agent", icon: <SmartToy /> },
    { name: "Contests", path: "/all-contests", icon: <EmojiEvents /> },
    { name: "About", path: "/about", icon: <Info /> },
  ];

  const pages = user
    ? [
        ...basePages,
        { name: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
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
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar
          disableGutters
          sx={{
            py: 0.5,
            minHeight: { xs: "56px", md: "64px" },
          }}
        >
          {/* Logo - Desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              mr: { md: 2, lg: 3 },
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Logo />
          </Box>

          {/* Mobile Menu Button & Logo */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenNavMenu}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                mr: 1,
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo for Mobile */}
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              <Logo />
            </Box>
          </Box>

          {/* Navigation Links - Desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: { md: 0.5, lg: 1, xl: 1.5 },
              // Center for logged out users, flex-start for logged in users
              flexGrow: user ? { md: 1, lg: 0 } : 1,
              justifyContent: user ? { md: "center", lg: "flex-start" } : "center",
              ml: user ? { md: 1, lg: 2 } : 0,
              flexWrap: "nowrap",
              overflow: "hidden",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                startIcon={React.cloneElement(page.icon, {
                  sx: { fontSize: { md: 18, lg: 20 } },
                })}
                onClick={handleCloseNavMenu}
                sx={{
                  color: "white",
                  fontWeight: isActiveLink(page.path) ? "700" : "500",
                  backgroundColor: isActiveLink(page.path)
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                  borderRadius: "8px",
                  px: { md: 1.5, lg: 2, xl: 2.5 },
                  py: 0.75,
                  minWidth: "auto",
                  fontSize: { md: "0.8rem", lg: "0.875rem", xl: "0.9rem" },
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                  flexShrink: 0,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                  transition: "all 0.3s ease",
                  border: isActiveLink(page.path)
                    ? "1px solid rgba(255,255,255,0.3)"
                    : "1px solid transparent",
                  "& .MuiButton-startIcon": {
                    marginRight: { md: 0.5, lg: 0.75 },
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Right Section - User Menu & Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.5, md: 1, lg: 1.5 },
              ml: user ? "auto" : { md: 2, lg: 3 }, // Adjust margin for logged out users
              flexShrink: 0,
            }}
          >
            {/* Notification Bell - Only for logged in users */}
            {user && (
              <IconButton
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  padding: { xs: 0.5, md: 0.75 },
                }}
                size="small"
              >
                <Notifications
                  sx={{
                    fontSize: { xs: 20, md: 22, lg: 24 },
                  }}
                />
              </IconButton>
            )}

            {/* User Avatar & Menu for logged in users */}
            {user ? (
              <>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    padding: 0.5,
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                  size="small"
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      referrerPolicy="no-referrer"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.3)",
                      }}
                    />
                  ) : (
                    <AccountCircle
                      sx={{
                        color: "white",
                        fontSize: { xs: 28, md: 30, lg: 32 },
                      }}
                    />
                  )}
                </IconButton>

                {/* User Menu */}
                <Menu
                  sx={{
                    mt: { xs: "36px", md: "40px" },
                    "& .MuiPaper-root": {
                      minWidth: "180px",
                      maxWidth: "220px",
                    },
                  }}
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
                      mt: 0.5,
                      py: 0.5,
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    component={Link}
                    to="history"
                    sx={{
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                      py: 1.25,
                      minHeight: "auto",
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
                            minWidth: "20px",
                            height: "20px",
                          },
                        }}
                      >
                        <HistoryIcon sx={{ fontSize: 20 }} />
                      </Badge>
                      <Typography variant="body2" fontWeight="medium">
                        History
                      </Typography>
                    </Box>
                  </MenuItem>

                  <MenuItem
                    onClick={handleCloseUserMenu}
                    component={Link}
                    to="/dashboard"
                    sx={{
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                      py: 1.25,
                      minHeight: "auto",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Dashboard sx={{ mr: 2, fontSize: 20 }} />
                      <Typography variant="body2" fontWeight="medium">
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
                        py: 1.25,
                        minHeight: "auto",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                        <Typography variant="body2" fontWeight="medium">
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
                    className="px-3 py-1.5 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer text-sm"
                  >
                    Logout
                  </button>
                )}
              </>
            ) : (
              // Login Button for logged out users
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                  px: { xs: 2, md: 2.5, lg: 3 },
                  py: { xs: 0.75, md: 1 },
                  background: "linear-gradient(to right, #f59e0b, #eab308)",
                  color: "blue.900",
                  fontWeight: "bold",
                  fontSize: { xs: "0.8rem", md: "0.875rem" },
                  minWidth: "auto",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    background: "linear-gradient(to right, #eab308, #ca8a04)",
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  },
                  transition: "all 0.3s ease",
                  borderRadius: "8px",
                }}
              >
                Login
              </Button>
            )}
          </Box>

          {/* Mobile Navigation Menu */}
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
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiPaper-root": {
                minWidth: "200px",
                maxWidth: "calc(100vw - 32px)",
              },
            }}
            PaperProps={{
              sx: {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                overflow: "hidden",
                mt: 0.5,
                py: 0.5,
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
                  py: 1.5,
                  minHeight: "auto",
                  whiteSpace: "nowrap",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                    {React.cloneElement(page.icon, { sx: { fontSize: 20 } })}
                  </Box>
                  <Typography variant="body2" fontWeight="medium">
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
                  py: 1.5,
                  minHeight: "auto",
                  whiteSpace: "nowrap",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                  <Typography variant="body2" fontWeight="medium">
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