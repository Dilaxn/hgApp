import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Pressable,
    SafeAreaView,
    Dimensions,
    Image,
    FlatList,
} from "react-native";
import Modal from 'react-native-modal';
import css from '../commonCss';
import WebView from "react-native-webview";
const imgPath = '../../assets/icons/';
const windowWidth = Dimensions.get('window').width;

export default function ModalTermsandCondition(props) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Modal
                isVisible={props.isVisible}
                hasBackdrop={true}
                animationIn='fadeIn'
                animationInTiming={500}
                animationOut='fadeOut'
                animationOutTiming={500}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                onBackButtonPress={() => props.onClose()}
            >
                <ScrollView>
                    <View style={css.centeredView}>
                        <View style={css.modalNewView}>
                            <View style={[css.modalNewHeader]}>
                                <Pressable
                                    style={[css.flexDR]}
                                    onPress={() => props.onClose()}
                                >
                                    <Image source={require(imgPath + 'backArrowBlack.png')} />
                                </Pressable>
                            </View>
                            <View style={[css.modalNewBody, css.alignItemsC, css.justifyContentC]}>
                                <FlatList
                                    data={props.termsData}
                                    keyExtractor={(item) => item._id}
                                    renderItem={({ item }) => (
                                        <View style={[css.imgFull]}>
                                            <WebView
                                                scalesPageToFit={false}
                                                source={{ html: item.termsCondition }}
                                            //style={{ minWidth: '100%', height: 300, }}
                                            />
                                            <Text style={{ minWidth: windowWidth }}></Text>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    pressed: { opacity: 0.5 }
});