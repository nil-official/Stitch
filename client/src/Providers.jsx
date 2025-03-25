import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShopContextProvider from './context/ShopContext.jsx';
import { store } from './redux/store';
import HealthCheckWrapper from './components/HealthCheckWrapper.jsx';

const Providers = ({ children }) => {
    return (
        <BrowserRouter>
            <ShopContextProvider>
                <Provider store={store}>
                    <HealthCheckWrapper>
                        {children}
                    </HealthCheckWrapper>
                </Provider>
            </ShopContextProvider>

            {/* Toast Notifications */}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </BrowserRouter>
    );
};

export default Providers;