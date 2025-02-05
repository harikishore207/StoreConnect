import React from 'react';
import { Image } from 'react-native';

// Use adaptive-icon.png which we know exists and works
const DEFAULT_IMAGE = require('../../assets/adaptive-icon.png');

const PlaceholderImage = ({ source, style, ...props }) => {
  // If source is a number (from require), use it directly
  const imageSource = typeof source === 'number' ? source :
    // If it's an object with uri, validate the uri
    (source?.uri && typeof source.uri === 'string' && source.uri.length > 0) ? source :
    // Otherwise use default image
    DEFAULT_IMAGE;

  return (
    <Image
      source={imageSource}
      style={[{ backgroundColor: '#f0f0f0' }, style]}
      {...props}
      onError={() => {
        // Only handle errors for remote URLs, local assets shouldn't error
        if (source?.uri) {
          props.source = DEFAULT_IMAGE;
        }
      }}
    />
  );
};

export default PlaceholderImage;
