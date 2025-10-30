import { useNavigate } from "react-router-dom";


// Navigation component to handle button and navigation
export const NavigationButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      className="bg-green-700 text-amber-50 px-4 py-2 rounded" 
      onClick={() => {
   
        navigate("/signup");
      }}
    >
      sign Up
    </button>
  );
};
export function HomePage(){
    return(
        <>    
         <NavigationButton />
          </>
    )
}