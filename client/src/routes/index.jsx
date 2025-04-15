import PublicRoutes from "./PublicRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import ErrorPage from "../pages/ErrorPage";

const AppRoutes = ({ isSearchOpen, setIsSearchOpen, searchInputRef }) => {
    return (
        <>
            <PublicRoutes />
            <UserRoutes isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />
            <AdminRoutes />
            <ErrorPage />
        </>
    );
};

export default AppRoutes;