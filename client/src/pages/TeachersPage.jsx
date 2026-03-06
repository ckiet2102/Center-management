import { useEffect, useState } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
    HiOutlinePhone, HiOutlineMail, HiOutlineAcademicCap, HiOutlineBookOpen, HiOutlineX
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { getAvatarColor, getInitials } from '../utils/avatar';

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTeacher, setEditTeacher] = useState(null);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const params = search ? { search } : {};
            const res = await api.get('/teachers', { params });
            setTeachers(res.data);
        } catch (err) {
            console.error('Failed to fetch teachers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTeachers(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTeachers();
    };

    // Real-time search on typing
    useEffect(() => {
        const timer = setTimeout(() => { fetchTeachers(); }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id, name) => {
        if (!confirm(`Bạn có chắc muốn xóa giảng viên "${name}"?`)) return;
        try {
            await api.delete(`/teachers/${id}`);
            fetchTeachers();
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi xóa giảng viên');
        }
    };

    const openEdit = (teacher) => { setEditTeacher(teacher); setModalOpen(true); };
    const openAdd = () => { setEditTeacher(null); setModalOpen(true); };
    const handleSaved = () => { setModalOpen(false); setEditTeacher(null); fetchTeachers(); };

    const getStatusBadge = (status) => {
        const map = {
            dang_day: { label: 'Đang dạy', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' },
            tam_nghi: { label: 'Tạm nghỉ', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' },
            nghi_phep: { label: 'Nghỉ phép', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400' },
            nghi_viec: { label: 'Nghỉ việc', cls: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400' },
            thu_viec: { label: 'Thử việc', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400' }
        };
        const info = map[status] || { label: status || '—', cls: 'bg-gray-100 text-gray-700 dark:bg-slate-500/15 dark:text-slate-400' };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${info.cls}`}>{info.label}</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Giảng viên</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">{teachers.length} giảng viên</p>
                </div>
                {isAdmin && (
                    <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
                        <HiOutlinePlus size={18} /> Thêm giảng viên
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1 max-w-md">
                    <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={20} />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm tên, email, chuyên môn..."
                        className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                </div>
            </form>

            {/* Teacher Cards Grid */}
            {loading ? (
                <div className="text-center py-16 text-gray-400 dark:text-slate-400">Đang tải dữ liệu...</div>
            ) : teachers.length === 0 ? (
                <div className="text-center py-16 text-gray-400 dark:text-slate-400">Không tìm thấy giảng viên</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {teachers.map((t) => {
                        const color = getAvatarColor(t.id);
                        return (
                            <div key={t.id} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm dark:shadow-none hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all group">
                                {/* Header row */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${color.bg} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ${color.ring} shrink-0`}>
                                            {getInitials(t.full_name)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{t.full_name}</h3>
                                            {t.code_name && <p className="text-xs text-indigo-600 dark:text-indigo-400">{t.code_name}</p>}
                                        </div>
                                    </div>
                                    {getStatusBadge(t.status)}
                                </div>

                                {/* Info */}
                                <div className="space-y-2.5 mb-4">
                                    {t.specialty && (
                                        <div className="flex items-center gap-2.5 text-sm">
                                            <HiOutlineAcademicCap size={16} className="text-purple-500 dark:text-purple-400 shrink-0" />
                                            <span className="text-purple-600 dark:text-purple-400 font-medium">{t.specialty}</span>
                                        </div>
                                    )}
                                    {t.phone && (
                                        <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                                            <HiOutlinePhone size={16} className="text-gray-400 dark:text-slate-500 shrink-0" />
                                            <span>{t.phone}</span>
                                        </div>
                                    )}
                                    {t.email && (
                                        <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                                            <HiOutlineMail size={16} className="text-gray-400 dark:text-slate-500 shrink-0" />
                                            <span className="truncate">{t.email}</span>
                                        </div>
                                    )}
                                    {/* Class count */}
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <HiOutlineBookOpen size={16} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                                        <span className="text-gray-700 dark:text-slate-300">
                                            Đang phụ trách: <strong className="text-emerald-600 dark:text-emerald-400">{t.class_count || 0}</strong> lớp
                                        </span>
                                    </div>
                                </div>

                                {/* Bottom with experience/university + actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700/50">
                                    <div className="text-xs text-gray-400 dark:text-slate-500 truncate max-w-[180px]">
                                        {t.university || t.experience || '—'}
                                    </div>
                                    {isAdmin && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(t)} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors" title="Sửa">
                                                <HiOutlinePencil size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(t.id, t.full_name)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors" title="Xóa">
                                                <HiOutlineTrash size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Teacher Add/Edit Modal */}
            {modalOpen && (
                <TeacherFormModal
                    teacher={editTeacher}
                    onClose={() => { setModalOpen(false); setEditTeacher(null); }}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
};

// ──── Teacher Add/Edit Modal ────
const TeacherFormModal = ({ teacher, onClose, onSaved }) => {
    const [form, setForm] = useState({
        full_name: teacher?.full_name || '',
        code_name: teacher?.code_name || '',
        dob: teacher?.dob || '',
        gender: teacher?.gender || 'Nu',
        phone: teacher?.phone || '',
        email: teacher?.email || '',
        university: teacher?.university || '',
        p_c: teacher?.p_c || '',
        experience: teacher?.experience || '',
        specialty: teacher?.specialty || 'Khác',
        status: teacher?.status || 'thu_viec',
        note: teacher?.note || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            if (teacher) {
                await api.put(`/teachers/${teacher.id}`, form);
            } else {
                await api.post('/teachers', form);
            }
            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi lưu');
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {teacher ? 'Sửa thông tin Giảng viên' : 'Thêm Giảng viên mới'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg">
                        <HiOutlineX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Row 1: Name + Code Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Họ tên *</label>
                            <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Tên nghệ danh</label>
                            <input value={form.code_name} onChange={e => setForm(f => ({ ...f, code_name: e.target.value }))} className={inputCls} placeholder="VD: Mr.Nam" />
                        </div>
                    </div>

                    {/* Row 2: DoB + Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Ngày sinh</label>
                            <input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Giới tính</label>
                            <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className={inputCls}>
                                <option value="Nam">Nam</option>
                                <option value="Nu">Nữ</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 3: Phone + Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Số điện thoại</label>
                            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
                            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
                        </div>
                    </div>

                    {/* Row 4: Specialty + Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Học vị</label>
                            <select value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} className={inputCls}>
                                <option value="Cử Nhân">Cử Nhân</option>
                                <option value="Thạc Sĩ">Thạc Sĩ</option>
                                <option value="Tiến Sĩ">Tiến Sĩ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Trạng thái</label>
                            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
                                <option value="dang_day">Đang dạy</option>
                                <option value="thu_viec">Thử việc</option>
                                <option value="tam_nghi">Tạm nghỉ</option>
                                <option value="nghi_phep">Nghỉ phép</option>
                                <option value="nghi_viec">Nghỉ việc</option>
                            </select>
                        </div>
                    </div>

                    {/* University */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Trường đại học</label>
                        <input value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))} className={inputCls} />
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Kinh nghiệm</label>
                        <input value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} className={inputCls} placeholder="VD: 3 năm giảng dạy IELTS" />
                    </div>

                    {/* Certificates */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Chứng chỉ chuyên môn</label>
                        <textarea value={form.p_c} onChange={e => setForm(f => ({ ...f, p_c: e.target.value }))} rows={2} className={inputCls} placeholder="VD: IELTS 8.0, TESOL, CELTA..." />
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Ghi chú</label>
                        <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} rows={2} className={inputCls} />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            Hủy
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50">
                            {loading ? 'Đang lưu...' : (teacher ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeachersPage;
