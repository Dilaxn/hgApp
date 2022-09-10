import React, { useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Pressable,
} from "react-native";
import Text from "../components/MyText";
import css from "../components/commonCss";
import HeaderTitle from "../components/ui/HeaderTitle";
import ModalComingSoon from "../components/Modals/ModalComingSoon";
let imgPath = "../assets/icons/";


export default function ReferEarnScreen({ navigation }) {
    const [isModalComponentVisible, setIsModalComponentVisible] = useState(false);
    return (
        <View style={styles.screen}>
            <HeaderTitle title='Refer and Earn' />
            <ScrollView>
                <View style={[css.section]}>
                    <View style={[css.container]}>
                        <View style={[css.boxShadow, css.padding20, css.whiteBG, css.borderRadius20]}>
                            <View style={[css.fm, css.blackC]}><Text style={[css.f16, css.fm, css.textCenter, css.blackC]}>You have earned <Text style={[css.brandC]}> AED 0 {'\n'}</Text> in referral so far</Text></View>
                            <View><Image style={[css.imgFull, css.marginT20, css.marginB20,]} resizeMode="contain" source={require(imgPath + 'earnGenie.png')} /></View>
                            <View style={[css.alignItemsC, css.marginT20]}>
                                <Text style={[css.brandC, css.fsb, css.f24, css.spaceB5]}>Gift AED 50.00</Text>
                                <Text style={[css.yellowC, css.fsb, css.f24, css.spaceB5]}>Get AED 50.00</Text>
                                <Text style={[css.blackC, css.fr, css.f16, css.spaceB5, css.textCenter]} > Invite your friends to use a Home Genie service by gifting them AED 50.00, and get AED 50.00 in return when they book their first Home Genie Service.</Text>
                                <Pressable
                                    onPress={() => setIsModalComponentVisible(true)}
                                    style={[css.spaceB20, css.yellowBG, css.imgFull, css.borderRadius10, css.boxShadow, css.alignCenter, { height: 50 }]}
                                >
                                    <Text style={[css.whiteC, css.f24, css.feb]}>HGXPUWe1FGkX</Text>
                                </Pressable>
                                {/* <View style={[css.spaceB5,]}><Text style={[css.fm, css.f16, css.blackC]}>Share this code with your friends</Text></View>
                                <View style={[css.spaceB5, css.flexDRSE, css.width50]}>
                                    <Image source={require(imgPath + 'social-fb.png')} />
                                    <Image source={require(imgPath + 'social-Instagram.png')} />
                                    <Image source={require(imgPath + 'social-twitter.png')} />
                                </View> */}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <ModalComingSoon isVisible={isModalComponentVisible} onClose={() => setIsModalComponentVisible(false)} />
        </View>

    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FAFBFF'
    },
});