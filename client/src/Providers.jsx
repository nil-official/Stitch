import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import HealthCheckWrapper from './components/HealthCheckWrapper.jsx';
import RazorpayScriptLoader from './components/RazorpayScriptLoader.jsx';

const Providers = ({ children }) => {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <HealthCheckWrapper>
                    <RazorpayScriptLoader />
                    {children}
                    <Toaster position="bottom-right" reverseOrder={false} />
                </HealthCheckWrapper>
            </Provider>
        </BrowserRouter>
    );
};

export default Providers;