import { Outlet } from "react-router-dom"
import AdminNav from "../Admin/v2/AdminNav"

export default function AdminLayout() {

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100">
      {/* AdminNav contains the top navbar and sidebar */}
      <AdminNav />

      {/* Main Content */}
      <main className="pt-16 md:ml-64 transition-all duration-300 ease-in-out">
        {/* Outlet renders the child route components */}
        <Outlet />
      </main>
    </div>
  )
}

