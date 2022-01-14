import {
  onSnapshot,
  query,
  collection, 
  where } from "firebase/firestore";
import React, 
  {useEffect, 
  useState } from "react";
import { 
  View, 
  Text, 
  FlatList } from "react-native";
import tw from "tailwind-rn";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import ChatRow from "./ChatRow";

// Atlasa abpusēji ieinteresētus lietotājus
const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "matches"),
        where("usersMatched", "array-contains", user.uid)
      ),
      (snapshot) =>
        setMatches(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
  }, [user]);

  return matches.length > 0 ? (
    // Atgriež sarakstu ar abpusēji ieinteresētiem lietotājiem
    <FlatList
      style={tw("h-full")}
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    // Ja neviens nav izrādījis interesi par Jums
    <View style={tw("p-5")}>
      <Text style={tw("text-center text-lg")}> No mutual interests at the moment </Text>
    </View>
  );
};

export default ChatList;
