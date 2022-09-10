import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import TextComp from '../../TextComp';
import css from '../../commonCss';
export default function ProgressBarSteps({ activeStep }) {
    const getClass = (step) => {
        if (activeStep === step) {
            return styles.activeCircleStyle;
        } else if (activeStep > step) {
            return styles.completeCircleStyle;
        } else {
            return styles.circleStyle;
        }
    };

    return (
        <View style={[styles.container]}>
            <View style={[styles.progressSteps]}>
                <View style={[styles.circleContainer]}>
                    <View style={[getClass(0)]}>
                        <View style={[styles.circleText]}>

                            {activeStep > -1 && <AntDesign style={{ paddingVertical: 6 }} name="check" size={12} color="#fff" />}
                        </View>
                    </View>
                    <View style={[styles.label]}><TextComp styles={css.f12}>Scope</TextComp></View>
                    <View style={styles.rightBar} />
                </View>
                <View style={[styles.circleContainer]}>
                    <View style={[getClass(2)]}>
                        <View style={[styles.circleText]}>
                            {activeStep > 1 && <AntDesign style={{ paddingVertical: 6 }} name="check" size={12} color="#fff" />}
                        </View>
                    </View>
                    <View style={[styles.label]}><TextComp styles={css.f12}>Schedule</TextComp></View>
                    <View style={styles.leftBar} />
                    <View style={styles.rightBar} />
                </View>
                <View style={[styles.circleContainer]}>
                    <View style={[getClass(3)]}>
                        <View style={[styles.circleText]}>
                            {activeStep > 2 && <AntDesign style={{ paddingVertical: 6 }} name="check" size={12} color="#fff" />}
                        </View>
                    </View>
                    <View style={[styles.label]}><TextComp styles={css.f12}>Location</TextComp></View>
                    <View style={styles.leftBar} />
                    <View style={styles.rightBar} />
                </View>
                <View style={[styles.circleContainer]}>
                    <View style={[getClass(4)]}>
                        <View style={[styles.circleText]}>
                            {activeStep > 3 && <AntDesign style={{ paddingVertical: 6 }} name="check" size={12} color="#fff" />}
                        </View>
                    </View>
                    <View style={[styles.label]}><TextComp styles={css.f12}>Confirmation</TextComp></View>
                    <View style={styles.leftBar} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { margin: 30 },
    progressSteps: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    circleContainer: { alignItems: 'center' },
    circleText: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center'
    },
    circleStyle: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        width: 25,
        height: 25
    },
    activeCircleStyle: {
        borderRadius: 50,
        borderWidth: 5,
        borderColor: '#f6b700',
        width: 25,
        height: 25
    },
    completeCircleStyle: {
        borderRadius: 50,
        backgroundColor: '#f6b700',
        width: 25,
        height: 25
    },
    label: {
        position: 'absolute',
        top: 30,
        width: 100,
        alignItems: 'center'
    },
    leftBar: {
        position: 'absolute',
        top: 25 / 2,
        left: -35,
        right: 0,
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        marginRight: 20 / 2 + 2,
        width: 35
    },
    rightBar: {
        position: 'absolute',
        top: 25 / 2,
        right: 0,
        left: 16 + 8,
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        marginRight: 0,
        width: 35
    },
})