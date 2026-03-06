import { useEffect, useState } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
    HiOutlineX, HiOutlineOfficeBuilding, HiOutlineBookOpen
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editRoom, setEditRoom] = useState(null);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const params = search ? { search } : {};
            const res = await api.get('/rooms', { params });
            setRooms(res.data);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchRooms(); }, []);
    useEffect(() => {
        const t = setTimeout(fetchRooms, 400);
        return () => clearTimeout(t);
    }, [search]);

    const handleDelete = async (id, name) => {
        if (!confirm(`Bạn có chắc muốn xóa phòng "${name}"?`)) return;
        try {
            await api.delete(`/rooms/${id}`);
            fetchRooms();
        } catch (err) { alert(err.response?.data?.message || 'Lỗi khi xóa'); }
    };

    const getStatusBadge = (status) => {
        const map = {
            san_sang: { label: 'Sẵn sàng', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' },
            dang_su_dung: { label: 'Đang sử dụng', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400' },
            bao_tri: { label: 'Bảo trì', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' }
        };
        const info = map[status] || { label: status || '—', cls: 'bg-gray-100 text-gray-700' };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${info.cls}`}>{info.label}</span>;
    };

    const ROOM_COLORS = ['from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-violet-500 to-purple-600', 'from-amber-500 to-orange-600', 'from-rose-500 to-pink-600', 'from-cyan-500 to-blue-600'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Phòng học</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">{rooms.length} phòng</p>
                </div>
                {isAdmin && (
                    <button onClick={() => { setEditRoom(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
                        <HiOutlinePlus size={18} /> Thêm phòng
                    </button>
                )}
            </div>

            <div className="relative max-w-md">
                <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm phòng học..."
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
            </div>

            {loading ? (
                <div className="text-center py-16 text-gray-400">Đang tải...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {rooms.map((r, idx) => (
                        <div key={r.id} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${ROOM_COLORS[idx % ROOM_COLORS.length]} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                        <HiOutlineOfficeBuilding size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{r.room_name}</h3>
                                    </div>
                                </div>
                                {getStatusBadge(r.status)}
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2.5 text-sm">
                                    <HiOutlineBookOpen size={16} className="text-emerald-500 shrink-0" />
                                    <span className="text-gray-700 dark:text-slate-300">
                                        Đang sử dụng: <strong className="text-emerald-600 dark:text-emerald-400">{r.active_class_count || 0}</strong> lớp
                                    </span>
                                </div>
                                {r.note && (
                                    <p className="text-xs text-gray-500 dark:text-slate-400 italic">{r.note}</p>
                                )}
                            </div>

                            {isAdmin && (
                                <div className="flex items-center justify-end gap-1 pt-3 border-t border-gray-100 dark:border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditRoom(r); setModalOpen(true); }} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors" title="Sửa">
                                        <HiOutlinePencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(r.id, r.room_name)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-600 rounded-lg transition-colors" title="Xóa">
                                        <HiOutlineTrash size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <RoomFormModal
                    room={editRoom}
                    onClose={() => { setModalOpen(false); setEditRoom(null); }}
                    onSaved={() => { setModalOpen(false); setEditRoom(null); fetchRooms(); }}
                />
            )}
        </div>
    );
};

const RoomFormModal = ({ room, onClose, onSaved }) => {
    const [form, setForm] = useState({
        room_name: room?.room_name || '',
        status: room?.status || 'san_sang',
        note: room?.note || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            if (room) { await api.put(`/rooms/${room.id}`, form); }
            else { await api.post('/rooms', form); }
            onSaved();
        } catch (err) { setError(err.response?.data?.message || 'Lỗi'); }
        finally { setLoading(false); }
    };

    const inputCls = "w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{room ? 'Sửa phòng học' : 'Thêm phòng mới'}</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg"><HiOutlineX size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Tên phòng *</label>
                        <input value={form.room_name} onChange={e => setForm(f => ({ ...f, room_name: e.target.value }))} required className={inputCls} placeholder="VD: P.101" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Trạng thái</label>
                        <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
                            <option value="san_sang">Sẵn sàng</option>
                            <option value="dang_su_dung">Đang sử dụng</option>
                            <option value="bao_tri">Bảo trì</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Ghi chú</label>
                        <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} rows={2} className={inputCls} placeholder="Trang thiết bị, sức chứa..." />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Hủy</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50">
                            {loading ? 'Đang lưu...' : (room ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomsPage;
