import { Image, StyleSheet,Modal, Text, View, SafeAreaView,useColorScheme, TouchableOpacity, ScrollView,RefreshControl,TouchableWithoutFeedback,Keyboard,ActivityIndicator,FlatList } from 'react-native'
import useGetMyListings from '../../hooks/listings/useGetMyListings'
import { Ionicons } from '@expo/vector-icons'
import useLogout from '../../hooks/auth/useLogout'
import useChangePassword from '../../hooks/auth/useChangePassword'
import * as ImagePicker from 'expo-image-picker'
import useEdit from '../../hooks/auth/useEdit'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, Upload, Mail, Phone, MapPin, Calendar, Heart, Clock, LogOut, Edit, MoveLeft,X, Table2 } from 'lucide-react-native'
import { Header } from '@/components/Header'
import Colors from '@/constants/Colors'
import { useSelector } from 'react-redux'
import { router } from 'expo-router'
import {AlertMessage} from "../../components/ui/AlertMessage"
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import useGetFavRecent from '@/hooks/listings/useGetFavRecent'
import useToggleFavourite from '@/hooks/listings/useToggleFavourite'

export default function profile() {
  const colors = useColorScheme()
  const theme = Colors[colors] ?? Colors.light
  const [isEditing,setIsEditing] = useState(false)
  const user = useSelector((state) => state?.auth?.user) || {}

  useEffect(() => {
    if (Object.keys(user)?.length == 0) {
      router.replace('/signin')
    }
  }, [user])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }


  const [currentPassword,setCurrentPassword] = useState('')
  const [newPassword,setNewPassword] = useState('')
  const [newPasswordConfirm,setNewPasswordConfirm] = useState('')


  const {changePassword,setError:setCError,error:changeError,loading:changeLoading,success} = useChangePassword()

  const handleChangePassword = async () => {
    await changePassword({new_password:newPassword,new_password_confirm:newPasswordConfirm,current_password:currentPassword})
  }

  const handleEditProfile = () => {
    router.push('/edit-profile')
  }



  const {edit,loading,error,setError} = useEdit()


  const handleEdit = async () => {
    const formData = new FormData()
    if (fullname != user?.fullname){
      formData.append('fullname',fullname)
    }

    if (city != user?.city){
      formData.append('city',city)
    }

    if (phone != user?.Phone){
      formData.append('phone_number',phone)
    }

    await edit(formData)
    setIsEditing(false)
  }

  
  const handleImageUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
      alert("Permission is required to upload an image.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (result.canceled) return

    const img = result.assets[0]

    const formData = new FormData()
    formData.append("profile_picture", {
      uri: img.uri,
      name: "profile.jpg",
      type: img.mimeType ?? "image/jpeg",
    })

    await edit(formData)
  }

  const [fullname,setFullname] = useState(user?.fullname || '');
  const [phone,setPhone] = useState(user?.phone_number || '');
  const [city,setCity] = useState(user?.city || '')


  
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input:{
        width: '100%',
        height: 45,
        borderRadius: 10,
        borderColor: theme.textSecondary,
        backgroundColor: theme.background,           
    },
    addStyles:{
        color: theme.text, 
        fontSize: 14,     
    },
    animatedImage2:{
        width:300,
        height:300,
        transform: [{ rotate:'-50deg' }],
        resizeMode:'contain',
        position:'absolute',
        bottom:-90,
        zIndex:-50,
        right:-120
    },
    animatedImage1:{
        width:300,
        height:300,
        resizeMode:'contain',
        position:'absolute',
        top:0,
        left:-120
    },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  iconButton: {
    width: 45,
    height: 45,
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    marginBottom:10
  },
  uploadButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 999,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
      container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    input:{
        width: '100%',
        height: 45,
        borderRadius: 10,
        borderColor: theme.textSecondary,
        backgroundColor: theme.background,           
    },
    addStyles:{
        color: theme.text, 
        fontSize: 14,     
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:theme.background,
      paddingHorizontal: 20,
    },
      iconButton: {
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
    listingCardHorizontal: {
    width: 200,   // <- FIXED width
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listingCard: {
    width:'48%',
    position: 'relative',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listingImage: {
    width: '100%',
    height: 160,
  },
  listingDetails: {
    flex: 1,
    padding: 12,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 4,
  },
  listingSpecs: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 12,
    color: '#666',
  },
  listingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  listingLocationText: {
    fontSize: 11,
    color: '#999',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
  },
})

const [showModal,setShowModal] = useState(false)


const {logout,loading:loadingLogOut} = useLogout()

  const handleLogout =async () => {
    await logout()
  }


useEffect(() => {
  if(success){
    setTimeout(() => {
      setShowModal(false)
    },2000)
  }
  if(changeError){
    setTimeout(() => {
      setCError(null)
    },2000)
  }
},[success,changeError])



const {getFavRecent,loading:loadingFavRecent} = useGetFavRecent()

const [showFavourite,setShowFavourite] = useState(false)
const [showRecent,setShowRecent] = useState(false)
const [favouriteListings,setFavouriteListings] = useState([])
const [recentListings,setRecentListings] = useState([])
const [hasMore,setHasMore] = useState(false)
const [page,setPage] = useState(1)
const [isFetchingMore,setIsFetchingMore] = useState(false)
const [triggerFav,setTriggerFav] = useState(0)
const [showMyListings,setShowMyListings] = useState(false)



useEffect(() => {
  if (!showFavourite) return;
  
  const getFavourite = async () => {
    setIsFetchingMore(true)
    try {
      const data = await getFavRecent('favourite', page, 4)
      if(data?.length == 0) {
        setHasMore(false)
        return
      }
      setHasMore(true)
      if(page == 1) {
        setFavouriteListings(data)
      } else {
        setFavouriteListings((prev) => ([...prev, ...data]))
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchingMore(false)
    }
  }
  
  getFavourite()
}, [showFavourite, triggerFav, page])

useEffect(() => {
  if (!showRecent) return;
  
  const getRecent = async () => {
     setIsFetchingMore(true)
    try {
      const data = await getFavRecent('recent', page, 4)
      if(data?.length == 0) {
        setHasMore(false)
        return
      }
      setHasMore(true)
      if(page == 1) {
        setRecentListings(data)
      } else {
        setRecentListings((prev) => ([...prev, ...data]))
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchingMore(false)
    }
  }
  
  getRecent()
}, [showRecent, page])

const {getMyListings,loading:loadingMy} = useGetMyListings()

const [myListings,setMyListings] = useState([])

useEffect(() => {
  if (!showMyListings) return

  
  const getThem = async () => {
     setIsFetchingMore(true)
    try {
      const data = await getMyListings(page, 4)
      if(data?.length == 0) {
        setHasMore(false)
        return
      }
      setHasMore(true)
      if(page == 1) {
        setMyListings(data)
      } else {
        setMyListings((prev) => ([...prev, ...data]))
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchingMore(false)
    }
  }
  
  getThem()

},[showMyListings,page])


  const loadMore = () => {
      if (isFetchingMore) return;
      if (!hasMore) return;
      setPage(prev => prev + 1);
    };
  
  
  const {toggleFavourite} = useToggleFavourite();


  const handleToggleFavourite = async(id) => {
    await toggleFavourite(id);
    setPage(1); // Reset to first page
    setTriggerFav((prev) => prev + 1)
  }

  const handleEditListing = (id) => {
      router.replace('property/edit/'+id);
  }

    
    const renderListingItem = ({ item },value,showEdit = false) => (
      <TouchableOpacity onPress={() => router.push(`/property/${item.id}`)} style={!value ? [styles.listingCard]:[styles.listingCardHorizontal]}>
        <Image
          source={{ uri: item.images[0]?.url }}
          style={styles.listingImage}
        />
        <View style={{width:100,height:20,backgroundColor:'red',position:'absolute',bottom:18,right:-22,alignItems:'center',justifyContent:'center',transform:[{rotate:'-45deg'}]}}>
          <Text style={{color:'white'}}>for {item.listing_type}</Text>
        </View>
        <View style={styles.listingDetails}>
          <Text style={[styles.listingTitle,{color:theme.textSecondary}]} numberOfLines={2}>{item.title}</Text>
          <Text style={[styles.listingPrice,{color:theme.primaryLight}]}>${item.price?.toLocaleString()}</Text>
          <View style={styles.listingSpecs}>
            <View style={styles.specItem}>
              <Ionicons name="bed-outline" size={16} color="#666" />
              <Text style={styles.specText}>{item.bedrooms}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={() => showEdit ? handleEditListing(item.id):handleToggleFavourite(item.id)}>
          {!showEdit ? (
          <Ionicons name={(user?.favourite_listings ?? []).includes(item.id?.toString()) ? "heart" : "heart-outline"} size={20} color="#FF6B6B" />
          ):(
          <Ionicons name={'pencil-outline'} size={20} color="#FF6B6B" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    )
  


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView   showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Header
            leftIconStyles={{ backgroundColor: 'transparent', padding: 0 }}
            onPress={() => router.back()}
            icon={
              <View style={[styles.iconButton, { backgroundColor: theme.primary }]}>
                <ChevronLeft color={'white'} size={24} />
              </View>
            }
            title={
              <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={{flexDirection:'row',justifyContent:'center'}}>
                <Text style={[styles.headerTitle, {marginRight:10, color: theme.text }]}>Profile</Text>
                {!isEditing && <Edit size={25} color={theme.text} />}
                {isEditing && <X size={25} color={theme.text} />}
              </TouchableOpacity>
            }
            rightIcon={
              <TouchableOpacity onPress={handleEditProfile} style={[styles.iconButton, { backgroundColor: theme.primary }]}>
                <Edit color={'white'} size={20} />
              </TouchableOpacity>
            }
          />

          <View style={styles.profileSection}>
            <View style={styles.imageContainer}>
              <TouchableOpacity
                onPress={handleImageUpload}
                style={[styles.uploadButton, { backgroundColor: theme.primary }]}
              >
                {!loading && (
                  <Upload size={16} color={'white'} />
                )}
                {loading && (
                  <ActivityIndicator />
                )}
              </TouchableOpacity>
              <Image
                source={user?.profile_picture ? { uri: user?.profile_picture }:require('@/assets/images/default-user.jpeg')}
                style={styles.profileImage}
              />
            </View>
            {!isEditing && <Text style={[styles.userName, { color: theme.text }]}>{user?.fullname}</Text>}
            {isEditing && (
              <Input 
                  placeholder="Fullname"
                  placeholderTextColor={theme.textSecondary}
                  value={fullname}
                  onChangeText={setFullname}
                  inputContainerStyle={[styles.input,{width:'65%'}]}
                  addStyles={styles.addStyles}
              />
    
            )}
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email}</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={[styles.infoCard, { backgroundColor: theme.cardBackground }]}>
              <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
                <Mail size={20} color={theme.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{user?.email}</Text>
              </View>
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.cardBackground }]}>
              <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
                <Phone size={20} color={theme.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Phone</Text>
                {!isEditing &&  <Text style={[styles.infoValue, { color: theme.text }]}>{user?.phone_number}</Text>}
                 {isEditing && (
                    <Input 
                        placeholder="Phone"
                        placeholderTextColor={theme.textSecondary}
                        value={phone}
                        onChangeText={setPhone}
                        inputContainerStyle={[styles.input]}
                        addStyles={styles.addStyles}
                    />
                  )}
              </View>
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.cardBackground }]}>
              <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
                <MapPin size={20} color={theme.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>City</Text>
               {!isEditing && <Text style={[styles.infoValue, { color: theme.text }]}>{user?.city}</Text>}
                {isEditing && (
                    <Input 
                        placeholder="City"
                        placeholderTextColor={theme.textSecondary}
                        value={city}
                        onChangeText={setCity}
                        inputContainerStyle={[styles.input]}
                        addStyles={styles.addStyles}
                    />
          
                  )}
                
              </View>
              
            </View>
            <View style={{flex:1,paddingHorizontal:20}}>
                {isEditing && (
                  <Button title='Submit changes' loading={loading} onPress={handleEdit} addStyles={{backgroundColor:theme.primary,width:'100%'}}/>
                )}
            </View>
            <View style={[styles.infoCard, { backgroundColor: theme.cardBackground }]}>
              <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
                <Calendar size={20} color={theme.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Member Since</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{formatDate(user?.created_at)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsSection}>
            <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FF6B6B20' }]}>
                <Heart size={24} color="#FF6B6B" />
              </View>
              <Text style={[styles.statNumber, { color: theme.text }]}>{user?.favourite_listings?.length || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Favorites</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.cardBackground }]}>
              <View style={[styles.statIconCircle, { backgroundColor: theme.primary + '20' }]}>
                <Clock size={24} color={theme.primary} />
              </View>
              <Text style={[styles.statNumber, { color: theme.text }]}>{user?.recent_listings?.length || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Recent Views</Text>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.cardBackground }]}
              onPress={() => setShowMyListings(true)}
            >
              <Table2 size={20} color={theme.primary} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>My Listings {user?.listings?.length}</Text>
              <ChevronLeft size={20} color={theme.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.cardBackground }]}
              onPress={() => setShowFavourite(true)}
            >
              <Heart size={20} color={theme.primary} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>My Favorites {user?.favourite_listings?.length}</Text>
              <ChevronLeft size={20} color={theme.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.cardBackground }]}
              onPress={() => setShowModal(true)}
            >
              <Edit size={20} color={theme.primary} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>Change Password</Text>
              <ChevronLeft size={20} color={theme.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.cardBackground }]}
              onPress={() => setShowRecent(true)}
            >
              <Clock size={20} color={theme.primary} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>Recent Views {user?.recent_listings?.length}</Text>
              <ChevronLeft size={20} color={theme.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: '#FF6B6B20', borderColor: '#FF6B6B' }]}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#FF6B6B" />
              <Text style={[styles.logoutButtonText, { color: '#FF6B6B' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Modal visible={showModal} animationType='fade' transparent={false} >
        <SafeAreaView style={{flex:1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.modalContainer,{position:'relative'}]}>
            <View style={{alignItems:'start',width:'100%',zIndex:999,flex:1,position:'absolute',top:30}} >
              <TouchableOpacity style={{width:45,height:45,justifyContent:'center',alignItems:'center',backgroundColor:theme.primary,borderRadius:'50%'}} onPress={() => setShowModal(false)}>
                <ChevronLeft color={'white'} size={18}/>
              </TouchableOpacity>
            </View>
                  <Image
                      source={require('../../assets/images/lock-login.png')}
                      style={styles.animatedImage1}
                  />  
                  <View style={{width:'90%',justifyContent:'center', alignItems:'center'}}>
                      <Text style={{color:theme.text,fontSize:20,fontWeight:700,marginBottom:10,fontFamily:'roboto-regular'}}>Change Password</Text>
                     <Input 
                          placeholder="Current Password"
                          placeholderTextColor={theme.textSecondary}
                          value={currentPassword}
                          onChangeText={setCurrentPassword}
                          inputContainerStyle={styles.input}
                          addStyles={styles.addStyles}
                      />
          
                      <Input 
                          placeholder='New Password' 
                          placeholderTextColor={theme.textSecondary} 
                          inputContainerStyle={[styles.input,{marginBottom:0}]}
                          addStyles={styles.addStyles}
                          value={newPassword}
                          secureTextEntry
                          onChangeText={setNewPassword}
                      />
                      
                      <Input 
                          placeholder='New Password Confirm' 
                          placeholderTextColor={theme.textSecondary} 
                          inputContainerStyle={[styles.input,{marginBottom:0}]}
                          addStyles={styles.addStyles}
                          value={newPasswordConfirm}
                          secureTextEntry
                          onChangeText={setNewPasswordConfirm}
                      />
          
                      <View style={{width:'100%',alignItems:'flex-end',marginVertical:-10,justifyContent:'flex-end',gap:5}}>
                          <Text onPress={() => router.replace('/forgotPassword')} style={{color:theme.primary,textAlign:'right'}}>Forgot Password?</Text>
                      </View>
                      {changeError && (
                          <View style={{width:'100%',marginTop:20}}  >
                              <AlertMessage message={changeError} type="error" />
                          </View>
                      )}
                      {success && (
                         <View style={{width:'100%',marginTop:20}}  >
                              <AlertMessage message={'Password successfully changed'} type="success" />
                          </View>
                      )}
                      <Button onPress={handleChangePassword} loading={changeLoading} title='Change Password' addStyles={{backgroundColor:theme.primary,width:'100%',marginTop:20}} />
                    
                  </View>
                  <Image
                      source={require('../../assets/images/shield.png')}
                      style={styles.animatedImage2}
                  />  
          </View>
              </TouchableWithoutFeedback>
        </SafeAreaView>
      </Modal>
       <Modal visible={showFavourite} animationType='fade' transparent={false} >
         <SafeAreaView style={{flex:1}}>
         <View style={[styles.modalContainer,{position:'relative',paddingHorizontal:0}]}>
               <FlatList
                showsVerticalScrollIndicator={false}
                data={favouriteListings}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={({item}) => {
                  return renderListingItem({item},false);
                }}
                refreshing={loadingFavRecent}
                onRefresh={() => setTriggerFav((prev) => prev + 1)}
                numColumns={2}
                ListHeaderComponent={<>
                  <View style={{paddingHorizontal:15,paddingTop:10}}>
                <Header
                  leftIconStyles={{backgroundColor:'transparent',padding:0}}
                  onPress={() => setShowFavourite(false)}
                  icon={
                      <View style={[styles.iconButton, { backgroundColor: theme.primary }]}>
                          <ChevronLeft color={'white'} size={24} />
                      </View>
                  }
                  title={
                    <Text style={{fontSize:18,fontWeight:'600',marginRight:30,textAlign:'center',color:theme.text}}>My Favourites</Text>
                  }
                />
            
            </View>
                </>}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}
              ListFooterComponent={<>
                {loadingFavRecent ? (
                  <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 20 }} />
                ) : null}
              </>}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
          />
         </View>
         </SafeAreaView>
      </Modal>

         <Modal visible={showRecent} animationType='fade' transparent={false} >
            <SafeAreaView style={{flex:1}}>
         <View style={[styles.modalContainer,{position:'relative',paddingHorizontal:0}]}>
               <FlatList
                showsVerticalScrollIndicator={false}
                data={recentListings}
                keyExtractor={(item) => `${item?.id?.toString()}-recent`}
                renderItem={({item}) => {
                  return renderListingItem({item},false);
                }}
                refreshing={loadingFavRecent}
                onRefresh={() => setTriggerFav((prev) => prev + 1)}
                numColumns={2}
                ListHeaderComponent={<>
                  <View style={{paddingHorizontal:15,paddingTop:10}}>
                <Header
                  leftIconStyles={{backgroundColor:'transparent',padding:0}}
                  onPress={() => setShowRecent(false)}
                  icon={
                      <View style={[styles.iconButton, { backgroundColor: theme.primary }]}>
                          <ChevronLeft color={'white'} size={24} />
                      </View>
                  }
                  title={
                    <Text style={{fontSize:18,fontWeight:'600',marginRight:30,textAlign:'center',color:theme.text}}>Recently Viewed</Text>
                  }
                />
            
            </View>
                </>}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}
              ListFooterComponent={<>
                {loading ? (
                  <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 20 }} />
                ) : null}
              </>}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
          />
         </View>
         </SafeAreaView>
      </Modal>

      <Modal visible={showMyListings} animationType='fade' transparent={false} >
        <SafeAreaView style={{flex:1}}>
         <View style={[styles.modalContainer,{position:'relative',paddingHorizontal:0}]}>
            <FlatList
              showsVerticalScrollIndicator={false}
                data={myListings}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={({item}) => {
                  return renderListingItem({item},false,true);
                }}
                refreshing={loadingMy}
                onRefresh={() => setTriggerFav((prev) => prev + 1)}
                numColumns={2}
                ListHeaderComponent={<>
                  <View style={{paddingHorizontal:15,paddingTop:10}}>
                <Header
                  leftIconStyles={{backgroundColor:'transparent',padding:0}}
                  onPress={() => setShowMyListings(false)}
                  icon={
                      <View style={[styles.iconButton, { backgroundColor: theme.primary }]}>
                          <ChevronLeft color={'white'} size={24} />
                      </View>
                  }
                  title={
                    <Text style={{fontSize:18,fontWeight:'600',marginRight:30,textAlign:'center',color:theme.text}}>My Favourites</Text>
                  }
                />
            
            </View>
                </>}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}
              ListFooterComponent={<>
                {loadingFavRecent ? (
                  <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 20 }} />
                ) : null}
              </>}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
            />
         </View>
         </SafeAreaView>
      </Modal>

    </SafeAreaView>
  )
}
