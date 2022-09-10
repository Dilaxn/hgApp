import React, { useState } from "react";
import { ScrollView } from "react-native";

import Header from "../../components/header";
import StepGenieSearch from "../../components/Booking/Steps/GenieSearch";


export default function GenieLoaded({ navigation, route }) {
    const bookingId = route.params.bookingId;
    return (
        <>
            <Header navigation={navigation} />
            <StepGenieSearch navigation={navigation} bookingId={bookingId} key={bookingId} />
        </>
    );
}