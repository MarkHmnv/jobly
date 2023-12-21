import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";
import {HOME, SIGNIN} from "./util/routes.js";
import {isCandidate, isRecruiter, parseJwt} from "./util/jwt.js";
import UpdateCandidateProfile from "./components/Pages/User/UpdateCandidateProfile.jsx";
import UpdateRecruiterProfile from "./components/Pages/User/UpdateRecruiterProfile.jsx";

export const PrivateRoutes = () => {
    const token = useSelector(state => state.auth.accessToken)
    return token ? <Outlet /> : <Navigate to={SIGNIN} />
}

export const CPrivateRoutes = () => {
    const token = useSelector(state => state.auth.accessToken)
    if(!token) {
        return <Navigate to={SIGNIN} />
    }
    return isCandidate(token) ? <Outlet /> : <Navigate to={HOME} />
}

export const RPrivateRoutes = () => {
    const token = useSelector(state => state.auth.accessToken)
    if(!token) {
        return <Navigate to={SIGNIN} />
    }
    return isRecruiter(token) ? <Outlet /> : <Navigate to={HOME} />
}

export const ProfileRoute = () => {
    const token = useSelector(state => state.auth.accessToken);
    if (!token) {
        return <Navigate to={SIGNIN} />;
    }

    const role = parseJwt(token).role;
    if (role === "candidate") {
        return <UpdateCandidateProfile />;
    } else if (role === "recruiter") {
        return <UpdateRecruiterProfile />;
    } else {
        return <Navigate to={HOME} />;
    }
}