import * as React from 'react';
import { View, Text, Image } from 'react-native';
import * as styles from '../styles'
import { Button, Icon } from 'react-native-elements';
import CurrentUserService from '../services/currentuser.service';
import TaskService from '../services/task.service';
import HapticService from '../services/haptic.service';

const currentUserService = new CurrentUserService();
const taskService = new TaskService();

export default function TaskDetailsScreen(props) {

    const [isProcessing, setProcessing] = React.useState(false);

    async function completeTask() {
        setProcessing(true);
       await taskService.completeTask(props.task);
       
       setProcessing(false);
       props.onTaskCompleted()
    }

    return (
        <View style={{
            
        }}>
            {/* <Image
                height={30}
                width={30}
                source={require('../assets/images/star.png')}
            /> */}
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
            <Button
                title="Complete Task"
                type="solid"
                disabled={isProcessing}
                raised={true}
                onPress={completeTask}
                buttonStyle={{
                    marginTop: 30,
                    backgroundColor: "gold",
                }}
                titleStyle={{
                    color: "white",
                    fontWeight: "700"
                }}
            />
        </View>
    )
}