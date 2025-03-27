import { Navigate, Route, Routes } from "react-router-dom";
// import FloatingShape from "./components/FloatingShape";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CourtDetails from "./sections/@dashboard/court/CourtDetails";
import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import DashboardAppPage from "./sections/@dashboard/app/DashboardAppPage";
import CourtPage from "./sections/@dashboard/court/CourtPage";
import CourtSchedule from "./sections/@dashboard/schedule/CourtSchedule";
import LibraryApp from "./layouts/dashboard";
import LandingPage from "./pages/LandingPage";
import UserProfile from "./pages/UserProfile";
import UserManagement from "./pages/UserManagement";
import BookingHistory from "./sections/booking/BookingHistory";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // if (user && !user.isVerified) {
  //   // Check if user exists first
  //   return <Navigate to="/verify-email" replace />;
  // }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && !user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      {!isAuthenticated ? ( // Kiểm tra trạng thái đăng nhập
        <div className="bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center min-h-screen">
          <Routes>
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/"
              element={
                  <LandingPage />
              }
            >
            </Route>
          
            <Route
              path="/courts"
              element={
                  <LibraryApp />
              }
            >
            <Route index element={<CourtPage />} />
          </Route>

           

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          >
            {/* <Route index element={<CourtPage />} />
            <Route path=":id" element={<CourtDetails />} /> */}
          </Route>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          {/* Cập nhật route UserManagement để sử dụng LibraryApp layout */}
          <Route
            path="/usermanagement"
            element={
              <ProtectedRoute>
                <LibraryApp />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserManagement />} />
          </Route>
          
          {/* <Route path="/dashboard2" element={<LibraryApp />} /> */}
          <Route
            path="/courts"
            element={
              <ProtectedRoute>
                <LibraryApp />
              </ProtectedRoute>
            }
          >
            <Route index element={<CourtPage />} />
          </Route>

          <Route path="/verify-email" element={<EmailVerificationPage />} />

          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          {/* <Route
            path="/booking-history"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          /> */}
             <Route
              path="/booking-history"
              element={
                <ProtectedRoute>
                  <LibraryApp />
                </ProtectedRoute>
              }
              >
            <Route
              index
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/courts/:id"
            element={
              <ProtectedRoute>
                <LibraryApp />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedRoute>
                  <CourtDetails />
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route
            path="/userprofile/:id"
            element={
              <RedirectAuthenticatedUser>
                <UserProfile />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/courts/schedule/:id"
            element={
              <ProtectedRoute>
                <LibraryApp />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedRoute>
                  <CourtSchedule />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* catch all routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
      <Toaster />
    </div>
  );
}

export default App;