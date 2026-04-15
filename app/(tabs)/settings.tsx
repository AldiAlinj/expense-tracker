import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    "No email";
  const fullName =
    (user?.fullName ??
      [user?.firstName, user?.lastName].filter(Boolean).join(" ")) ||
    "No name set";
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  return (
    <SafeAreaView className="flex-1  bg-background p-5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
      >
        <Text className="list-title">Settings</Text>

        <View className="settings-card mt-5">
          <View className="settings-profile-row">
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="settings-avatar"
              />
            ) : (
              <View className="settings-avatar-fallback">
                <Text className="settings-avatar-initials">{initials}</Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="settings-name" numberOfLines={1}>
                {fullName}
              </Text>
              <Text className="settings-email" numberOfLines={1}>
                {email}
              </Text>
            </View>
          </View>
        </View>

        <View className="settings-card mt-4">
          <Text className="settings-section-title">Account</Text>

          <View className="settings-row">
            <Text className="settings-label">User ID</Text>
            <Text className="settings-value" numberOfLines={1}>
              {isLoaded ? (user?.id ?? "Unavailable") : "Loading..."}
            </Text>
          </View>

          <View className="settings-row">
            <Text className="settings-label">Email Verified</Text>
            <Text className="settings-value">
              {isLoaded
                ? user?.primaryEmailAddress?.verification?.status === "verified"
                  ? "Yes"
                  : "No"
                : "Loading..."}
            </Text>
          </View>

          <View className="settings-row settings-row-last">
            <Text className="settings-label">Created Account</Text>
            <Text className="settings-value">
              {isLoaded
                ? user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unavailable"
                : "Loading..."}
            </Text>
          </View>
        </View>

        <Pressable className="settings-logout-btn mt-5" onPress={handleSignOut}>
          <Text className="settings-logout-text">Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
