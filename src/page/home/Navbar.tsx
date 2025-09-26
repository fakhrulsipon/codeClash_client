import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router"
import Logo from "../../components/Logo";
import { AuthContext } from "../../provider/AuthProvider";
import toast from "react-hot-toast";

const pages = [
  { name: "Home", path: "/" },
  { name: "Problem set", path: "/problems" },
  { name: "About", path: "/about" },
];
const settings = ["Profile"];

function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );
    const { user, logoutUser } = React.use(AuthContext)!;

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
     })
     .catch((error) => {
         toast.error("❌ Logout failed: " + error.message);
     })
    }

    return (
        <AppBar
            position="sticky"
            sx={{ background: "linear-gradient(to right, #1e3a8a, #2563eb)" }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/*  Left Logo (Desktop) */}
                    <div className="hidden lg:block mr-4">
                        <Logo />
                    </div>

                    {/*  Mobile Menu + Logo side by side */}
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

                        {/* Logo next to Menu Icon */}
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
                        </Menu>
                    </Box>

                    {/*  Middle Pages (Desktop) */}
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
                                    "&:hover": { color: "#facc15" }, // yellow hover
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {/*  User Menu */}
                    <div className="">
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    {
                                        user && <img className="w-8 h-8 md:w-12 md:h-12 rounded-full" src={user?.photoURL || "/default-img.jpg"} /> 
                                    }
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
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
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography sx={{ textAlign: "center" }}>
                                            {setting}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </div>

                    {
                        user ? (
                            <button onClick={handleLogout} className="ml-4 px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors text-sm sm:text-base">Logout</button>

                    
                        ): (
                           <Link to="/login">
                        <button className="ml-4 px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors text-sm sm:text-base">
                            Login
                        </button>
                        </Link>
                        )
                    }
                    
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
