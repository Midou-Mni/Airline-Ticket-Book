import { View, Text, Image } from "react-native";
import React from "react";

const Header = () => {
  return (
    <View className="flex-row justify-between w-full items-center px-4">
      <View className="w-1/2 flex-row h-14 items-center">
        <View className="pr-2">
          <View className="overflow-hidden">
            <Image
              source={require("../assets/images/g.jpg")}
              className="w-12 h-12 border-2 border-white rounded-full"
            />
          </View>
        </View>
        <View>
          <Text className="text-base text-neutral-400 font-medium">
            Welcome back{" "}
          </Text>
          <Text className="text-xl text-white font-bold">Stacks 👋</Text>
        </View>
      </View>

      <View className="w-1/2 flex-row space-x-4 h-14 justify-end items-end">
        <View className="w-fit rounded-full bg-gray-600 px-4 justify-center h-full flex-row items-center gap-2">
            <View className="rounded-full bg-gray-500 w-8 h-8 justify-center items-center">
                <Text className="text-white font-semibold">P</Text>
            </View>
            <View className="justify-start items-start gap-1">
                <Text className="text-base text-gray-300">Flight point</Text>
                <Text className="text-white">✈️ 5,231</Text>
            </View>
        </View>
      </View>
    </View>
  );
};

export default Header;
