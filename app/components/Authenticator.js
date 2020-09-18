import * as React from 'react';

const { Auth } = require("aws-amplify");
import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react-native';
import { View } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Link } from '@react-navigation/native';


async function login(username, password) {
    try {
        const user = await Auth.signIn(username, password);
        return user
    } catch (error) {
        console.log('error signing in:');
        console.log(error)
        throw error;
    }
}

class CustomSignIn extends SignIn {

    CustomSignIn(props){
      console.log(props)
        this.state = {
            username: null,
            password: null,
            error: null
        }
    }

    componentDidMount() {
        console.log(this.state)
    }
    
    render() {
        const {username, password, error} = this.state
        const { onLoggedIn } = this.props

      return (
        <View style={{
          width: "100%",
          padding: 10,
          top: -100
        }}>
            {error && (
                <Text style={{
                    color: "red",
                    fontWeight: "900",
                }}>{error}</Text>
            )}

            <Text style={{
                fontWeight: "bold"
                
            }}>
                Sign In
            </Text>
          <Input
            placeholder='Phone Number'
            textContentType="telephoneNumber"
            value={username}
            onChangeText={value => this.setState({ username: value })}
            style={{
              width: "100%",
            }}
          />
  
            <Input
            placeholder='Password'
            textContentType="password"
            onChangeText={value => this.setState({ password: value })}
            style={{
              width: "100%"
            }}
          />


            <Button
                title="Sign In"
                buttonStyle={{
                    backgroundColor: "gold",
                }}
                onPress={() => {
                    login(username, password)
                    .then((user) => {
                        onLoggedIn()
                    })
                    .catch((ex) => {
                        this.setState({ error: ex.message})
                    })
                }}
            />
        </View>
      )
    }
  }

export {
    CustomSignIn
}

export { ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react-native';