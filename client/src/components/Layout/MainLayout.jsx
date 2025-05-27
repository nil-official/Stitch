import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import NavbarV2 from '../Navbar/NavbarV2';
import NavbarV3 from '../Navbar/NavbarV3';

const MainLayout = ({ isSearchOpen, setIsSearchOpen, searchInputRef }) => {
    return (
        <div>
            <NavbarV3 />
            {/* <NavbarV2 /> */}
            {/* <Navbar isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} /> */}
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;