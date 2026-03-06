import { useState } from 'react';
import api from '../../services/api';
import { HiOutlineKey, HiOutlineDatabase, HiOutlineDownload, HiOutlineClipboardCopy, HiOutlineTrash } from 'react-icons/hi';

const SystemAdminPage = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [newKeyName, setNewKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState('');
    const [backupLoading, setBackupLoading] = useState(false);
    const [keyLoading, setKeyLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleGenerateKey = async () => {
        if (!newKeyName.trim()) return;
        setKeyLoading(true);
        try {
            const res = await api.post('/admin/api-keys', { name: newKeyName });
            setGeneratedKey(res.data.apiKey);
            setApiKeys(prev => [...prev, { name: newKeyName, key: res.data.apiKey, created: new Date().toLocaleString('vi-VN') }]);
            setNewKeyName('');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Lỗi tạo API Key');
        } finally {
            setKeyLoading(false);
        }
    };

    const handleBackup = async () => {
        setBackupLoading(true);
        setMessage('');
        try {
            const res = await api.get('/admin/backup', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/json' }));
            const link = document.createElement('a');
            link.href = url;
            const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
            link.setAttribute('download', `engbreak_backup_${timestamp}.json`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setMessage('✅ Backup thành công! File JSON đã được tải xuống.');
        } catch (err) {
            setMessage('❌ Lỗi khi backup: ' + (err.response?.data?.message || err.message));
        } finally {
            setBackupLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setMessage('Đã copy API Key vào clipboard!');
        setTimeout(() => setMessage(''), 2000);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản trị hệ thống</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Quản lý API Key và sao lưu dữ liệu</p>
            </div>

            {message && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-indigo-700 dark:text-indigo-400 text-sm">
                    {message}
                </div>
            )}

            {/* Backup Section */}
            <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <HiOutlineDatabase className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Backup dữ liệu</h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Xuất file <strong>.json</strong> sao lưu toàn bộ database</p>
                    </div>
                </div>
                <button
                    onClick={handleBackup}
                    disabled={backupLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                    <HiOutlineDownload size={20} className={backupLoading ? 'animate-bounce' : ''} />
                    {backupLoading ? 'Đang sao lưu...' : 'Tải xuống Backup'}
                </button>
            </div>

            {/* API Key Section */}
            <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <HiOutlineKey className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quản lý API Key</h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Tạo mã token kết nối cho ứng dụng bên ngoài</p>
                    </div>
                </div>

                <div className="flex gap-3 mb-4">
                    <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Tên API Key (VD: Mobile App)"
                        className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                    <button
                        onClick={handleGenerateKey}
                        disabled={keyLoading || !newKeyName.trim()}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50"
                    >
                        {keyLoading ? 'Tạo...' : 'Tạo Key'}
                    </button>
                </div>

                {/* Generated key display */}
                {generatedKey && (
                    <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl">
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-2 font-medium">API Key mới tạo (hãy lưu lại, không thể xem lại):</p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs bg-white dark:bg-slate-800 p-2 rounded-lg font-mono text-gray-900 dark:text-white break-all border border-emerald-200 dark:border-slate-700">
                                {generatedKey}
                            </code>
                            <button onClick={() => copyToClipboard(generatedKey)} className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-lg transition-colors">
                                <HiOutlineClipboardCopy size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Key list */}
                {apiKeys.length > 0 && (
                    <div className="space-y-2">
                        {apiKeys.map((key, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/30 rounded-xl">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{key.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">Tạo lúc: {key.created}</p>
                                </div>
                                <code className="text-xs text-gray-500 dark:text-slate-500 font-mono">{key.key.substring(0, 12)}...</code>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemAdminPage;
