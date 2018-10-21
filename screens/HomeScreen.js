import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Platform
} from "react-native";
import { Camera, Permissions, IntentLauncherAndroid } from "expo";
import Color from "../constants/Color";

export default class HomeScreen extends React.Component {
  state = {
    hasPermission: null,
    type: Camera.Constants.Type.front
  };

  componentWillMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasPermission: status
    });
  };

  render() {
    const { hasPermission } = this.state;
    if (hasPermission == "granted") {
      return <View style={styles.container} />;
    } else {
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
