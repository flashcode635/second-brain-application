import React from 'react';
import image from "../../assets/logo.png"
interface BrainIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const BrainIcon: React.FC<BrainIconProps> = () => {
  return (
    <>
        <img className='h-9 w-11 '
        // src='https://static.thenounproject.com/png/brain-icon-2023630-512.png'
        src={image}
        />
    </>
  );
};

export default BrainIcon;
