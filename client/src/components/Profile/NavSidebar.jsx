import React, { useState } from 'react';
import { ChevronRight, ShoppingBag, User, CreditCard, Box, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const NavSidebar = ({ navData, activeItem, setActiveItem }) => {

    const navigate = useNavigate();

    const [expandedSections, setExpandedSections] = useState({
        'account-settings': true,
        'payments': false,
        'my-stuff': false
    });

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleItemClick = (item) => {
        if (item.id === 'my-orders') navigate('/user/orders');
        setActiveItem(item.id);
        if (item.hasSubItems) {
            toggleSection(item.id);
        }
    };

    const renderIcon = (iconName) => {
        switch (iconName) {
            case 'order':
                return <ShoppingBag size={20} />;
            case 'user':
                return <User size={20} />;
            case 'credit-card':
                return <CreditCard size={20} />;
            case 'box':
                return <Box size={20} />;
            case 'logout':
                return <LogOut size={20} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded shadow">
            {/* User Profile */}
            <div className="p-4 border-b">
                <div className="flex flex-col xl:flex-row gap-2 items-center justify-center xl:justify-normal">
                    <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
                        {navData.userProfile.firstName && navData.userProfile.firstName.charAt(0)}
                    </div>
                    <div className="xl:ml-3">
                        <div className="text-lg font-medium">{`${navData.userProfile.firstName} ${navData.userProfile.lastName}`}</div>
                        <div className='text-sm text-gray-500'>Member since: {format(new Date(navData.userProfile.createdAt), 'MMMM yyyy')}</div>
                    </div>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="py-2">
                {navData.mainNavigation.map((item) => (
                    <div key={item.id} className="text-gray-600">
                        <div
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 ${activeItem === item.id ? 'text-gray-900' : ''}`}
                            onClick={() => handleItemClick(item)}
                        >
                            <div className="flex items-center">
                                <span className="mr-3">{renderIcon(item.icon)}</span>
                                <span className="text-sm font-medium">{item.title}</span>
                            </div>
                            <ChevronRight size={16} className={`transition-transform ${expandedSections[item.id] ? 'rotate-90' : ''}`} />
                        </div>

                        {/* Sub Items */}
                        {item.hasSubItems && expandedSections[item.id] && (
                            <div className="px-4 ml-6 border-l">
                                {item.subItems.map((subItem) => (
                                    <div
                                        key={subItem.id}
                                        className={`flex items-center justify-between py-2.5 px-4 cursor-pointer text-sm hover:bg-gray-50 ${activeItem === subItem.id ? 'text-gray-900' : ''}`}
                                        onClick={() => setActiveItem(subItem.id)}
                                    >
                                        <span>{subItem.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Logout */}
            <div className="border-t">
                <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 text-gray-700">
                    <span className="mr-3">{renderIcon('logout')}</span>
                    <span className="text-sm font-medium">Logout</span>
                </div>
            </div>
        </div>
    );
};

export default NavSidebar;