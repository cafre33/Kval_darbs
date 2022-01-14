import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity } from "react-native";
import { Ionicons} from "@expo/vector-icons";
import tw from "tailwind-rn";
import { 
  NavigationContainer, 
  useNavigation } from "@react-navigation/native";
// Navigācijas josla Sarakstei 
const Header = ({ title }) => {
  const navigation = useNavigation();
  return (
    <View style={tw(" p-2 flex-row items-center justify-between mt-10")}>
      <View style={tw("flex flex-row items-center")}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw("p-2 ")}>
          <Ionicons
            name="chevron-back-outline"
            size={34}
            color= 'rgb(129, 140, 248) '
          ></Ionicons>
        </TouchableOpacity>
        <Text style={tw("text-2xl font-bold pl-2")}>{title}</Text>
      </View>

    </View>
  );
};

export default Header;
