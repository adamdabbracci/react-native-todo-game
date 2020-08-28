import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import  moment from 'moment';
import { StyleSheet, Text, View, FlatList, Switch } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Input, Button, ListItem, ButtonGroup } from 'react-native-elements';
import TaskService from '../services/task.service';
import { Task, TaskSchedule } from '../services/task.model';

const taskService = new TaskService();




export default function CreateTaskScreen(props) {

    const isEditingSchedule = (props.route.params?.schedule) ? true : false
    console.log(`EDITING: ${isEditingSchedule}`)

    // Schedule options
    const scheduleOptions = {
      frequency: ["DAILY", "WEEKLY", "MONTHLY"],
    }

    // Form defaults
    const taskDefault = {
      name: "Test Task",
      description: "A nice description",
      coin_reward: 10,
      assignees: {},
  }

    // Main Form
    const [form, setForm] = React.useState((isEditingSchedule) ? props.route.params?.schedule?.task : taskDefault);
    const [schedule, setSchedule] = React.useState((isEditingSchedule) ? props.route.params?.schedule : {
      frequency: 0
    })

    // User List
    const [hasLoadedUsers, setHasLoadedUsers] = React.useState(false);
    const [userList, setUserList] = React.useState([]);
    const [assignedUser, setAssignedUser] = React.useState(null);

    // Toggles the button
    const [creatingTask, setCreatingTask] = React.useState(false);

    const updateForm = (key, value) => {
        const _form = form;
        _form[key] = value;
        setForm(_form);
    }

    const submitForm = async () => {
        setCreatingTask(true);

        // Pull out the users to assign it to
        const task = new Task();
        task.assigned_to = assignedUser;
        task.coin_reward = form.coin_reward;
        task.description = form.description;
        task.name = form.name;
        task.requires_photo_proof = false;
        
        // taskService.createTask(task);

        // If not recurring, setup task
        // if (!isRecurring) {
        //   await taskService.createTask(task);
        // }
        // // If recurring, setup schedule
        // else {
        //   const taskSchedule = new TaskSchedule();
        //   taskSchedule.task = task;
        //   taskSchedule.assigned_to = task.assigned_to;
        //   taskSchedule.frequency = schedule;
        //   taskSchedule.start_date = moment();
        //   taskSchedule.end_date = moment().add(1, "year");
        //   await taskService.createTaskSchedule(taskSchedule);
        // }
        const taskSchedule = new TaskSchedule();
          taskSchedule.task = task;
          taskSchedule.assigned_to = task.assigned_to;
          taskSchedule.frequency = schedule.frequency;
          taskSchedule.start_date = moment();
          taskSchedule.end_date = moment().add(1, "year");

          if (isEditingSchedule) {
            console.log(schedule.id)
            taskSchedule.id = schedule.id;
            await taskService.updateTaskSchedule(taskSchedule);
          }
          else {
            await taskService.createTaskSchedule(taskSchedule);
          }
          

          setCreatingTask(false);
          setForm(taskDefault);

          if (props.onTaskCreated) {
            props.onTaskCreated()
          }
          props.navigation.goBack();
      }

    const renderUserItem = ({item}) => {
      return (
        <ListItem
              checkmark={(assignedUser && assignedUser === item.id)}
              // leftAvatar={{ source: { uri: item.avatar_url } }}
              title={item.email_address}
              subtitle={`Click to assign this task.`}
              onPress={(event) => {
                setAssignedUser(item.id);
              }}
            />
      )
    }

    const renderRecurringForm = () => {
      return (
        <View>
          <ButtonGroup
          onPress={(selectedIndex) => {
            setSchedule({
              frequency: scheduleOptions.frequency[selectedIndex]
            })
          }}
          selectedIndex={scheduleOptions.frequency.indexOf(schedule.frequency)}
          buttons={scheduleOptions.frequency}
          containerStyle={{}}
        />
        <Text>Will start immediately and run until cancelled. We are working on making start/end date and more configurale.</Text>
        </View>
      )
    }

    React.useEffect(() => {
      const getAvailableUsers = async () => {
        return taskService.getAvailableUsers()
        .then((response) =>{
          if (response) {
            console.log("===== LOADED USERS: " + response.length)
            setUserList(response);
          }
          else {
            console.log("==== NO USERS LOADED.")
          }
        })
        .catch((ex) => {
          console.log(ex)
        })
      }
      if (!hasLoadedUsers) {
        console.log("Initializing user load...")
        getAvailableUsers();
        setHasLoadedUsers(true);
      }
    })


  return (
    <View style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Input
        placeholder='Task Name'
        onChangeText={value => updateForm("name", value)}
        defaultValue={form["name"]}
        />
        <Input
        onChangeText={value => updateForm("description", value)}
        placeholder='Task Description'
        defaultValue={form["description"]}
        />
  
      <View style={{
          flexDirection: "row",
      }}>
          <Input
              containerStyle={{
                  flex: .5
              }}
              keyboardType="number-pad"
              placeholder='Coin Reward'
              defaultValue={form["coin_reward"].toString()}
              onChangeText={value => updateForm("coin_reward", value)}
              leftIcon={{ type: 'material', name: 'toll' }}
              />

      </View>

      <View>
        <FlatList
                keyExtractor={(item, index) => item.id}
                data={userList}
                renderItem={renderUserItem}
                extraData={assignedUser}
              />
      </View>

      <View>
        {renderRecurringForm()}
      </View>
      

      <View style={{
            marginTop: 20
          }}>
        
          <Button
            title="Create"
            raised
            disabled={creatingTask || !assignedUser || !schedule.frequency || !form.description || !form.name}
            titleStyle={{
              fontWeight: "bold",
            }}
            buttonStyle={{
              backgroundColor: "gold",
              borderColor: "white",
              borderWidth: 2,
              borderRadius: 20
            }}
            onPress={submitForm}
          />

            {/* <Button
            title="Cancel"
            raised
            onPress={() => {
              if (props.onTaskCreated) {
                props.onTaskCreated()
              }
            }}
            titleStyle={{
              fontWeight: "bold",
              color: "gold"
            }}
            buttonStyle={{
              backgroundColor: "white",
              borderColor: "white",
              borderWidth: 2,
              borderRadius: 20
            }}
          /> */}
      </View>

      
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
