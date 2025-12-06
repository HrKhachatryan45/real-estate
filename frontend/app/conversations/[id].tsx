import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, useColorScheme ,SafeAreaView} from 'react-native'
import useDeleteMessage from "@/hooks/messages/useDeleteMessage"
import useDeleteConversation from "@/hooks/messages/useDeleteConversation"
import { DropdownMenuItem,DropdownMenu,DropdownMenuTrigger,DropdownMenuContent } from '@/components/ui/DropdownMenu'
import useSendMessage from "@/hooks/messages/useSendMessage"
import React, { useEffect, useState, useRef } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import useGetMessages from "@/hooks/messages/useGetMessages"
import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { ChevronLeft, MoveLeft, Trash } from 'lucide-react-native'
import { Header } from '@/components/Header'

export default function ConversationDetail() {
    const { id } = useLocalSearchParams()
    const color = useColorScheme()
    const theme = Colors[color ?? 'light']

    const user  = useSelector((state) => state?.auth?.user)

    const { getMessages } = useGetMessages()
    const scrollViewRef = useRef(null)

    const [messages, setMessages] = useState([])
    const [receiver, setReceiver] = useState({})
    const [inputText, setInputText] = useState('')

    const {sendMessage} = useSendMessage()


    useEffect(() => {
        const get = async () => {
            const data = await getMessages(id)
            setMessages(data.messages)
            setReceiver({...data.receiver,convId:data.convId})
        }
        if (id) {
            get()
        }
    }, [])

    const handleSend = async () => {
        if (inputText.trim()) {
            const message = await sendMessage(inputText,receiver.id)
            console.log(message,234);
            
            setMessages((prev) => ([...prev,message.message]))
            setInputText('')
        }
    }

    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }




    const {deleteMessage,success:msgSuccess,setSuccess:setSuccessMsg} = useDeleteMessage()

    const {deleteConversation} = useDeleteConversation()


    useEffect(() => {
        if(msgSuccess){
            const updatedMessages = messages.filter((x) => x.id !== msgSuccess)
            setMessages(updatedMessages)
            setSuccessMsg(null)
        }
    },[msgSuccess])

    const handleDeleteMsg = async (msgId) => {
        await deleteMessage(msgId)
    }


    const renderMessage = (item) => {
        const isCurrentUser = item?.sender?.id === user?.id
        
        return (
            <DropdownMenu key={item.id}>
                <DropdownMenuTrigger triggerOnLongPress={true}>
                    <View
                key={item.id}
                style={[
                    styles.messageContainer,
                    isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
                ]}
            >
                {!isCurrentUser && item?.sender?.profile_picture && (
                    <Image
                        source={{ uri: item?.sender?.profile_picture }}
                        style={styles.avatar}
                    />
                )}
                
                <View style={[
                    styles.messageBubble,
                    isCurrentUser 
                        ? { backgroundColor: theme.tint } 
                        : { backgroundColor: theme.cardBackground }
                ]}>
                    {!isCurrentUser && (
                        <Text style={[styles.senderName, { color: theme.tint }]}>
                            {item?.sender?.fullname}
                        </Text>
                    )}
                    <Text style={[
                        styles.messageText,
                        { color: isCurrentUser ? '#FFFFFF' : theme.text }
                    ]}>
                        {item?.message}
                    </Text>
                    <Text style={[
                        styles.timestamp,
                        { color: isCurrentUser ? 'rgba(255,255,255,0.7)' : theme.tabIconDefault }
                    ]}>
                        {formatTime(item.created_at)}
                    </Text>
                </View>

                {isCurrentUser && (
                    <View style={styles.avatarPlaceholder} />
                )}
            </View>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='right'>
                <DropdownMenuItem
                
                    icon={<Trash size={15} color={theme.error}/>}
                    onSelect={()=>handleDeleteMsg(item.id)}
                >
                    <Text style={{color:theme.error}}>Delete</Text>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    const router = useRouter()

    const handleDeleteConversation = async () => {
        await deleteConversation(receiver.convId)
        
        router.replace('/(tabs)/messages')
    }


    return (
         
       <SafeAreaView style={{flex:1,backgroundColor:theme.background}}>
         <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.background,paddingHorizontal:20,paddingVertical:0}]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        >
            <TouchableOpacity
                onPress={() => router.canGoBack() ? router.back():router.replace('(tabs)/messages')}
                style={{padding:2,marginVertical:3,borderRadius:3,width:70,justifyContent:'center',alignContent:'center'}}
            >
                <MoveLeft size={30} color={'black'} 
                style={{marginLeft:15}}
            />
            </TouchableOpacity>
                <Header
                    leftIconStyles={{backgroundColor:'transparent',padding:0}}
                    icon={
                        <View style={styles.headerContent}>

                        {receiver.profile_picture ? (
                            <Image
                                source={{ uri: receiver.profile_picture }}
                                style={styles.headerAvatar}
                            />
                        ) : (
                            <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder, { backgroundColor: theme.tint }]}>
                                <Text style={styles.headerAvatarText}>
                                    {receiver.fullname?.charAt(0) || '?'}
                                </Text>
                            </View>
                        )}
                        <View style={styles.headerInfo}>
                            <Text style={[styles.headerName, { color: theme.text }]}>
                                {receiver.fullname || 'User'}
                            </Text>
                            {receiver.city && (
                                <Text style={[styles.headerSubtitle, { color: theme.tabIconDefault }]}>
                                    {receiver.city}
                                </Text>
                            )}
                        </View>
                    </View>
                    }
                    title={

                    <DropdownMenu>
                    <DropdownMenuTrigger>
                        <View style={styles.headerButton}>
                                <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
                        </View>

                    </DropdownMenuTrigger>
                     <DropdownMenuContent align='right'>
                        <DropdownMenuItem
                        
                            icon={<Trash size={15} color={theme.error}/>}
                            onSelect={handleDeleteConversation}
                        >
                            <Text style={{color:theme.error}}>Delete</Text>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem
                            icon={<Icon name="creditCard" size={16} color="#666" />}
                            onSelect={() => console.log('Billing')}
                        >
                            Billing
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                    </DropdownMenu>
            }
        />

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map(renderMessage)}
            </ScrollView>

            {/* Input */}
            <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
               
                <TextInput
                    style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                    placeholder="Type a message..."
                    placeholderTextColor={theme.tabIconDefault}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                
                <TouchableOpacity
                    style={[styles.sendButton, { backgroundColor: theme.tint }]}
                    onPress={handleSend}
                    disabled={!inputText.trim()}
                >
                    <Ionicons name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
       </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerContent: {

        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft:10
    },
    headerAvatarPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerAvatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    headerInfo: {
        marginLeft: 12,
    },
    headerName: {
        fontSize: 17,
        fontWeight: '600',
    },
    headerSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    headerButton: {
        padding: 4,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        paddingBottom: 8,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    currentUserMessage: {
        justifyContent: 'flex-end',
    },
    otherUserMessage: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    avatarPlaceholder: {
        width: 32,
        marginLeft: 8,
    },
    messageBubble: {
        maxWidth: '70%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
    },
    senderName: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 11,
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight:-40,
        marginHorizontal: 8,
        maxHeight: 100,
        fontSize: 16,
        borderWidth:2
    },
    sendButton: {
        width: 46,
        height: 46,
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
    },
      iconButton: {
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
})