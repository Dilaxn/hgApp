import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
// import css from '../commonCss';
import CitySelect from './CitySelect';
import Search from './Search';
import { getAllCategories, getCatgories, getCities, getCurrentCity, loadCategory, loadPopularService, loadSubCategoryContent, updateActiveSubCategory, updateCategory, updateCountry, updateMainCategory } from '../../reducers/categoryReducer';
import { hideLoading, showLoading } from '../../reducers/appReducer';


const SearchToolBar = ({ navigation }) => {
    const dispatch = useDispatch();
    const cities = useSelector(getCities);
    const currentCity = useSelector(getCurrentCity);
    const category = useSelector(getCatgories);
    const allCategory = useSelector(getAllCategories);
    
    const options = !allCategory ? [] : allCategory.map((x, index) => ({ index, title: x.label })); 

    const onCitySelect = async (city) => {
        await dispatch(updateCountry(city));
        dispatch(loadCategory());
        dispatch(loadPopularService());
    };

    const onCategorySelect = async (val) => {
        if (!val) {
            return;
        }
        const item = allCategory[val.index];
        if (item) {
            if (item.type === 'subcategory') {
                await dispatch(showLoading());

                await updateCategory(item.categoryId)
                await dispatch(updateActiveSubCategory(item.id));
                await dispatch(loadSubCategoryContent(item.url));

                await dispatch(hideLoading());
                navigation.navigate('BookingFlow');
            } else {
                await dispatch(showLoading());

                const mainCategoryId = category.find(category => category.id === item.id).mainCategory;
                await dispatch(updateMainCategory(mainCategoryId));
                await dispatch(updateCategory(item.id));

                await dispatch(hideLoading());
                navigation.navigate('GetgenieCategories');
            }
        }
    }

    return (
        <View style={[styles.searchToolBar]}>
            <View style={[styles.searchToolBarWrapper]}>
                <CitySelect cities={cities} currentCity={currentCity} onChange={onCitySelect} />
                <Search items={options} onSelect={onCategorySelect} />
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    searchToolBarWrapper: {
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 40,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 5
    }
})

export default SearchToolBar;
