import { Shield, Mail, Phone, Calendar, MapPin, ShoppingBag, Heart, User } from "lucide-react";

const UserCard = ({ user }) => {
    console.log(user);
    const getInitials = () => {
        return `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase();
    };

    const getRoleBadgeColor = (roleName) => {
        if (roleName.includes("ADMIN")) return "bg-red-500/20 text-red-300";
        if (roleName.includes("USER")) return "bg-green-500/20 text-green-300";
        return "bg-slate-500/20 text-slate-300";
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div className="w-full max-w-5xl bg-slate-800/50 border border-slate-700/50 rounded-lg shadow-xl overflow-hidden backdrop-blur-sm scale-105 mt-6 mx-auto">
            <div className="flex flex-col md:flex-row">
                {/* Left - User Info */}
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700/50">
                    <div className="flex items-center space-x-4">
                        <div className="relative h-20 w-20 rounded-full border-2 border-slate-700 overflow-hidden flex-shrink-0">
                            <img
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}%20${user.lastName}`}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    const parent = e.target.parentElement;
                                    if (parent) {
                                        parent.classList.add("bg-slate-700", "flex", "items-center", "justify-center", "text-slate-200");
                                        const fallback = document.createElement("span");
                                        fallback.textContent = getInitials();
                                        fallback.className = "text-2xl font-medium";
                                        parent.appendChild(fallback);
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-200">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-sm text-slate-400">ID: {user.id}</p>
                            <div className="mt-2">
                                {user.roles.map((role) => (
                                    <span
                                        key={role.id}
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(role.name)}`}
                                    >
                                        <Shield className="h-3 w-3 mr-2" />
                                        {role.name.replace("ROLE_", "")}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 text-sm text-slate-400">
                        <span>Member since</span>
                        <div className="font-medium text-slate-300">{formatDate(user.createdAt)}</div>
                    </div>
                </div>

                {/* Middle - Contact */}
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700/50">
                    <h3 className="text-base font-medium text-slate-300 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                        <div className="flex items-center text-base">
                            <Mail className="h-5 w-5 mr-3 text-slate-400" />
                            <span className="text-slate-400 w-20 text-sm">Email:</span>
                            <span className="text-slate-200 text-sm font-medium truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center text-base">
                            <Phone className="h-5 w-5 mr-3 text-slate-400" />
                            <span className="text-slate-400 w-20 text-sm">Mobile:</span>
                            <span className="text-slate-200 text-sm font-medium">{user.mobile}</span>
                        </div>
                        <div className="flex items-center text-base">
                            <Calendar className="h-5 w-5 mr-3 text-slate-400" />
                            <span className="text-slate-400 w-20 text-sm">DOB:</span>
                            <span className="text-slate-200 text-sm font-medium">
                                {user.dob ? formatDate(user.dob) : "Not provided"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right - Stats */}
                <div className="p-6 md:w-1/3">
                    <h3 className="text-base font-medium text-slate-300 mb-4">Activity Summary</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                            <MapPin className="h-6 w-6 mb-2 text-slate-400" />
                            <span className="text-2xl font-semibold text-slate-200">{user.totalAddresses}</span>
                            <span className="text-xs text-slate-400">Addresses</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                            <ShoppingBag className="h-6 w-6 mb-2 text-slate-400" />
                            <span className="text-2xl font-semibold text-slate-200">{user.totalOrders}</span>
                            <span className="text-xs text-slate-400">Orders</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
                            <Heart className="h-6 w-6 mb-2 text-slate-400" />
                            <span className="text-2xl font-semibold text-slate-200">{user.totalWishlists}</span>
                            <span className="text-xs text-slate-400">Wishlists</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700/50 flex justify-between items-center">
                <div className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-transparent text-slate-300 border border-slate-600">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                </span>
            </div>
        </div>
    );
};

export default UserCard;
