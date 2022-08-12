import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

const NoInternet = (props) => {
    const { isVisible } = props;

    return (
        <Modal isVisible={isVisible} animationInTiming={800} animationOutTiming={800} avoidKeyboard>
            <View style={styles.modalOuterContainer}>
                <View style={styles.modalContainer}>
                    <Image source={require('../../../assets/images/wifi.png')} style={styles.wifiImage} resizeMode="contain" />

                    <Text style={styles.modalTitle}>No Internet connection !!!</Text>
                    <Text style={styles.modalSubTitle}>Please check internet connection, try again later</Text>

                    <Button
                        icon={
                            <Icon
                                name="refresh"
                                size={20}
                                color="white"
                            />
                        }
                        iconLeft
                        title="Try Again"
                        type="solid"
                        raised={true}
                        containerStyle={[styles.buttonStyle, { marginTop: 25 }]}
                        buttonStyle={styles.buttonStyle}
                        titleStyle={styles.buttonText}
                        iconContainerStyle={styles.buttonIcon}
                        onPress={props.reTryPress}
                    />
                </View>
            </View>
        </Modal>
    )
}
export default NoInternet;
