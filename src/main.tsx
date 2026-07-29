import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import App from "./app/App.tsx"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AllProposalsPage from "./pages/AllProposalsPage"
import UserManagementPage from "./pages/UserManagementPage"
import "./styles/index.css"

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin/proposals"
          element={
            <ProtectedRoute>
              <AllProposalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
)
