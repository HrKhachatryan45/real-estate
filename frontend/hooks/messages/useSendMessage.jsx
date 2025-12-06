import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import useRefreshAccessToken from "../../hooks/auth/useRefreshAccessToken"

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success,setSuccess] = useState('')
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const dispatch = useDispatch();
    const access_token = useSelector(state => state.auth.token)
    const {refreshAccessToken} = useRefreshAccessToken()

    const sendMessage = async (message,userId) => {
        setLoading(true);
        const attempt = async (access_token) => {
                try {
                    const response = await fetch(`${HOST_URL}/api/messages/send/message/${userId}`,{
                        method: 'POST',
                        headers: {
                            'Authorization':'Bearer ' + access_token
                        },
                        body:JSON.stringify({message})
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
                setError(json.error || 'sendMessage failed');
                setLoading(false);
                return null;    
            }
            console.log(json,'barev');
            
            return json;
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {sendMessage,error,loading,setError,success};
}

export default useSendMessage