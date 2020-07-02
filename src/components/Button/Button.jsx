import React from "react";
import s from './Button.module.scss'

const Button = (props) => {
    return (
        <a href={props.link} className={`${s.button}` + ' ' +`${s.intro}`}>{props.name}</a>
    )
}

export default Button;