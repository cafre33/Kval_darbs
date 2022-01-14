// Failā tiek definētas funkcijas un stils, lai lietotājs varētu augšupielādēt datubāzē informāciju par sevi, ko parādīt citiem lietotajiem
import React from "react";
import { 
    View, 
    Text, 
    Image, 
    TextInput,
    TouchableOpacity } from "react-native";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { 
    serverTimestamp, 
    setDoc,
    doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const ModalScreen = () => {
  const { user } = useAuth();
  const [intro, setIntro] = useState(null);
  const [philosopher, setPhilosopher] = useState(null);
  const [age, setAge] = useState(null);
  const navigation = useNavigation();

  const incompleteForm = !intro || !philosopher || !age;
//   Izveido datubāzē dokumentu ar lietotāja ievadītiem datiem un tad aizved uz HomeScreen
  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      intro: intro,
      philosopher: philosopher,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  return (
    <View style={tw("flex-1 items-center pt-1")}>
      <Image
        style={tw("h-20 w-full mt-10")}
        resizeMode="contain"
      />
      <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}
      </Text>
      <Text style={tw("text-center p-4 font-bold text-indigo-400")}>
        Step 1: Enter a quote
      </Text>
      <TextInput
        value={intro}
        onChangeText={(text) => setIntro(text)}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your favorite quote"
      />

      <Text style={tw("text-center p-4 font-bold text-indigo-400")}>
        Step 2: Your favorite philosopher
      </Text>
      <TextInput
        value={philosopher}
        onChangeText={(text) =>setPhilosopher(text)}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your favorite philosopher"
      />

      <Text style={tw("text-center p-4 font-bold text-indigo-400")}>
        Step 3: Enter your age
      </Text>
      <TextInput
        value={age}
        onChangeText={(text) => setAge(text)}
        style={tw("text-center text-xl pb-2")}
        placeholder="How old are you?"
        keyboardType="numeric"
        maxLength={2}
      />
      <TouchableOpacity
        disabled={incompleteForm}
        style={[
          tw("w-64 p-3 rounded-xl absolute bottom-20 "),
          incompleteForm ? tw("bg-gray-400") : tw("bg-indigo-400"),
        ]}
        onPress={updateUserProfile}
      >
        <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
