import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { HiOutlineLogout, HiOutlineUser, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

const Topbar = () => {
    const { user, logout } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const { openSettings } = useSettings();

    return (
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700/50 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-200 hidden md:block">
                    Quản lý Trung tâm Ngoại ngữ
                </h2>
            </div>

            <div className="flex items-center gap-3">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl text-gray-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-300"
                    title={darkMode ? 'Chế độ Sáng' : 'Chế độ Tối'}
                >
                    {darkMode ? (
                        <HiOutlineSun size={22} className="transition-transform duration-300 hover:rotate-45" />
                    ) : (
                        <HiOutlineMoon size={22} className="transition-transform duration-300 hover:-rotate-12" />
                    )}
                </button>

                {/* User info */}
                <button onClick={() => openSettings('profile')} className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-800/50 p-1.5 rounded-2xl transition-all text-left">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shrink-0">
                        <HiOutlineUser className="text-white" size={18} />
                    </div>
                    <div className="hidden sm:block leading-tight">
                        <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                            {user?.role === 'admin' ? 'Admin' : 'Staff'} {user?.full_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{user?.role}</p>
                    </div>
                </button>

                {/* Logout button */}
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
                    title="Đăng xuất"
                >
                    <HiOutlineLogout size={20} />
                    <span className="hidden sm:inline text-sm">Đăng xuất</span>
                </button>
            </div>
        </header>
    );
};

export default Topbar;
