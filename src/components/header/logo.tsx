import React from "react";
import logo from "@/images/logo.png";
import Image from "next/image";

const Logo = React.memo(() => {
  return (
    <Image 
      src={logo} 
      alt="Logo" 
      width={24} 
      height={24} 
      className="relative -top-0.5" 
      priority 
      loading="eager"
    />
  );
});

Logo.displayName = 'Logo';

export default Logo;