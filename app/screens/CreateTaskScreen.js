import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, FlatList, Switch } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Input, Button, ListItem, ButtonGroup } from 'react-native-elements';
import TaskService from '../services/task.service';
import { Task } from '../services/task.model';
import RRuleService from '../services/rrule.service';

const taskService = new TaskService();
const rRuleService = new RRuleService();




export default function CreateTaskScreen(props) {

    // Schedule options
    const scheduleOptions = {
      frequency: ["DAILY", "WEEKLY", "MONTHLY"],
    }

    // Form defaults
    const taskDefault = {
      name: "",
      description: "",
      coin_reward: "",
      assignees: {},
  }

    // Main Form
    const [form, setForm] = React.useState(taskDefault);
    const [isRecurring, setIsRecurring] = React.useState(false);
    const [schedule, setSchedule] = React.useState({
      frequency: "DAILY",
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

    const submitForm = () => {
        setCreatingTask(true);

        // Pull out the users to assign it to
        const task = new Task();
        task.assigned_to = assignedUser;
        task.coin_reward = form.coin_reward;
        task.description = form.description;
        task.name = form.name;
        task.requires_photo_proof = false;
        console.log(task);
        
        taskService.createTask(task);
        setCreatingTask(false);
        setForm(taskDefault);
        props.onTaskCreated()
    }

    const renderUserItem = ({item}) => {
      console.log(item)
      return (
        <ListItem
              checkmark={(assignedUser && assignedUser.id === item.id)}
              leftAvatar={{ source: { uri: item.avatar_url } }}
              title={item.username}
              subtitle={`Click to assign this task.`}
              onPress={(event) => {
                setAssignedUser(item.id);
              }}
              bottomDivider
            />
      )
    }

    const renderRecurringForm = () => {
      if (isRecurring) {
        return (
          <ButtonGroup
            onPress={(selectedIndex) => {
              console.log(selectedIndex)
            }}
            selectedIndex={0}
            buttons={scheduleOptions.frequency}
            containerStyle={{}}
          />
        )
      }
      else {
        return (
          <View></View>
        )
      }
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

      <View style={{
        flexDirection: "row",
        marginTop: 10
      }}>
        <Switch
          trackColor={{ true: "gold" }}
          thumbColor={true ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            const r = isRecurring;
            setIsRecurring(!r)
          }}
          value={isRecurring}
        />
        <Text style={{
          top: 7,
          left: 10,
          fontWeight: "600",
          fontSize: 20
        }}>Recurring</Text>
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
            disabled={creatingTask}
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
