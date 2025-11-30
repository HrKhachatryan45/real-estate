import { useState } from "react";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import useRefreshAccessToken from "../../hooks/auth/useRefreshAccessToken"

const useGetFeaturedListings = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const access_token = useSelector(state => state.auth?.token)
    const {refreshAccessToken} = useRefreshAccessToken()

    const getListingsF = async (page,limit) => {
        setLoading(true);
        const attempt = async (access_token) => {
                try {
                    const response = await fetch(`${HOST_URL}/api/listing/get/featured?page=${page}&limit=${limit}`,{
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
                console.log(new_access_token,532);
                
                response = await attempt(new_access_token);
            }

            const json = await response.json();
            console.log(json,537);

            if (!response.ok || json.error) {
                setError(json.error || 'getListings failed');
                setLoading(false);
                return null;    
            }

            return json.listings;

        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {getListingsF,error,loading,setError};
}

export default useGetFeaturedListings