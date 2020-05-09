import * as React from 'react';
import { View, Text } from 'react-native';
import * as styles from '../styles'
import { Button, Icon } from 'react-native-elements';
import CurrentUserService from '../services/currentuser.service';
import TaskService from '../services/task.service';

const currentUserService = new CurrentUserService();
const taskService = new TaskService();

export default function TaskDetailsScreen(props) {

    function completeTask() {
        const bank = currentUserService.addBank({
            coins: props.task.coin_reward,
            tickets: props.task.ticket_reward,
        })

       alert("Congratulations! You now have " + bank.coins + " coins and " + bank.tickets + " tickets.");

       taskService.removeTask(props.task.id);
    }

    return (
        <View>
            <Text style={{
                fontWeight: "bold",
                fontSize: 20,
                ...styles.container
            }}>
                {props.task.name}
            </Text>
            <Text style={{
                    fontSize: 14
                }}>
                {props.task.description}
            </Text>

            <View style={{
                flexDirection: "row"
            }}>
                <Icon
                    name='toll'
                    type='material'
                    color="gold"
                    style={{
                        marginRight: 10,
                        marginTop: 10
                    }}
                />
                <Text style={{
                    marginTop: 10,
                    color: "gold",
                    fontWeight: "bold",
                }}>

                    {props.task.coin_reward} coins
                </Text>
            </View>
            <View style={{
                flexDirection: "row"
            }}>
                <Icon
                    name='assignment-turned-in'
                    type='material'
                    color="gold"
                    style={{
                        marginRight: 10,
                        marginTop: 10
                    }}
                />
                <Text style={{
                    marginTop: 10,
                    color: "gold",
                    fontWeight: "bold",
                }}>

                    {props.task.ticket_reward} tickets
                </Text>
            </View>


            <View style={{
                flexDirection: "row"
            }}>
                <Icon
                    name='photo-camera'
                    type='ionicons'
                    color="green"
                    style={{
                        marginRight: 10,
                        marginTop: 10
                    }}
                />
                <Text style={{
                    marginTop: 10,
                    color: "green",
                    fontWeight: "bold",
                }}>

                    Requires photo proof
                </Text>
            </View>


            <Button
                title="Complete Task"
                type="solid"
                raised={true}
                onPress={completeTask}
                style={{
                    marginTop: 30
                }}
            />
        </View>
    )
}