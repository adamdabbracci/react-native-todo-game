import { Vibration } from "react-native";

export default class HapticService{
    quickVibrate = () => {
        Vibration.vibrate(1000);
    }
}