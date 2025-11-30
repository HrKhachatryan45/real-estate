import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";
import Constants from "expo-constants";
import useRefreshAccessToken from "../../hooks/auth/useRefreshAccessToken"

const useEdit = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const dispatch = useDispatch();
    const access_token = useSelector(state => state.auth.token)
    const {refreshAccessToken} = useRefreshAccessToken()

    const edit = async (formData) => {
        setLoading(true);
        const attempt = async (access_token) => {
                try {
                    const response = await fetch(`${HOST_URL}/api/auth/edit/profile`,{
                        method:"POST",
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
            console.log(json,46);
            
            if (!response.ok || json.error) {
                setError(json.error || 'edit failed');
                setLoading(false);
                return null;    
            }


            dispatch(loginUser({user:json.user,access_token:access_token}));

            AsyncStorage.setItem('user', JSON.stringify(json.user));


        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {edit,error,loading,setError};
}

export default useEdit