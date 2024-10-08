import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";

const WelcomeScreen = () => {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#192031" }}>
      <StatusBar style="light" />

      <View className="h-full">
        <View className="w-full px-4 my-8 items-center">
          <Animated.View
            entering={FadeInDown.duration(200).springify()}
            className="flex-row justify-center items-center pb-16"
          >
            <MaterialCommunityIcons name="airplane" size={24} color="#12B3A8" />

            <Text className="text-white text-xl leading-[60px] pl-1">
              STACKS
            </Text>
            <Text className="text-[#4AE8DD] text-xl leading-[60px] pl-1 italic">
              FLY
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(200).delay(200).springify()}
          >
            <Text className="text-white text-[45px] font-medium leading-[60px] px-4">
              Discover your Dream Flight Easily
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(200).delay(400).springify()}
            className="mt-4"
          >
            <Text className="text-neutral-300 text-xl font-medium leading-[38px]">
              find an easy way to buy airplane tickets with jus clicks in the
              application.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(200).delay(500).springify()}
            className="h-1/4 w-full justify-start pt-8 px-4"
          >
            <Pressable
              onPress={() => router.push("/(tabs)")}
              className="bg-[#12B3A8] rounded-xl justify-center items-center py-4"
            >
              <Text className="text-white font-bold text-lg">Discover</Text>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(200).delay(600).springify()}
            style={{ gap: 8 }}
            className="flex-row mt-4 w-full justify-center"
          >
            <Text className="text-neutral-300 font-medium text-lg leading-[38px] text-center">
              Don't have an account?
            </Text>
            <Text className="text-[#12B3A8] 300 font-semibold text-lg leading-[38px] text-center">
              Register
            </Text>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
