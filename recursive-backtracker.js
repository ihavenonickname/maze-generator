let maze = null
let current = null
let stack = []

const drawBacktrackingLine = () => {
    stroke(150)

    const center = cell => {
        return {
            x: cell.x + cell.size / 2,
            y: cell.y + cell.size / 2
        }
    }

    for (let i = 0; i < stack.length - 1; i++) {
        const a = center(stack[i])
        const b = center(stack[i + 1])
        line(a.x, a.y, b.x, b.y)
    }
}

function setup() {
    grid = createGrid()
    current = pickMiddle(grid)
}

function draw() {
    background(51)

    grid.cells.forEach(drawWalls)

    drawBacktrackingLine()
    current.visited = true

    const next = pickRandom(getNeighbours(grid, current).filter(x => !x.visited))

    if (next) {
        colorCell([0, 0, 255], current)
        next.visited = true
        stack.push(current)
        connect(current, next)
        current = next
    } else if (stack.length > 0) {
        colorCell([0, 0, 255], current)
        current = stack.pop()
    } else {
        current = null
        noLoop()
    }
}
