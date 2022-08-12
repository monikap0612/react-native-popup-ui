import React, { useEffect, useState } from "react";
import { Easing } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import IntroStack from "./IntroStack";
import { Splash, Login, Verify } from 'screens/Welcome';
import { PersonalInfo, AddVehicle, EditMyVehicle, BookChargingSlot, Charging, ReportSuccess, Filter, ChargingSuccess, ChargingDetails, ChargingInitialization, Notification, WriteUs, ScanScreen } from 'screens/HomeStack';
import Tabs from "./Tabs";
import auth from '@react-native-firebase/auth';

import { connect } from "react-redux";

import { isEmpty } from 'lodash';


const Stack = createStackNavigator();

const RootStack = createStackNavigator();

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();

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

// function RootStack(props) {
//     const MyTheme = {
//         ...DefaultTheme,
//         dark: props.theme == 'dark' ? true : false,
//     };

//     const [user, setUser] = useState(null);
//     const [initializing, setInitializing] = useState(true);

//     function onAuthStateChanged(userget) {
//         setUser(userget);
//         // console.log('user', userget);
//         if (initializing) setInitializing(false);
//     }

//     useEffect(() => {
//         const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//         return subscriber; // unsubscribe on unmount
//     }, []);

//     if (initializing) {
//         return <Splash />
//     }
//     return (
//         <NavigationContainer theme={MyTheme}>
//             <Stack.Navigator
//                 // headerMode='float'
//                 animation='fade'
//                 screenOptions={{
//                     gestureEnabled: true, gestureDirection: 'horizontal',
//                     cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
//                     transitionSpec: {
//                         open: config,
//                         close: closeConfig
//                     }
//                 }}>
//                 {
//                     !user ?
//                         <>
//                             {/* <Stack.Screen options={{ headerShown: false }} name="Splash" component={Splash} /> */}
//                             {/* <Stack.Screen options={{ headerShown: false }} name="IntroStack" component={IntroStack} /> */}
//                             <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
//                             <Stack.Screen options={{ headerShown: false }} name="Verify" component={Verify} />
//                         </>
//                         :
//                         <>
//                             {/* <Stack.Screen options={{ headerShown: false }} name="Splash" component={Splash} /> */}
//                             <Stack.Screen options={{ headerShown: false }} name="Tabs" component={Tabs} />
//                             <Stack.Screen options={{ headerShown: false }} name="PersonalInfo" component={PersonalInfo} />
//                             <Stack.Screen options={{ headerShown: false }} name="AddVehicle" component={AddVehicle} />
//                             <Stack.Screen options={{ headerShown: false }} name="BookChargingSlot" component={BookChargingSlot} />
//                             <Stack.Screen options={{ headerShown: false }} name="ChargingInitialization" component={ChargingInitialization} />
//                             <Stack.Screen options={{ headerShown: false }} name="Charging" component={Charging} />
//                             <Stack.Screen options={{ headerShown: false }} name="ReportSuccess" component={ReportSuccess} />
//                             <Stack.Screen options={{ headerShown: false }} name="Filter" component={Filter} />
//                             <Stack.Screen options={{ headerShown: false }} name="ChargingSuccess" component={ChargingSuccess} />
//                             <Stack.Screen options={{ headerShown: false }} name="ChargingDetails" component={ChargingDetails} />
//                         </>
//                 }
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// }

// export default RootStack;

const HomeStackScreen = () => (
    <HomeStack.Navigator animation='fade' screenOptions={{
        gestureEnabled: true,
        headerShown: false,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
            open: config,
            close: closeConfig
        }
    }}>
        <HomeStack.Screen options={{ headerShown: false }} name="Tabs" component={Tabs} />
        <HomeStack.Screen options={{ headerShown: false }} name="WriteUs" component={WriteUs} />
        <HomeStack.Screen options={{ headerShown: false }} name="Notification" component={Notification} />
        <HomeStack.Screen options={{ headerShown: false }} name="PersonalInfo" component={PersonalInfo} />
        <HomeStack.Screen options={{ headerShown: false }} name="AddVehicle" component={AddVehicle} />
        <HomeStack.Screen options={{ headerShown: false }} name="EditMyVehicle" component={EditMyVehicle} />
        <HomeStack.Screen options={{ headerShown: false, gestureEnabled: false }} name="Charging" component={Charging} />
        <HomeStack.Screen options={{ headerShown: false }} name="ReportSuccess" component={ReportSuccess} />
        <HomeStack.Screen options={{ headerShown: false }} name="Filter" component={Filter} />
        <HomeStack.Screen options={{ headerShown: false }} name="ScanScreen" component={ScanScreen} />
        <HomeStack.Screen options={{ headerShown: false, gestureEnabled: false }} name="ChargingSuccess" component={ChargingSuccess} />
        <HomeStack.Screen options={{ headerShown: false }} name="ChargingDetails" component={ChargingDetails} />
    </HomeStack.Navigator>
);

const AuthStackScreen = () => (
    <AuthStack.Navigator animation='fade' screenOptions={{
        gestureEnabled: true,
        headerShown: false,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
            open: config,
            close: closeConfig
        }
    }}>
        <AuthStack.Screen
            name="Login"
            component={Login}
        />
        <AuthStack.Screen
            name="Verify"
            component={Verify}
        />
        <AuthStack.Screen
            name="IntroStack"
            component={IntroStack}
        />
    </AuthStack.Navigator>
);

export const RootStackScreen = ({ loginInfo }) => (
    <RootStack.Navigator animation='fade' screenOptions={{
        gestureEnabled: true, headerShown: false, gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
            open: config,
            close: closeConfig
        }
    }}>
        <HomeStack.Screen name="Splash" component={Splash} />
        {/* {!isEmpty(loginInfo) ? ( */}

        {/* ) : ( */}
        <RootStack.Screen
            name="Auth"
            component={AuthStackScreen}
            options={{
                animationEnabled: false,
            }}
        />
        <RootStack.Screen
            name="App"
            component={HomeStackScreen}
            options={{
                animationEnabled: false,
            }}
        />
        {/* )} */}
    </RootStack.Navigator>
);

const RootNavigator = (props) => {
    const MyTheme = {
        ...DefaultTheme,
        // dark: props.theme == 'dark' ? true : false,
        dark: props.isDarkTheme
    };
    return (
        <NavigationContainer theme={MyTheme}>
            <RootStackScreen loginInfo={props.loginInfo} MyTheme={MyTheme} />
        </NavigationContainer>
    );
};

const mapStateToProps = (state) => ({
    // loginInfo: state.auth.loginInfo,
    isDarkTheme: state.theme.isDarkTheme
});

export default connect(mapStateToProps, {})(RootNavigator);