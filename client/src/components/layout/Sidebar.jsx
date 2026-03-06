import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import {
    HiOutlineHome, HiOutlineUserGroup, HiOutlineAcademicCap,
    HiOutlineBookOpen, HiOutlineOfficeBuilding, HiOutlineCash,
    HiOutlineGift, HiOutlineClipboardList, HiOutlineX, HiOutlineMenu,
    HiOutlineCog, HiOutlineChevronDown, HiOutlineUser, HiOutlineLockClosed,
    HiOutlineServer, HiOutlineCollection
} from 'react-icons/hi';
import { useState, useEffect } from 'react';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome, roles: ['admin', 'staff'] },
    { path: '/students', label: 'Học viên', icon: HiOutlineUserGroup, roles: ['admin', 'staff'] },
    { path: '/teachers', label: 'Giảng viên', icon: HiOutlineAcademicCap, roles: ['admin', 'staff'] },
    { path: '/classes', label: 'Lớp học', icon: HiOutlineBookOpen, roles: ['admin', 'staff'] },
    { path: '/rooms', label: 'Phòng học', icon: HiOutlineOfficeBuilding, roles: ['admin', 'staff'] },
    { path: '/courses', label: 'Khóa học', icon: HiOutlineCollection, roles: ['admin', 'staff'] },
    { path: '/payments', label: 'Học phí', icon: HiOutlineCash, roles: ['admin'] },
    { path: '/promotions', label: 'Ưu đãi', icon: HiOutlineGift, roles: ['admin'] },
];

const settingsSubItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: HiOutlineUser, roles: ['admin', 'staff'] },
    { id: 'password', label: 'Đổi mật khẩu', icon: HiOutlineLockClosed, roles: ['admin', 'staff'] },
    { id: 'staff', label: 'Nhân sự & Kích hoạt', icon: HiOutlineUserGroup, roles: ['admin'] },
    { id: 'system', label: 'Quản trị hệ thống', icon: HiOutlineServer, roles: ['admin'] },
    { id: 'logs', label: 'Nhật ký hoạt động', icon: HiOutlineClipboardList, roles: ['admin'] },
];

const Sidebar = () => {
    const { user } = useAuth();
    const { settingsModal, openSettings } = useSettings(); // Added settingsModal and openSettings
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const filteredNav = navItems.filter(item => item.roles.includes(user?.role));
    const filteredSettings = settingsSubItems.filter(item => item.roles.includes(user?.role));

    // Auto open settings if active path is inside settingsSubItems
    const isSettingsActive = !!settingsModal; // Changed logic
    const [settingsOpen, setSettingsOpen] = useState(false); // Initialized to false

    // Expand accordion automatically if a modal is open from somewhere else
    useEffect(() => {
        if (isSettingsActive && !settingsOpen) {
            setSettingsOpen(true);
        }
    }, [isSettingsActive, settingsOpen]);

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/20">
                        E
                    </div>
                    {!collapsed && <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">EngBreak</span>}
                </div>
                <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                    {collapsed ? <HiOutlineMenu size={20} /> : <HiOutlineX size={20} />}
                </button>
                <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white">
                    <HiOutlineX size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {filteredNav.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive
                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50'}`
                        }
                    >
                        <item.icon size={20} className="shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Settings Accordion - pinned to bottom */}
            <div className="border-t border-gray-200 dark:border-slate-700/50 px-3 py-3">
                <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
            ${isSettingsActive
                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 font-bold shadow-sm'
                            : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800/50'}`}
                >
                    <div className="flex items-center gap-3">
                        <HiOutlineCog size={20} className="shrink-0" />
                        {!collapsed && <span>Cài đặt</span>}
                    </div>
                    {!collapsed && (
                        <HiOutlineChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${settingsOpen ? 'rotate-180' : ''}`}
                        />
                    )}
                </button>

                {/* Sub-menu */}
                {settingsOpen && !collapsed && (
                    <div className="mt-1 ml-3 pl-5 border-l-2 border-gray-200 dark:border-slate-700/50 space-y-1 animate-in">
                        {filteredSettings.map((item) => {
                            const isActive = settingsModal === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => { setMobileOpen(false); openSettings(item.id); }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200
                                        ${isActive
                                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10 font-medium'
                                            : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-slate-800/30'}`}
                                >
                                    <item.icon size={16} className="shrink-0" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Version */}
            {/* {!collapsed && (
                <div className="px-4 pb-3 text-xs text-gray-400 dark:text-slate-500">
                    EngBreak
                </div>
            )} */}
        </>
    );

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg text-gray-700 dark:text-white shadow-lg border border-gray-200 dark:border-slate-700"
            >
                <HiOutlineMenu size={20} />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-slate-700/50 
        flex flex-col z-40 transition-all duration-300 shadow-xl dark:shadow-2xl
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${collapsed ? 'w-20' : 'w-64'}
      `}>
                {sidebarContent}
            </aside>

            {/* Spacer for layout */}
            <div className={`hidden lg:block shrink-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`} />
        </>
    );
};

export default Sidebar;
