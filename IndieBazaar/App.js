import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Image, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Icons for tabs

// Import pages for Tab Navigator
import CategoriesPage from './pages/categoriespage/categoriespage';
import BrowseBusinesses from './pages/browsebusinesses/browsebusinessespage';
import AdminPage from './pages/adminpage/adminpage'; // Adjust the path as necessary

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
                } else if (route.name === 'Admin') {
                    iconName = focused ? 'settings' : 'settings-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#5A189A',
            tabBarInactiveTintColor: '#a85bea',
            tabBarStyle: styles.tabBar,
        })}
    >
        <Tab.Screen
            name="Categories"
            component={CategoriesPage}
            options={{
                tabBarLabel: 'Categories',
                headerStyle: {
                    backgroundColor: '#B2E3D8', // Background color of the header
                },
                headerTitle: () => (
                    <View style={{ width: 120, height: 40, marginLeft: -10 }}>
                        <Image
                            source={require('./assets/logoimage.jpg')} // Path to your logo image
                            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                        />
                    </View>
                ),
            }}
        />
        <Tab.Screen
            name="Browse"
            component={BrowseBusinesses}
            options={{
                tabBarLabel: 'Browse',
                headerStyle: {
                    backgroundColor: '#B2E3D8', 
                },
                headerTitle: () => (
                    <View style={{ width: 120, height: 40, marginLeft: -10 }}>
                        <Image
                            source={require('./assets/logoimage.jpg')} // Path to your logo image
                            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                        />
                    </View>
                ),
            }}
        />
        <Tab.Screen name="Admin" component={AdminPage} />
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
                        // title: 'Business Details', // Default title
                        headerStyle: {
                            backgroundColor: '#B2E3D8', 
                        },
                        headerTintColor: '#5A189A',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#B2E3D8',
        // borderTopColor: '#E0E0E0',
    },
});

export default App;
