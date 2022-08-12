import { firebase } from '@react-native-firebase/dynamic-links';
import Config from 'utils/Config';

export const getLocationLink = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const link = await firebase.dynamicLinks().buildShortLink({
                link: `${Config.dynamicLinkPrefix}/?locationId=${id}`,
                ios: {
                    bundleId: Config.BUNDLE_ID_IOS,
                    appStoreId: "12345678",
                },
                android: {
                    packageName: Config.BUNDLE_ID_ANDROID,
                },
                domainUriPrefix: Config.dynamicLinkPrefix,
            }, firebase.dynamicLinks.ShortLinkType.SHORT)
                .then(function (data) {
                    return data;
                }).catch(function (e) {
                    // console.log(e)
                });
            resolve(link);
        } catch (error) {
            reject(error)
        }

    })
}