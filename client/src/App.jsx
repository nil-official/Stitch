import { Routes, Route } from 'react-router-dom';
import AuthGuard from './utils/AuthGuard';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {

  return (
    <AuthGuard>
      <Routes>

        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />

      </Routes>
    </AuthGuard>
  );
}

export default App;