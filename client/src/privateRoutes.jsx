import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";
import {HOME, SIGNIN} from "./util/routes.js";
import {parseJwt} from "./util/jwt.js";
import CandidateOwnProfile from "./components/Pages/Profile/CandidateOwnProfile.jsx";
import RecruiterOwnProfile from "./components/Pages/Profile/RecruiterOwnProfile.jsx";

export const PrivateRoutes = () => {
    const token = useSelector(state => state.auth.accessToken)
    return token ? <Outlet /> : <Navigate to={SIGNIN} />
}

export const CPrivateRoutes = () => {
    const token = useSelector(state => state.auth.accessToken)
    if(!token) {
        return <Navigate to={SIGNIN} />
    }
    return parseJwt(token).role === "candidate" ? <Outlet /> : <Navigate to={HOME} />
}

export const RPrivateRoutes = () => {
    const token = useSelector(state => state.auth.accessToken)
    if(!token) {
        return <Navigate to={SIGNIN} />
    }
    return parseJwt(token).role === "recruiter" ? <Outlet /> : <Navigate to={HOME} />
}

export const ProfileRoute = () => {
    const token = useSelector(state => state.auth.accessToken);
    if (!token) {
        return <Navigate to={SIGNIN} />;
    }

    const role = parseJwt(token).role;
    if (role === "candidate") {
        return <CandidateOwnProfile />;
    } else if (role === "recruiter") {
        return <RecruiterOwnProfile />;
    } else {
        return <Navigate to={HOME} />;
    }
}