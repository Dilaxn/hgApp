import React, { useState, useCallback } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Linking,
    TouchableOpacity,
    Dimensions,
    Pressable,
    FlatList,
    TextInput,
} from "react-native";
import Text from "../../components/MyText";
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons'
import StarRating from 'react-native-star-rating';
import { List, Checkbox, RadioButton } from 'react-native-paper';
import css from '../commonCss';
let imgPath = '../../assets/icons/';

export default function ReviewGenieModal({
    updateRating = () => null,
    appointmentID = "",
    uniqueCode = "",
    driverID = null,
    categoryID = null,
    subcategoryID = null
}) {

    const [ratingModal, setratingModal] = useState(true);
    const toggleratingModal = () => { setratingModal(!ratingModal) };
    const [reviewTextArea, setReviewTextArea] = useState(null);
    const [favGeniechecked, setfavGenieChecked] = useState(false);
    const [starCount, setstarCount] = useState(null)
    const [starValidate, setstarValidate] = useState(false)
    const [reviewValidate, setreviewValidate] = useState(false)

    const updateRatingData = async (appointmentId) => {
        if (starCount == null) {
            setstarValidate(true);
        } if (reviewTextArea == null) {
            setreviewValidate(true)
        } else {
            setstarValidate(false)
            setreviewValidate(false)
            const params = {
                appointmentId,
                driverRating: `${starCount}`,
                favouriteGenie: favGeniechecked,
                driverComment: reviewTextArea
            };
            
            updateRating(params);
        }

    }

    return (
        <>
            <Modal
                isVisible={ratingModal}
                animationIn='fadeIn'
                animationInTiming={700}
                animationOut='fadeOut'
                animationOutTiming={700}
                coverScreen={true}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
            >
                <View style={css.centeredView}>
                    <View style={css.modalNewView}>
                        <View style={[css.modalNewHeader,]}>
                            {/* <TouchableOpacity
                                style={[css.flexDR]}
                                onPress={() => setratingModal(!ratingModal)}
                            >
                                <Image style={[css.alignSelfC, css.marginR10]} source={require(imgPath + 'backArrowBlack.png')} />
                                <Text style={[css.fm, css.f16, css.greyC]}>Back</Text>
                            </TouchableOpacity> */}
                            <View><Text style={[css.modalNewText, css.f18, css.brandC, css.fm]}>Rate Your Genie</Text></View>
                            <View>
                                <View style={[css.flexDR, css.alignItemsC, css.justifyContentC]}>
                                    {categoryID?.imageURL?.original &&
                                        <Image
                                            style={[css.img30, css.marginR10]}
                                            source={{ uri: categoryID?.imageURL?.original }} />
                                    }

                                    <Text>{categoryID?.name}</Text>
                                </View>
                                <Text style={[css.textCenter, css.blackC, css.f14, css.fr]}>{subcategoryID?.subCategoryName}</Text>
                                <Text style={[css.brandC, css.fm, css.f18, css.textCenter, css.marginT10]}>JOB ID: {uniqueCode}</Text>
                            </View>
                        </View>
                        <View style={[css.modalNewBody, css.paddingT0]}>
                            <View style={[css.marginT10]}>
                                <View style={[css.flexDRSA, css.padding10, css.alignItemsC, css.justifyContentC]}>
                                    <Image
                                        style={[css.img100, css.borderGrey1, css.marginR20, css.borderRadius50]}
                                        source={{ uri: driverID?.profilePicURL?.original }}
                                    />
                                    <Text style={[css.fbo, css.f20, css.blackC]}>{driverID?.name}</Text>
                                </View>
                                <View>
                                    <Text style={[css.brandC, css.fr, css.f12, css.marginB5]}>Help us improve our services by rating your Genie</Text>
                                    <View style={[css.alignItemsC, css.justifyContentC]}>
                                        <StarRating
                                            disabled={false}
                                            emptyStar={'ios-star'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            maxStars={5}
                                            rating={starCount}
                                            selectedStar={(rating) => setstarCount(rating)}
                                            fullStarColor={'#f6b700'}
                                            emptyStarColor={'#ccc'}
                                            starSize={30}
                                            containerStyle={[css.width70]}
                                        />
                                        {starValidate && <Text style={[css.errorText]}>Please select star for rating</Text>}
                                    </View>
                                </View>
                                <View>
                                    <Text style={[css.brandC, css.fr, css.f12, css.marginT10]}>Write a review</Text>
                                    <TextInput
                                        style={[form.input, css.marginT5, { height: 100 }]}
                                        onChangeText={setReviewTextArea}
                                        multiline={true}
                                        placeholder={'Write about the Genie and the way they performed the service'}
                                        numberOfLines={5}
                                    />
                                    {reviewValidate && <Text style={[css.errorText]}>Please enter some reviews</Text>}
                                </View>
                                <View style={[css.marginT10, css.flexDR]}>
                                    <Checkbox
                                        status={favGeniechecked ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setfavGenieChecked(!favGeniechecked);
                                        }}
                                        color={'#2eb0e4'}
                                    />
                                    <Text style={[css.brandC, css.fr, css.f12, css.alignSelfC]}>Mark Genie as your favourite</Text>
                                </View>
                                <Pressable
                                    onPress={() => updateRatingData(appointmentID)}
                                    style={[css.brandBG, css.alignItemsC, css.justifyContentC, css.borderRadius5, css.marginT5, css.borderRadius30, css.boxShadow, { height: 40 }]}
                                ><Text style={[css.whiteC, css.fm, css.f16]}>SUBMIT</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )

}

const form = StyleSheet.create({
    input: { borderRadius: 10, borderWidth: 1, borderColor: '#ccc', height: 50, width: '100%', paddingLeft: 20, paddingRight: 20, ...css.f12, fontFamily: 'PoppinsR', color: '#525252' },
})