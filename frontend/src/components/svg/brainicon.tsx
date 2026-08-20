import React from 'react';
// import image from "../../assets/logo.png"
import img2 from"../../assets/image.png"
interface BrainIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const BrainIcon: React.FC<BrainIconProps> = () => {
  return (
    <>
        <img className='h-8 w-9 rounded-xl '
        // src='https://static.thenounproject.com/png/brain-icon-2023630-512.png'
        src={img2}
        />
    </>
  );
};

export default BrainIcon;
