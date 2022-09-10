import React from "react";
import {
    View,
    Text,
    Pressable,
} from "react-native";
import Modal from 'react-native-modal';
import css from './commonCss';

export default function LoginRequestModal({ isVisible, onClose, title }) {
    return (
        <Modal
            animationType="fade"
            isVisible={isVisible}
            hasBackdrop={true}
        >
            <View style={css.centeredView}>
                <View style={css.modalView}>
                    <Text>{title}</Text>
                    <Text style={css.modalText}>Please login again</Text>
                    <Pressable
                        style={[css.yellowBtn]}
                        onPress={() => onClose()}
                    >
                        <Text style={[css.whiteC, css.f14, css.fm]}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};