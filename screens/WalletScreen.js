import React, { Component, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl
} from "react-native";
import moment from "moment";
import "moment-timezone";
import axios from "axios";
import { AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import Text from "../components/MyText";
import css from "../components/commonCss";
import HeaderTitle from "../components/ui/HeaderTitle";
import ModalComingSoon from "../components/Modals/ModalComingSoon";
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken } from "../reducers/authReducer";
import { hideLoading, showLoading } from "../reducers/appReducer";
import { BASE_URL } from "../base_file";
import { getVoucher, getWallet, getWalletData, getWalletTransaction, getWalletTransactionData } from "../reducers/walletReducer";
import TextComp from "../components/TextComp";
import ErrorMessage, { showError } from "../ErrorMessage";
let imgPath = "../assets/icons/";
export default function WalletScreen({ navigation }) {
  const token = useSelector(getAccessToken);
  const dispatch = useDispatch();
  const [voucherText, onChangeVoucherText] = useState(null);
  const [errorData, setErrorData] = useState(null);
  let [walletData, setWalletData] = useState(useSelector(getWalletData))
  let [walletTransaction, setWalletTransaction] = useState(useSelector(getWalletTransactionData))
  // const [walletData, setWalletData] = useState(false);
  // const [walletTransaction, setWalletTransaction] = useState(false);
  const [voucherAmount, setVoucherAmount] = useState(null);
  const [isModalComponentVisible, setIsModalComponentVisible] = useState(false);
  const [addcreditModal, setAddcreditModal] = useState(false);
  const [successCreditModal, setSuccessCreditModal] = useState(false);
  console.log('walletData [walletScreen]', walletData);
  console.log('walletTransaction [walletScreen]', walletTransaction);
  let debit = walletTransaction.debit;
  let credit = walletTransaction.credit;
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    if (token) {
      console.log('refreshed');
      await setRefreshing(true);
      await dispatch(showLoading())
      await dispatch(getWallet())
      await dispatch(getWalletTransaction())
      await dispatch(hideLoading());
      await setRefreshing(false);
    } else {
      navigation.navigate('HomePage');
    }
  }, []);
  const submitVoucher = async (voucherText) => {
    console.log('voucher Text', voucherText);
    if (voucherText != null) {
      //setAddcreditModal(false)
      console.log('voucher Text [null]', voucherText);
      dispatch(showLoading())
      let params = new FormData();
      params.append('voucherCode', voucherText);
      console.log('params [voucherCode]', params);
      const isUpdated = await dispatch(getVoucher(params))
      if (isUpdated) {
        console.log('amount [voucher code]', isUpdated);
        setVoucherAmount(isUpdated.amount);
        onChangeVoucherText(null);
        setAddcreditModal(false);
        setSuccessCreditModal(true);
        console.log('voucherText submitted', voucherAmount);
      } else {
        console.log('applyVoucher failed');
      }
      dispatch(hideLoading())
    } else {
      setErrorData('Please enter voucher code');
    }
  }
  return (
    <View style={styles.screen}>
      <HeaderTitle title="Wallet" />
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />}
      >
        {walletData &&
          <View style={[css.section]}>
            <View style={[css.container]}>
              <View style={[css.flexDCSB]}>
                <View
                  style={[
                    css.boxShadow,
                    css.whiteBG,
                    css.borderRadius10,
                    css.padding20,
                  ]}
                >
                  <View
                    style={[
                      css.brandBG,
                      css.padding20,
                      css.flexDRSB,
                      css.borderRadius10,
                    ]}
                  >
                    <View style={[css.width40, css.flexWrapW, css.flexDR]}>
                      <Text style={[css.fbo, css.f14, css.whiteC]}>
                        Wallet Balance
                      </Text>
                      <Text style={[css.fbo, css.f12, css.whiteC]}>
                        as on {walletData.updatedAt}
                      </Text>
                    </View>
                    <View style={[css.alignSelfC, css.flexDR, css.width60, css.flexWrapW, css.justifyContentFE]}>
                      <Text
                        style={[
                          css.whiteC,
                          css.f24,
                          css.fbo,
                          { color: "#FFFFFF77" },
                        ]}
                      >
                        AED{" "}
                      </Text>
                      <Text style={[css.whiteC, css.f24, css.fbo]}>
                        {walletData.totalAmount}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={[css.blackC, css.fm, css.f12, css.spaceT10]}>
                      Wallet credit can be used only with card payment.{" "}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        css.blackC,
                        css.spaceT10,
                        css.f18,
                        css.spaceT10,
                        css.spaceB10,
                        css.fsb,
                      ]}
                    >
                      History{" "}
                    </Text>
                  </View>
                  <View>
                    <View style={[css.flexDRSB]}>
                      <Text style={[css.brandC, css.f18, css.fsb]}>EARNED</Text>
                      <Text style={[css.f18, css.fsb, css.grayC]}>
                        AED
                      </Text>
                    </View>
                    <View>
                      {credit.length > 0 ?
                        <FlatList
                          data={credit}
                          keyExtractor={(item) => item._id}
                          renderItem={({ item }) => (
                            <View style={[css.flexDRSB, css.spaceB20]}>
                              <View style={[styles.walletLeftData]}>
                                <View><TextComp>{item.description}</TextComp></View>
                                <View style={[css.flexDR, css.imgFull]}><TextComp style={[css.grayC, css.f11, css.fm]}>{item.createdAt}</TextComp></View>
                              </View>
                              <View style={[styles.walletRightData]}>
                                <Text style={[css.f14, css.fm, css.blackC]}>{item.amount}</Text>
                              </View>
                            </View>
                          )}
                        />
                        :
                        <View style={[css.spaceB20, css.flexDR]}>
                          <Text
                            style={[
                              css.blackC,
                              css.f18,
                              css.fm,
                              css.imgFull,
                              css.textCenter,
                            ]}
                          >
                            No wallet balance earned yet.
                          </Text>
                        </View>
                      }
                    </View>
                  </View>
                  <View style={[css.flexDRSB]}>
                    <Text style={[css.yellowC, css.f18, css.fsb]}>USED</Text>
                    <Text style={[css.f18, css.fsb, css.grayC]}>
                      AED
                    </Text>
                  </View>
                  <View style={[css.flexDRSB]}>
                    {debit.length > 0 ?
                      <FlatList
                        data={debit}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                          <View style={[css.flexDRSB, css.spaceB20]}>
                            <View style={[styles.walletLeftData]}>
                              <View><TextComp>{item.description}</TextComp></View>
                              <View style={[css.flexDR, css.imgFull]}><TextComp style={[css.grayC, css.f11, css.fm]}>{item.createdAt}</TextComp></View>
                            </View>
                            <View style={[styles.walletRightData]}>
                              <Text style={[css.f14, css.fm, css.blackC]}>{item.amount}</Text>
                            </View>
                          </View>
                        )}
                      />
                      :
                      <View style={[css.spaceB20, css.flexDR]}>
                        <Text
                          style={[
                            css.blackC,
                            css.f18,
                            css.fm,
                            css.imgFull,
                            css.textCenter,
                          ]}
                        >
                          No wallet balance used yet.
                        </Text>
                      </View>
                    }
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    style={[
                      css.yellowBG,
                      css.alignItemsC,
                      css.justifyContentC,
                      css.borderRadius10,
                      css.padding10,
                      css.marginT30,
                    ]}
                    onPress={() => setAddcreditModal(true)}
                  //onPress={() => setIsModalComponentVisible(true)}
                  >
                    <Text style={[css.f20, css.whiteC, css.fbo]}>+ ADD</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        }
      </ScrollView>
      <Modal
        isVisible={addcreditModal}
        //animationIn="fadeIn"
        animationInTiming={700}
        //animationOut="fadeOut"
        animationOutTiming={700}
        coverScreen={true}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        <View style={css.centeredView}>
          <View style={css.modalNewView}>
            <View style={[css.modalNewHeader]}>
              <TouchableOpacity
                style={[css.flexDR]}
                onPress={() => { onChangeVoucherText(null), setErrorData(null), setAddcreditModal(false) }}
              >
                <AntDesign name="arrowleft" size={24} color="#525252" />
              </TouchableOpacity>
              <View>
                <Text style={[css.modalNewTitle]}>
                  + Add Credit to Your Wallet
                </Text>
              </View>
              <View>
                <Text style={[css.modalNewText]}>
                  Please enter your voucher or referral code to {"\n"} add
                  credit to your account.
                </Text>
              </View>
            </View>
            <View style={[css.modalNewBody, css.alignItemsC, css.justifyContentC]}>
              <TextInput
                placeholder="Enter Voucher / Referral Code"
                style={[css.fr, css.blackC, css.f12, css.borderRadius10, css.borderGrey1, css.img90, css.padding10]}
                onChangeText={onChangeVoucherText}
                value={voucherText}
              />
              {errorData && <TextComp style={[css.cMaroon, css.marginT10]}>{errorData}</TextComp>}
              <TouchableOpacity
                //onPress={() => handleSubmit()}
                onPress={() => submitVoucher(voucherText)}
                style={[
                  css.boxShadow,
                  css.alignItemsC,
                  css.justifyContentC,
                  css.spaceT20,
                  css.BGbrand,
                  css.width25,
                  css.height40,
                  css.borderRadius10
                ]}
              >
                <Text style={[css.whiteC, css.fsb, css.f18]}>ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={successCreditModal}
        animationInTiming={700}
        animationOutTiming={700}
        coverScreen={true}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        <View style={css.centeredView}>
          <View style={css.modalNewView}>
            <View style={[css.modalNewHeader]}>
              <View style={[css.flexDC]}>
                <View style={[css.alignItemsC, css.justifyContentC]}><Image style={{ width: 136, height: 78 }} source={require(imgPath + 'wallet-icon-plus.png')} /></View>
                <Text style={[css.modalNewTitle]}>
                  {voucherAmount} Credited to Wallet
                </Text>
              </View>
              <View>
                <Text style={[css.modalNewText]}>
                  Your voucher was credited successfully!, You can use this amount in your next booking.
                </Text>
              </View>
            </View>
            <View style={[css.modalNewBody, css.alignItemsC, css.justifyContentC]} >
              <TouchableOpacity
                onPress={() => { setSuccessCreditModal(false), onRefresh() }}
                style={[
                  css.boxShadow,
                  css.alignItemsC,
                  css.justifyContentC,
                  css.spaceT20,
                  css.yellowBG,
                  css.width25,
                  css.height40,
                  css.borderRadius10
                ]}
              >
                <Text style={[css.whiteC, css.fsb, css.f16]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ModalComingSoon
        isVisible={isModalComponentVisible}
        onClose={() => setIsModalComponentVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  walletLeftData: {
    flexWrap: "wrap",
    width: "70%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },
  walletRightData: {
    flexWrap: "wrap",
    width: "30%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "flex-start",
  },
});
