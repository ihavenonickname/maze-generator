const drawWalls = cell => {
    stroke(255)

    const s = cell.size

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
}

const colorCell = (rgb, cell) => {
    noStroke()
    fill(...rgb, 100)
    rect(cell.x, cell.y, cell.size, cell.size)
}

const createCells = (cellSize, nColumns, nRows) => {
    const cells = []

    for (let row = 0; row < nRows; row++) {
        for (let column = 0; column < nColumns; column++) {
            cells.push({
                column,
                row,
                visited: false,
                size: cellSize,
                connections: {},
                x: column * cellSize,
                y: row * cellSize
            })
        }
    }

    return cells
}

const connect = (a, b) => {
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

const getCell = (grid, column, row) => {
    if (column < 0 || row < 0) {
        return null
    }

    if (column >= grid.nColumns || row >= grid.nRows) {
        return null
    }

    return grid.cells[column + row * grid.nColumns]
}

const getNeighbours = (grid, cell) => {
    return [
        getCell(grid, cell.column, cell.row - 1),
        getCell(grid, cell.column + 1, cell.row),
        getCell(grid, cell.column, cell.row + 1),
        getCell(grid, cell.column - 1, cell.row),
    ].filter(x => x !== null)
}

const pickRandom = arr => {
    if (arr.length === 0) {
        return null
    }

    return arr[floor(random(0, arr.length))]
}

const pickMiddle = grid => {
    return getCell(grid, floor(grid.nColumns / 2), floor(grid.nRows / 2))
}

const createGrid = () => {
    const url = new URL(window.location.href)
    const cellSize = parseInt(url.searchParams.get('cell-size'))
    const width = document.documentElement.clientWidth - 30
    const height = window.innerHeight - 40
    const nColumns = floor(width / cellSize)
    const nRows = floor(height / cellSize)

    createCanvas(nColumns * cellSize, nRows * cellSize)

    return { cells: createCells(cellSize, nColumns, nRows), nRows, nColumns }
}
