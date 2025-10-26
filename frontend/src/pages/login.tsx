import Authentication from "../components/Auth";
import { SIGN_IN, SIGN_UP } from "../config";

export function SignInEP() {
    return(
        <Authentication Title="Sign In" endpoint={SIGN_IN} destination="/dashboard"/>
    )
}

export  function SignupEP() {
    return(
        <Authentication Title="Sign Up" endpoint={SIGN_UP} destination="/signin"/>
    )
}