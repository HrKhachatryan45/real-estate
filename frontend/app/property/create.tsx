import { StyleSheet, Text, View, SafeAreaView, useColorScheme, ScrollView, Switch, TouchableOpacity, Image } from 'react-native'
import useCreateListing from '@/hooks/listings/useCreateListing'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { ChevronLeft, PlusCircle, X } from 'lucide-react-native'
import { Header } from '@/components/Header'
import Colors from '@/constants/Colors'
import { Select } from '@/components/ui/Select'
import { useSelector } from 'react-redux'
import { Input } from '@/components/ui/Input'
import * as ImagePicker from 'expo-image-picker'
import { Button } from '@/components/ui/Button'
import { AlertMessage } from '@/components/ui/AlertMessage'

export default function create() {
    const router = useRouter();
    const user = useSelector((state) => state?.auth?.user)
    const color = useColorScheme()
    const theme = Colors[color ?? 'light'];
    const [images, setImages] = useState([])
    const [listingData, setListingData] = useState({
        title: '',
        description: '',
        price: '',
        price_onsale: '',
        currency: 'USD',
        listing_type: 'sale',
        property_type: 'apartment',
        country: 'Armenia',
        city: user?.city || '',
        address: '',
        square_meters: '',
        land_area: '',
        bedrooms: '',
        bathrooms: '',
        floor: '',
        total_floors: '',
        furnished: false,
        new_construction: false,
        parking: false,
        balcony: false,
        elevator: false,
        heating_type: 'none',
        is_active: true,
        is_featured: false,
        images: []
    })

    const handleImageUpload = async () => {
        if (listingData.images?.length > 4) {
            alert('No more than 4 images are allowed for each listing')
        }

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!permission.granted) {
            alert("Permission is required to upload an image.")
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        })

        if (result.canceled) return

        const assets = result.assets
        const newImages = [...images, ...assets]
        setImages(newImages.slice(0, 4))
    }

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    }

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true)
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
                setLoading(false)
            }
        };

        const fetchCities = async () => {
            setLoading(true)
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ country: listingData?.country })
                });

                const data = await response.json();
                if (data.data) {
                    const city = data.data.map((cx) => ({ value: cx, label: cx }))
                    setCities(city);
                }
            } catch (err) {
                console.error('Error fetching cities', err);
            } finally {
                setLoading(false)
            }
        };

        fetchCountries();

        if (listingData?.country != '') {
            fetchCities()
        }
    }, [listingData?.country]);

    const listing_types = [
        { value: 'rent', label: "For Rent" },
        { value: 'sale', label: "For Sale" }
    ]

    const property_types = [
        { value: 'apartment', label: "Apartment" },
        { value: 'house', label: "House" },
        { value: 'commercial', label: "Commercial" },
        { value: 'land', label: "Land" },
        { value: 'villa', label: "Villa" },
        { value: 'office', label: "Office Space" }
    ]

    const currencies = [
        { value: 'USD', label: "US Dollar (USD)" },
        { value: 'EUR', label: "Euro (EUR)" },
        { value: 'AMD', label: "Armenian Dram (AMD)" }
    ]

    const heating_types = [
        { value: 'gas', label: "Gas Heating" },
        { value: 'electric', label: "Electric Heating" },
        { value: 'central', label: "Central Heating" },
        { value: 'none', label: "No Heating" }
    ]

    const { createListing,success, loading: loadingListing, error: listingError } = useCreateListing()

    const handlePublish = async () => {
        const formData = new FormData()
        Object.keys(listingData).forEach((key) => formData.append(key, listingData[key]))
        images.forEach((image) => {
            formData.append('images', {
                uri: image.uri,
                name: image.fileName || `photo_${Date.now()}.jpg`,
                type: image.type || 'image/jpeg'
            });
        });

        await createListing(formData)
    }


    useEffect(() => {
        if(success){
            setTimeout(() => {
                router.replace('/(tabs)/')
            })
        }
    },[success])

    if (loading) {
        return <Text style={{ flex: 1, textAlign: 'center', marginTop: 50 }}>Loading...</Text>;
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                <Header
                    leftIconStyles={{ backgroundColor: 'transparent', padding: 0 }}
                    onPress={() => router.canGoBack() ? router.back(): router.replace('/(tabs)/')}
                    icon={
                        <View style={[styles.iconButton, { backgroundColor: theme.primary }]}>
                            <ChevronLeft color={'white'} size={24} />
                        </View>
                    }
                />
                <Text style={{ fontSize: 18, fontWeight: '600', marginTop: -15, textAlign: 'center', color: theme.text }}>
                    Publish listing
                </Text>

                {/* Basic Information */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Basic Information</Text>

                    <Input
                        value={listingData.title}
                        onChangeText={(text) => setListingData((prev) => ({ ...prev, title: text }))}
                        placeholderTextColor={'#666'}
                        inputContainerStyle={[
                            styles.input,
                            listingError?.toString()?.toLowerCase()?.includes('title') && { borderColor: theme.error }
                        ]}
                        placeholder='Title *'
                    />

                    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ width: '100%', alignItems: 'center', flexDirection: 'row', gap: 10 }}>
                        {images.length > 0 && images?.map((img, index) => (
                            <View style={{ width: 90, height: 90, position: "relative" }} key={index}>
                                <TouchableOpacity style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: theme.primaryDark, zIndex: 999, position: 'absolute', right: -5, top: -5, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleRemoveImage(index)}>
                                    <X size={15} color={'white'} />
                                </TouchableOpacity>
                                <Image source={{ uri: img.uri }} style={{ width: 90, height: 90, borderRadius: 8 }} />
                            </View>
                        ))}
                        {images?.length < 4 && <TouchableOpacity onPress={handleImageUpload} style={{ width: 90, height: 90, borderRadius: 8, backgroundColor: theme.background, borderColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
                            <PlusCircle color={'gray'} size={35} />
                        </TouchableOpacity>}
                    </ScrollView>

                    <Input
                        value={listingData.description}
                        onChangeText={(text) => setListingData((prev) => ({ ...prev, description: text }))}
                        placeholderTextColor={'#666'}
                        inputContainerStyle={[
                            styles.input,
                            { height: 100 },
                            listingError?.toString()?.toLowerCase()?.includes('description') && { borderColor: theme.error }
                        ]}
                        placeholder='Description *'
                        multiline
                    />

                    <Select
                        placeholder={'Currency *'}
                        addStyles={{ width: '100%', marginTop: 10 }}
                        selectedValue={listingData?.currency}
                        options={currencies}
                        onValueChange={(value) => setListingData((prev) => ({ ...prev, currency: value }))}
                    />

                    <Input
                        value={listingData.price}
                        onChangeText={(text) => setListingData((prev) => ({ ...prev, price: text }))}
                        placeholderTextColor={'#666'}
                        inputContainerStyle={[
                            styles.input,
                            listingError?.toString()?.toLowerCase()?.includes('price') && { borderColor: theme.error }
                        ]}
                        placeholder='Price *'
                        keyboardType='decimal-pad'
                    />

                    <Input
                        value={listingData.price_onsale}
                        onChangeText={(text) => setListingData((prev) => ({ ...prev, price_onsale: text }))}
                        placeholderTextColor={'#666'}
                        inputContainerStyle={[
                            styles.input,
                            listingError?.toString()?.toLowerCase()?.includes('sale') && { borderColor: theme.error }
                        ]}
                        placeholder='Sale Price (optional)'
                        keyboardType='decimal-pad'
                    />
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Location</Text>

                    <Select
                        placeholder={'Select Country *'}
                        addStyles={{ width: '100%' }}
                        selectedValue={listingData?.country}
                        options={countries}
                        onValueChange={(value) => setListingData((prev) => ({ ...prev, country: value }))}
                    />

                    <Select
                        placeholder={'Select City *'}
                        addStyles={{ width: '100%', marginTop: 10 }}
                        selectedValue={listingData?.city}
                        options={cities}
                        onValueChange={(value) => setListingData((prev) => ({ ...prev, city: value }))}
                    />

                    <Input
                        value={listingData.address}
                        onChangeText={(text) => setListingData((prev) => ({ ...prev, address: text }))}
                        placeholderTextColor={'#666'}
                        inputContainerStyle={[
                            styles.input,
                            listingError?.toString()?.toLowerCase()?.includes('address') && { borderColor: theme.error }
                        ]}
                        placeholder='Address *'
                    />
                </View>

                {/* Property Details */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Property Details</Text>

                    <Select
                        placeholder={'Listing Type *'}
                        addStyles={{ width: '100%' }}
                        selectedValue={listingData?.listing_type}
                        options={listing_types}
                        onValueChange={(value) => setListingData((prev) => ({ ...prev, listing_type: value }))}
                    />

                    <Select
                        placeholder={'Property Type *'}
                        addStyles={{ width: '100%', marginTop: 10 }}
                        selectedValue={listingData?.property_type}
                        options={property_types}
                        onValueChange={(value) => setListingData((prev) => ({ ...prev, property_type: value }))}
                    />

                    <Input
                        value={listingData.square_meters}
                        onChangeText={(text) => setListingData((prev) => ({ ...prev, square_meters: text }))}
                        placeholderTextColor={'#666'}
                        inputContainerStyle={[
                            styles.input,
                            listingError?.toString()?.toLowerCase()?.includes('square') && { borderColor: theme.error }
                        ]}
                        placeholder='Square Meters *'
                        keyboardType='number-pad'
                    />

                    <Input
                        value={listingData.land_area}
                        onChangeText={(text) => setListingData((prev) => ({ ...prev, land_area: text }))}
                        placeholderTextColor={'#666'}
                        inputContainerStyle={[
                            styles.input,
                            listingError?.toString()?.toLowerCase()?.includes('land') && { borderColor: theme.error }
                        ]}
                        placeholder='Land Area (optional)'
                        keyboardType='number-pad'
                    />

                    <Input
                        value={listingData.bedrooms}
                        onChangeText={(text) => setListingData((prev) => ({ ...prev, bedrooms: text }))}
                        placeholderTextColor={'#666'}
                        inputContainerStyle={[
                            styles.input,
                            listingError?.toString()?.toLowerCase()?.includes('bedroom') && { borderColor: theme.error }
                        ]}
                        placeholder='Bedrooms'
                        keyboardType='number-pad'
                    />

                    <Input
                        value={listingData.bathrooms}
                        onChangeText={(text) => setListingData((prev) => ({ ...prev, bathrooms: text }))}
                        placeholderTextColor={'#666'}
                        inputContainerStyle={[
                            styles.input,
                            listingError?.toString()?.toLowerCase()?.includes('bathroom') && { borderColor: theme.error }
                        ]}
                        placeholder='Bathrooms'
                        keyboardType='number-pad'
                    />

                    <Input
                        value={listingData.floor}
                        onChangeText={(text) => setListingData((prev) => ({ ...prev, floor: text }))}
                        placeholderTextColor={'#666'}
                        inputContainerStyle={[
                            styles.input,
                            listingError?.toString()?.toLowerCase()?.includes('floor') && { borderColor: theme.error }
                        ]}
                        placeholder='Floor (optional)'
                        keyboardType='number-pad'
                    />

                    <Input
                        value={listingData.total_floors}
                        onChangeText={(text) => setListingData((prev) => ({ ...prev, total_floors: text }))}
                        placeholderTextColor={'#666'}
                        inputContainerStyle={[
                            styles.input,
                            listingError?.toString()?.toLowerCase()?.includes('total') && { borderColor: theme.error }
                        ]}
                        placeholder='Total Floors (optional)'
                        keyboardType='number-pad'
                    />

                    <Select
                        placeholder={'Heating Type'}
                        addStyles={{ width: '100%', marginTop: 10 }}
                        selectedValue={listingData?.heating_type}
                        options={heating_types}
                        onValueChange={(value) => setListingData((prev) => ({ ...prev, heating_type: value }))}
                    />
                </View>

                {/* Features */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Features</Text>

                    <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: theme.text }]}>Furnished</Text>
                        <Switch
                            value={listingData.furnished}
                            onValueChange={(value) => setListingData((prev) => ({ ...prev, furnished: value }))}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: theme.text }]}>New Construction</Text>
                        <Switch
                            value={listingData.new_construction}
                            onValueChange={(value) => setListingData((prev) => ({ ...prev, new_construction: value }))}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: theme.text }]}>Parking</Text>
                        <Switch
                            value={listingData.parking}
                            onValueChange={(value) => setListingData((prev) => ({ ...prev, parking: value }))}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: theme.text }]}>Balcony</Text>
                        <Switch
                            value={listingData.balcony}
                            onValueChange={(value) => setListingData((prev) => ({ ...prev, balcony: value }))}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: theme.text }]}>Elevator</Text>
                        <Switch
                            value={listingData.elevator}
                            onValueChange={(value) => setListingData((prev) => ({ ...prev, elevator: value }))}
                        />
                    </View>
                </View>

                {/* Status */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Listing Status</Text>

                    <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: theme.text }]}>Active</Text>
                        <Switch
                            value={listingData.is_active}
                            onValueChange={(value) => setListingData((prev) => ({ ...prev, is_active: value }))}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={[styles.switchLabel, { color: theme.text }]}>Featured</Text>
                        <Switch
                            value={listingData.is_featured}
                            onValueChange={(value) => setListingData((prev) => ({ ...prev, is_featured: value }))}
                        />
                    </View>
                </View>

                <View style={{ height: 50 }} />
                {listingError && <AlertMessage message={listingError} type='error' />}
                {success && <AlertMessage message={success} type='success' />}
                <Button title='Publish' loading={loadingListing} onPress={handlePublish} addStyles={{ width: '100%', height: 50, backgroundColor: theme.primary }} />
            </ScrollView>
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
    input: {
        marginVertical: 5,
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
});
