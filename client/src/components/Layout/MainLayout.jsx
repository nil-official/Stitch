import { Outlet } from 'react-router-dom';
import NavbarV3 from '../Navbar/NavbarV3';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <div>
            <NavbarV3 />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;