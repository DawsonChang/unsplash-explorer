import './ImageList.css';
import React from 'react';
import ImageCard from './ImageCard';

const ImageList = props => {
  const images = props.images.map(image => {
    return <ImageCard key={image.id} image={image} />;
  });
  if (images.length > 0) {
    return <div className="image-list">{images}</div>;
  }
  return <div style={{ textAlign: "center"}}>Please enter something to start searching...</div>
};

export default ImageList;
