import { View, StyleSheet,Text } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookingHeader from "./BookingHeader";
import {
    getSubCatgories,
    updateActiveSubCategory,
    updateMainCategory,
    getSubCategoryContent,
    getActiveCategoryId,
    getActiveSubCategoryId,
    loadSubCategoryContent,
    updateCategory,
} from "../../reducers/categoryReducer";
import BookingSteps from "./Steps";
import { getLoggedInStatus } from "../../reducers/authReducer";
import { hideLoading, showLoading } from "../../reducers/appReducer";

const BookingFlow = ({ navigation }) => {
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const isLoggedIn = useSelector(getLoggedInStatus);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const activeCategoryId = useSelector(getActiveCategoryId);
    const activeSubCategoryId = useSelector(getActiveSubCategoryId);
    const subCategoryContent = useSelector(getSubCategoryContent);
    const allSubCategory = useSelector(getSubCatgories);

    const reset = () => {
        setStep(0);
        setIsCancelModalOpen(false);
    };

    const onCategoryChange = async (item) => {
        console.log("oncategorychange");
        await dispatch(updateMainCategory(item.mainCategory));
        await dispatch(updateCategory(item.value));

        const firstSubcategory = allSubCategory.find(
            (cat) => cat.categoryId === item.value
        );
        onSubCategoryChange(firstSubcategory);
    };

    const onSubCategoryChange = async (item) => {
        await dispatch(showLoading());
        await dispatch(loadSubCategoryContent(item.url));
        console.debug(
            `[Log][Booking Flow][Index][Subcategory Modified]`,
            item.label,
            item.url
        );
        reset();
        await dispatch(updateActiveSubCategory(item.value));
        await dispatch(hideLoading());
    };

    const onCancel = () => {
        navigation.navigate("BookingFlow");
    };

    useEffect(() => {
        // console.log("in>>");
        if (subCategoryContent) {
            console.log(
                "UNIT CHRG",
                subCategoryContent.subCategoryName,
                subCategoryContent.unitCharges,
                subCategoryContent.callOutCharges
            );
        }
    }, [subCategoryContent]);

    const bookingRef = useRef(null);
    console.log("subCategoryContent subcategories",subCategoryContent.categoryID)
    console.log("activeSubCategoryId",activeSubCategoryId)
    console.log("activeCategoryId",activeCategoryId)
    console.log("bookingRef",bookingRef)


    return (
        <View style={[styles.bookingFlow]}>
            <View style={[styles.bookingFlowWrap]}>
                <View style={[styles.bookingHeader, { zIndex: 1000 }]}>
                    <BookingHeader
                        onCategoryChange={onCategoryChange}
                        onSubCategoryChange={onSubCategoryChange}
                        navigation={navigation}
                        onChange={() => {
                            console.log("Changes blah blah");
                            bookingRef?.current?.resetState();
                        }}
                    />
                </View>
                <View style={[styles.bookingSteps, { zIndex: 1 }]}>
                    {(subCategoryContent && activeSubCategoryId && isLoggedIn && activeCategoryId
                    ) &&
                    <BookingSteps
                        step={step}
                        subCategoryId={activeSubCategoryId}
                        category={subCategoryContent}
                        back={() => navigation.navigate("BookingFlow")}
                        isLoggedIn={isLoggedIn}
                        key={activeSubCategoryId}
                        navigation={navigation}
                        categoryId={activeCategoryId}
                        ref={bookingRef}
                    />
                    }
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bookingFlow: {
        height: "100%",
    },
    bookingFlowWrap: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    bookingHeader: {
        flex: 1,
        flexBasis: 145,
        flexGrow: 0,
    },
    bookingSteps: {
        flex: 1,
        flexBasis: "auto",
        flexGrow: 1,
        backgroundColor: "#fff",
    },
});

export default BookingFlow;
