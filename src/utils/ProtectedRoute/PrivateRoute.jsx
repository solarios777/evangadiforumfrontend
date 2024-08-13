import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import axios from '../axios';
import { AppState } from "../../App";

const PrivateRoute = ({ children }) => {
    const [user, setUser] = useState({});
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

useEffect(() => {
    async function checkUser() {
        try {
            const { data } = await axios.get("/user/check", {
            headers: {
                Authorization: "Bearer " + token,
            },
            });
            setUser(data);
            setIsAuthorized(true);
        } catch (error) {
            console.log(error.response);
            setIsAuthorized(false);
        } finally {
            setLoading(false);
        }
        }
        if (token) {
        checkUser();
        } else {
        setLoading(false);
        }
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? (
        <AppState.Provider value={{ user, setUser }}>
        {children}
        </AppState.Provider>
    ) : (
        <Navigate to="/login" replace />
    );
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
