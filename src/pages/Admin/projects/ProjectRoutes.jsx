import { useContext, useEffect, createContext, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import NotFound from '../../errors/NotFound'
import { LayoutContext } from '../AdminRoutes'
import ViewProjects from './ViewProjects'


export const CategoryContext = createContext(null);
export default function ProjectRoutes() {
    const [activePage, setActivePage] = useState(null);
    const { setContainerWidth } = useContext(LayoutContext);

    useEffect(() => {
        setContainerWidth("xl")
    }, [])

    return (
        <>
            <CategoryContext.Provider value={{ activePage, setActivePage }}>
                <Routes>
                    <Route path="/" element={<ViewProjects />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </CategoryContext.Provider>
        </>

    )
}