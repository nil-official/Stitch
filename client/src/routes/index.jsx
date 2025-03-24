import PublicRoutes from "./PublicRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import Error404 from "../pages/Error404";

const AppRoutes = ({ isSearchOpen, setIsSearchOpen, searchInputRef }) => {
    return (
        <>
            <PublicRoutes />
            <UserRoutes isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />
            <AdminRoutes />
            <Error404 />
        </>
    );
};

export default AppRoutes;