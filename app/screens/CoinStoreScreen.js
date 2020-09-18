import * as React from 'react';
import { View, Text, Image } from 'react-native';
import * as styles from '../styles'
import { Button, Icon, withTheme, Card } from 'react-native-elements';
import CurrentUserService from '../services/currentuser.service';
import TaskService from '../services/task.service';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';

const currentUserService = new CurrentUserService();

export default function CoinStoreScreen(props) {

    spinValue = new Animated.Value(0)

// // First set up animation 
// Animated.loop(
//     Animated.timing(
//       spinValue,
//       {
//        toValue: 1,
//        duration: 3000,
//        easing: Easing.linear,
//        useNativeDriver: true
//       }
//     )
//    ).start();
   

// // Second interpolate beginning and end values (in this case 0 and 1)
// const spin = this.spinValue.interpolate({
//   inputRange: [0, 1],
//   outputRange: ['0deg', '360deg']
// })

    return (
        <View style={{
            padding: 20,
            flexDirection: "column",
        }}>
            <Text style={{
                color: "white",
                fontSize: 20,
                fontWeight: "900",
                textAlign: "center",
            }}>
                Redeem Your Coins
                </Text>

                

            <ScrollView style={{
                flexDirection: "column",
            }}>
                <Card>
                    <Text style={{marginBottom: 10}}>
                        image
                    </Text>
                    <Button
                        icon={<Icon name='toll' color='#ffffff' />}
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, backgroundColor: "gold"}}
                        title='100' />
                </Card>
                <Card
                containerStyle={{
                    flex: .5,
                }}>
                    <Text style={{marginBottom: 10}}>
                        image
                    </Text>
                    <Button
                        icon={<Icon name='toll' color='#ffffff' />}
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, backgroundColor: "gold"}}
                        title='100' />
                </Card>
                
            
            
            </ScrollView>
        </View>
    )
}