



export const getSort = (sort) => {
    if (sort === 'price-ASC') {
        return { price: 1 }; // 1 for ascending order
    }
    if (sort === 'price-DESC') {
        return { price: -1 }; // -1 for descending order
    }
    return {};
};


export const getFilter = (filter) => {
    if (filter) {
        const regexFilter = new RegExp(filter, 'i');
        return {
            $or: [
                { name: { $regex: regexFilter, $options: 'i' } },
                { description: { $regex: regexFilter, $options: 'i' } },
            ],
        };
    }
    return null;

}




export const getPriceRange = (rangePrice) => {
    if (rangePrice) {
        const ranges = rangePrice.split('-');
        return {
            price: {
                $gte: parseFloat(ranges[0]),
                $lte: parseFloat(ranges[1]),
            },
        };
    }
    return null;
}