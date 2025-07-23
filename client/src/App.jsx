import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AuthGuard from './utils/AuthGuard';
import UserRoutes from './routes/UserRoutes';
import AdminRoutesV2 from './routes/AdminRoutesV2';
import { loadUser } from './redux/auth/action';
import ScrollToTop from './components/ScrollToTop';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return (
    <AuthGuard>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutesV2 />} />
      </Routes>
    </AuthGuard>
  );
};

export default App;