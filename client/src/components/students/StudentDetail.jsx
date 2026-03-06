import { HiOutlineX } from 'react-icons/hi';

const StudentDetail = ({ student, onClose }) => {
    if (!student) return null;

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount || 0) + ' đ';

    const getStatusBadge = (status) => {
        const map = {
            dang_hoc: { label: 'Đang học', cls: 'bg-emerald-500/15 text-emerald-400' },
            bao_luu: { label: 'Bảo lưu', cls: 'bg-amber-500/15 text-amber-400' },
            da_nghi: { label: 'Đã nghỉ', cls: 'bg-red-500/15 text-red-400' }
        };
        const info = map[status] || { label: status, cls: 'bg-slate-500/15 text-slate-400' };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${info.cls}`}>{info.label}</span>;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">{student.full_name}</h2>
                        <p className="text-indigo-400 text-sm font-mono">Mã HV: #{student.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <HiOutlineX size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <InfoItem label="Ngày sinh" value={student.dob || '—'} />
                        <InfoItem label="Giới tính" value={student.gender === 'Nam' ? 'Nam' : student.gender === 'Nu' ? 'Nữ' : 'Khác'} />
                        <InfoItem label="SĐT" value={student.phone || '—'} />
                        <InfoItem label="SĐT Phụ huynh" value={student.parent_phone || '—'} />
                        <InfoItem label="Email" value={student.email || '—'} />
                        <InfoItem label="Ngày tham gia" value={student.join_date || '—'} />
                        <InfoItem label="Trạng thái" value={getStatusBadge(student.learning_status)} />
                        <InfoItem label="Ưu đãi" value={student.promotion ? `${student.promotion.name} (${student.promotion.discount_percent}%)` : 'Không có'} />
                        <div className="col-span-2 md:col-span-1">
                            <InfoItem label="Địa chỉ" value={student.address || '—'} />
                        </div>
                    </div>

                    {/* Enrollments */}
                    {student.enrollments && student.enrollments.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Lịch sử Ghi danh</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full data-table">
                                    <thead>
                                        <tr>
                                            <th>Lớp</th>
                                            <th>Ngày ĐK</th>
                                            <th>Ngày KT</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.enrollments.map((e) => (
                                            <tr key={e.id}>
                                                <td className="text-white">{e.class?.class_name || '—'}</td>
                                                <td>{e.registration_date || '—'}</td>
                                                <td>{e.end_study_date || '—'}</td>
                                                <td>
                                                    <span className="px-2 py-0.5 rounded-full text-xs bg-slate-700/50 text-slate-300">
                                                        {e.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Payments */}
                    {student.payments && student.payments.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Lịch sử Thanh toán</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full data-table">
                                    <thead>
                                        <tr>
                                            <th>Ngày</th>
                                            <th>Gốc</th>
                                            <th>Giảm</th>
                                            <th>Thực thu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.payments.map((p) => (
                                            <tr key={p.id}>
                                                <td>{p.payment_date ? new Date(p.payment_date).toLocaleDateString('vi-VN') : '—'}</td>
                                                <td>{formatCurrency(p.original_amount)}</td>
                                                <td className="text-amber-400">{p.discount_amount > 0 ? formatCurrency(p.discount_amount) : '—'}</td>
                                                <td className="text-emerald-400 font-semibold">{formatCurrency(p.final_amount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-sm text-slate-200">{typeof value === 'string' ? value : value}</p>
    </div>
);

export default StudentDetail;
