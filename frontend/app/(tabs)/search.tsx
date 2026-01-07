import { StyleSheet,SafeAreaView,ScrollView, Text,Modal, View, Image,useColorScheme,FlatList,ActivityIndicator, Touchable, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Select } from '@/components/ui/Select'
import React, { useEffect, useState } from 'react'
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
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'

export default function search() {
  const {query} = useLocalSearchParams();
  const router = useRouter();
  const color = useColorScheme()
  const [filters,setFilters] = useState({
    city:'',
    country:'',
    min_price:0,
    max_price:2000000,
    min_square_meters:0,
    max_square_meters:1000,
    max_total_rooms:0,
    furnished:false,
    new_construction:false,
    parking:false,
    balcony:false,
    elevator:false,
    is_featured:false
  })
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
  const [showFilters,setShowFilters] = useState(false)
  const [trigger,setTrigger] = useState(0);


  const {getFavRecent,loading:recentLoading} = useGetFavRecent();

  React.useEffect(() => {
    const fetchRecent = async () => {
      const listings = await getFavRecent('recent',1,5);
      setRecent(listings);
    }
    fetchRecent();
  },[])

      const [countries, setCountries] = useState([]);
      const [cities, setCities] = useState([]);
      const [loadingX, setLoadingX] = useState(false)
  
      useEffect(() => {
          const fetchCountries = async () => {
              setLoadingX(true)
              try {
                  const response = await fetch('https://restcountries.com/v3.1/all?fields=id,name,cca2');
                  const data = await response.json();
                  const countryList = data.map((c) => ({
                      label: c.name.common,
                      value: c.name.common,
                  }));
                  setCountries(countryList);
              } catch (err) {
                  console.error('Error fetching countries', err);
              } finally {
                  setLoadingX(false)
              }
          };
  
          const fetchCities = async () => {
              setLoadingX(true)
              try {
                  const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ country: filters?.country })
                  });
  
                  const data = await response.json();
                  if (data.data) {
                      const city = data.data.map((cx) => ({ value: cx, label: cx }))
                      setCities(city);
                  }
              } catch (err) {
                  console.error('Error fetching cities', err);
              } finally {
                  setLoadingX(false)
              }
          };
  
         if(showFilters){
             fetchCountries();
  
          if (filters?.country != '') {
              fetchCities()
          }
         }
      }, [filters?.country,showFilters]);


  React.useEffect(() => {
    if (query || trigger > 0) {
      setSearchQuery(query);
      setPage(1);
      setHasMore(true)
      setShouldSearch(true);
    }
  }, [query,trigger]);



  React.useEffect(() => {
    const fetchSearchResults = async () => {
      setIsFetchingMore(true);

     const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => {
            // Keep numbers (including 0), booleans, and non-empty string
            if (typeof value == "boolean") return value
            if (typeof value === 'number') return true;
            if (typeof value === 'string') return value.trim() !== '';
            return false;
        })
        );
        let newS = searchQuery
        if (!searchQuery){
            newS = ''
        }
      const listings = await searchListings(page,4,newS,cleanFilters);
      if (page == 1){
        setSearchResults(listings);
        setHasMore(true)
      }else{
        setSearchResults(prev => [...prev,...listings]);
      }

      if (listings?.length < 4) {
        setHasMore(false);
      }
      setShowFilters(false)
      setIsFetchingMore(false);
      setShouldSearch(false);
    }
    if(shouldSearch || page > 1){
      fetchSearchResults();
    }
  }, [page,shouldSearch,trigger]);

  const loadMore = () => {
      if (isFetchingMore) return;
      if (!hasMore) return;
        if (searchResults.length === 0) return;
      setPage(prev => prev + 1);
    };
  
  
  const {toggleFavourite} = useToggleFavourite();


  const handleToggleFavourite = async(id) => {
    await toggleFavourite(id);
  }

    
    const renderListingItem = ({ item },value) => (
      <TouchableOpacity onPress={() => router.push(`/property/${item.id}`)} style={!value ? [styles.listingCard,{shadowColor:theme.text}]:[styles.listingCardHorizontal]}>
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
    <SafeAreaView style={{flex:1,position:'relative'}}>

        <Modal visible={showFilters} animationType='fade' transparent={false}>
            <SafeAreaView style={{flex:1,position:'relative'}}>
                <ScrollView showsVerticalScrollIndicator={false} style={{
                    flex:1,
                    paddingHorizontal:20,
                    paddingVertical:15,
                    backgroundColor:theme.background
                }}>

                    <Header
                        leftIconStyles={{ backgroundColor: 'transparent', padding: 0 }}
                        onPress={() => setShowFilters(false)}
                        icon={
                        <View style={[styles.iconButton, { backgroundColor: theme.primary }]}>
                            <ChevronLeft color={'white'} size={24} />
                        </View>
                        }
                        title={
                            <Text style={{color:'black',fontSize:20}}>Filters</Text>
                        }
                    />

                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Location</Text>
        
                            <Select
                                placeholder={'Select Country *'}
                                addStyles={{ width: '100%' }}
                                selectedValue={filters?.country}
                                options={countries}
                                onValueChange={(value) => setFilters((prev) => ({ ...prev, country: value }))}
                            />
        
                            <Select
                                placeholder={'Select City *'}
                                addStyles={{ width: '100%', marginTop: 10 }}
                                selectedValue={filters?.city}
                                options={cities}
                                onValueChange={(value) => setFilters((prev) => ({ ...prev, city: value }))}
                            />

                         
                        </View>


                       <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Price</Text>
        
                           <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                                <Input
                                    keyboardType='decimal-pad'
                                    value={String(filters.min_price)} 
                                    containerStyle={{width:'48%'}}
                                    inputContainerStyle={{borderColor:'black',borderWidth:1}}
                                    placeholder='Min Price'
                                    onChangeText={(text) => setFilters((prev) => ({...prev,min_price:+text}))}
                                />
                                <Input
                                    keyboardType='decimal-pad'
                                    value={String(filters.max_price)} 
                                    containerStyle={{width:'48%'}}
                                    inputContainerStyle={{borderColor:'black',borderWidth:1}}
                                    placeholder='Max Price'
                                    onChangeText={(text) => setFilters((prev) => ({...prev,max_price:+text}))}
                                />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Area</Text>
        
                            <Input 
                                value={filters.max_total_rooms?.toString()} 
                                containerStyle={{width:'100%'}}
                                inputContainerStyle={{borderColor:'black',borderWidth:1}}
                                placeholder='Max Total Rooms'
                                keyboardType='decimal-pad'
                                onChangeText={(text) => setFilters((prev) => ({...prev,max_total_rooms:+text}))}
                            />

                           <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                                <Input 
                                    keyboardType='decimal-pad'
                                    value={filters.min_square_meters?.toString()} 
                                    containerStyle={{width:'48%'}}
                                    inputContainerStyle={{borderColor:'black',borderWidth:1}}
                                    placeholder='Min Square Metres'
                                    onChangeText={(text) => setFilters((prev) => ({...prev,min_square_meters:+text}))}
                                />
                                <Input 
                                    keyboardType='decimal-pad'
                                    value={filters.max_square_meters?.toString()} 
                                    containerStyle={{width:'48%'}}
                                    inputContainerStyle={{borderColor:'black',borderWidth:1}}
                                    placeholder='Max Metres'
                                    onChangeText={(text) => setFilters((prev) => ({...prev,max_square_meters:+text}))}
                                />
                            </View>
                        </View>


                       <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>More filters</Text>
        
                           <View style={{width:'100%',flexDirection:'column',justifyContent:'space-between'}}>
                                 <View style={styles.switchRow}>
                                    <Text style={[styles.switchLabel, { color: theme.text }]}>Furnished</Text>
                                    <Switch
                                        value={filters.furnished}
                                        onValueChange={(value) => setFilters((prev) => ({ ...prev, furnished: value }))}
                                    />
                                </View>

                                <View style={styles.switchRow}>
                                    <Text style={[styles.switchLabel, { color: theme.text }]}>New Construction</Text>
                                    <Switch
                                        value={filters.new_construction}
                                        onValueChange={(value) => setFilters((prev) => ({ ...prev, new_construction: value }))}
                                    />
                                </View>
            
                                <View style={styles.switchRow}>
                                    <Text style={[styles.switchLabel, { color: theme.text }]}>Parking</Text>
                                    <Switch
                                        value={filters.parking}
                                        onValueChange={(value) => setFilters((prev) => ({ ...prev, parking: value }))}
                                    />
                                </View>
            
                                <View style={styles.switchRow}>
                                    <Text style={[styles.switchLabel, { color: theme.text }]}>Balcony</Text>
                                    <Switch
                                        value={filters.balcony}
                                        onValueChange={(value) => setFilters((prev) => ({ ...prev, balcony: value }))}
                                    />
                                </View>
            
                                <View style={styles.switchRow}>
                                    <Text style={[styles.switchLabel, { color: theme.text }]}>Elevator</Text>
                                    <Switch
                                        value={filters.elevator}
                                        onValueChange={(value) => setFilters((prev) => ({ ...prev, elevator: value }))}
                                    />
                                </View>

                                   <View style={styles.switchRow}>
                                    <Text style={[styles.switchLabel, { color: theme.text }]}>Featured</Text>
                                    <Switch
                                        value={filters.is_featured}
                                        onValueChange={(value) => setFilters((prev) => ({ ...prev, is_featured: value }))}
                                    />
                                </View>
                            </View>
                        </View>


                           <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>

                            <Button onPress={() => {
                                setFilters({
                                    city:'',
                                    country:'',
                                    min_price:0,
                                    max_price:200000,
                                    min_square_meters:0,
                                    max_square_meters:1000,
                                    max_total_rooms:0,
                                    furnished:false,
                                    new_construction:false,
                                    parking:false,
                                    balcony:false,
                                    elevator:false,
                                    is_featured:false
                                })
                                setTrigger((prev) => prev + 1)
                            }} title='Reset Filters' addStyles={{backgroundColor:theme.accentLight,height:50,borderRadius:10,marginTop:5,width:'48%' }}/>

                             <Button onPress={() => {
                                setTrigger((prev) => prev + 1)
                            }} title='Apply Filters' addStyles={{backgroundColor:theme.primary,height:50,borderRadius:10,marginTop:5,width:'48%' }}/>
                            </View>
                </ScrollView>    
            </SafeAreaView>

        </Modal>
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
            <TouchableOpacity onPress={() => setShowFilters(true)} style={{ position: 'absolute', right: 15, top: 18 }}>
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
    section: {
    marginTop: 20,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 10,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,          
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
  switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5
    },
    switchLabel: {
        fontSize: 16
    }
})