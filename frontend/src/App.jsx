import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route>
              <Route path="/" element={<Dashboard />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
