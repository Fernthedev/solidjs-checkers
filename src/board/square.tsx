import {Property} from "csstype"
import { ParentProps } from "solid-js"

interface SquareProps extends ParentProps {
    color: Property.Color
}

export default function Square(props: SquareProps) {
    return (
        <div style={{
            "background-color": props.color,
            display: "flex",
            "text-align": "center"
        }} children={props.children} />
    )
}