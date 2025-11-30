import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import useRefreshAccessToken from "../../hooks/auth/useRefreshAccessToken"
import { loginUser } from "../../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useToggleFavourite = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const access_token = useSelector(state => state.auth.token)
    const {refreshAccessToken} = useRefreshAccessToken()
    const dispatch = useDispatch();
    const toggleFavourite = async (id) => {
        setLoading(true);
        const attempt = async (access_token) => {
                try {
                    const response = await fetch(`${HOST_URL}/api/listing/toggle/favourite/`+id,{
                        method: 'POST',
                        headers: {
                            'Authorization':'Bearer ' + access_token
                        }
                    });
                   
                    return response;
                } catch (error) {
                    console.log(error);
                    return null;       
                }
            }
        try{
            let response = await attempt(access_token);

            if (!response || response.status === 401){
                let new_access_token = await refreshAccessToken();
                response = await attempt(new_access_token);
            }

            const json = await response.json();
                console.log(json,'as new user data');
                
            if (!response.ok || json.error) {
                setError(json.error || 'toggleFavourite failed');
                setLoading(false);
                return null;    
            }

            dispatch(loginUser({user:json.user,access_token}));
            await AsyncStorage.setItem('user', JSON.stringify(json.user));


        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {toggleFavourite,error,loading,setError};
}

export default useToggleFavourite