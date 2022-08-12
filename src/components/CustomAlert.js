import { useTheme } from "@react-navigation/native";
import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import Modal from 'react-native-modal';
import { ChargeType, Button, StyledText } from 'components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, globalStyle, fonts, fontSizes } from 'styleConfig';

const SimpleCustomAlert = (props) => {

    const { dark } = useTheme();

    const { alertTitle, alertSubTitle, okLabel, cancelLabel, isShowCancel, onOkPress, isOpenModal, onCancelPress,
        isCustomBody, renderBody } = props;
    return (
        <Modal isVisible={isOpenModal} avoidKeyboard>
            <View style={[styles.modalOuterContainer, {
                backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF'
            }]}>
                <View style={styles.modalContainer}>
                    <Text style={[styles.modalTitle, { color: dark ? '#FFF' : '#0A0A26'}]}>{alertTitle}</Text>
                    {alertSubTitle && (<Text style={[styles.modalSubTitle, { color: dark ? '#FFF' : '#0A0A26'}]}>{alertSubTitle}</Text>)}

                    {isCustomBody
                        &&
                        renderBody
                    }
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => onOkPress()}>
                        {/* <Text style={styles.buttonText}>{okLabel}</Text> */}
                        <StyledText font="regular" size={20} color={dark ? '#FFF' : '#0A0A26'}>{okLabel}</StyledText>
                    </TouchableOpacity>

                    {isShowCancel
                        &&
                        <TouchableOpacity onPress={() => onCancelPress()} style={[styles.buttonStyle, {backgroundColor: 'transparent', height: 45, marginVertical: 0 }]}>
                            {/* <Text style={[styles.buttonText, { color: '#000', fontWeight: '400' }]}>{cancelLabel}</Text> */}
                            <StyledText font="regular" size={20} color={dark ? '#FFF' : '#0A0A26'}>{cancelLabel}</StyledText>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </Modal>
    )
}
export default SimpleCustomAlert;
