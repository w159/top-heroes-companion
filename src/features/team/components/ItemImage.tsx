import React from 'react';

const getWikiImageUrl = (name: string) =>
  `https://topheroes1.fandom.com/wiki/Special:FilePath/${name.replace(/\s+/g, '_')}.png`;

const getPlaceholderImage = (name: string) =>
  `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&size=128&color=fff`;

interface ItemImageProps {
  name: string;
  className: string;
}

const ItemImage: React.FC<ItemImageProps> = ({ name, className }) => (
  <img
    src={getWikiImageUrl(name)}
    alt={name}
    className={`${className} object-cover`}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.src = getPlaceholderImage(name);
    }}
  />
);

export default ItemImage;
