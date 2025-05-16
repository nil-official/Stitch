import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LucideListOrdered, Users } from 'lucide-react';

const orderData = {
    daily: [
        { name: "Mon", orders: 400 },
        { name: "Tue", orders: 600 },
        { name: "Wed", orders: 500 },
        { name: "Thu", orders: 700 },
        { name: "Fri", orders: 900 },
        { name: "Sat", orders: 300 },
        { name: "Sun", orders: 500 },
    ],
    weekly: [
        { name: "Week 1", orders: 3000 },
        { name: "Week 2", orders: 4000 },
        { name: "Week 3", orders: 3500 },
        { name: "Week 4", orders: 5000 },
    ],
    monthly: [
        { name: "Jan", orders: 9000 },
        { name: "Feb", orders: 14000 },
        { name: "Mar", orders: 11000 },
        { name: "Apr", orders: 15000 },
        { name: "May", orders: 8000 },
        { name: "Jun", orders: 5500 },
        { name: "Jul", orders: 9000 },
        { name: "Aug", orders: 7000 },
        { name: "Sep", orders: 15000 },
        { name: "Oct", orders: 13000 },
        { name: "Nov", orders: 10000 },
        { name: "Dec", orders: 8000 },
    ],
};

const recentOrders = [
    { id: 1, user: "Alice", amount: "$120.00", status: "Completed" },
    { id: 2, user: "Bob", amount: "$85.50", status: "Pending" },
    { id: 3, user: "Charlie", amount: "$230.00", status: "Completed" },
    { id: 4, user: "Dave", amount: "$50.00", status: "Failed" },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("daily");

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 p-2 rounded-md border border-slate-700 text-slate-100 text-xs">
                    <p className="font-medium">{`${label}`}</p>
                    <p className="text-cyan-400">{`Orders: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100">
            <div >
                <main className="transition-all duration-300 ease-in-out">
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="flex items-center mb-6">
                            <LucideListOrdered className="mr-2 h-6 w-6 text-cyan-500" />
                            <h1 className="text-2xl font-bold">Orders Overview</h1>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-semibold text-slate-300">Total Users</h3>
                                    <Users className="h-5 w-5" />
                                </div>

                                <p className="text-2xl font-bold text-cyan-400">1,234</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                                <h3 className="text-lg font-semibold text-slate-300">Total Revenue</h3>
                                <p className="text-2xl font-bold text-cyan-400">$45,678</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                                <h3 className="text-lg font-semibold text-slate-300">Orders</h3>
                                <p className="text-2xl font-bold text-cyan-400">8,456</p>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                            <div className="flex space-x-4 mb-4">
                                {["daily", "weekly", "monthly"].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`px-4 py-2 rounded-lg transition-colors ${activeTab === tab
                                            ? "bg-slate-900 text-cyan-400 border border-cyan-500/30"
                                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                                            }`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={orderData[activeTab]}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#94a3b8"
                                            tick={{ fill: '#94a3b8' }}
                                            axisLine={{ stroke: '#334155' }}
                                            tickLine={{ stroke: '#334155' }}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            tick={{ fill: '#94a3b8' }}
                                            axisLine={{ stroke: '#334155' }}
                                            tickLine={{ stroke: '#334155' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(15, 23, 42, 0.6)" }} />
                                        <Bar
                                            dataKey="orders"
                                            fill="#06b6d4"
                                            radius={[10, 10, 0, 0]}
                                            barSize={activeTab === "monthly" ? 40 : activeTab === "weekly" ? 60 : 50}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold mb-3 text-slate-300">Recent Orders</h3>
                            <div className="divide-y divide-slate-700/50">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex justify-between py-3">
                                        <span className="text-slate-300">{order.user}</span>
                                        <span className="text-slate-300">{order.amount}</span>
                                        <span
                                            className={
                                                order.status === "Completed"
                                                    ? "text-green-400"
                                                    : order.status === "Pending"
                                                        ? "text-amber-400"
                                                        : "text-red-400"
                                            }
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
