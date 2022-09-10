import { View, Text, } from "react-native";
import { useFonts } from 'expo-font';
import css from './commonCss';
export default function MyText(props) {

    let [fontsLoaded] = useFonts({
        'PoppinsBL': require('../assets/fonts/Poppins/Poppins-Black.ttf'),
        'PoppinsM': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
    });
    if (!fontsLoaded) {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text></Text></View>;
    } else {
        return (
            <Text style={[css.blackC, css.fm, css.f14]} {...props} >{props.children}</Text>
        );
    }
}

//export default MyText;