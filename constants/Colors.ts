/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const primaryColor = '#38b000'; // Green for the fairway
const secondaryColor = '#ffd700'; // Yellow for sand traps
const accentColor = '#000080'; // Blue for water hazards

export const Colors = {
  light: {
    text: '#333333', // Darker text for better readability on light background
    background: '#f2f2f2', // Light gray background
    tint: primaryColor,
    icon: '#666666', // Muted gray for icons
    tabIconDefault: '#999999', // Lighter gray for default tab icons
    tabIconSelected: primaryColor, // Green for selected tab icons (matches primary color)
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
  },
  dark: {
    text: '#ffffff', // White text for better readability on dark background
    background: '#222222', // Dark gray background
    tint: accentColor, // Blue for tint (matches accent color)
    icon: '#cccccc', // Lighter gray for icons
    tabIconDefault: '#cccccc', // Same gray for default tab icons
    tabIconSelected: accentColor, // Blue for selected tab icons
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
  },
};
