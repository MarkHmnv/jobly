import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";
import {SIGNIN} from "./util/routes.js";

export const PrivateRoutes = () => {
    const user = useSelector(state => state.auth.user)
    return user ? <Outlet /> : <Navigate to={SIGNIN} />
}