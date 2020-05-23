import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList, RefreshControl } from 'react-native';
import { Button, Overlay, Icon } from 'react-native-elements';
import Amplify, { API } from 'aws-amplify';
import awsconfig from '../aws-exports';
import TaskService from '../services/task.service';
import { ListItem } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import TaskDetailsScreen from './TaskDetailsScreen';
import BottyChatComponent from '../components/BottyChatComponent';
import BankTopDisplayComponent from '../components/BankTopDisplay';
import CreateTaskScreen from './CreateTaskScreen';
import HapticService from '../services/haptic.service';

Amplify.configure(awsconfig);

const taskService = new TaskService();
const hapticService = new HapticService();


export default function HomeScreen({navigation}) {
  const [tasks, setTasks] = React.useState([]);
  const [hasFetched, setHasFetch] = React.useState(false);
  const [taskDetail, setTaskDetail] = React.useState({
    showTaskDetail: false,
    taskDetails: null,
  });

  const [createTaskOverlayVisible, setCreateTaskOverlayVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  async function fetchData() {
    console.log("Current: " + tasks.length + ", fetching.");

    taskService.getAll()
      .then((response) => {
        if (response && response.sort) {
          console.log("Loaded "+response.length+" tasks.")

          const sortedResponse = response.sort((a,b) => {
            return (a.completed) ? 1 : -1
          })
          setTasks(sortedResponse)
        }
        else {
          alert("Failed to retrive tasks.")
        }
      })
      .catch((ex) => {
        console.log(ex)
      });
  }

  React.useEffect(() => {
    if (!hasFetched) {
      fetchData();
      setHasFetch(true);
    }
  })


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData()
    .then(() => setRefreshing(false))
    .catch(() =>{
      setRefreshing(false)
    })
  }, [refreshing]);

  const buildRewardDetailElement = (coincount) => {
    return (
      <View style={{
        alignContent: "center",
        alignItems:"center",
        width: "20%",
      }}>
        <Icon
          name="toll"
          color="white"
        ></Icon>
        <Text style={{
          color: "white",
          fontWeight: "900",
          fontSize: 20
        }}>{coincount || 0}</Text>
      </View>
    )
  }


  function showTaskDetail(task) {
    console.log("Showing task details:")
    console.log(task);
    setTaskDetail({
      taskDetails: task,
      showTaskDetail: true,
    });
  }


  function closeTaskOverlay() {
    setTaskDetail({
      taskDetails: null,
      showTaskDetail: false,
    });
    setCreateTaskOverlayVisible(false);
    fetchData();
  }

  return (
    <View style={styles.container}>
      <View style={{
            position: 'absolute',                                          
            bottom: 10,                                               
            right: 15,
            width: 50,
            height: 50,
            zIndex: 2,
          }}>
         <Icon                              
          name='plus'
          type="font-awesome"
          raised={true}      
          color="navy"
          onPress={() => {
            setCreateTaskOverlayVisible(true);
          }}
        />  
      </View>
      {/* <BottyChatComponent
        
        style={{
          position: "absolute",
          top: 0
        }}></BottyChatComponent>
         */}

      <BankTopDisplayComponent></BankTopDisplayComponent>

      <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          backgroundColor: "gold"
        }}
        >
        {
          tasks.map((l, i) => (
            <ListItem
              key={i}
              title={l.name}
              subtitle={l.description}
              onPress={() => {
                if (l.completed) {
                  alert("You've already completed this task!")
                }
                else {
                  showTaskDetail(l)
                }
              }}
              leftElement={buildRewardDetailElement(l.coin_reward)}
              containerStyle={{
                backgroundColor: "gold",
              }}
              titleStyle={{
                color: "white",
                fontSize: 24,
                fontWeight: "bold"
              }}
              subtitleStyle={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold"
              }}
              rightElement={() => {
                if (l.completed) {
                  return (
                    <View>
                      <Icon name="award" type="font-awesome-5" color="white"></Icon>
                    <Text style={{color: "white"}}>Done</Text>
                    </View>

                  )
                }
              }}
              
            />
          ))
        }
      </ScrollView>

      <Overlay isVisible={(taskDetail.showTaskDetail === true)} onBackdropPress={() => { closeTaskOverlay() }} style={{
        
      }}>
        <View style={{
          borderColor: "gold",
          borderWidth: 10,
        padding: 20,

        }}>
          <TaskDetailsScreen task={taskDetail.taskDetails} onTaskCompleted={() => {
            hapticService.quickVibrate();
            closeTaskOverlay();
          }}></TaskDetailsScreen>
        </View>
        
      </Overlay>

      <Overlay isVisible={createTaskOverlayVisible} onBackdropPress={() => { closeTaskOverlay() }} overlayStyle={{
        width: "95%",
        height: 500,
        backgroundColor: "transparent",
      }}>
                <CreateTaskScreen onTaskCreated={() => {
                  setCreateTaskOverlayVisible(false)
                }}></CreateTaskScreen>

      </Overlay>
      

    </View>
  )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
