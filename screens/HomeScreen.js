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
import NoPermissions from "../components/NoPermissions";

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
    if (hasPermission === "granted") {
      return <View style={styles.container} />;
    } else if (hasPermission === "denied") {
      return <NoPermissions />;
    } else {
      return <View style={styles.container} />;
    }
  }
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
