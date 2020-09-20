import * as React from 'react';
import { View, Text, VirtualizedList } from 'react-native';
import { Button, Icon, withTheme, Input, ListItem, Overlay } from 'react-native-elements';
import CurrentUserService from '../services/currentuser.service';
import UserService from '../services/user.service';
import PushService from '../services/push.service';
import styles from '../styles'

const currentUserService = new CurrentUserService();
const userService = new UserService();
const pushService = new PushService();

export default function AccountScreen(props) {

    const [user, setUser] = React.useState(null);
    const [showRequestSponsorOverlay, setShowRequestSponsorOverlay] = React.useState(false);
    const [sponsees, setSponsees] = React.useState(null);
    const [sponsors, setSponsors] = React.useState(null);
    const [userSearchResults, setUserSearchResults] = React.useState([]);

    React.useEffect(() => {
        getAccountDetails()
    }, [])

    const getAccountDetails = async () => {
        setUser(await currentUserService.getAccount())
        
        currentUserService.getSponsorships()
        .then((sponsorships) => {
            setSponsees(sponsorships.sponsees)
            setSponsors(sponsorships.sponsors)
        })
    }

    searchByUsername = async (username) => {
        return userService.searchUsersByUsername(username)
            .then((results) => {
                setUserSearchResults(results)
            })
            .catch((ex) => {
                console.log("Failed to search for user")
                console.log(ex)
            })
    }

    const requestSponsor = async (sponsorId) => {
        return currentUserService.requestSponsor(sponsorId)
        .then((results) => {
            setShowRequestSponsorOverlay(false)
            getAccountDetails()
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
                        ...styles.gold,
                        ...styles.titleText,
                        marginBottom: 20,
                    }}>
                        @{user.username}
                    </Text>


                    <ListItem
                        key={1}
                        title={'Email Address'}
                        subtitle={user.email_address}
                        bottomDivider
                        style={{
                            ...styles.gold
                        }}
                    // onPress={() => {
                    //     props.navigation.navigate('ScheduleDetailsScreen', {
                    //         schedule: schedule
                    //     })
                    // }}
                    />
                    
                </View>
            )
        }
        else {
            return (
                <Text>No user!</Text>
            )
        }
    }

    const renderAccountButton = () => {


        return (

            <View style={{
                marginTop: 20,
            }}>
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
                style={{
                }}

                onPress={() => {
                    currentUserService.logout();
                }}
            />
            </View>
        )
    }
    

    const renderAddSponsorOverlay = () => {
        return (
            <Overlay overlayStyle={{
                width: '90%',
                minHeight: '50%'
            }} isVisible={showRequestSponsorOverlay} onBackdropPress={() =>{
                setShowRequestSponsorOverlay(false)
            }}>
                <View>
                <Text style={{
                    ...styles.titleText
                }}>
                    Ask someone to be your sponsor
                </Text>
                 <Input
                    onChangeText={value => {
                        searchByUsername(value)
                    }}
                    placeholder='Find a user by username'
                />

                {
                            userSearchResults.map((r) => {
                                return (
                                    <ListItem
                                        key={r.id}
                                        title={r.username}
                                        subtitle={r.email_address}
                                        bottomDivider
                                        onPress={() => {
                                           requestSponsor(r.id) 
                                        }}
                                        />
                                )
                            })
                        }
                </View>
      </Overlay>
        )
    }

    const renderSponsorshipSection = () => {

        if (!sponsors || !sponsees) {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }
        return (
            <View>
                <View>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{
                                ...styles.gold,
                                ...styles.titleText,
                                marginTop: 20,
                            }}>
                                Your Sponsors
                                
                            </Text>
                            <Icon                              
                                name='plus-circle'
                                type="font-awesome"
                                color="white"
                                style={{
                                    marginTop: 20,
                                }}
                                onPress={() => {
                                   setShowRequestSponsorOverlay(true) 
                                }}
                                /> 
                        </View>
                        {
                            sponsors.map((sponsor) => {
                                return (
                                    <ListItem
                                key={sponsor.id}
                                title={sponsor.username}
                                subtitle={sponsor.email_address}
                                bottomDivider
                                style={{
                                    ...styles.gold
                                }} />
                                )
                            })
                        }
                    </View>

                    <View >
                        <Text style={{
                            ...styles.gold,
                            ...styles.titleText,
                            textAlign: "left",
                            marginTop: 20,
                        }}>
                            Your Sponsees
                        </Text>
                        
                        {
                            sponsees.map((sponsee) => {
                                return (
                                    <ListItem
                                key={sponsee.id}
                                title={sponsee.username}
                                subtitle={sponsee.email_address}
                                bottomDivider
                                style={{
                                    ...styles.gold
                                }} />
                                )
                            })
                        }
                    </View>
            </View>
                    
        )
    }

    return (
        <View style={{
            padding: 20,
            flexDirection: "column",
        }}>

            {renderAddSponsorOverlay()}

            {renderUserDetails()}

            {renderAccountButton()}


            <View style={{
                marginTop: 20
            }}>

               {renderSponsorshipSection()}

                

            </View>

        </View>
    )
}