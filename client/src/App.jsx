import { useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthGuard from './utils/AuthGuard';
import Layout from './components/Layout';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  return (
    <AuthGuard>
      <Routes>

        <Route element={<Layout isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />}>
          <Route path="/*" element={<UserRoutes isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchInputRef={searchInputRef} />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>

      </Routes>
    </AuthGuard>
  );
}

export default App;