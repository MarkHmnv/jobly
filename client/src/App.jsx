import {Route, Routes} from "react-router-dom";
import Main from "./components/Pages/Main/Main.jsx";
import Error from "./components/Pages/Error/Error.jsx";
import {HOME, PROFILE, SIGNIN, SIGNUP} from "./util/routes.js";
import SignIn from "./components/Pages/Auth/SignIn.jsx";
import SignUp from "./components/Pages/Auth/SignUp.jsx";
import {PrivateRoutes} from "./privateRoutes.jsx";
import CandidateProfile from "./components/Pages/Profile/CandidateProfile.jsx";

function App() {

  return (
    <Routes>
        <Route path={HOME} element={<Main/>}/>
        <Route path={SIGNIN} element={<SignIn/>}/>
        <Route path={SIGNUP} element={<SignUp />}/>
        <Route element={<PrivateRoutes/>}>
            <Route path={PROFILE} element={<CandidateProfile/>}/>
        </Route>
        <Route path="*" element={<Error/>}/>
    </Routes>
  )
}

export default App
