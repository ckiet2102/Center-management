import { useEffect, useState } from 'react';
import api from '../services/api';
import StudentModal from '../components/students/StudentModal';
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineDownload, HiOutlinePhone, HiOutlineMail, HiOutlineAcademicCap, HiOutlineBookOpen } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { getAvatarColor, getInitials } from '../utils/avatar';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editStudent, setEditStudent] = useState(null);
    const { user } = useAuth();

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const params = search ? { search } : {};
            const response = await api.get('/students', { params });
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Bạn có chắc muốn xóa học viên "${name}"?`)) return;
        try {
            await api.delete(`/students/${id}`);
            fetchStudents();
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi khi xóa');
        }
    };

    const handleExportCSV = async () => {
        try {
            const res = await api.get('/students/export-csv', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'danh_sach_hoc_vien.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Lỗi khi xuất danh sách');
        }
    };

    const openEdit = (student) => { setEditStudent(student); setModalOpen(true); };
    const openAdd = () => { setEditStudent(null); setModalOpen(true); };
    const handleSaved = () => { setModalOpen(false); setEditStudent(null); fetchStudents(); };

    const getStatusBadge = (status) => {
        const map = {
            dang_hoc: { label: 'Đang học', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' },
            bao_luu: { label: 'Bảo lưu', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' },
            da_nghi: { label: 'Đã nghỉ', cls: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400' }
        };
        const info = map[status] || { label: status, cls: 'bg-gray-100 text-gray-700 dark:bg-slate-500/15 dark:text-slate-400' };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${info.cls}`}>{info.label}</span>;
    };

    // Extract class & teacher from first enrollment
    const getClassInfo = (student) => {
        const enrollment = student.enrollments?.[0];
        if (!enrollment?.class) return null;
        return {
            className: enrollment.class.class_name,
            teacherName: enrollment.class.teacher?.full_name || 'Chưa phân công'
        };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Học viên</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">{students.length} học viên</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all">
                        <HiOutlineDownload size={18} /> Xuất DSHV
                    </button>
                    <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
                        <HiOutlinePlus size={18} /> Thêm học viên
                    </button>
                </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1 max-w-md">
                    <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={20} />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm tên, SĐT, mã HV..."
                        className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                </div>
                <button type="submit" className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-white rounded-xl transition-colors">Tìm</button>
            </form>

            {/* Student Cards Grid */}
            {loading ? (
                <div className="text-center py-16 text-gray-400 dark:text-slate-400">Đang tải dữ liệu...</div>
            ) : students.length === 0 ? (
                <div className="text-center py-16 text-gray-400 dark:text-slate-400">Không tìm thấy học viên</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {students.map((s) => {
                        const classInfo = getClassInfo(s);
                        return (
                            <div key={s.id} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm dark:shadow-none hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all group">
                                {/* Header row */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const color = getAvatarColor(s.id); return (
                                                <div className={`w-12 h-12 bg-gradient-to-br ${color.bg} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ${color.ring} shrink-0`}>
                                                    {getInitials(s.full_name)}
                                                </div>
                                            );
                                        })()}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{s.full_name}</h3>
                                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">Mã HV: #{s.id}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(s.learning_status)}
                                </div>

                                {/* Info */}
                                <div className="space-y-2.5 mb-4">
                                    {s.phone && (
                                        <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                                            <HiOutlinePhone size={16} className="text-gray-400 dark:text-slate-500 shrink-0" />
                                            <span>{s.phone}</span>
                                        </div>
                                    )}
                                    {s.email && (
                                        <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                                            <HiOutlineMail size={16} className="text-gray-400 dark:text-slate-500 shrink-0" />
                                            <span className="truncate">{s.email}</span>
                                        </div>
                                    )}

                                    {/* Class & Teacher */}
                                    {classInfo ? (
                                        <>
                                            <div className="flex items-center gap-2.5 text-sm">
                                                <HiOutlineBookOpen size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                                                <span className="font-medium text-indigo-600 dark:text-indigo-400">{classInfo.className}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-sm">
                                                <HiOutlineAcademicCap size={16} className="text-purple-500 dark:text-purple-400 shrink-0" />
                                                <span className="text-purple-600 dark:text-purple-400">{classInfo.teacherName}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2.5 text-sm text-gray-400 dark:text-slate-500 italic">
                                            <HiOutlineBookOpen size={16} className="shrink-0" />
                                            <span>Chưa đăng ký lớp</span>
                                        </div>
                                    )}
                                </div>

                                {/* Promotion badge with reason */}
                                {s.promotion && (
                                    <div className="mb-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${s.promotion.discount_percent >= 10
                                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400'
                                            : s.promotion.condition_type === 'special'
                                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                                            }`}>
                                            🎁 Ưu đãi: {s.promotion.discount_percent}% — {
                                                s.promotion.condition_type === 'seniority_2y' ? 'Thâm niên > 2 năm' :
                                                    s.promotion.condition_type === 'seniority_1y' ? 'Thâm niên > 1 năm' :
                                                        s.promotion.condition_type === 'family' ? 'Người thân' :
                                                            s.promotion.condition_type === 'special' ? 'Đặc biệt (Học bổng)' :
                                                                s.promotion.name
                                            }
                                        </span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700/50">
                                    <span className="text-xs text-gray-400 dark:text-slate-500">Tham gia: {s.join_date || '—'}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(s)} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors" title="Sửa">
                                            <HiOutlinePencil size={16} />
                                        </button>
                                        {user?.role === 'admin' && (
                                            <button onClick={() => handleDelete(s.id, s.full_name)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors" title="Xóa">
                                                <HiOutlineTrash size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {modalOpen && <StudentModal student={editStudent} onClose={() => { setModalOpen(false); setEditStudent(null); }} onSaved={handleSaved} />}
        </div>
    );
};

export default StudentsPage;
