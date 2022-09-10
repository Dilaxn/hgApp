import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Pressable,
    SafeAreaView
} from "react-native";
import Modal from 'react-native-modal';
import css from '../commonCss';

export default function MessageModal({ isVisible, onClose, message, message2, button = 'Continue' }) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Modal
                isVisible={isVisible}
                hasBackdrop={true}
                animationIn='fadeIn'
                animationInTiming={500}
                animationOut='fadeOut'
                animationOutTiming={500}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                style={[{ zIndex: 999999 }]}
                coverScreen={true}
            //onBackButtonPress={() => props.onClose()}
            >
                <View style={[css.centeredView]}>
                    <View style={[css.modalNewView]}>
                        <View style={[css.modalNewHeader]}>
                            <Text style={[css.modalNewText, css.f18, css.fm,]}>{message}</Text>
                            {(message2 != null || message2?.length > 0) &&
                                <View><Text style={[css.blackC, css.f14, css.fm, css.textCenter]}>{message2}</Text></View>
                            }
                        </View>
                        <View style={[css.modalNewBody, css.alignCenter]}>
                            <Pressable
                                style={({ pressed }) => [css.yellowBG, css.borderRadius10, css.alignCenter, css.width50, pressed && styles.pressed, { height: 40 }]}
                                onPress={() => onClose()}
                            >
                                <View style={[css.alignCenter]}><Text style={[css.whiteC, css.fm, css.f18,]}>{button}</Text></View>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    pressed: { opacity: 0.5 }
});