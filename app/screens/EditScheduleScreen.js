import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import  moment, { months } from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet, Text, View, FlatList, ScrollView, VirtualizedList } from 'react-native';
import { Input, Button, ListItem, ButtonGroup } from 'react-native-elements';
import TaskService from '../services/task.service';
import { Task, TaskSchedule } from '../services/task.model';

const taskService = new TaskService();

export default function EditScheduleScreen(props) {

    const isEditingSchedule = (props.route.params?.schedule?.id) ? true : false
    console.log(`IS EDITING ${isEditingSchedule}: ${props.route.params?.schedule?.id}`)

    // Schedule options
    const scheduleOptions = {
      frequency: ["DAILY", "WEEKLY", "MONTHLY"],
    }

    // Form defaults
    const taskDefault = {
      name: "",
      description: "",
      coin_reward: 10,
      assigned_to: {},
      frequency: "DAILY",
      start_date: moment().toDate(),
      end_date: moment().add(1, "months").toDate(),
  }

    // Main Form
    const [form, setForm] = React.useState(taskDefault);

    // User List
    const [hasLoadedUsers, setHasLoadedUsers] = React.useState(false);
    const [userList, setUserList] = React.useState([]);
    const [assignedUser, setAssignedUser] = React.useState((props.route.params?.schedule?.assigned_to || null));

    // Toggles the button
    const [creatingTask, setCreatingTask] = React.useState(false);

    const updateForm = (key, value) => {
        const _form = Object.assign({}, form);
        _form[key] = value;
        console.log(`CHANGE: ${key} => ${_form[key]}`)
        setForm(_form);
    }

    const submitForm = async () => {
        setCreatingTask(true);

        const taskSchedule = new TaskSchedule();
        taskSchedule.description = form.description;
        taskSchedule.coin_reward = form.coin_reward;
        taskSchedule.assigned_to = assignedUser;
        taskSchedule.frequency = form.frequency;
        taskSchedule.start_date = form.start_date;
        taskSchedule.end_date = form.end_date;
        taskSchedule.name = form.name;
        taskSchedule.description = form.description;

        if (isEditingSchedule) {
          console.log(`Sending update for: ${props.route.params?.schedule?.id}`)
          taskSchedule.id = props.route.params?.schedule?.id;
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
          if (props.route.params.onSave) {
            props.route.params.onSave()
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

    React.useEffect(() => {
      
      if (isEditingSchedule) {
        setForm({
          ...props.route.params?.schedule,
          frequency: props.route.params?.schedule?.frequency,
        })
      }

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
    }, [true])

    
    if (form) {
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
          <VirtualizedList
                  keyExtractor={(item, index) => item.id}
                  data={userList}
                  renderItem={renderUserItem}
                  getItemCount={() => userList.length}
                  getItem={(data, index) => userList[index]}
                  extraData={assignedUser}
                />
        </View>
  
        <View>
            <ButtonGroup
            onPress={(selectedIndex) => {
              updateForm("frequency", scheduleOptions.frequency[selectedIndex])
            }}
            selectedIndex={scheduleOptions.frequency.indexOf(form.frequency)}
            buttons={scheduleOptions.frequency}
            containerStyle={{}}
          />
        </View>
        
        <View style={{
          flexDirection: "column"
        }}>
          <Text style={{
            fontWeight: "bold"
          }}>
            Start Date
          </Text>
          <DateTimePicker
            style={{
              flex: .5
            }}
            testID="startdatepicker"
            value={moment(form["start_date"]).toDate()}
            onChange={(event, date) => {
              updateForm("start_date", date)
            }}
            display="default"
          />
           <Text style={{
            fontWeight: "bold"
          }}>
            End Date
          </Text>
          <DateTimePicker
            style={{
              flex: .5
            }}
            testID="enddatepicker"
            value={moment(form["end_date"]).toDate()}
            onChange={(event, date) => {
              updateForm("end_date", date)
            }}
            display="default"
          />
        </View>
  
        <View style={{
              marginTop: 20
            }}>
          
            <Button
              title={(isEditingSchedule) ? "Update" : "Create"}
              raised
              disabled={creatingTask || !assignedUser || !form.frequency || !form.description || !form.name}
              titleStyle={{
                fontWeight: "bold",
              }}
              buttonStyle={{
                backgroundColor: "gold",
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 20
              }}
              onPress={() => {
                submitForm()
              }}
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
  
        
      </ScrollView>
      )
    }

  else {
    return (<Text>LOADING</Text>)
  }
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
