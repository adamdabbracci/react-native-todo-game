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

Amplify.configure(awsconfig);

const taskService = new TaskService();


export default function HomeScreen() {
  const [tasks, setTasks] = React.useState([]);
  const [hasFetched, setHasFetch] = React.useState(false);
  const [taskDetail, setTaskDetail] = React.useState({
    showTaskDetail: false,
    taskDetails: null,
  });
  const [refreshing, setRefreshing] = React.useState(false);

  async function fetchData() {
    console.log("Current: " + tasks.length + ", fetching.");

    taskService.getAll()
      .then((response) => {
        console.log("Loaded "+response.length+" tasks.")
        response = response.sort((a,b) => {
          return (a.completed) ? 1 : -1
        })
        setTasks(response)
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
        alignItems:"center"
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
    fetchData();
  }

  return (
    <View style={styles.container}>
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
                    <Icon name="check" type="font-awesome-5" color="white"></Icon>
                  )
                }
              }}
              
            />
          ))
        }
      </ScrollView>

      <Overlay isVisible={(taskDetail.showTaskDetail === true)} onBackdropPress={() => { closeTaskOverlay() }} style={{
        padding: 20,
      }}>
        <TaskDetailsScreen task={taskDetail.taskDetails} ></TaskDetailsScreen>
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
