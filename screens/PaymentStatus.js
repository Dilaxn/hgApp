import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Pressable,
    Image,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../base_file";
import { connect, useSelector } from "react-redux";
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import Text from "../components/MyText";
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import css from "../components/commonCss";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../reducers/appReducer";
import TextComp from "../components/TextComp";
import { useNavigation } from "@react-navigation/native";
import { getSingleJob } from "../reducers/jobDetailReducer";
let imgPath = "../assets/icons/";

const PaymentStatus = ({ route, token }) => {
    const [amountData, setAmountData] = useState(null)
    const navigation = useNavigation();
    const jobId = route.params.jobId;
    const amount = route.params.amount;
    //let jobId = '62a31f005e2faccc7073bd7b'
    // let jobId = '629b7fc63f45aaca06c21d5e'
    // let amount = '469.09'
    const dispatch = useDispatch();

    const getJobDetails = async () => {
        console.log('insideJob', { jobId, amount, token });
        await dispatch(showLoading());
        const results = await dispatch(getSingleJob(jobId));
        await dispatch(hideLoading());
        console.log('jobdetailsData', results);
        console.log('results.status', results.status);
        if (results) {
            if (results.status && (results.status == 'RATING' || results.status == 'ASSIGNED' || results.status == 'IN_SERVICE')) {
                if ((results.status == 'RATING' && results.payment.payment_type == 'CARD') || ((results.status == 'ASSIGNED' || results.status == 'IN_SERVICE') && results.advance_payment.payment_type == 'CARD')) {
                    if (results.status == 'RATING') {
                        setAmountData(results.charges.finalCharges)
                    } else {
                        setAmountData(results.charges.advanceCharges)
                    }
                }
            }
        }
    }
    useEffect(() => {
        getJobDetails();
    }, []);

    return (
        <View style={[styles.screen]}>
            <View style={[styles.header]}>
                <Text style={[styles.headerTitle, css.textCenter]}>Payment Success</Text>
            </View>
            <ScrollView>
                <View style={[css.container]}>
                    <View style={[styles.imageContainer]}>
                        <Image style={[styles.image]} source={require(imgPath + 'howitworks.png')} />
                    </View>
                    {amountData > 0 ?
                        <View style={[css.padding30]}>
                            <View style={[css.alignItemsC, css.marginT10]}><Text style={[css.fsb, css.f18, css.blackC]}>Payment successful</Text></View>
                            <View style={[css.alignItemsC, css.marginT10, css.marginB20]}><Text style={[css.fm, css.f14, css.blackC, css.textCenter]}>Your card payment of AED {amountData} has been successfully completed and the invoice has been sent to your registered email address.</Text></View>
                            <Pressable style={[styles.buttonContainer]} onPress={() => navigation.navigate('MyBookingPage')}>
                                <TextComp color={css.whiteC}>Okay</TextComp>
                            </Pressable>
                        </View>
                        :
                        <View style={[css.padding30]}>
                            <View style={[css.alignItemsC, css.marginT10]}><Text style={[css.fsb, css.f18, css.blackC]}>Payment Failed</Text></View>
                            <View style={[css.alignItemsC, css.marginT10, css.marginB20]}><Text style={[css.fm, css.f14, css.blackC, css.textCenter]}>Something went wrong, Please try again</Text></View>
                            <Pressable style={[styles.buttonContainer]} onPress={() => navigation.navigate('MyBookingPage')}>
                                <TextComp color={css.whiteC}>Okay</TextComp>
                            </Pressable>
                        </View>
                    }
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    pressed: { opacity: 0.5 },
    header: {
        width: "100%",
        height: 70,
        padding: 20,
        backgroundColor: "#2eb0e4",
        justifyContent: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 10,
        shadowColor: "#000",
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: hp('5%'),
        backgroundColor: '#2eb0e4',
        borderRadius: 10
    },
    headerTitle: {
        color: "#fff",
        ...css.f20,
        fontFamily: 'PoppinsSB',
        textTransform: "uppercase",
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: wp('40%'),
        height: hp('20%'),
    }
});

export default connect(
    state => ({
        token: state.auth.token
    }),
    null
)(PaymentStatus);