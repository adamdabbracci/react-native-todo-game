import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Input, Button, ListItem } from 'react-native-elements';
import TaskService from '../services/task.service';
import { Task } from '../services/task.model';

const taskService = new TaskService();

const stateDefault = {
    name: "",
    description: "",
    coin_reward: "",
    assignees: {},
}

export default function CreateTaskScreen(props) {

    // Main Form
    const [form, setForm] = React.useState(stateDefault);

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
        setForm(stateDefault);
        props.onTaskCreated()
    }

    // const toggleAssignee = (id) => {
    //   const _userList = userList;
    //   const matchingUserIndex = _userList.findIndex(x => x.id === id);
    //   _userList[matchingUserIndex].selected = !_userList[matchingUserIndex].selected;
    //   setUserList(_userList);
    // }


    const renderUserItem = ({item}) => {
      console.log(item)
      return (
        <ListItem
              checkmark={(assignedUser && assignedUser.id === item.id)}
              leftAvatar={{ source: { uri: item.avatar_url } }}
              title={item.email}
              subtitle={`Click to assign this task.`}
              onPress={(event) => {
                setAssignedUser(item.id);
              }}
              bottomDivider
            />
      )
     
    }

    React.useEffect(() => {
      const getAvailableUsers = async () => {
        return taskService.getAvailableUsers()
        .then((response) =>{
          console.log("===== LOADED USERS: " + response.length)
          setUserList(response);
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
