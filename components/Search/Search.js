import { View, StyleSheet, Dimensions, ScrollView, Text, TextInput, Platform, Pressable } from 'react-native';
import React, { useState } from 'react';
import { EvilIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { useNavigation } from "@react-navigation/native";

const Search = ({ items, onSelect }) => {
    const navigation = useNavigation();

    if(Platform.OS === "android") {
        return (
            <View style={[styles.searchWrapper2]}>
                <Pressable 
                    style={[styles.input]}
                    onPress={()=>{
                        console.log('captured on press');
                        navigation.navigate("Search");
                    }}
                >
                    <TextInput
                        value={""}
                        editable={false}
                        placeholder={"SEARCH FOR ANY SERVICE"}
                        autoCorrect={false}
                        autoCapitalize="none"
                        style={{
                            paddingLeft: 18,
                            height: 40,
                            // top: -3,
                            fontSize: wp('3%'),
                            fontFamily: 'PoppinsM',
                            color: '#bababa',
                            backgroundColor: "transparent",
                        }}
                    />
                    <EvilIcons style={[styles.searchIcon]} name="search" size={24} color="#2eb0e4" />
                </Pressable>
            </View>
        )
    }


    return (
        <View style={[styles.searchWrapper]}>
            <View style={[styles.input]}>
                {items !== null &&
                    <AutocompleteDropdown
                        closeOnBlur={false}
                        closeOnSubmit={true}
                        clearOnFocus={true}
                        onSelectItem={onSelect}
                        dataSet={items}
                        debounce={600}
                        textInputProps={{
                            placeholder: "SEARCH FOR ANY SERVICE",
                            autoCorrect: false,
                            autoCapitalize: "none",
                            style: {
                                paddingLeft: 18,
                                height: 40,
                                top: -3,
                                fontSize: wp('3%'),
                                fontFamily: 'PoppinsM',
                                color: '#bababa',
                                backgroundColor: "transparent",
                            }
                        }}
                        suggestionsListMaxHeight={Dimensions.get("window").height * 0.7}
                        rightButtonsContainerStyle={{
                            right: 15,
                            height: 40,
                            top: -5,
                            alignSelfs: "center",
                            color: "#383b42",
                            backgroundColor: "transparent",
                        }}
                        inputContainerStyle={{
                            backgroundColor: "transparent",
                        }}
                        showChevron={false}
                        suggestionsListContainerStyle={{
                            backgroundColor: "#fff",
                            width: Dimensions.get("window").width * 0.9,
                            //height: Dimensions.get("window").height * 0.7,
                            right: - Dimensions.get("window").width * 0.05,
                        }}
                        containerStyle={{ flexGrow: 1, flexShrink: 1, }}
                    />
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchWrapper: {
        display: 'flex',
        width: '75%',
        borderLeftWidth: 2,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 999999999999999, elevation: 9999
    },
    searchWrapper2: {
        display: 'flex',
        width: '75%',
        borderLeftWidth: 2,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 999999999999999, elevation: 9999,
        alignContent: 'center'
    },
    searchIcon: {
        position: 'absolute',
        right: -5,
        paddingVertical: 8
    },
    input: {
        width: '95%',
        zIndex: 999999999999999, elevation: 9999
    },
})

export default Search;