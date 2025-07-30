import { Menu, X } from 'lucide-react';

const MenuButton = ({ onMobileMenu, isMobileMenuOpen }) => {
    return (
        <button
            onClick={onMobileMenu}
            className="p-2 rounded-md hover:bg-primary-800 transition-colors"
        >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
    )
}

export default MenuButton;