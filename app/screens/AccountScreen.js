import * as React from 'react';
import { View, Text } from 'react-native';
import * as styles from '../styles'
import { Button, Icon, withTheme } from 'react-native-elements';
import CurrentUserService from '../services/currentuser.service';
import TaskService from '../services/task.service';

const currentUserService = new CurrentUserService();

export default function AccountScreen(props) {

    const [user, setUser] = React.useState(null);

    
   
    renderUserDetails = () => {
        if (user) {
            return (
                <Text style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "900",
                    textAlign: "center"
                }}>
                    {user.email}
                </Text>
            )
        }
        else {
            currentUserService.getUserDetails()
            .then((details) => {
                console.log(details)
                setUser(details)
            })
        
            return (
                <Text>No user!</Text>
            )
        }
    }

    renderAccountButton = () => {


        return (
           
                <Button
                title="Log Out"
                type="solid"
                raised={true}
                
                buttonStyle={{
                    backgroundColor: "gold",
                    borderColor: "white",
                    borderRadius: 10,
                    borderWidth: 2,
                }}
                titleStyle={{
                    color: "white",
                    fontWeight: "700"
                }}

                onPress={() => {
                    currentUserService.logout();
                }}
            />
        )
    }

    return (
        <View style={{
            marginTop: 40,
            padding: 20,
            flexDirection: "column",
        }}>

               

            {renderUserDetails()}
           
           <View style={{
               marginTop: 20
           }}>
           {renderAccountButton()}
           </View>
           
        </View>
    )
}