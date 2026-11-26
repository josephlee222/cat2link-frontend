import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../App'
import { Card, CardContent, Grid, Typography, ButtonBase, Stack, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AppsRounded, AddRounded, FlagRounded, PeopleRounded, CategoryRounded } from '@mui/icons-material'
import CardTitle from '../../components/CardTitle'
import titleHelper from '../../functions/helpers';
import { LayoutContext } from './AdminRoutes'
import { GridToolbarExport } from '@mui/x-data-grid'

export default function AdminHome() {
    //Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const { setAdminPage } = useContext(AppContext);
    const { setContainerWidth } = useContext(LayoutContext);

    const customToolbar = () => {
        return (
            <GridToolbarExport />
        );
    }

    const useStyles = makeStyles(theme => ({
        outerDiv: {
            '&:hover': {
                "& $divIcon": {
                    opacity: "0.15",
                    bottom: "-28px",
                    right: "-28px",
                    rotate: "-15deg"
                }
            }
        },
        divIcon: {
            opacity: "0",
            transitionDuration: "1s"
        }
    }));

    const iconStyles = { position: "absolute", bottom: "-48px", right: "-48px", width: "128px", height: "128px", transition: "0.5s", display: { xs: "none", md: "initial" } }
    const classes = useStyles();


    useEffect(() => {
        setContainerWidth("xl")
        setAdminPage(true)
    }, [])



    titleHelper("Main Dashboard")

    return (
        <>
            <Box my={"1rem"}>
                <Card>
                    <CardContent>
                        <CardTitle title="Staff Shortcuts" icon={<AppsRounded />} />
                        <Grid container spacing={2} mt={"0"}>
                            <Grid item xs={12} md={6}>
                                <Card variant='draggable'>
                                    <ButtonBase className={classes.outerDiv} component={Link} to="/staff/items" sx={{ width: "100%", justifyContent: 'start' }}>
                                        <CardContent sx={{ color: "primary.main" }}>
                                            <Stack direction={{ xs: "row", md: "column" }} alignItems={{ xs: "center", md: "initial" }} spacing={{ xs: "1rem", md: 1 }}>
                                                <FlagRounded sx={{ width: { xs: "24px", sm: "36px" }, height: { xs: "24px", sm: "36px" } }} />
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>View Projects</Typography>
                                                    <Typography variant="body1" sx={{ display: { xs: "none", sm: "initial" } }}>Manage Projects</Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                        <FlagRounded className={classes.divIcon} sx={iconStyles} />
                                    </ButtonBase>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant='draggable'>
                                    <ButtonBase className={classes.outerDiv} component={Link} to="/staff/items?new=true" sx={{ width: "100%", justifyContent: 'start' }}>
                                        <CardContent sx={{ color: "primary.main" }}>
                                            <Stack direction={{ xs: "row", md: "column" }} alignItems={{ xs: "center", md: "initial" }} spacing={{ xs: "1rem", md: 1 }}>
                                                <AddRounded sx={{ width: { xs: "24px", sm: "36px" }, height: { xs: "24px", sm: "36px" } }} />
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>Create Project</Typography>
                                                    <Typography variant="body1" sx={{ display: { xs: "none", sm: "initial" } }}>Create a New Project</Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                        <AddRounded className={classes.divIcon} sx={iconStyles} />
                                    </ButtonBase>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant='draggable'>
                                    <ButtonBase className={classes.outerDiv} component={Link} to="/staff/users" sx={{ width: "100%", justifyContent: 'start' }}>
                                        <CardContent sx={{ color: "primary.main" }}>
                                            <Stack direction={{ xs: "row", md: "column" }} alignItems={{ xs: "center", md: "initial" }} spacing={{ xs: "1rem", md: 1 }}>
                                                <PeopleRounded sx={{ width: { xs: "24px", sm: "36px" }, height: { xs: "24px", sm: "36px" } }} />
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>Users</Typography>
                                                    <Typography variant="body1" sx={{ display: { xs: "none", sm: "initial" } }}>Manage Users</Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                        <PeopleRounded className={classes.divIcon} sx={iconStyles} />
                                    </ButtonBase>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant='draggable'>
                                    <ButtonBase className={classes.outerDiv} component={Link} to="/staff/categories" sx={{ width: "100%", justifyContent: 'start' }}>
                                        <CardContent sx={{ color: "primary.main" }}>
                                            <Stack direction={{ xs: "row", md: "column" }} alignItems={{ xs: "center", md: "initial" }} spacing={{ xs: "1rem", md: 1 }}>
                                                <CategoryRounded sx={{ width: { xs: "24px", sm: "36px" }, height: { xs: "24px", sm: "36px" } }} />
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>Categories</Typography>
                                                    <Typography variant="body1" sx={{ display: { xs: "none", sm: "initial" } }}>Manage Categories</Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                        <CategoryRounded className={classes.divIcon} sx={iconStyles} />
                                    </ButtonBase>
                                </Card>
                            </Grid>
                        </Grid>

                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

