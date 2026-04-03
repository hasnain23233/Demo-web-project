import { TypographyOptions } from '@mui/material/styles/createTypography'

const typography: TypographyOptions = {
  fontFamily: ['Montserrat', 'sans-serif'].join(','),
  h2:{
   
    fontSize:'32px',
    "@media (min-width:960px)": { 
      fontSize: "52px", 
    },
    "@media (min-width:1440px)": { 
      fontSize: "60px", 
    },

  },
  h3: {
    fontWeight:'bold',
    fontSize: "24px", 
    "@media (min-width:960px)": { 
      fontSize: "40px", 
    },
  },
  body2:{
    fontSize: "13px", 
    "@media (min-width:960px)": { 
      fontSize: "0.875rem", 
    },
    "@media (min-width:1440px)": {
      fontSize:'20px'
    }
  },
  button:{
    fontSize:'13px',
    "@media (min-width:1440px)": {
      fontSize:'18px'
    }
  },
  
}

export default typography
