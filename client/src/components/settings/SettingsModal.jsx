import { useState } from 'react';
import ProfileContent from '../../pages/settings/ProfilePage';
import ChangePasswordContent from '../../pages/settings/ChangePasswordPage';
import SystemAdminContent from '../../pages/settings/SystemAdminPage';
import StaffManagementContent from '../../pages/settings/StaffManagementContent';
import ActivityLogsContent from '../../pages/ActivityLogsPage';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineServer, HiOutlineClipboardList, HiOutlineUserGroup, HiX } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const SettingsModal = ({ initialTab, onClose }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(initialTab || 'profile');
    const isAdmin = user?.role === 'admin';

    const tabs = [
        { id: 'profile', label: 'Thông tin cá nhân', icon: HiOutlineUser, show: true },
        { id: 'password', label: 'Đổi mật khẩu', icon: HiOutlineLockClosed, show: true },
        { id: 'staff', label: 'Nhân sự & Kích hoạt', icon: HiOutlineUserGroup, show: isAdmin },
        { id: 'system', label: 'Quản trị hệ thống', icon: HiOutlineServer, show: isAdmin },
        { id: 'logs', label: 'Nhật ký hoạt động', icon: HiOutlineClipboardList, show: isAdmin }
    ].filter(t => t.show);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4 sm:p-6" onClick={onClose}>
            {/* Center Modal */}
            <div
                className="w-full max-w-5xl sm:min-w-[900px] h-[80vh] min-h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col sm:flex-row overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >

                {/* Settings Sidebar */}
                <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-slate-800 p-4 sm:p-6 flex flex-col gap-2 shrink-0 bg-gray-50/50 dark:bg-slate-900/50 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4 sm:mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Cài đặt chung
                        </h2>
                        {/* Mobile close button inside sidebar header */}
                        <button onClick={onClose} className="sm:hidden text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-lg">
                            <HiX size={20} />
                        </button>
                    </div>

                    <nav className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 hide-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-transparent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                            >
                                <tab.icon size={20} className="shrink-0" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Settings Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative bg-white dark:bg-slate-900">
                    {/* Desktop Close Button */}
                    <button
                        onClick={onClose}
                        className="hidden sm:flex absolute top-4 right-4 p-2.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-slate-800 dark:hover:text-red-400 rounded-xl transition-colors z-10"
                        title="Đóng"
                    >
                        <HiX size={20} />
                    </button>

                    <div className="flex-1 p-4 sm:p-8 overflow-y-auto w-full">
                        {activeTab === 'profile' && <ProfileContent isModal />}
                        {activeTab === 'password' && <ChangePasswordContent isModal />}
                        {activeTab === 'staff' && <StaffManagementContent />}
                        {activeTab === 'system' && <SystemAdminContent isModal />}
                        {activeTab === 'logs' && <ActivityLogsContent isModal />}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsModal;
