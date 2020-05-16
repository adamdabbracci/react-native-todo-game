import { EventEmitter } from "react-native";

export default class BottyService {

    onNewMessage = new EventEmitter();

    newMessage = (message) =>{
        console.log("New botty message: " + message);
        onnew
    }
    
}