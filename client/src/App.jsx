import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import ClassesPage from './pages/ClassesPage';
import RoomsPage from './pages/RoomsPage';
import CoursesPage from './pages/CoursesPage';
import PaymentsPage from './pages/PaymentsPage';
import PromotionsPage from './pages/PromotionsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected - Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/teachers" element={<TeachersPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
