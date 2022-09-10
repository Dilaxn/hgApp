import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
} from "react-native";
import ScopedetailsModal from "../../components/Modals/ScopedetailsModal";
import TermsofuseModal from "../../components/Modals/TermsofuseModal";
import PricingdetailModal from "../../components/Modals/PricingdetailModal";
import FaqModal from "../../components/Modals/FaqModal";
import { AntDesign } from '@expo/vector-icons';
import css from '../../components/commonCss';
let imgPath = '../../assets/icons/';



export default function ModalMenusScopeTermPricingFaq({ data }) {
    const [isScopedetailModal, setIsScopedetailModal] = useState(false);
    const [isTermsofuseModal, setIsTermsofuseModal] = useState(false);
    const [isPricingdetailModal, setIsPricingdetailModal] = useState(false);
    const [isFaqModal, setIsFaqModal] = useState(false);
    return (
        <>
            <View style={[css.section, css.container, { marginBottom: 100 }]}>
                <View style={[css.flexDR,]}>
                    <View style={[css.flexDR, css.width50]}>
                        <Image source={require(imgPath + 'expert-professionals-icon.png')} />
                        <Text style={[css.brandC, css.alignSelfC, css.fr, css.f12]} onPress={() => setIsScopedetailModal(true)}>Scope Details</Text>
                    </View>
                    <View style={[css.flexDR, css.width50]}>
                        <AntDesign style={[css.marginR5]} name="infocirlceo" size={14} color='#2eb0e4' />
                        <Text style={[css.brandC, css.fr, css.f12, { lineHeight: 18 }]} onPress={() => setIsTermsofuseModal(true)}>Terms of use</Text>
                    </View>
                </View>
                <View style={[css.flexDR, css.spaceT10, css.spaceB10]}>
                    <View style={[css.flexDR, css.width50]}>
                        <Image source={require(imgPath + 'pricing-icon.png')} />
                        <Text style={[css.brandC, css.fr, css.f12]} onPress={() => setIsPricingdetailModal(true)}>Pricing Details</Text>
                    </View>
                    <View style={[css.flexDR, css.width50]}>
                        <AntDesign style={[css.marginR5]} name="questioncircleo" size={14} color="#2eb0e4" />
                        {/* <Image source={require(imgPath + 'help-icon.png')} /> */}
                        <Text style={[css.brandC, css.fr, css.f12, { lineHeight: 18 }]} onPress={() => setIsFaqModal(true)}>FAQ</Text>
                    </View>
                </View>
            </View>
            <ScopedetailsModal isVisible={isScopedetailModal} onClose={() => { setIsScopedetailModal(false) }} data={data} />
            <TermsofuseModal isVisible={isTermsofuseModal} onClose={() => { setIsTermsofuseModal(false) }} />
            <PricingdetailModal isVisible={isPricingdetailModal} onClose={() => { setIsPricingdetailModal(false) }} data={data} />
            <FaqModal isVisible={isFaqModal} onClose={() => { setIsFaqModal(false) }} />
        </>
    );
}
const styles = StyleSheet.create({})