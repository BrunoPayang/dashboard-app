import React from 'react';
import { Box } from '@mui/material';
import {
  School,
  LocalLibrary,
  Science,
  SportsBaseball,
  DirectionsBus,
  Restaurant,
  Checkroom,
  Assignment,
  AttachMoney,
} from '@mui/icons-material';
import type { PaymentType } from '../../../types/payment';

interface PaymentTypeIconProps {
  type: PaymentType;
  size?: 'small' | 'medium' | 'large';
}

const PaymentTypeIcon: React.FC<PaymentTypeIconProps> = ({ 
  type, 
  size = 'small' 
}) => {
  const getIcon = (type: PaymentType) => {
    const iconProps = { 
      fontSize: size === 'small' ? 'small' : size === 'medium' ? 'medium' : 'large' 
    } as const;

    switch (type) {
      case 'tuition':
        return <School {...iconProps} />;
      case 'library':
        return <LocalLibrary {...iconProps} />;
      case 'laboratory':
        return <Science {...iconProps} />;
      case 'sports':
        return <SportsBaseball {...iconProps} />;
      case 'transport':
        return <DirectionsBus {...iconProps} />;
      case 'meal':
        return <Restaurant {...iconProps} />;
      case 'uniform':
        return <Checkroom {...iconProps} />;
      case 'examination':
        return <Assignment {...iconProps} />;
      default:
        return <AttachMoney {...iconProps} />;
    }
  };

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      color="primary.main"
    >
      {getIcon(type)}
    </Box>
  );
};

export default PaymentTypeIcon;



