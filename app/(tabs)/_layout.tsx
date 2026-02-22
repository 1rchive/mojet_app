import { Stack } from "expo-router";
import "../../global.css";
import { Redirect } from "expo-router";


export default function Layout() {
  return <Stack screenOptions={{ headerShown: false }}  />;
}
