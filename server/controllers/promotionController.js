const { Promotion, Student } = require('../models');
const sequelize = require('../config/db_config');
const { Op } = require('sequelize');

const getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.findAll({ order: [['id', 'ASC']] });
        res.json(promotions);
    } catch (error) {
        console.error('Get promotions error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

/**
 * Update seniority promotions - NON-CUMULATIVE, tiered logic:
 * 
 * Priority (highest wins):
 * 1. join_date > 24 months → seniority_2y (10%)
 * 2. join_date > 12 months OR family → seniority_1y / family (5%)
 * 3. Both family + >12 months = still 5% (no stacking)
 * 4. Only when >24 months does it upgrade to 10%
 * 
 * Special promotions (100% scholarship etc.) are NOT touched.
 */
const updateSeniority = async (req, res) => {
    try {
        // First try the stored procedure
        try {
            await sequelize.query('CALL UpdateStudentPromotionsBasedOnSeniority()');
        } catch (spError) {
            console.log('Stored procedure not available, using Node.js fallback logic');
        }

        // Node.js fallback / additional logic for tiered non-cumulative rules
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());

        // Get promotion IDs by condition_type
        const allPromos = await Promotion.findAll({ raw: true });
        const promo2y = allPromos.find(p => p.condition_type === 'seniority_2y');
        const promo1y = allPromos.find(p => p.condition_type === 'seniority_1y');
        const promoSpecial = allPromos.find(p => p.condition_type === 'special');

        let updated2y = 0;
        let updated1y = 0;

        // 1) Students with > 24 months → assign seniority_2y (10%)
        // Excludes those with 'special' promotion (e.g. 100% scholarship)
        if (promo2y) {
            const excludeIds = promoSpecial ? [promoSpecial.id] : [];
            const where2y = {
                status: 1,
                join_date: { [Op.lte]: twoYearsAgo },
                promotion_id: { [Op.or]: [{ [Op.ne]: promo2y.id }, { [Op.is]: null }] }
            };
            if (excludeIds.length > 0) {
                where2y.promotion_id = { [Op.notIn]: [...excludeIds, promo2y.id] };
            }

            const [result2y] = await Student.update(
                { promotion_id: promo2y.id },
                { where: where2y }
            );
            updated2y = result2y;
        }

        // 2) Students with > 12 months (but NOT > 24 months, those already got 10%) → assign seniority_1y (5%)
        // This also covers "family" students who reach 12 months — they stay at 5%
        if (promo1y) {
            const excludeIds = [promo2y?.id, promoSpecial?.id].filter(Boolean);
            const where1y = {
                status: 1,
                join_date: { [Op.lte]: oneYearAgo, [Op.gt]: twoYearsAgo },
                promotion_id: { [Op.or]: [{ [Op.is]: null }] }
            };
            if (excludeIds.length > 0) {
                where1y.promotion_id = { [Op.notIn]: excludeIds };
            }

            const [result1y] = await Student.update(
                { promotion_id: promo1y.id },
                { where: where1y }
            );
            updated1y = result1y;
        }

        res.json({
            message: `Đã cập nhật ưu đãi thâm niên: ${updated2y} HV lên 10% (>2 năm), ${updated1y} HV lên 5% (>1 năm). Lưu ý: Ưu đãi không cộng dồn.`,
            updated2y,
            updated1y
        });
    } catch (error) {
        console.error('Update seniority error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống khi cập nhật ưu đãi thâm niên' });
    }
};

module.exports = { getAllPromotions, updateSeniority };
