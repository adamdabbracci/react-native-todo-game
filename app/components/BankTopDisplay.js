import * as React from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import CurrentUserService from '../services/currentuser.service';
import Bank from '../services/bank.model';


export default function BankTopDisplayComponent() {

    const currentUserService = new CurrentUserService();
    const bank = currentUserService.getUserBank();

    React.useEffect(() => {

    })


    return (
        <View style={{
            flexDirection: "row",
            
            }}>
            <View style={{
              alignContent: "center",
              backgroundColor: "gold",
              flexDirection: "column",
              paddingTop: 20,
              paddingBottom: 20,
              flex: .5
            }}>
              <Icon
                name="toll"
                color="white"
                size={40}
                style={{
                }}
              ></Icon>
              <Text style={{
                color: "white", 
                fontWeight: "bold", 
                fontSize: 30,
                textAlign: "center",
                }}>{bank.coins} coins</Text>
    
            </View>
    
            <View style={{
              alignContent: "center",
              backgroundColor: "gold",
              flexDirection: "column",
              paddingTop: 20,
              paddingBottom: 20,
              flex: .5
            }}>
              <Icon
                name="ticket"
                type="font-awesome"
                color="white"
                size={40}
                style={{
                }}
              ></Icon>
              <Text style={{
                color: "white", 
                fontWeight: "bold", 
                fontSize: 30,
                textAlign: "center",
                }}>{bank.tickets} Tickets</Text>
    
            </View>
          </View>
    )
            }