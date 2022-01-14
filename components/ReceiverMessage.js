import React from 'react'
import { 
    View, 
    Text } from 'react-native'
import tw from 'tailwind-rn'
//funkcija kas stilizē otra lietotāja saņemtās ziņas
const ReceiverMessage = ({message}) => {
    return (
        <View 
        style ={[
            tw("bg-purple-600 rounded-lg roundeed-tr-none px-5 py-3 mx-3 my-2"),
            {alignSelf:"flex-start"},
        ]}
        >
            <Image 
            style={tw("h-12 w-12 rounded-full absolute top-0 -left-14")}
            source ={{
                uri: message.photoURL
            }}
            />
            <Text style={tw("text-white")}>{message.message}</Text>
        </View>
    )
}

export default ReceiverMessage
