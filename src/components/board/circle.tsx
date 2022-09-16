import { Property } from "csstype";
import { JSX } from "solid-js";

import "./square.css";

interface CircleProps {
  color: Property.Color;
  highlighted: boolean;
  filter?: string;
  radius: number;
  onClick?: JSX.EventHandlerUnion<SVGSVGElement, MouseEvent>;
}

export default function Circle(props: CircleProps) {
  const size = 256;

  return (
    <svg
      class="square"
      style={{
        cursor: props.onClick ? "pointer" : undefined,
      }}
      onClick={props.onClick}
      viewBox={`0 0 ${size} ${size}`}
      shape-rendering="geometricPrecision"
    >
      <circle
        filter={props.filter}
        cx={size / 2}
        cy={size / 2}
        r={props.radius * (size * 0.008)}
        stroke={!props.highlighted ? "black" : "DarkOrange"}
        stroke-width={2.5 * size * 0.006}
        fill={props.color}
      />
    </svg>
  );
}
