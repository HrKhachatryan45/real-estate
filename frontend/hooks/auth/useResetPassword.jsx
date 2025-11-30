import { useState } from "react";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";
import { loginUser } from "../../redux/slices/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useResetPassword = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    
    const resetPassword = async (data) => {
        setLoading(true);
        try{
            const response = await fetch(`${HOST_URL}/api/auth/reset/password`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const json = await response.json();
            
            if (!response.ok || json.error) {
                setError(json.error || 'resetPassword failed');
                setLoading(false);
                return null;    
            }
            return json.message;
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {resetPassword,error,loading,setError};
}

export default useResetPassword