import { splitProps } from "solid-js"
import { Colors } from "../../colorscheme"
import { IMultiplayerCore } from "../../logic/multiplayer"

interface PlayerTextProps {
  multiplayer: IMultiplayerCore
}

export default function PlayerText(props: PlayerTextProps) {
  const multiplayer = () => props.multiplayer

  return (
    <div class="center">
      <h2
        class="font-sans text-xl"
        style={{
          color:
            multiplayer().whosTurn() === 0 ? Colors.player1 : Colors.player2,
        }}
      >
        It is Player {multiplayer().whosTurn() + 1}'s turn
      </h2>
    </div>
  )
}
