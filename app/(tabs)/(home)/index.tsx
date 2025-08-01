import InfoBox from "@/components/mycomponents/InfoBox";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Home() {
    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.InfoBox_List} 
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <InfoBox />
                <InfoBox />
                <InfoBox />
                <InfoBox />
                <InfoBox />
                <InfoBox />
                <InfoBox />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    InfoBox_List: {
        flex: 1,
        marginTop: 20,
        width: "100%",
        paddingHorizontal: 20,
    },
    contentContainer: {
        gap: 16,
    }
});