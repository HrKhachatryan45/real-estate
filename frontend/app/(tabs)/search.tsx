import { StyleSheet,SafeAreaView, Text, View, Image,useColorScheme,FlatList,ActivityIndicator, Touchable, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router';
import {Header} from '../../components/Header';
import { ChevronLeft, Filter, Heart, MapPin, SlidersHorizontal } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Input } from '../../components/ui/Input';
import { useSelector } from 'react-redux';
import useSearchListings from '../../hooks/listings/useSearchListings';
import useToggleFavourite from '@/hooks/listings/useToggleFavourite';
import useGetFavRecent from '@/hooks/listings/useGetFavRecent';

export default function search() {
  const {query} = useLocalSearchParams();
  const router = useRouter();
  const color = useColorScheme()
  const theme = Colors[color ?? 'light'];
  const user = useSelector((state:any) => state.auth.user);
  const [searchQuery, setSearchQuery] = React.useState(query || '');
  const [shouldSearch, setShouldSearch] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const {searchListings,error, loading} = useSearchListings();  
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);
  const [recent,setRecent] = React.useState([]);

  const {getFavRecent,loading:recentLoading} = useGetFavRecent();

  React.useEffect(() => {
    const fetchRecent = async () => {
      const listings = await getFavRecent('recent',1,5);
      setRecent(listings);
    }
    fetchRecent();
  },[])


  React.useEffect(() => {
    if (query) {
      setSearchQuery(query);
      setPage(1);
      setShouldSearch(true);
    }
  }, [query]);



  React.useEffect(() => {
    const fetchSearchResults = async () => {
      setIsFetchingMore(true);
      const listings = await searchListings(page,4,searchQuery);
      if (page == 1){
        setSearchResults(listings);
      }else{
        setSearchResults(prev => [...prev,...listings]);
      }
      if (listings.length < 4) {
        setHasMore(false);
      }

      setIsFetchingMore(false);
      setShouldSearch(false);
    }
    if(shouldSearch || page > 1){
      fetchSearchResults();
    }
  }, [page,shouldSearch]);

  const loadMore = () => {
      if (isFetchingMore) return;
      if (!hasMore) return;
     if (!searchQuery) return; 
      setPage(prev => prev + 1);
    };
  
  
  const {toggleFavourite} = useToggleFavourite();


  const handleToggleFavourite = async(id) => {
    await toggleFavourite(id);
  }

    
    const renderListingItem = ({ item },value) => (
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
        <TouchableOpacity style={styles.favoriteButton} onPress={() => handleToggleFavourite(item.id)}>
          <Ionicons name={(user?.favourite_listings ?? []).includes(item.id.toString()) ? "heart" : "heart-outline"} size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  


  return (
    <SafeAreaView>
     

       <FlatList
          showsVerticalScrollIndicator={false}
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => {
            return renderListingItem({item},false);
          }}
          numColumns={2}
          ListHeaderComponent={<>
           <View style={{paddingHorizontal:15,paddingTop:10}}>
        {query && (
          <Header
            leftIconStyles={{backgroundColor:'transparent',padding:0}}
            onPress={() => router.back()}
            icon={
                <View style={[styles.iconButton, { backgroundColor: theme.primary }]}>
                    <ChevronLeft color={'white'} size={24} />
                </View>
            }
            title={
              <Text style={{fontSize:18,fontWeight:'600',marginRight:30,textAlign:'center',color:theme.text}}>Search Results for "{query}"</Text>
            }
          />
        )}
        {!query && (
          <View style={{marginBottom:10,flexDirection:'column',alignItems:'center',gap:5}}>
          <Text style={{fontSize:10,margin:0,color:theme.textSecondary}}>Your Location</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 ,marginTop:-5 }}>
            <MapPin 
              color={theme.textSecondary}
              size={16}
              style={{ marginRight: 0 }}  
            />
            <Text style={{ fontSize: 16,color: theme.text }}>
              {user?.city}
            </Text>
          </View>

          </View>
        )}
        {!query && (
          <View style={{alignItems:'center'}}>
            <Input 
              placeholderTextColor={theme.textSecondary}
              placeholder='Find your dream home...'
              onChangeText={setSearchQuery}
              inputContainerStyle={{
                borderRadius:10,
                borderColor:theme.textSecondary,
              }}
              onSubmitEditing={() => {
                setPage(1);
                setShouldSearch(true);
              }}
              style={{
                width:'100%',
                borderColor:theme.textSecondary,
                height:50,
                borderRadius:8,
                borderWidth:1,
                paddingHorizontal:15,
                color:theme.textSecondary
              }}
            />
            <TouchableOpacity style={{ position: 'absolute', right: 15, top: 18 }}>
            <SlidersHorizontal color={theme.textSecondary}  size={20} />
            </TouchableOpacity>
          </View>
        )}
        {searchResults?.length == 0 && hasMore && (
            <Text style={{fontSize:18,fontWeight:'600',marginBottom:10,color:theme.text}}>Recently Viewed</Text>
        )}
              
          {searchResults?.length == 0 && !hasMore && (
              <Text style={{fontSize:18,fontWeight:'600',marginBottom:10,color:theme.text,textAlign:'center'}}>No Results </Text>
          )}
              
          {searchResults?.length == 0 && !hasMore && (
              <View style={{flex:1,justifyContent:'center',flexDirection:'row'}}>
                <Image
                  source={require('../../assets/images/no-more.webp')}
                  style={{width:200,height:170}}
                />
              </View>
          )}
              
        {searchResults?.length == 0 && hasMore &&  (
          <FlatList
          data={recent}
          horizontal
          renderItem={({item}) => {
            return renderListingItem({item},true);
          }}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={<>
            {recentLoading ? (
              <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 20 }} />
            ) : null}
          </>}
        />
        )}
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

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
