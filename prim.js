class Maze {
    constructor(cellSize, nColumns, nRows) {
        this.nColumns = nColumns
        this.nRows = nRows
        this.cells = []
        this.done = false

        for (let row = 0; row < this.nRows; row++) {
            for (let column = 0; column < this.nColumns; column++) {
                const cell = new Cell(cellSize, column, row)
                this.cells.push(cell)
            }
        }

        this.current = this.cells[floor((nRows / 2) * nColumns)]
        this.current.visited = true
        this._getNeighbours(this.current).forEach(x => this.frontier.add(x))
    }

    draw() {
        this.drawCells()

        this.current.visited = true
        this.frontier.delete(this.current)

        if (this.frontier.size === 0) {
            this.done = true
            this.current = null
            return
        }

        const i = randIndex(this.frontier.size)
        this.current = Array.from(this.frontier)[i]

        const neighbours = this._getNeighbours(this.current)
        const unvisited = neighbours.filter(x => x.visited)

        if (unvisited.length > 0) {
            const x = unvisited[randIndex(unvisited.length)]
            this._connect(this.current, x)
        }

        neighbours.filter(x => !x.visited).forEach(x => this.frontier.add(x))
    }

    _connect(a, b) {
        if (a.column > b.column) {
            a.connections.left = true
            b.connections.right = true
        } else if (a.column < b.column) {
            a.connections.right = true
            b.connections.left = true
        } else if (a.row > b.row) {
            a.connections.top = true
            b.connections.bottom = true
        } else {
            a.connections.bottom = true
            b.connections.top = true
        }
    }

    _getCellAt(column, row) {
        if (column < 0 || row < 0) {
            return null
        }

        if (column >= this.nColumns || row >= this.nRows) {
            return null
        }

        return this.cells[column + row * this.nColumns]
    }

    _getNeighbours(cell) {
        return [
            this._getCellAt(cell.column, cell.row - 1),
            this._getCellAt(cell.column + 1, cell.row),
            this._getCellAt(cell.column, cell.row + 1),
            this._getCellAt(cell.column - 1, cell.row),
        ].filter(x => x)
    }

    drawCells() {
        background(51)

        for (const cell of this.cells) {
            const s = cell.size

            stroke(255)

            if (!cell.connections.top) {
                line(cell.x, cell.y, cell.x + s, cell.y)
            }

            if (!cell.connections.right) {
                line(cell.x + s, cell.y, cell.x + s, cell.y + s)
            }

            if (!cell.connections.bottom) {
                line(cell.x + s, cell.y + s, cell.x, cell.y + s)
            }

            if (!cell.connections.left) {
                line(cell.x, cell.y + s, cell.x, cell.y)
            }

            if (this.frontier.has(cell)) {
                noStroke()
                fill(0, 0, 255, 100)
                rect(cell.x, cell.y, s, s)
            } else if (cell.visited) {
                noStroke()
                fill(255, 0, 255, 100)
                rect(cell.x, cell.y, s, s)
            }
        }
    }
}

let frontier = new Set()
let grid = null

function setup() {
    grid = createGrid()
    current = pickMiddle(grid)

    getNeighbours(grid, current).forEach(x => frontier.add(x))
}

function draw() {
    background(51)
    grid.cells.forEach(drawWalls)

    current.visited = true
    frontier.delete(current)

    if (frontier.size === 0) {
        noLoop()
        return
    }

    frontier.forEach(x => colorCell([0, 0, 255], x))
    current = pickRandom(Array.from(frontier))

    const neighbours = getNeighbours(grid, current)
    const chosen = pickRandom(neighbours.filter(x => x.visited))

    if (chosen) {
        connect(current, chosen)
    }

    neighbours.filter(x => !x.visited).forEach(x => frontier.add(x))
}
