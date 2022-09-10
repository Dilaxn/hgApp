import React from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Dimensions,
} from "react-native";
import Modal from 'react-native-modal';
import { List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import css from '../commonCss';
const windowHeight = Dimensions.get('window').height;
let imgPath = '../../assets/icons/';
import BackArrow from "../ui/BackArrow";

const HelpModal = (props) => {
    return (
        <Modal
            isVisible={props.isVisible}
            hasBackdrop={true}
            animationIn='slideInRight'
            animationInTiming={500}
            animationOut='slideOutRight'
            animationOutTiming={500}
            coverScreen={true}
            useNativeDriver={true}
            style={{ margin: 0 }}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={() => props.onClose()}
        >
            <ScrollView>
                <View style={bookModal.modalViewFull}>
                    <View>
                        <BackArrow onPress={() => props.onClose()} icon='arrowright' text={null} />
                        <View style={[css.flexDR, css.alignCenter, css.marginB20]}>
                            <Ionicons name="help-circle-outline" size={32} color="#2eb0e4" />
                            <Text style={[css.f20, css.fm, css.blackC, css.paddingL5,]}>FAQ</Text>
                        </View>
                    </View>
                    <View style={[bookModal.modalBody]}>
                        <ScrollView>
                            <List.AccordionGroup>
                                <List.Accordion title="1. Are prices of all the services fixed?"
                                    id="1"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[styles.helpModalTitle]}
                                    right={props => <Image style={{ position: 'absolute', right: -30, top: -35, transform: [{ rotate: "0deg" }] }} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>No. Only services which show Fixed Price Service have their prices fixed at the time of booking based on inputs selected by the customer. Other services like Inspection and Survey Based Service require estimates to be prepared to arrive at the price </Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="2. What warranty is applicable to a service?" id="2"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[styles.helpModalTitle]}
                                    right={props => <Image style={{ position: 'absolute', right: -30, top: -35, transform: [{ rotate: "0deg" }] }} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>The Pricingsection of the Fixed Price Service provides information on the warranty applicable on the service. For Inspection and Survey Based services, warranty is defined in the estimate sent to the customer on email. Further more details, visit </Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="3. Can I book an urgent service or for Friday?" id="3"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[styles.helpModalTitle]}
                                    right={props => <Image style={{ position: 'absolute', right: -30, top: -35, transform: [{ rotate: "0deg" }] }} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>Yes. For a number of services, there is a possibility to book an Emergency Service or Friday Service if selected as an input at the time of the booking. These services come with an additional charge calculated as a percentage of the standard charge.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="4. When will the payment be collected?" id="4"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[styles.helpModalTitle]}
                                    right={props => <Image style={{ position: 'absolute', right: -30, top: -35, transform: [{ rotate: "0deg" }] }} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>With HomeGenie, we collect payment only after completion of the service unless if the service requires a purchase of materials or parts in which case we will request for an advance payment from the customer. This can also be paid through the website or mobile app.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="5. How and who can I pay for the service?" id="5"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[styles.helpModalTitle]}
                                    right={props => <Image style={{ position: 'absolute', right: -30, top: -35, transform: [{ rotate: "0deg" }] }} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>Multiple methods like credit or debit card, cash or bank transfer are available for customers to pay for a service. Credit and debit cards payments are collected on the HomeGenie website or mobile app, however, cash payments are collected by the staff </Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="6. What will happen once I confirm the booking?" id="6"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[styles.helpModalTitle]}
                                    right={props => <Image style={{ position: 'absolute', right: -30, top: -35, transform: [{ rotate: "0deg" }] }} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>Once you confirm your booking, a message will be sent to all qualified teams and the one team which accepts first will be assigned the service. Scheduled services are confirmed instantly, however, Emergency and Same Day Service require real-time search to confirm.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="7. How can I get an estimate for the job?" id="7"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[styles.helpModalTitle]}
                                    right={props => <Image style={{ position: 'absolute', right: -30, top: -35, transform: [{ rotate: "0deg" }] }} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>Following an inspection or survey for a service, a detailed estimate will be prepared by the team and sent to the customer via Email and also can be seen on the website and mobile app where the estimate can be approved or rejected, for further review.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="8. How can I get a VAT invoice for the job?" id="8"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[styles.helpModalTitle]}
                                    right={props => <Image style={{ position: 'absolute', right: -30, top: -35, transform: [{ rotate: "0deg" }] }} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>A VAT invoice, alongwith other documents like estimates for the service can be dowloaded from Bookings/Current Bookings/View Details page on the website or mobile app after logging into your account.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="9. After the booking who do I coordinate with?" id="9"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[styles.helpModalTitle]}
                                    right={props => <Image style={{ position: 'absolute', right: -30, top: -35, transform: [{ rotate: "0deg" }] }} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>For every booking, a supervisor contact details will be provided who can be contacted for service further coordination and delivery. If you are facing any issues with service quality, we encourage you reach HomeGenie Customer Experience team.</Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                                <List.Accordion title="10. How to raise a complaint about a service?" id="10"
                                    titleStyle={[css.brandC, css.fsb, css.f12]}
                                    style={[styles.helpModalTitle]}
                                    right={props => <Image style={{ position: 'absolute', right: -30, top: -35, transform: [{ rotate: "0deg" }] }} source={require(imgPath + 'arrowDown_hg.png')} />}
                                >
                                    <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.defaultSubText]}>All complaints should be raised via call or WhatsApp HomeGenie Customer Experience team on </Text>
                                        </View>
                                    </View>
                                </List.Accordion>
                            </List.AccordionGroup>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
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
    flexRow: {
        flexDirection: "row",
    },
    flexRowSpace: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    textCenter: {
        textAlign: "center",
    },
    helpModalTitle: { backgroundColor: '#fff', borderBottomColor: '#ccc', borderBottomWidth: 1 },
});

export default HelpModal;