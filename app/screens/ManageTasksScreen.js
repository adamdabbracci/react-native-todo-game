import * as React from 'react';
import { View, Text, ScrollView, RefreshControl} from 'react-native';
import * as styles from '../styles'
import { Button, Icon, withTheme, ListItem, Overlay } from 'react-native-elements';
import TaskService from '../services/task.service';
import CreateTaskScreen from './CreateTaskScreen';

const taskService = new TaskService();

export default function ManageTasksScreen(props) {

  const [createTaskOverlayVisible, setCreateTaskOverlayVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

    const [taskSchedules, setTaskSchedules] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);

    function closeTaskOverlay() {
        setTaskDetail({
          taskDetails: null,
          showTaskDetail: false,
        });
        setCreateTaskOverlayVisible(false);
      }


      const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData()
        .then(() => {
          setRefreshing(false);
        })
        .catch(() =>{
          setRefreshing(false)
        })
      }, [refreshing]);


    React.useEffect(() => {
        let isSub = true;
        if (isSub) {
            fetchData();
        }
        return () => isSub = false;
    }, [true])

    async function fetchData() {
        let promises = [
            // taskService.getCreatedTasks().then((tasks) => {
            //     setTasks(tasks);
            // })
            //     .catch((ex) => {
            //         console.log(ex);
            //     }),

            taskService.getCreatedTaskSchedules().then((schedules) => {
                setTaskSchedules(schedules);

            })
                .catch((ex) => {
                    console.log(ex);
                }),

            // taskService.getAvailableUsers().then((users) => {
            //     if (isSub) {
            //         console.log("users")
            //     }

            // })
            // .catch((ex) => {
            //     console.log(ex);
            // })
        ]

        return promises;
    }

    return (
        <View style={{
            marginTop: 10,
            padding: 20,
            flexDirection: "column",
        }}>

            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={{
                color: "white",
                fontSize: 20,
                fontWeight: "900",
                textAlign: "center"
            }}>
                Manage Chore Schedules
                </Text>

                <Icon                              
                    name='plus-circle'
                    type="font-awesome"
                    color="white"
                    onPress={() => {
                        props.navigation.navigate('CreateTaskScreen')
                    }}
                    />  
            </View>

            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                style={{
                    backgroundColor: "gold",
                    height: "100%",
                    marginTop: 10
                }}>

{
                    taskSchedules.map((schedule, i) => (
                        <ListItem
                            key={i}
                            title={schedule.task.name}
                            subtitle={schedule.frequency}
                            bottomDivider
                            onPress={() => {
                                props.navigation.navigate('ManageTaskScreen', {
                                    schedule: schedule
                                })
                            }}
                        />
                    ))
                }
                </ScrollView>



            <Overlay isVisible={createTaskOverlayVisible} onBackdropPress={() => { closeTaskOverlay() }} overlayStyle={{
        width: "99%",
        height: "99%",
        backgroundColor: "transparent",
      }}>
                <CreateTaskScreen onTaskCreated={() => {
                  setCreateTaskOverlayVisible(false)
                }}></CreateTaskScreen>

      </Overlay>

        </View>



    )
}