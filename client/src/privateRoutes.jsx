import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";
import {HOME, SIGNIN} from "./util/routes.js";
import {parseJwt} from "./util/jwt.js";
import CandidateProfile from "./components/Pages/Profile/CandidateProfile.jsx";
import RecruiterProfile from "./components/Pages/Profile/RecruiterProfile.jsx";

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
        return <CandidateProfile />;
    } else if (role === "recruiter") {
        return <RecruiterProfile />;
    } else {
        return <Navigate to={HOME} />;
    }
}