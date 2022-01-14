import { NavigationContainer } from "@react-navigation/native";
import { LogBox} from "react-native";
import { AuthProvider } from "./hooks/useAuth";
import StackNavigator from "./StackNavigator";
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>  
      {/* StackNavigator atrodas iekš AuthProvider, lai varētu tam padot autorizācijas datus */}
        <StackNavigator /> 
      </AuthProvider>
    </NavigationContainer>
  );
}
