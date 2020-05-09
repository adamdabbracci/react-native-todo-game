import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Button, Overlay } from 'react-native-elements';

import Amplify, { API } from 'aws-amplify';
import awsconfig from '../aws-exports';
import TaskService from '../services/task.service';
import { ListItem } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import TaskDetailsScreen from './TaskDetailsScreen';
import BottyChatComponent from '../components/BottyChatComponent';

Amplify.configure(awsconfig);

const taskService = new TaskService();


export default function HomeScreen() {
  const [tasks, setTasks] = React.useState([]);
  const [hasFetched, setHasFetch] = React.useState(false);
  const [taskDetail, setTaskDetail] = React.useState({
    showTaskDetail: false,
    taskDetails: null,
  });

  async function fetchData() {
    console.log("Current: " + tasks.length + ", fetching.");

    taskService.getAll()
      .then((response) => {
        console.log("Loaded "+response.length+" tasks.")
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
      <ScrollView>
        {
          tasks.map((l, i) => (
            <ListItem
              key={i}
              title={l.name}
              onPress={() => {
                console.log("press")
                showTaskDetail(l)
              }}
              bottomDivider

              badge={{
                value: `${l.coin_reward} / ${l.ticket_reward}`,
                badgeStyle: {
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
      <BottyChatComponent


        style={{
          position: "absolute",
          top: 0
        }}></BottyChatComponent>

    </View>
  )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
