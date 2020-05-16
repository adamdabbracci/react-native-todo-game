import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import styles from '../styles';
import { Button, Text, ListItem, Icon } from 'react-native-elements';
import { Rating, AirbnbRating } from 'react-native-elements';

export default function ProgressScreen() {

  
  const buildRewardDetailElement = (ticketcount) => {
    return (
      <View style={{
        alignContent: "center",
        alignItems:"center"
      }}>
        <Icon
          name="ticket"
          type="font-awesome"
        ></Icon>
        <Text>{ticketcount || 1}</Text>
      </View>
    )
  }

  const buildRatingElement = (userHas, outOf) => {
    return (
      <Rating 
      imageSize={20}
      startingValue={userHas || 0}
      ratingCount={outOf || 5}
              style={{
              }}
        readonly/>
    )
  }


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ListItem
        key={1}
        title="#getfitchallenge2020"
        subtitle="Complete 5 Fitness goals this week!"
        bottomDivider
        leftElement={buildRewardDetailElement}
        rightElement={buildRatingElement(1,5)}
      />

<ListItem
        key={2}
        title="Chef Quarantine"
        subtitle="Cook at home instead of eating out 3 times"
        bottomDivider
        leftElement={buildRewardDetailElement(2)}
        rightElement={buildRatingElement(1,3)}
      />

    </ScrollView>
  );
}
