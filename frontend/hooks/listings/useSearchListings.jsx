import { useState } from "react";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import useRefreshAccessToken from "../../hooks/auth/useRefreshAccessToken"

const useSearchListings = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const access_token = useSelector(state => state.auth?.token)
    console.log(access_token,5);
    
    const {refreshAccessToken} = useRefreshAccessToken()

    const searchListings = async (page,limit,searchQuery,filters) => {
        setLoading(true);
        const attempt = async (access_token) => {
                try {
                    const response = await fetch(`${HOST_URL}/api/listing/get/filter?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,{
                        method: 'POST',
                        headers: {
                            'Content-Type':'application/json',
                            'Authorization':'Bearer ' + access_token
                        },
                        body: JSON.stringify(filters)
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
                setError(json.error || 'searchListings failed');
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

    return {searchListings,error,loading,setError};
}

export default useSearchListings