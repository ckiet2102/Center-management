const { Student, Class: ClassModel, Teacher, Payment, Promotion } = require('../models');
const sequelize = require('../config/db_config');
const { Op, fn, col, literal } = require('sequelize');

const getStats = async (req, res) => {
    try {
        const totalStudents = await Student.count({ where: { status: 1 } });
        const activeClasses = await ClassModel.count({ where: { status: 1 } });
        const totalTeachers = await Teacher.count();

        const revenueResult = await sequelize.query(
            'SELECT COALESCE(SUM(final_amount), 0) as total_revenue FROM payments',
            { type: sequelize.QueryTypes.SELECT }
        );
        const totalRevenue = revenueResult[0].total_revenue;

        // Students eligible for seniority promotion (>= 12 months)
        const seniorityEligible = await Student.count({
            where: {
                status: 1,
                join_date: { [Op.lte]: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
            }
        });

        const recentStudents = await Student.findAll({
            order: [['id', 'DESC']],
            limit: 5,
            attributes: ['id', 'full_name', 'join_date', 'learning_status']
        });

        res.json({
            totalStudents,
            activeClasses,
            totalTeachers,
            totalRevenue,
            seniorityEligible,
            recentStudents
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const getChartData = async (req, res) => {
    try {
        // Revenue by month (last 12 months)
        const revenueByMonth = await sequelize.query(`
      SELECT 
        DATE_FORMAT(payment_date, '%Y-%m') as month,
        SUM(final_amount) as revenue
      FROM payments 
      WHERE payment_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
      ORDER BY month ASC
    `, { type: sequelize.QueryTypes.SELECT });

        // Student registrations by month (last 12 months)
        const studentsByMonth = await sequelize.query(`
      SELECT 
        DATE_FORMAT(join_date, '%Y-%m') as month,
        COUNT(*) as count
      FROM students
      WHERE join_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(join_date, '%Y-%m')
      ORDER BY month ASC
    `, { type: sequelize.QueryTypes.SELECT });

        // Students by promotion type
        const studentsByPromotion = await sequelize.query(`
      SELECT 
        COALESCE(p.name, 'Không có ưu đãi') as name,
        COUNT(s.id) as count
      FROM students s
      LEFT JOIN promotions p ON s.promotion_id = p.id
      WHERE s.status = 1
      GROUP BY COALESCE(p.name, 'Không có ưu đãi')
      ORDER BY count DESC
    `, { type: sequelize.QueryTypes.SELECT });

        res.json({
            revenueByMonth,
            studentsByMonth,
            studentsByPromotion
        });
    } catch (error) {
        console.error('Get chart data error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

module.exports = { getStats, getChartData };
