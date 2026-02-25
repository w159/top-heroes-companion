import { useState, useEffect, useMemo } from 'react';

interface UseHeroImageOptions {
  heroId: string;
  heroName: string;
  primaryImage?: string;
}

export function useHeroImage({ heroId, heroName, primaryImage }: UseHeroImageOptions) {
  // Build the fallback chain
  const formattedSlug = (heroId || heroName).toLowerCase().replace(/\s+/g, '-');
  const topHeroesInfoUrl = `https://topheroes.info/assets/img/hero/avatars/${formattedSlug}.webp`;
  const topHeroesAltUrl = `https://topheroes.info/assets/heroes/${formattedSlug}.webp`;
  const wikiImageUrl = `https://topheroes1.fandom.com/wiki/Special:FilePath/${heroName.replace(/\s+/g, '_')}.png`;
  const placeholderImage = `https://ui-avatars.com/api/?name=${heroName.replace(/\s+/g, '+')}&background=1f2937&color=fff&size=256`;

  const imageSources = useMemo(() => {
    const sources = [primaryImage, topHeroesInfoUrl, topHeroesAltUrl, wikiImageUrl, placeholderImage]
      .filter((src): src is string => Boolean(src));
    return sources.filter((src, index) => sources.indexOf(src) === index);
  }, [primaryImage, topHeroesInfoUrl, topHeroesAltUrl, wikiImageUrl, placeholderImage]);

  const [imgSrc, setImgSrc] = useState(imageSources[0]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setImgSrc(imageSources[0]);
    setAttempt(0);
  }, [heroId, imageSources]);

  const handleError = () => {
    const nextAttempt = attempt + 1;
    if (nextAttempt < imageSources.length) {
      setImgSrc(imageSources[nextAttempt]);
      setAttempt(nextAttempt);
    }
  };

  return { imgSrc, handleError };
}
