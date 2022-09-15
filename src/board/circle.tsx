import { Property } from "csstype"

interface CircleProps {
    color: Property.Color,
    filter?: string
    radius: number
}

export default function Circle(props: CircleProps) {
    const size = 256

    return (
        <svg viewBox={`0 0 ${size} ${size}`} shape-rendering="geometricPrecision">
            <circle
                filter={props.filter}
                cx={size / 2} cy={size / 2}
                
                r={props.radius * (size * 0.008)}

                stroke="black" stroke-width={2.5 * size * 0.006}
                fill={props.color} />
        </svg>
    )
}