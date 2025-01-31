import React from "react";
import { Button } from "./Button";

export const Header = (props) => {
    return (
        <header className="header">
            <h1>{props.title}</h1>
            <Button
                bgcolor={props.showAdd ? "red" : "green"}
                text={props.showAdd ? "Close" : "Add"}
                onClick={() => {props.onAdd();}}>
            </Button>
        </header>
    );
};
