import { ScrollView, StyleSheet, View, Text, Dimensions } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import Header from '../../components/header';
import { connect, useSelector } from "react-redux";
import { updateMainCategory, updateCategory, getCatgories, loadPopularService, loadOffers, loadServiceCategory } from "../../reducers/categoryReducer";
import InfoBar from "../../components/HomescreenComponents/InfoBar";
import BannerHome from "../../components/HomescreenComponents/BannerHome";
import MostPopular from "../../components/HomescreenComponents/MostPopular";
import ServiceCategory from "../../components/HomescreenComponents/ServiceCategory";
import OfferPromos from "../../components/HomescreenComponents/OfferPromos";
import HappinessWaranty from "../../components/HomescreenComponents/HappinessWarranty";
import WhyHomeGenie from "../../components/HomescreenComponents/WhyHomeGenie";
import FeatureIn from "../../components/HomescreenComponents/FeatureIn";
import NeedHelp from "../../components/HomescreenComponents/NeedHelp";
import SpecializedCategories from "../../components/HomescreenComponents/SpecializedCategories";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const HomeScreen = (props) => {
    const category = useSelector(getCatgories);
    const gotoGenieScreen = async (mainCategory, categoryId) => {
        await props.updateMainCategory(mainCategory);
        await props.updateCategory(categoryId);
        props.navigation.navigate('GetgenieCategories');
    }

    const offerToGine = async (categoryName) => {
        console.log(categoryName)
        category.forEach(element => {
            console.log(element.label)
        });
        const item = category.find(c => c.label.indexOf(categoryName) !== -1) || category[0];
        await props.updateMainCategory(item.mainCategory);
        await props.updateCategory(item.id);
        props.navigation.navigate('GetgenieCategories');
    }

    useLayoutEffect(() => {
        props.loadOffers();
        props.loadPopularService();
    }, [])

    return (
        <>
            <Header navigation={props.navigation} />
            <ScrollView
                nestedScrollEnabled={true}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollContainer}
            >
                <BannerHome />
                <InfoBar />
                <MostPopular propData={props.popularService} onPress={offerToGine} />
                <ServiceCategory onPress={gotoGenieScreen} />
                <OfferPromos propData={props.offers} onPress={offerToGine} />
                <SpecializedCategories />
                <HappinessWaranty />
                <WhyHomeGenie />
                <FeatureIn />
                <NeedHelp />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flex: 1 },
})

const mapStateToProps = (state) => ({
    popularService: state.common.popularService,
    categoryService: state.common.categoryService,
    offers: state.common.offers,
    error: state.error
})

export default connect(mapStateToProps, { loadOffers, loadPopularService, updateMainCategory, updateCategory, loadServiceCategory })(HomeScreen);