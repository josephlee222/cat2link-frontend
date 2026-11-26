import { useContext, useEffect, useState } from "react";
import { Card, CardContent, Grid } from "@mui/material";
import { AppContext } from "../../App";
import { ProfileContext } from "./ProfileRoutes";
import CardTitle from "../../components/CardTitle";
import { PersonRounded } from "@mui/icons-material";
import InfoBox from "../../components/InfoBox";
import http from "../../http";
import { useSnackbar } from "notistack";
import titleHelper from "../../functions/helpers";
import { useAuth } from "../../functions/AuthProvider";


export default function ViewProfile() {
    const { user, setUser } = useAuth();
    const { setActivePage } = useContext(ProfileContext);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleNewsletterSubscription = () => {
        setLoading(true);
        http.put("/User", { newsletter: !user.newsletter })
        .then((res) => {
            setUser(res.data);
            enqueueSnackbar("Newsletter subscription status updated.", { variant: "success" })
        })
        .catch((err) => {
            console.log(err);
            enqueueSnackbar("An error occurred while updating your newsletter subscription status.", { variant: "error" })
        })
        .finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        setActivePage(1);
    }, [])

    titleHelper("View Profile");

    return (

        <>
            <Card sx={{ mt: "1rem" }}>
                <CardContent>
                    <CardTitle title="Profile Information" icon={<PersonRounded />} />
                    <Grid container mt=".5rem" spacing={2}>
                        <Grid item xs={12} md={6}>
                            <InfoBox loading={!user} title="Name" value={user && user.name} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoBox loading={!user} title="Email Address" value={user && (user.email ? user.email : "Not Provided")} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )

}