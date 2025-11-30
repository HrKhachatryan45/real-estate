import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function FullMap() {
    const { lat, lng } = useLocalSearchParams();
    const router = useRouter();
    const region = {
        latitude: Number(lat),
        longitude: Number(lng),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    return (
        <View style={{ flex: 1,position:'relative' }}>
        <TouchableOpacity
            onPress={router.back}
            style={{
                position: "absolute",
                left: 10,
                top:30 ,
                zIndex: 9999,        // <-- KEY FIX (iOS)
                elevation: 20,       // <-- KEY FIX (Android)
                padding: 8,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 25,
            }}>
            <ChevronLeft color="white" size={30} />
        </TouchableOpacity>
        <MapView style={{ flex: 1 }} region={region}>
            <Marker coordinate={region} />
        </MapView>
        </View>
    );
}
