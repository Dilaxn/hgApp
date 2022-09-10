import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import css from "../commonCss";

export default function AddressOption({ onChange }) {
  return (
    <View style={[css.flexDCSB]}>
      <View style={[css.line20]}>
        <Text style={[css.f18, css.lGreyC, css.fsb]}>
          Where would you want the service?
        </Text>
        <Text style={[css.f14, css.lGreyC, css.fm]}>
          {" "}
          A precise address will help us get to you on time.
        </Text>
      </View>

      <View>
        <View style={[css.line20]}>
          <Text style={[css.f18, css.lGreyC, css.fm]}>Select an option</Text>
        </View>
        <Pressable onPress={() => onChange(true)}>
          <View style={[styles.boxShadow]}>
            <View style={[css.flexDR]}>
              <View style={[css.img30]}>
                <MaterialIcons
                  name="location-searching"
                  size={18}
                  color="black"
                />
              </View>
              <View>
                <Text style={[css.f18, css.lGreyC, css.fsb]}>
                  {" "}
                  Use Current Location
                </Text>
                <Text style={[css.f14, css.lGreyC, css.fm]}>
                  {" "}
                  This will take your current geo location
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => onChange(false)}>
          <View style={[styles.boxShadow]}>
            <View style={[css.flexDR]}>
              <View style={[css.img30]}>
                <AntDesign name="search1" size={18} color="black" />
              </View>
              <View>
                <Text style={[css.f18, css.lGreyC, css.fsb]}>
                  {" "}
                  Some other location
                </Text>
                <Text style={[css.f14, css.lGreyC, css.fm]}>
                  {" "}
                  Complete all details to add/ edit an address.
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxShadow: {
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
});
