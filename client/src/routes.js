import { Navigate, useRoutes } from "react-router-dom";
import LibraryApp from "./layouts/dashboard";
import Page404 from "./pages/Page404";
import CourtPage from "./sections/@dashboard/court/CourtPage";
import DashboardAppPage from "./sections/@dashboard/app/DashboardAppPage";
import CourtDetails from "./sections/@dashboard/court/CourtDetails";
import CourtSchedule from "./sections/@dashboard/schedule/CourtSchedule";

import { useAuth } from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage";

export default function Router() {
  const { user } = useAuth();

  const commonRoutes = [
    // { path: "", element: <CourtPage /> },
    { path: ":id", element: <CourtDetails /> },
    { path: "schedule/:id", element: <CourtSchedule /> },
  ];

  const adminRoutes = useRoutes([
    {
      path: "/",
      element: <LibraryApp />,
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: "dashboard", element: <DashboardAppPage /> },
        ...commonRoutes,
        
      ],
    },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);


  const memberRoutes = useRoutes([
    {
      path: "courts",
      element: <LibraryApp />,
      children: [
        { element: <CourtPage />, index: true },
        ...commonRoutes,
        // { path: "courts", element: <CourtPage /> },
      ],
    },
    { path: "landing-page", element: <LandingPage /> },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/courts" replace /> },
  ]);


  const guestRoutes = useRoutes([
    {
      path: "/",
      element: <Navigate to="/landing-page" replace />, 
    },
    {
      path: "courts",
      element: <LibraryApp />, 
      children: [
        { index: true, element: <CourtPage /> }, 
        // { path: ":id", element: <CourtDetails /> },
        ...commonRoutes
      ],
    },
    { path: "landing-page", element: <LandingPage /> },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/courts" replace /> },
  ]);


  return guestRoutes
  ;
}


