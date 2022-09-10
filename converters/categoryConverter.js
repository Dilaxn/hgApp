import moment from "moment";

const CategoryConverter = {
    convertCategory: (data) => {
        const mainCategory = data.map(item => ({ name: item.categoryName, slug: item.category }) );
        const category = data.flatMap(({ categoryIds, category }) => [...mapCategory(category, categoryIds)]);
        category.push({
            id: '614ed53e25da458f4ceeaa07',
            label: 'Specialised Services',
            value: '614ed53e25da458f4ceeaa07',
            imageUrl: 'https://iesoft.nyc3.cdn.digitaloceanspaces.com/homegenie/original_RQqEzU0614ed53e25da458f4ceeaa07.png',
            mainCategory: 'dailyutilities, lifestyledecor, healthandwellness, others',
        });
        return { mainCategory, category };
    },
    convertAllCategory: (data) => {
        return data.flatMap(({ _id, name, subcategories }) => [
            {
                label: name,
                type: 'category',
                id: _id
            },
            ...mapSubCategory(_id, subcategories)
        ]);
    },
    convertSubCategory: (data) => {
        return data.flatMap(({ _id, subcategories }) => mapSubCategoryExtra(_id, subcategories));
    },
    convertHolidays: (data) => {
        const currentMonthYear = moment().format('YYYY-MM');
        const holidays = data
            .filter(item => item.active && item.day.indexOf(currentMonthYear) !== -1)
            .map(item => moment(item.day).format('YYYY-MM-DD'));
        return holidays;
    }
};

const mapCategory = (mainCategory, subCategories) => {
    return subCategories.map(item => ({
        id: item._id,
        label: item.name,
        value: item._id,
        imageUrl: item.imageURL.original,
        mainCategory
    }));
};

const mapSubCategory = (categoryId, subCategories) => {
    return subCategories.map(({ subCategoryName, _id, url }) => ({
        label: subCategoryName,
        type: 'subcategory',
        id: _id,
        categoryId,
        url
    }));
}

const mapSubCategoryExtra = (categoryId, subCategories) => {
    return subCategories.map(({ subCategoryName, _id, image, url }) => ({
        label: subCategoryName,
        id: _id,
        value: _id,
        categoryId,
        image,
        url
    }));
}

export default CategoryConverter;