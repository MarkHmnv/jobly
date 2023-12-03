import {Route, Routes} from "react-router-dom";
import Main from "./components/Pages/Main/Main.jsx";
import Error from "./components/Pages/Error/Error.jsx";
import {CANDIDATES, HOME, PROFILE, SIGNIN, SIGNUP} from "./util/routes.js";
import SignIn from "./components/Pages/Auth/SignIn.jsx";
import SignUp from "./components/Pages/Auth/SignUp.jsx";
import {PrivateRoutes, ProfileRoute} from "./privateRoutes.jsx";
import UserCardGrid from "./components/UserCard/UserCardGrid.jsx";

function App() {

  return (
    <Routes>
        <Route path={HOME} element={<Main/>}/>
        <Route path={SIGNIN} element={<SignIn/>}/>
        <Route path={SIGNUP} element={<SignUp />}/>
        <Route path={PROFILE} element={<ProfileRoute />}/>
        <Route element={<PrivateRoutes />}>
            <Route path={CANDIDATES} element={<UserCardGrid/>}/>
        </Route>
        <Route path="*" element={<Error/>}/>
    </Routes>
  )
}

export default App
