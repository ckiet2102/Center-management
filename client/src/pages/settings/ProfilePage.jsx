import { useAuth } from '../../context/AuthContext';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck } from 'react-icons/hi';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thông tin cá nhân</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Xem thông tin tài khoản của bạn</p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none">
                {/* Avatar */}
                <div className="flex items-center gap-5 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <HiOutlineUser className="text-white" size={36} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.full_name}</h2>
                        <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
                            <HiOutlineShieldCheck size={14} />
                            {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                        </span>
                    </div>
                </div>

                {/* Info grid */}
                <div className="space-y-5">
                    <InfoRow label="Tên đăng nhập" value={user?.username} />
                    <InfoRow label="Họ và tên" value={user?.full_name} />
                    <InfoRow label="Vai trò" value={user?.role === 'admin' ? 'Quản trị viên (Admin)' : 'Nhân viên (Staff)'} />
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 pb-4 border-b border-gray-100 dark:border-slate-700/50 last:border-0 last:pb-0">
        <span className="text-sm text-gray-500 dark:text-slate-400 sm:w-40 shrink-0">{label}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
);

export default ProfilePage;
