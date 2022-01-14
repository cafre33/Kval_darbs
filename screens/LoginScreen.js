import { useNavigation } from "@react-navigation/native";
import React, 
    { 
    useLayoutEffect } from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";

//Atbild par pierakstīšanās ekrānu 
const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <View style={tw("flex-1 bg-indigo-500")}>

        <View style={tw(" ml-50 ")}>
          <Text style={tw("font-semibold text-white " )}>PHILOSOFY</Text>
        </View>
        <TouchableOpacity
          style={[
            tw("absolute bottom-40 w-52  bg-white p-4 rounded-2xl"),
            { marginHorizontal: "25%" },
          ]}
          onPress={signInWithGoogle}
        >
          <Text style={tw(" font- semibold text-center")}>Sign in </Text>
        </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
