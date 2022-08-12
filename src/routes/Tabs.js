import React from 'react';
import { StyleSheet } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts, fontSizes } from 'styleConfig';
import { RoutePlanner, Saved } from 'screens/HomeStack';
import HomeStack from './HomeStack';
import AccountStack from './AccountStack';
import TransactionStack from './TransactionStack';
import { useTheme } from '@react-navigation/native';
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";

const Tab = AnimatedTabBarNavigator();

function Tabs() {

    const { dark } = useTheme();

    return (
        <Tab.Navigator
            appearance={{ floating: true }}
            tabBarOptions={{
                activeTintColor: dark ? '#FFF' : '#0A0A26',
                activeBackgroundColor: dark ? '#0E2831' : '#FFF',
                labelStyle: {
                    fontFamily: fonts.MULISH.medium,
                    fontSize: fontSizes.ultraLight
                },
                tabStyle: { backgroundColor: dark ? colors.BLUEGREY.secondary : colors.GREEN.secondary }
            }}
            screenOptions={{ headerShown: false, tabBarShowLabel: false }}
        >
            <Tab.Screen options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <Feather
                        name="home"
                        size={20}
                        color={focused ? colors.GREEN.secondary : '#FFF'}
                    />
                )
            }} name="Home" component={HomeStack} />
            <Tab.Screen options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <Feather
                        name="zap"
                        size={20}
                        color={focused ? colors.GREEN.secondary : '#FFF'}
                    />
                )
            }} name="Wallet" component={TransactionStack} />
            <Tab.Screen options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <Feather
                        name="calendar"
                        size={20}
                        color={focused ? colors.GREEN.secondary : '#FFF'}
                    />
                )
            }} name="Route" component={RoutePlanner} />
            <Tab.Screen options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <Feather
                        name="bookmark"
                        size={20}
                        color={focused ? colors.GREEN.secondary : '#FFF'}
                    />
                )
            }} name="Saved" component={Saved} />
            <Tab.Screen options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <Feather
                        name="user"
                        size={20}
                        color={focused ? colors.GREEN.secondary : '#FFF'}
                    />
                )
            }} name="Account" component={AccountStack} />
        </Tab.Navigator >
    );
}

const styles = StyleSheet.create({
    tabBar: {
        zIndex: 0,
        backgroundColor: '#003440',
        position: 'absolute',
        bottom: 25,
        left: 16,
        right: 16,
        paddingHorizontal: 5,
        borderRadius: 50,
        elevation: 4,
        flexDirection: 'row',
        height: heightPercentageToDP(7)
    },
    labelContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Tabs;