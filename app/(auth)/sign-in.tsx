import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SignIn = () => {
  return (
   <View className='h-full w-full flex items-center justify-center'>
         <Text className='text-2xl font-bold'>Sign In</Text>
         <Link href={"/"} className='text-2xl font-bold'>Create Account</Link>
         {/* <Link href={"/(auth)/sign-in"}>Sign In</Link> */}
       </View>
  )
}

export default SignIn