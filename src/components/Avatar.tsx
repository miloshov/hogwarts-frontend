import React from 'react';
import { Avatar as MuiAvatar, SxProps, Theme } from '@mui/material';
import { Zaposleni, Pol } from '../types/types';

interface AvatarProps {
  zaposleni?: Zaposleni | null;
  size?: number;
  sx?: SxProps<Theme>;
  alt?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  zaposleni, 
  size = 40, 
  sx = {}, 
  alt 
}) => {
  const getAvatarSrc = (): string => {
    if (zaposleni?.profileImageUrl) {
      return zaposleni.profileImageUrl;
    }
    
    // Placeholder na osnovu pola
    if (zaposleni?.pol === Pol.Zenski) {
      return '/assets/images/default-female.png';
    }
    
    return '/assets/images/default-male.png';
  };

  const getInitials = (): string => {
    if (!zaposleni) return '?';
    
    const firstInitial = zaposleni.ime?.charAt(0)?.toUpperCase() || '';
    const lastInitial = zaposleni.prezime?.charAt(0)?.toUpperCase() || '';
    
    return `${firstInitial}${lastInitial}`;
  };

  const avatarAlt = alt || zaposleni?.punoIme || 'Avatar';

  return (
    <MuiAvatar
      src={getAvatarSrc()}
      alt={avatarAlt}
      sx={{
        width: size,
        height: size,
        ...sx,
      }}
    >
      {getInitials()}
    </MuiAvatar>
  );
};

export default Avatar;
