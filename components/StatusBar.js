import React from "react";
import { View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const CustomStatusBar = ({ backgroundColor, barStyle = "dark-content" }) => {

    const insets = useSafeAreaInsets();

    return (
        <View style={{ height: insets.top, backgroundColor }}>
            <StatusBar
                animated={true}
                backgroundColor={backgroundColor}
                barStyle={barStyle}
            />
        </View>
    );
}
const StatusBarAll = (props) => {
    return (
        <CustomStatusBar backgroundColor="#2eb0e4" barStyle='light-content' />
    );
};

export default StatusBarAll;
