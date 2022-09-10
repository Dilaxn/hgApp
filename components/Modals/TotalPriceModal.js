import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    Pressable,
    ScrollView
} from "react-native";
import Modal from 'react-native-modal';
import moment from "moment";
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { getServiceTypeString } from "../../helpers/common";
import { getActiveCategoryId, getActiveSubCategoryId, getCatgories, getSubCategoryList } from "../../reducers/categoryReducer";
import css from '../commonCss';
import MessageModal from "./MessageModal";
const windowHeight = Dimensions.get('window').height;
let imgPathImage = '../../assets/icons/images/';
let FIXED = 'The selected service is a fixed price service with the price estimate calculated based on the details you select while booking the service.'
let INSPECTION = 'The selected issue or service requires us to visit your location to inspect and diagnose the issue or to understand your requirements better before we could provide you with an estimate.'
let SURVEY = 'The selected issue or service requires the team to visit, call or email a customer to identify the exact requirements, measurements or preferences before an estimate could be provided to the customer.'
export default function TotalPriceModal({
    charges,
    isVisible,
    onClose,
    category,
    bookingForm,
    descriptiveAnswer,
    wholeAnswer,
    booleanAnswer,
    descriptiveQuestion,
    wholeQuestion,
    booleanQuestion,
    selectedSlot = null,
    date = null,

    address = {},
    setPromoCode = () => null,
    showOffer = false,
    appliedPromoCode = null
}) {
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const typeString = getServiceTypeString(category);
    const activeCategoryId = useSelector(getActiveCategoryId);
    const activeSubCategoryId = useSelector(getActiveSubCategoryId);

    const categoryOptions = useSelector(getCatgories);
    const subCategoryOptions = useSelector(getSubCategoryList);

    const activeCategory = !!categoryOptions ? categoryOptions.find(({ id }) => id === activeCategoryId) : null;
    // console.log('activeCategoryPRICEMODAL', activeCategory);
    const activeSubCategory = subCategoryOptions.find(({ id }) => id === activeSubCategoryId) || null;

    const selectedDate = date !== null ? moment(date.fullDate).format('ddd MMM DD YYYY') : null;
    // console.log('typeStringgg', typeString);
    // console.log('chargesssD', charges);



    return (
        <>
            <Modal
                animationType="fade"
                isVisible={isVisible}
                hasBackdrop={true}
                animationIn='slideInUp'
                animationInTiming={700}
                animationOut='slideOutDown'
                animationOutTiming={700}
                coverScreen={false}
                useNativeDriver={true}
                style={{ margin: 0, marginBottom: 80, zIndex: 1 }}
                hideModalContentWhileAnimating={true}
                onBackdropPress={() => onClose()}
                onBackButtonPress={() => onClose()}
                backdropOpacity={0.7}
            >
                <View style={[bookModal.modalViewFull, { maxHeight: windowHeight - 400 }]}>
                    <ScrollView>
                        <View style={[bookModal.modalBody, css.marginB30]}>
                            <View style={[css.flexDR, styles.line10]}>
                                <Text style={[css.f20, css.lGreyC, css.alignSelfC, css.fsb]}>Booking Summary</Text>
                            </View>
                            <View>
                                <Text style={[css.flexDR]} numberOfLines={1}>
                                    <Image style={[css.img30]} source={{ uri: activeCategory.imageUrl }} />{' '}
                                    {activeCategory !== null && <Text style={[css.f16, css.fbo, css.brandC]}>{activeCategory.label} </Text>}
                                    {activeSubCategory !== null && <Text style={[css.f16, css.fm, css.brandC]}>| {activeSubCategory.label}</Text>}
                                </Text>
                            </View>
                            <View style={[css.flexDRSB]}>
                                <Text style={[css.f12, css.grayC, css.fsb]}>Type</Text>
                                {!!typeString && <Pressable
                                    style={[css.flexDR]}
                                    onPress={() => setMessageModalVisible(true)}
                                >
                                    <AntDesign style={[css.marginR5, css.alignSelfC]} name="infocirlceo" size={12} color='#2eb0e4' />
                                    <Text style={[css.blackC, css.fsb, css.f12]}>{typeString}</Text>
                                </Pressable>}
                            </View>
                            {bookingForm.serviceType &&
                                <View style={[css.flexDRSB]}>
                                    <View><Text style={[css.f12, css.grayC, css.fsb]}>Priority</Text></View>
                                    <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.orangeC, css.fm, (bookingForm.serviceType == 'EMERGENCY' ? css.cMaroon : css.orangeC)]}>{bookingForm.serviceType}</Text></View>
                                </View>
                            }
                            <View style={[css.flexDRSB]}>
                                <View style={[styles.leftSummaryItems]}>
                                    <Text style={[css.f12, css.grayC, css.fsb]}>{descriptiveQuestion ? descriptiveQuestion : 'What is the issue ?'}</Text>
                                </View>
                                <View style={[styles.rightSummaryItems]}>
                                    {!!descriptiveAnswer && <Text style={[css.f12, css.blackC, css.fsb]}>{descriptiveAnswer.answer}</Text>}
                                </View>
                            </View>
                            <View style={[css.flexDRSB]}>
                                <Text style={[css.f12, css.grayC, css.fsb]}>{wholeQuestion ? wholeQuestion : 'Number of  bedrooms ?'}</Text>
                                {!!wholeAnswer && <Text style={[css.f12, css.blackC, css.fsb]}>{wholeAnswer.value}</Text>}
                            </View>
                            <View style={[css.flexDRSB]}>
                                <Text style={[css.f12, css.grayC, css.fsb]}>{booleanQuestion ? booleanQuestion : 'Want to include outdoor aswell ?'}</Text>
                                {!!booleanAnswer && <Text style={[css.f12, css.blackC, css.fsb]}>{booleanAnswer.answer}</Text>}
                            </View>
                            {selectedDate &&
                                <View style={[css.flexDRSB]}>
                                    <View><Text style={[css.f12, css.grayC, css.fsb]}>Date</Text></View>
                                    <View style={[css.flexDR]}>
                                        {selectedDate !== null && <Text style={[css.f12, css.blackC, css.fsb]}>{selectedDate}</Text>}
                                    </View>
                                </View>
                            }
                            {selectedSlot &&
                                <View style={[css.flexDRSB]}>
                                    <View><Text style={[css.f12, css.grayC, css.fsb]}>Time</Text></View>
                                    <View style={[css.flexDR]}>
                                        {selectedSlot !== null &&
                                            <Text style={[css.f12, css.blackC, css.fsb]}>
                                                {selectedSlot.begin?.replace(":00", "")} - {selectedSlot.end?.replace(":00", "")}
                                            </Text>
                                        }
                                    </View>
                                </View>
                            }
                            {address?.addressDetail &&
                                <View style={[css.flexDRSB]}>
                                    <View style={[styles.leftSummaryItems]}><Text style={[css.f12, css.grayC, css.fsb]}>Address</Text></View>
                                    <View style={[styles.rightSummaryItems]}>
                                        {selectedSlot !== null &&
                                            <Text style={[css.f12, css.blackC, css.fsb]}>
                                                {address?.addressDetail}
                                            </Text>
                                        }
                                    </View>
                                </View>
                            }
                            {address?.addressType &&
                                <View style={[css.flexDRSB]}>
                                    <View><Text style={[css.f12, css.grayC, css.fsb]}>Address Type</Text></View>
                                    <View style={[css.flexDR]}>
                                        {selectedSlot !== null &&
                                            <Text style={[css.f12, css.blackC, css.fsb]}>
                                                {address?.addressType}
                                            </Text>
                                        }
                                    </View>
                                </View>
                            }

                            <View style={[styles.line10]}></View>
                            <View style={[css.flexDR,]}>
                                <Text style={[css.f20, css.lGreyC, css.alignSelfC, css.fsb]}>Payment Summary</Text>
                            </View>
                            <View style={[css.flexDRSB]}>
                                <Text style={[css.f12, css.grayC, css.fsb]}>Plan</Text>
                                <Text style={[css.f12, css.blackC, css.fsb]}>Upon Completion</Text>
                            </View>
                            <View style={[css.flexDRSB]}>
                                <Text style={[css.f12, css.grayC, css.fsb]}>Method</Text>
                                <Text style={[css.f12, css.blackC, css.fsb]}>Cash / Card</Text>
                            </View>
                            <View style={[css.flexDRSB, styles.line10]}>
                                <Text style={[css.f14, css.brandC, css.fsb]}>Pricing</Text>
                            </View>
                            {typeString === 'Fixed price service' &&
                                <View style={[css.spaceT5]}>
                                    <View style={[css.flexDRSB]}>
                                        <View><Text style={[css.greyC, css.fbo, css.f12]}>Item</Text></View>
                                        <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo, css.f12]}>AED</Text></View>
                                    </View>
                                    {charges.baseCharge &&
                                        <View style={[css.flexDRSB]}>
                                            <View><Text style={[css.greyC, css.fm, css.f12,]}>Service Charges</Text></View>
                                            <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr, css.f12,]}>{charges.baseCharge}</Text></View>
                                        </View>
                                    }
                                    {charges.discountCharges &&
                                        <View style={[css.flexDRSB]}>
                                            <View style={[styles.leftSummaryItems, { width: '70%' }]}>
                                                <Text style={[css.greyC, css.fm]}>Discount (self*{appliedPromoCode ? " + " + appliedPromoCode + ")\n" : ")"}
                                                    {showOffer && <Text onPress={setPromoCode} style={css.brandC}> + add/edit promo</Text>}
                                                </Text>
                                            </View>
                                            <View style={[css.flexDR]}>
                                                <Text style={[css.alignSelfC, css.blackC, css.fr]}>{charges.discountCharges}</Text>
                                            </View>
                                        </View>
                                    }
                                    {charges.totalCharges &&
                                        <View style={[css.flexDRSB]}>
                                            <View><Text style={[css.blackC, css.fbo, css.f12,]}>Total Amount</Text></View>
                                            <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo, css.f12,]}>{charges.totalCharges}</Text></View>
                                        </View>
                                    }
                                    {charges.vatCharge &&
                                        <View style={[css.flexDRSB]}>
                                            <View><Text style={[css.greyC, css.fm, css.f12,]}>VAT charge @5%</Text></View>
                                            <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr, css.f12,]}>{charges.vatCharge}</Text></View>
                                        </View>
                                    }
                                    {charges.totalChargeVat &&
                                        <View style={[css.flexDRSB]}>
                                            <View style={[styles.leftSummaryItems, { width: '70%' }]}><Text style={[css.blackC, css.fbo, css.f12,]}>Total Amount (incl. VAT)</Text></View>
                                            <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo, css.f12,]}>{charges.totalChargeVat}</Text></View>
                                        </View>
                                    }
                                </View>
                            }
                            {typeString === 'Inspection based service' &&
                                <View style={[css.spaceT5]}>
                                    <View style={[css.flexDRSB]}>
                                        <View><Text style={[css.greyC, css.fbo, css.f12]}>Item</Text></View>
                                        <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo, css.f12]}>AED</Text></View>
                                    </View>
                                    {charges.baseCharge &&
                                        <View style={[css.flexDRSB]}>
                                            <View><Text style={[css.greyC, css.fm, css.f12,]}>Labor (including inspection)</Text></View>
                                            <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr, css.f12,]}>{charges.baseCharge}</Text></View>
                                        </View>
                                    }
                                    {charges?.emergencyCharges != undefined && charges?.emergencyCharges != 0 &&
                                        <View>
                                            <Text style={[css.greyC, css.fm]}>Other Charges</Text>
                                            <View style={[css.flexDRSB, { marginLeft: 16 }]}>
                                                <View><Text style={[css.greyC, css.fm]}>Emergency Charges</Text></View>
                                                <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr]}>
                                                    {charges.emergencyCharges}
                                                </Text></View>
                                            </View>
                                        </View>
                                    }
                                    {charges.discountCharges &&
                                        <View style={[css.flexDRSB]}>
                                            <View style={{ maxWidth: "75%" }}>
                                                <Text style={[css.greyC, css.fm]}>Discount (self*{appliedPromoCode ? " + " + appliedPromoCode + ")\n" : ")"}
                                                    {showOffer && <Text onPress={setPromoCode} style={css.brandC}> + add/edit promo</Text>}
                                                </Text>
                                            </View>
                                            <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr]}>{charges.discountCharges}</Text></View>
                                        </View>
                                    }
                                    <View style={[css.flexDRSB]}>
                                        <View><Text style={[css.blackC, css.fbo, css.f12,]}>Total Amount</Text></View>
                                        <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo, css.f12,]}>To be decided</Text></View>
                                    </View>
                                </View>
                            }
                            {typeString === 'Survey based service' &&
                                <View style={[css.spaceT5]}>
                                    <View style={[css.flexDRSB]}>
                                        <View><Text style={[css.greyC, css.fbo, css.f12]}>Item</Text></View>
                                        <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo, css.f12]}>AED</Text></View>
                                    </View>
                                    {charges.finalEstimate != null &&
                                        <View style={[css.flexDRSB]}>
                                            <View><Text style={[css.greyC, css.fm, css.f12,]}>Labor (survey charges)</Text></View>
                                            <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr, css.f12,]}>{charges.finalEstimate}</Text></View>
                                        </View>
                                    }
                                    <View style={[css.flexDRSB]}>
                                        <View><Text style={[css.blackC, css.fbo, css.f12,]}>Total Amount</Text></View>
                                        <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo, css.f12,]}>To be decided</Text></View>
                                    </View>
                                </View>
                            }
                        </View>
                    </ScrollView>
                </View>
            </Modal >
            <MessageModal
                isVisible={messageModalVisible}
                onClose={() => setMessageModalVisible(false)}
                message={typeString}
                message2={typeString == 'Fixed price service' ? FIXED
                    : 'Inspection based service' ? INSPECTION
                        : 'Survey based service' ? SURVEY : null
                }
                button='OKAY, GOT IT'
            />
        </>
    );
};

const bookModal = StyleSheet.create({
    modalViewFull: {
        backgroundColor: "white",
        padding: 20,
        height: 'auto',
        marginTop: 'auto',
        elevation: Platform.OS === 'android' ? 10 : 0,
        borderRadius: 5,
    },
})
const styles = StyleSheet.create({
    line10: { borderBottomColor: '#b5b5b51a', borderBottomWidth: 1, paddingBottom: 10, marginBottom: 10 },
    rightSummaryItems: {
        flexWrap: 'wrap', width: '50%', flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end'
    },
    leftSummaryItems: {
        flexWrap: 'wrap', width: '50%', flexDirection: 'row', justifyContent: 'flex-start', alignSelf: 'flex-start'
    }
})