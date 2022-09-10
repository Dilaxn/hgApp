import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import TotalPriceModal from "../Modals/TotalPriceModal";
import { connect, useSelector } from "react-redux";
import PromocodeModal from "../Modals/PromocodeModal";
import { AntDesign } from '@expo/vector-icons';
import css from './../commonCss';
import { STEP_SCHEDULED } from "../../constants/booking";
import { getLoggedInStatus } from "../../reducers/authReducer";
import { getServiceTypeString } from "../../helpers/common";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const imgPath = '../../assets/icons/';

const BookingFooter = forwardRef(({
    next, prev, charges,
    category,
    bookingForm,
    descriptiveAnswer,
    wholeAnswer,
    booleanAnswer,
    selectedSlot,
    date,
    offers,
    loadOffers,
    activeStep,
    onApplyOffer,
    appliedPromoCode,
    onRemoveOffer = () => null,
    addressID = null,
    address = [],
    isLoginStore,
    isLastStep = false
}, ref) => {

    const typeString = getServiceTypeString(category);
    const [isTotalPriceModal, setIsTotalPriceModal] = useState(false);
    const [isPromocodeModal, setIsPromocodeModal] = useState(false);
    const isLoggedIn = useSelector(getLoggedInStatus);
    // const showOffers = activeStep >= STEP_SCHEDULED && isLoggedIn;
    console.log('charges [booking footer]', charges);
    //For Questions
    const { questions } = category;
    const getQuestion = (type) => questions.find(item => item.type === type);
    const descriptiveQuestion = getQuestion('DESCRIPTIVE').question;
    const booleanQuestion = getQuestion('BOOLEAN').question;
    const wholeQuestion = getQuestion('WHOLE').question;

    useImperativeHandle(ref, () => ({
        displayOffers() {
            console.log("ref setIsPromocodeModal")
            setIsPromocodeModal(true);
        }
    }));

    const showOffers = () => {

        return activeStep >= STEP_SCHEDULED && isLoginStore;
    }

    const getAddress = () => {
        if (!(address.length > 0 && addressID)) {
            return {}
        }
        const addressIndex = address?.findIndex((item) => item?._id == addressID);

        const selectedAddress = address[addressIndex || 0];

        const addressDetail = `${selectedAddress?.apartmentNo}, ${selectedAddress?.streetAddress}, ${selectedAddress?.community}, ${selectedAddress?.city}`;
        const addressType = selectedAddress?.addressType;

        return {
            addressDetail,
            addressType
        }
    }

    const enablePromo = () => {
        setIsTotalPriceModal(false);

        setTimeout(() => {
            setIsPromocodeModal(true)
        }, 600);
    }

    const isDiscount = () => {
        return charges?.totalWithoutPrmo > charges?.finalEstimate;
    }

    return (
        <>
            <View style={[css.imgFull, styles.footerContainer]}>
                <View style={[css.whiteBG, styles.footer]}>
                    <View style={[css.flexDRSB, css.alignItemsC]}>
                        <Pressable onPress={() => setIsTotalPriceModal(!isTotalPriceModal)} style={[css.flexDC]}>
                            <View style={[css.flexDC]}>
                                <Text style={[css.fr, css.f14, css.blackC,]}>Total{' '}
                                    {isDiscount() && <Text style={{ marginLeft: 5, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                                        {"AED " + charges?.totalWithoutPrmo}
                                    </Text>}
                                    <AntDesign name={isTotalPriceModal ? "up" : "down"} size={12} color="#525252" />
                                </Text>
                                <Text style={[css.fbo, css.f14, css.blackC]}>
                                    AED {!!charges && <Text style={[css.fbo, css.f14, { color: 'red' }]}>{charges.finalEstimate}</Text>}
                                </Text>
                                {typeString === 'Survey based service' &&
                                    <Text style={[css.fm, css.f14, css.liteBlackC]}>Free Survey</Text>
                                }
                            </View>
                        </Pressable>
                        <Pressable style={[styles.continueBtn]} onPress={() => { next() }}>
                            <Text style={[css.fbo, css.f16, css.whiteC]}>{isLastStep ? "CONFIRM" : "NEXT"}</Text>
                        </Pressable>
                        {showOffers() &&
                            <Pressable style={[css.flexDC, css.alignCenter]} onPress={() => setIsPromocodeModal(true)}>
                                <AntDesign name="tags" size={24} color="#2eb0e4" />
                                <Text style={[css.brandC, css.fsb, css.f14]}>Offer</Text>
                            </Pressable>
                        }
                    </View>
                </View>
            </View>
            <TotalPriceModal
                isVisible={isTotalPriceModal}
                onClose={() => { setIsTotalPriceModal(false) }}
                charges={charges}
                category={category}
                bookingForm={bookingForm}
                descriptiveQuestion={descriptiveQuestion}
                wholeQuestion={wholeQuestion}
                booleanQuestion={booleanQuestion}
                descriptiveAnswer={descriptiveAnswer}
                wholeAnswer={wholeAnswer}
                booleanAnswer={booleanAnswer}
                selectedSlot={selectedSlot}
                date={date}
                address={getAddress()}
                setPromoCode={enablePromo}
                showOffer={showOffers()}
                appliedPromoCode={appliedPromoCode}
            />
            <PromocodeModal
                isVisible={isPromocodeModal}
                onClose={() => { setIsPromocodeModal(false) }}
                offers={offers}
                loadOffers={loadOffers}
                onApplyOffer={onApplyOffer}
                appliedPromoCode={appliedPromoCode}
                onRemoveOffer={onRemoveOffer}
            />
        </>
    );
})

const styles = StyleSheet.create({
    continueBtn: {
        ...css.boxShadow,
        backgroundColor: '#f6b700',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 27,
        width: 110,
    },
    continueBtnText: {
        fontSize: wp('3.4%'),
        fontFamily: 'PoppinsM',
        letterSpacing: 0.25,
        color: '#fff',
        textTransform: 'uppercase',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'white',
        overflow: 'hidden',
        paddingTop: 10,
    },
    footer: {
        ...css.boxShadow,
        paddingHorizontal: 20,
        paddingVertical: 20,
        shadowOffset: {
            width: 0,
            height: Platform.OS === 'android' ? -10 : -4,
        },
        elevation: Platform.OS === 'android' ? 10 : 0,
    }
})

// export default BookingFooter;

export default connect(
    state => ({
        isLoginStore: state.auth.isLoggedIn
    }),
    null,
    null,
    { forwardRef: true }
)(BookingFooter);