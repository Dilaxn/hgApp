import { StyleSheet, View } from "react-native";
import css from '../../commonCss';
import Text from '../../MyText';
import Questions from "./components/Questions";

export default function StepScope({ category, updateFormData, answers }) {
    if (!category) {
        return <View></View>
    }

    const { questions } = category;
    return (
        <>
            <View style={[css.bookingScreenBox]}>
                <Text style={[css.fbo, css.f16, css.brandC,]}>What service do you need?</Text>
                {questions !== null && questions.length > 0 && <Questions questions={questions} style={{ zIndex: 1 }} answers={answers} onFieldChange={updateFormData} />}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    btnYes: {
        width: '49%', borderWidth: 1, borderColor: '#ccc', height: 35, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    },
    btnYesSelected: {
        width: '49%', height: 35, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff7fc', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 1,
    },
    btnYesSelectedText: {
        color: '#2eb0e4', fontFamily: 'PoppinsSB',
    }
});
