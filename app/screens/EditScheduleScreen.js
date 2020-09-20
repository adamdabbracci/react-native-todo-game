import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import moment, { months } from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet, Text, View, FlatList, ScrollView, VirtualizedList } from 'react-native';
import { Input, Button, ListItem, ButtonGroup } from 'react-native-elements';
import TaskService from '../services/task.service';
import CurrentUserService from '../services/currentuser.service';
import { Task, TaskSchedule } from '../services/task.model';

const taskService = new TaskService();
const currentUserService = new CurrentUserService();

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
  const [showInput, setShowInput] = React.useState(null);

  // User List
  const [userList, setUserList] = React.useState([]);

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
    taskSchedule.assigned_to = form.assigned_to;
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

  const renderUserItem = ({ item }) => {
    return (
      <ListItem
        checkmark={(form.assigned_to && form.assigned_to === item.id)}
        // leftAvatar={{ source: { uri: item.avatar_url } }}
        title={item.username}
        subtitle={item.email_address}
        onPress={(event) => {
          updateForm("assigned_to", item.id)
        }}
      />
    )
  }
  
  const renderUserList = () => {
    if (!userList) {
      return (<Text>Loading...</Text>)
    }
    const assigned = (form.assigned_to) ? userList.find(x => x.id === form.assigned_to) : null;

    return (
      <ListItem
            title={"Assigned To"}
            subtitle={(assigned) ? assigned.username : 'Select a user...'}
            titleStyle={{
              fontWeight: 'bold'
            }}
            onPress={() => {
              setShowInput((showInput !== 'assigned_to') ? 'assigned_to' : null)

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

    currentUserService.getSponsorships()
      .then((response) => {
        if (response) {
          console.log("===== LOADED USERS: " + response.sponsees.length)
          setUserList(response.sponsees);

        }
        else {
          console.log("==== NO USERS LOADED.")
        }
      })
      .catch((ex) => {
        console.log(ex)
      })
    // if (!hasLoadedUsers) {
    //   console.log("Initializing user load...")
    //   getAvailableUsers();
    //   setHasLoadedUsers(true);
    // }
  }, [])


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

        {/* Frequency */}
        <View>
          <ButtonGroup
            onPress={(selectedIndex) => {
              updateForm("frequency", scheduleOptions.frequency[selectedIndex])
            }}
            // buttonStyle={{
            //   backgroundColor: 'gold',
            // }}
            // textStyle={{
            //   color: 'white'
            // }}
            selectedButtonStyle={{
              backgroundColor: 'gold'
            }}
            selectedIndex={scheduleOptions.frequency.indexOf(form.frequency)}
            buttons={scheduleOptions.frequency}
            containerStyle={{}}
          />
        </View>

        <View style={{
          flexDirection: "column"
        }}>

         {renderUserList()}

          {showInput === 'assigned_to' && (
            <VirtualizedList
              keyExtractor={(item, index) => item.id}
              data={userList}
              renderItem={renderUserItem}
              getItemCount={() => userList.length}
              getItem={(data, index) => userList[index]}
              extraData={form.assigned_to}
            />
          )}

          <ListItem
            title={"Start Date"}
            subtitle={moment(form["start_date"]).format('LL')}
            titleStyle={{
              fontWeight: 'bold'
            }}
            onPress={() => {
              setShowInput((showInput !== 'start_date') ? 'start_date' : null)
            }}
          />

          {showInput === 'start_date' && (
            <DateTimePicker
              testID="startdatepicker"
              value={moment(form["start_date"]).toDate()}
              onChange={(event, date) => {
                updateForm("start_date", date)
              }}
              display="default"
            />
          )}


          <ListItem
            title={"End Date"}
            subtitle={moment(form["end_date"]).format('LL')}
            titleStyle={{
              fontWeight: 'bold'
            }}
            onPress={() => {
              setShowInput((showInput !== 'end_date') ? 'end_date' : null)
            }}
          />
          {showInput === 'end_date' && (
            <DateTimePicker
              testID="enddatepicker"
              value={moment(form["end_date"]).toDate()}
              onChange={(event, date) => {
                updateForm("end_date", date)
              }}
              display="default"
            />
          )}
         
        </View>

        <View style={{
          marginTop: 20
        }}>

          <Button
            title={(isEditingSchedule) ? "Update" : "Create"}
            raised
            disabled={creatingTask || !form.assigned_to || !form.frequency || !form.description || !form.name}
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
