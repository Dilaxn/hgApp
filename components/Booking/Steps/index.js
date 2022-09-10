import { View, StyleSheet, Text } from "react-native";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { connect } from "react-redux";
import StepScope from "./Scope";
import StepSchedule from "./Schedule";
import StepLocation from "./Location";
import StepConfirmation from "./Confirmation";
import BookingFooter from "../BookingFooter";
import StepAdditionalInfo from "./AdditionalInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  bookAppointment,
  loadHolidays,
  loadTimeSlots,
} from "../../../reducers/categoryReducer";
import { getSlot } from "../../../helpers/common";
import LoginModal from "../../LoginModal";
import {
  applyPromoCode,
  getAddress,
  loadAddress,
  loadRelatedOffers,
} from "../../../reducers/userReducer";
import { hideLoading, showLoading } from "../../../reducers/appReducer";
import { calculateCharges } from "../../../helpers/booking";
import {
  getAccessToken,
  getLoggedInStatus,
  getUser,
} from "../../../reducers/authReducer";
import ProgressBarSteps from "./ProgressBarSteps";
import {
  STEP_ADDITIONAL,
  STEP_CONFIRMATION,
  STEP_LOCATION,
  STEP_SCHEDULED,
  STEP_SCOPE,
} from "../../../constants/booking";
import { ScrollView } from "react-native-gesture-handler";
import css from "../../commonCss";
import Banner from "./components/Banner";
import ModalMenusScopeTermPricingFaq from "../../Booking/ModalMenusScopeTermPricingFaq";
import MessageModal from "../../Modals/MessageModal";
import { isLoading } from "../../../reducers/appReducer";

const BookingSteps = forwardRef(
  (
    {
      category,
      back,
      subCategoryId,
      showLogin,
      navigation,
      categoryId,
      isLoginStore,
      addressList,
    },
    ref
  ) => {
    const token = useSelector(getAccessToken);
    const [isRatingModal, setIsRatingModal] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [holidays, setHolidays] = useState([]);
    const [slots, setSlots] = useState([]);
    const [currentSlot, setCurrentSlot] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [date, setDate] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // const address = useSelector();
    //const [address, setAddress] = useState(useSelector(getAddress));
    const [address, setAddress] = useState("");

    const [charges, setCharges] = useState({ finalEstimate: 0 });
    const [descriptiveAnswer, setDescriptiveAnswer] = useState(null);
    const [booleanAnswer, setBooleanAnswer] = useState(null);
    const [wholeAnswer, setWholeAnswer] = useState(null);
    const [isVilla, setIsVilla] = useState(false);
    const [showAdditionalScreen, setShowAdditionalScreen] = useState(false);
    const [availableOffers, setAvailableOffers] = useState([]);
    const [images, setImages] = useState([]);
    const [promoData, setPromoData] = useState(null);
    const [appliedPromoCode, setAppliedPromoCode] = useState("");
    const [isOfferMessageOpen, setIsOfferMessageOpen] = useState(false);
    const [offerMessageTitle, setOfferMessageTitle] = useState(null);
    const [offerMessage, setOfferMessage] = useState(null);
    const [isLastStepReached, setIsLastStepReached] = useState(false);
    const [showError, setError] = useState(false);

    const isBgLoading = useSelector(isLoading);
    const user = useSelector(getUser);
    const isLoggedIn = useSelector(getLoggedInStatus);
    const dispatch = useDispatch();

    const { isMandatoryAttachment = false } = category || {};

    const [bookingForm, setBookingForm] = useState({
      subcategoryID: subCategoryId,
      // Desc //whole //Boolean
      answerIDS: [null, null, null],
      // problemImage: [],
      problemDetails: null,
      serviceType: null,
      scheduleDate: null,
      day: null,
      slotType: null,
      startTime: null,
      endTime: null,
      addressID: null,
      locationLat: null,
      locationLong: null,
      favouriteGenie: "FALSE",
    });

    useImperativeHandle(ref, () => ({
      resetState() {
        console.log("ref resetState");

        setBookingForm({
          subcategoryID: subCategoryId,
          // Desc //whole //Boolean
          answerIDS: [null, null, null],
          // problemImage: [],
          problemDetails: null,
          serviceType: null,
          scheduleDate: null,
          day: null,
          slotType: null,
          startTime: null,
          endTime: null,
          addressID: null,
          locationLat: null,
          locationLong: null,
          favouriteGenie: "FALSE",
        });

        setIsRatingModal(false);
        setActiveStep(0);
        setHolidays([]);
        setSlots([]);
        setCurrentSlot([]);
        setSelectedSlot(null);
        setDate(null);
        setIsLoginModalOpen(false);
        setCharges({ finalEstimate: 0 });
        setDescriptiveAnswer(null);
        setBooleanAnswer(null);
        setWholeAnswer(null);
        setIsVilla(null);
        setShowAdditionalScreen(false);
        setAvailableOffers([]);
        setImages([]);
        setPromoData(null);
        setAppliedPromoCode("");
        setIsOfferMessageOpen(false);
        setOfferMessageTitle(null);
        setOfferMessage(null);
        setIsLastStepReached(false);
        setError(false);

        console.log("chrages [index]", charges);
      },
    }));

    useEffect(() => {
      console.log("JING isLogin ", isLoginStore);

      loadAddressData();
    }, [isLoginStore]);

    const loadAddressData = async () => {
      console.log("loading address");

      await dispatch(showLoading());
      await dispatch(loadAddress());
      await dispatch(hideLoading());
    };

    useEffect(() => {
      const calculatedCharges = calculateCharges(
        category,
        bookingForm,
        {
          date,
          selectedSlot,
          wholeAnswer,
          booleanAnswer,
          selectedSlot,
          isVilla,
        },
        promoData
      );
      setCharges(calculatedCharges);
    }, [bookingForm, promoData]);

    const loadSlotsAndHolidays = async () => {
      if (!slots.length) {
        dispatch(showLoading());
        const holidays = await dispatch(loadHolidays());
        const slots = await dispatch(loadTimeSlots(subCategoryId));
        setSlots(slots);
        setHolidays(holidays);
        dispatch(hideLoading());
        // const currentSlot = getSlot(date, slots, category);
        // setCurrentSlot(currentSlot);
      }
    };

    const loadOffers = async () => {
      await dispatch(showLoading());
      const offers = await dispatch(loadRelatedOffers(subCategoryId));
      await dispatch(hideLoading());
      if (offers) {
        setAvailableOffers(offers);
      }
    };

    const updateScheduledData = async (scheduledInfo) => {
      const form = { ...bookingForm };
      setBookingForm((bookingForm) => ({ ...bookingForm, ...scheduledInfo }));
    };

    const onDateSelect = (dateOption, updateSlot = false) => {
      setDate(dateOption);
      updateScheduledData({
        scheduleDate: dateOption.iso,
        day: dateOption.day,
      });
      const currentSlot = getSlot(dateOption.fullDate, slots, category);
      setCurrentSlot(currentSlot);
      if ((selectedSlot == null || updateSlot) && currentSlot.length) {
        onSlotSelect({ ...currentSlot[0] });
      }
    };

    const onSlotSelect = (slot) => {
      setSelectedSlot(slot);
      updateScheduledData({
        serviceType: slot ? slot.type.toUpperCase() : null,
        slotType: slot.subType,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    };

    const submitAppoinment = async () => {
      const formData = new FormData();

      for (var key in bookingForm) {
        if (
          !isMandatoryAttachment &&
          ["problemDetails", "problemImage"].indexOf(key) !== -1
        ) {
          continue;
        }

        // if (key === 'problemImage' && images.length) {
        //     images.forEach((img, i) => {
        //         formData.append(`problemImage[${i}]`, img?.base64);
        //         // formData.append(`problemImage[${i}]`, {
        //         //     uri: img?.uri,
        //         //     name: img?.name,
        //         //     type: `image/${img?.format}`,
        //         // });
        //     });
        // } else if (key === 'problemImage' && images.length === 0) {
        //     continue;
        // }

        if (["slotType", "day"].indexOf(key) !== -1) {
          formData.append(key, bookingForm[key].toUpperCase());
          continue;
        }

        if (key === "answerIDS") {
          formData.append("answerIDS[0]", bookingForm[key][0]);
          formData.append("answerIDS[1]", bookingForm[key][1]);
          formData.append("answerIDS[2]", bookingForm[key][2]);
        } else {
          formData.append(key, bookingForm[key]);
        }
      }

      if (images.length) {
        images.forEach((img, i) => {
          formData.append(`problemImage[${i}]`, {
            uri: img?.uri,
            name: img?.name,
            type: `image/${img?.format}`,
          });
        });
      }

      console.log("formData booking ", formData);
      await dispatch(showLoading());
      const booking = await dispatch(bookAppointment(formData));
      await dispatch(hideLoading());
      if (!booking.hasOwnProperty("error")) {
        console.debug(
          "[Log][Booking][Confirmation][Appointment] Booked. ID",
          booking._id
        );
        // images.forEach((img) => { img.blob.close() });
        navigation.navigate("GenieLoaded", { bookingId: booking._id });
      } else {
        // show alert
      }
    };

    const validatorPromise = () => {
      console.log("VALIDATOR ", activeStep);
      // check SCOPE step 0
      if (activeStep === STEP_SCOPE) {
        if (
          descriptiveAnswer == null ||
          booleanAnswer == null ||
          wholeAnswer == null
        ) {
          // SCOPE missing selections
          console.log("SCOPE missing selections");

          return true;
        }
      }

      // check ADDITIONAL FILES and DESC 1 (Only if mandatory)
      if (isMandatoryAttachment && activeStep === STEP_ADDITIONAL) {
        if (
          images.length === 0 ||
          !bookingForm?.problemDetails ||
          bookingForm.problemDetails.length == 0
        ) {
          // Images and desc missing
          console.log("ADDITIONAL INFO Images/desc missing");

          return true;
        }
      }

      // check SCHEDULE Selections 2
      if (activeStep === STEP_SCHEDULED) {
        console.log("slots", currentSlot.length);
        if (selectedSlot == null || currentSlot.length == 0 || date == null) {
          // missing slot and date
          console.log("SCHEDULE missing slot/date");

          return true;
        }
      }

      // check LOCATION 3
      if (activeStep === STEP_LOCATION) {
        if (!bookingForm?.addressID) {
          // missing address
          console.log("LOCATION missing address");

          return true;
        }
      }

      // check SUMMARY 4
      if (activeStep === STEP_CONFIRMATION && isMandatoryAttachment) {
        console.log("isMandatoryAttachment ", isMandatoryAttachment);
        if (
          images.length === 0 ||
          !bookingForm?.problemDetails ||
          bookingForm.problemDetails.length == 0
        ) {
          // Images and desc missing
          console.log("ADDITIONAL INFO Images/desc missing");

          return true;
        }
      }

      return false;
    };

    const changeNextStep = async () => {
      const valid = validatorPromise();

      if (isBgLoading) return;

      let nextStep = activeStep + 1;
      if (isLastStepReached) {
        if (valid) {
          setError(true);
          return;
        } else {
          setActiveStep(STEP_CONFIRMATION);
          setIsLastStepReached(false);
          return;
        }
      }

      if (activeStep === 0) {
        await loadSlotsAndHolidays();
      }

      if (!isMandatoryAttachment && activeStep + 1 === STEP_ADDITIONAL) {
        nextStep = activeStep + 2;
      }

      if (activeStep + 1 === STEP_LOCATION && !isLoggedIn) {
        setIsLoginModalOpen(true);
        return;
      }

      if (activeStep + 3 === STEP_LOCATION && isLoggedIn) {
        await dispatch(showLoading());
        await dispatch(loadAddress());
        await dispatch(hideLoading());
      }

      if (activeStep < STEP_CONFIRMATION) {
        console.log("nextStep ", nextStep);

        if (valid) {
          setError(true);
          return;
        } else {
          setActiveStep(nextStep);
        }
      }

      if (activeStep === STEP_CONFIRMATION) {
        if (valid) {
          setError(true);
          return;
        } else {
          submitAppoinment();
        }
      }
    };

    const changePreviousStep = () => {
      let prevStep = activeStep - 1;

      if (!isMandatoryAttachment && activeStep - 1 === STEP_ADDITIONAL) {
        prevStep = activeStep - 2;
      }

      if (activeStep > 0) {
        setActiveStep(prevStep);
      }
    };

    const changeStep = (step) => {
      setActiveStep(step);
    };

    const updateScopeData = (index, answer) => {
      let { answerIDS } = bookingForm;
      answerIDS[index] = answer._id;
      setBookingForm({
        ...bookingForm,
        answerIDS,
      });

      if (index === 0) {
        setDescriptiveAnswer(answer);
      } else if (index === 1) {
        setWholeAnswer(answer);
      } else {
        setBooleanAnswer(answer);
      }
    };

    const updateAdditionalData = (problemDetails) => {
      setBookingForm({
        ...bookingForm,
        problemDetails,
      });
    };

    const updateAddressData = (data, addressType) => {
      console.log("updateAddressData ", data);
      console.log("updateAddressData ", addressType);
      setIsVilla(addressType == "VILLA");
      setBookingForm({
        ...bookingForm,
        ...data,
      });
    };

    const handleApplyOffer = async (promoCode) => {
      const formData = new FormData();
      formData.append("customerID", user.id);
      formData.append("categoryID", categoryId);
      formData.append("subCategoryID", subCategoryId);
      formData.append("scheduleDate", bookingForm.scheduleDate);
      formData.append("promoCode", promoCode);
      await dispatch(showLoading());
      const pCode = await dispatch(applyPromoCode(formData));
      await dispatch(hideLoading());

      if (pCode.hasOwnProperty("error")) {
        setOfferMessageTitle(pCode.message);
        setOfferMessage(pCode.responseType);
      } else {
        setOfferMessageTitle("Success");
        setOfferMessage("Promo Code Applied Successfully");
        setPromoData(pCode);
        setAppliedPromoCode(promoCode);
        console.log("promoCode", promoCode);
      }
      setIsOfferMessageOpen(true);
    };

    const removePromoCode = () => {
      setPromoData(null);
      setAppliedPromoCode("");
    };

    const handleLoginSuccess = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await loadOffers();
      await changeNextStep();
      setTimeout(() => {
        setIsLoginModalOpen(false);
      }, 500);
    };

    const footerRef = React.useRef(null);

    const getFooter = () => (
      <BookingFooter
        ref={footerRef}
        charges={charges}
        style={{ flex: 2, flexBasis: 60, flexGrow: 0 }}
        next={changeNextStep}
        prev={changePreviousStep}
        category={category}
        bookingForm={bookingForm}
        descriptiveAnswer={descriptiveAnswer}
        wholeAnswer={wholeAnswer}
        booleanAnswer={booleanAnswer}
        selectedSlot={selectedSlot}
        date={date}
        offers={availableOffers}
        loadOffers={loadOffers}
        activeStep={activeStep}
        onApplyOffer={handleApplyOffer}
        appliedPromoCode={appliedPromoCode}
        onRemoveOffer={removePromoCode}
        addressID={bookingForm?.addressID}
        address={addressList}
        isLastStep={activeStep === STEP_CONFIRMATION}
      />
    );

    return (
      <View style={{ flex: 1 }}>
        <ProgressBarSteps activeStep={activeStep} />
        <ScrollView>
          <View style={[css.section, { marginTop: 0 }]}>
            <View style={[css.container]}>
              <Banner back={changePreviousStep} activeStep={activeStep} />
              <View>
                {activeStep === STEP_SCOPE && (
                  <StepScope
                    category={category}
                    updateFormData={updateScopeData}
                    prev={() => back()}
                    answers={{
                      descriptiveAnswer,
                      booleanAnswer,
                      wholeAnswer,
                    }}
                  />
                )}
                {activeStep === STEP_ADDITIONAL && (
                  <StepAdditionalInfo
                    updateAdditionalData={updateAdditionalData}
                    images={images}
                    updateImages={setImages}
                    value={bookingForm.problemDetails}
                    isMandatoryAttachment={isMandatoryAttachment}
                  />
                )}
                {activeStep === STEP_SCHEDULED && (
                  <StepSchedule
                    holidays={holidays}
                    availableSlots={slots}
                    slots={currentSlot}
                    date={date}
                    selectedSlot={selectedSlot}
                    style={{ flex: 1, flexGrow: 1 }}
                    prev={changePreviousStep}
                    onDateSelect={onDateSelect}
                    onSlotSelect={onSlotSelect}
                    category={category}
                  />
                )}
                {activeStep === STEP_LOCATION && (
                  <StepLocation
                    addressID={bookingForm.addressID}
                    address={address}
                    style={{ flex: 1, flexGrow: 1 }}
                    updateAddressData={updateAddressData}
                    prev={changePreviousStep}
                    category={category}
                    key={subCategoryId}
                  />
                )}
                {activeStep === STEP_CONFIRMATION && (
                  <StepConfirmation
                    style={{ flex: 1, flexGrow: 1 }}
                    prev={changePreviousStep}
                    category={category}
                    bookingForm={bookingForm}
                    changeStep={changeStep}
                    descriptiveAnswer={descriptiveAnswer}
                    wholeAnswer={wholeAnswer}
                    booleanAnswer={booleanAnswer}
                    selectedSlot={selectedSlot}
                    date={date}
                    charges={charges}
                    setIsLastStepReached={setIsLastStepReached}
                    images={images}
                    updateImages={setImages}
                    setPromoCode={() => {
                      console.log("setPromoCode index");
                      footerRef?.current?.displayOffers();
                    }}
                    appliedPromoCode={appliedPromoCode}
                  />
                )}
              </View>
            </View>
          </View>
          <ModalMenusScopeTermPricingFaq data={category} />
        </ScrollView>
        {getFooter()}
        {isLoginModalOpen && (
          <LoginModal
            changeData={true}
            falseData={(data) => setIsLoginModalOpen(data)}
            userData={() => { }}
            onSuccess={handleLoginSuccess}
          />
        )}
        {isOfferMessageOpen && (
          <MessageModal
            isVisible={isOfferMessageOpen}
            onClose={() => setIsOfferMessageOpen(false)}
            message={offerMessageTitle}
            message2={offerMessage}
            button="OKAY, GOT IT"
          />
        )}
        {showError && (
          <MessageModal
            isVisible={showError}
            onClose={() => setError(false)}
            message={"Note"}
            message2={"Please fill in all the mandatory details"}
            button="OKAY, GOT IT"
          />
        )}
      </View>
    );
  }
);

// export default BookingSteps;

export default connect(
  (state) => ({
    isLoginStore: state.auth.isLoggedIn,
    addressList: state.user.address,
  }),
  null,
  null,
  { forwardRef: true }
)(BookingSteps);
