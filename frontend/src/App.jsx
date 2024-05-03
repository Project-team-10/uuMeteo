import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DeviceRegistration from "./pages/DeviceRegistration";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/devices" element={<DeviceRegistration />} />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
