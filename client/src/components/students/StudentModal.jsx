import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlineX } from 'react-icons/hi';

const StudentModal = ({ student, onClose, onSaved }) => {
    const [form, setForm] = useState({
        full_name: '', dob: '', gender: 'Nam', phone: '', parent_phone: '',
        email: '', address: '', note: '', join_date: new Date().toISOString().split('T')[0],
        learning_status: 'dang_hoc', promotion_id: ''
    });
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (student) {
            setForm({
                full_name: student.full_name || '', dob: student.dob || '', gender: student.gender || 'Nam',
                phone: student.phone || '', parent_phone: student.parent_phone || '', email: student.email || '',
                address: student.address || '', note: student.note || '', join_date: student.join_date || '',
                learning_status: student.learning_status || 'dang_hoc', promotion_id: student.promotion_id || ''
            });
        }
        fetchPromotions();
    }, [student]);

    const fetchPromotions = async () => { try { const res = await api.get('/promotions'); setPromotions(res.data); } catch { } };

    const handleChange = (e) => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            const data = { ...form, promotion_id: form.promotion_id || null };
            if (student) { await api.put(`/students/${student.id}`, data); } else { await api.post('/students', data); }
            onSaved();
        } catch (err) { setError(err.response?.data?.message || 'Đã xảy ra lỗi'); } finally { setLoading(false); }
    };

    const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{student ? 'Sửa học viên' : 'Thêm học viên mới'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                        <HiOutlineX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Họ tên *</label>
                            <input name="full_name" value={form.full_name} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Ngày sinh</label>
                            <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Giới tính</label>
                            <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                                <option value="Nam">Nam</option><option value="Nu">Nữ</option><option value="Khac">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Số điện thoại</label>
                            <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">SĐT Phụ huynh</label>
                            <input name="parent_phone" value={form.parent_phone} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Ngày tham gia</label>
                            <input type="date" name="join_date" value={form.join_date} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Trạng thái</label>
                            <select name="learning_status" value={form.learning_status} onChange={handleChange} className={inputClass}>
                                <option value="dang_hoc">Đang học</option><option value="bao_luu">Bảo lưu</option><option value="da_nghi">Đã nghỉ</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Ưu đãi</label>
                            <select name="promotion_id" value={form.promotion_id} onChange={handleChange} className={inputClass}>
                                <option value="">Không có ưu đãi</option>
                                {promotions.map(p => <option key={p.id} value={p.id}>{p.name} ({p.discount_percent}%)</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Địa chỉ</label>
                            <input name="address" value={form.address} onChange={handleChange} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Ghi chú</label>
                            <textarea name="note" value={form.note} onChange={handleChange} rows="2" className={`${inputClass} resize-none`} />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Hủy</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50">
                            {loading ? 'Đang lưu...' : (student ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentModal;
