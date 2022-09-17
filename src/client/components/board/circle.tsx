import { Property } from "csstype";
import { JSX, Show } from "solid-js";

interface CircleProps {
  color: Property.Color;
  queen: boolean;
  highlighted: boolean;
  radius: number;
  onClick?: JSX.EventHandlerUnion<SVGSVGElement, MouseEvent>;
}

export default function Circle(props: CircleProps) {
  const size = 256;

  const adjustedRadius = props.radius * (size * 0.008);
  const adjustedStroke = 2.5 * size * 0.006;

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
        cx={size / 2}
        cy={size / 2}
        r={adjustedRadius}
        stroke={!props.highlighted ? "black" : "DarkOrange"}
        stroke-width={adjustedStroke}
        fill={props.color}
      >

      </circle>
      <Show when={props.queen}>
        <circle
          filter={"blur(5) invert(0.8)"}
          cx={size / 2}
          cy={size / 2}
          r={adjustedRadius * 0.7}
          fill={"rgba(255, 255, 255, 0.8)"}

        />
      </Show>
    </svg>
  );
}
