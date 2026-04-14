import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SignUp = () => {
  return (
    <View className='h-full w-full flex items-center justify-center'>
      <Text className='text-2xl font-bold'>SignUp</Text>
      <Link href={"/"}>Sign In</Link>
      {/* <Link href={"/(auth)/sign-in"}>Sign In</Link> */}
    </View>
  )
}

export default SignUp