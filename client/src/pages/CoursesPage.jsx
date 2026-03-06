import { useEffect, useState } from 'react';
import api from '../services/api';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const CoursesPage = () => {
    const [levels, setLevels] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [levelModalOpen, setLevelModalOpen] = useState(false);
    const [editLevel, setEditLevel] = useState(null);
    const [pkgModalOpen, setPkgModalOpen] = useState(false);
    const [editPkg, setEditPkg] = useState(null);
    const [selectedLevelId, setSelectedLevelId] = useState(null);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const fetchData = async () => {
        try {
            setLoading(true);
            const [lRes, pRes] = await Promise.all([
                api.get('/levels'),
                api.get('/tuition-packages')
            ]);
            setLevels(lRes.data);
            setPackages(pRes.data);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const fmt = (val) => val ? Number(val).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
    const getPkgsForLevel = (levelId) => packages.filter(p => p.level_id === levelId);

    const handleDeleteLevel = async (id, name) => {
        if (!confirm(`Xóa cấp độ "${name}"?`)) return;
        try { await api.delete(`/levels/${id}`); fetchData(); }
        catch (err) { alert(err.response?.data?.message || 'Lỗi'); }
    };

    const handleDeletePkg = async (id) => {
        if (!confirm('Xóa gói học phí này?')) return;
        try { await api.delete(`/tuition-packages/${id}`); fetchData(); }
        catch (err) { alert(err.response?.data?.message || 'Lỗi'); }
    };

    const LEVEL_COLORS = [
        'from-blue-500 to-indigo-600',
        'from-emerald-500 to-teal-600',
        'from-violet-500 to-purple-600',
        'from-amber-500 to-orange-600',
        'from-rose-500 to-pink-600',
        'from-cyan-500 to-blue-600',
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Khóa học & Giá niêm yết</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">{levels.length} cấp độ — {packages.length} gói học phí</p>
                </div>
                {isAdmin && (
                    <button onClick={() => { setEditLevel(null); setLevelModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
                        <HiOutlinePlus size={18} /> Thêm Cấp Độ
                    </button>
                )}
            </div>

            {/* Level Columns */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">Đang tải...</div>
            ) : levels.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-400 dark:text-slate-500 mb-4">Chưa có cấp độ nào</p>
                    {isAdmin && (
                        <button onClick={() => { setEditLevel(null); setLevelModalOpen(true); }}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors">
                            + Tạo cấp độ đầu tiên
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {levels.map((level, idx) => {
                        const levelPkgs = getPkgsForLevel(level.id);
                        return (
                            <div key={level.id} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Level Header */}
                                <div className={`bg-gradient-to-r ${LEVEL_COLORS[idx % LEVEL_COLORS.length]} p-4`}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-white">{level.level_name}</h2>
                                            <p className="text-white/70 text-sm mt-0.5">{level.course_duration || ''}</p>
                                        </div>
                                        {isAdmin && (
                                            <div className="flex gap-1">
                                                <button onClick={() => { setEditLevel(level); setLevelModalOpen(true); }}
                                                    className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors" title="Sửa">
                                                    <HiOutlinePencil size={14} />
                                                </button>
                                                <button onClick={() => handleDeleteLevel(level.id, level.level_name)}
                                                    className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors" title="Xóa">
                                                    <HiOutlineTrash size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {level.description && (
                                        <p className="text-white/60 text-xs mt-2">{level.description}</p>
                                    )}
                                </div>

                                {/* Packages List */}
                                <div className="p-4 space-y-3">
                                    {levelPkgs.length === 0 ? (
                                        <p className="text-sm text-gray-400 dark:text-slate-500 italic text-center py-4">Chưa có gói học phí</p>
                                    ) : (
                                        levelPkgs.map(pkg => {
                                            const totalSessions = pkg.week_duration * (pkg.sessions_per_week || 3);
                                            const pricePerSession = totalSessions > 0
                                                ? Math.round(Number(pkg.tuition_fee) / totalSessions) : 0;
                                            return (
                                                <div key={pkg.id} className="bg-gray-50 dark:bg-slate-800/30 rounded-xl p-3.5 group hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                                Gói {pkg.week_duration} tuần
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                                                {pkg.sessions_per_week || 3} buổi/tuần • {totalSessions} buổi
                                                            </p>
                                                        </div>
                                                        {isAdmin && (
                                                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => { setEditPkg(pkg); setSelectedLevelId(level.id); setPkgModalOpen(true); }}
                                                                    className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors">
                                                                    <HiOutlinePencil size={14} />
                                                                </button>
                                                                <button onClick={() => handleDeletePkg(pkg.id)}
                                                                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                                                                    <HiOutlineTrash size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 flex items-baseline justify-between">
                                                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                                            {fmt(pkg.tuition_fee)}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-slate-400">
                                                            ~{fmt(pricePerSession)}/buổi
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                    {/* Add Package Button */}
                                    {isAdmin && (
                                        <button onClick={() => { setEditPkg(null); setSelectedLevelId(level.id); setPkgModalOpen(true); }}
                                            className="w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-slate-700/50 rounded-xl text-sm text-gray-400 dark:text-slate-500 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-1.5">
                                            <HiOutlinePlus size={16} /> Thêm gói
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Level Add/Edit Modal */}
            {levelModalOpen && (
                <LevelFormModal
                    level={editLevel}
                    onClose={() => { setLevelModalOpen(false); setEditLevel(null); }}
                    onSaved={() => { setLevelModalOpen(false); setEditLevel(null); fetchData(); }}
                />
            )}

            {/* Package Add/Edit Modal */}
            {pkgModalOpen && (
                <PackageFormModal
                    pkg={editPkg}
                    levelId={selectedLevelId}
                    levels={levels}
                    onClose={() => { setPkgModalOpen(false); setEditPkg(null); }}
                    onSaved={() => { setPkgModalOpen(false); setEditPkg(null); fetchData(); }}
                />
            )}
        </div>
    );
};

// ──── Level Form Modal ────
const LevelFormModal = ({ level, onClose, onSaved }) => {
    const [form, setForm] = useState({
        level_name: level?.level_name || '',
        course_duration: level?.course_duration || '5-6 tháng',
        description: level?.description || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputCls = "w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all";

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            if (level) await api.put(`/levels/${level.id}`, form);
            else await api.post('/levels', form);
            onSaved();
        } catch (err) { setError(err.response?.data?.message || 'Lỗi'); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{level ? 'Sửa cấp độ' : 'Thêm Cấp Độ Mới'}</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg"><HiOutlineX size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Tên cấp độ *</label>
                        <input value={form.level_name} onChange={e => setForm(f => ({ ...f, level_name: e.target.value }))} required className={inputCls} placeholder="VD: Early, Starter, Mover, Flyer" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Thời lượng</label>
                        <input value={form.course_duration} onChange={e => setForm(f => ({ ...f, course_duration: e.target.value }))} className={inputCls} placeholder="VD: 5-6 tháng" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Mô tả</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className={inputCls} placeholder="Mô tả ngắn về cấp độ..." />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Hủy</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50">
                            {loading ? 'Đang lưu...' : (level ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ──── Package Form Modal ────
const PackageFormModal = ({ pkg, levelId, levels, onClose, onSaved }) => {
    const [form, setForm] = useState({
        level_id: pkg?.level_id || levelId || '',
        week_duration: pkg?.week_duration || '',
        tuition_fee: pkg?.tuition_fee || '',
        sessions_per_week: pkg?.sessions_per_week || 3,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            if (pkg) await api.put(`/tuition-packages/${pkg.id}`, form);
            else await api.post('/tuition-packages', form);
            onSaved();
        } catch (err) { setError(err.response?.data?.message || 'Lỗi'); }
        finally { setLoading(false); }
    };

    const totalSessions = (form.week_duration || 0) * (form.sessions_per_week || 3);
    const pricePerSession = totalSessions > 0 && form.tuition_fee ? Math.round(form.tuition_fee / totalSessions) : 0;
    const inputCls = "w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{pkg ? 'Sửa gói học phí' : 'Thêm gói học phí'}</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg"><HiOutlineX size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Cấp độ *</label>
                        <select value={form.level_id} onChange={e => setForm(f => ({ ...f, level_id: e.target.value }))} required className={inputCls}>
                            <option value="">— Chọn cấp độ —</option>
                            {levels.map(l => <option key={l.id} value={l.id}>{l.level_name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Số tuần *</label>
                            <input type="number" value={form.week_duration} onChange={e => setForm(f => ({ ...f, week_duration: e.target.value }))} required min="1" className={inputCls} placeholder="8" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Buổi/tuần</label>
                            <input type="number" value={form.sessions_per_week} onChange={e => setForm(f => ({ ...f, sessions_per_week: e.target.value }))} min="1" max="7" className={inputCls} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Giá niêm yết (VNĐ) *</label>
                        <input type="number" value={form.tuition_fee} onChange={e => setForm(f => ({ ...f, tuition_fee: e.target.value }))} required min="0" className={inputCls} placeholder="6000000" />
                    </div>

                    {/* Auto-calc preview */}
                    {form.week_duration && form.tuition_fee && (
                        <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl p-3 text-sm">
                            <p className="text-indigo-700 dark:text-indigo-400">
                                📊 Tổng: <strong>{totalSessions} buổi</strong> ({form.week_duration} tuần × {form.sessions_per_week || 3} buổi/tuần)
                            </p>
                            <p className="text-indigo-700 dark:text-indigo-400 mt-1">
                                💰 Giá TB/buổi: <strong>{Number(pricePerSession).toLocaleString('vi-VN')} ₫</strong>
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Hủy</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50">
                            {loading ? 'Đang lưu...' : (pkg ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CoursesPage;
