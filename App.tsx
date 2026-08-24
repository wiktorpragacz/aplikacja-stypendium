import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./src/screens/HomeScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import ExploreScreen from "./src/screens/ExploreScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "create-outline";

            if (route.name === "Dzisiaj") {
              iconName = focused ? "create" : "create-outline";
            } else if (route.name === "Odkrywaj") {
              iconName = focused ? "compass" : "compass-outline";
            } else if (route.name === "Historia") {
              iconName = focused ? "stats-chart" : "stats-chart-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#3182CE",
          tabBarInactiveTintColor: "#A0AEC0",
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
        })}
      >
        <Tab.Screen name="Dzisiaj" component={HomeScreen} />
        <Tab.Screen name="Odkrywaj" component={ExploreScreen} />
        <Tab.Screen name="Historia" component={HistoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
