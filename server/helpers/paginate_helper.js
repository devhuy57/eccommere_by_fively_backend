let paginateHelper = async (req, model, condiction = {}, populate = {}) => {
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.pageSize)

    let startIndex = (page - 1) * limit
    let endIndex = page * limit

    let totalPage = Math.ceil((await model.countDocuments(condiction)) / limit);

    if (page > 0 && limit > 0) {
        items = await model
            .find(condiction)
            .select(['-__v', '-logical_delete'])
            .populate(populate)
            .skip(startIndex)
            .limit(endIndex)

        if (items.length <= 0) return false;
        result = {
            totalPage: totalPage,
            page: page,
            pageSize: limit,
            items: items
        }
    } else {
        result = {
            data: await model.find({})
        }
    }

    return result
}

module.exports = paginateHelper