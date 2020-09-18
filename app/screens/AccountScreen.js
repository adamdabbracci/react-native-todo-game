import * as React from 'react';
import { View, Text } from 'react-native';
import * as styles from '../styles'
import { Button, Icon, withTheme, Input } from 'react-native-elements';
import CurrentUserService from '../services/currentuser.service';
import UserService from '../services/user.service';
import PushService from '../services/push.service';
import TaskService from '../services/task.service';

const currentUserService = new CurrentUserService();
const userService = new UserService();
const pushService = new PushService();

export default function AccountScreen(props) {

    const [user, setUser] = React.useState(null);

    searchByUsername = async (username) => {
        return userService.searchUsersByUsername("user")
        .then((results) => {
            console.log(results)
        })
        .catch((ex) => {
            console.log("Failed to search for user")
            console.log(ex)
        })
    }
   
    renderUserDetails = () => {
        if (user) {
            return (
                <View>
                    <Text style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "500",
                    textAlign: "center"
                }}>
                                        User ID

                </Text>
                <Text style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "900",
                    textAlign: "center"
                }}>
                    {user.id}
                </Text>
                </View>
            )
        }
        else {
            currentUserService.getAccount()
            .then((details) => {
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

<Input
          onChangeText={value => {
              searchByUsername(value)
          }}
          placeholder='Find a user by username'
          />


           {renderAccountButton()}

           </View>
           
        </View>
    )
}