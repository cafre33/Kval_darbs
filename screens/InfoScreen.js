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
    setDoc,
    doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const ModalScreen = () => {
  const { user } = useAuth();
  const [quote, setQuote] = useState(null);
  const [book, setBook] = useState(null);

  const incompleteForm = !quote || !book ;
//   Izveido datubāzē dokumentu ar lietotāja ievadītiem datiem un tad aizved uz HomeScreen
  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      quote: quote,
      book: book,
      age: age,
      timestamp: serverTimestamp(),
    })
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
    Enter a quote that you would like the other users to see
      </Text>
      <TextInput
        value={quote}
        onChangeText={(text) => setQuote(text)}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your favorite quote"
      />

      <Text style={tw("text-center p-4 font-bold text-indigo-400")}>
    Suggest a book that you really like
      </Text>
      <TextInput
        value={book}
        onChangeText={(text) =>setBook(text)}
        style={tw("text-center text-xl pb-2")}
        placeholder="Enter your favorite book"
      />
      <TouchableOpacity
        disabled={incompleteForm}
        style={[
          tw("w-64 p-3 rounded-xl absolute bottom-20 "),
          incompleteForm ? tw("bg-gray-400") : tw("bg-indigo-400"),
        ]}
        onPress={updateUserProfile}
      >
        <Text style={tw("text-center text-white text-xl")}>Suggest</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
