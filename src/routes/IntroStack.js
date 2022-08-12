import React from "react";
import { Easing } from "react-native";
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import IntroFirst from "screens/HomeStack/Intro/IntroFirst";
import InitialIntro from "screens/HomeStack/Intro/InitialIntro";
import IntroSecond from "screens/HomeStack/Intro/IntroSecond";
import IntroThird from "screens/HomeStack/Intro/IntroThird";
import IntroFourth from "screens/HomeStack/Intro/IntroFourth";
// import ResetPassword from "../screens/ResetPassword";
import IntroSixth from "screens/HomeStack/Intro/IntroSixth";

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

function IntroStack(props) {

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
            <Stack.Screen options={{ headerShown: false }} name="InitialIntro" component={InitialIntro} />
            {/* <Stack.Screen options={{ headerShown: false }} name="IntroFirst" component={IntroFirst} />
            <Stack.Screen options={{ headerShown: false }} name="IntroSecond" component={IntroSecond} />
            <Stack.Screen options={{ headerShown: false }} name="IntroThird" component={IntroThird} />
            <Stack.Screen options={{ headerShown: false }} name="IntroFourth" component={IntroFourth} /> */}
            {/* <Stack.Screen options={{ headerShown: false }} name="ResetPassword" component={ResetPassword} /> */}
        </Stack.Navigator>
    );
}

export default IntroStack;