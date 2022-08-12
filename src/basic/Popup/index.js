import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, Alert } from 'react-native'
import { colors } from 'styleConfig'
import Feather from 'react-native-vector-icons/Feather';


const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height

class Popup extends Component {
	static popupInstance

	static show({ ...config }) {
		this.popupInstance.start(config)
	}

	static hide() {
		this.popupInstance.hidePopup()
	}

	state = {
		positionView: new Animated.Value(HEIGHT),
		opacity: new Animated.Value(0),
		positionPopup: new Animated.Value(HEIGHT),
		popupHeight: 0
	}

	start({ ...config }) {
		this.setState({
			title: config.title,
			type: config.type,
			icon: config.icon !== undefined ? config.icon : false,
			textBody: config.textBody,
			button: config.button !== undefined ? config.button : true,
			cancellable: config.cancellable || false,
			buttonText: config.buttonText || 'Ok',
			callback: config.callback !== undefined ? config.callback : this.defaultCallback(),
			cancelCallback: config.cancelCallback || this.defaultCancelCallback,
			cancelText: config.cancelText || 'Cancel',
			background: config.background || 'rgba(0, 0, 0, 0.5)',
			timing: config.timing,
			autoClose: config.autoClose !== undefined ? config.autoClose : false,
			popUpBG: config.popUpBG !== undefined ? config.popUpBG : 'white',
			titleStyle: config.titleStyle,
			descStyle: config.descStyle
		})

		Animated.sequence([
			Animated.timing(this.state.positionView, {
				toValue: 0,
				duration: 100,
				useNativeDriver: false
			}),
			Animated.timing(this.state.opacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false
			}),
			Animated.spring(this.state.positionPopup, {
				toValue: (HEIGHT / 2) - (this.state.popupHeight / 2),
				bounciness: 15,
				useNativeDriver: true
			})
		]).start()

		if (config.autoClose && config.timing !== 0) {
			const duration = config.timing > 0 ? config.timing : 5000
			setTimeout(() => {
				this.hidePopup()
			}, duration)
		}
	}

	hidePopup() {
		Animated.sequence([
			Animated.timing(this.state.positionPopup, {
				toValue: HEIGHT,
				duration: 250,
				useNativeDriver: true
			}),
			Animated.timing(this.state.opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false
			}),
			Animated.timing(this.state.positionView, {
				toValue: HEIGHT,
				duration: 100,
				useNativeDriver: false
			})
		]).start()
	}

	defaultCallback() {
		return Alert.alert(
			'Callback!',
			'Callback complete!',
			[
				{ text: 'Ok', onPress: () => this.hidePopup() }
			]
		)
	}

	defaultCancelCallback() {
		this.hidePopup();
	}

	handleImage(type) {
		switch (type) {
			case 'Success': return require('../../assets/Success.png')
			case 'Danger': return require('../../assets/Error.png')
			case 'Warning': return require('../../assets/Warning.png')
		}
	}

	render() {
		const { title, type, textBody, button, buttonText, callback, background, popUpBG, titleStyle, descStyle, cancellable, cancelCallback, cancelText } = this.state
		let el = null;
		if (button) {
			el = <View>
				<TouchableOpacity style={[styles.Button, styles[type]]} onPress={callback}>
					<Text style={styles.TextButton}>{buttonText}</Text>
				</TouchableOpacity>
				{cancellable &&
					<TouchableOpacity style={styles.CancelStyle} onPress={cancelCallback}>
						<Text style={styles.TextCancel}>{cancelText}</Text>
					</TouchableOpacity>
				}
			</View>
		}
		else {
			el = <Text></Text>
		}
		return (
			<Animated.View
				ref={c => this._root = c}
				style={[styles.Container, {
					backgroundColor: background || 'transparent',
					opacity: this.state.opacity,
					transform: [
						{ translateY: this.state.positionView }
					]
				}]}>
				<Animated.View
					onLayout={event => {
						this.setState({ popupHeight: event.nativeEvent.layout.height })
					}}
					style={[styles.Message, {
						backgroundColor: popUpBG,
						transform: [
							{ translateY: this.state.positionPopup }
						]
					}]}

				>

					<View style={styles.Content}>
						<Text style={[styles.Title, { ...titleStyle }]}>{title}</Text>
						<Text style={[styles.Desc, { ...descStyle }]}>{textBody}</Text>
						{/* {el} */}
					</View>

					<View style={{ position: 'absolute', bottom: -40, flexDirection: 'row' }}>
						{
							cancellable &&
								// this.state.icon ? (this.state.icon) :
								<TouchableOpacity style={styles.cancelBtn} onPress={cancelCallback}>
									<Feather
										name="x"
										size={35}
										color={"#fff"}
									/>
								</TouchableOpacity>
						}
						{
							this.state.icon ? (this.state.icon) :
								<TouchableOpacity style={[styles.successBtn, styles[type]]} onPress={callback}>
									<Feather
										name="check"
										size={35}
										color={"#fff"}
									/>
								</TouchableOpacity>
						}

					</View>

				</Animated.View>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	Container: {
		position: 'absolute',
		zIndex: 99999,
		width: WIDTH,
		height: HEIGHT,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		top: 0,
		left: 0
	},
	Message: {
		maxWidth: 300,
		width: 230,
		minHeight: 300,
		backgroundColor: '#fff',
		borderRadius: 30,
		alignItems: 'center',
		// overflow: 'hidden',
		position: 'absolute',
		justifyContent: 'center'
	},
	Content: {
		padding: 20,
		alignItems: 'center'
	},
	Header: {
		height: 230,
		width: 230,
		backgroundColor: '#FBFBFB',
		borderRadius: 100,
		marginTop: -120
	},
	Image: {
		width: 150,
		height: 80,
		// position: 'absolute',
	},
	Title: {
		fontWeight: 'bold',
		fontSize: 28,
		color: '#333'
	},
	Desc: {
		textAlign: 'center',
		color: '#666',
		fontSize: 16,
		marginTop: 20
	},
	Button: {
		borderRadius: 50,
		height: 40,
		width: 130,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 30
	},
	TextButton: {
		color: '#fff',
		fontWeight: 'bold'
	},
	Success: {
		backgroundColor: '#AAF577',
		// shadowColor: "#AAF577",
		// shadowOffset: {
		// 	width: 0,
		// 	height: 5,
		// },
		// shadowOpacity: 0.36,
		// shadowRadius: 6.68,
		// elevation: 11
	},
	Danger: {
		backgroundColor: '#F29091',
		// shadowColor: "#F29091",
		// shadowOffset: {
		// 	width: 0,
		// 	height: 5,
		// },
		// shadowOpacity: 0.36,
		// shadowRadius: 6.68,
		// elevation: 11
	},
	Warning: {
		backgroundColor: '#fbd10d',
		// shadowColor: "#fbd10d",
		// shadowOffset: {
		// 	width: 0,
		// 	height: 5,
		// },
		// shadowOpacity: 0.36,
		// shadowRadius: 6.68,
		// elevation: 11
	},
	CancelStyle: {
		marginTop: 10,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	TextCancel: {
		fontWeight: "bold",
	},
	successBtn: {
		height: 65,
		width: 65,
		borderRadius: 65 / 2,
		backgroundColor: colors.GREEN.secondary,
		margin: 15,
		justifyContent: 'center',
		alignItems: 'center'
	},
	cancelBtn: {
		height: 65,
		width: 65,
		borderRadius: 65 / 2,
		backgroundColor: 'red',
		margin: 15,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default Popup
