import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlineKey, HiOutlineRefresh, HiOutlineUserGroup } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const StaffManagementContent = () => {
    const [staffs, setStaffs] = useState([]);
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchStaffs = async () => {
        try {
            // Note: Since no endpoint for `/users` exists but they are staff, 
            // you might want to fetch Users filtering by 'staff'. We will hit /admin/staffs
            const res = await api.get('/admin/staffs');
            setStaffs(res.data);
        } catch { }
    };

    const fetchKeys = async () => {
        try {
            const res = await api.get('/auth/keys');
            setKeys(res.data);
        } catch { }
    };

    useEffect(() => {
        fetchStaffs();
        fetchKeys();
    }, []);

    const generateKey = async () => {
        try {
            setLoading(true);
            await api.post('/auth/keys');
            fetchKeys();
        } catch (e) { alert('Lỗi tạo Key'); }
        finally { setLoading(false); }
    };

    const resetStaffPassword = async (id, name) => {
        if (!confirm(`Bạn có chắc muốn Reset Password cho nhân viên ${name} về mặc định "123456"?`)) return;
        try {
            await api.post(`/auth/admin/reset-user-password/${id}`, { defaultPassword: '123456' });
            alert(`Đã reset mật khẩu cho ${name} thành 123456`);
        } catch { alert('Lỗi'); }
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nhân sự & Kích hoạt</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Quản lý mã đăng ký và tài khoản nhân viên</p>
            </div>

            {/* Keys */}
            <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500 rounded-xl"><HiOutlineKey className="text-white" /></div>
                        <h2 className="text-lg font-bold dark:text-amber-400">Quản lý Activation Keys</h2>
                    </div>
                    <button onClick={generateKey} disabled={loading} className="px-4 py-2 bg-amber-500 text-white rounded-xl shadow-lg hover:bg-amber-600 transition-colors">
                        + Tạo Mã Mới
                    </button>
                </div>
                {keys.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {keys.map((k) => (
                            <div key={k.id} className={`p-3 border rounded-xl flex flex-col gap-1 ${k.is_used ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-white border-amber-300 dark:bg-slate-800'}`}>
                                <span className={`font-mono font-bold ${k.is_used ? 'line-through text-gray-500' : 'text-amber-600 dark:text-amber-400'}`}>{k.key_code}</span>
                                <span className="text-xs text-gray-500">{k.is_used ? `Đã dùng bởi: ${k.used_by}` : 'Chưa sử dụng'}</span>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-sm text-gray-500">Chưa có mã kích hoạt nào.</p>}
            </div>

            {/* Staffs */}
            <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500 rounded-xl"><HiOutlineUserGroup className="text-white" /></div>
                    <h2 className="text-lg font-bold dark:text-white">Danh sách Nhân viên / Quản trị</h2>
                </div>

                <div className="space-y-3">
                    {staffs.map((s) => (
                        <div key={s.id} className="flex justify-between items-center p-4 border rounded-xl dark:border-slate-700 dark:bg-slate-800">
                            <div>
                                <p className="font-bold dark:text-white">{s.full_name} <span className="text-xs text-indigo-500 font-normal ml-2 uppercase bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">{s.role}</span></p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Username: {s.username}</p>
                            </div>
                            {s.id !== user?.id && s.role !== 'admin' && ( // Prevent admin resetting themselves or other admins
                                <button onClick={() => resetStaffPassword(s.id, s.full_name)} className="flex items-center gap-2 px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors">
                                    <HiOutlineRefresh /> Reset Password
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StaffManagementContent;
