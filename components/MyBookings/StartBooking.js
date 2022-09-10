import { StyleSheet, View, Pressable, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TextComp from "../TextComp";
let imgPath = '../../assets/icons/';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function StartBooking({ }) {
    const navigation = useNavigation();
    return (
        <>
            <View style={[styles.bookingTabsContent]}>
                <View style={[styles.imageContainer]}>
                    <Image
                        style={[styles.bookingTabsImage]}
                        source={require(imgPath + 'empty-ongoing.png')}
                    />
                </View>
                <TextComp styles={[styles.bookingTabsText]}>No Bookings yet. {"\n"}start Booking and {"\n"} Enjoy HomeGenie Services</TextComp>
                {/* <Text style={[styles.bookingTabsText]} >No Bookings yet. {"\n"}start Booking and {"\n"} Enjoy HomeGenie Services</Text> */}
                <Pressable
                    style={[styles.button]}
                    onPress={() => navigation.navigate('GetgenieCategories')}
                >
                    <Text style={[styles.buttonText]}>Book Now</Text>
                </Pressable>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    pressed: { opacity: 0.5 },
    bookingTabsContent: { alignItems: 'center', justifyContent: 'center', flex: 1 },
    imageContainer: {
        width: 150, height: 150,
        borderRadius: 200,
        backgroundColor: '#fff', justifyContent: 'center',
        alignItems: 'center', marginTop: 50,
    },
    bookingTabsImage: { width: 100, height: 100, },
    bookingTabsText: {
        textAlign: 'center',
        fontSize: wp('3.9%'),
        lineHeight: 22,
        marginVertical: 20,
        color: '#525252',
        fontFamily: 'PoppinsM'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        backgroundColor: '#f6b700',
        marginVertical: 80,
        width: '90%'
    },
    buttonText: {
        fontSize: wp('3.4%'),
        lineHeight: 21,
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'PoppinsM'
    },
})