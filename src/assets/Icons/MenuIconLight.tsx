import { SvgIcon, SvgIconProps } from '@mui/material'
import { FC } from 'react'

export const MenuIconLight: FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 6H21M3 12H21M3 18H21"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}
