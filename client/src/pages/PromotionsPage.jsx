import { useEffect, useState } from 'react';
import api from '../services/api';
import { HiOutlineRefresh } from 'react-icons/hi';

const PromotionsPage = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => { fetchPromotions(); }, []);

    const fetchPromotions = async () => {
        try { const res = await api.get('/promotions'); setPromotions(res.data); } catch { } finally { setLoading(false); }
    };

    const handleUpdateSeniority = async () => {
        setUpdating(true); setMessage('');
        try { const res = await api.post('/promotions/update-seniority'); setMessage(res.data.message); }
        catch (err) { setMessage(err.response?.data?.message || 'Lỗi khi cập nhật'); }
        finally { setUpdating(false); }
    };

    const conditionMap = { seniority_1y: 'Thâm niên 1 năm', seniority_2y: 'Thâm niên 2 năm', family: 'Gia đình', special: 'Đặc biệt' };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Ưu đãi</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">{promotions.length} chương trình ưu đãi</p>
                </div>
                <button onClick={handleUpdateSeniority} disabled={updating} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50">
                    <HiOutlineRefresh size={20} className={updating ? 'animate-spin' : ''} />
                    Cập nhật ưu đãi thâm niên
                </button>
            </div>

            {message && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm">{message}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <p className="text-gray-400 dark:text-slate-400 col-span-full text-center py-12">Đang tải...</p>
                ) : promotions.map((p) => (
                    <div key={p.id} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{p.name}</h3>
                            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{p.discount_percent}%</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Điều kiện: {conditionMap[p.condition_type] || p.condition_type}</p>
                        {p.description && <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">{p.description}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromotionsPage;
