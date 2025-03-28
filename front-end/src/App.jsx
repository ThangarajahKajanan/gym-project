import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatBot from "./components/ChatBot";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ScheduleForm from "./pages/ScheduleForm";
// import ScheduleDay from "./pages/ScheduleDay";
import ManageSchedules from "./pages/ManageSchedules";

import Landing from "./components/pages/Landing"
import MembershipManagement from "./components/pages/MembershipManagement"
import ProtectedRoute from './ProtectedRoute';
import MembershipForm from "./components/MembershipForm";
import TopBar from "./components/TopBar";


function App() {

   // const scriptsLoaded = useRef(false);
   // useTokenRefresh();
  
/*     useEffect(() => {
      if (scriptsLoaded.current) return;
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          document.body.appendChild(script);
          script.onload = resolve;
          script.onerror = reject;
        });
      };
  
      const loadScriptsInOrder = async () => {
        try {
          await loadScript(`/assets/js/head.js`);
          await loadScript(`/assets/js/app.min.js`);
          scriptsLoaded.current = true;
        } catch (error) {
          console.error("Error loading scripts", error);
        }
      };
  
      loadScriptsInOrder();
    }, []);
   */
    return (
        <Router>
            <Routes>
                <Route path='/' element={ <Landing /> }/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/login' element={<Login/>}/>
         
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path='/dashboard' element={<TopBar /> }/>
                    <Route path='/membershipManagement' element={ <MembershipManagement />}/>
                    <Route path='/membershipForm' element={ <MembershipForm />}/>
                    <Route path='/manageschedules' element={<ManageSchedules/>}/>
                    <Route path='/addschedule' element={<ScheduleForm/>}/>  
                    <Route path="/gymbot" element={<ChatBot />} />
                </Route>

                {/* Admin Only Route */}
                {/* <Route element={<ProtectedRoute adminOnly={true} />}>
                    <Route path="/admin" element={<AdminPanel />} />
                </Route> */}
            </Routes>
        </Router>
    );
}

export default App;
