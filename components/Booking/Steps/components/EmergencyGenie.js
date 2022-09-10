import { useState } from "react";
import { StyleSheet, View, ScrollView, Image, Pressable, Linking, Text } from "react-native";
import TextComp from "../../../TextComp";
import css from '../../../commonCss'
import ButtonComp from "../../../ui/ButtonComp";
const imgPath = '../../../../assets/icons/';
import moment from "moment";
import { Entypo } from '@expo/vector-icons';
import { useTimer } from 'react-timer-hook';
import { useSelector } from "react-redux";
import { getAccessToken } from "../../../../reducers/authReducer";
import { Feather } from '@expo/vector-icons';


//let genie = 'found';
export default function EmergencyGenie({ navigation, jobDetail, genie, bookingId, timeout = () => null }) {
    const token = useSelector(getAccessToken)
    const { utc_timing: { requestedTime } } = jobDetail;
    const bookedOn = moment(requestedTime).format('DD MMM YYYY, HH:mm');
    console.log('genie [EMEGENCY GENIE SEARCH]', genie);
    const [isNotFound, setNotFound] = useState(false);

    function MyTimer({ expiryTimestamp }) {
        const {
            seconds,
            minutes,
        } = useTimer({ expiryTimestamp, onExpire: genieNotFound });
        return (
            <TextComp styles={[css.brandC, css.fbo]}>{minutes}{':'}{seconds > 9 ? seconds : "0" + seconds}</TextComp>
        );
    }

    const time = new Date();
    time.setSeconds(time.getSeconds() + 900);

    const genieNotFound = () => {
        timeout();
        setNotFound(true);
        console.log("SET NOT FOUND")
    }

    return (
        <>
            {jobDetail &&
                <View style={[{ padding: 30, alignItems: 'center' }]}>
                    {genie === null ?
                        (isNotFound == false ? <>
                            <View style={[styles.titleContainer]}>
                                <TextComp styles={[styles.title]}>Thank you! {'\n'} Your booking has been received.</TextComp>
                            </View>
                            <View style={[css.flexDR, css.spaceT10]}>
                                <Image
                                    style={[css.img40, css.marginR10]}
                                    source={{ uri: jobDetail.categoryImage.original }} />
                                <TextComp styles={[css.alignSelfC, css.f12]}><TextComp styles={[css.fbo, css.f12]}>
                                    {jobDetail.categoryName}</TextComp> / {jobDetail.subCategory.subCategoryName}</TextComp>
                            </View>
                            <View style={[css.flexDR]}>
                                <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.marginR10, css.blackC]}>JOB ID</TextComp>
                                <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.brandC]}>{jobDetail.uniqueCode}</TextComp>
                            </View>
                            <View style={[styles.dateTimeContainer]}>
                                <TextComp styles={[css.f12, css.grayC]}>Booking Date and Time : {bookedOn}</TextComp>
                            </View>
                            <View style={[styles.genieSearchBox]}>
                                <View style={[styles.genieLoading]}>
                                    <Image style={[styles.imageLoading]} source={require(imgPath + 'loading-genie.gif')} />
                                </View>
                                <View style={[css.line10, css.imgFull]}><TextComp styles={[css.textCenter, css.spaceT10]}>Searching for a HomeGenie</TextComp></View>
                                <View style={[styles.waitingTime]}>
                                    <TextComp>Average waiting time</TextComp>
                                    <TextComp styles={[css.brandC, css.textCenter]}>
                                        <MyTimer expiryTimestamp={time} />
                                    </TextComp>
                                </View>
                            </View>
                        </> : <>
                            <View style={[styles.titleContainer]}>
                                <TextComp styles={[styles.title]}>Genie not found</TextComp>
                            </View>
                            <View style={[css.flexDR, css.spaceT10]}>
                                <Image
                                    style={[css.img40, css.marginR10]}
                                    source={{ uri: jobDetail.categoryImage.original }} />
                                <TextComp styles={[css.alignSelfC, css.f12]}><TextComp styles={[css.fbo, css.f12]}>
                                    {jobDetail.categoryName}</TextComp> / {jobDetail.subCategory.subCategoryName}</TextComp>
                            </View>
                            <View style={[css.flexDR]}>
                                <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.marginR10, css.blackC]}>JOB ID</TextComp>
                                <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.brandC]}>{jobDetail.uniqueCode}</TextComp>
                            </View>
                            <View style={[styles.dateTimeContainer]}>
                                <TextComp styles={[css.f10, css.grayC]}>Booking Date and Time : {bookedOn}</TextComp>
                            </View>
                            <View style={[css.flexDC]}>
                                <Entypo style={[css.textCenter]} name="emoji-sad" size={24} color="#2eb0e4" />
                                <TextComp styles={[css.textCenter]}>Apologies, we are {'\n'} unable to assign a {'\n'} Genie to your {'\n'} booking at this moment.</TextComp>
                            </View>
                        </>) : <>
                            <View style={[styles.titleContainer]}>
                                <TextComp styles={[styles.title]}>Thank you! {'\n'}your booking has been received.</TextComp>
                            </View>
                            <View style={[css.flexDR, css.spaceT10]}>
                                <Image
                                    style={[css.img40, css.marginR10]}
                                    source={{ uri: jobDetail.categoryImage.original }} />
                                <TextComp styles={[css.alignSelfC, css.f12]}><TextComp styles={[css.fbo, css.f12]}>
                                    {jobDetail.categoryName}</TextComp> / {jobDetail.subCategory.subCategoryName}</TextComp>
                            </View>
                            <View style={[css.flexDR]}>
                                <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.marginR10, css.blackC]}>JOB ID</TextComp>
                                <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.brandC]}>{jobDetail.uniqueCode}</TextComp>
                            </View>
                            <View style={[styles.dateTimeContainer]}>
                                <TextComp styles={[css.f10, css.grayC]}>Booking Date and Time : {bookedOn}</TextComp>
                            </View>

                            <View style={[styles.genieAssigned, css.borderGrey1, css.borderRadius10, css.imgFull]}>
                                <View style={[css.flexDR, styles.genieHeader, css.padding20]}>
                                    <View style={[css.flexDC, css.marginR20, css.width30]}>
                                        <Image style={[styles.genieLogo, css.imgg90, css.borderBlack1, css.borderRadius50]}
                                            source={{ uri: genie.profilePicURL.original }}
                                        />
                                        {/* <Pressable style={[css.alignCenter, css.marginT5]}
                                        onPress={() => setGenieModal(true)}
                                        ><Text style={[css.brandC, css.f12, css.fm, css.textCenter]}>View Profile</Text>
                                        </Pressable> */}
                                    </View>
                                    <View style={[css.width60]}>
                                        <View>
                                            <Text style={[css.fbo, css.f20, css.blackC]}>{genie.name}</Text>
                                        </View>
                                        <View style={[css.flexDR]}>
                                            <Image style={[css.img20]} source={require(imgPath + 'star-fill.png')} />
                                            <Text style={[css.fr, css.f12, css.blackC, css.alignSelfC, css.marginL5]}>star</Text>
                                        </View>
                                        <Pressable style={[styles.genieFooter, css.brandBG, css.alignCenter, css.imgFull, css.spaceT10, { height: 60, borderRadius: 10 }]}>
                                            <Text onPress={() => Linking.openURL('tel:' + genie.phoneNo)} style={[css.feb, css.f18, css.whiteC]}>
                                                <Feather name="phone-call" size={16} color="white" />
                                                {' '} CALL NOW</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </>

                    }
                    <View>
                        <TextComp styles={[css.textCenter, css.spaceT10]}>We will intimate you via email, SMS and app notifications the service expert (or "Genie") for the service.</TextComp>
                    </View>
                    <View style={[styles.buttonContainer, css.flexDR, css.spaceT10]}>
                        <ButtonComp
                            buttonContainer={[css.blueBtn, css.marginR10, { flex: 1 }]}
                            onPress={() => navigation.navigate("JobdetailPage", {
                                token: token, jobId: bookingId, bookingStatus: 'ongoing', redirect: 'MyBookings'
                            })}
                        >VIEW DETAILS</ButtonComp>
                        <ButtonComp
                            buttonContainer={[css.yellowBtn, { flex: 1 }]}
                            onPress={() => navigation.navigate('GetgenieCategories')}
                        >BOOK SERVICE</ButtonComp>
                    </View>
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    innerContainer: { padding: 30, alignItems: 'center' },
    titleContainer: { borderBottomWidth: 1, borderBottomColor: '#ccc', width: '100%' },
    title: { textAlign: 'center', marginBottom: 10 },
    imageLoading: { width: 60, height: 60, borderRadius: 50, overlayColor: '#eff7fc', },
    genieSearchBox: { backgroundColor: '#eff7fc', flex: 1, flexDirection: 'column', alignItems: 'center', padding: 20, marginTop: 10, width: '100%', borderRadius: 10 },
})