import { Navigate, useRoutes } from "react-router-dom";
import LibraryApp from "./layouts/dashboard";
import Page404 from "./pages/Page404";
import CourtPage from "./sections/@dashboard/court/CourtPage";
import DashboardAppPage from "./sections/@dashboard/app/DashboardAppPage";

import { useAuth } from "./hooks/useAuth";

export default function Router() {
  const { user } = useAuth();

  const commonRoutes = [
    { path: "courts", element: <CourtPage /> },
    {}
  ];

  const adminRoutes = useRoutes([
    {
      path: "/",
      element: <LibraryApp />,
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: "dashboard", element: <DashboardAppPage /> },
        ...commonRoutes,
        { path: "courts", element: <CourtPage /> },
        
      ],
    },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);


  const memberRoutes = useRoutes([
    {
      path: "/",
      element: <LibraryApp />,
      children: [
        { element: <Navigate to="/courts" />, index: true },
        ...commonRoutes,
        // { path: "courts", element: <CourtPage /> },
      ],
    },
    // { path: "courts", element: <CourtPage /> },
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
        { path: ":id", element: <CourtDetails /> },
        // ...commonRoutes
      ],
    },
    { path: "landing-page", element: <LandingPage /> },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/landing-page" replace /> },
  ]);


  return memberRoutes;
}
