
// import image from "../../assets/logo.png"
import img2 from"@assets/image.png"
interface BrainIconProps {
  size: "small" | "medium" | "large";
}
const sizes={
  small: 'h-8 w-9',
  medium: 'h-12 w-14',
  large: 'h-16 w-16',
}
const BrainIcon = ({size}:BrainIconProps) => {
  return (
    <>
        <img className={`${sizes[size]} rounded-xl `}
        // src='https://static.thenounproject.com/png/brain-icon-2023630-512.png'
        src={img2}
        />
    </>
  );
};

export default BrainIcon;
