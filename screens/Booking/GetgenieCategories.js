import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import css from "../../components/commonCss";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  getCatgories,
  getSideBarCategory,
  updateActiveSubCategory,
  updateMainCategory,
  loadSubCategoryContent,
  getMainCategory,
  getActiveMainCategoryId,
  getActiveCategoryId,
  updateCategory,
  getSubCategoryList,
} from "../../reducers/categoryReducer";
import HelpModal from "../../components/Modals/HelpModal";
import SearchToolBar from "../../components/Search";
import { hideLoading, showLoading } from "../../reducers/appReducer";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import FaqModal from "../../components/Modals/FaqModal";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
let imgPath = "../../assets/icons/";
let subHeaderHeight = 130;
export default function GetgenieCategories(props) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  const [isModalComponentVisible, setIsModalComponentVisible] = useState(false);
  const [catNameSubcategory, setCatNameSubcategory] = useState("");
  const dispatch = useDispatch();

  const activeMainCategoryId = useSelector(getActiveMainCategoryId);
  const activeCategoryId = useSelector(getActiveCategoryId);

  const mainCategory = useSelector(getMainCategory);
  const category = useSelector(getSideBarCategory);
  const subCategoryList = useSelector(getSubCategoryList);
  const allCategory = useSelector(getCatgories);

  const currentCategory = category.find((x) => x.id === activeCategoryId);

  const switchMainCategory = async (mainCategory) => {
    await dispatch(updateMainCategory(mainCategory.slug));
    const firstItem = allCategory.find(
      (item) => item.mainCategory === mainCategory.slug
    );
    await switchCategory(firstItem);
  };

  const switchCategory = async (category) => {
    await dispatch(updateCategory(category.id));
  };

  const setActiveSubcategory = async (subCategory) => {
    dispatch(showLoading());
    await dispatch(updateActiveSubCategory(subCategory.id));
    await dispatch(loadSubCategoryContent(subCategory.url));
    dispatch(hideLoading());
    props.navigation.navigate("BookingFlow");
  };
  return (
    <>
      <View
        style={[css.container, css.liteBlueBG, { height: subHeaderHeight }]}
      >
        <View>
          {mainCategory !== null && (
            <FlatList
              data={mainCategory}
              contentContainerStyle={[css.flexDRSA, { alignItems: "stretch" }]}
              keyExtractor={(item) => item.slug}
              renderItem={({ item, index }) => (
                <Pressable
                  style={[
                    styles.categoryBtn,
                    item.slug === activeMainCategoryId
                      ? styles.activeMainCategory
                      : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryBtnText,
                      item.slug === activeMainCategoryId ? css.whiteC : null,
                    ]}
                    onPress={() => switchMainCategory(item)}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
        <View style={[css.flexDRSB, css.spaceT10, { zIndex: 10 }]}>
          <View style={{ width: "85%" }}>
            <SearchToolBar navigation={props.navigation} />
          </View>
          <Pressable
            style={[css.whiteC, css.backButton]}
            onPress={() => props.navigation.navigate("Home")}
          >
            <AntDesign name="close" size={24} color="#bababa" />
          </Pressable>
        </View>
      </View>
      <View
        style={[
          css.flexDR,
          css.BGwhite,
          { height: windowHeight - subHeaderHeight - insets.top },
        ]}
      >
        <View
          style={{
            backgroundColor: "#eff7fc",
            width: "30%",
            zIndex: 1,
          }}
        >
          {category && category.length > 0 && (
            <FlatList
              data={category}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    setCatNameSubcategory(item.label), switchCategory(item);
                  }}
                  style={[
                    css.flexDR,
                    css.padding5,
                    css.paddingT10,
                    css.paddingB10,
                    css.imgFull,
                    activeCategoryId === item.id
                      ? css.BGwhite
                      : item.label === "Specialised Services"
                      ? css.BGlitYellow
                      : null,
                    { borderBottomColor: "#d1d1d150", borderBottomWidth: 1 },
                  ]}
                >
                  <Image
                    style={[css.img20, css.marginR5, css.width20]}
                    source={{ uri: item.imageUrl }}
                  />
                  <Text style={[css.f11, css.fr, css.blackC, css.width80]}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
        <ScrollView>
          <View style={[css.padding10, css.BGwhite]}>
            <Text
              style={[
                styles.categoryTite,
                catNameSubcategory === "Specialised Services"
                  ? css.orangeC
                  : css.blackC,
              ]}
            >
              {!!currentCategory ? currentCategory.label : category[0]?.label}
            </Text>
            <View
              style={[
                css.flexDR,
                css.justifyContentFS,
                css.marginT10,
                css.flexWrapW,
                css.imgFull,
                css.marginB30,
              ]}
            >
              {subCategoryList == null ? (
                <LoadingOverlay />
              ) : (
                <FlatList
                  numColumns={2}
                  data={subCategoryList}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View>
                      {item.image ? (
                        <Pressable
                          style={{
                            marginBottom: 15,
                            width: wp("27%"),
                            marginRight: 20,
                          }}
                          onPress={() => setActiveSubcategory(item)}
                        >
                          <Image
                            style={{
                              width: wp("27%"),
                              height: hp("9%"),
                              borderRadius: 10,
                              marginBottom: 5,
                            }}
                            source={{ uri: item.image }}
                          />
                          <Text style={[css.fr, css.f11, css.blackC]}>
                            {item.label > item.label.substring(0, 30)
                              ? item.label.substring(0, 30) + "..."
                              : item.label}
                          </Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{
                            marginBottom: 15,
                            width: wp("27%"),
                            marginRight: 20,
                          }}
                          //onPress={() => (setActiveSubcategory(item))}
                        >
                          <Image
                            style={{
                              width: wp("27%"),
                              height: hp("9%"),
                              borderRadius: 10,
                              marginBottom: 5,
                            }}
                            source={require(imgPath + "subCat_dummy.png")}
                          />
                          <Text style={[css.fr, css.f11, css.blackC]}>
                            {item.label > item.label.substring(0, 30)
                              ? item.label.substring(0, 30) + "..."
                              : item.label}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                />
              )}
            </View>
          </View>
        </ScrollView>
        <View style={[styles.faqContainer]}>
          <Pressable
            style={[css.flexDRR]}
            onPress={() => setIsModalComponentVisible(true)}
          >
            <Text style={[styles.faqText]}>FAQ</Text>
            <Ionicons name="help-circle-outline" size={16} color="#2eb0e4" />
          </Pressable>
        </View>
      </View>
      <FaqModal
        isVisible={isModalComponentVisible}
        onClose={() => setIsModalComponentVisible(false)}
      />
    </>
  );
}
const styles = StyleSheet.create({
  categoryTite: { fontFamily: "PoppinsBO", ...css.f18 },
  categoryBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#d1d1d1",
    borderWidth: 1,
    height: hp("6%"),
    width: wp("21%"),
    paddingHorizontal: 5,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBtnText: {
    flexWrap: "wrap",
    ...css.f12,
    textAlign: "center",
    fontFamily: "PoppinsM",
    ...css.blackC,
  },
  activeMainCategory: {
    ...css.BGbrand,
    borderWidth: 0,
  },
  faqContainer: {
    ...css.BGwhite,
    width: "100%",
    padding: 10,
    position: "absolute",
    bottom: 0,
    borderTopColor: "#bababa",
    borderTopWidth: 1,
  },
  faqText: {
    ...css.brandC,
    ...css.marginL5,
    ...css.f14,
    ...css.fr,
    lineHeight: 22,
  },
});
