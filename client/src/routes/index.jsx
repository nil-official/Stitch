import PublicRoutes from "./PublicRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import ErrorPage from "../pages/ErrorPage";

const AppRoutes = () => {
    return (
        <>
            <PublicRoutes />
            <UserRoutes />
            <AdminRoutes />
            <ErrorPage />
        </>
    );
};

export default AppRoutes;