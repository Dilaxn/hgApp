import { View, Image, Pressable, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import css from '../commonCss';
import Text from '../MyText';
import { AntDesign } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import ChangeScreenRequest from '../Modals/ChangeScreenRequest';
import { getActiveCategoryId, getActiveSubCategoryId, getCatgories, getSubCategoryList } from '../../reducers/categoryReducer';
import { useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const BookingHeader = ({
    onCategoryChange,
    onSubCategoryChange,
    navigation,
    onChange = () => null
}) => {

    const activeCategoryId = useSelector(getActiveCategoryId);
    const activeSubCategoryId = useSelector(getActiveSubCategoryId);

    const categoryOptions = useSelector(getCatgories);
    const subCategoryOptions = useSelector(getSubCategoryList);

    const [openCategory, setOpenCategory] = useState(false);
    const [categoryItems, setCategoryItems] = useState(categoryOptions || null);

    const [openSubCategory, setOpenSubCategory] = useState(false);
    const [subCategoryItems, setSubCategoryItems] = useState(subCategoryOptions || null);
    const [isChangeScreenRequestModal, setIsChangeScreenRequestModal] = useState(false);

    const activeCategory = !!categoryOptions ? categoryOptions.find(item => item.id === activeCategoryId) : null;
    const [backItem, setBackItem] = useState(null);

    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [currentSubCategoryId, setCurrentSubCategoryId] = useState(null);

    useEffect(() => {
        setCurrentCategoryId(activeCategoryId);
        setCurrentSubCategoryId(activeSubCategoryId);
    }, [activeCategoryId, activeSubCategoryId]);

    const onCancel = () => {
        setIsChangeScreenRequestModal(false);
        if (backItem !== null) {
            if (backItem.type === 'category') {
                onCategoryChange(backItem.item);
                onChange();
            } else {
                onSubCategoryChange(backItem.item);
                onChange();
            }
            onChange();
            setBackItem(null);
            return;
        }
        // navigation.navigate('GetgenieCategories');
        onChange();
        navigation.goBack();
        return;
    }

    const handleChangeScreenRequestModalClose = () => {
        if (backItem !== null) {
            setCurrentCategoryId(activeCategoryId);
            setCurrentSubCategoryId(activeSubCategoryId);
            setBackItem(null);
        }
        setIsChangeScreenRequestModal(false);
    };

    const handleCategoryChange = (item) => {
        setIsChangeScreenRequestModal(true);
        setBackItem({
            type: 'category',
            item
        })
    }

    const handleSubCategoryChange = (item) => {
        setIsChangeScreenRequestModal(true);
        setBackItem({
            type: 'subcategory',
            item
        })
    }

    return (
        <View style={[css.section]}>
            <View style={[css.container, css.liteBlueBG]}>
                <View style={[css.flexDRSB]}>
                    <View style={{ width: '10%' }}>
                        {activeCategory !== null && <Image style={{ width: 40, height: 40, justifyContent: 'center' }} source={{ uri: activeCategory.imageUrl }} />}
                    </View>
                    <View
                        style={{
                            width: '75%',
                            flexDirection: 'column'
                        }}>
                        {categoryOptions !== null &&
                            <DropDownPicker
                                open={openCategory}
                                value={currentCategoryId}
                                items={categoryItems}
                                setOpen={(val) => { setOpenSubCategory(false); setOpenCategory(val); }}
                                setItems={setCategoryItems}
                                onSelectItem={handleCategoryChange}
                                zIndex={3000}
                                zIndexInverse={1000}
                                style={[{
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    borderColor: '#ccc',
                                    backgroundColor: 'transparent',
                                }]}
                                textStyle={{
                                    fontSize: wp('3.9%'),
                                    color: '#525252',
                                    fontFamily: 'PoppinsR',
                                    marginTop: 10
                                }}
                                containerStyle={{ height: 30, alignItems: 'center', justifyContent: 'flex-end' }}
                                showArrowIcon={false}
                                dropDownContainerStyle={[{
                                    backgroundColor: "#fff",
                                    zIndex: 11111,
                                    elevation: Platform.OS === 'android' ? 10 : 0,
                                    position: 'absolute',
                                    borderRadius: 10,
                                    borderColor: '#ccc',
                                }]}
                                listMode='MODAL'
                                setValue={setCurrentCategoryId}
                            />
                        }
                        <Pressable style={[css.BGbrand, css.borderRadius50, css.justifyContentC, css.alignItemsC, { position: 'absolute', top: 0, right: 0, width: 80, height: 25 }]}><Text style={[css.whiteC]}>Change</Text></Pressable>
                        <Pressable onPress={() => setIsChangeScreenRequestModal(true)}>
                            <Text style={[css.textRight, css.brandC, css.fr, css.f11, { paddingTop: 3, marginRight: 5 }]}>Can't find? Search here</Text>
                        </Pressable>
                    </View>
                    <Pressable
                        onPress={() => setIsChangeScreenRequestModal(true)}
                        style={[{ marginVertical: 10 }]}
                    >
                        <AntDesign
                            name="close"
                            size={24}
                            color="#bababa"
                        />
                    </Pressable>
                </View>
                <View style={{ zIndex: 11111, elevation: 10 }}>
                    {subCategoryItems !== null &&
                        <DropDownPicker
                            open={openSubCategory}
                            value={currentSubCategoryId}
                            items={subCategoryOptions}
                            setOpen={(val) => { setOpenCategory(false); setOpenSubCategory(val); }}
                            setItems={setSubCategoryItems}
                            onSelectItem={handleSubCategoryChange}
                            zIndex={1000}
                            zIndexInverse={3000}
                            style={[css.boxShadow, css.whiteBG, {
                                //height: 50,
                                marginTop: 10,
                                borderWidth: 0,
                                elevation: 10,
                                zIndex: 1,
                            }]}
                            textStyle={{
                                fontSize: wp('3.9%'),
                                color: '#2eb0e4',
                                fontFamily: 'PoppinsM',
                            }}
                            dropDownContainerStyle={[css.borderRadius10, css.whiteBG, {
                                position: 'absolute',
                                borderColor: '#ccc',
                                borderWidth: 0,
                                elevation: 10,
                                zIndex: 111111
                            }]}
                            listMode='MODAL'
                            setValue={setCurrentSubCategoryId}
                        />
                    }
                </View>
            </View>
            <ChangeScreenRequest isVisible={isChangeScreenRequestModal} onClose={handleChangeScreenRequestModalClose} navigation={navigation} onCancel={onCancel} />
        </View>
    );
}
export default BookingHeader;