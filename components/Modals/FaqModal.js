import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Dimensions,
    Linking
} from "react-native";
import Modal from 'react-native-modal';
import { List } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import css from '../commonCss';
const windowHeight = Dimensions.get('window').height;
let imgPath = '../../assets/icons/';
import BackArrow from "../ui/BackArrow";
import { useNavigation } from "@react-navigation/native";

export default function FaqModal(props) {
    const navigation = useNavigation();
    const [expanded, setExpanded] = useState(true);
    const handlePress = () => setExpanded(!expanded);
    return (
        <Modal
            animationType="fade"
            isVisible={props.isVisible}
            hasBackdrop={true}
            animationIn='slideInRight'
            animationInTiming={700}
            animationOut='slideOutRight'
            animationOutTiming={700}
            coverScreen={true}
            useNativeDriver={true}
            style={{ margin: 0, }}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={() => props.onClose()}
        >
            <View style={bookModal.modalViewFull}>
                <BackArrow onPress={() => props.onClose()} icon='arrowright' text={null} />
                <View style={[bookModal.modalBody]}>
                    <View style={[css.flexDR, css.line20]}>
                        <AntDesign style={[css.marginR10]} name="questioncircleo" size={24} color="#2eb0e4" />
                        <Text style={[css.f24, css.lGreyC, css.alignSelfC, css.fsb, { lineHeight: 28 }]}>FAQ</Text>
                    </View>
                    <ScrollView>
                        <List.AccordionGroup>
                            <ScrollView>
                                <List.Accordion
                                    title="1. Are prices of all the services fixed?"
                                    id="1"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[css.helpModalTitle]}
                                    right={props => <Image style={styles.arrowIcon} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>No. Only services which show Fixed Price Service have their prices fixed at the time of booking based on inputs selected by the customer. Other services like Inspection and Survey Based Service require estimates to be prepared to arrive at the price </Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="2. What warranty is applicable to a service?" id="2"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[css.helpModalTitle]}
                                    right={props => <Image style={styles.arrowIcon} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>The Pricing section of the Fixed Price Service provides information on the warranty applicable on the service. For Inspection and Survey Based services, warranty is defined in the estimate sent to the customer on email. Further more details, visit
                                                <Text style={[css.defaultSubText, css.brandC, css.fm, css.f12]} onPress={() => { props.onClose(), navigation.navigate('Browser', { url: 'https://www.homegenie.com/en/warranty' }) }}> HomeGenie Hapiness Warranty policy.</Text></Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="3. Can I book an urgent service or for Friday?" id="3"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[css.helpModalTitle]}
                                    right={props => <Image style={styles.arrowIcon} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View>
                                            <Text style={[css.defaultSubText]}>Yes. For a number of services, there is a possibility to book an Emergency Service or Friday Service if selected as an input at the time of the booking. These services come with an additional charge calculated as a percentage of the standard charge.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="4. When will the payment be collected?" id="4"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[css.helpModalTitle]}
                                    right={props => <Image style={styles.arrowIcon} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View>
                                            <Text style={[css.defaultSubText]}>With HomeGenie, we collect payment only after completion of the service unless if the service requires a purchase of materials or parts in which case we will request for an advance payment from the customer. This can also be paid through the website or mobile app.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="5. How and who can I pay for the service?" id="5"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[css.helpModalTitle]}
                                    right={props => <Image style={styles.arrowIcon} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View>
                                            <Text style={[css.defaultSubText]}>Multiple methods like credit or debit card, cash or bank transfer are available for customers to pay for a service. Credit and debit cards payments are collected on the HomeGenie website or mobile app, however, cash payments are collected by the staff </Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="6. What will happen once I confirm the booking?" id="6"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[css.helpModalTitle]}
                                    right={props => <Image style={styles.arrowIcon} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View>
                                            <Text style={[css.defaultSubText]}>Once you confirm your booking, a message will be sent to all qualified teams and the one team which accepts first will be assigned the service. Scheduled services are confirmed instantly, however, Emergency and Same Day Service require real-time search to confirm.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="7. How can I get an estimate for the job?" id="7"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[css.helpModalTitle]}
                                    right={props => <Image style={styles.arrowIcon} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View>
                                            <Text style={[css.defaultSubText]}>Following an inspection or survey for a service, a detailed estimate will be prepared by the team and sent to the customer via Email and also can be seen on the website and mobile app where the estimate can be approved or rejected, for further review.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="8. How can I get a VAT invoice for the job?" id="8"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[css.helpModalTitle]}
                                    right={props => <Image style={styles.arrowIcon} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View>
                                            <Text style={[css.defaultSubText]}>A VAT invoice, alongwith other documents like estimates for the service can be dowloaded from Bookings/Current Bookings/View Details page on the website or mobile app after logging into your account.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="9. After the booking who do I coordinate with?" id="9"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[css.helpModalTitle]}
                                    right={props => <Image style={styles.arrowIcon} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View>
                                            <Text style={[css.defaultSubText]}>Following an inspection or survey for a service, a detailed estimate will be prepared by the team and sent to the customer via Email and also can be seen on the website and mobile app where the estimate can be approved or rejected, for further review.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="10. How to raise a complaint about a service?" id="10"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[css.helpModalTitle]}
                                    right={props => <Image style={styles.arrowIcon} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View>
                                            <Text style={[css.defaultSubText]}>All complaints should be raised via call or WhatsApp HomeGenie Customer Experience team on
                                                <Text style={[css.fm, css.f12, css.brandC]} onPress={() => Linking.openURL("tel:00971800443643")}> 800443643 (HGENIE) </Text>
                                                , email on <Text style={[css.fm, css.f12, css.brandC]} onPress={() => Linking.openURL("mailto:support@homegenie.com")}> support@homegenie.com </Text> or Support/Add Complaint on the website or mobile app after logging into your account. </Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                            </ScrollView>
                        </List.AccordionGroup>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const bookModal = StyleSheet.create({
    modalViewFull: {
        backgroundColor: "white",
        padding: 20,
        height: windowHeight,
    },
})
const styles = StyleSheet.create({
    arrowIcon: {
        position: 'absolute', right: -30, top: -35, transform: [{ rotate: "0deg" }]
    }
})