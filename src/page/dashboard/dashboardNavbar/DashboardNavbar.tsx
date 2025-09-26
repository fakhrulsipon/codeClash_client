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
import { Link } from "react-router";
import Logo from "../../../components/Logo";

const pages = [
  { name: "Home", path: "/" },
  { name: "Problems Set", path: "/problems" },
];

export default function DashboardNavbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{ background: "linear-gradient(to right, #1e3a8a, #2563eb)" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo (Desktop) */}
          <div className="hidden lg:block mr-4">
            <Logo />
          </div>

          {/* Mobile Menu + Logo */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              alignItems: "center",
            }}
          >
            {/* Menu Icon */}
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            {/* Logo beside menu icon */}
            <div className="ml-2">
              <Logo />
            </div>

            {/* Dropdown Menu */}
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
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link to={page.path} className="w-full text-center">
                    {page.name}
                  </Link>
                </MenuItem>
              ))}
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/login" className="w-full text-center">
                  Login
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          {/* Pages (Desktop) */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  fontWeight: "600",
                  "&:hover": { color: "#facc15" },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Login button (Desktop) */}
          <Link to="/login">
            <button className="ml-4 px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors text-sm sm:text-base">
              Login
            </button>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
