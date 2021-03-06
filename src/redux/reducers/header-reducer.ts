import { NavDataType } from "../../types/global";



let initialState = {
    navData: [
        {id: 1, link: "/", content: "Home"},
        {id: 2, link: "/about_us/", content: "About us"},
        {id: 3, link: "/contact_us/", content: "Contact us"},
    ] as Array<NavDataType>
}

type InitialStateType = typeof initialState


const headerReducer = (state = initialState, action : any) : InitialStateType => {
    return state;
}

export default headerReducer;