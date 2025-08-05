import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
// @ts-ignore
import AddInactiveIcon from "../../assets/svg/tabbutton/false/add.svg";
// @ts-ignore
import HomeInactiveIcon from "../../assets/svg/tabbutton/false/home.svg";
// @ts-ignore
import StarInactiveIcon from "../../assets/svg/tabbutton/false/star.svg";
// @ts-ignore
import ProfileInactiveIcon from "../../assets/svg/tabbutton/false/user.svg";
// @ts-ignore
import AddActiveIcon from "../../assets/svg/tabbutton/true/add.svg";
// @ts-ignore
import HomeActiveIcon from "../../assets/svg/tabbutton/true/home.svg";
// @ts-ignore
import ProfileActiveIcon from "../../assets/svg/tabbutton/true/profile.svg";
// @ts-ignore
import StarActiveIcon from "../../assets/svg/tabbutton/true/star.svg";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: "#1C1B1F",
                tabBarInactiveTintColor: "#6F7785",
                tabBarLabelStyle: styles.tabText,
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused }) => (
                        focused ? 
                        <HomeActiveIcon width={28} height={28} /> :
                        <HomeInactiveIcon width={28} height={28} />
                    ),
                }}
            />
            <Tabs.Screen
                name="(star)"
                options={{
                    title: "Like",
                    tabBarIcon: ({ focused }) => (
                        focused ? 
                        <StarActiveIcon width={28} height={28} /> :
                        <StarInactiveIcon width={28} height={28} />
                    ),
                }}
            />
            <Tabs.Screen
                name="(add)"
                options={{
                    title: "Add",
                    tabBarIcon: ({ focused }) => (
                        focused ? 
                        <AddActiveIcon width={28} height={28} /> :
                        <AddInactiveIcon width={28} height={28} />
                    ),
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) => (
                        focused ? 
                        <ProfileActiveIcon width={28} height={28} /> :
                        <ProfileInactiveIcon width={28} height={28} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 80,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#eee",
        paddingBottom: 10,
        paddingTop: 10,
    },
    tabText: {
        fontSize: 12,
        fontWeight: "500",
        marginTop: 4,
    },
}); 