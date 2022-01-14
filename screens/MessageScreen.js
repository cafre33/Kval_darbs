import { useRoute } from '@react-navigation/native'
import React,
    { 
    useState,
    useEffect } from 'react'
import { Button, 
    FlatList, 
    Keyboard, 
    Platform, 
    SafeAreaView, 
    Text, 
    TextInput, 
    View,
    TouchableWithoutFeedback,
    KeyboardAvoidingView} from 'react-native'
import getMatchedUserInfo from '../components/getMatchedUserInfo'
import Header from '../components/Header'
import useAuth from '../hooks/useAuth'
import tw from 'tailwind-rn'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
import { 
    addDoc, 
    collection,
    onSnapshot, 
    orderBy, 
    query, 
    serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const MessageScreen = () => {
    const {user} = useAuth();
    const {params} = useRoute();
    const[input,setInput] = useState("");
    const {matchDetails} = params;
    const [messages, setMessages] = useState([]);
//Izveido klausītāju un klausās, kad datubāzē ir parādījusies jauna ziņa
    useEffect(
        () => 
        onSnapshot(
        query(
            collection(db, "matches", matchDetails.id, "messages"), 
            orderBy("timestamp", "desc"))
            ), snapshot =>
            setMessages(
            snapshot.docs.map((doc) =>({
            id: doc.id,
            ...doc.data()
        }))
        )
, [matchDetails,db])
//Saglabā nosūtīto ziņu datubāzē 
    const sendMessage = () => {
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'),{
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName : user.displayName,
            message: input,

        });

        setInput("");
    }
    return (
        <SafeAreaView style={tw("flex-1")}>
            <Header title={getMatchedUserInfo(matchDetails.users, user.uid).displayName}
             />
             <KeyboardAvoidingView
             behavior = {Platform.OS === "ios" ? "padding" : "height"}
             style={tw("flex-1")}
             keyboardVerticalOffset = {10}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
                <FlatList
                data={messages}
                inverted={-1}
                style={tw("pl-4")}
                keyExtractor={(item) =>item.id}
                renderItem={({item: message}) =>
                message.userId === user.uid ? (
                    <SenderMessage key ={message.id} message={message} />
                ): (
                    <ReceiverMessage key ={message.id} message={message} />
                )
   
            }
                />

                </TouchableWithoutFeedback>

<View style={tw(
        "flex-row justify-between bg-white items-center border-t border-gray-200 px-5 py-2"
        )}>
        <TextInput 
        style={tw("h-10 text-lg")}
        placeholder='Send Message'
        onChangeText={setInput}
        onSubmitEditing={sendMessage}
        value={input}

        />
    <Button 
    onPress={sendMessage}
    title =' Send' 
    color="rgb(99,102,241)" 
    />
   
</View>
</KeyboardAvoidingView>
</SafeAreaView>
    );
};
export default MessageScreen
