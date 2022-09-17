import { Property } from "csstype"
import { JSX, ParentProps } from "solid-js"

import "./square.css"

interface SquareProps extends ParentProps {
  squareClass?: string
  onClick?: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>
}

export default function Square(props: SquareProps) {
  return (
    <div
      class={`square ${props.squareClass ?? ""}`}
      onClick={props.onClick}
      children={props.children}
    />
  )
}
