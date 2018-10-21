import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default ({ name, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Ionicons name={name} color={"white"} size={36} />
  </TouchableOpacity>
);
