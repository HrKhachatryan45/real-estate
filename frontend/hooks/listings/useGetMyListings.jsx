import { useState } from "react";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import useRefreshAccessToken from "../../hooks/auth/useRefreshAccessToken"

const useGetMyListings = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const access_token = useSelector(state => state.auth?.token)
    console.log(access_token,5);
    
    const {refreshAccessToken} = useRefreshAccessToken()

    const getMyListings = async (page,limit,type) => {
        setLoading(true);
        const attempt = async (access_token) => {
                try {
                    const response = await fetch(`${HOST_URL}/api/listing/get/mylistings?page=${page}&limit=${limit}&type=${type}`,{
                        method: 'GET',
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
                console.log(access_token,55);
                
                response = await attempt(new_access_token);
            }

            const json = await response.json();

            if (!response.ok || json.error) {
                setError(json.error || 'getMyListings failed');
                setLoading(false);
                return [];    
            }

            return json.listings;
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {getMyListings,error,loading,setError};
}

export default useGetMyListings