import { useEffect, useState } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineUserGroup,
    HiOutlineDownload, HiOutlineX, HiOutlineOfficeBuilding, HiOutlineAcademicCap,
    HiOutlineTrash, HiOutlineClock, HiOutlineCalendar
} from 'react-icons/hi';
import { getAvatarColor, getInitials } from '../utils/avatar';

const WEEKDAYS = [
    { value: 'T2', label: 'T2' },
    { value: 'T3', label: 'T3' },
    { value: 'T4', label: 'T4' },
    { value: 'T5', label: 'T5' },
    { value: 'T6', label: 'T6' },
    { value: 'T7', label: 'T7' },
    { value: 'CN', label: 'CN' },
];

const ClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [editClass, setEditClass] = useState(null);
    const [classModalOpen, setClassModalOpen] = useState(false);
    const [studentsModal, setStudentsModal] = useState(null);
    const [addStudentModal, setAddStudentModal] = useState(null);
    const [classStudents, setClassStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [searchAvailable, setSearchAvailable] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [levels, setLevels] = useState([]);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const params = search ? { search } : {};
            const res = await api.get('/classes', { params });
            setClasses(res.data);
        } catch { } finally { setLoading(false); }
    };

    const fetchFormData = async () => {
        try {
            const [t, r, s, l] = await Promise.all([
                api.get('/teachers'), api.get('/rooms'), api.get('/shifts'), api.get('/levels')
            ]);
            setTeachers(t.data); setRooms(r.data); setShifts(s.data); setLevels(l.data);
        } catch { }
    };

    useEffect(() => { fetchClasses(); fetchFormData(); }, []);
    const handleSearch = (e) => { e.preventDefault(); fetchClasses(); };

    const openClassStudents = async (cls) => {
        setStudentsModal({ classId: cls.id, className: cls.class_name });
        try {
            const res = await api.get(`/classes/${cls.id}/students`);
            setClassStudents(res.data);
        } catch { setClassStudents([]); }
    };

    const openAddStudent = async (classId) => {
        setAddStudentModal(classId);
        try {
            const res = await api.get(`/classes/${classId}/available-students`);
            setAvailableStudents(res.data);
        } catch { setAvailableStudents([]); }
    };

    const handleAddStudent = async (studentId) => {
        try {
            await api.post(`/classes/${addStudentModal}/students`, { student_id: studentId });
            setAvailableStudents(prev => prev.filter(s => s.id !== studentId));
            const res = await api.get(`/classes/${addStudentModal}/students`);
            setClassStudents(res.data);
            fetchClasses();
        } catch (err) { alert(err.response?.data?.message || 'Lỗi thêm học viên'); }
    };

    const handleRemoveStudent = async (classId, studentId) => {
        if (!confirm('Xóa học viên khỏi lớp?')) return;
        try {
            await api.delete(`/classes/${classId}/students/${studentId}`);
            setClassStudents(prev => prev.filter(e => e.student?.id !== studentId));
            fetchClasses();
        } catch (err) { alert(err.response?.data?.message || 'Lỗi xóa'); }
    };

    const handleExportClassCSV = async (classId) => {
        try {
            const res = await api.get(`/classes/${classId}/export-csv`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `danh_sach_lop_${classId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch { alert('Lỗi xuất danh sách'); }
    };

    const filteredAvailable = searchAvailable
        ? availableStudents.filter(s => s.full_name.toLowerCase().includes(searchAvailable.toLowerCase()))
        : availableStudents;

    // Format schedule for card display
    const formatSchedule = (cls) => {
        const parts = [];
        if (cls.schedule_days) parts.push(cls.schedule_days);
        if (cls.shift) {
            const time = `${cls.shift.start_time?.substring(0, 5)}–${cls.shift.end_time?.substring(0, 5)}`;
            parts.push(time);
        }
        return parts.join(' | ');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Lớp học</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">{classes.length} lớp</p>
                </div>
                <button onClick={() => { setEditClass(null); setClassModalOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
                    <HiOutlinePlus size={18} /> Thêm lớp mới
                </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1 max-w-md">
                    <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={20} />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm lớp học hoặc giáo viên..."
                        className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                </div>
                <button type="submit" className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-white rounded-xl transition-colors">Tìm</button>
            </form>

            {/* Class Cards */}
            {loading ? (
                <div className="text-center py-16 text-gray-400 dark:text-slate-400">Đang tải...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {classes.map((c) => {
                        const schedule = formatSchedule(c);
                        return (
                            <div key={c.id} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm dark:shadow-none hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all group">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{c.class_name}</h3>
                                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === 1 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-gray-100 text-gray-700 dark:bg-slate-500/15 dark:text-slate-400'}`}>
                                            {c.status === 1 ? 'Đang mở' : 'Đã kết thúc'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditClass(c); setClassModalOpen(true); }} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors" title="Sửa">
                                            <HiOutlinePencil size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-2.5 mb-4">
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <HiOutlineAcademicCap size={16} className="text-purple-500 shrink-0" />
                                        <span className="text-gray-700 dark:text-slate-300">GV: <strong className="text-purple-600 dark:text-purple-400">{c.teacher?.full_name || '—'}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <HiOutlineOfficeBuilding size={16} className="text-indigo-500 shrink-0" />
                                        <span className="text-gray-700 dark:text-slate-300">Phòng: <strong className="text-indigo-600 dark:text-indigo-400">{c.room?.room_name || '—'}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <HiOutlineUserGroup size={16} className="text-emerald-500 shrink-0" />
                                        <span className="text-gray-700 dark:text-slate-300">Sĩ số: <strong className="text-emerald-600 dark:text-emerald-400">{c.student_count || 0}</strong> học viên</span>
                                    </div>
                                    {/* Schedule display */}
                                    {schedule && (
                                        <div className="flex items-center gap-2.5 text-sm">
                                            <HiOutlineCalendar size={16} className="text-amber-500 shrink-0" />
                                            <span className="text-amber-700 dark:text-amber-400 font-medium">{schedule}</span>
                                        </div>
                                    )}
                                    {c.shift && (
                                        <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-slate-400">
                                            <HiOutlineClock size={14} className="shrink-0" />
                                            <span>Ca: {c.shift.shift_name}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-slate-700/50">
                                    <button onClick={() => openClassStudents(c)} className="flex-1 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors text-center">
                                        👥 Xem DS
                                    </button>
                                    <button onClick={() => { openClassStudents(c); openAddStudent(c.id); }} className="flex-1 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors text-center">
                                        ➕ Thêm HV
                                    </button>
                                    <button onClick={() => handleExportClassCSV(c.id)} className="flex-1 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-colors text-center">
                                        📊 Xuất CSV
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Class Students Modal */}
            {studentsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={() => { setStudentsModal(null); setAddStudentModal(null); }}>
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Danh sách lớp {studentsModal.className}</h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">{classStudents.length} học viên</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => openAddStudent(studentsModal.classId)} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors">
                                    <HiOutlinePlus size={16} /> Thêm HV
                                </button>
                                <button onClick={() => { setStudentsModal(null); setAddStudentModal(null); }} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                                    <HiOutlineX size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-[60vh] p-5">
                            {classStudents.length === 0 ? (
                                <p className="text-center text-gray-400 dark:text-slate-400 py-8">Chưa có học viên trong lớp</p>
                            ) : (
                                <div className="space-y-3">
                                    {classStudents.map((enrollment) => {
                                        const sid = enrollment.student?.id;
                                        const color = getAvatarColor(sid);
                                        return (
                                            <div key={enrollment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/30 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 bg-gradient-to-br ${color.bg} rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ${color.ring} shrink-0`}>
                                                        {getInitials(enrollment.student?.full_name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{enrollment.student?.full_name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-slate-400">{enrollment.student?.phone || ''} | {enrollment.status}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleRemoveStudent(studentsModal.classId, enrollment.student?.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Xóa khỏi lớp">
                                                    <HiOutlineTrash size={16} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Student to Class Modal */}
            {addStudentModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center modal-backdrop" onClick={() => setAddStudentModal(null)}>
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden m-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700/50">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chọn học viên</h2>
                            <button onClick={() => setAddStudentModal(null)} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg">
                                <HiOutlineX size={20} />
                            </button>
                        </div>
                        <div className="p-4 border-b border-gray-200 dark:border-slate-700/50">
                            <div className="relative">
                                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" value={searchAvailable} onChange={e => setSearchAvailable(e.target.value)} placeholder="Tìm học viên..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-[50vh] p-4 space-y-2">
                            {filteredAvailable.length === 0 ? (
                                <p className="text-center text-gray-400 dark:text-slate-400 py-4 text-sm">Không có học viên khả dụng</p>
                            ) : filteredAvailable.map(s => {
                                const color = getAvatarColor(s.id);
                                return (
                                    <button key={s.id} onClick={() => handleAddStudent(s.id)} className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors text-left">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 bg-gradient-to-br ${color.bg} rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ${color.ring} shrink-0`}>
                                                {getInitials(s.full_name)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">{s.full_name}</p>
                                                <p className="text-xs text-gray-500 dark:text-slate-400">{s.phone || ''}</p>
                                            </div>
                                        </div>
                                        <HiOutlinePlus size={18} className="text-emerald-500 shrink-0" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Class Add/Edit Modal */}
            {classModalOpen && (
                <ClassFormModal
                    classData={editClass}
                    teachers={teachers}
                    rooms={rooms}
                    shifts={shifts}
                    levels={levels}
                    onClose={() => { setClassModalOpen(false); setEditClass(null); }}
                    onSaved={() => { setClassModalOpen(false); setEditClass(null); fetchClasses(); }}
                />
            )}
        </div>
    );
};

// ──── Class Add/Edit Form Modal with Day Checkboxes ────
const ClassFormModal = ({ classData, teachers, rooms, shifts, levels, onClose, onSaved }) => {
    // Parse existing schedule_days to array for checkboxes
    const parseDaysToArray = (daysStr) => {
        if (!daysStr) return [];
        return daysStr.split(/[,\-|;\s]+/).map(d => d.trim()).filter(d => WEEKDAYS.some(w => w.value === d));
    };

    const [form, setForm] = useState({
        class_name: classData?.class_name || '',
        teacher_id: classData?.teacher_id || '',
        room_id: classData?.room_id || '',
        shift_id: classData?.shift_id || '',
        level_id: classData?.level_id || '',
        start_date: classData?.start_date || '',
        end_date: classData?.end_date || '',
        status: classData?.status ?? 1,
    });
    const [selectedDays, setSelectedDays] = useState(parseDaysToArray(classData?.schedule_days || ''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleDay = (dayVal) => {
        setSelectedDays(prev =>
            prev.includes(dayVal) ? prev.filter(d => d !== dayVal) : [...prev, dayVal]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        const submitData = { ...form, schedule_days: selectedDays.join(',') };
        try {
            if (classData) {
                await api.put(`/classes/${classData.id}`, submitData);
            } else {
                await api.post('/classes', submitData);
            }
            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi lưu');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{classData ? 'Sửa lớp học' : 'Thêm lớp mới'}</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg"><HiOutlineX size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Error display — red alert for conflicts */}
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">⚠️</span>
                            <div className="whitespace-pre-line">{error}</div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Tên lớp *</label>
                        <input value={form.class_name} onChange={e => setForm(f => ({ ...f, class_name: e.target.value }))} required className={inputClass} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Giáo viên</label>
                            <select value={form.teacher_id} onChange={e => setForm(f => ({ ...f, teacher_id: e.target.value }))} className={inputClass}>
                                <option value="">— Chọn GV —</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Phòng học</label>
                            <select value={form.room_id} onChange={e => setForm(f => ({ ...f, room_id: e.target.value }))} className={inputClass}>
                                <option value="">— Chọn phòng —</option>
                                {rooms.map(r => <option key={r.id} value={r.id}>{r.room_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Ca học</label>
                            <select value={form.shift_id} onChange={e => setForm(f => ({ ...f, shift_id: e.target.value }))} className={inputClass}>
                                <option value="">— Chọn ca —</option>
                                {shifts.map(s => <option key={s.id} value={s.id}>{s.shift_name} ({s.start_time?.substring(0, 5)}–{s.end_time?.substring(0, 5)})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Trình độ</label>
                            <select value={form.level_id} onChange={e => setForm(f => ({ ...f, level_id: e.target.value }))} className={inputClass}>
                                <option value="">— Chọn level —</option>
                                {levels.map(l => <option key={l.id} value={l.id}>{l.level_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Ngày bắt đầu</label>
                            <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Ngày kết thúc</label>
                            <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} className={inputClass} />
                        </div>
                    </div>

                    {/* Weekday Checkboxes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Lịch học trong tuần *</label>
                        <div className="flex flex-wrap gap-2">
                            {WEEKDAYS.map(day => (
                                <button
                                    type="button"
                                    key={day.value}
                                    onClick={() => toggleDay(day.value)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${selectedDays.includes(day.value)
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                                            : 'bg-gray-50 dark:bg-slate-800/50 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/30'
                                        }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                        {selectedDays.length > 0 && (
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1.5">Đã chọn: {selectedDays.join(', ')}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Hủy</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50">
                            {loading ? 'Đang lưu...' : (classData ? 'Cập nhật' : 'Tạo lớp')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassesPage;
