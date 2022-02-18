import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {AppBar, CssBaseline, Toolbar} from "@mui/material";
import {Head} from "next/document";
import "@fontsource/creepster";
import "@fontsource/zcool-qingke-huangyou";

const Header: React.FC = () => {
  const router = useRouter()

  return <>

    <CssBaseline />
    <div style={{ flexGrow: 1 }}>
      <AppBar sx={{
        backgroundColor: "white !important",
        boxShadow: "none !important",
        minWidth: '750px'
      }} position="fixed">
        <Toolbar style={{
          display: "flex",
          justifyContent: "space-between",
          padding: '0 10px',
          height: '34px',
          borderBottom: '1px solid lavender'
        }}>
          <svg style={{
            width: '80px',
            height: '60px',
            transition: 'all .23s ease-in-out',
            transform: 'scale(0.6)'
          }} width="63" height="51" viewBox="0 0 63 51" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30.6709 25.5458L7.66778 14.3928L7.66778 36.6989L30.6709 25.5458Z" fill="black" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.1"/>
          <path d="M54.5649 12.7478L32.1231 23.9829L31.9566 2.14033L54.5649 12.7478Z" fill="black" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.1"/>
          <path d="M54.5649 37.9707L32.1231 49.2058L31.9566 27.3633L54.5649 37.9707Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.2" style={{transformOrigin: 'center', transform: 'scale(0.97)', opacity: '0.6'}}/>
          <path d="M31.5919 25.6828L54.595 14.5297L54.595 36.8358L31.5919 25.6828Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.2" style={{transformOrigin: 'center', transform: 'scale(0.97)', opacity: '0.6'}}/>
          <path d="M7.69792 12.6108L30.1397 23.8459L30.3062 2.00337L7.69792 12.6108Z" fill="black" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.1"/>
          <path d="M7.69792 37.8338L30.1397 49.0689L30.3062 27.2263L7.69792 37.8338Z" fill="black" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.1"/>
        </svg>
          {/*<Image width={120} height={30} objectFit={"contain"} src='/assets/logo.png' />*/}
          <h2 style={{color: 'black', fontFamily:'ZCOOL QingKe HuangYou'}}>Pattern Maker</h2>
          <img alt={''} src='/assets/logo.png' style={{width: 120, height: 30, opacity: 0.0}} />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  </>;
}

export default Header
