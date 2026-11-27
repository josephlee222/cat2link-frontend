import { useContext, useEffect } from "react";
import { Alert, Card, CardContent } from "@mui/material";
import { ProfileContext } from "./ProfileRoutes";
import titleHelper from "../../functions/helpers";

export default function ViewSecurity() {
    const { setActivePage } = useContext(ProfileContext);

    useEffect(() => {
        setActivePage(4);
    }, []);

    titleHelper("Profile Security");

    return (
        <Card sx={{ mt: "1rem" }}>
            <CardContent>
                <Alert severity="info">Two-factor authentication management is currently unavailable.</Alert>
            </CardContent>
        </Card>
    );
}
