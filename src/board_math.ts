export function* availableCircleSpots(width: number, height: number) {
    // I am too lazy to find a proper algorithm/formula for this
    for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {

            const white = row % 2 === column % 2
            if (!white) {
                yield [column, row]
            }
        }
    }
}