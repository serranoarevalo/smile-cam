import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Platform
} from "react-native";
import Color from "../constants/Color";

export default class NoPermissions extends React.Component {
  render() {
    return (
      <View style={styles.notGrantedContainer}>
        <Text style={styles.notGrantedText}>Can't access camera</Text>
        <Text style={styles.notGrantedEmoji}>😭</Text>
        <TouchableOpacity onPress={this._askForPermissions}>
          <View style={styles.askBtn}>
            <Text style={styles.askBtnText}>Ask me again</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  _askForPermissions = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      IntentLauncherAndroid.startActivityAsync(
        IntentLauncherAndroid.ACTION_APPLICATION_SETTINGS
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  notGrantedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black"
  },
  notGrantedText: {
    color: "white",
    fontSize: 30
  },
  notGrantedEmoji: {
    marginTop: 25,
    fontSize: 30
  },
  askBtn: {
    borderRadius: 5,
    backgroundColor: Color.red,
    padding: 10,
    marginTop: 50
  },
  askBtnText: {
    color: "white",
    fontWeight: "800"
  }
});
