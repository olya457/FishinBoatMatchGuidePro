import React from 'react';
import {enableScreens} from 'react-native-screens';
import {AppNavigator} from './src/navigation/AppNavigator';

enableScreens(true);

function App(): React.JSX.Element {
  return <AppNavigator />;
}

export default App;
