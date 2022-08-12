import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import { Appearance, LogBox, StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootStack from "routes/RootStack";
import { ThemeAlert } from 'components';
import { colors } from 'styleConfig';
// import colors from "style/colors";
import SplashScreen from 'react-native-splash-screen'
// import ThemeStore, { toggleDark, toggleLight } from "utils/ThemeStore";
import messaging from '@react-native-firebase/messaging';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './reduxStore';

import { toggleLightTheme, toggleDarkTheme } from 'reduxStore/actions/theme';
import RootBlock from "components/RootBlock";
import { Root, Popup } from 'popup-ui'

export default class App extends React.Component {

  state = {
    theme: 'light'
  }

  componentDidMount() {
    const { theme: { isDarkTheme } } = store.getState();
    const colorScheme = Appearance.getColorScheme()
    // SplashScreen.show();
    this.setState({ theme: colorScheme });
    // if (Appearance.getColorScheme() == 'dark') {
    //   store.dispatch(toggleDarkTheme());
    // } else {
    //   store.dispatch(toggleLightTheme());
    // }

    // ThemeStore.dispatch(Appearance.getColorScheme() == 'dark' ? toggleDark() : toggleLight());

    Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme == 'dark') {
        store.dispatch(toggleDarkTheme());
      } else {
        store.dispatch(toggleLightTheme());
      }
      this.setState({ theme: colorScheme })
    })
    LogBox.ignoreAllLogs();

    // ThemeStore.subscribe(() => {
    //   // var state = ThemeStore.getState();
    //   this.setState({ theme: isDarkTheme ? 'dark' : 'light' });
    // })

    const authStatus = messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
    // setTimeout(() => {
    //   SplashScreen.hide();
    // }, 3000);
  }

  render() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <PersistGate
            // loading={<FullLoader />}
            persistor={persistor}
          >
            <Root>
              <BottomSheetModalProvider>
                <RootBlock>
                  <StatusBar backgroundColor={this.state.theme === 'dark' ? colors.BLUEGREY.other : '#FFF'} barStyle={this.state.theme === 'light' ? 'dark-content' : 'light-content'} />
                  <RootStack theme={this.state.theme} />
                </RootBlock>
              </BottomSheetModalProvider>
              <ThemeAlert />
            </Root>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    )
  }
}