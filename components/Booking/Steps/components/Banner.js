import { View, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import css from '../../../commonCss';
import Text from '../../../MyText';
import { FontAwesome } from '@expo/vector-icons';
import RatingModal from "../../../Modals/RatingModal";
import { getSubCategoryContent } from '../../../../reducers/categoryReducer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import BackArrow from '../../../ui/BackArrow';
const imgPath = '../../../../assets/icons/';

const Banner = ({ image, back = null, activeStep }) => {
    const [isRatingModal, setIsRatingModal] = useState(false);
    const subCategoryContent = useSelector(getSubCategoryContent);

    if (subCategoryContent == null) {
        return <View></View>
    }
    const { averageRating, totalCount } = subCategoryContent.categoryRating;
    const { categoryRating, subCategoryName, content } = subCategoryContent;

    return (
        <>
            <View>
                <Image
                    style={[styles.bannerImage]}
                    source={{ uri: subCategoryContent.image }}
                />
                <Pressable
                    style={[styles.ratingBox]}
                    onPress={() => { setIsRatingModal(true) }}
                >
                    <View style={[styles.ratingHeader]}>
                        <View style={[css.flexDR]}>
                            <Text style={[css.whiteC, css.fr, css.f10]}>{averageRating ? averageRating : 4.3}</Text>
                            <View style={[css.alignSelfC, css.marginL5]}>
                                <FontAwesome name="star" size={10} color="#f6ad00" />
                            </View>
                        </View>
                    </View>
                    <View style={[css.flexDC, css.centeredView, css.padding5]}>
                        <Text style={[css.f10, css.fr, css.blackC, { lineHeight: 15 }]}>{totalCount ? totalCount : '589'}</Text>
                        <Text style={[css.fr, css.blackC, , { lineHeight: 15, fontSize: wp('2.2%') }]}>reviews</Text>
                    </View>
                </Pressable>
                {activeStep > 0 &&
                    <BackArrow onPress={() => back()} style={[styles.backButton]} size={18} text={null} />
                }
            </View>
            {isRatingModal && <RatingModal isVisible={true} onClose={() => { setIsRatingModal(false) }} categoryRating={categoryRating} subCategoryName={subCategoryName} content={content} />}
        </>
    );
};

const styles = StyleSheet.create({
    bannerImage: { width: '100%', height: 150, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
    backButton: { position: 'absolute', top: 10, left: 10, borderRadius: 50, width: 30, height: 30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginTop: 0 },
    ratingHeader: { backgroundColor: '#2eb0e4', alignItems: 'center', padding: 3, borderTopLeftRadius: 10, borderTopRightRadius: 10, width: 50 },
    ratingBox: { ...css.boxShadow, position: 'absolute', top: 10, right: 10, borderRadius: 10, backgroundColor: 'white' }
});

export default Banner;
