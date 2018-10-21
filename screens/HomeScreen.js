import React from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import { Camera, Permissions, FaceDetector, MediaLibrary } from "expo";
import NoPermissions from "../components/NoPermissions";
import Layout from "../constants/Layout";
import Icon from "../components/Icon";

export default class HomeScreen extends React.Component {
  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.front,
    zoom: 0,
    flashMode: Camera.Constants.FlashMode.on,
    detectingFaces: true
  };

  componentWillMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasPermission: status
    });
  };

  render() {
    const {
      hasPermission,
      cameraType,
      flashMode,
      zoom,
      detectingFaces
    } = this.state;
    if (hasPermission === "granted") {
      return (
        <View style={styles.container}>
          <StatusBar hidden={true} />
          <Camera
            style={styles.camera}
            type={cameraType}
            ratio={"1:1"}
            flashMode={flashMode}
            zoom={zoom}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.accurate,
              detectLandmarks: FaceDetector.Constants.Landmarks.none,
              runClassifications: FaceDetector.Constants.Classifications.all
            }}
            onFacesDetected={detectingFaces ? this._handleFacesDetected : null}
            ref={ref => {
              this.camera = ref;
            }}
          />
          <View style={styles.actions}>
            <Icon
              onPress={this._switchCameraType}
              name={
                Platform.OS === "ios"
                  ? "ios-reverse-camera"
                  : "md-reverse-camera"
              }
            />
            <Icon
              onPress={this._changeFlash}
              name={
                Platform.OS === "ios"
                  ? this._getFlashIcon("ios")
                  : this._getFlashIcon("android")
              }
            />
          </View>
        </View>
      );
    } else if (hasPermission === "denied") {
      return <NoPermissions />;
    } else {
      return <View style={styles.container} />;
    }
  }

  _switchCameraType = () => {
    const { cameraType } = this.state;
    if (cameraType === Camera.Constants.Type.front) {
      this.setState({
        cameraType: Camera.Constants.Type.back
      });
    } else {
      this.setState({
        cameraType: Camera.Constants.Type.front
      });
    }
  };

  _changeFlash = () => {
    const { flashMode } = this.state;
    switch (flashMode) {
      case Camera.Constants.FlashMode.on:
        this.setState({
          flashMode: Camera.Constants.FlashMode.off
        });
        break;
      case Camera.Constants.FlashMode.off:
        this.setState({
          flashMode: Camera.Constants.FlashMode.torch
        });
        break;
      case Camera.Constants.FlashMode.torch:
        this.setState({
          flashMode: Camera.Constants.FlashMode.on
        });
        break;
    }
  };
  _getFlashIcon = platform => {
    const { flashMode } = this.state;
    switch (flashMode) {
      case Camera.Constants.FlashMode.on:
        if (platform === "android") {
          return "md-flash";
        } else {
          return "ios-flash";
        }
      case Camera.Constants.FlashMode.off:
        if (platform === "android") {
          return "md-flash-off";
        } else {
          return "ios-flash-off";
        }
      case Camera.Constants.FlashMode.torch:
        if (platform === "android") {
          return "md-flashlight";
        } else {
          return "ios-flashlight";
        }
    }
  };

  _handleFacesDetected = data => {
    const { faces } = data;
    if (faces[0]) {
      const smile = parseFloat(faces[0].smilingProbability.toFixed(2));
      if (smile > 0.7) {
        this.setState({
          detectingFaces: false
        });
        this._takePhoto();
      }
    }
  };
  _takePhoto = async () => {
    try {
      let photo = await this.camera.takePictureAsync({
        quality: 1,
        exif: false
      });
      this._savePhoto(photo);
    } catch (error) {
      console.log(error);
    }
  };
  _savePhoto = async photo => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        const { uri } = photo;
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.createAlbumAsync("Smile Cam", asset);
        if (album.id) {
          this.setState({
            detectingFaces: false
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center"
  },
  camera: {
    width: Layout.window.width,
    height: Layout.window.height / 2
  },
  actions: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: Layout.window.width - 200
  }
});
