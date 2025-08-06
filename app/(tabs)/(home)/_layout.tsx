import { Stack } from "expo-router";
import FillterBox from "../../../components/mycomponents/FillterBox";

export default function BuckLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: "Home",
                    headerStyle: { backgroundColor: "#fff" },
                    headerTitleStyle: {
                        color: "#1C1B1F",
                        fontSize: 18,
                        fontWeight: "600",
                    },
                    headerShadowVisible: true,
                    headerRight: () => <FillterBox />,
                }}
            />
        </Stack>
    );
}
