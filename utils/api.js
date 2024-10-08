import axios from "axios";

export const apiToken = "qBrXd9JQr2MGjxul5OYqxJ19aGVm";
export const apiBaseUrl =
  "https://test.api.amadeus.com/v2/shopping/flight-offers";

const clientId = "ZTGrfYUKh78eajvFKcZAY4ekmwsTErvd";
const clientSecret = "zavx1O7a8AwxudHY";

let newapiToken = "";

export const getNewAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    newapiToken = response.data.access_token;
    console.log("newapiToken", newapiToken);
  } catch (error) {
    console.log("error in getNewAccessToken", error);
  }
};

getNewAccessToken();
