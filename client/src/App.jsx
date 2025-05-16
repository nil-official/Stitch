import { Routes, Route } from 'react-router-dom';
import AuthGuard from './utils/AuthGuard';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import AdminRoutesV2 from './routes/AdminRoutesV2';

function App() {

  return (
    <AuthGuard>
      <Routes>

        <Route path="/*" element={<UserRoutes />} />
        {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
        <Route path="/admin/*" element={<AdminRoutesV2 />} />

      </Routes>
    </AuthGuard>
  );
}

export default App;