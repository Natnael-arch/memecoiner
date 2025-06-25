import React from 'react'
import OutlineButton from './outline-button'
import './place-card.css'

interface PlaceCardProps {
  image: string;
  imageAlt?: string;
  city: string;
  description: string;
  creator?: string;
}

const PlaceCard = ({ image, imageAlt = 'image', city, description, creator }: PlaceCardProps) => {
  return (
    <div className="place-card-container1">
      <img
        alt={imageAlt}
        src={image}
        className="place-card-image"
      />
      <div className="place-card-container2">
        <span className="place-card-text1">{city}</span>
        <span className="place-card-text2">{description}</span>
        {creator && (
          <span className="place-card-text3" style={{ fontSize: '0.85em', color: '#888' }}>
            Creator: {creator}
          </span>
        )}
        <OutlineButton button1="Discover place" />
      </div>
    </div>
  )
}

PlaceCard.defaultProps = {
  image:
    'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1000',
  imageAlt: 'image',
  city: 'City Name',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
  creator: '',
}

export default PlaceCard
