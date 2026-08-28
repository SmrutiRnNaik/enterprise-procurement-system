import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import RaiseRequest from "./pages/RaiseRequest";

import RequestHistory from "./components/RequestHistory";

function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Register />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />

            <Route
                path="/request-history"
                element={<RequestHistory />}
            />

            <Route
                path="/raise-request"
                element={<RaiseRequest />}
            />

        </Routes>

    );

}

export default App;