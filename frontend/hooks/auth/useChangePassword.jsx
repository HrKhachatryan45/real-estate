import { useState } from "react";
import { loginUser } from "../../redux/slices/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import useRefreshAccessToken from "../../hooks/auth/useRefreshAccessToken"

const useChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const dispatch = useDispatch();
    const access_token = useSelector(state => state.auth.token)
    const {refreshAccessToken} = useRefreshAccessToken()
    const [success,setSuccess] = useState(false);

    const changePassword = async (body) => {
        setLoading(true);
        const attempt = async (access_token) => {
                try {
                    const response = await fetch(`${HOST_URL}/api/auth/change/password`,{
                        method:'POST',
                        headers: {
                            'Authorization':'Bearer ' + access_token
                        },
                        body:JSON.stringify(body)
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

            console.log(json,888);
            

            if (!response.ok || json.error) {
                setSuccess(false)
                setError(json.error || 'changePassword failed');
                setLoading(false);
                return null;    
            }

            setSuccess(true)
            console.log(json,525);
            
            dispatch(loginUser({user:json.user,access_token:access_token}));

            AsyncStorage.setItem('user', JSON.stringify(json.user));

        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {changePassword,error,loading,setError,success};
}

export default useChangePassword