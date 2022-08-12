import React from "react";
import { Easing } from "react-native";
import { About, Account, ChargingHistory, Contact, FAQ, Help, Profile, ReportIssue, Vehicles, TransactionHistory } from 'screens/HomeStack';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

const Stack = createStackNavigator();

const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01
    }
}

const closeConfig = {
    animation: 'timing',
    config: {
        duration: 200,
        easing: Easing.linear
    }
}

const AccountStack = () => {
    return (
        <Stack.Navigator
            // headerMode='float'
            animation='fade'
            screenOptions={{
                
                gestureEnabled: true, gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                transitionSpec: {
                    open: config,
                    close: closeConfig
                }
            }}>
            <Stack.Screen options={{ headerShown: false }} name="MyAccount" component={Account} />
            <Stack.Screen options={{ headerShown: false }} name="Profile" component={Profile} />
            <Stack.Screen options={{ headerShown: false }} name="Vehicles" component={Vehicles} />
            <Stack.Screen options={{ headerShown: false }} name="TransactionHistory" component={TransactionHistory} />
            <Stack.Screen options={{ headerShown: false }} name="ChargingHistory" component={ChargingHistory} />
            <Stack.Screen options={{ headerShown: false }} name="Help" component={Help} />
            <Stack.Screen options={{ headerShown: false }} name="Contact" component={Contact} />
            <Stack.Screen options={{ headerShown: false }} name="FAQ" component={FAQ} />
            <Stack.Screen options={{ headerShown: false }} name="About" component={About} />
            <Stack.Screen options={{ headerShown: false }} name="ReportIssue" component={ReportIssue} />
        </Stack.Navigator>
    )
}

export default AccountStack;