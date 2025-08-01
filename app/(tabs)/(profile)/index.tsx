import {StyleSheet, View, Text} from "react-native";



export default function Profile() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <View
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});