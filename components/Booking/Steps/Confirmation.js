import { StyleSheet, View, Image, Pressable } from "react-native";
import React, { useState, } from "react";
import css from '../../commonCss';
import Text from '../../MyText';
import { Feather, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import ModalComingSoonComponent from "../../Modals/ModalComingSoon";
import { getServiceType, getServiceTypeString } from "../../../helpers/common";
import moment from "moment";
import { useSelector } from "react-redux";
import { getActiveCategoryId, getActiveSubCategoryId, getCatgories, getSubCategoryList } from "../../../reducers/categoryReducer";
import TextComp from "../../TextComp";
import MessageModal from "../../Modals/MessageModal";
import { useNavigation } from "@react-navigation/native";
const imgPath = '../../../assets/icons/';
let FIXED = 'The selected service is a fixed price service with the price estimate calculated based on the details you select while booking the service.'
let INSPECTION = 'The selected issue or service requires us to visit your location to inspect and diagnose the issue or to understand your requirements better before we could provide you with an estimate.'
let SURVEY = 'The selected issue or service requires the team to visit, call or email a customer to identify the exact requirements, measurements or preferences before an estimate could be provided to the customer.'
export default function StepConfirmation({
    category,
    prev,
    setIsLastStepReached,
    //navigation,
    changeStep,
    bookingForm,
    selectedSlot = null,
    date = null,
    descriptiveAnswer = null,
    booleanAnswer = null,
    wholeAnswer = null,
    charges,
    images = [],
    updateImages = () => null,
    setPromoCode = () => null,
    appliedPromoCode = null
}) {
    const navigation = useNavigation();
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [isRatingModal, setIsRatingModal] = useState(false);
    const [isModalComponentVisible, setIsModalComponentVisible] = useState(false)
    const typeString = getServiceTypeString(category);
    const activeCategoryId = useSelector(getActiveCategoryId);
    const activeSubCategoryId = useSelector(getActiveSubCategoryId);

    const categoryOptions = useSelector(getCatgories);
    const subCategoryOptions = useSelector(getSubCategoryList);

    const activeCategory = categoryOptions ? categoryOptions.find(({ id }) => id === activeCategoryId) : null;
    const activeSubCategory = subCategoryOptions.find(({ id }) => id === activeSubCategoryId) || null;
    const selectedDate = date !== null ? moment(date.fullDate).format('ddd MMM DD YYYY') : null;

    //For Questions
    const { questions } = category;
    const getQuestion = (type) => questions.find(item => item.type === type);
    const descriptiveQuestion = getQuestion('DESCRIPTIVE').question;
    const booleanQuestion = getQuestion('BOOLEAN').question;
    const wholeQuestion = getQuestion('WHOLE').question;

    const removeImage = (id) => {
        const img = images.filter((item, index) => index !== id);
        updateImages(img);
    };

    if (!bookingForm) {
        return <View></View>;
    }
    return (
        <>
            <View style={[css.bookingScreenBox]}>
                <View>
                    <Text style={[css.f18, css.fsb, css.brandC]}>Kindly review and confirm your booking.</Text>
                </View>
                <View style={[css.spaceT10, css.imgFull]}>
                    <View style={[css.flexDR, css.line10, css.imgFull, { flexWrap: 'wrap' }]}>
                        {activeCategory !== null && <Image style={{ width: 30, height: 30, marginRight: 10 }} source={{ uri: activeCategory.imageUrl }} />}
                        <Text numberOfLines={1}>
                            {activeCategory !== null && <Text style={[css.fbo, css.f18, css.blackC]}> {activeCategory.label} | </Text>}
                            {activeSubCategory !== null && <Text style={[css.fm, css.f18, css.blackC]}>{activeSubCategory.label}</Text>}
                        </Text>
                    </View>
                    <View style={[css.line10]}>
                        <View style={[css.flexDRSB]}>
                            <View><Text style={[css.f18, css.fbo, css.blackC]}>Booking summary</Text></View>
                            <Pressable style={[css.flexDR, css.alignSelfC]} onPress={() => { setIsLastStepReached(true); changeStep(0) }}>
                                <Feather name="edit" size={16} color="#2eb0e4" />
                                <Text style={[css.brandC, css.f14, css.marginL5]}>Edit</Text>
                            </Pressable>
                        </View>
                        <View style={[css.flexDRSB]}>
                            <View><Text style={[css.greyC, css.fm, css.f14,]}>Type</Text></View>
                            <Pressable style={[css.flexDR]}
                                onPress={() => setMessageModalVisible(true)}
                            >
                                <AntDesign name="infocirlceo" size={14} color='#2eb0e4' />
                                <Text style={[css.blackC, css.fm, css.f12, css.marginL5]}>{typeString}</Text>
                            </Pressable>
                        </View>
                        <View style={[css.flexDRSB]}>
                            <View><Text style={[css.greyC, css.fm, css.f14,]}>Priority</Text></View>
                            <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.orangeC, css.fm, (bookingForm.serviceType == 'EMERGENCY' ? css.cMaroon : css.orangeC)]}>{bookingForm.serviceType}</Text></View>
                        </View>
                    </View>
                    <View style={[css.line10]}>
                        <View style={[css.flexDRSB]}>
                            <View><Text style={[css.f16, css.fsb, css.brandC]}>Scope</Text></View>
                            <Pressable style={[css.flexDR, css.alignSelfC]} onPress={() => { setIsLastStepReached(true); changeStep(0) }}>
                                <Feather name="edit" size={16} color="#2eb0e4" />
                                <Text style={[css.brandC, css.f14, css.marginL5, css.fm]}>Edit</Text>
                            </Pressable>
                        </View>
                        <View style={[css.flexDRSB]}>
                            <View style={[styles.leftSummaryItems]}><Text style={[css.greyC, css.fm, css.f14]}>{descriptiveQuestion ? descriptiveQuestion : 'What is the issue?'}</Text></View>
                            <View style={[styles.rightSummaryItems]}>
                                {descriptiveAnswer !== null &&
                                    <Text style={[css.alignSelfC, css.blackC, css.fm, css.f14]}>{descriptiveAnswer.answer}</Text>
                                }
                            </View>
                        </View>
                        <View style={[css.flexDRSB]}>
                            <View style={[styles.leftSummaryItems, { width: '70%' }]}><Text style={[css.greyC, css.fm]}>{wholeQuestion ? wholeQuestion : 'Number of units to inspect ?'}</Text></View>
                            <View style={[styles.rightSummaryItems, { width: '30%' }]}>
                                {wholeAnswer !== null &&
                                    <Text style={[css.alignSelfC, css.blackC, css.fm, css.f14]}>{wholeAnswer.value}</Text>
                                }
                            </View>
                        </View>
                        <View style={[css.flexDRSB]}>
                            <View style={[styles.leftSummaryItems, { width: '70%' }]}><Text style={[css.greyC, css.fm]}>{booleanQuestion ? booleanQuestion : 'Is this a furnished location ?'}</Text></View>
                            <View style={[styles.rightSummaryItems, { width: '30%' }]}>
                                {booleanAnswer !== null && <Text style={[css.alignSelfC, css.blackC, css.fm, css.f14]}>{booleanAnswer.answer}</Text>}
                            </View>
                        </View>
                    </View>
                    <View style={[css.line10]}>
                        <View style={[css.flexDRSB]}>
                            <View><Text style={[css.f16, css.fsb, css.brandC]}>Schedule</Text></View>
                            <View style={[css.flexDR, css.alignSelfC]}>
                                <Feather name="edit" size={16} color="#2eb0e4" />
                                <Pressable onPress={() => { setIsLastStepReached(true); changeStep(2) }} >
                                    <Text style={[css.brandC, css.f14, css.marginL5, css.fm]}>Edit</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={[css.flexDRSB]}>
                            <View><Text style={[css.greyC, css.fm, css.f14]}>Date</Text></View>
                            <View style={[css.flexDR]}>
                                {selectedDate !== null && <Text style={[css.alignSelfC, css.blackC, css.fm]}>{selectedDate}</Text>}
                            </View>
                        </View>
                        <View style={[css.flexDRSB]}>
                            <View><Text style={[css.greyC, css.fm, css.f14]}>Time</Text></View>
                            <View style={[css.flexDR]}>
                                {selectedSlot !== null &&
                                    <Text style={[css.alignSelfC, css.blackC, css.fm]}>
                                        {selectedSlot.begin?.replace(':00', '')} - {selectedSlot.end?.replace(':00', '')}
                                    </Text>
                                }
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={[css.flexDRSB]}>
                            <View style={{ width: '75%' }}><Text numberOfLines={1} style={[css.f16, css.fsb, css.brandC]}>Additional info & images (optional) </Text></View>
                            <Pressable
                                style={({ pressed }) => [css.flexDR, css.alignSelfC, pressed && styles.pressed]}
                                onPress={() => { setIsLastStepReached(true); changeStep(1) }}
                            //onPress={() => setIsModalComponentVisible(true)}
                            >
                                <Feather name="edit" size={16} color="#2eb0e4" />
                                <Text style={[css.brandC, css.f14, css.fm, css.marginL5]}>Edit</Text>
                            </Pressable>
                        </View>
                        {images.length > 0 &&
                            <View style={{ marginTop: 10 }}>
                                {images?.map((item, index) => {
                                    return (
                                        <View key={index} style={[css.flexDR, css.line10, { flex: 1 }]}>
                                            <View style={[{ marginRight: 10 }]}>
                                                <Image source={{ uri: `data:image/jpg;base64,${item?.base64}` }} style={[css.imgg80]} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        numberOfLines={3}
                                                        style={[css.blackC, css.f14, css.fm, { flexWrap: 'wrap' }]}
                                                    >
                                                        {item?.name}
                                                    </Text>
                                                    <Text style={[css.f12, css.greyC, css.fm]}>size: {item?.fileSizeFormat}</Text>
                                                </View>
                                                <View>
                                                    <Pressable
                                                        onPress={() => removeImage(index)}
                                                        style={[styles.removeButton]}
                                                    >
                                                        <FontAwesome5 name="times-circle" size={16} color='#d36565' />
                                                        <Text style={[css.cMaroon, css.f14, css.fm, css.marginL5]}>Remove</Text>
                                                    </Pressable>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        }
                        {/* {!bookingForm.problemDetails && bookingForm.problemDetails &&
                            <View><Text style={[css.fm, css.f14, css.greyC]}>{bookingForm.problemDetails}</Text></View>
                        } */}
                    </View>
                </View>
            </View>
            <View style={[css.bookingScreenBox, { borderRadius: 10 }]}>
                <View style={[css.spaceT10]}>
                    <View>
                        <View><Text style={[css.f18, css.fbo, css.blackC]}>Payment summary</Text></View>
                        <View style={[css.flexDRSB]}>
                            <View><Text style={[css.greyC, css.fm]}>Plan</Text></View>
                            <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fm]}>Upon completion</Text></View>
                        </View>
                        <View style={[css.flexDRSB]}>
                            <View><Text style={[css.greyC, css.fm]}>Method</Text></View>
                            <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fm]}>Cash/Card</Text></View>
                        </View>
                    </View>
                    <View style={[css.line]}>
                        <View style={[css.flexDRSB]}>
                            <View><Text style={[css.f16, css.fsb, css.brandC]}>Pricing</Text></View>
                        </View>
                    </View>
                    {typeString === 'Fixed price service' &&
                        <View style={[css.spaceT5]}>
                            <View style={[css.flexDRSB]}>
                                <View><Text style={[css.greyC, css.fbo, css.f12]}>Item</Text></View>
                                <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo, css.f12]}>AED</Text></View>
                            </View>
                            {charges.baseCharge &&
                                <View style={[css.flexDRSB]}>
                                    <View><Text style={[css.greyC, css.fm]}>Service Charges</Text></View>
                                    <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr]}>{charges.baseCharge}</Text></View>
                                </View>
                            }
                            {charges.discountCharges &&
                                <View style={[css.flexDRSB]}>

                                    <View style={{ maxWidth: "75%" }}>
                                        <Text style={[css.greyC, css.fm]}>Discount (self*{appliedPromoCode ? " + " + appliedPromoCode + ")\n" : ")"} <Text onPress={setPromoCode} style={css.brandC}> + add/edit promo</Text></Text>
                                    </View>
                                    <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr]}>{charges.discountCharges}</Text></View>
                                </View>
                            }
                            {charges.totalCharges &&
                                <View style={[css.flexDRSB]}>
                                    <View><Text style={[css.blackC, css.fbo]}>Total Amount</Text></View>
                                    <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo]}>{charges.totalCharges}</Text></View>
                                </View>
                            }
                            {charges.vatCharge &&
                                <View style={[css.flexDRSB]}>
                                    <View><Text style={[css.greyC, css.fm]}>VAT charge @5%</Text></View>
                                    <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr]}>{charges.vatCharge}</Text></View>
                                </View>
                            }
                            {charges.totalChargeVat &&
                                <View style={[css.flexDRSB]}>
                                    <View><Text style={[css.blackC, css.fbo]}>Total Amount (incl. VAT)</Text></View>
                                    <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo]}>{charges.totalChargeVat}</Text></View>
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
                                    <View><Text style={[css.greyC, css.fm]}>Labor (including inspection)</Text></View>
                                    <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr]}>{charges.baseCharge}</Text></View>
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
                                        <Text style={[css.greyC, css.fm]}>Discount (self*{appliedPromoCode ? " + " + appliedPromoCode + ")\n" : ")"} <Text onPress={setPromoCode} style={css.brandC}>+ add/edit promo</Text></Text>
                                    </View>
                                    <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr]}>{charges.discountCharges}</Text></View>
                                </View>
                            }
                            <View style={[css.flexDRSB]}>
                                <View><Text style={[css.blackC, css.fbo]}>Total Amount</Text></View>
                                <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo]}>To be decided</Text></View>
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
                                    <View><Text style={[css.greyC, css.fm]}>Labor (survey charges)</Text></View>
                                    <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fr]}>{charges.finalEstimate}</Text></View>
                                </View>
                            }
                            <View style={[css.flexDRSB]}>
                                <View><Text style={[css.blackC, css.fbo]}>Total Amount</Text></View>
                                <View style={[css.flexDR]}><Text style={[css.alignSelfC, css.blackC, css.fbo]}>To be decided</Text></View>
                            </View>
                        </View>
                    }
                    <View><TextComp styles={[css.f12, css.liteBlackC]}>*For website and app bookings only.</TextComp></View>
                </View>
            </View>
            <View style={[css.bookingScreenBox, { borderRadius: 10 }]}>
                <View style={[css.spaceT10]}>
                    <View style={[css.flexDR, css.imgFull]}>
                        <View><Image style={[css.marginR10]} source={require(imgPath + 'warranty.png')} /></View>
                        <View style={[css.flexDC, css.alignSelfC]}>
                            <TextComp styles={[css.liteBlackC]}>As provided in the bill estimate.</TextComp>
                            <TextComp styles={[css.liteBlackC]}>For more details, visit</TextComp>
                            <Pressable onPress={() => navigation.navigate('Browser', { url: 'https://www.homegenie.com/en/warranty' })}><TextComp styles={[css.brandC]}>HomeGenie Warranty Policy</TextComp></Pressable>
                        </View>
                    </View>
                </View>
            </View>
            <ModalComingSoonComponent isVisible={isModalComponentVisible} onClose={() => setIsModalComponentVisible(false)} />
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

    )
}

const styles = StyleSheet.create({
    pressed: { opacity: 0.5 },
    removeButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end'
    },
    rightSummaryItems: {
        flexWrap: 'wrap', width: '50%', flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end'
    },
    leftSummaryItems: {
        flexWrap: 'wrap', width: '50%', flexDirection: 'row', justifyContent: 'flex-start', alignSelf: 'flex-start'
    }
})