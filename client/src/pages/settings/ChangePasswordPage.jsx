import { useState } from 'react';
import api from '../../services/api';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const ChangePasswordPage = () => {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (form.newPassword !== form.confirmPassword) {
            setMessage({ text: 'Mật khẩu mới không khớp', type: 'error' });
            return;
        }
        if (form.newPassword.length < 6) {
            setMessage({ text: 'Mật khẩu mới phải có ít nhất 6 ký tự', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            await api.put('/auth/change-password', {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            });
            setMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Lỗi đổi mật khẩu', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const PasswordInput = ({ name, label, show, toggle }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all pr-12"
                />
                <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
                    {show ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-lg">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Đổi mật khẩu</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Cập nhật mật khẩu đăng nhập</p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none">
                {message.text && (
                    <div className={`mb-4 p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <PasswordInput name="currentPassword" label="Mật khẩu hiện tại" show={showPasswords.current} toggle={() => setShowPasswords(p => ({ ...p, current: !p.current }))} />
                    <PasswordInput name="newPassword" label="Mật khẩu mới" show={showPasswords.new} toggle={() => setShowPasswords(p => ({ ...p, new: !p.new }))} />
                    <PasswordInput name="confirmPassword" label="Xác nhận mật khẩu mới" show={showPasswords.confirm} toggle={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))} />

                    <button type="submit" disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50">
                        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
