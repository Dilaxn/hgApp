import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../base_file";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import MessageModal from "../components/Modals/MessageModal";
import CategoryConverter from "../converters/categoryConverter";
import { hideLoading, showLoading } from "./appReducer";
import { showError } from "../ErrorMessage";
import { logout } from "../reducers/authReducer";

//CITIES
export const LOAD_CITIES = "hg/category/LOAD_CITIES";
export const LOAD_CITIES_SUCCESS = "hg/category/LOAD_CITIES_SUCCESS";
export const LOAD_CITIES_FAIL = "hg/category/LOAD_CITIES_FAIL";

export const LOAD_CATEGORY = "hg/category/LOAD_CATEGORY";
export const LOAD_CATEGORY_SUCCESS = "hg/category/LOAD_CATEGORY_SUCCESS";
export const LOAD_CATEGORY_FAIL = "hg/category/LOAD_CATEGORY_FAIL";

export const LOAD_SUBCATEGORY = "hg/category/LOAD_SUBCATEGORY";
export const LOAD_SUBCATEGORY_SUCCESS = "hg/category/LOAD_SUBCATEGORY_SUCCESS";
export const LOAD_SUBCATEGORY_FAIL = "hg/category/LOAD_SUBCATEGORY_FAIL";

export const LOAD_ALLCATEGORY = "hg/category/LOAD_ALLCATEGORY";
export const LOAD_ALLCATEGORY_SUCCESS = "hg/category/LOAD_ALLCATEGORY_SUCCESS";
export const LOAD_ALLCATEGORY_FAIL = "hg/category/LOAD_ALLCATEGORY_FAIL";

export const UPDATE_MAIN_CATEGORY = "hg/category/UPDATE_MAIN_CATEGORY";
export const UPDATE_CATEGORY = "hg/category/UPDATE_SUB_CATEGORY";
export const UPDATE_COUNTRY = "hg/category/UPDATE_COUNTRY";
export const UPDATE_ACTIVE_SUBCATEGORY =
  "hg/category/UPDATE_ACTIVE_SUBCATEGORY";

export const LOAD_SPECIAL_CATEGORY = "hg/category/LOAD_SPECIAL_CATEGORY";
export const LOAD_SPECIAL_CATEGORY_SUCCESS =
  "hg/category/LOAD_SPECIAL_CATEGORY_SUCCESS";
export const LOAD_SPECIAL_CATEGORY_FAIL =
  "hg/category/LOAD_SPECIAL_CATEGORY_FAIL";

export const LOAD_OFFERS = "hg/category/LOAD_OFFERS";
export const LOAD_OFFERS_SUCCESS = "hg/category/LOAD_OFFERS_SUCCESS";
export const LOAD_OFFERS_FAIL = "hg/category/LOAD_OFFERS_FAIL";

export const LOAD_TIME_SLOTS = "hg/booking/LOAD_TIME_SLOTS";
export const LOAD_TIME_SLOTS_SUCCESS = "hg/booking/LOAD_TIME_SLOTS_SUCCESS";
export const LOAD_TIME_SLOTS_FAIL = "hg/booking/LOAD_TIME_SLOTS_FAIL";

export const LOAD_SUBCATEGORY_CONTENT = "hg/category/LOAD_SUBCATEGORY_CONTENT";
export const LOAD_SUBCATEGORY_CONTENT_SUCCESS =
  "hg/category/LOAD_SUBCATEGORY_CONTENT_SUCCESS";
export const LOAD_SUBCATEGORY_CONTENT_FAIL =
  "hg/category/LOAD_SUBCATEGORY_CONTENT_FAIL";
export const RESET_SUBCATEGORY_CONTENT =
  "hg/category/RESET_SUBCATEGORY_CONTENT";

export const LOAD_SERVICE_SUCCESS = "hg/category/LOAD_SERVICE_SUCCESS";

export const LOAD_POPULAR_SERVICE_SUCCESS =
  "hg/category/LOAD_POPULAR_SERVICE_SUCCESS";
export const LOAD_POPULAR_SERVICE_FAIL =
  "hg/category/LOAD_POPULAR_SERVICE_FAIL";

const initialState = {
  cities: null,
  currentCity: "Dubai",
  currentLang: "en",
  allCategory: null,
  currentMainCategory: null,
  currentSubCategory: null,
  activeSubCategory: null,
  specialCategory: null,
  offers: null,
  subCategoryContent: null,
  mapData: [],

  mainCategory: null,
  category: null,
  subCategory: null,

  activeMainCategoryId: null,
  activeCategoryId: null,
  activeSubCategoryId: null,
  popularService: null,
  services: [],
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_CITIES:
      return {
        ...state,
        isCitiesLoading: true,
        isCitiesLoadingError: null,
      };
    case LOAD_CITIES_SUCCESS:
      return {
        ...state,
        isCitiesLoading: false,
        isCitiesLoadingError: null,
        cities: action.payload,
      };
    case LOAD_CITIES_FAIL:
      return {
        ...state,
        isCitiesLoading: false,
        isCitiesLoadingError: true,
      };
    case LOAD_CATEGORY:
      return {
        ...state,
        isCategoryLoading: true,
        isCategoryLoadingError: false,
      };
    case LOAD_CATEGORY_SUCCESS:
      return {
        ...state,
        isCategoryLoadingError: false,
        ...action.payload,
      };
    case LOAD_CATEGORY_FAIL:
      return {
        ...state,
        isCategoryLoading: false,
        isCategoryLoadingError: true,
      };
    case LOAD_SUBCATEGORY:
      return {
        ...state,
        isSubCategoryLoading: true,
        isSubCategoryLoadingError: false,
      };
    case LOAD_SUBCATEGORY_SUCCESS:
      return {
        ...state,
        isSubCategoryLoading: false,
        isSubCategoryLoadingError: false,
        subCategory: action.payload,
      };
    case LOAD_SUBCATEGORY_FAIL:
      return {
        ...state,
        isSubCategoryLoading: false,
        isSubCategoryLoadingError: true,
      };
    case LOAD_ALLCATEGORY:
      return {
        ...state,
        isAllCategoryLoading: true,
        isAllCategoryLoadingError: false,
      };
    case LOAD_ALLCATEGORY_SUCCESS:
      return {
        ...state,
        isAllCategoryLoading: false,
        isAllCategoryLoadingError: false,
        allCategory: action.payload,
      };
    case LOAD_ALLCATEGORY_FAIL:
      return {
        ...state,
        isAllCategoryLoading: false,
        isAllCategoryLoadingError: true,
      };
    case LOAD_SPECIAL_CATEGORY:
      return {
        ...state,
        isSpecialCategoryLoading: true,
        isSpecialCategoryLoadingError: false,
      };
    case LOAD_SPECIAL_CATEGORY_SUCCESS:
      return {
        ...state,
        isSpecialCategoryLoading: true,
        isSpecialCategoryLoadingError: false,
        specialCategory: action.payload,
      };
    case LOAD_SPECIAL_CATEGORY_FAIL:
      return {
        ...state,
        isSpecialCategoryLoading: false,
        isSpecialCategoryLoadingError: true,
      };
    case LOAD_OFFERS:
      return {
        ...state,
        isOfferssLoading: true,
        isOffersLoadingError: null,
      };
    case LOAD_OFFERS_SUCCESS:
      return {
        ...state,
        isOfferssLoading: false,
        isOffersLoadingError: null,
        offers: action.payload,
      };
    case LOAD_OFFERS_FAIL:
      return {
        ...state,
        isOfferssLoading: false,
        isOffersLoadingError: true,
      };
    case UPDATE_MAIN_CATEGORY:
      return {
        ...state,
        activeMainCategoryId: action.payload,
      };
    case UPDATE_CATEGORY:
      return {
        ...state,
        activeCategoryId: action.payload,
      };
    case UPDATE_COUNTRY:
      return {
        ...state,
        currentCity: action.payload,
      };
    case UPDATE_ACTIVE_SUBCATEGORY:
      return {
        ...state,
        activeSubCategoryId: action.payload,
      };
    case RESET_SUBCATEGORY_CONTENT:
      return {
        ...state,
        subCategoryContent: null,
      };
    case LOAD_SUBCATEGORY_CONTENT_SUCCESS:
      return {
        ...state,
        subCategoryContent: action.payload,
        isSubcategoryContentLoading: false,
        isSubcategoryContentLoadingError: false,
      };
    case LOAD_SUBCATEGORY_CONTENT_FAIL:
      return {
        ...state,
        isSubcategoryContentLoading: false,
        isSubcategoryContentLoadingError: true,
      };
    case LOAD_SERVICE_SUCCESS:
      return {
        ...state,
        services: action.payload,
      };
    case LOAD_POPULAR_SERVICE_SUCCESS:
      return {
        ...state,
        popularService: action.payload,
        isPopularServiceLoading: false,
        isPopularServiceLoadingError: false,
      };
    case LOAD_POPULAR_SERVICE_FAIL:
      return {
        ...state,
        isPopularServiceLoading: false,
        isPopularServiceLoadingError: true,
      };
    default:
      return state;
  }
}

// export const init = () => async dispatch => {
//   await dispatch(showLoading());
//   await dispatch(loadCountry());
//   await dispatch(loadSpecialCategory());
//   await dispatch(loadCategory());
//   await dispatch(loadSubCategory());
//   await dispatch(loadAllCategory());
//   await dispatch(loadOffers());
//   await dispatch(hideLoading());
// }
export const init = () => async (dispatch) => {
  await dispatch(showLoading());
  await dispatch(loadCountry());
  await Promise.all([
    dispatch(loadSpecialCategory()),
    dispatch(loadCategory()),
    dispatch(loadSubCategory()),
    dispatch(loadAllCategory()),
    dispatch(loadOffers()),
  ]);
  await dispatch(hideLoading());
};

const loadError = async (data) => {
  console.log("allError statusCode", data.statusCode);
  if (data.statusCode != 200) {
    await dispatch(
      showError({
        title: "Error",
        message: data?.message,
        statusCode: data?.statusCode,
      })
    );
  }
};
export const loadCountry = () => async (dispatch) => {
  try {
    //console.debug(`[Log][App][Category Reducer][Country][Loading]`);
    let { data } = await axios.get(`${BASE_URL}webapi/getCity`);
    const payload = data.data.map((item) => ({
      label: item.name,
      value: item.name,
    }));
    //console.debug(`[Log][App][Category Reducer][Country][test]`, data.statusCode);
    //console.debug(`[Log][App][Category Reducer][Country][test]`, data.message);
    await loadError(data);
    dispatch({ type: LOAD_CITIES_SUCCESS, payload });
    //console.debug(`[Log][App][Category Reducer][Country][Loaded]`);

    return true;
  } catch (e) {
    //console.debug(`[Log][App][Category Reducer][Country][Loading Failed]`);
    dispatch({ type: LOAD_CITIES_FAIL });
  }
};

export const loadCategory = () => async (dispatch, getState) => {
  const { currentCity, currentLang, activeMainCategoryId, activeCategoryId } =
    getState().common;
  try {
    //console.debug(`[Log][App][Category Reducer][Maincategory][Loading]`);
    const { data } = await axios.get(
      `${BASE_URL}/webapi/getCategorySubCategoryUrlsForSiteMap?city=${currentCity}&language=${currentLang}`
    );
    const { mainCategory, category } = CategoryConverter.convertCategory(
      data.data
    );
    await dispatch({
      type: LOAD_CATEGORY_SUCCESS,
      payload: { mainCategory, category },
    });
    await loadError(data);
    if (activeMainCategoryId == null) {
      await dispatch(updateMainCategory(mainCategory[0].slug));
    }

    if (activeCategoryId == null) {
      await dispatch(updateCategory(category[0].id));
    }
    //console.debug(`[Log][App][Category Reducer][Maincategory][Loaded]`);
    return true;
  } catch (e) {
    //console.debug(`[Error][App][Category Reducer][Maincategory][Loaded]`, e);
    dispatch({ type: LOAD_CATEGORY_FAIL });
    return false;
  }
};

export const loadSubCategory = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}customer/getCategorySubcategoryName`
    );
    const payload = CategoryConverter.convertSubCategory(data.data);
    dispatch({ type: LOAD_SUBCATEGORY_SUCCESS, payload });
    //console.debug(`[Log][App][Category Reducer][Sub Category][Loaded]`);
    return true;
  } catch (e) {
    //console.debug(`[Error][App][Category Reducer][Sub Category][Loading Failed]`, e);
    dispatch({ type: LOAD_SUBCATEGORY_FAIL });
    return false;
  }
};

export const loadSpecialCategory = () => async (dispatch) => {
  try {
    //console.debug(`[Log][App][Category Reducer][Special Category][Loading]`);
    let res = await axios.get(`${BASE_URL}category/getSpecializedServices`);
    const payload = res.data.data[0];
    dispatch({ type: LOAD_SPECIAL_CATEGORY_SUCCESS, payload });
    await loadError(res.data);
    return true;
  } catch (e) {
    console.error(
      `[Error][App][Category Reducer][Special Category][Loading Failed]`,
      e
    );
    dispatch({ type: LOAD_SPECIAL_CATEGORY_FAIL, payload });
    return false;
  }
};

export const loadAllCategory = () => async (dispatch) => {
  try {
    //console.debug(`[Log][App][Category Reducer][All Category][Loading]`);
    const { data } = await axios.get(`${BASE_URL}category/getAllCategories`);
    const payload = CategoryConverter.convertAllCategory(data.data);
    dispatch({ type: LOAD_ALLCATEGORY_SUCCESS, payload });
    //console.debug(`[Log][App][Category Reducer][All Category][Loaded]`);
    await loadError(data);
    return true;
  } catch (e) {
    //console.error(`[Error][App][Category Reducer][All Category][Loading Failed]`, e);
    dispatch({ type: LOAD_ALLCATEGORY_FAIL });
    return false;
  }
};

export const loadOffers = () => async (dispatch, getState) => {
  const { currentCity, currentLang } = getState().common;
  try {
    const { data } = await axios.get(
      `${BASE_URL}Webapi/offers?city=${currentCity}&language=${currentLang}`
    );
    await loadError(data);
    const payload = data.data.data;
    dispatch({ type: LOAD_OFFERS_SUCCESS, payload });
    return true;
  } catch (e) {
    //console.log(e)
    dispatch({ type: LOAD_OFFERS_FAIL });
  }
};

export const loadSubCategoryContent = (slug) => async (dispatch, getState) => {
  const { currentCity, currentLang } = getState().common;
  try {
    //console.debug(`[Log][App][Category Reducer][Sub Category Content][Loading]`);
    const res = await axios.get(
      `${BASE_URL}subcategory/getSubCategory?url=${slug}&getContent=true&city=${currentCity}&language=${currentLang}`
    );
    const payload = res.data.data[0];
    dispatch({ type: LOAD_SUBCATEGORY_CONTENT_SUCCESS, payload });
    //console.debug(`[Log][App][Category Reducer][Sub Category Content][Loaded]`);
    return true;
  } catch (e) {
    console.error(
      `[Error][App][Category Reducer][Sub Category Content][Loading Failed]`,
      slug,
      e
    );
    dispatch({ type: LOAD_ALLCATEGORY_FAIL });
    return null;
  }
};

export const loadHolidays = () => async (dispatch) => {
  try {
    //console.debug(`[Log][App][Category Reducer][Holidays][Loading]`);
    const { data } = await axios.get(`${BASE_URL}webapi/getAllHolidays`);
    const payload = CategoryConverter.convertHolidays(data.data);
    //console.debug(`[Log][App][Category Reducer][Holidays][Loaded]`);
    return payload;
  } catch (e) {
    console.error(
      `[Error][App][Category Reducer][Holidays][Loading Failed]`,
      e
    );
    return null;
  }
};

export const loadTimeSlots = (categoryId) => async (dispatch) => {
  try {
    //console.debug(`[Log][App][Category Reducer][Time Slots][Loading]`);
    const { data } = await axios.get(
      `${BASE_URL}category/slots?categoryId=${categoryId}`
    );
    const payload = data.data.slots;
    //console.debug(`[Log][App][Category Reducer][Time Slots][loaded]`);
    return payload;
  } catch (e) {
    //console.debug(`[Error][App][Category Reducer][Time Slots][Loading Error]`, e);
    return null;
  }
};

export const bookAppointment = (bookingData) => async (dispatch, getState) => {
  const { token } = getState().auth;
  //console.log('bookingData', token);
  try {
    //console.debug(`[Log][App][Category Reducer][Create Booking][Updating]`);
    const response = await fetch(`${BASE_URL}appointment/bookAppointment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
      body: bookingData,
    });
    const json = await response.json();
    //console.debug(`[Log][App][Category Reducer][Create Booking][Created]`);
    if (json?.error || json?.statusCode != 200) {
      //console.log("ERROR Captured ", json?.statusCode)
      await dispatch(
        showError({
          title: "Error",
          message: json?.message,
          statusCode: json?.statusCode,
        })
      );
    }
    //console.log(json);
    return !!json.data ? json.data : json;
  } catch (e) {
    //console.debug(`[Error][App][Category Reducer][Create Booking][Error]`, e);
    return false;
  }
};

export const updateMainCategory = (category) => (dispatch) => {
  dispatch({ type: UPDATE_MAIN_CATEGORY, payload: category });
};

export const updateCategory = (category) => (dispatch) => {
  dispatch({ type: UPDATE_CATEGORY, payload: category });
};

export const updateCountry = (country) => (dispatch) => {
  dispatch({ type: UPDATE_COUNTRY, payload: country });
};

export const updateActiveSubCategory = (category) => (dispatch) => {
  // console.log("category>>", category);
  dispatch({ type: UPDATE_ACTIVE_SUBCATEGORY, payload: category });
};

//Selector
export const getCities = (state) => state.common.cities;
export const getCurrentCity = (state) => state.common.currentCity;
export const getMainCategory = (state) => state.common.mainCategory;
export const getCatgories = (state) => state.common.category;
export const getSubCatgories = (state) => state.common.subCategory;
export const getSpecialisedCategory = (state) => state.common.specialCategory;
export const getSubCategoryContent = (state) => state.common.subCategoryContent;
export const getAllCategories = (state) => state.common.allCategory;
export const getActiveMainCategoryId = (state) => state.common.activeMainCategoryId;
export const getActiveCategoryId = (state) => state.common.activeCategoryId;
export const getActiveSubCategoryId = (state) => state.common.activeSubCategoryId;
export const getServices = (state) => state.common.services;
export const getSpecialisedCategoryBanners = (state) => {
  let { specialCategory } = state.common;
  if (!specialCategory) {
    return null;
  }
  specialCategory = specialCategory.subcategories.map((item) => ({
    _id: item._id,
    subCategoryName: item.subCategoryName,
    url: item.url,
    image: item.image,
  }));
  const bannerFirst = specialCategory[0];
  const bannerSecond = specialCategory[1];
  const bannerThird = specialCategory.slice(2);
  return { bannerFirst, bannerSecond, bannerThird };
};
export const getOffers = (state) => {
  let offers = state.common.offers;
  if (!offers) {
    return <MessageModal message="Data not loaded, Refresh the App" />;
  }
  offers = offers?.map((item) => ({
    _id: item._id,
    validDate: item.promo
      ? moment(new Date(item.promo.endTime)).format("DD MMM, YY")
      : null,
    name: item.name,
    image: item.image,
    promoName: item.promo ? item.promo.name : null,
    trending: item.trending,
    soldCount: item.soldCount,
    categoryName: item.categoryName,
    termsCondition: item.tnc,
  }));
  return offers;
};

export const getSideBarCategory = (state) => {
  const { activeMainCategoryId, category } = state.common;

  if (!category) {
    return null;
  }

  const sidebarCategories = category.filter(
    (item) => item.mainCategory.indexOf(activeMainCategoryId) !== -1
  );
  return sidebarCategories;
};

export const getSubCategoryList = (state) => {
  const { activeCategoryId, subCategory } = state.common;

  if (!activeCategoryId || !subCategory) {
    return null;
  }
  const subCategories = subCategory.filter(
    (item) => item.categoryId === activeCategoryId
  );
  return subCategories;
};

export const loadPopularService = () => async (dispatch, getState) => {
  const { currentCity, currentLang } = getState().common;

  try {
    //console.debug(`[Log][App][Category Reducer][Popular Service][Loading]`);
    const { data } = await axios.get(
      `${BASE_URL}/webapi/getServiceGroup?city=${currentCity}&language=${currentLang}`
    );
    await loadError(data);
    const payload = data.data.flatMap(
      ({ category: mainCategory, categoryIds }) => [
        ...categoryIds
          .filter((category) => category.isPopular)
          .map((item) => ({
            mainCategory,
            id: item._id,
            imageURL: item.imageURL.thumbnail,
            name: item.name,
          })),
      ]
    );

    dispatch({ type: LOAD_POPULAR_SERVICE_SUCCESS, payload });

    const actualRawPayload = data?.data;
    //console.log("actualRawPayload ", actualRawPayload);

    dispatch({ type: LOAD_SERVICE_SUCCESS, payload: actualRawPayload });

    //console.debug(`[Log][App][Category Reducer][Popular Service][loaded]`);
    return payload;
  } catch (e) {
    //console.debug(`[Error][App][Category Reducer][Popular Service][Loading Error]`, e);
    return null;
  }
};
