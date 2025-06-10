const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.findAll = async () => {
    return await prisma.products.findMany({
        select: { name: true }
    });
};

exports.findYears = async () => {
    const years = await prisma.agricultural_stats.findMany({
        distinct: ['year'],
        select: { year: true },
        orderBy: { year: 'asc' }
    });
    return years.map(y => y.year);
};