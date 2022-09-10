import { View, StyleSheet, Image, Dimensions } from 'react-native';
const imgPath = '../../assets/icons/';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function LoadingOverlay() {
    return (
        <>
            <View style={styles.container}>
                <Image style={{ width: 70, height: 70 }} source={require(imgPath + 'animateIcons/animateSpin.gif')} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundColor: '#ffffff70',
        position: 'absolute',
        height: windowHeight,
        width: windowWidth
    }
})
