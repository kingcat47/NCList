import { Stack } from "expo-router";
import FillterBox from "../../../components/mycomponents/FillterBox";

export default function Star() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: "Like",
                    headerStyle: {
                        backgroundColor: "#fff",
                    },
                    headerTitleStyle: {
                        color: "#1C1B1F",
                        fontSize: 18,
                        fontWeight: "600",
                    },
                    headerShadowVisible: true,
                    headerRight: () => <FillterBox />,  // 여기에 필터 버튼 추가
                }}
            />
        </Stack>
    );
}
