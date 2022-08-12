import { get, isEmpty } from 'lodash';
import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { View, Text } from 'react-native';
import { StyledText } from 'components';
import AlertBox from 'react-native-easy-alert';
import styles from './styles';

import { connect } from 'react-redux';

const darkFontColor = '#FFF';
const lightFontColor = '#0A0A26';

const ThemeAlert = ({ isDarkTheme }) => {
    return (
        <AlertBox
            customChildren={(title, body, buttons) => (
                <View style={styles(isDarkTheme).modalOuterContainer}>
                    <View style={styles(isDarkTheme).modalContainer}>
                        <Image source={require('../../../assets/images/wifi.png')} style={styles(isDarkTheme).wifiImage} resizeMode="contain" />

                        <StyledText style={styles(isDarkTheme).modalTitle} font="semiBold" color={isDarkTheme ? darkFontColor : lightFontColor}>
                            {title}
                        </StyledText>

                        {body ? <StyledText style={styles(isDarkTheme).modalSubTitle} font="regular" color={isDarkTheme ? darkFontColor : lightFontColor}>
                            {body}
                        </StyledText> : null}
                        {/* <Text style={styles(isDarkTheme).modalTitle}>{title}</Text> */}
                        {/* {body ? <Text style={styles(isDarkTheme).modalSubTitle}>{body}</Text> : null} */}

                        {buttons.map((x, i) => {
                            if (i < 1) {
                                return (
                                    <TouchableOpacity
                                        style={[styles(isDarkTheme).buttonStyle, { backgroundColor: get(x, 'backgroundColor', 'transparent') }]}
                                        key={i}
                                        onPress={x.onPressAction}>
                                        <StyledText style={styles(isDarkTheme).modalSubTitle} font="regular" color={isDarkTheme ? darkFontColor : lightFontColor}>
                                            {get(x, 'text')}
                                        </StyledText>
                                        {/* <Text style={[styles(isDarkTheme).buttonText, { color: i == 0 ? Theme.colors.white : Theme.colors.black }]}>{get(x, 'text')}</Text> */}
                                    </TouchableOpacity>
                                )
                            } else {
                                return (
                                    <TouchableOpacity
                                        style={[styles(isDarkTheme).buttonStyle, { backgroundColor: get(x, 'backgroundColor', 'transparent'), height: 35, marginVertical: 0 }]}
                                        key={i}
                                        onPress={x.onPressAction}>
                                        <StyledText style={styles(isDarkTheme).modalSubTitle} font="regular" color={isDarkTheme ? darkFontColor : lightFontColor}>
                                            {get(x, 'text')}
                                        </StyledText>
                                        {/* <Text style={[styles(isDarkTheme).buttonText, { color: i == 0 ? Theme.colors.white : Theme.colors.black }]}>{get(x, 'text')}</Text> */}
                                    </TouchableOpacity>
                                )
                            }

                        })}
                    </View>
                </View>
            )}
        />
    );
};

const mapStateToProps = state => {
    return {
        isDarkTheme: state.theme.isDarkTheme,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeAlert);