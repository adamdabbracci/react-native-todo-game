import * as Permissions from "expo-permissions";
import * as Constants from "expo-constants";


export default class PushService {
    registerForPushNotificationsAsync = async () => {
        if (Constants.default.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
          }
          const token = await Notifications.getExpoPushTokenAsync();
          console.log(token);
          this.setState({ expoPushToken: token });
        } else {
          console.log('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.createChannelAndroidAsync('default', {
            name: 'default',
            sound: true,
            priority: 'max',
            vibrate: [0, 250, 250, 250],
          });
        }
        };
      
}