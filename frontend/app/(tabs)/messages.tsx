import { StyleSheet,SafeAreaView, Text, View ,FlatList,Image, TouchableOpacity, useColorScheme} from 'react-native'
import React, { useEffect, useState } from 'react'
import useGetConversations from '@/hooks/messages/useGetConversations'
import { Avatar } from '@/components/ui/Avatar'
import { useRouter } from 'expo-router'
import { useCustomFonts } from '@/hooks/fonts/useCustomFonts';
import Colors from '@/constants/Colors'
import { useSelector } from 'react-redux'

export default function messages() {

  const {getConversations} = useGetConversations()
  const [conversations,setConversations] = useState([])
  const router = useRouter()

  const fontsLoaded = useCustomFonts();


  useEffect(() => {
    const get = async () => {
      const response = await getConversations()
      console.log(response,40);
      setConversations(response)
    }
    get()
  },[])


  const color = useColorScheme()
  const theme = Colors[color ?? 'light']

  const user = useSelector((state) => state?.auth?.user)

  if (!fontsLoaded) return null; // wait for fonts to load


  return (
    <SafeAreaView style={{flex:1}}>
          <FlatList
            data={conversations}
            ListHeaderComponent={<>
              <Text style={{fontSize:22,fontWeight:500,marginVertical:10}}>Conversations with clients</Text>
            </>}
            contentContainerStyle={{paddingHorizontal:20}}
            renderItem={({item}) => {
              const userX = item.conversation.participants.filter((c) => c.id != user?.id)[0]
              return ( 
                <TouchableOpacity onPress={() => router.replace('/conversations/'+userX?.id)} style={{flexDirection:'row',alignItems:'center',opacity:0.9,backgroundColor:'rgba(62,138,167,0.5)',padding:9,borderRadius:15}}>
                  <Avatar source={userX?.profile_picture} name={userX?.fullname} size={80}/>
                  <View style={{justifyContent:'flex-start',marginLeft:20}}>
                    <Text style={{fontSize:20,fontWeight:600, fontFamily: "sans-serif"}}>{user.fullname}</Text>
                    <Text style={{fontSize:15,marginTop:5}}>{item.last_message}</Text>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})