import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';

import Colors from '../constants/Colors';
import { View, Text, Image } from 'react-native';

import {API, Auth} from 'aws-amplify';
import TaskService from '../services/task.service';
import CurrentUserService from '../services/currentuser.service';
import { Animations } from './Animations';

const currentUserService = new CurrentUserService();
  

export default function BottyChatComponent(props) {

  const [message, setMessage] = React.useState("");

  

function BottyMessage({targetMessage}){
    
    // try {
    //   const user = await currentUserService.getUserDetails();
    //   console.log(user)
    //   setUser(user);
    // }
    // catch(ex) {
    //   console.log(ex);
    // }

      if (message.length < targetMessage.length) {
        const newMessage = message + targetMessage[message.length];
        setTimeout(() => {
          setMessage(newMessage);
        }, 10);
      }

    return (
      <Text style={{
        fontWeight: "bold",
        color: "white"
    }}>
      {message}
     </Text>
    )
  }

  const bank = currentUserService.getUserBank();

  return (
    <View style={{
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 10,
        borderBottomColor: "#aaaaaa",
        

    }}>
         <Image
            source={
              __DEV__
                ? require('../assets/images/robot-dev.png')
                : require('../assets/images/robot-prod.png')
            }
            style={{
                flex: .3,
            }}
          />
       <View style={{
            flex: .7,
            marginLeft: 20,
           padding: 20,
           backgroundColor: "purple",
           borderRadius: 30
       }}>
         <BottyMessage targetMessage={`Whaddup girl! This is your home-bot Botty. You have ${bank.coins} coins and ${bank.tickets} tickets.`}></BottyMessage>
        
       </View>
    </View>
  );
}
