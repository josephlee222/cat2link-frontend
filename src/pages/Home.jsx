import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Typography, Box, Card, Skeleton, CardContent, CardMedia, Chip, Stack, Grid2, useTheme, CardActions } from '@mui/material'
import { CategoryRounded, InfoRounded, WebRounded } from '@mui/icons-material';
import titleHelper from '../functions/helpers';
import { useSnackbar } from "notistack";
import http from '../http';
import ItemDialog from '../components/ItemDialog';


function Home() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    titleHelper("Home")
    const apiUrl = import.meta.env.VITE_API_URL;
    const [banners, setBanners] = useState({})
    const [loading, setLoading] = useState(false)
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
    const [detailsId, setDetailsId] = useState(null)
    const { enqueueSnackbar } = useSnackbar();
    const [projects, setProjects] = useState([])
    const theme = useTheme()
    const bucket_url = import.meta.env.VITE_BUCKET_URL


    const handleGetProjects = async () => {
        setLoading(true)
        http.get("/projects/").then((res) => {
            if (res.status === 200) {
                var activities = res.data
                console.log(activities.reverse())
                setProjects(activities)
                setLoading(false)
            }
        }).catch((err) => {
                enqueueSnackbar("Failed to load activities! " + err.response.data.message, { variant: "error" });
                setLoading(false)
            }
        )
    }

    const handleDetailsClose = () => {
        setDetailsDialogOpen(false)
    }

    const handleDetailsOpen = (id) => {
        setDetailsId(id)
        setDetailsDialogOpen(true)
    }

    useEffect(() => {
        handleGetProjects()
    }, [])



    return (
        <>
            <Box sx={{ backgroundColor: theme.palette.primary.main, py: "6rem" }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexDirection: { xs: "column-reverse", md: "row" }, }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h2" fontWeight={700} sx={{ color: theme.palette.primary.contrastText }}>Joseph Lee</Typography>
                            <Typography variant="h5" fontWeight={400} sx={{ color: theme.palette.primary.contrastText }}>Computer and Software Enthusiast</Typography>
                            <Stack direction="row" spacing="1rem" sx={{ mt: "1rem" }}>
                                <Button variant="white" color="secondary" sx={{ mt: "1rem" }} component={Link} to="/projects" startIcon={<WebRounded />}>View Projects</Button>
                                <Button variant="secondary_inverted" color="secondary" sx={{ mt: "1rem" }} component={Link} to="/about" startIcon={<InfoRounded />}>About Me</Button>
                            </Stack>
                            
                        </Box>
                        <Box>
                            <img src="/lost_and_found.png" alt="Hero" style={{ width: "100%", maxWidth: "300px" }} />
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Container maxWidth="xl">
                <Typography variant="h5" my={"2rem"} fontWeight={700} sx={{ borderBottom: "3px dashed " + theme.palette.primary.main, width: "fit-content" }}>Latest Projects</Typography>
                <Grid2 container spacing={2} sx={{ mb: "1rem"}}>
                    {// If projects are loading, show skeleton loaders instead of the projects}
                        loading && [1, 2, 3].map((i) => (
                            <Grid2 size={{ lg: 4, sm: 6, xs: 12 }} key={i}>
                                <Card sx={{ width: "100%" }}>
                                    <Skeleton variant="rectangular" height={200} animation="wave" />
                                    <CardContent>
                                        <Stack direction="column" spacing={"0.5rem"}>
                                            <Skeleton variant="text" width={"15rem"} height={48} animation="wave" />
                                            <Skeleton variant="text" width={"7rem"} height={24} animation="wave" />
                                            
                                        </Stack>
                                        <Skeleton variant="text" width={"5rem"} height={32} sx={{mt: "1rem"}} animation="wave" />
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    {// Show first 3 projects
                        projects.slice(0, 3).map((item, i) => (
                            <Grid2 size={{ lg: 4, sm: 6, xs: 12 }} key={i}>
                                <Card sx={{ width: "100%" }}>
                                    <CardMedia
                                        sx={{ height: 200, backgroundColor: "darkgrey", objectFit: "contain" }}
                                        image={item.attachment ? bucket_url + "/items/" + item.id + "/" + item.attachment.replace(" ", "+") : "/icon.png"}
                                        title="Background"
                                        component={"img"}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" fontWeight={700}>
                                            {item.name}
                                        </Typography>
                                        <Chip label={item.category_name} icon={<CategoryRounded />} size='small' />
                                    </CardContent>
                                    <CardActions>
                                        <Button size="medium" startIcon={<InfoRounded />} onClick={() => {
                                            handleDetailsOpen(item.id)
                                        }}>Project Details</Button>
                                    </CardActions>
                                </Card>
                            </Grid2>
                        ))}
                    
                </Grid2>
            </Container>
            <ItemDialog open={detailsDialogOpen} onClose={handleDetailsClose} itemId={detailsId} guestMode />
        </>
    )
}


export default Home