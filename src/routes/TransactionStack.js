import React from "react";
import { Transaction, Wallet } from 'screens/HomeStack';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Easing } from "react-native";

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

const TransactionStack = () => {
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
            <Stack.Screen options={{ headerShown: false }} name="Currency" component={Wallet} />
            <Stack.Screen options={{ headerShown: false }} name="Transaction" component={Transaction} />
        </Stack.Navigator>
    )
}

export default TransactionStack;