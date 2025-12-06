import useToggleFavourite from '@/hooks/listings/useToggleFavourite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, SafeAreaView, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView, Dimensions, useColorScheme, ActivityIndicator } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import useGetListings from '../../hooks/listings/useGetListings'
import useGetFeaturedListings from '../../hooks/listings/useGetFeaturedListings'
import Navbar from '@/components/custom/Navbar'
import { Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { useRouter } from 'expo-router'
import { Activity } from 'lucide-react-native';
const { width } = Dimensions.get('window')

export default function index() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0);
  const user = useSelector((state) => state?.auth?.user)
  const { getListingsF, loading: loadingFeatured } = useGetFeaturedListings()
  const { getListings, loading: loadingListings } = useGetListings()
  const [authChecked, setAuthChecked] = useState(false);
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1);
  const [featuredListings, setFeaturedListings] = useState([])
  const [listings, setListings] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    const check = async () => {
      const userX = await AsyncStorage.getItem('user');
      const parsed = JSON.parse(userX);

      if (!parsed) {
        router.replace('/signin');
        return;
      }

      setAuthChecked(true);
    };

    check();
  }, []);

  // Fetch featured listings
  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const listings = await getListingsF(1, 5)
        setFeaturedListings(Array.isArray(listings) ? listings : [])
      } catch (error) {
        console.error('Error fetching featured listings:', error);
        setFeaturedListings([])
      }
    }
    fetchFeaturedListings()
  }, [refreshKey])

  useEffect(() => {
    const getListingsX = async () => {
      if (page > 1 && !isRefreshing) {
        setIsFetchingMore(true);
      }

      try {
        const ls = await getListings(page, 4, activeCategory)
        const safeLs = Array.isArray(ls) ? ls : [];

        if (safeLs?.length == 0) {
          setHasMore(false)
        } else {
          setHasMore(true)
          
          if (page === 1) {
            setListings(safeLs);
          } else {
            setListings(prev => {
              const safePrev = Array.isArray(prev) ? prev : [];
              return [...safePrev, ...safeLs];
            });
          }
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        setHasMore(false)
      } finally {
        setIsFetchingMore(false);
        setIsRefreshing(false);
      }
    }
    
    getListingsX()
  }, [activeCategory, page, refreshKey])

  const loadMore = () => {
    if (isFetchingMore) return;
    if (!hasMore) return;
    if (isRefreshing) return;
    setPage(prev => prev + 1);
  };

  const handleRefresh = () => {
    setIsFetchingMore(false);
    setListings([]);
    setPage(1);
    setRefreshKey((prev) => prev + 1)
    setIsRefreshing(true);
  };

  const { toggleFavourite } = useToggleFavourite();

  const handleToggleFavourite = async (id) => {
    await toggleFavourite(id);
  }

  const categories = ['All', 'House', 'Apartment', 'Villa', 'Commercial']


  const currency = {
      USD: "$",
      EUR: "€",
      AMD: "֏",
  }

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/property/${item.id}`)} style={styles.featuredCard}>
      <Image
        source={{ uri: item.images[0]?.url }}
        style={styles.featuredImage}
      />
      <View style={styles.featuredBadge}>
        <Text style={styles.featuredBadgeText}>Featured</Text>
      </View>
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredPrice}>{currency[item.currency]}{item.price?.toLocaleString()}</Text>
        <Text style={styles.featuredTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.featuredLocation}>
          <Ionicons name="location-outline" size={14} color="#FFF" />
          <Text style={styles.featuredLocationText}>{item.city},{item.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

    


  const renderListingItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/property/${item.id}`)} style={[styles.listingCard]}>
      <Image
        source={{ uri: item.images[0]?.url }}
        style={styles.listingImage}
      />
      <View style={{ width: 100, height: 20, backgroundColor: 'red', position: 'absolute', bottom: 18, right: -22, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-45deg' }] }}>
        <Text style={{ color: 'white' }}>for {item.listing_type}</Text>
      </View>
      <View style={styles.listingDetails}>
        <Text style={[styles.listingTitle, { color: theme.textSecondary }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.listingPrice, { color: theme.primaryLight }]}>{currency[item.currency]}{item.price?.toLocaleString()}</Text>
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

  const colors = useColorScheme()
  const theme = Colors[colors] ?? Colors.light;

  const header = useMemo(() => {
    return (
      <>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text }]}>Hello, {user?.fullname || 'Guest'}!</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Find your dream home</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                activeCategory === category && { backgroundColor: theme.primary }
              ]}
              onPress={() => {
                setListings([]);
                setActiveCategory(category);
                setPage(1);
              }}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === category && { color: '#FFF' }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Properties</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {loadingFeatured ? (
            <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 20 }} />
          ) : (
            <FlatList
              data={featuredListings}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `usual-${item.id}-${index}`}
              renderItem={renderFeaturedItem}
              contentContainerStyle={styles.featuredList}
            />
          )}
          {/* Recent Properties Header */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Recent Properties
              </Text>
              <TouchableOpacity>
                <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </>
    )
  }, [activeCategory, theme, featuredListings, user, loadingFeatured]);

  if (!authChecked) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 10 }}>Checking session...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Navbar expanded={expanded} setExpanded={setExpanded} />
      <FlatList
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        showsVerticalScrollIndicator={false}
        data={listings}
        ListHeaderComponent={header}
        keyExtractor={(item, index) => `listing-${item.id}-${index}`}
        renderItem={renderListingItem}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}
        ListFooterComponent={<>
          {(loadingListings || isFetchingMore) && !isRefreshing ? (
            <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: 20 }} />
          ) : null}
        </>}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  categoryContainer: {
    marginTop: 20,
    height: 35,
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuredList: {
    paddingHorizontal: 15,
  },
  featuredCard: {
    width: width * 0.75,
    height: 240,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featuredBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  featuredPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  featuredTitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 4,
  },
  featuredLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  featuredLocationText: {
    fontSize: 12,
    color: '#FFF',
  },
  listingCard: {
    width: '48%',
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