import { StyleSheet, View, ScrollView, Image, Pressable, Linking, Text } from "react-native";
import TextComp from '../../../TextComp';
import css from '../../../commonCss'
import ButtonComp from "../../../ui/ButtonComp";
const imgPath = '../../../../assets/icons/';
import { Feather } from '@expo/vector-icons';
import moment from "moment";
import { useSelector } from "react-redux";
import { getAccessToken } from "../../../../reducers/authReducer";

//let genie = 'yes';
export default function NormalGenieSearch({ navigation, jobDetail, genie, bookingId }) {
    const token = useSelector(getAccessToken);
    const { utc_timing: { requestedTime } } = jobDetail;
    const bookedOn = moment(requestedTime).format('DD MMM YYYY, HH:mm');
    // console.log('jobDetailll', JSON.stringify(jobDetail));
    console.log('genie [NORMAL GENIE SEARCH]', genie);
    return (
        <>
            {jobDetail &&
                <View style={[styles.innerContainer]}>
                    <View style={[styles.titleContainer]}>
                        {genie !== null ?
                            <TextComp styles={[styles.title]}>Hurray! We found a Genie for you</TextComp>
                            :
                            <TextComp styles={[styles.title]}>Thank you! {'\n'}your booking has been confirmed</TextComp>
                        }
                    </View>
                    <View style={[css.flexDR, css.spaceT10]}>
                        <Image
                            style={[css.img40, css.marginR10]}
                            source={{ uri: jobDetail.categoryImage.original }} />
                        <TextComp styles={[css.alignSelfC, css.f12]}><TextComp styles={[css.fbo, css.f12]}>
                            {jobDetail.categoryName}</TextComp> / {jobDetail.subCategory.subCategoryName}</TextComp>
                    </View>
                    <View style={[css.flexDR]}>
                        <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.marginR10]}>JOB ID</TextComp>
                        <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.brandC]}>{jobDetail.uniqueCode}</TextComp>
                    </View>
                    <View style={[styles.dateTimeContainer]}>
                        <TextComp styles={[css.f10, css.grayC]}>Booking Date and Time : {bookedOn}</TextComp>
                    </View>
                    <View style={[styles.messageContainer, css.spaceT10]}>
                        {genie !== null ?
                            <View style={[styles.genieAssigned, css.borderGrey1, css.borderRadius10, css.imgFull]}>
                                <View style={[css.flexDR, styles.genieHeader, css.padding20]}>
                                    <View style={[css.flexDC, css.marginR20, css.width30]}>
                                        <Image style={[styles.genieLogo, css.imgg90, css.borderBlack1, css.borderRadius50]} source={{ uri: genie.profilePicURL.original }} />
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
                            :
                            <TextComp styles={[css.textCenter, css.f12, css.fr]}>We will intimate you via email and sms the service expert ('GENIE') coming over for the service.</TextComp>
                        }
                    </View>
                    <View style={[styles.buttonContainer, css.flexDR, css.spaceT10]}>
                        <ButtonComp
                            buttonContainer={[css.blueBtn, css.marginR10, { flex: 1 }]}
                            //onPress={() => navigation.navigate('GetgenieCategories')}
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
    appImage: { margin: 10 },
    genieSearchBox: { backgroundColor: '#eff7fc', flex: 1, flexDirection: 'column', alignItems: 'center', padding: 20, marginTop: 10, width: '100%' },
})