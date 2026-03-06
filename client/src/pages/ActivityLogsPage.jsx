import { useEffect, useState } from 'react';
import api from '../services/api';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const actionColors = {
    LOGIN: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    LOGIN_FAIL: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    HOC_VIEN_THEM: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    HOC_VIEN_SUA: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    HOC_VIEN_XOA: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    HOC_PHI_: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
    GIANG_VIEN: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400',
    LOP_HOC: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400',
};

const ActivityLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async (p = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/activity-logs?page=${p}&limit=20`);
            setLogs(res.data.logs); setTotalPages(res.data.totalPages); setPage(res.data.page);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchLogs(); }, []);

    const getColor = (actionType) => {
        const key = Object.keys(actionColors).find(k => actionType?.startsWith(k));
        return actionColors[key] || 'bg-gray-100 text-gray-700 dark:bg-slate-500/15 dark:text-slate-400';
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nhật ký Hoạt động</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Trang {page}/{totalPages}</p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full data-table">
                        <thead><tr><th>Loại</th><th>Mô tả</th><th>Thời gian</th></tr></thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" className="text-center py-12 text-gray-400 dark:text-slate-400">Đang tải...</td></tr>
                            ) : logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td><span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getColor(log.action_type)}`}>{log.action_type}</span></td>
                                    <td className="text-gray-900 dark:text-white max-w-md truncate">{log.description}</td>
                                    <td className="text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">{new Date(log.created_at).toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-slate-700/50">
                    <button onClick={() => fetchLogs(page - 1)} disabled={page <= 1} className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                        <HiOutlineChevronLeft size={16} /> Trang trước
                    </button>
                    <span className="text-sm text-gray-500 dark:text-slate-400">Trang {page} / {totalPages}</span>
                    <button onClick={() => fetchLogs(page + 1)} disabled={page >= totalPages} className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                        Trang sau <HiOutlineChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogsPage;
