import { useState } from "react";
import { loginUser } from "../../redux/slices/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";
import { useDispatch } from "react-redux";


const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const dispatch = useDispatch();
    const register = async (userData) => {
        setLoading(true);
        try{
            const response = await fetch(`${HOST_URL}/api/auth/register`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const json = await response.json();
            console.log(json,55);
            
            if (!response.ok) {
                setError(json.error || 'Register failed');
                setLoading(false);
                return null;    
            }
            
            dispatch(loginUser(json));

            AsyncStorage.setItem('user', JSON.stringify(json.user));
            AsyncStorage.setItem('token', json.access_token);

            
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {register,error,loading,setError};
}

export default useRegister