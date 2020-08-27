import * as React from 'react';
import moment from 'moment';
import { View, Text, ScrollView, RefreshControl, Switch} from 'react-native';
import * as styles from '../styles'
import { Button, Icon, withTheme, ListItem, Overlay } from 'react-native-elements';
import TaskService from '../services/task.service';
import rrule from "rrule";

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
            padding: 20,
            flexDirection: "column",
        }}>

            <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                <View style={{flexDirection: "column", justifyContent: "space-between"}}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "700",
                    }}>
                        {schedule.task.name}
                        </Text>

                        <Text style={{
                        fontSize: 12,
                        fontWeight: "500",
                    }}>
                        {schedule.task.description}
                        </Text>

                        <Text style={{
                        fontSize: 12,
                        fontWeight: "500",
                    }}>
                        {schedule.task.assigned_to}
                        </Text>

                        <Text style={{
                        fontSize: 12,
                        fontWeight: "500",
                    }}>
                        {rrule.fromString(schedule.rrule).toText()}
                        </Text>

                </View>

                {/* <Switch
                    trackColor={{ true: "gold" }}
                    thumbColor={true ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"

                    onValueChange={() => {
                        // const r = isRecurring;
                        // setIsRecurring(!r)
                    }}
                /> */}
            </View>


            <View style={{
                marginTop: 10,
                paddingTop: 10,
                borderTopColor: "#eee",
                borderTopWidth: "1px"
            }}>

                    <Text style={{
                        fontWeight: "500"
                    }}>
                        Next Assignment
                    </Text>
                    <ListItem
                            key="comingsoon"
                            title={"FEATURE COMING SOON"} />

                    <Text style={{
                        fontWeight: "500"
                    }}>
                        Previous Assigments
                    </Text>
{
                    tasks.map((task, i) => (
                        <ListItem
                            key={i}
                            checkBox={task.completed}
                            title={moment(task.created_at).format("l")}
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