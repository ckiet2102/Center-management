import { useEffect, useState } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineUserGroup, HiOutlineBookOpen, HiOutlineAcademicCap, HiOutlineCash, HiOutlineStar } from 'react-icons/hi';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const StatCard = ({ icon: Icon, label, value, gradient }) => (
    <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-gray-300 dark:hover:border-slate-600/50 transition-all duration-300 group shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="text-white" size={24} />
            </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value ?? '...'}</p>
        <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
    </div>
);

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState(null);
    const [loading, setLoading] = useState(true);
    const { darkMode } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, chartsRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/dashboard/charts')
                ]);
                setStats(statsRes.data);
                setCharts(chartsRes.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    const formatShortCurrency = (value) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value;
    };

    const textColor = darkMode ? '#94a3b8' : '#64748b';
    const gridColor = darkMode ? '#334155' : '#e2e8f0';
    const tooltipBg = darkMode ? '#1e293b' : '#ffffff';
    const tooltipBorder = darkMode ? '#475569' : '#e2e8f0';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Tổng quan hoạt động trung tâm</p>
            </div>

            {/* Stats Grid - 4 cards + 1 seniority card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={HiOutlineUserGroup} label="Tổng học viên" value={stats?.totalStudents} gradient="bg-gradient-to-br from-blue-500 to-cyan-500" />
                <StatCard icon={HiOutlineBookOpen} label="Lớp đang hoạt động" value={stats?.activeClasses} gradient="bg-gradient-to-br from-emerald-500 to-teal-500" />
                <StatCard icon={HiOutlineCash} label="Tổng doanh thu" value={stats ? formatCurrency(stats.totalRevenue) : '...'} gradient="bg-gradient-to-br from-amber-500 to-orange-500" />
                <StatCard icon={HiOutlineStar} label="HV đủ điều kiện thâm niên" value={stats?.seniorityEligible} gradient="bg-gradient-to-br from-violet-500 to-purple-500" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart - Revenue by Month */}
                <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Doanh thu theo tháng</h2>
                    <div className="h-72">
                        {charts?.revenueByMonth?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={charts.revenueByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} tickLine={false} />
                                    <YAxis tick={{ fill: textColor, fontSize: 12 }} tickFormatter={formatShortCurrency} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px', color: darkMode ? '#e2e8f0' : '#1e293b' }}
                                        formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                                    />
                                    <Bar dataKey="revenue" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 dark:text-slate-500">
                                {loading ? 'Đang tải...' : 'Chưa có dữ liệu doanh thu'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Area Chart - Student Registrations */}
                <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 Xu hướng đăng ký học viên</h2>
                    <div className="h-72">
                        {charts?.studentsByMonth?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={charts.studentsByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} tickLine={false} />
                                    <YAxis tick={{ fill: textColor, fontSize: 12 }} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px', color: darkMode ? '#e2e8f0' : '#1e293b' }}
                                        formatter={(value) => [value, 'Học viên']}
                                    />
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2.5} fill="url(#areaGradient)" dot={{ r: 4, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 dark:text-slate-500">
                                {loading ? 'Đang tải...' : 'Chưa có dữ liệu đăng ký'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie Chart - Students by Promotion */}
                <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Tỷ lệ HV theo ưu đãi</h2>
                    <div className="h-72">
                        {charts?.studentsByPromotion?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.studentsByPromotion}
                                        cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={90}
                                        dataKey="count" nameKey="name"
                                        paddingAngle={3}
                                        label={({ name, count }) => `${name}: ${count}`}
                                    >
                                        {charts.studentsByPromotion.map((entry, i) => (
                                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '12px', color: darkMode ? '#e2e8f0' : '#1e293b' }} />
                                    <Legend iconType="circle" formatter={(value) => <span style={{ color: textColor, fontSize: '13px' }}>{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 dark:text-slate-500">
                                {loading ? 'Đang tải...' : 'Chưa có dữ liệu'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Students Table */}
                <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">👥 Học viên mới nhất</h2>
                    {stats?.recentStudents && stats.recentStudents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full data-table">
                                <thead>
                                    <tr>
                                        <th>Mã HV</th>
                                        <th>Họ tên</th>
                                        <th>Ngày tham gia</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentStudents.map((student) => (
                                        <tr key={student.id}>
                                            <td className="font-mono text-indigo-600 dark:text-indigo-400">#{student.id}</td>
                                            <td className="font-medium text-gray-900 dark:text-white">{student.full_name}</td>
                                            <td>{student.join_date}</td>
                                            <td>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${student.learning_status === 'dang_hoc' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' :
                                                        student.learning_status === 'bao_luu' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' :
                                                            'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                                                    }`}>
                                                    {student.learning_status === 'dang_hoc' ? 'Đang học' :
                                                        student.learning_status === 'bao_luu' ? 'Bảo lưu' : 'Đã nghỉ'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-400 dark:text-slate-400 text-center py-8">
                            {loading ? 'Đang tải...' : 'Chưa có dữ liệu'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
