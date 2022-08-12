import React, { useEffect, useState } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import IntroStack from "./IntroStack";
import Verify from "../screens/Verify";
import PersonalInfo from "../screens/PersonalInfo";
import AddVehicle from "../screens/AddVehicle";
import Login from "../screens/Login";
import Tabs from "./Tabs";
import BookChargingSlot from "../screens/BookChargingSlot";
import ChargingInitialization from "../screens/ChargingIntialization";
import Charging from "../screens/Charging";
import ReportSuccess from "../screens/ReportSuccess";
import { Easing } from "react-native";
import Filter from "../screens/Filter";
import ChargingSuccess from "../screens/ChargingSuccess";
import ChargingDetails from "../screens/ChargingDetails";
import Splash from "../screens/Welcome/Splash";


import auth from '@react-native-firebase/auth';

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

function RootStack(props) {
    const MyTheme = {
        ...DefaultTheme,
        dark: props.theme == 'dark' ? true : false,
    };

    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    function onAuthStateChanged(userget) {
        setUser(userget);
        // console.log('user', userget);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) {
        return <Splash />
    }
    return (
        <NavigationContainer theme={MyTheme}>
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
                {
                    !user ?
                        <>
                            {/* <Stack.Screen options={{ headerShown: false }} name="Splash" component={Splash} /> */}
                            {/* <Stack.Screen options={{ headerShown: false }} name="IntroStack" component={IntroStack} /> */}
                            <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
                            <Stack.Screen options={{ headerShown: false }} name="Verify" component={Verify} />
                        </>
                        :
                        <>
                            {/* <Stack.Screen options={{ headerShown: false }} name="Splash" component={Splash} /> */}
                            <Stack.Screen options={{ headerShown: false }} name="Tabs" component={Tabs} />
                            <Stack.Screen options={{ headerShown: false }} name="PersonalInfo" component={PersonalInfo} />
                            <Stack.Screen options={{ headerShown: false }} name="AddVehicle" component={AddVehicle} />
                            <Stack.Screen options={{ headerShown: false }} name="BookChargingSlot" component={BookChargingSlot} />
                            <Stack.Screen options={{ headerShown: false }} name="ChargingInitialization" component={ChargingInitialization} />
                            <Stack.Screen options={{ headerShown: false }} name="Charging" component={Charging} />
                            <Stack.Screen options={{ headerShown: false }} name="ReportSuccess" component={ReportSuccess} />
                            <Stack.Screen options={{ headerShown: false }} name="Filter" component={Filter} />
                            <Stack.Screen options={{ headerShown: false }} name="ChargingSuccess" component={ChargingSuccess} />
                            <Stack.Screen options={{ headerShown: false }} name="ChargingDetails" component={ChargingDetails} />
                        </>
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootStack;