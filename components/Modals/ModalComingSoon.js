import {
    View,
    Text,
    SafeAreaView,
    StyleSheet
} from "react-native";
import Modal from 'react-native-modal';
import css from '../commonCss';
import ButtonComp from "../ui/ButtonComp";
import TextComp from "../TextComp";

const ModalComingSoon = (props) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Modal
                isVisible={props.isVisible}
                //hasBackdrop={true}
                // animationIn='fadeIn'
                animationInTiming={700}
                // animationOut='fadeOut'
                animationOutTiming={700}
                //useNativeDriver={true}
                //hideModalContentWhileAnimating={true}
                onBackButtonPress={() => props.onClose()}
                onBackdropPress={() => props.onClose()}
            //coverScreen={true}
            >
                <View style={css.centeredView}>

                    <View style={[css.modalView, { padding: 0, paddingBottom: 20 }]}>
                        <View style={[style.modalHeader,]}>
                            <TextComp size={css.f16}>Coming Soon</TextComp>
                        </View>
                        <ButtonComp
                            buttonContainer={[css.yellowBtn]}
                            onPress={() => props.onClose()}
                        >Continue</ButtonComp>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    modalHeader: { backgroundColor: '#F2F4F8', width: '100%', alignItems: 'center', justifyContent: 'center', borderTopRightRadius: 10, borderTopLeftRadius: 10, paddingVertical: 30, marginBottom: 20 }
})

export default ModalComingSoon;