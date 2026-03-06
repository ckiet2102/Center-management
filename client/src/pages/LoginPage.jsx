import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { HiOutlineAcademicCap, HiOutlineEye, HiOutlineEyeOff, HiOutlineSun, HiOutlineMoon, HiOutlineMail, HiOutlineKey, HiOutlineUser } from 'react-icons/hi';

const LoginPage = () => {
    // view state: 'login' | 'register' | 'forgot' | 'reset'
    const [view, setView] = useState('login');

    // Login form
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Register form
    const [regFullname, setRegFullname] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPass, setRegPass] = useState('');
    const [regKey, setRegKey] = useState('');

    // Forgot / Reset form
    const [forgotEmail, setForgotEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [resetPass, setResetPass] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) { setError(err.response?.data?.message || 'Lỗi đăng nhập'); }
        finally { setLoading(false); }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);
        try {
            await api.post('/auth/register', {
                username: regEmail, full_name: regFullname,
                email: regEmail, password: regPass, activation_key: regKey
            });
            setSuccessMsg('Đăng ký thành công! Vui lòng đăng nhập.');
            setView('login');
        } catch (err) { setError(err.response?.data?.message || 'Lỗi đăng ký'); }
        finally { setLoading(false); }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { username: forgotEmail });
            // In demo, we get token directly
            setSuccessMsg(res.data.demo_link || 'Đã gửi yêu cầu khôi phục, vui lòng kiểm tra Email');
            if (res.data.demo_token) setResetToken(res.data.demo_token);
            setView('reset');
        } catch (err) { setError(err.response?.data?.message || 'Tài khoản không tồn tại'); }
        finally { setLoading(false); }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token: resetToken, newPassword: resetPass });
            setSuccessMsg('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            setView('login');
        } catch (err) { setError(err.response?.data?.message || 'Mã không hợp lệ hoặc đã hết hạn'); }
        finally { setLoading(false); }
    };

    const changeView = (v) => { setView(v); setError(''); setSuccessMsg(''); }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
            {/* Theme toggle */}
            <button onClick={toggleTheme} className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-gray-500 dark:text-slate-400 hover:text-amber-500 transition-all shadow-sm">
                {darkMode ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
            </button>

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-xl dark:shadow-2xl p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                            <HiOutlineAcademicCap className="text-white" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                            {view === 'login' && 'EngBreak'}
                            {view === 'register' && 'Đăng Ký Nhân Viên'}
                            {view === 'forgot' && 'Khôi Phục Mật Khẩu'}
                            {view === 'reset' && 'Tạo Mật Khẩu Mới'}
                        </h1>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                            {view === 'login' && 'Hệ thống Quản lý Trung tâm Ngoại ngữ'}
                            {view === 'register' && 'Vui lòng nhập mã kích hoạt Admin cung cấp'}
                            {view === 'forgot' && 'Nhập email để nhận mã Token (OTP)'}
                            {view === 'reset' && 'Đổi mật khẩu mới cho tài khoản của bạn'}
                        </p>
                    </div>

                    {/* Error / Success message */}
                    {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">{error}</div>}
                    {successMsg && <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm text-center break-all">{successMsg}</div>}

                    {/* Forms Switcher */}
                    {view === 'login' && (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email / Tên đăng nhập</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border rounded-xl dark:border-slate-700/50 dark:text-white transition-all" required autoFocus />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Mật khẩu</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border rounded-xl dark:border-slate-700/50 dark:text-white transition-all pr-12" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}</button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm px-1">
                                <button type="button" onClick={() => changeView('forgot')} className="text-indigo-600 dark:text-indigo-400 hover:underline">Quên mật khẩu?</button>
                                <button type="button" onClick={() => changeView('register')} className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">Đăng ký mới</button>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50">
                                {loading ? 'Đang...' : 'Đăng nhập'}
                            </button>
                        </form>
                    )}

                    {view === 'register' && (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div><label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Họ tên</label>
                                <input type="text" value={regFullname} onChange={(e) => setRegFullname(e.target.value)} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white" required />
                            </div>
                            <div><label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label>
                                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white" required />
                            </div>
                            <div><label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Mật khẩu</label>
                                <input type="password" value={regPass} onChange={(e) => setRegPass(e.target.value)} className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white" minLength={6} required />
                            </div>
                            <div><label className="block text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Mã Kích Hoạt (Do Admin cấp)</label>
                                <input type="text" value={regKey} onChange={(e) => setRegKey(e.target.value.toUpperCase())} className="w-full px-4 py-2 border border-amber-300 rounded-xl bg-amber-50 dark:bg-amber-500/10 dark:text-white uppercase" placeholder="EB-99-XXXXXX" required />
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50">
                                {loading ? 'Đang...' : 'Hoàn tất Đăng ký'}
                            </button>
                            <button type="button" onClick={() => changeView('login')} className="w-full py-2 mt-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white">Quay lại Đăng nhập</button>
                        </form>
                    )}

                    {view === 'forgot' && (
                        <form onSubmit={handleForgotSubmit} className="space-y-4">
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email khôi phục</label>
                                <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white" required placeholder="Nhập Email của bạn" />
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50">
                                {loading ? 'Đang...' : 'Gửi yêu cầu'}
                            </button>
                            <button type="button" onClick={() => changeView('login')} className="w-full py-2 mt-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white">Quay lại Đăng nhập</button>
                        </form>
                    )}

                    {view === 'reset' && (
                        <form onSubmit={handleResetSubmit} className="space-y-4">
                            <div><label className="block text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">Mã Token (OTP)</label>
                                <input type="text" value={resetToken} onChange={(e) => setResetToken(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white" required />
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Mật khẩu mới</label>
                                <input type="password" value={resetPass} onChange={(e) => setResetPass(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white" required minLength={6} />
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50">
                                {loading ? 'Đang...' : 'Thiết lập mật khẩu'}
                            </button>
                            <button type="button" onClick={() => changeView('login')} className="w-full py-2 mt-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white">Hủy</button>
                        </form>
                    )}
                </div>

                <p className="text-center text-gray-400 dark:text-slate-500 text-xs mt-6">
                    © 2025 EngBreak — Trung tâm Ngoại ngữ
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
