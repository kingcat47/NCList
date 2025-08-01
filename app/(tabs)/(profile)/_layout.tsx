import { Stack } from "expo-router";

export default function Profile() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: "Profile",
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTitleStyle: {
                        color: '#1C1B1F',
                        fontSize: 18,
                        fontWeight: '600',
                    },
                    headerShadowVisible: true,
                }}
            />
        </Stack>
    );
}