import Constants from 'expo-constants';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../../redux/slices/authSlice';

const useRefreshAccessToken = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth?.user)
    const HOST_URL = Constants.expoConfig?.extra?.HOST_URL;

    const refreshAccessToken = async () => {
        try {
            const response = await fetch(HOST_URL+'/auth/refresh/accessToken',{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                }
            })
            const json = await response.json()
            if (json.error){
                console.error(json.error)
                if (response.status === 401){
                    await AsyncStorage.removeItem('user')
                    dispatch(logoutUser())
                }
            }
            if (response.ok){
                await AsyncStorage.setItem('token',JSON.stringify(json.access_token))
                dispatch( loginUser({user:user,access_token:json.access_token}) )
            }
            return json.access_token
        }catch (e){
            console.log(e)
        }
    }
    return {refreshAccessToken}
}
export default useRefreshAccessToken;