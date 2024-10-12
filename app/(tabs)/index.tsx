import Header from "@/components/header";
import { apiBaseUrl, apiToken } from "@/utils/api";
import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ArrowPathIcon,
  ChevronDoubleRightIcon,
} from "react-native-heroicons/outline";
import { defineAnimation } from "react-native-reanimated";

// Components
// ==============================================================
// Search component
interface SearchFlightData {
  originCity: string;
  destinationCity: string;
  departureDate: string;
  seat: number;
}

export interface FlightOfferData {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: Date;
  returnDate: Date;
  adults: number;
  maxResults: number;
}

// trip option component
interface TripOptionsProps {
  pageNavigation: string;
  handleNavigationChange: (type: string) => void;
}
const TripOption: React.FC<TripOptionsProps> = ({
  pageNavigation,
  handleNavigationChange,
}) => (
  <View className="flex-row justify-between w-full px-4 py-2">
    <Pressable
      className="flex-row w-1/2"
      onPress={() => handleNavigationChange("One-Way")}
    >
      <View
        className={` w-full items-center flex-row space-x-2 pb-2 gap-1 ${
          pageNavigation === "One-Way"
            ? "border-b-4 border-[#12B3A8]"
            : "border-transparent"
        }`}
      >
        <ChevronDoubleRightIcon
          size={20}
          color={pageNavigation === "One-Way" ? "#12B3A8" : "#808080"}
          strokeWidth={pageNavigation === "One-Way" ? 3 : 2}
        />
        <Text
          className={`text-lg ${
            pageNavigation === "One-Way"
              ? "text-[#12B3A8] font-bold"
              : "text-[#808080] font-medium"
          }`}
        >
          One-Way
        </Text>
      </View>
    </Pressable>

    <Pressable
      className="flex-row w-1/2"
      onPress={() => handleNavigationChange("RoundTrip")}
    >
      <View
        className={` w-full items-center flex-row space-x-2 pb-2 gap-1 ${
          pageNavigation === "RoundTrip"
            ? "border-b-4 border-[#12B3A8]"
            : "border-transparent"
        }`}
      >
        <ArrowPathIcon
          size={20}
          color={pageNavigation === "RoundTrip" ? "#12B3A8" : "#808080"}
          strokeWidth={pageNavigation === "RoundTrip" ? 3 : 2}
        />
        <Text
          className={`text-lg ${
            pageNavigation === "RoundTrip"
              ? "text-[#12B3A8] font-bold"
              : "text-[#808080] font-medium"
          }`}
        >
          Round Trip
        </Text>
      </View>
    </Pressable>
  </View>
);

// ==============================================================
// Location component
interface LocationInputProps {
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onPress: () => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  icon,
  value,
  onPress,
}) => (
  <View className="m-4 border border-[#808080] rounded-2xl">
    <Pressable onPress={onPress}>
      <View className="flex-row justify-between items-center px-4 py-1">
        <View className="w-[15%] border-r-2 border-[#808080]">{icon}</View>

        <View className="w-[80%] py-3 ">
          {value ? (
            <Text className="bg-transparent font-bold">{value}</Text>
          ) : (
            <Text className="bg-transparent font-semibold">{placeholder}</Text>
          )}
        </View>
      </View>
    </Pressable>
  </View>
);

// Date Time component
interface DepartureDateProps {
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onPress: () => void;
}
const DepartureDate: React.FC<DepartureDateProps> = ({
  placeholder,
  icon,
  value,
  onPress,
}) => (
  <Pressable
    className="flex-row justify-center items-center m-4 border border-[#808080] rounded-2xl pl-4 py-4"
    onPress={onPress}
  >
    <View className="w-[15%] border-r-2 border-[#808080]">{icon}</View>

    <View className="w-[85%] px-3">
      <Text className="bg-transparent font-bold">{value || placeholder}</Text>
    </View>
  </Pressable>
);

export default function HomeScreen() {
  const [isPending, setPending] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [pageNavigation, setPageNavigation] = useState("One-Way");
  const [session, setSession] = useState<any>(null);
  const [flightOfferData, setFlightOfferData] = useState<FlightOfferData>({
    originLocationCode: "",
    destinationLocationCode: "",
    departureDate: new Date(),
    returnDate: new Date(),
    adults: 1,
    maxResults: 10,
  });

  const [searchFlightData, setSearchFlightData] = useState<SearchFlightData>({
    originCity: "",
    destinationCity: "",
    departureDate: "",
    seat: 1,
  });
  const [selectedDate, setSelectedDate] = useState<any>(new Date());

  const handleNavigationChange = (type: string) => {
    setPageNavigation(type);
  };

  //! fix date
  useEffect(() => {
    const loadSelectedDestination = async () => {
      try {
        const departureCities = await AsyncStorage.getItem("departureCities");
        const destinationCities = await AsyncStorage.getItem(
          "destinationCities"
        );

        const departureDate = await AsyncStorage.getItem("departureDate");

        if (departureCities !== null) {
          const departureCitiesArray = JSON.parse(departureCities);
          const lastAddedItem =
            departureCitiesArray[departureCitiesArray.length - 1];
          setSearchFlightData((prev) => ({
            ...prev,
            originCity: lastAddedItem.city,
          }));
          setFlightOfferData((prev) => ({
            ...prev,
            originLocationCode: lastAddedItem.iataCode,
          }));
        }

        if (destinationCities !== null) {
          const destinationCitiesArray = JSON.parse(destinationCities);
          const lastAddedItem =
            destinationCitiesArray[destinationCitiesArray.length - 1];
          setSearchFlightData((prev) => ({
            ...prev,
            destinationCity: lastAddedItem.city,
          }));
          setFlightOfferData((prev) => ({
            ...prev,
            destinationLocationCode: lastAddedItem.iataCode,
          }));
        }

        if (departureDate !== null) {
          setSelectedDate(departureDate);
          setSearchFlightData((prev) => ({
            ...prev,
            departureDate: departureDate,
          }));

          const date = new Date(departureDate);
          setFlightOfferData((prev) => ({
            ...prev,
            departureDate: departureDate,
          }));
        }
      } catch (error) {
        console.log("error in loadSelectedDestination", error);
      }
    };
    loadSelectedDestination();

    setRefreshData(false);
  }, [refreshData]);

  const handleBackFormPreviousScreen = () => {
    setRefreshData(true);
  };

  useFocusEffect(
    useCallback(() => {
      handleBackFormPreviousScreen();
    }, [session])
  );

  const constructSearchUrl = () => {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      maxResults,
    } = flightOfferData;

    const formattedDepartureDate = departureDate.replace(/"/g, "");
    if (
      !originLocationCode ||
      !destinationLocationCode ||
      !formattedDepartureDate ||
      !adults
    ) {
      Alert.alert("Error", "Please fill all the required fields");
    }

    return `${apiBaseUrl}?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${formattedDepartureDate}&adults=${adults}&max=${maxResults}`;
  };

  const handleParentSearch = async () => {
    const searchUrl = constructSearchUrl();
    setPending(true);
    try {
      const response = await axios.get(searchUrl, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });

      if (response.data) {
        setPending(false);
        await AsyncStorage.setItem(
          "searchFlightData",
          JSON.stringify(searchFlightData)
        );

        console.log("Flight tickets data: ", response.data);
        router.push({
          pathname: "/searchResult",
          params: {
            flightOfferData: JSON.stringify(response.data),
          },
        });
      }
    } catch (error) {
      console.log("Error fetvhing flight offers -in handleParentSearch", error);
      setPending(false);
      if (error.response && error.response.status === 401) {
        Alert.alert("API Key Expired", "Please refresh your access token", [
          { text: "Ok" },
        ]);
      } else {
        Alert.alert("Error", "An error occurred while fetching flight offers", [
          { text: "Ok" },
        ]);
      }
    }
  };
  return (
    <ScrollView>
      <View className="flex-1 items-center bg-[#F5F7FA]">
        <StatusBar style="light" />
        {isPending && (
          <View className="absolute z-50 h-full w-full justify-center items-center">
            <View className="bg-black bg-opacity-50 opacity-[0.5] h-full w-full justify-center items-center"></View>
            <View className="absolute">
              <ActivityIndicator size="large" color="#fff" />
            </View>
          </View>
        )}

        {/* Header */}
        <View className="h-64 mb-4 flex justify-start border-orange-600 rounded-b-[20px] w-full bg-[#192034] relative pt-10">
          <Header />
        </View>

        {/* Form Area */}
        <View className="w-full px-4 -mt-32 mx-4">
          <View className="bg-white rounded-3xl pt-2 pb-4 mb-4 shadow-lg shadow-slate-700">
            <View className="flex-row justify-between w-full px-4 py-2">
              <TripOption
                pageNavigation={pageNavigation}
                handleNavigationChange={handleNavigationChange}
              />
            </View>

            {/* Location Input */}
            {/* Departure */}
            <View>
              <LocationInput
                placeholder={
                  searchFlightData.originCity
                    ? searchFlightData.originCity
                    : "Departure City"
                }
                icon={
                  <FontAwesome5
                    name="plane-departure"
                    size={20}
                    color="#808080"
                  />
                }
                value={searchFlightData.originCity}
                onPress={() => router.push("/departure")}
              />
            </View>

            {/* Distination */}
            <View>
              <LocationInput
                placeholder={
                  searchFlightData.destinationCity
                    ? searchFlightData.destinationCity
                    : "Arrival City"
                }
                icon={
                  <FontAwesome5
                    name="plane-arrival"
                    size={20}
                    color="#808080"
                  />
                }
                value={searchFlightData.destinationCity}
                onPress={() => router.push("/destination")}
              />
            </View>

            {/* Date Input */}
            <View>
              <DepartureDate
                placeholder={
                  selectedDate && selectedDate.length > 0
                    ? selectedDate.replace(/^"|"$/g, "")
                    : "Departure Date"
                }
                icon={<FontAwesome name="calendar" size={20} color="#808080" />}
                value={searchFlightData.departureDate.replace(/^"|"$/g, "")}
                onPress={() => router.push("/departuredate")}
              />
            </View>

            {/* Seat Input */}
            <View className="m-4 border border-[#808080] rounded-2xl mx-4 py-3 justify-center flex-row items-center pl-4">
              <View className="w-[15%] border-r-2 border-[#808080]">
                <MaterialCommunityIcons
                  name="seat-passenger"
                  size={20}
                  color="#808080"
                />
              </View>

              <TextInput
                className="w-[85%] px-4 text-base font-semibold"
                placeholder="Seat"
                keyboardType="numeric"
                value={String(searchFlightData.seat)}
                onChangeText={(text) => {
                  const seatValue = parseInt(text, 10);
                  const validSeatValue = isNaN(seatValue) ? 0 : seatValue;
                  setSearchFlightData((prev) => ({
                    ...prev,
                    seat: validSeatValue,
                  }));

                  setFlightOfferData((prev) => ({
                    ...prev,
                    adults: validSeatValue,
                  }));
                }}
              />
            </View>

            {/* Search Button */}
            <View className="w-full px-4 py-2 justify-start">
              <Pressable
                className="bg-[#12B3A8] rounded-lg justify-center items-center py-3"
                onPress={handleParentSearch}
              >
                <Text className="text-white font-bold text-lg">Search</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
