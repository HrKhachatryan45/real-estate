import { StyleSheet, Text, View, SafeAreaView, useColorScheme, TouchableOpacity, FlatList, ImageBackground, Dimensions, ScrollView } from 'react-native'
import * as Location from 'expo-location';
import { Header } from '../../components/Header'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import useGetListing from '@/hooks/listings/useGetListing'
import Colors from '@/constants/Colors'
import { ChevronLeft, Heart, ChevronDown, Bed, Bath, Maximize, MapPin, Home, Calendar, Eye, ChevronRight, Phone, Edit, Edit2 } from 'lucide-react-native'
import useToggleFavourite from '@/hooks/listings/useToggleFavourite'
import { useSelector } from 'react-redux'

export default function PropertyDetails() {
    const { id } = useLocalSearchParams()
    const { getListing, loading } = useGetListing()
    const [propertyListing, setPropertyListing] = useState(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedPrice, setSelectedPrice] = useState(null)


     const carouselRef = React.useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => prev + 1);
        if (carouselRef.current) {
            carouselRef.current.scrollToIndex({ index: currentIndex + 1,animated:true });
        }
    }
    const handlePrev = () => {
        setCurrentIndex((prev) => prev - 1);
        if (carouselRef.current) {
            carouselRef.current.scrollToIndex({ index: currentIndex - 1,animated:true });
        }
    }


    // Currency symbols
    const currency = {
        USD: "$",
        EUR: "€",
        AMD: "֏",
    }

    useEffect(() => {
        const fetchListing = async () => {
            const listing = await getListing(id)
            console.log(listing, 46);
            
            setPropertyListing(listing)
            setSelectedPrice(`${currency[listing.currency]}${listing.price}`)
        }
        fetchListing()
    }, [])


    const user = useSelector((state) => state.auth?.user);

     const {toggleFavourite} = useToggleFavourite();
    
    
    const handleToggleFavourite = async() => {
    await toggleFavourite(propertyListing?.id);
    }
    
    const [allPrices,setAllPrices] = useState([])

    const color = useColorScheme()
    const theme = Colors[color] ?? Colors.light
    const router = useRouter()

    const currencySelected = propertyListing?.currency?.toUpperCase()
    const basePrice = propertyListing?.price

   useEffect(() => {
    if (!propertyListing) return;

    const basePrice = propertyListing.price;
    const currencySelected = propertyListing.currency.toUpperCase();
    const newArr = [];

    if (currencySelected === 'USD') {
        newArr.push(`€${(basePrice * 0.91).toFixed(2)}`);
        newArr.push(`֏${(basePrice * 388.50).toFixed(2)}`);
    } else if (currencySelected === 'EUR') {
        newArr.push(`$${(basePrice * 1.10).toFixed(2)}`);
        newArr.push(`֏${(basePrice * 426.76).toFixed(2)}`);
    } else if (currencySelected === 'AMD') {
        newArr.push(`$${(basePrice * 0.0026).toFixed(2)}`);
        newArr.push(`€${(basePrice * 0.0023).toFixed(2)}`);
    }

    setAllPrices(newArr);
}, [propertyListing]);



const [requestAccessMap, setRequestAccessMap] = useState(false);

useEffect(() => {
    const getCoordinates = async () => {
        if (!propertyListing) return;

        const fullAddress = `${propertyListing.address}, ${propertyListing.city}, ${propertyListing.country}`;

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.log("Permission denied");
            return;
        }

        const geocode = await Location.geocodeAsync(fullAddress);

        if (geocode && geocode.length > 0) {
       router.push({
            pathname: "/map",
            params: { lat: geocode[0].latitude, lng: geocode[0].longitude }
        })
        }
       
    };
    if (requestAccessMap){
    getCoordinates();
    }
}, [propertyListing,requestAccessMap]);

    if (loading || !propertyListing) return <Text>Loading...</Text>

    const screenWidth = Dimensions.get('window').width - 30;

    const InfoItem = ({ icon, label, value }) => (
        <View style={styles.infoItem}>
            {icon}
            <View style={{ marginLeft: 10 }}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
            </View>
        </View>
    )

    const FeatureBadge = ({ label, active }) => (
        <View style={[styles.featureBadge, { 
            backgroundColor: active ? theme.primary + '20' : theme.background,
            borderColor: active ? theme.primary : theme.textSecondary
        }]}>
            <Text style={[styles.featureText, { color: active ? theme.primary : theme.textSecondary }]}>
                {label}
            </Text>
        </View>
    )


const SCREEN_WIDTH = Dimensions.get('window').width

  const onScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

   

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <FlatList
                        ref={carouselRef}
                        data={propertyListing?.images || []}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <ImageBackground
                                source={{ uri: item?.url }}
                                style={{
                                    width: Dimensions.get('window').width,
                                    height: 350,
                                }}
                            />
                        )}
                    />

                    {currentIndex > 0 && (
                        <TouchableOpacity
                            onPress={handlePrev}
                            style={{
                                position: "absolute",
                                left: 10,
                                top: "45%",
                                padding: 8,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                borderRadius: 25,
                            }}>
                            <ChevronLeft color="white" size={30} />
                        </TouchableOpacity>
                    )}

                    {currentIndex < propertyListing?.images?.length - 1 && (
                        <TouchableOpacity
                            onPress={handleNext}
                            style={{
                                position: "absolute",
                                right: 10,
                                top: "45%",
                                padding: 8,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                borderRadius: 25,
                            }}>
                            <ChevronRight color="white" size={30} />
                        </TouchableOpacity>
                    )}
                    
                    <View style={styles.headerOverlay}>
                        <Header
                            leftIconStyles={{backgroundColor:'transparent',padding:0}}
                            onPress={() => router.back()}
                            icon={
                                <View style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                                    <ChevronLeft color={'white'} size={24} />
                                </View>
                            }
                            title={
                                <View style={{flexDirection:"row",justifyContent:'center',gap:10}}>
                                    <TouchableOpacity 
                                    onPress={handleToggleFavourite}
                                    style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                                    >
                                        <Heart 
                                            color={user?.favourite_listings?.includes(propertyListing?.id) ? 'red' : 'white'} 
                                            fill={user?.favourite_listings?.includes(propertyListing?.id) ? 'red' : 'none'}
                                            size={24} 
                                        />
                                    </TouchableOpacity>
                                    {propertyListing?.owner?.id === user?.id && (
                                        <TouchableOpacity 
                                        onPress={() => router.replace('property/edit/'+id)}
                                        style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                                        >
                                            <Edit2
                                                color={theme.primary}
                                                fill={theme.primary} 
                                                size={24} 
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            }
                        />
                    </View>

                    {/* Listing Type Badge */}
                    <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                        <Text style={styles.badgeText}>
                            {propertyListing?.listing_type?.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Title & Property Type */}
                    <Text style={[styles.title, { color: theme.text }]}>
                        {propertyListing?.title}
                    </Text>
                    <View style={styles.propertyTypeRow}>
                        <Home size={16} color={theme.textSecondary} />
                        <Text style={[styles.propertyType, { color: theme.textSecondary }]}>
                            {propertyListing?.property_type}
                        </Text>
                        <Eye size={16} color={theme.textSecondary} style={{ marginLeft: 15 }} />
                        <Text style={[styles.propertyType, { color: theme.textSecondary }]}>
                            {propertyListing?.views} views
                        </Text>
                    </View>

                    <View style={styles.priceSection}>
                        <TouchableOpacity
                            onPress={() => setShowDropdown(!showDropdown)}
                            style={[styles.priceButton, { 
                                borderColor: theme.textSecondary,
                                backgroundColor: theme.background 
                            }]}
                        >
                            <View>
                                <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>
                                    Price
                                </Text>
                                <Text style={[styles.priceValue, { color: theme.text,textDecorationLine:propertyListing?.price_onsale ? 'line-through':'none' }]}>
                                    {selectedPrice}
                                </Text>
                            </View>
                            <ChevronDown size={20} color={theme.text} />
                        </TouchableOpacity>

                        {showDropdown && (
                            <View style={[styles.dropdown, { 
                                backgroundColor: theme.background,
                                borderColor: theme.textSecondary 
                            }]}>
                                {allPrices.map((p, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => {
                                            let newf = allPrices.filter(price => price !== p)
                                            newf.push(selectedPrice)
                                            setAllPrices(newf)       
                                            setSelectedPrice(p)
                                            setShowDropdown(false)
                                        }}
                                        style={styles.dropdownItem}
                                    >
                                        <Text style={[styles.dropdownText, { color: theme.text }]}>
                                            {p}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {propertyListing?.price_onsale && parseFloat(propertyListing.price_onsale) < parseFloat(propertyListing.price) && (
                            <View style={[styles.saleTag, { backgroundColor: '#ff4444' }]}>
                                <Text style={styles.saleText}>
                                    On Sale: {currency[propertyListing.currency]}{propertyListing.price_onsale}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Property Stats */}
                    <View style={styles.statsContainer}>
                        <View style={[styles.statBox, { borderColor: theme.textSecondary }]}>
                            <Bed size={24} color={theme.primary} />
                            <Text style={[styles.statValue, { color: theme.text }]}>
                                {propertyListing?.bedrooms}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                                Bedrooms
                            </Text>
                        </View>

                        <View style={[styles.statBox, { borderColor: theme.textSecondary }]}>
                            <Bath size={24} color={theme.primary} />
                            <Text style={[styles.statValue, { color: theme.text }]}>
                                {propertyListing?.bathrooms}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                                Bathrooms
                            </Text>
                        </View>

                        <View style={[styles.statBox, { borderColor: theme.textSecondary }]}>
                            <Maximize size={24} color={theme.primary} />
                            <Text style={[styles.statValue, { color: theme.text }]}>
                                {propertyListing?.square_meters}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                                m²
                            </Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Description
                        </Text>
                        <Text style={[styles.description, { color: theme.textSecondary }]}>
                            {propertyListing?.description}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Features
                        </Text>
                        <View style={styles.featuresGrid}>
                            <FeatureBadge label="Furnished" active={propertyListing?.furnished} />
                            <FeatureBadge label="New Construction" active={propertyListing?.new_construction} />
                            <FeatureBadge label="Parking" active={propertyListing?.parking} />
                            <FeatureBadge label="Balcony" active={propertyListing?.balcony} />
                            <FeatureBadge label="Elevator" active={propertyListing?.elevator} />
                            {propertyListing?.heating_type && (
                                <FeatureBadge label={`Heating: ${propertyListing.heating_type}`} active={true} />
                            )}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Location
                        </Text>
                        <View style={[{
                            borderWidth: 1,
                            borderRadius: 10, 
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 10
                        }, {
                            backgroundColor: theme.background,
                            borderColor: theme.textSecondary 
                        }]}>
                            <View style={[styles.locationBox,{width:'80%',borderWidth:0}]}>
                                <MapPin size={20} color={theme.primary} />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                    <Text style={[styles.locationText, { color: theme.text }]}>
                                        {propertyListing?.address}
                                    </Text>
                                    <Text style={[styles.locationSubtext, { color: theme.textSecondary }]}>
                                        {propertyListing?.city}, {propertyListing?.country}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    setRequestAccessMap(true);
                                }}
                                style={{ backgroundColor: theme.primary,borderRadius:50,width:40,height:40,alignItems:'center',justifyContent:'center' }}
                            >
                                <ChevronRight size={20} color={'white'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {(propertyListing?.floor || propertyListing?.total_floors || propertyListing?.land_area) && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                Additional Information
                            </Text>
                            {propertyListing?.floor && (
                                <InfoItem 
                                    icon={<Calendar size={20} color={theme.primary} />}
                                    label="Floor"
                                    value={`${propertyListing.floor}${propertyListing.total_floors ? ` of ${propertyListing.total_floors}` : ''}`}
                                />
                            )}
                            {propertyListing?.land_area && (
                                <InfoItem 
                                    icon={<Maximize size={20} color={theme.primary} />}
                                    label="Land Area"
                                    value={`${propertyListing.land_area} m²`}
                                />
                            )}
                            {propertyListing?.owner?.phone_number && propertyListing?.is_active && (
                                <InfoItem 
                                    icon={<Phone size={20} color={theme.primary} />}
                                    label="Owner Phone"
                                    value={propertyListing?.owner?.phone_number}
                                />
                            )}
                        </View>
                    )}

                    {/* to avoid same person messaging  */}
                    {propertyListing?.owner && propertyListing?.is_active && (user.id != propertyListing?.owner?.id) && <TouchableOpacity 
                        onPress={() => router.replace('/conversations/'+propertyListing?.owner?.id)}
                        style={[styles.contactButton, { backgroundColor: theme.primary }]}
                    >
                        <Text style={styles.contactButtonText}>Message Owner</Text>
                    </TouchableOpacity>}
                    {(propertyListing?.expired || !propertyListing?.is_active) && <TouchableOpacity 
                        style={[styles.contactButton, { backgroundColor: theme.error }]}
                    >
                        <Text style={styles.contactButtonText}>Expired</Text>
                    </TouchableOpacity>}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerOverlay: {
        position: 'absolute',
        top: 20,
        left: 15,
        right: 15,
        zIndex: 10
    },
    iconButton: {
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    badge: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20
    },
    badgeText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 1
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8
    },
    propertyTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    propertyType: {
        fontSize: 14,
        marginLeft: 6,
        textTransform: 'capitalize'
    },
    priceSection: {
        marginBottom: 20
    },
    priceButton: {
        padding: 16,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    priceLabel: {
        fontSize: 12,
        marginBottom: 4
    },
    priceValue: {
        fontSize: 24,
        fontWeight: '700'
    },
    dropdown: {
        borderWidth: 1,
        marginTop: 8,
        borderRadius: 12,
        padding: 8
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    dropdownText: {
        fontSize: 18,
        fontWeight: '600'
    },
    saleTag: {
        marginTop: 12,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    saleText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 4
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 8
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4
    },
    section: {
        marginBottom: 25
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12
    },
    description: {
        fontSize: 15,
        lineHeight: 22
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    featureBadge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1
    },
    featureText: {
        fontSize: 13,
        fontWeight: '500'
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1
    },
    locationText: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4
    },
    locationSubtext: {
        fontSize: 13
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 2
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600'
    },
    contactButton: {
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10
    },
    contactButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5
    }
})