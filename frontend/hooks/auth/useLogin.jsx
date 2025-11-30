import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;
    const dispatch = useDispatch();
    
    
    const login = async (email, password) => {
        setLoading(true);
        try{
            const response = await fetch(`${HOST_URL}/api/auth/login`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const json = await response.json();
            
            if (!response.ok || json.error) {
                setError(json.error || 'Login failed');
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

    return {login,error,loading,setError};
}

export default useLogin