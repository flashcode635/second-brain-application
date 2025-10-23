import BrainIcon from "../components/svg/brainicon";

export default function SidebarComponent() {
    return (
        <div className="h-[100vh] w-[240px] bg-yellow-50 mr-5 p-2 fixed ">
            <div className="flex items-center gap-2.5">
                    <BrainIcon/>

                <span className="text-xl"><b> Second Brain App </b>  </span>
                </div>
            <h1>SidebarComponent</h1>
        </div>
    )
}