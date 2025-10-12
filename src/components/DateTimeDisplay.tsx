import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { AccessTime as TimeIcon } from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from 'react-i18next';

const DateTimeDisplay: React.FC = () => {
  const { settings } = useSettings();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date, timeZone: string) => {
    // Jednostavan fallback pristup koji će raditi u svim browserima
    try {
      // Pokušaj sa Intl API
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };

      // Mapa jezika za locale
      const localeMap: { [key: string]: string } = {
        'sr': 'sr-RS',
        'en': 'en-US',
        'bg': 'bg-BG',
        'uk': 'uk-UA'
      };

      const locale = localeMap[i18n.language] || 'sr-RS';
      
      // Koristi toLocaleString umesto direktno Intl.DateTimeFormatter
      return date.toLocaleString(locale, options);
    } catch (error) {
      // Fallback za stare browsere ili ako Intl ne radi
      const formatTime = (num: number) => num.toString().padStart(2, '0');
      
      const year = date.getFullYear();
      const month = formatTime(date.getMonth() + 1);
      const day = formatTime(date.getDate());
      const hours = formatTime(date.getHours());
      const minutes = formatTime(date.getMinutes());
      const seconds = formatTime(date.getSeconds());
      
      return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }
  };

  const getTimeZoneName = (timeZone: string) => {
    const timeZoneNames: { [key: string]: string } = {
      'Europe/Belgrade': t('timezones.belgrade'),
      'Europe/London': t('timezones.london'),
      'Europe/Sofia': t('timezones.sofia'),
      'Europe/Kiev': t('timezones.kiev')
    };
    
    return timeZoneNames[timeZone] || timeZone;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // ✅ CENTRIRANJE
        gap: 1.5,
        px: 3,
        py: 1.5,
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        backdropFilter: 'blur(12px)',
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
        minWidth: 320,
        maxWidth: 400,
        mx: 'auto', // ✅ DODATNO CENTRIRANJE
      }}
    >
      <TimeIcon 
        sx={{ 
          color: theme.palette.primary.main,
          fontSize: '1.2rem'
        }} 
      />
      <Box sx={{ textAlign: 'center', flex: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            lineHeight: 1.2,
            fontSize: '0.95rem'
          }}
        >
          {formatDateTime(currentTime, settings.timeZone)}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
            fontWeight: 500
          }}
        >
          {getTimeZoneName(settings.timeZone)}
        </Typography>
      </Box>
    </Box>
  );
};

export default DateTimeDisplay;