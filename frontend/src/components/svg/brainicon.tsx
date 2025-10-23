import React from 'react';

interface BrainIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const BrainIcon: React.FC<BrainIconProps> = () => {
  return (
    <>
        <img className='h-8 w-8 '
        // src='https://static.thenounproject.com/png/brain-icon-2023630-512.png'
        src="https://img.icons8.com/pastel_glyph/512w/7950F2/brain.png"
        />
    </>
  );
};

export default BrainIcon;
