import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = ({ isSearchOpen, setIsSearchOpen, searchInputRef }) => {
    return (
        <>
            <Navbar isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />
            <Outlet />
            <Footer />
        </>
    );
};

export default Layout;