import Constants from "expo-constants";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const apiUrl = Constants.expoConfig?.extra?.LARAVEL_API_URL;
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, message, messageType } = useAuth();
  //const { user, loading } = useAuth();
  const router = useRouter();

  /*

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(admin)");
    }
  }, [user, loading, router]);
  */
  const onSubmit = async () => {
  const success = await handleLogin(email, password);
  if (success) {
    router.replace("/(admin)");
  }
};
 


  return (
    <View className="flex-1 bg-yellow-50 px-6 py-10">
      {/* Header */}
      <View className="mb-8 items-center">
        <Text className="text-2xl font-bold text-gray-800 text-center">
          Sign In  {apiUrl}
        </Text>

      </View>

      {/* Form */}
      <View className="space-y-6">
        {/* Email */}
        <View className = 'mb-4'>
          <Text className="text-sm text-gray-700 mb-1">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-800"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}

        <View className="relative">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-800 pr-10"
            secureTextEntry={!showPassword}
          />
          <Pressable
            className="absolute right-3 top-2"
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={22} color="#4b5563" />
            ) : (
              <Eye size={22} color="#4b5563" />
            )}
          </Pressable>
        </View>

        <Pressable
          className="bg-blue-600 py-3 rounded-md items-center mt-10"
          onPress={onSubmit}
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </Pressable>
      </View>

      {message !== "" && (
        <View
          className={`px-4 py-2 rounded-md mb-4 ${
            messageType === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <Text
            className={`text-center font-medium ${
              messageType === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </Text>
        </View>
      )}


    </View>
  );
}
