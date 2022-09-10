import React, { Children, cloneElement, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';


export const CustomRadioButton = ({ onChange, value, currentValue, children }) => {
    return (
        <View style={[styles.radioButton]}>
            <Pressable style={[styles.circle]} onPress={() => onChange(value)}>
                <View style={[styles.circleOuter]}>
                    <View style={[styles.circleInner, currentValue === value ? styles.circleActive : null]}>
                    </View>
                </View>
            </Pressable>
            <View style={[styles.label]}>
                {children}
            </View>
        </View>
    );
}

export const CustomRadioButtonGroup = ({ onChange, children, value, style }) => {

    const firstChildValue = children && children.length ? children[0].props.value : null;

    const [localValue, setLocalValue] = useState(value || firstChildValue);

    const handleChange = (val) => {
        setLocalValue(val);
        onChange(val);
    }

    useEffect(() => {
        if (value != localValue) {
            setLocalValue(value);
        }
    }, [value]);

    return (
        <View style={[styles.radioButtonGroup, style]}>
            {Children.map(children, child => (
                React.cloneElement(child, { onChange: handleChange, currentValue: localValue })
            ))}
        </View>
    )
}


const styles = StyleSheet.create({
    circleOuter: {
        width: 30,
        height: 30,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        padding: 5,
    },
    circleInner: {
        width: 11,
        height: 11,
        backgroundColor: '#fff',
        borderRadius: Math.round(11 / 2),
        position: "absolute"
    },
    circleActive: {
        backgroundColor: '#2EB0E4'
    },
    radioButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'flex-start',
        paddingVertical: 10
    },
    circle: {
        flex: 1,
        flexBasis: 40,
        flexShrink: 1,
        flexGrow: 0,
        width: 30,
    },
    label: {
        flex: 1,
        flexShrink: 0,
        flexGrow: 1,
    }
});