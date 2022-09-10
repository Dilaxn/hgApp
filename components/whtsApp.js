import React from "react";
import { StyleSheet, View, Image, Linking, TouchableOpacity } from "react-native";
const Whatsapp = (props) => {
  return (
    <View style={styles.flexRow}>
      <TouchableOpacity
        onPress={() =>
          Linking.openURL(
            "https://api.whatsapp.com/send/?phone=971581167214&text=HomeGenie&app_absent=0"
          )
        }
      >
        <Image source={require("../assets/icons/whatsapp.png")} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL("tel:00971800443643")}>
        <Image source={require("../assets/icons/800.png")} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRow: { flexDirection: "row" },
});

export default Whatsapp;
