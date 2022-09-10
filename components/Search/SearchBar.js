import { View, StyleSheet, Dimensions, ScrollView, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { EvilIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from "react-redux";
import CitySelect from './CitySelect';
import { getAllCategories, getCatgories, getCities, getCurrentCity, loadCategory, loadPopularService, loadSubCategoryContent, updateActiveSubCategory, updateCategory, updateCountry, updateMainCategory } from '../../reducers/categoryReducer';
import { hideLoading, showLoading } from '../../reducers/appReducer';
import HeaderTitle from '../ui/HeaderTitle';
import _ from 'lodash';
import { useNavigation, StackActions } from "@react-navigation/native";


const SearchBar = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const cities = useSelector(getCities);
    const currentCity = useSelector(getCurrentCity);
    const category = useSelector(getCatgories);
    const allCategory = useSelector(getAllCategories);

    const options = !allCategory ? [] : allCategory.map((x, index) => ({ index, title: x.label }));

    const [getInput, setInput] = useState("");
    const [getSearchInput, setSearchInput] = useState("");

    const [getList, setList] = useState(options);

    const setInputData = (data) => {

        setInput(data);

        search(data?.trim());
    }

    const search = React.useCallback(
        _.debounce(value => {
            console.log('Debounced Event:', value);

            let val = value?.toLowerCase();

            const filter = options?.filter((item) => {
                return item?.title?.toLowerCase()?.includes(val);
            }).map((x, ind) => { // mapping to split and insert string as array into object

                if (value) { // do filteration only if search text exist
                    return {
                        ...x,
                        data: x?.title?.split(new RegExp(`(${value})`, 'gi'))
                    }
                }

                return x;
            })


            console.log("return ", filter);

            setList(filter);
            setSearchInput(value);

        }, 600),
        []);

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
                // navigation.navigate('BookingFlow');
                navigation.dispatch(StackActions.replace('BookingFlow'))
            } else {
                await dispatch(showLoading());

                const mainCategoryId = category.find(category => category.id === item.id)?.mainCategory;

                if(mainCategoryId) {
                    await dispatch(updateMainCategory(mainCategoryId));
                    await dispatch(updateCategory(item.id));
                } else {
                    navigation.dispatch(StackActions.replace('GetgenieCategories'))
                }

                await dispatch(hideLoading());
                // navigation.navigate('GetgenieCategories');
                navigation.dispatch(StackActions.replace('GetgenieCategories'))
            }
        }
    }


    useEffect(() => {
        try {
            const input = getInput?.replace(/\s/g, '');

            if (getList?.length === 0 && input.length === 0) {

                console.log("options ", options)
                setList(options);
            }

        } catch (error) {
            console.log("try catch error ", error)
        }


    }, [getInput])


    return (
        <View style={{ flex: 1 }}>

            <HeaderTitle title='Search' />

            <View style={[styles.searchWrapper]}>
                <View style={[styles.input]}>

                    <TextInput
                        value={getInput}
                        onChangeText={setInputData}
                        placeholder={"SEARCH FOR ANY SERVICE"}
                        autoCorrect={false}
                        autoCapitalize="none"
                        style={{
                            paddingHorizontal: 18,
                            height: 40,
                            width: "100%",
                            fontSize: wp('3%'),
                            fontFamily: 'PoppinsM',
                            color: '#bababa',
                            paddingVertical: 0,
                            backgroundColor: "transparent",
                        }}
                    />

                    <EvilIcons style={[styles.searchIcon]} name="search" size={24} color="#2eb0e4" />

                </View>

                <FlatList
                    data={getList}
                    keyExtractor={(item, index) => {
                        return item.index;
                    }}
                    extraData={getList}
                    style={{
                        // height: '100%',
                        marginHorizontal: -20
                    }}
                    renderItem={({ item, index }) => (
                        <View style={{
                            marginTop: (index == 0 ? 15 : 0),
                            marginBottom: (getList?.length - 1 === index ? 180 : 0)
                        }}>
                            <TouchableOpacity onPress={() => { onCategorySelect(item) }}>
                                <Text numberOfLines={1} lineBreakMode={"tail"} style={styles.labels}>
                                    {item?.data ? item?.data?.map((x, ind) => {
                                        return <Text style={
                                            x.toLowerCase() === getSearchInput?.toLowerCase() ? { color: "#2eb0e4", fontFamily: "PoppinsBO" } : styles.labels
                                        }>
                                            {x}
                                        </Text>
                                    }) : item?.title}
                                    {/* {item?.title} */}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ItemSeparatorComponent={() => {
                        return <View style={{ flex: 1, backgroundColor: '#bababa', height: 1, marginHorizontal: 20 }} />
                    }}
                    ListEmptyComponent={() => {
                        return <View style={{flex: 1, alignContent: "center"}}>
                            <Text style={[styles.labels, { fontFamily: "PoppinsBO", textAlign: 'center' }]}>
                                Sorry, no matching results
                            </Text>
                        </View>
                    }}
                />
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    searchWrapper: {
        display: 'flex',
        // width: '75%',
        padding: 20,
    },
    searchIcon: {
        position: 'absolute',
        right: 8,
        paddingVertical: 8
    },
    labels: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontFamily: 'PoppinsR',
        fontSize: wp('3.4%'),
        paddingHorizontal: 25
    },
    input: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 20
    },
})

export default SearchBar;