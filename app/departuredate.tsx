import { View, Text, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeparturedateScreen = () => {
  const [flightOfferData, setFlightOfferData] = useState<any>({
    departureDate: new Date(),
  });

  const saveDeapartureDate = async () => {
    try {
      const departureDate = new Date(flightOfferData.departureDate);
      const dateString = departureDate.toISOString().split("T")[0];
      
      await AsyncStorage.setItem("departureDate", dateString);

      Alert.alert("Success", "Departure Date Saved Successfully");
    } catch (error) {
      console.log("Error in saveDeaparture_Date", error);
    }
  };
  return (
    <View>
      {/* Header */}
      <View className="flex justify-start border-orange-600 rounded-b-[20px] w-full bg-[#192034] relative pt-10 pb-7">
        <View>
          <View className="flex-row items-center justify-start gap-4 px-2">
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center justify-center h-14 w-[20%] "
            >
              <View className="rounded-full bg-gray-600 justify-center items-center">
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={30}
                  color="white"
                />
              </View>
            </Pressable>

            <View className="w-[60%] justify-center items-center flex-row">
              <Text className="text-lg font-extrabold text-white">
                Departure Date
              </Text>
            </View>

            <View className="w-[30%]">
              <View>
                <Pressable
                  className="h-10 w-10 items-center justify-center"
                  onPress={() => saveDeapartureDate()}
                >
                  <Text className="text-white text-lg font-bold">Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Calendar View */}
      <View>
        <Calendar
          onDayPress={(day: any) => {
            setFlightOfferData({
              ...flightOfferData,
              departureDate: new Date(day.dateString),
            });
          }}
          markedDates={{
            [flightOfferData.departureDate.toISOString().split("T")[0]]: {
              selected: true,
              selectedColor: "#12B3A8",
              selectedTextColor: "white",
              disableTouch: true,
            },
          }}
        />
      </View>
    </View>
  );
};

export default DeparturedateScreen;
