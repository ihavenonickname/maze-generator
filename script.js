class Cell {
    constructor(size, column, row) {
        this.size = size
        this.column = column
        this.row = row
        this.walls = { top: true, right: true, bottom: true, left: true }
    }

    highlight() {
        noStroke()
        fill(0, 0, 255, 100)

        const s = this.size
        rect(this.column * s, this.row * s, s, s)
    }

    draw() {
        const x = this.column * this.size
        const y = this.row * this.size
        const s = this.size

        stroke(255)

        if (this.walls.top) {
            line(x, y, x + s, y)
        }

        if (this.walls.right) {
            line(x + s, y, x + s, y + s)
        }

        if (this.walls.bottom) {
            line(x + s, y + s, x, y + s)
        }

        if (this.walls.left) {
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

        const next = this._getRandomNeighbour(this.current)

        if (next) {
            next.visited = true
            this.stack.push(this.current)
            this._removeWalls(this.current, next)
            this.current = next
        } else if (this.stack.length > 0) {
            this.current = this.stack.pop()
        }
    }

    _removeWalls(a, b) {
        const x = a.column - b.column

        if (x === 1) {
            a.walls.left = false
            b.walls.right = false
        } else if (x === -1) {
            a.walls.right = false
            b.walls.left = false
        }

        const y = a.row - b.row

        if (y === 1) {
            a.walls.top = false
            b.walls.bottom = false
        } else if (y === -1) {
            a.walls.bottom = false
            b.walls.top = false
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

    _getRandomNeighbour(cell) {
        const neighbours = []

        const top = this._getCellAt(cell.column, cell.row - 1)
        const right = this._getCellAt(cell.column + 1, cell.row)
        const bottom = this._getCellAt(cell.column, cell.row + 1)
        const left = this._getCellAt(cell.column - 1, cell.row)

        if (top && !top.visited) {
            neighbours.push(top)
        }

        if (right && !right.visited) {
            neighbours.push(right)
        }

        if (bottom && !bottom.visited) {
            neighbours.push(bottom)
        }

        if (left && !left.visited) {
            neighbours.push(left)
        }

        if (neighbours.length === 0) {
            return null
        }

        const i = floor(random(0, neighbours.length))
        return neighbours[i]
    }
}

var maze = null

function setup() {
    const width = document.documentElement.clientWidth - 30
    const height = window.innerHeight - 40

    const cellSize = 60
    const nColumns = floor(width / cellSize)
    const nRows = floor(height / cellSize)

    createCanvas(nColumns * cellSize, nRows * cellSize)
    frameRate(15)

    maze = new Maze(cellSize, nColumns, nRows)
}

function draw() {
    maze.draw()
}





