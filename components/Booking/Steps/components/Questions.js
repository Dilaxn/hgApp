import { View, StyleSheet, Picker, TextInput, TouchableOpacity, Image, Pressable, ScrollView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import css from '../../../commonCss';
import Text from '../../../MyText';
import TextComp from '../../../TextComp';
import DropDownPicker from 'react-native-dropdown-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TYPE_DESCRIPTIVE = 'DESCRIPTIVE';
const TYPE_BOOLEAN = 'BOOLEAN';
const TYPE_WHOLE = 'WHOLE';

const DESCRIPTIVE_INDEX = 0;
const WHOLE_INDEX = 1;
const BOOLEAN_INDEX = 2;

const Questions = ({ questions, onFieldChange, answers }) => {
    console.log('questions [Questions]', questions);
    console.log('questions [Questions length]', questions.length);
    const getQuestion = (type) => questions.find(item => item.type === type);
    const descriptiveQuestion = getQuestion(TYPE_DESCRIPTIVE);
    const booleanQuestion = getQuestion(TYPE_BOOLEAN) || [];
    const wholeQuestion = getQuestion(TYPE_WHOLE);
    const descriptiveAnswers = descriptiveQuestion.answers.map(item => ({
        ...item,
        label: item.answer,
        value: item._id,
    }));

    const {
        descriptiveAnswer = null,
        booleanAnswer = null,
        wholeAnswer = null
    } = answers || {};

    const units = wholeQuestion.answers.map(item => ({ id: item._id, value: item.answer, _id: item._id }));
    let unitString = 'unit';
    let split = wholeQuestion.question.trim().split(" ");
    if (split.length > 2) {
        if (split[2].trim()) {
            unitString = split[2];
        } else {
            unitString = split[3];
        }
    }

    const increaseUnits = () => {
        if (activeUnitIndex < (units.length - 1)) {
            const nextIndex = activeUnitIndex + 1;
            setActiveUnitIndex(nextIndex);
            const unit = units[nextIndex];
            onFieldChange(WHOLE_INDEX, unit);
        }
    }

    const decreaseUnits = () => {
        if (activeUnitIndex > 0) {
            const prevIndex = activeUnitIndex - 1;
            setActiveUnitIndex(prevIndex);
            const unit = units[prevIndex];
            onFieldChange(WHOLE_INDEX, unit);
        }
    }

    const [isOpen, setIsopen] = useState(false);
    const [items, setItems] = useState(descriptiveAnswers || null);
    const [value, setValue] = useState(!!descriptiveAnswer ? descriptiveAnswer.value : descriptiveAnswers[0].value);
    const [activeUnitIndex, setActiveUnitIndex] = useState(!!wholeAnswer ? parseInt(wholeAnswer.value - 1) : 0);

    useEffect(() => {
        if (questions !== null && questions.length > 0) {
            if (descriptiveAnswer === null) {
                onFieldChange(DESCRIPTIVE_INDEX, descriptiveAnswers[0]);
            }

            if (wholeAnswer === null) {
                onFieldChange(WHOLE_INDEX, units[activeUnitIndex]);
            }
            if (booleanAnswer === null) {
                onFieldChange(BOOLEAN_INDEX, booleanQuestion.answers[1]);
            }
        }
    }, [questions]);
    return (
        <View>
            <Text>{descriptiveQuestion.question}</Text>
            <View style={{ zIndex: 111 }}>
                {!!items && items.length > 0 && <DropDownPicker
                    open={isOpen}
                    value={value}
                    items={items ? items : null}
                    setOpen={setIsopen}
                    setValue={setValue}
                    setItems={setItems}
                    onSelectItem={(item) => onFieldChange(DESCRIPTIVE_INDEX, item)}
                    style={{
                        borderColor: '#fff',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#d1d1d1',
                        height: 40,
                        marginTop: 5,
                        elevation: 1,
                        fontFamily: 'PoppinsM',
                        fontSize: wp('3.4%')
                    }}
                    textStyle={{
                        fontSize: wp('3.4%'),
                        color: '#525252',
                        fontFamily: 'PoppinsM',
                    }}
                    dropDownContainerStyle={{
                        backgroundColor: "#fff",
                        zIndex: 11111111111,
                        elevation: 1,
                        position: 'absolute',
                        borderRadius: 10,
                        borderColor: '#ccc'
                    }}
                    listMode='MODAL'
                />}
            </View>
            <View style={{ marginTop: 10, zIndex: 0, elevation: 0 }}>
                <View style={[css.spaceT10]}>
                    <Text>{wholeQuestion.question}</Text>
                </View>
                {wholeQuestion.isAdditionalCharges &&
                    <Text style={[css.f12, css.fr, css.grayC]}>
                        Addition charges {wholeQuestion.additionalCharges}AED / {unitString}
                    </Text>
                }
                <View style={[css.flexDR, css.imgFull, css.spaceT5]}>
                    <Pressable style={{ width: '33%', alignItems: 'center', backgroundColor: '#f9f9f9', color: '#7b7b7b', borderColor: '#ccc', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, height: 35, justifyContent: 'center', borderWidth: 1, borderRightWidth: 0 }} onPress={decreaseUnits}>
                        <Text style={[css.f24, css.fsb, { color: '#7b7b7b' }]}>-</Text>
                    </Pressable>
                    <View style={{ width: '34%', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderLeftwidth: 1, borderColor: '#ccc', justifyContent: 'center' }}>
                        {/* {wholeAnswer !== null && <Text style={[css.f16, css.fm, css.blackC]}> {wholeAnswer.value} - {activeUnitIndex + 1} </Text>} */}
                        {wholeAnswer !== null && <Text style={[css.f16, css.fm, css.blackC]}> {wholeAnswer.value} </Text>}
                    </View>

                    <Pressable style={[styles.increaseQty]} onPress={increaseUnits}>
                        <Text style={[css.f24, css.fsb, css.whiteC]}>+</Text>
                    </Pressable>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text>{booleanQuestion.question}</Text>
                    {booleanQuestion.isAdditionalCharges && booleanQuestion.isAdditionalCharges !== 0 &&
                        <Text style={{ fontSize: wp('3%'), fontFamily: 'PoppinsR', color: '#ccc' }}>
                            Addition charges {booleanQuestion.additionalCharges}/{unitString}
                        </Text>
                    }
                    {!!booleanQuestion && !!booleanAnswer &&
                        <View style={[css.flexDRSE, css.imgFull, css.spaceT5, { justifyContent: 'space-between' }]}>
                            {
                                booleanQuestion.answers.map(item => (
                                    <Pressable
                                        style={[
                                            styles.btnYes,
                                            booleanAnswer.answer == item.answer ? styles.btnYesSelected : ''
                                        ]}
                                        onPress={() => {
                                            onFieldChange(BOOLEAN_INDEX, item)
                                        }}
                                    >
                                        <TextComp styles={[
                                            styles.btnText,
                                            booleanAnswer.answer == item.answer ? styles.btnYesSelectedText : ''
                                        ]}>{item.answer}</TextComp>
                                    </Pressable>
                                ))
                            }
                        </View>
                    }
                </View>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    increaseQty: {
        width: '33%',
        alignItems: 'center',
        backgroundColor: '#2eb0e4',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: '#ccc',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        height: 35,
        justifyContent: 'center'
    },
    btnYes: {
        width: '48%', borderWidth: 1, borderColor: '#ccc', height: 35, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    },
    btnText: { color: '#525252', fontFamily: 'PoppinsR', fontSize: wp('3.4%') },
    btnYesSelected: {
        ...css.boxShadow,
        width: '48%',
        height: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eff7fc',
        borderWidth: 0
    },
    btnYesSelectedText: {
        color: '#2eb0e4', fontFamily: 'PoppinsBO', fontSize: wp('3.4%')
    },
});

export default Questions;
