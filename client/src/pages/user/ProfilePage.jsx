import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_ROUTES } from '../../routes/routePaths';
import ErrorPage from '../../pages/ErrorPage';
import Loader from '../../components/Loader';
import navigation from '../../components/Profile/navigation.json';
import NavSidebar from '../../components/Profile/NavSidebar';
import AddressManagement from '../../components/Profile/AddressManagement';
import ProfileInformation from '../../components/Profile/ProfileInformation';
import { getProfile } from '../../redux/customer/profile/action';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [activeItem, setActiveItem] = useState('profile-information');
    const { profile, loading, error } = useSelector((state) => state.profile);

    useEffect(() => {
        if (!isAuthenticated)
            navigate(AUTH_ROUTES.LOGIN);
        else
            dispatch(getProfile());
    }, [isAuthenticated, dispatch]);

    const renderContent = () => {
        switch (activeItem) {
            case 'profile-information':
                return <ProfileInformation profile={profile} />;
            case 'manage-addresses':
                return <AddressManagement />;
            default:
                return <ProfileInformation profile={profile} />;
        }
    };

    const getNavData = () => {
        const navData = {
            userProfile: profile,
            mainNavigation: navigation,
        };
        return navData;
    };

    return (
        <div className="min-h-[60vh] flex justify-center">
            <div className="w-11/12 xl:w-5/6 2xl:w-3/4 py-8">
                {error ? (
                    <ErrorPage code={400} title='An Error Occurred!' description={error} />
                ) : (loading ? (
                    <Loader />
                ) : (profile && (
                    <div className="w-full">
                        <p className="text-2xl font-semibold mb-6">My Account</p>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/4">
                                <NavSidebar
                                    navData={getNavData()}
                                    activeItem={activeItem}
                                    setActiveItem={setActiveItem}
                                />
                            </div>
                            <div className="w-full md:w-3/4">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                )))}
            </div>
        </div>
    );
};

export default ProfilePage;