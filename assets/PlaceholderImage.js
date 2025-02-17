import React from 'react';
import { View, Image } from 'react-native';

const PlaceholderImage = ({ source, style, resizeMode }) => {
  if (source) {
    return (
      <Image
        source={source}
        style={style}
        resizeMode={resizeMode || 'cover'}
      />
    );
  }

  // Return a placeholder view when no image is provided
  return (
    <View
      style={[
        style,
        {
          backgroundColor: '#E1E1E1',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    />
  );
};

export default PlaceholderImage;
