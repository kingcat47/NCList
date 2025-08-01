import {StyleSheet, View, Text,Alert} from "react-native";
import Input from "@/components/mycomponents/Input";
import Button from "@/components/mycomponents/Button";




export default function Add() {
    return (
        <View style={styles.container}>

            <Input></Input>
            <View style={styles.buttons}>
                <Button
                    title="Ok"
                    width={170}
                    height={48}
                    backgroundColor="#146EFF"
                    pressedColor="#0F5CE0"
                    textColor="#FFFFFF"
                    onPress={() => Alert.alert("버튼이 눌렸습니다!")}
                />
                <Button
                    title="Cancel"
                    width={170}
                    height={48}
                    backgroundColor="#8A8A8A"
                    pressedColor="#6E6E6E"
                    textColor="#FFFFFF"
                    onPress={() => Alert.alert("버튼이 눌렸습니다!")}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        flex: 1,
        alignItems: "center",

    },

    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 20,
    },
});