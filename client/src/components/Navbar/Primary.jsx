import MenuButton from './MenuButton';
import BrandLogo from './BrandLogo';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';
import CartButton from './CartButton';

const Primary = (props) => {
    return (
        <div className="bg-primary-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 md:h-16">

                    <div className='md:hidden'>
                        <MenuButton {...props} />
                    </div>

                    <div className='w-20 md:w-24'>
                        <BrandLogo />
                    </div>

                    <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
                        <SearchBox />
                    </div>

                    <div className="flex items-center space-x-4">
                        <UserMenu />
                        <CartButton />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Primary;