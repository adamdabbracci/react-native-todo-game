import * as React from 'react';
import moment from 'moment';
import { View, Text, ScrollView, RefreshControl} from 'react-native';
import * as styles from '../styles'
import { Button, Icon, withTheme, ListItem, Overlay } from 'react-native-elements';
import TaskService from '../services/task.service';

const taskService = new TaskService();

export default function ManageTaskScreen(props) {
    
    const [schedule, setSchedule] = React.useState(props.route.params.schedule);
    const [tasks, setTasks] = React.useState([]);
    console.log(schedule)

    React.useEffect(() => {
        let isSub = true;
        if (isSub) {
            taskService.getTasksCreatedBySchedule(schedule.id)
            .then((tasks) => {
                console.log(tasks);
                setTasks(tasks);
            })
            .catch((ex) => {
                console.log(ex)
            })
        }
        return () => isSub = false;
    }, [true])

    return (
        <View style={{
            marginTop: 10,
            padding: 20,
            flexDirection: "column",
        }}>

            <View style={{flexDirection: "column", justifyContent: "space-between"}}>
            <Text style={{
                fontSize: 20,
                fontWeight: "900",
                textAlign: "center"
            }}>
                {schedule.task.name}
                </Text>

                <Text style={{
                fontSize: 20,
                fontWeight: "500",
                textAlign: "center"
            }}>
                {schedule.task.description}
                </Text>

            </View>


            <View>

{
                    tasks.map((task, i) => (
                        <ListItem
                            key={i}
                            checkBox={task.completed}
                            title={task.name}
                            subtitle={moment(task.created_at).format("l")}
                            bottomDivider
                            onPress={() => {
                                props.navigation.navigate('ManageTaskScreen', {
                                    schedule: schedule
                                })
                            }}
                        />
                    ))
                }
            </View>

        </View>



    )
}