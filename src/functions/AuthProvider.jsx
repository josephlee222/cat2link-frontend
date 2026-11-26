import { createContext, useContext, useEffect, useState } from 'react';
import http from '../http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    // Only start in a loading state if a token actually exists
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        async function fetchUser() {
            http.get("/auth/refresh").then((res) => {
                if (res.status === 200) {
                    var result = res.data
                    setUser(result.user)
                    setLoading(false)
                }
            }).catch((err) => {
                console.log(err)
                setLoading(false)
            }
            )
        }

        fetchUser();
    }, []);

    // if (loading) {
    //     return (<>
    //         <div
    //             style={{ height: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "nunito", flexDirection: "column" }}>
    //             <img src="/icon.png" height="100px" style={{ marginTop: "2rem", marginBottom: "1rem" }} />
    //             <img src="/loading.gif" height="24px" />
    //             <h3>Cat2.Link - Personal portfolio</h3>
    //         </div>
    //     </>);
    // }

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);