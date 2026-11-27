import { useEffect, useState } from 'react';
import { Typography, Stack, Button, Menu, MenuItem, ListItemIcon, Divider, ListItemText } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { SettingsRounded, AddRounded, InfoRounded, GroupRounded, PersonAddRounded, FlagRounded, CategoryRounded, HomeRounded } from '@mui/icons-material';

export default function StaffMenu(props) {
    const navigate = useNavigate()
    const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false)
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false)
    const [navbarAnchorEl, setNavbarAnchorEl] = useState(null)

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
                    left: 24,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                },
            },
        },
    }

    const handleProjectsClick = (event) => {
        setNavbarAnchorEl(event.currentTarget)
        setIsProjectsMenuOpen(true)
    }

    const handleSettingsClick = (event) => {
        setNavbarAnchorEl(event.currentTarget)
        setIsSettingsMenuOpen(true)
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            // if (event.shiftKey) {
            //     switch (event.key) {
            //         case "F":
            //             navigate("/staff/farms")
            //             break;
            //         case "P":
            //             navigate("/staff/plots")
            //             break;
            //         case "D":
            //             navigate("/devices")
            //             break;
            //         case "O":
            //             navigate("/staff")
            //             break;
            //         case "T":
            //             navigate("/tasks")
            //             break;
            //         case "M":
            //             navigate("/farms/map")
            //             break;
            //         default:
            //             break;
            //     }
            // }
        }

        const handleResize = () => {
            if (window.innerWidth < 600) {
                setIsProjectsMenuOpen(false)
                setIsSettingsMenuOpen(false)
            }
        }

        // Add event listener for keydown
        window.addEventListener("keydown", handleKeyDown);

        // Add event listener for window resize
        window.addEventListener("resize", handleResize);
    }, [])



    return (
        <>
            <Stack direction="row" spacing={1}>
                <Button sx={{ fontWeight: 700 }} startIcon={<CategoryRounded />} variant="text" color="inherit" onClick={handleProjectsClick}>Projects</Button>
                <Button sx={{ fontWeight: 700 }} startIcon={<SettingsRounded />} variant="text" color="inherit" onClick={handleSettingsClick}>Settings</Button>
            </Stack>
            <Menu
                anchorEl={navbarAnchorEl}
                open={isProjectsMenuOpen}
                onClose={() => setIsProjectsMenuOpen(false)}
                onClick={() => setIsProjectsMenuOpen(false)}
                slotProps={menuSlotProps}
            >
                <MenuItem onClick={() => navigate("/staff")}>
                    <ListItemIcon>
                        <HomeRounded />
                    </ListItemIcon>
                    <ListItemText primary="Admin Home" sx={{marginRight: "2rem"}} />
                    <Typography variant="caption" color="text.secondary">Ctrl + Alt + O</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => navigate("/staff/projects")}>
                    <ListItemIcon>
                        <FlagRounded />
                    </ListItemIcon>
                    <ListItemText primary="Manage Projects" sx={{marginRight: "2rem"}}/>
                    <Typography variant="caption" color="text.secondary">Ctrl + Alt + I</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate("/staff/projects?new=true")}>
                    <ListItemIcon>
                        <AddRounded />
                    </ListItemIcon>
                    <ListItemText primary="Add New Project" />
                </MenuItem>
            </Menu>
            <Menu
                anchorEl={navbarAnchorEl}
                open={isSettingsMenuOpen}
                onClose={() => setIsSettingsMenuOpen(false)}
                onClick={() => setIsSettingsMenuOpen(false)}
                slotProps={menuSlotProps}
            >
                <MenuItem onClick={() => navigate("/staff/users")}>
                    <ListItemIcon>
                        <GroupRounded />
                    </ListItemIcon>
                    <ListItemText primary="Manage Users" sx={{marginRight: "2rem"}} />
                    <Typography variant="caption" color="text.secondary">Ctrl + Alt + U</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate("/staff/users/create")}>
                    <ListItemIcon>
                        <PersonAddRounded />
                    </ListItemIcon>
                    <ListItemText primary="New User..." />
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => navigate("/about")}>
                    <ListItemIcon>
                        <InfoRounded />
                    </ListItemIcon>
                    <ListItemText primary="About Cat2.Link" />
                </MenuItem>
            </Menu>
        </>

    )
}