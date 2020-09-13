import * as React from 'react';
import moment from 'moment';
import { View, Text, ScrollView, RefreshControl, Switch} from 'react-native';
import * as styles from '../styles'
import { Button, Icon, withTheme, ListItem, Overlay } from 'react-native-elements';
import TaskService from '../services/task.service';

const taskService = new TaskService();

export default function ScheduleDetailsScreen(props) {
    
    const [schedule, setSchedule] = React.useState(props.route.params.schedule);
    const [tasks, setTasks] = React.useState([]);

    React.useEffect(() => {
        let isSub = true;
        if (isSub) {
            loadScheduleDetails()
        }
        return () => isSub = false;
    }, [true])

    const loadScheduleDetails = () => {

        return taskService.getSchedule(schedule.id)
        .then((schedule) => {
            setSchedule(schedule)
            setTasks(schedule.tasks);
        })
        .catch((ex) => {
            console.log("Failed to load schedule defualts:")
            console.log(ex)
        })
    }
    return (
        <View style={{
            padding: 20,
            flexDirection: "column",
        }}>

            <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                <View style={{flexDirection: "column"}}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "700",
                    }}>
                        {schedule.name}
                        </Text>

                        <Text style={{
                        fontSize: 12,
                        fontWeight: "500",
                    }}>
                        {schedule.description}
                        </Text>

                        <Text style={{
                        fontSize: 12,
                        fontWeight: "500",
                    }}>
                        {schedule.assigned_to}
                        </Text>

                        <Text style={{
                        fontSize: 12,
                        fontWeight: "500",
                    }}>
                        {schedule.frequency} from {moment(schedule.start_date).format('LL')} to {moment(schedule.end_date).format('LL')}
                        </Text>

                </View>

                <Button
                title={`Edit`}
                type="solid"
                
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
                    props.navigation.navigate('EditScheduleScreen', {
                        schedule,
                        onSave: () => {
                            loadScheduleDetails()
                        }
                    })
                }}
            />

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
                            checkmark={task.completed}
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