import s from "./NavItem.module.scss";
import React from "react";
import {NavLink} from "react-router-dom";

const NavItem = (props) =>{
    return (
        <NavLink to={props.link} onClick={props.onClick} className={s.link}>{props.content}</NavLink>
    )
}

export default NavItem;