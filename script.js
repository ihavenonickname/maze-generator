class Cell {
    constructor(size, column, row) {
        this.size = size
        this.column = column
        this.row = row
        this.connections = {}
    }

    highlight() {
        const s = this.size

        noStroke()
        fill(0, 0, 255, 100)
        rect(this.column * s, this.row * s, s, s)
    }

    draw() {
        const x = this.column * this.size
        const y = this.row * this.size
        const s = this.size

        stroke(255)

        if (!this.connections.top) {
            line(x, y, x + s, y)
        }

        if (!this.connections.right) {
            line(x + s, y, x + s, y + s)
        }

        if (!this.connections.bottom) {
            line(x + s, y + s, x, y + s)
        }

        if (!this.connections.left) {
            line(x, y + s, x, y)
        }

        if (this.visited) {
            noStroke()
            fill(255, 0, 255, 100)
            rect(x, y, s, s)
        }
    }
}

class Maze {
    constructor(cellSize, nColumns, nRows) {
        this.nColumns = nColumns
        this.nRows = nRows
        this.cells = []
        this.stack = []
        this.done = false

        for (let row = 0; row < this.nRows; row++) {
            for (let column = 0; column < this.nColumns; column++) {
                this.cells.push(new Cell(cellSize, column, row))
            }
        }

        this.current = this.cells[0]
    }

    drawBacktrackingLine() {
        stroke(150)

        const center = cell => {
            return {
                x: cell.column * cell.size + cell.size / 2,
                y: cell.row * cell.size + cell.size / 2
            }
        }

        for (let i = 0; i < this.stack.length - 1; i++) {
            const a = center(this.stack[i])
            const b = center(this.stack[i + 1])
            line(a.x, a.y, b.x, b.y)
        }
    }

    draw() {
        background(51)

        for (const cell of this.cells) {
            cell.draw()
        }

        this.drawBacktrackingLine()
        this.current.visited = true
        this.current.highlight()

        const next = this._chooseUnvisitedNeighbour(this.current)

        if (next) {
            next.visited = true
            this.stack.push(this.current)
            this._connect(this.current, next)
            this.current = next
        } else if (this.stack.length > 0) {
            this.current = this.stack.pop()
        } else {
            this.done = true
        }
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

    _chooseUnvisitedNeighbour(cell) {
        const neighbours = [
            this._getCellAt(cell.column, cell.row - 1),
            this._getCellAt(cell.column + 1, cell.row),
            this._getCellAt(cell.column, cell.row + 1),
            this._getCellAt(cell.column - 1, cell.row)
        ].filter(x => x !== null && !x.visited)

        return neighbours.length > 0
            ? neighbours[floor(random(0, neighbours.length))]
            : null
    }
}

var maze = null

function setup() {
    const cellSize = 50
    const width = document.documentElement.clientWidth - 30
    const height = window.innerHeight - 40
    const nColumns = floor(width / cellSize)
    const nRows = floor(height / cellSize)

    createCanvas(nColumns * cellSize, nRows * cellSize)
    frameRate(11)

    maze = new Maze(cellSize, nColumns, nRows)
}

function draw() {
    maze.draw()

    if (maze.done) {
        noLoop()
    }
}
