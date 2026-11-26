import { useContext, useEffect, createContext, useState } from 'react'
import { useAuth } from '../../functions/AuthProvider'
import { Route, Routes, useNavigate } from 'react-router-dom'
import NotFound from '../errors/NotFound'
import Test from '../Test'
import { AppContext } from '../../App'
import { useSnackbar } from 'notistack'
import { Container } from '@mui/material'
import AdminUsersRoutes from './users/AdminUsersRoutes'
import AdminHome from './AdminHome'
import ItemRoutes from './items/ItemRoutes'

export const LayoutContext = createContext(null);

export default function AdminRoutes() {
    //Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const { setAdminPage } = useContext(AppContext);
    const { user, loading } = useAuth()
    const [containerWidth, setContainerWidth] = useState("xl");
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        setAdminPage(true)
        if (!loading && user.role !== "admin") {
            enqueueSnackbar("You must be an admin to view this page", { variant: "error" });
            navigate("/");
        }
    }, [])

    return (
        <>
            <LayoutContext.Provider value={{ containerWidth, setContainerWidth }}>
                <Container maxWidth={containerWidth}>
                    <Routes>
                        <Route path="*" element={<NotFound />} />
                        <Route path="/" element={<AdminHome />} />
                        <Route path="/items/*" element={<ItemRoutes />} />
                        <Route path="/test" element={<Test />} />
                        <Route path="/users/*" element={<AdminUsersRoutes />} />
                    </Routes>
                </Container>
            </LayoutContext.Provider>
        </>
    )
}

