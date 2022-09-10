import React, { StyleSheet, View, ScrollView, Image, Pressable, Linking } from "react-native";
import css from '../../commonCss';
import Text from '../../MyText';
import TextComp from '../../TextComp';
import ShadowCard from "../../ui/ShadowCard";
import { useDispatch, useSelector } from "react-redux";
import { getGenie, getJobDetail, getSingleJob, loadGenie } from "../../../reducers/jobDetailReducer";
import EmergencyGenie from "./components/EmergencyGenie";
import NormalGenieSearch from "./components/NormalGenieSearch";
import { useEffect, useState, useRef } from "react";
import { hideLoading, showLoading } from "../../../reducers/appReducer";
const imgPath = '../../../assets/icons/';

function useInterval(callback, delay, stop) {
    const savedCallback = useRef();
    const interval = useRef();

    useEffect(() => {
        savedCallback.current = callback;

        if (stop?.()) { // call stop to check if you need to clear the interval
            clearInterval(interval.current); // call clearInterval
        }
    });

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        interval.current = setInterval(tick, delay); // set the current interval id to the ref

        return () => clearInterval(interval.current);
    }, [delay]);
}

export default function StepGenieSearch({ navigation, bookingId }) {
    // let genieData = useSelector(getGenie) || null;
    const [jobDetail, setJobDetail] = useState(null);

    const [getGenie, setGenie] = useState(null);
    const [isTimeout, setTimeout] = useState(false);
    // const genie = useSelector(getGenie) || null;
    const dispatch = useDispatch();


    useEffect(async () => {
        if (jobDetail === null) {
            console.log('jobdetail loading........');
            await dispatch(showLoading());
            const detail = await dispatch(getSingleJob(bookingId));
            setJobDetail(detail);
            if (detail.supplierList && detail.supplierList.length) {
                await dispatch(loadGenie(detail.supplierList[0].driverID));
            }
            await dispatch(hideLoading());
        }
    }, [bookingId])

    // useEffect(async () => {

    //     const interval = setInterval(async () => {
    //         console.log("setInterval ",bookingId)

    //         if(bookingId) {
    //             const detail = await dispatch(getSingleJob(bookingId));

    //             if(isTimeout) {
    //                 clearInterval(interval);
    //                 console.log("itstime out")  
    //             }

    //             if(detail?.driverData) {
    //                 console.log("genie FOUND")
    //                 setGenie(detail?.driverData);

    //                 clearInterval(interval);
    //             }
    //         }

    //     }, 5000);

    //     return () => {

    //         try {
    //             console.log("Cleaning up")
    //             clearInterval(interval);
    //             console.log("done cleaning")

    //         } catch (error) {
    //             console.log("error interval ",error)
    //         }
    //     }

    // }, [])

    useInterval(async () => {

        console.log("setInterval ", bookingId)

        if (bookingId) {
            const detail = await dispatch(getSingleJob(bookingId));

            if (isTimeout) {
                // clearInterval(interval);
                console.log("itstime out")
            }

            if (detail?.driverData) {
                console.log("genie FOUND")
                setGenie(detail?.driverData);

                // clearInterval(interval);
            }
        }

        console.log("Every 5 seconds");
    }, 5000, () => isTimeout == true || getGenie != null);

    const handleTimeout = () => {
        console.log("handleTimeout set true")
        setTimeout(true);
    }
    console.log('jobDetail [genie search]', jobDetail);
    return (
        <>
            <ScrollView>
                <View style={[styles.container]}>
                    {jobDetail &&
                        <ShadowCard>
                            {jobDetail.charges.emergencyCharges !== 0 ?
                                <EmergencyGenie navigation={navigation} jobDetail={jobDetail} genie={getGenie} bookingId={bookingId} timeout={handleTimeout} />
                                :
                                <NormalGenieSearch navigation={navigation} jobDetail={jobDetail} genie={getGenie} bookingId={bookingId} />
                            }
                        </ShadowCard>
                    }
                    <View style={[styles.innerContainer]}>
                        <TextComp styles={[css.textCenter]}>Download HomeGenie app today for the best experience and prices!</TextComp>
                        <View style={[css.flexDR]}>
                            <Image style={[styles.appImage]} source={require(imgPath + 'google-play-store.png')} />
                            <Image style={[styles.appImage]} source={require(imgPath + 'app-store.png')} />
                        </View>
                        <TextComp styles={[css.textCenter, css.f10, css.fr]}>For any support, call or WhatsApp us on <Text style={[css.brandC, css.f10, css.fr]} onPress={() => Linking.openURL('tel:+971800443643')}>+971(0)80 0443643 (HGENIE)</Text> and <Text style={[css.brandC, css.f10, css.fr]} onPress={() => Linking.openURL('mailto: support@homegenie.com')}>support@homegenie.com</Text>  from 8 AM to 8 PM (SAT-THU) except public holidays.</TextComp>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    innerContainer: { padding: 30, alignItems: 'center' },
    titleContainer: { borderBottomWidth: 1, borderBottomColor: '#ccc', width: '100%' },
    title: { textAlign: 'center', marginBottom: 10 },
    appImage: { margin: 10 }
})