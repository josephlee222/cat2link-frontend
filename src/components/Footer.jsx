import { Typography, Divider, Box } from '@mui/material'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <>
            <Divider />
            <Box>
                {/* <Container
                    maxWidth="xl"
                    sx={{
                        marginY: "1rem",
                    }}
                >
                    <Typography variant='p' color='primary' sx={{ fontWeight: 700 }}>ReclaimIt</Typography>
                    <Grid container spacing={2}>

                        <Grid item xs={12} lg={6}>
                            <Stack spacing={2} direction={{ sx: "column", lg: "row" }} color={"primary.main"}>
                                <Button color='inherit' startIcon={<HomeIcon />} LinkComponent={Link} variant="text" to="/">Home</Button>
                                <Button color='inherit' startIcon={<ContactPageRounded />} LinkComponent={Link} variant="text" to="/">Contact Us</Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Stack spacing={2} direction={"row"} justifyContent={{ xs: "center", md: "start" }} color={"primary.main"}>
                                <Box display={"flex"} alignItems={"center"}>
                                    <EmailRounded sx={{ marginRight: "1rem" }} />
                                    <Box>
                                        <Typography fontWeight={700} variant='body1'>Email</Typography>
                                        <Typography variant='body2'>
                                            contact@reclaimit.net
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems={"center"}>
                                    <PhoneRounded sx={{ marginRight: "1rem" }} />
                                    <Box>
                                        <Typography fontWeight={700} variant='body1'>Phone</Typography>
                                        <Typography variant='body2'>
                                            +65 9123 4567
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>

                </Container> */}
                <Box sx={{ textAlign: "center", margin: "1rem" }}>
                    <Link to="/about" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography color={"inherit"} sx={{ textAlign: "center", opacity: "0.5" }} >Cat2.Link - Joseph Lee - 2027</Typography>
                    </Link>
                </Box>
            </Box>

        </>
    )
}

export default Footer