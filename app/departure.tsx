import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { apiToken } from "../utils/api";

const DepartureScreen = () => {
  const [searchInput, setSearchInput] = useState("");
  const [autoCompleteResults, setAutoCompleteResults] = useState<any[]>([]);
  const [flightOfferData, setFlightOfferData] = useState<any>({
    originLocationCode: "",
  });
  const [prevSelectedDeparture, setPrevSelectedDeparture] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPrevSelectedCities = async () => {
    try {
      const cities = await AsyncStorage.getItem("departureCities");

      console.log("cities", cities);
      if (cities !== null) {
        setPrevSelectedDeparture(JSON.parse(cities));
      }
    } catch (error) {
      console.log("error in loadPrevSelectedCities", error);
    }
  };

  useEffect(() => {
    loadPrevSelectedCities();
  }, []);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: any;
    return function (...args: any) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const autoCompleteSearch = async (searchInput: string) => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${apiToken}`,
      };

      const url = `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${searchInput}`;
      const res = await axios.get(url, { headers });

      setAutoCompleteResults(res.data.data);
    } catch (error) {
      console.log("error in autoCompleteSearch", error);
    } finally {
      setLoading(false);
    }
  };

  const deboucedSearch = debounce((text: string) => {
    if (text.trim()) {
      autoCompleteSearch(text);
    } else {
      setAutoCompleteResults([]);
    }
  }, 1000);

  const handleInputChange = (text: string) => {
    setSearchInput(text);
    deboucedSearch(text);
  };

  const handleSelectAutoComplete = async (item: any) => {
    const updatedCities = [...prevSelectedDeparture];
    updatedCities.push({ city: item.name, iataCode: item.iataCode });

    await AsyncStorage.setItem(
      "departureCities",
      JSON.stringify(updatedCities)
    );

    setPrevSelectedDeparture(updatedCities);
    setFlightOfferData({
      ...flightOfferData,
      originLocationCode: item.iataCode,
    });
    setSearchInput(`${item.name} (${item.iataCode})`); //! set search input
    setAutoCompleteResults([]);
  };

  return (
    <View className="flex-1 items-center bg-[#F5F7FA]">
      <View className="w-full h-full">
        {/* Header */}
        <View className="flex justify-start border-orange-600 rounded-b-[20px] w-full bg-[#192034] relative pt-10 pb-7">
          <View>
            <View className="flex-row items-center justify-start gap-4 px-2">
              <Pressable
                onPress={() => router.back()}
                className="flex-row items-center justify-center gap-2 h-14 w-[20%] "
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
                  Select Departure
                </Text>
              </View>

              <View>
                <View>
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={30}
                    color="white"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Airport or city search */}
        <View className="w-full p-4 relative">
          <View className="flex-row justify-between items-center bg-white border border-[#808080] rounded-2xl h-14 overflow-hidden">
            <View className="w-full h-full justify-center">
              <TextInput
                placeholder="Search for airport or city"
                placeholderTextColor={"gray"}
                value={searchInput}
                onChangeText={handleInputChange}
                className="bg-transparent h-full text-gray-600 px-2 capitalize"
              />
            </View>
          </View>

          {/* Auto complete results */}
          {autoCompleteResults.length > 0 && (
            <View className="border border-[#808080] rounded-2xl shadow-sm mt-4">
              <FlatList
                data={autoCompleteResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    className="p-2 rounded-xl my-1"
                    onPress={() => handleSelectAutoComplete(item)}
                  >
                    <Text className="text-gray-500 capitalize">
                      {item.name} ({item.iataCode})
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          )}

          {/* Previous selected cities */}
          <View className="w-full">
            {prevSelectedDeparture.length > 0 && (
              <View className="mt-4 w-full">
                <Text className="text-lg font-bold">
                  Previous Selected Cities
                </Text>
                {prevSelectedDeparture.map((city, index) => (
                  <Pressable
                    key={index}
                    className="flex-row items-center border border-[#808080] rounded-lg p-2 m-2"
                    onPress={() => {
                      setFlightOfferData({
                        ...flightOfferData,
                        originLocationCode: city.iataCode,
                      });
                      setSearchInput(`${city.city} (${city.iataCode})`);
                    }}
                  >
                    <Text className="text-gray-500 capitalize">
                      {index + 1}. {city.city} {city.name} ({city.iataCode})
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default DepartureScreen;
