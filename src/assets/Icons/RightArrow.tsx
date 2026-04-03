import React, { FC } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const RightArrow:FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" 
    {...props}>
<path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" stroke='white' strokeWidth={0}/>
    </SvgIcon>
  );
};


