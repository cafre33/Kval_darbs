import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Image } from "react-native";
import tw from "tailwind-rn";
//Ja lietotāji ir abpusēji ieinteresēti uzlec uznirstošais ekrāns, lai par to paziņotu
const MatchedScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { loggedInProfile, userSwiped } = params;

  return (
    <View style={[tw("h-full bg-indigo-500 pt-20"), { opacity: 0.89 }]}>
      <View style={tw("justify-center px-10 pt-20")}>

        <Text style={tw('"text-white text-center mt-5')}>
          You and {userSwiped.displayName} have expressed interest in each other.
        </Text>

        <Image style = {tw("h-32 w-32 rounded-full")}
            source={{
                uri: loggedInProfile.photoURL,
            }}/>
            <Image style = {tw("h-32 w-32 rounded-full")}
            source={{
                uri: userSwiped.photoURL,
            }}/>
      </View>
        <TouchableOpacity
        style={tw("bg-white m-5 px-10 py-8 rounded-full mt-20")}
        onPress={() => {
          navigation.goBack();
          navigation.navigate("Chat");
        }}
      >
        <Text style={tw("text-center")}>Send a Text</Text>
        </TouchableOpacity>
    </View>
  );
};

export default MatchedScreen;
