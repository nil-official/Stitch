import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import HealthCheckWrapper from './components/HealthCheckWrapper.jsx';

const Providers = ({ children }) => {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <HealthCheckWrapper>
                    {children}
                </HealthCheckWrapper>
            </Provider>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
        </BrowserRouter>
    );
};

export default Providers;