import { useState } from "react";
import { Box, IconButton, ListItemIcon, ListItemText, Divider, Typography, colors, Menu, MenuItem } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import ProfilePicture from "./ProfilePicture";
import { useAuth } from "../functions/AuthProvider";
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { enqueueSnackbar } from "notistack";
import http from "../http";

export default function NavbarProfile() {
    const { user, setUser } = useAuth();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const isStaff = user.role == "admin";
    const navigate = useNavigate()
    const menuSlotProps = {
        paper: {
            elevation: 0,
            sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 0.5,
                '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                },
                '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 24,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                },
            },
        },
    }

    function handlePopoverOpen(event) {
        setAnchorEl(event.currentTarget);
        console.log(user)
        setIsPopoverOpen(true);
    }

    function handleLogout() {
        setIsPopoverOpen(false)
        setUser(null)
        localStorage.removeItem("token");

        http.get("/auth/logout").catch((err) => {
            enqueueSnackbar("An error occurred while logging out.", { variant: "warning" });
        });
        
        enqueueSnackbar("Successfully logged out", { variant: "success" })
        navigate("/")
    }

    // Profile picture should be implemented later
    return (
        <>
            <IconButton onClick={(e) => handlePopoverOpen(e)}>
                <ProfilePicture user={user} />
            </IconButton>
            <Menu
                id={"userPopover"}
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={() => setIsPopoverOpen(false)}
                onClick={() => setIsPopoverOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    horizontal: 'right',
                }}
                slotProps={menuSlotProps}
            >
                <MenuItem component={Link} to="/profile">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ProfilePicture sx={{marginLeft: 0}} user={user} />
                        <Box marginLeft={"0.5rem"}>
                            <Typography variant="subtitle1" fontWeight={700}>{user.name}</Typography>
                            <Typography variant="body2">{user.email}</Typography>
                        </Box>
                    </Box>
                </MenuItem>
                <Divider />
                {isStaff &&
                    <MenuItem component={Link} to="/staff">
                        <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                        <ListItemText primary={"Admin Panel"} />
                    </MenuItem>}
                <MenuItem onClick={() => handleLogout()} sx={{ color: colors.red[500] }}>
                    <ListItemIcon><LogoutIcon sx={{ color: colors.red[500] }} /></ListItemIcon>
                    <ListItemText primary={"Logout"} />
                </MenuItem>
                {/* <List>
                    <ListItem key={"My Profile"} disablePadding>
                        <ListItemButton component={Link} to="/profile" onClick={() => setIsPopoverOpen(false)}>
                            <ListItemIcon><PersonIcon /></ListItemIcon>
                            <ListItemText primary={"My Profile"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"Cart"} disablePadding sx={{ display: { xs: "initial", md: "none" } }}>
                        <ListItemButton component={Link} to="/cart" onClick={() => setIsPopoverOpen(false)}>
                            <ListItemIcon><ShoppingCartRounded /></ListItemIcon>
                            <ListItemText primary={"Cart"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"Friends & Groups"} disablePadding sx={{ display: { xs: "initial", md: "none" } }}>
                        <ListItemButton component={Link} to="/groupList" onClick={() => setIsPopoverOpen(false)}>
                            <ListItemIcon><Diversity3Rounded /></ListItemIcon>
                            <ListItemText primary={"Friends & Groups"} />
                        </ListItemButton>
                    </ListItem>
                    {isStaff &&
                        <ListItem key={"Staff Panel"} disablePadding>
                            <ListItemButton component={Link} to="/staff" onClick={() => setIsPopoverOpen(false)}>
                                <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                                <ListItemText primary={"Staff Panel"} />
                            </ListItemButton>
                        </ListItem>}
                    <ListItem key={"Logout"} disablePadding>
                        <ListItemButton onClick={() => handleLogout()} sx={{ color: colors.red[500] }}>
                            <ListItemIcon><LogoutIcon sx={{ color: colors.red[500] }} /></ListItemIcon>
                            <ListItemText primary={"Logout"} />
                        </ListItemButton>
                    </ListItem>
                </List> */}
            </Menu>
        </>
    )
}