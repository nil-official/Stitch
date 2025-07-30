import { useEffect, useRef, useState } from 'react';
import Primary from '../Navbar/Primary';
import Secondary from '../Navbar/Secondary';
import Mobile from '../Navbar/Mobile';

const Navbar = () => {

    const menuRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const onMobileItem = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="sticky top-0 z-50 bg-white shadow-md">
            <Primary {...{ onMobileMenu, isMobileMenuOpen }} />
            <Secondary />
            <Mobile {...{ menuRef, onMobileItem, isMobileMenuOpen }} />
        </div>
    );
};

export default Navbar;