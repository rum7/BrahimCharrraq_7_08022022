import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import Register from "./components/Register";
import Login from "./components/Login";
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

function Logout() {
  return(
    <>
      <Header />
      <main className="has-background-white-ter	px-6 pt-5 pb-6">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function Connected() {
  return(
    <>
      <Nav />
      <main className="has-background-white-ter	px-6 pt-5 pb-6">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

const App = () => {
  return (
    <div className="container">
      <div className="columns">
        <div className="column is-three-fifths is-offset-one-fifth pb-0">
          <Router>
            <Routes>
              <Route path="/*" element={<Logout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<Navigate to="/Login" replace />} />
              </Route>
              <Route path="/*" element={<Connected />}>
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
