import React from 'react';
import { SafeAreaView, Text } from 'react-native';  // Add missing import
import CommentSection from './CommentSection';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CommentSection />
    </SafeAreaView>
  );
};

export default App;
