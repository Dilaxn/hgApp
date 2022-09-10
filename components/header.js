import { View, StyleSheet } from 'react-native';
import React from 'react';
import SearchToolBar from './Search';
import css from './commonCss'

const Header = ({ navigation }) => {
  return (
    <View style={[styles.header]}>
      <View style={styles.searchBoxFull}>
        <SearchToolBar navigation={navigation} />
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 80,
    backgroundColor: "#2eb0e4",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...css.boxShadow,
    zIndex: 10,
    marginBottom: -10
  },
  searchBoxFull: {
    backgroundColor: "#fff",
    width: "90%",
    height: 40,
    padding: 0,
    borderRadius: 30,
    flexDirection: "row",
  }
});

export default Header;