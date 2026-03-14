export default {
  expo: {
    name: "real-estate-app",
    slug: "real-estate-app",
    version: "1.0.0",

    extra: {
      HOST_URL: "http://127.0.0.1:8000",
      eas: {
        projectId: "42e3ad53-1eac-46b4-b653-1d152a77fc17"
    },
    },

    android: {
      package: "com.hannibal_777.realestateapp"
    },

    ios: {
      bundleIdentifier: "com.hannibal777.realestateapp"
    },

    plugins: [
      "expo-notifications"
    ]
  }
};