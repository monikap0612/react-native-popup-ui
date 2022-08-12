import React from "react";
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Easing } from "react-native";
import { Home, FindCharge, BookChargingSlot, ChargingInitialization } from 'screens/HomeStack';
import { isIOS } from 'utils/Common';

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

function HomeStack(props) {

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
            <Stack.Screen options={{ headerShown: false, gestureEnabled: isIOS }} name="Home" component={Home} />
            <Stack.Screen options={{ headerShown: false, gestureEnabled: isIOS }} name="FindCharge" component={FindCharge} />
            <Stack.Screen options={{ headerShown: false, gestureEnabled: isIOS }} name="BookChargingSlot" component={BookChargingSlot} />
            <Stack.Screen options={{ headerShown: false }} name="ChargingInitialization" component={ChargingInitialization} />
        </Stack.Navigator>
    );
}

export default HomeStack;