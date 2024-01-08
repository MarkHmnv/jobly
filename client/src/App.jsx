import {Route, Routes} from "react-router-dom";
import Main from "./components/Pages/Main/Main.jsx";
import Error from "./components/Pages/Error/Error.jsx";
import {CANDIDATES, CREATE_VACANCY, HOME, PROFILE, SIGNIN, SIGNUP, VACANCIES} from "./util/routes.js";
import SignIn from "./components/Pages/Auth/SignIn.jsx";
import SignUp from "./components/Pages/Auth/SignUp.jsx";
import {PrivateRoutes, ProfileRoute, RPrivateRoutes} from "./privateRoutes.jsx";
import CandidateList from "./components/Pages/User/CandidateList.jsx";
import VacancyList from "./components/Pages/Vacancy/VacancyList.jsx";
import CreateVacancy from "./components/Pages/Vacancy/CreateVacancy.jsx";
import UpdateVacancy from "./components/Pages/Vacancy/UpdateVacancy.jsx";
import Vacancy from "./components/Pages/Vacancy/Vacancy.jsx";
import CandidateProfile from "./components/Pages/User/CandidateProfile.jsx";
import VacancyApplications from "./components/Pages/Vacancy/VacancyApplications.jsx";

function App() {

  return (
    <Routes>
        <Route path={HOME} element={<Main/>}/>
        <Route path={SIGNIN} element={<SignIn/>}/>
        <Route path={SIGNUP} element={<SignUp />}/>
        <Route path={PROFILE} element={<ProfileRoute />}/>
        <Route element={<PrivateRoutes />}>
            <Route path={CANDIDATES} element={<CandidateList/>}/>
            <Route path={`${CANDIDATES}/:id`} element={<CandidateProfile/>}/>
            <Route path={VACANCIES} element={<VacancyList/>}/>
            <Route path={`${VACANCIES}/:id`} element={<Vacancy/>}/>
        </Route>
        <Route element={<RPrivateRoutes />}>
            <Route path={CREATE_VACANCY} element={<CreateVacancy/>}/>
            <Route path={`${VACANCIES}/:id/edit`} element={<UpdateVacancy/>}/>
            <Route path={`${VACANCIES}/:id/applications`} element={<VacancyApplications/>}/>
        </Route>
        <Route path="*" element={<Error/>}/>
    </Routes>
  )
}

export default App
