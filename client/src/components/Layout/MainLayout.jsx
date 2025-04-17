import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ isSearchOpen, setIsSearchOpen, searchInputRef }) => {
    return (
        <div>
            <Navbar isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;