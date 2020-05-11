import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Input, Button } from 'react-native-elements';
import TaskService from '../services/task.service';

const taskService = new TaskService();

const stateDefault = {
    name: "",
    description: "",
    coin_reward: 0,
    ticket_reward: 0,
}

export default function CreateTaskScreen() {

    const [form, setForm] = React.useState(stateDefault)

    const updateForm = (key, value) => {
        const _form = form;
        _form[key] = value;
        setForm(_form);
    }

    const submitForm = () => {
        console.log(form);
        taskService.createTask(form);
        setForm(stateDefault);
    }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Input
        placeholder='Task Name'
        onChangeText={value => updateForm("name", value)}
        />
        <Input
        onChangeText={value => updateForm("description", value)}
        placeholder='Task Description'
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
            onChangeText={value => updateForm("coin_reward", value)}
            leftIcon={{ type: 'material', name: 'toll' }}
            />
            <Input
            containerStyle={{
                flex: .5
            }}
            keyboardType="number-pad"
            placeholder='Ticket Reward'
            onChangeText={value => updateForm("ticket_reward", value)}
            leftIcon={{ 
                name:'assignment-turned-in',
                type:'material'
             }}
            />
    </View>

    <View >
       
        <Button
        title="Create"
        raised
        onPress={submitForm}
        />
    </View>

    
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
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
