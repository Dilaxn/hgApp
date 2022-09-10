import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Pressable, FlatList, Dimensions, Platform } from "react-native";
import React, { useEffect, useState, } from "react";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import moment from "moment";
import css from '../../commonCss';
import Text from '../../MyText';
import { getDaysInMonth, getServiceType, hasSlots } from "../../../helpers/common";
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
let imgPath = '../../../assets/icons/';

export default function StepSchedule({ prev, holidays, slots, availableSlots, date, selectedSlot, onDateSelect, onSlotSelect, category }) {
    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false);

    const dates = getDaysInMonth(holidays);
    const fullDate = date !== null ? date.fullDate : null;
    const selectedSlotIndex = selectedSlot !== null ? selectedSlot.index : null;

    // const dateS = date || dates[0].date;
    const currentDate = date || dates[0];
    const dayS = currentDate.day;
    const fullDateS = moment(currentDate.fullDate).format(' DD MMMM YYYY');
    const selectedDay = moment(currentDate.fullDate).format('ddd');

    useEffect(() => {
        if (dates && availableSlots.length && date === null) {
            dates.some(d => {
                if (!d.isDisabled) {
                    const hasSlts = hasSlots(d.fullDate, availableSlots);
                    if (!hasSlts) {
                        return false;
                    }
                    onDateSelect({ ...d });
                    return true;
                }
                return false;
            });
        }
    }, []);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        const d = moment(currentDate).format('YYYY-MM-DD');
        const c = dates.find(x => x.fullDate === d);
        onDateSelect({ ...c });

        scrollToSpecificDate(d);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const [getIndexDate, setIndexDate] = useState(0);
    const scrollRefDate = React.useRef(null);

    const onPressDateLeft = () => {
        const dataLength = dates?.length - 1;

        try {
            if (getIndexDate === 0) {
                // scrollRefDate.current?.scrollToIndex({ index: dataLength });
            } else {
                const i = getIndexDate - 3;
                scrollRefDate.current?.scrollToIndex({ index: i >= 0? i : 0 });
            }
        } catch (error) {
            console.log("error ",error)
        }
    }

    const onPressDateRight = () => {
        const dataLength = dates?.length - 1;

        try {
            if (getIndexDate === dataLength) {
                // scrollRefDate.current?.scrollToIndex({ index: 0 });
            } else {
                scrollRefDate.current?.scrollToIndex({ index: getIndexDate + 1 });
            }
        } catch (error) {
            console.log("error ",error)
        }

    }

    const [getIndexTime, setIndexTime] = useState(0);
    const scrollRefTime = React.useRef(null);

    const onPressTimeLeft = () => {
        const dataLength = dates?.length - 1;

        try {
            if (getIndexTime === 0) {
                // scrollRefTime.current?.scrollToIndex({ index: dataLength });
            } else {
                const i = getIndexTime - 3;
                scrollRefTime.current?.scrollToIndex({ index: i >= 0? i : 0 });
            }
        } catch (error) {
            console.log("error ",error)
        }
    }

    const onPressTimeRight = () => {
        const dataLength = dates?.length - 1;

        try {
            if (getIndexTime === dataLength) {
                // scrollRefTime.current?.scrollToIndex({ index: 0 });
            } else {
                scrollRefTime.current?.scrollToIndex({ index: getIndexTime + 1 });
            }
        } catch (error) {
            console.log("error ",error)
        }

    }

    const scrollToSpecificDate = (d) => {
        const c = dates.findIndex(x => x.fullDate === d);

        scrollRefDate.current?.scrollToIndex({ index: c });
    }

    const getDayFormat = (day) => {

        const days = {
            "Monday": "Mon", 
            "Tuesday": "Tue", 
            "Wednesday": "Wed", 
            "Thursday": "Thu", 
            "Friday": "Fri", 
            "Saturday": "Sat", 
            "Sunday": "Sun"
        };

        return days[day] || day
    }

    const getSelectedTime = () => {
        const selected = selectedSlot;

        if(selected && selected?.begin && selected?.end) {
            const begin = selected?.begin?.replace(":00","");
            const end = selected?.end?.replace(":00","");

            return begin + " - " + end + ","
        }

        return ""
    }

    return (
        <View style={[css.bookingScreenBox]}>
            <View><Text style={[css.brandC, css.fsb, css.f16]}>When do you need the service ?</Text></View>
            <View style={[css.alignItemsC, css.spaceT10]}>
                <Text style={[css.alignItemsC, { textTransform: 'uppercase' }]}>{selectedDay}, {getSelectedTime()} {fullDateS}</Text>
            </View>
            <View style={[css.spaceT10, css.alignItemsC]}>
                <TouchableOpacity style={[styles.buttonLeft]} onPress={onPressDateLeft}>
                    <Image style={{ transform: [{ rotate: "90deg" }], width: 50, height: 50 }} source={require(imgPath + 'arrowDown_hg.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonRight} onPress={onPressDateRight}>
                    <Image style={{ transform: [{ rotate: "90deg" }], width: 50, height: 50 }} source={require(imgPath + 'arrowUp_hg.png')} />
                </TouchableOpacity>
                <SwiperFlatList
                    autoplayLoop={false}
                    showPagination={false}
                    paginationStyleItem={{ backgroundColor: 'grey' }}
                    style={{ width: '85%' }}
                    data={dates}
                    index={0}
                    ref={scrollRefDate}
                    onChangeIndex={({ index }) => {
                        console.log('current index ', index)
                        setIndexDate(index);
                    }}
                    renderItem={({ item }) => {
                        const day = getDayFormat(item.day)

                        return (
                            <Pressable onPress={() => !item.isDisabled && onDateSelect(item, true)}>
                                <View style={[styles.serviceAllDates, item.isDisabled ? styles.disabled : '', item.fullDate == fullDate ? styles.activeDate : '']}>
                                    <Text style={[styles.serviceDay, item.fullDate == fullDate ? styles.activeDateDay : '']}>{day}</Text>
                                    <Text style={[styles.serviceDate, item.fullDate == fullDate ? styles.activeDateText : '']}>{item.date}</Text>
                                </View>
                            </Pressable>
                        )
                    }}
                />
            </View>
            <View style={[css.alignItemsC, css.spaceT20]}>
                {slots.length !== 0 &&
                    <>
                    <TouchableOpacity style={[styles.buttonLeft]} onPress={onPressTimeLeft}>
                        <Image style={{ transform: [{ rotate: "90deg" }], width: 50, height: 50 }} source={require(imgPath + 'arrowDown_hg.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonRight} onPress={onPressTimeRight}>
                        <Image style={{ transform: [{ rotate: "90deg" }], width: 50, height: 50 }} source={require(imgPath + 'arrowUp_hg.png')} />
                    </TouchableOpacity>
                        <SwiperFlatList
                            data={slots}
                            index={0}
                            ref={scrollRefTime}
                            onChangeIndex={({ index }) => {
                                console.log('current index time ', index)
                                setIndexTime(index);
                            }}
                            //PaginationComponent={CustomPagination}
                            style={{ width: '85%', }}
                            renderItem={({ item, index }) => {
                                const begin = item?.begin?.replace(":00","");
                                const end = item?.end?.replace(":00","");;
                                
                                return (
                                    <Pressable style={[styles.dateSlots, selectedSlotIndex == item.index ? styles.activeSlot : '']} onPress={() => onSlotSelect(item)}>
                                        <Text style={[styles.dateSlotText, selectedSlotIndex == item.index ? styles.activeDateText : '']}>
                                            {begin} - {end}
                                        </Text>
                                        {item?.text ? <Text style={[styles.dateSlotEmergency, item.textClass ? styles[item.textClass] : '']}>
                                            {item.text}
                                        </Text> : null}
                                    </Pressable>
                                )
                            }}
                        />
                    </>
                }
            </View>
            <View style={[css.spaceT10, css.flexDR, css.imgFull]}  >
                <Text style={[css.fm, css.f14, css.blackC, css.marginR20, css.width75]}>
                    Want to select date using a calendar ?
                </Text>
                <Pressable onPress={showDatepicker} style={[css.width25]} >
                    <AntDesign name="calendar" size={24} color="#2eb0e4" />
                </Pressable>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(currentDate.fullDate)}
                        mode={'date'}
                        minimumDate={new Date(dates[0]?.fullDate || currentDate.fullDate)}
                        maximumDate={new Date(dates[dates.length - 1].fullDate)}
                        display={'calendar'}
                        onChange={onChange}
                        style={{ flex: 1, color: 'red' }}
                        textColor="red"
                        is24Hour={true}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    serviceAllDates: {
        backgroundColor: '#fff', width: 65, height: 65, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 7, marginBottom: 5, marginLeft: 7,
    },
    disabled: {
        opacity: 0.5
    },
    colorRed: {
        color: '#ff9180'
    },
    colorBlue: {
        color: '#2eb0e4'
    },
    colorGreen: {
        color: '#00e640'
    },
    activeDate: {
        ...css.boxShadow,
        color: '#2eb0e4',
        backgroundColor: '#fff',
    },
    serviceDay: { fontSize: wp('2.42%'), color: '#525252', fontFamily: 'PoppinsR', },
    serviceDate: { fontSize: wp('4.4%'), fontFamily: 'PoppinsBO', color: '#525252' },
    dateSlots: { width: 160, paddingVertical: 20, justifyContent: 'center', alignItems: 'center', marginHorizontal: 2, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 10, },
    dateSlotText: { fontSize: wp('3.4%'), color: '#525252', fontFamily: 'PoppinsM', },
    dateSlotEmergency: { textAlign: 'center', lineHeight: 20, fontFamily: 'PoppinsSB', fontSize: wp('3%'), },
    activeSlot: {
        ...css.boxShadow,
        backgroundColor: '#eff7fc',
        color: '#2eb0e4',
        borderWidth: 0
    },
    activeDateDay: {
        color: '#2eb0e4'
    },
    activeDateText: {
        color: '#2eb0e4'
    },
    buttonRight: { position: 'absolute', top: 0, bottom: 0, right: -15, justifyContent: 'center' },
    buttonLeft: { position: 'absolute', top: 0, bottom: 0, left: -15, justifyContent: 'center' },
})