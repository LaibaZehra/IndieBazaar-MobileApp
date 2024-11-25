import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Icons for tabs

// Import pages for Tab Navigator
import CategoriesPage from './pages/categoriespage/categoriespage';
import BrowseBusinesses from './pages/browsebusinesses/browsebusinessespage';

// Import Business Home page for Stack Navigator
import BusinessHome from './pages/businesshome/businesshomepage'; // Adjust the path as necessary

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator
const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Categories') {
                    iconName = focused ? 'list-circle' : 'list-circle-outline';
                } else if (route.name === 'Browse') {
                    iconName = focused ? 'search' : 'search-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6200EE',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: styles.tabBar,
        })}
    >
        <Tab.Screen name="Categories" component={CategoriesPage} />
        <Tab.Screen name="Browse" component={BrowseBusinesses} />
    </Tab.Navigator>
);

// Main App Navigation (includes Business Home)
const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* Main Tab Navigator */}
                <Stack.Screen
                    name="Home"
                    component={TabNavigator}
                    options={{ headerShown: false }} // Hide header for tabs
                />
                {/* Business Home Screen */}
                <Stack.Screen
                    name="BusinessHome"
                    component={BusinessHome}
                    options={{
                        title: 'Business Details', // Customize header title
                        headerStyle: { backgroundColor: '#6200EE' },
                        headerTintColor: '#fff',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
});

export default App;
