import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import useRefreshAccessToken from "../../hooks/auth/useRefreshAccessToken"

const useEditListing = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success,setSuccess] = useState('')
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const access_token = useSelector(state => state.auth.token)
    const {refreshAccessToken} = useRefreshAccessToken()

    const editListing = async (formData,id) => {
        setLoading(true);
        const attempt = async (access_token) => {
                try {
                    const response = await fetch(`${HOST_URL}/api/listing/edit/`+id,{
                        method: 'POST',
                        headers: {
                            'Authorization':'Bearer ' + access_token
                        },
                        body:formData
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

            if (!response.ok || json.error) {
                setError(json.error || 'editListing failed');
                setLoading(false);
                return null;    
            }
            setSuccess(json.message)

            

        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {editListing,error,loading,setError,success};
}

export default useEditListing