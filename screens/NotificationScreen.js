import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, ScrollView, Image, Dimensions, FlatList, Pressable, RefreshControl, } from "react-native";
import Text from "../components/MyText";
import css from "../components/commonCss";
import { AntDesign } from '@expo/vector-icons';
import HeaderTitle from "../components/ui/HeaderTitle";
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken } from "../reducers/authReducer";
import { hideLoading, showLoading } from "../reducers/appReducer";
import { BASE_URL } from "../base_file";
import { getNotificationData, getNotifications } from "../reducers/notificationReducer";
let imgPath = '../assets/icons/';
const windowHeight = Dimensions.get('window').height;
export default function NotificationScreen({ navigation }) {
    let [notificationData, setNotificationData] = useState(useSelector(getNotificationData))
    const token = useSelector(getAccessToken);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        if (token) {
            await setRefreshing(true);
            await dispatch(showLoading());
            await dispatch(getNotifications());
            await dispatch(hideLoading());
            await setRefreshing(false);
        } else {
            navigation.navigate('HomePage');
        }
    }, []);
    console.log('notificationData [notification screen]', notificationData);
    return (
        <View style={styles.screen}>
            <HeaderTitle title='Notifications' />
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
            >
                <View style={[css.container]}>
                    {notificationData.length > 0 ?
                        <FlatList
                            data={notificationData}
                            contentContainerStyle={{ padding: 3 }}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <View style={[css.boxShadow, css.imgFull, css.whiteBG, css.borderRadius10, css.padding20, css.marginB10]}>
                                    <View style={[css.line10, css.flexDR]}>
                                        <Image style={[css.img20, css.marginR10]} source={require(imgPath + 'iconNotification.png')} />
                                        {item.appointmentId &&
                                            <Text style={[css.fm, css.f14, css.blackC, css.alignSelfC]}>
                                                {(item.notification_type == 'BOOKING_CONFIRMED') ? 'Booking Confirmed'
                                                    : (item.notification_type == 'APPOINTMENT_CANCELLED') ? 'Appointment Cancelled'
                                                        : (item.notification_type == 'JOB_COMPLETION') ? 'Job Completion'
                                                            : (item.notification_type == 'CUSTOMER_ESTIMATE') ? 'Customer Estimate'
                                                                :
                                                                ''}
                                            </Text>
                                        }
                                    </View>
                                    <View style={[css.line10]}>
                                        <View style={[css.flexDR,]}>
                                            <Text style={[css.fbo, css.f14, css.greyC, css.marginR20]}>Job ID</Text>
                                            <Text style={[css.fbo, css.f14, css.blackC]}>{item.appointmentId.uniqueCode}</Text>
                                        </View>
                                        {item.text &&
                                            <View><Text style={[css.fr, css.f11, css.blackC]}>{item.text}</Text></View>
                                        }
                                    </View>
                                    {item.appointmentId &&
                                        <View style={[css.flexDRR]}>
                                            <Pressable onPress={() => navigation.navigate("JobdetailPage", {
                                                token: token, jobId: item.appointmentId._id, bookingStatus: 'ongoing'
                                            })}>
                                                <AntDesign name="arrowright" size={20} color="#525252" />
                                            </Pressable>
                                        </View>
                                    }
                                </View>
                            )}
                        />
                        :
                        <View style={{ height: windowHeight }}>
                            <View style={[css.alignItemsC, css.justifyContentC, { flex: 0.7 }]}>
                                <Text style={[css.fsb, css.f24, css.blackC]}>No Notification</Text>
                            </View>
                        </View>
                    }
                </View>
            </ScrollView>
        </View >

    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#f4f5f8' }
});