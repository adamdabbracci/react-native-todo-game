import * as React from 'react';

const { Auth } = require("aws-amplify");
import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react-native';
import { View } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';


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
    }
    
    render() {
        const {username, password, error} = this.state
        const { onLoggedIn, authState, onStateChange } = this.props

        if (authState !== 'signIn') {
          return (<View></View>)
        }

      return (
        <View style={{
          width: "100%",
          padding: 10,
          position: "absolute",
          top: '10%'
        }}>
            {error && (
                <Text style={{
                    color: "red",
                    fontWeight: "900",
                }}>{error}</Text>
            )}

            <Text style={{
                fontWeight: "bold",
                marginBottom: 20,
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
            secureTextEntry={true}
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

            <View style={{
              marginTop: 20
            }}>
            <Button
                title="No account? Sign up!"
                titleStyle={{
                    color: "gold",
                    fontWeight: "900"
                }}
                buttonStyle={{
                  backgroundColor: "white"
                }}
                onPress={() => {
                  onStateChange('signUp')
                }}
            />
            </View>
        </View>
      )
    }
  }


  class CustomSignUp extends SignUp {

    CustomSignUp(props){
        this.state = {
            username: null,
            password: null,
            email: null,
            error: null
        }
    }

    componentDidMount() {
      this.setState({
        username: '+18143927017',
        password: 'newPassWhoDis123',
        email: 'smallanditalian5@gmail.com',
        error: null
    })
    }

    render() {
      const {username, password, email, error} = this.state
      const { onLoggedIn, authState, onStateChange } = this.props

      if (authState !== 'signUp') {
        return (<View></View>)
      }

    return (
      <View style={{
        width: "100%",
        padding: 10,
        position: "absolute",
        top: '10%'
      }}>
          {error && (
              <Text style={{
                  color: "red",
                  fontWeight: "900",
              }}>{error}</Text>
          )}

          <Text style={{
              fontWeight: "bold",
              marginBottom: 20,
          }}>
              Register A New Account
          </Text>
        <Input
          placeholder='Phone Number'
          textContentType="telephoneNumber"
          value={username}
          autoCompleteType="tel"
          onChangeText={value => this.setState({ username: value })}
          style={{
            width: "100%",
          }}
        />

          <Input
          placeholder='Password'
          textContentType="password"
          autoCompleteType="password"
          secureTextEntry={true}
          value={password}
          onChangeText={value => this.setState({ password: value })}
          style={{
            width: "100%"
          }}
        />

      <Input
          placeholder='Email Address'
          textContentType="emailAddress"
          autoCompleteType="email"
          value={email}
          onChangeText={value => this.setState({ email: value })}
          style={{
            width: "100%"
          }}
        />


          <Button
              title="Register"
              buttonStyle={{
                  backgroundColor: "gold",
              }}
              onPress={() => {
                console.log(username, password, email)
                  Auth.signUp({
                    username,
                    password,
                    attributes: {
                      email,
                    }
                  })
                  .then((user) => {
                      onStateChange('confirmSignUp')
                  })
                  .catch((ex) => {
                      this.setState({ error: ex.message})
                  })
              }}
          />

          <View style={{
            marginTop: 20
          }}>
          <Button
              title="Have an account? Sign in!"
              titleStyle={{
                  color: "gold",
                  fontWeight: "900"
              }}
              buttonStyle={{
                backgroundColor: "white"
              }}
              onPress={() => {
                onStateChange('signIn')
              }}
          />
          </View>
      </View>
    )
  }
  }
export {
    CustomSignIn,
    CustomSignUp,
}

export { ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react-native';