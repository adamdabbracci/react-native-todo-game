import * as React from 'react';
import { View, Text } from 'react-native';
import * as styles from '../styles'
import { Button, Icon, withTheme, Card } from 'react-native-elements';
import CurrentUserService from '../services/currentuser.service';
import TaskService from '../services/task.service';
import { ScrollView } from 'react-native-gesture-handler';

const currentUserService = new CurrentUserService();

export default function CoinStoreScreen(props) {


    return (
        <View style={{
            padding: 20,
            flexDirection: "column",
        }}>
            <Text style={{
                color: "white",
                fontSize: 20,
                fontWeight: "900",
                textAlign: "center"
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
                    flex: .5
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