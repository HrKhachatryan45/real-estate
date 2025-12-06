import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import useRefreshAccessToken from "../../hooks/auth/useRefreshAccessToken"

const useDeleteMessage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success,setSuccess] = useState('')
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const dispatch = useDispatch();
    const access_token = useSelector(state => state.auth.token)
    const {refreshAccessToken} = useRefreshAccessToken()

    const deleteMessage = async (messageId) => {
        setLoading(true);
        const attempt = async (access_token) => {
                try {
                    const response = await fetch(`${HOST_URL}/api/messages/delete/message/${messageId}`,{
                        method: 'DELETE',
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

            if (!response.ok || json.error) {
                setError(json.error || 'deleteMessage failed');
                setLoading(false);
                return null;    
            }
            setSuccess(messageId)
            
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {deleteMessage,error,loading,setError,success,setSuccess};
}

export default useDeleteMessage