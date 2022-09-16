import {Property} from "csstype"
import { JSX, ParentProps } from "solid-js"

interface SquareProps extends ParentProps {
    color: Property.Color,
    onClick?: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>
    showClick: boolean
}

export default function Square(props: SquareProps) {
    return (
        <div
            onClick={props.onClick}
            style={{
                cursor: props.showClick ? "pointer" : undefined,
            "background-color": props.color,
            display: "flex",
            "text-align": "center"
        }} children={props.children} />
    )
}