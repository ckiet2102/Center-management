import { useEffect, useState } from 'react';
import api from '../services/api';
import {
    HiOutlineSearch, HiOutlinePlus, HiOutlineX, HiOutlineCash,
    HiOutlineQrcode, HiOutlineCalendar, HiOutlineClock, HiOutlinePause, HiOutlinePlay,
    HiOutlineBan
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { getAvatarColor, getInitials } from '../utils/avatar';
import { calculateEndDate, calculateRemainingSessions } from '../utils/scheduleCalculator';

const PaymentsPage = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [historyModal, setHistoryModal] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [qrModal, setQrModal] = useState(null);
    const [freezeModal, setFreezeModal] = useState(null);
    const [unfreezeModal, setUnfreezeModal] = useState(null);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const params = search ? { search } : {};
            const res = await api.get('/payments/summary', { params });
            setStudents(res.data);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchStudents(); }, []);
    useEffect(() => {
        const t = setTimeout(fetchStudents, 400);
        return () => clearTimeout(t);
    }, [search]);

    const fmt = (val) => val ? Number(val).toLocaleString('vi-VN') + ' ₫' : '0 ₫';

    const openHistory = async (student) => {
        setHistoryModal(student);
        try {
            const res = await api.get(`/payments/history/${student.id}`);
            setHistoryData(res.data);
        } catch { setHistoryData([]); }
    };

    const handleHistoryAction = () => {
        fetchStudents();
        if (historyModal) openHistory(historyModal);
    };

    const handleCancel = async (paymentId) => {
        if (!confirm('Hủy hóa đơn này?')) return;
        try {
            await api.post(`/payments/${paymentId}/cancel`);
            handleHistoryAction();
        } catch (err) { alert(err.response?.data?.message || 'Lỗi'); }
    };

    const getStateBadge = (state) => {
        const map = {
            con_han: { label: '✅ Còn hạn', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' },
            het_han: { label: '⚠️ Hết hạn', cls: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400' },
            bao_luu: { label: '⏸️ Bảo lưu', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' },
            chua_dong: { label: '❌ Chưa đóng', cls: 'bg-gray-100 text-gray-700 dark:bg-slate-500/15 dark:text-slate-400' }
        };
        const info = map[state] || map.chua_dong;
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${info.cls}`}>{info.label}</span>;
    };

    const getPaymentStatusBadge = (status) => {
        const map = {
            thanh_cong: { label: 'Thành công', cls: 'text-emerald-600 dark:text-emerald-400' },
            dang_cho: { label: 'Đang chờ', cls: 'text-amber-600 dark:text-amber-400' },
            da_huy: { label: 'Đã hủy', cls: 'text-red-500 dark:text-red-400 line-through' }
        };
        return map[status] || map.thanh_cong;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Học phí</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">{students.length} học viên</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
                        <HiOutlinePlus size={18} /> Tạo hóa đơn
                    </button>
                )}
            </div>

            <div className="relative max-w-md">
                <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm học viên..."
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
            </div>

            {/* Student Payment Cards - 1 card per student */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">Đang tải...</div>
            ) : students.length === 0 ? (
                <div className="text-center py-16 text-gray-400">Không tìm thấy học viên</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {students.map(s => {
                        const color = getAvatarColor(s.id);
                        const lp = s.latestPayment;
                        return (
                            <div key={s.id} className={`bg-white dark:bg-slate-900/50 border rounded-2xl p-5 shadow-sm transition-all ${s.paymentState === 'het_han' ? 'border-red-200 dark:border-red-500/30 ring-1 ring-red-100 dark:ring-red-500/10' :
                                s.paymentState === 'bao_luu' ? 'border-amber-200 dark:border-amber-500/30' :
                                    'border-gray-200 dark:border-slate-700/50'
                                }`}>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 bg-gradient-to-br ${color.bg} rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ${color.ring} shrink-0`}>
                                            {getInitials(s.full_name)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{s.full_name}</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400">{s.enrollment?.class?.class_name || 'Chưa có lớp'}</p>
                                        </div>
                                    </div>
                                    {getStateBadge(s.paymentState)}
                                </div>

                                {/* Payment Info */}
                                <div className="space-y-2 mb-3">
                                    {lp && (
                                        <>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                                <HiOutlineCalendar size={15} className="shrink-0" />
                                                <span>Hạn: <strong className={s.paymentState === 'het_han' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}>{lp.end_date || '—'}</strong></span>
                                            </div>
                                            {s.daysUntilExpiry !== null && s.paymentState === 'con_han' && s.daysUntilExpiry <= 7 && (
                                                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">⏰ Sắp hết hạn: còn {s.daysUntilExpiry} ngày</p>
                                            )}
                                            {s.paymentState === 'het_han' && s.daysUntilExpiry !== null && (
                                                <p className="text-xs text-red-500 font-medium">Quá hạn {Math.abs(s.daysUntilExpiry)} ngày</p>
                                            )}
                                            {s.paymentState === 'bao_luu' && lp.remaining_sessions > 0 && (
                                                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">📦 Còn {lp.remaining_sessions} buổi bảo lưu</p>
                                            )}
                                        </>
                                    )}
                                    {!lp && (
                                        <p className="text-sm text-gray-400 dark:text-slate-500 italic">Chưa có hóa đơn</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-slate-700/50">
                                    <button onClick={() => openHistory(s)} className="flex-1 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors text-center">
                                        📋 Lịch sử
                                    </button>
                                    {isAdmin && lp && s.paymentState === 'con_han' && (
                                        <button onClick={() => setFreezeModal({ paymentId: lp.id, endDate: lp.end_date, schedule: s.enrollment?.class?.schedule_days })} className="py-2 px-3 text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-colors" title="Bảo lưu">
                                            <HiOutlinePause size={16} />
                                        </button>
                                    )}
                                    {isAdmin && lp && s.paymentState === 'bao_luu' && (
                                        <button onClick={() => setUnfreezeModal({ paymentId: lp.id, remaining: lp.remaining_sessions, schedule: s.enrollment?.class?.schedule_days })} className="py-2 px-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors" title="Mở bảo lưu">
                                            <HiOutlinePlay size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* History Modal */}
            {historyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={() => setHistoryModal(null)}>
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lịch sử đóng phí</h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">{historyModal.full_name}</p>
                            </div>
                            <button onClick={() => setHistoryModal(null)} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg">
                                <HiOutlineX size={20} />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[70vh] p-5 space-y-3">
                            {historyData.length === 0 ? (
                                <p className="text-center text-gray-400 py-8">Chưa có lịch sử thanh toán</p>
                            ) : historyData.map(p => {
                                const statusInfo = getPaymentStatusBadge(p.payment_status);
                                return (
                                    <div key={p.id} className={`bg-gray-50 dark:bg-slate-800/30 rounded-xl p-4 ${p.payment_status === 'da_huy' ? 'opacity-50' : ''}`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {p.package?.level?.level_name || ''} — Gói {p.weeks} tuần
                                                </p>
                                                <p className={`text-xs font-medium ${statusInfo.cls}`}>{statusInfo.label}</p>
                                            </div>
                                            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{fmt(p.final_amount)}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-slate-400">
                                            <div>📅 {p.start_date} → {p.end_date}</div>
                                            <div>💰 Gốc: {fmt(p.original_amount)}</div>
                                            {p.discount_amount > 0 && <div className="text-amber-600">🎁 -{fmt(p.discount_amount)} ({p.promotion?.discount_percent}%)</div>}
                                            <div>🧾 {p.transaction_code || ''}</div>
                                            {p.freeze_date && <div className="text-amber-600">⏸️ Bảo lưu: {p.freeze_date} ({p.remaining_sessions} buổi còn)</div>}
                                            {p.unfreeze_date && <div className="text-emerald-600">▶️ Mở BL: {p.unfreeze_date}</div>}
                                        </div>
                                        {/* Actions */}
                                        {isAdmin && p.payment_status === 'thanh_cong' && (
                                            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-slate-700/50">
                                                {!p.freeze_date && (
                                                    <button onClick={() => setFreezeModal({ paymentId: p.id, endDate: p.end_date, schedule: historyModal.enrollment?.class?.schedule_days })} className="text-xs text-amber-600 hover:underline flex items-center gap-1">
                                                        <HiOutlinePause size={12} /> Bảo lưu
                                                    </button>
                                                )}
                                                {p.freeze_date && (
                                                    <button onClick={() => setUnfreezeModal({ paymentId: p.id, remaining: p.remaining_sessions, schedule: historyModal.enrollment?.class?.schedule_days })} className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                                                        <HiOutlinePlay size={12} /> Mở BL
                                                    </button>
                                                )}
                                                <button onClick={() => handleCancel(p.id)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                                    <HiOutlineBan size={12} /> Hủy
                                                </button>
                                                {(p.payment_method === 'vietqr' || p.payment_method === 'chuyen_khoan') && (
                                                    <button onClick={() => setQrModal(p)} className="text-xs text-purple-600 hover:underline flex items-center gap-1">
                                                        <HiOutlineQrcode size={12} /> QR
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Payment Modal */}
            {createModalOpen && (
                <CreatePaymentModal
                    onClose={() => setCreateModalOpen(false)}
                    onSaved={() => { setCreateModalOpen(false); fetchStudents(); }}
                />
            )}

            {/* Freeze & Unfreeze Modals */}
            {freezeModal && <FreezePaymentModal data={freezeModal} onClose={() => setFreezeModal(null)} onSaved={() => { setFreezeModal(null); handleHistoryAction(); }} />}
            {unfreezeModal && <UnfreezePaymentModal data={unfreezeModal} onClose={() => setUnfreezeModal(null)} onSaved={() => { setUnfreezeModal(null); handleHistoryAction(); }} />}

        </div>
    );
};

// ──── Freeze Modal ────
const FreezePaymentModal = ({ data, onClose, onSaved }) => {
    const today = new Date().toISOString().slice(0, 10);
    const [freezeDate, setFreezeDate] = useState(today);
    const [loading, setLoading] = useState(false);

    const remaining = calculateRemainingSessions(freezeDate, data.endDate, data.schedule || '');

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post(`/payments/${data.paymentId}/freeze`, { freeze_date: freezeDate });
            onSaved();
        } catch (err) { alert('Lỗi: ' + (err.response?.data?.message || err.message)); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border rounded-2xl w-full max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold dark:text-white">⏸️ Bảo lưu học phí</h2>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Ngày bắt đầu nghỉ</label>
                        <input type="date" value={freezeDate} onChange={e => setFreezeDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:text-white" />
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 p-3 rounded-xl text-amber-700 dark:text-amber-400">
                        <p className="text-sm">Ngày hạn cũ: {data.endDate}</p>
                        <p className="font-bold text-lg mt-1">Còn dư: {remaining} buổi</p>
                        <p className="text-xs opacity-80">(Tính theo lịch học {data.schedule || 'chuẩn'})</p>
                        {!data.schedule && <p className="text-xs text-red-500 mt-1">⚠️ Học viên chưa có lịch học cụ thể, tính theo chu kỳ 3 buổi/tuần mặc định.</p>}
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-xl">Hủy</button>
                    <button onClick={handleSubmit} disabled={loading || remaining < 0} className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium">Lưu</button>
                </div>
            </div>
        </div>
    );
};

// ──── Unfreeze Modal ────
const UnfreezePaymentModal = ({ data, onClose, onSaved }) => {
    const today = new Date().toISOString().slice(0, 10);
    const [resumeDate, setResumeDate] = useState(today);
    const [loading, setLoading] = useState(false);

    // Live calculate new end date
    const newEndDate = calculateEndDate(resumeDate, data.remaining, data.schedule || '');

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post(`/payments/${data.paymentId}/unfreeze`, { resume_date: resumeDate });
            onSaved();
        } catch (err) { alert('Lỗi: ' + (err.response?.data?.message || err.message)); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border rounded-2xl w-full max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold dark:text-white">▶️ Đi học lại</h2>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Ngày bắt đầu học</label>
                        <input type="date" value={resumeDate} onChange={e => setResumeDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:text-white" />
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 p-3 rounded-xl text-emerald-700 dark:text-emerald-400">
                        <p className="text-sm">Được bù: {data.remaining} buổi</p>
                        <p className="text-sm mt-1">Lịch học: {data.schedule}</p>
                        <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-500/30">
                            <p className="font-bold">Ngày hết hạn mới: 🎯 {newEndDate}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <button onClick={onClose} className="flex-1 py-2 bg-gray-100 rounded-xl">Hủy</button>
                    <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium">Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

// ──── Smart Create Payment Modal ────
const CreatePaymentModal = ({ onClose, onSaved }) => {
    const [students, setStudents] = useState([]);
    const [packages, setPackages] = useState([]);
    const [levels, setLevels] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('tien_mat');
    const [note, setNote] = useState('');
    const [searchStudent, setSearchStudent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestedStart, setSuggestedStart] = useState(null);
    const [startDateOverride, setStartDateOverride] = useState('');
    const [endDateOverride, setEndDateOverride] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const [sRes, pRes, lRes] = await Promise.all([
                    api.get('/payments/summary'),
                    api.get('/tuition-packages'),
                    api.get('/levels')
                ]);
                // Sort: expired/expiring first
                setStudents(sRes.data);
                setPackages(pRes.data);
                setLevels(lRes.data);
            } catch { }
        };
        fetch();
    }, []);

    const selectStudent = async (s) => {
        setSelectedStudent(s);
        setSearchStudent('');
        // Get suggested start date
        try {
            const res = await api.get(`/payments/suggest-start/${s.id}`);
            setSuggestedStart(res.data);
            setStartDateOverride(res.data.suggested_start);
        } catch { }
    };

    const filteredStudents = searchStudent
        ? students.filter(s => s.full_name?.toLowerCase().includes(searchStudent.toLowerCase()))
        : students;

    const discountPercent = selectedStudent?.promotion?.discount_percent || 0;
    const originalAmount = selectedPkg ? Number(selectedPkg.tuition_fee) : 0;
    const discountAmount = Math.round(originalAmount * discountPercent / 100);
    const finalAmount = originalAmount - discountAmount;
    const getLevelName = (id) => levels.find(l => l.id === id)?.level_name || '';

    const handleSubmit = async () => {
        if (!selectedStudent || !selectedPkg) {
            setError('Vui lòng chọn học viên và gói học phí'); return;
        }
        setError(''); setLoading(true);
        try {
            await api.post('/payments', {
                student_id: selectedStudent.id,
                package_id: selectedPkg.id,
                payment_method: paymentMethod,
                note,
                start_date_override: startDateOverride || undefined,
                end_date_override: endDateOverride || undefined
            });
            onSaved();
        } catch (err) { setError(err.response?.data?.message || 'Lỗi'); }
        finally { setLoading(false); }
    };

    const inputCls = "w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tạo hóa đơn học phí</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg"><HiOutlineX size={20} /></button>
                </div>

                <div className="p-6 space-y-5">
                    {error && <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>}

                    {/* Step 1: Select Student (prioritized list) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Bước 1: Chọn học viên</label>
                        {selectedStudent ? (
                            <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl">
                                <div>
                                    <p className="font-semibold text-indigo-700 dark:text-indigo-400">{selectedStudent.full_name}</p>
                                    {discountPercent > 0 && <p className="text-xs text-amber-600 mt-0.5">🎁 Ưu đãi: {discountPercent}%</p>}
                                    {suggestedStart?.is_expired && (
                                        <p className="text-xs text-red-500 mt-0.5">⚠️ Hết hạn từ: {suggestedStart.last_end_date} — Tính tiếp từ {suggestedStart.suggested_start}</p>
                                    )}
                                </div>
                                <button onClick={() => { setSelectedStudent(null); setSuggestedStart(null); }} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                                    <HiOutlineX size={18} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <input type="text" value={searchStudent} onChange={e => setSearchStudent(e.target.value)} placeholder="Tìm học viên..." className={inputCls} />
                                <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                                    {filteredStudents.slice(0, 10).map(s => (
                                        <button key={s.id} onClick={() => selectStudent(s)}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors flex items-center justify-between">
                                            <span className="text-gray-700 dark:text-slate-300">
                                                {s.full_name}
                                                {s.paymentState === 'het_han' && <span className="ml-2 text-xs text-red-500">⚠️ Hết hạn</span>}
                                                {s.paymentState === 'chua_dong' && <span className="ml-2 text-xs text-gray-400">Chưa đóng</span>}
                                            </span>
                                            {s.promotion?.discount_percent > 0 && <span className="text-xs text-amber-500">{s.promotion.discount_percent}%</span>}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Step 2: Select Package */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Bước 2: Chọn gói</label>
                        <select value={selectedPkg?.id || ''} onChange={e => setSelectedPkg(packages.find(p => p.id === Number(e.target.value)) || null)} className={inputCls}>
                            <option value="">— Chọn gói —</option>
                            {packages.map(p => <option key={p.id} value={p.id}>{getLevelName(p.level_id)} — {p.week_duration} tuần — {Number(p.tuition_fee).toLocaleString('vi-VN')} ₫</option>)}
                        </select>
                    </div>

                    {/* Step 3: Auto calculation */}
                    {selectedStudent && selectedPkg && (() => {
                        const totalSessions = selectedPkg.week_duration * (selectedPkg.sessions_per_week || 3);
                        const schedule = selectedStudent.enrollments?.[0]?.class?.schedule_days || '';
                        const liveEndDate = calculateEndDate(startDateOverride || (new Date().toISOString().slice(0, 10)), totalSessions, schedule);

                        return (
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl p-4 space-y-2">
                                <h3 className="font-bold text-indigo-700 dark:text-indigo-400 text-sm">📊 Tính toán Học phí & Lịch học</h3>
                                <div className="flex justify-between text-sm"><span className="text-gray-600 dark:text-slate-400">Niêm yết:</span><span>{Number(originalAmount).toLocaleString('vi-VN')} ₫</span></div>
                                {discountPercent > 0 && <div className="flex justify-between text-sm"><span className="text-amber-600">Ưu đãi ({discountPercent}%):</span><span className="text-amber-600">-{Number(discountAmount).toLocaleString('vi-VN')} ₫</span></div>}
                                <div className="flex justify-between font-bold text-base pt-2 border-t border-indigo-200 dark:border-indigo-500/30">
                                    <span className="text-indigo-700 dark:text-indigo-400">Thực thu:</span>
                                    <span className="text-indigo-700 dark:text-indigo-400 text-lg">{Number(finalAmount).toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-indigo-200 dark:border-indigo-500/30">
                                    <p className="text-sm text-indigo-700 dark:text-indigo-400">
                                        🏫 Tính theo Lịch: <strong>{schedule || 'Cơ bản (3 buổi/tuần)'}</strong>
                                    </p>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
                                        📅 Hết hạn dự kiến: <strong>{endDateOverride || liveEndDate}</strong> <i>(Tổng {totalSessions} buổi)</i>
                                    </p>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Manual date overrides */}
                    {selectedStudent && selectedPkg && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Ngày bắt đầu</label>
                                <input type="date" value={startDateOverride} onChange={e => setStartDateOverride(e.target.value)} className={inputCls + ' text-sm'} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Ngày kết thúc (tự động)</label>
                                <input type="date" value={endDateOverride} onChange={e => setEndDateOverride(e.target.value)} className={inputCls + ' text-sm'} placeholder="Tự động tính" />
                            </div>
                        </div>
                    )}

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Phương thức</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[{ val: 'tien_mat', label: '💵 Tiền mặt' }, { val: 'chuyen_khoan', label: '🏦 CK' }, { val: 'vietqr', label: '📱 QR' }].map(m => (
                                <button key={m.val} type="button" onClick={() => setPaymentMethod(m.val)}
                                    className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${paymentMethod === m.val ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-gray-50 dark:bg-slate-800/50 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700/50'}`}>
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Ghi chú</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className={inputCls} />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Hủy</button>
                        <button onClick={handleSubmit} disabled={loading || !selectedStudent || !selectedPkg}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50">
                            {loading ? 'Đang xử lý...' : '💳 Xác nhận'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;
