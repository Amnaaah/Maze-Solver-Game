class Cell extends Node 
{
    constructor(type) 
    {
        super(type);
        this.value = type;
        this.row = null;
        this.column = null;
        this.visited = false;
    }
    
    setPos(row, col) 
    {
        this.row = row;
        this.column = col;
    }
    
    getColor() 
    {
        if (this.value === "#") return "#000000";
        if (this.value === "S") return "#00ff88";
        if (this.value === "E") return "#ff0066";
        if (this.value === "Player") return "#ffcc00";
        if (this.value === "P") return "#00d4ff";
        if (this.value === "T") return "#9933ff";
        return "#1a1a2e";
    }
}

class Maze 
{
    constructor() 
    {
        this.contents = [];
        this.start = null;
        this.end = null;
        this.playerPos = null;
    }
    
    createSimpleMaze(size, level) 
    {
        this.contents = [];              
        this.playerTrail = [];
        
        let seed = (level + 1) * 54321;
        let seededRandom = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
        
        for (let i = 0; i < size; i) 
        {
            let row = [];
            for (let j = 0; j < size; j++) 
            {
                let cell = new Cell("#");
                cell.setPos(i, j);
                row.push(cell);
            }
            this.contents.push(row);
        }
        
        let stack = [];
        let startRow = 1, startCol = 1;
        this.contents[startRow][startCol].value = " ";
        this.contents[startRow][startCol].visited = true;
        stack.push({row: startRow, col: startCol});
        
        while (stack.length > 0) 
        {
            let current = stack[stack.length - 1];
            let neighbors = [];
            
            let directions = [
                {dr: -2, dc: 0, wr: -1, wc: 0},
                {dr: 2, dc: 0, wr: 1, wc: 0},
                {dr: 0, dc: -2, wr: 0, wc: -1},
                {dr: 0, dc: 2, wr: 0, wc: 1}
            ];
            
            for (let dir of directions) 
            {
                let newRow = current.row + dir.dr;
                let newCol = current.col + dir.dc;
                
                if (newRow > 0 && newRow < size - 1 &&
                    newCol > 0 && newCol < size - 1 &&
                    !this.contents[newRow][newCol].visited) 
                {
                    neighbors.push({
                        row: newRow,
                        col: newCol, 
                        wallRow: current.row + dir.wr,
                        wallCol: current.col + dir.wc
                    });
                }
            }
            
            if (neighbors.length > 0) 
            {
                let next = neighbors[Math.floor(seededRandom() * neighbors.length)];
                
                this.contents[next.wallRow][next.wallCol].value = " ";
                this.contents[next.row][next.col].value = " ";
                this.contents[next.row][next.col].visited = true;
                
                stack.push({row: next.row, col: next.col});
            }
            else 
            {
                stack.pop();
            }
        }
        
        if (size > 5) 
            {
            if (this.contents[1][3]) {
                this.contents[1][2].value = " ";
                this.contents[1][3].value = " ";
            }
            if (this.contents[3][1]) {
                this.contents[2][1].value = " ";
                this.contents[3][1].value = " ";
            }
            if (size > 7 && this.contents[3][3]) {
                if (seededRandom() > 0.5) {
                    this.contents[2][2].value = " ";
                    this.contents[3][3].value = " ";
                }
            }
        }
        
        let loopCount = Math.floor(size / 8);
        for (let i = 0; i < loopCount; i++) {
            // pick a random wall somewhere
            let row = Math.floor(seededRandom() * (size - 4)) + 2;
            let col = Math.floor(seededRandom() * (size - 4)) + 2;
            
            if (this.contents[row][col] && this.contents[row][col].value === "#") {
                // count how many paths are next to this wall
                let adjacentPaths = 0;
                if (this.contents[row-1] && this.contents[row-1][col].value === " ") adjacentPaths++;  // up
                if (this.contents[row+1] && this.contents[row+1][col].value === " ") adjacentPaths++;  // down
                if (this.contents[row][col-1] && this.contents[row][col-1].value === " ") adjacentPaths++;  // left
                if (this.contents[row][col+1] && this.contents[row][col+1].value === " ") adjacentPaths++;  // right
                
                // if breaking this wall connects 2+ paths, do it
                if (adjacentPaths >= 2) {
                    this.contents[row][col].value = " ";  // boom, wall gone
                }
            }
        }
        
        // set where you start and where you need to get to
        this.start = this.contents[1][1];              // top left
        this.start.value = "S";                        // mark it S
        this.end = this.contents[size - 2][size - 2];  // bottom right
        this.end.value = "E";                          // mark it E
    }
    

    createHiddenPath(size, seededRandom) 
    {
        let path = [];
        let row = 1, col = 1;
        
        path.push({row: row, col: col});
        
        while (row < size - 2 || col < size - 2) {
            this.contents[row][col].value = " ";
            this.contents[row][col].isPartOfSolution = true;
            
            let moved = false;
            let attempts = 0;
            
            while (!moved && attempts < 10) 
                {
                let directions = [];
                if (row < size - 2) directions.push('down');
                if (col < size - 2) directions.push('right');
                if (row > 1) directions.push('up');
                if (col > 1) directions.push('left');
                
                // Pick random direction
                let dir = directions[Math.floor(seededRandom() * directions.length)];
                
                let newRow = row, newCol = col;
                
                if (dir === 'down') newRow += 2;
                else if (dir === 'up') newRow -= 2;
                else if (dir === 'right') newCol += 2;
                else if (dir === 'left') newCol -= 2;
                
                // Check if move is valid
                if (newRow >= 1 && newRow < size - 1 && newCol >= 1 && newCol < size - 1) {
                    // Open the wall between
                    if (dir === 'down') this.contents[row + 1][col].value = " ";
                    else if (dir === 'up') this.contents[row - 1][col].value = " ";
                    else if (dir === 'right') this.contents[row][col + 1].value = " ";
                    else if (dir === 'left') this.contents[row][col - 1].value = " ";
                    
                    if (dir === 'down') this.contents[row + 1][col].isPartOfSolution = true;
                    else if (dir === 'up') this.contents[row - 1][col].isPartOfSolution = true;
                    else if (dir === 'right') this.contents[row][col + 1].isPartOfSolution = true;
                    else if (dir === 'left') this.contents[row][col - 1].isPartOfSolution = true;
                    
                    row = newRow;
                    col = newCol;
                    moved = true;
                    path.push({row: row, col: col});
                }
                attempts++;
            }
            
            if (!moved) 
            {
                if (row < size - 2) 
                {
                    this.contents[row + 1][col].value = " ";
                    this.contents[row + 1][col].isPartOfSolution = true;
                    row += 2;
                }
                else if (col < size - 2) 
                {
                    this.contents[row][col + 1].value = " ";
                    this.contents[row][col + 1].isPartOfSolution = true;
                    col += 2;
                } else {
                    break;
                }
            }
        }
        
        this.contents[size - 2][size - 2].value = " ";
        this.contents[size - 2][size - 2].isPartOfSolution = true;
    }
    
    createDeceptiveMaze(size, seededRandom, blockingPercent) {
        let blockCount = Math.floor(size * size * blockingPercent);
        
        for (let i = 0; i < blockCount; i++) 
        {
            let row = Math.floor(seededRandom() * (size - 4)) + 2;
            let col = Math.floor(seededRandom() * (size - 4)) + 2;
            
            let cell = this.contents[row][col];
            
            if (cell.value === " " && !cell.isPartOfSolution) {
                cell.value = "#";
            }
        }
        
        for (let i = 2; i < size - 2; i++) {
            for (let j = 2; j < size - 2; j++) {
                if (this.contents[i][j].value === " " && !this.contents[i][j].isPartOfSolution) {
                    if (seededRandom() > 0.3) {
                        let openNeighbors = 0;
                        if (this.contents[i-1][j].value === " ") openNeighbors++;
                        if (this.contents[i+1][j].value === " ") openNeighbors++;
                        if (this.contents[i][j-1].value === " ") openNeighbors++;
                        if (this.contents[i][j+1].value === " ") openNeighbors++;
                        
                        if (openNeighbors >= 2) {
                            this.contents[i][j].value = "#";
                        }
                    }
                }
            }
        }
    }
    
    
    initPlayer() 
    {
        this.playerPos = { row: 1, col: 1 };
        this.playerTrail = [];
        this.playerTrail.push({ row: 1, col: 1 });
        this.contents[1][1].value = "Player";
    }
    
    movePlayer(direction) {
        let newRow = this.playerPos.row;
        let newCol = this.playerPos.col;
        
        switch(direction) {
            case 'up': newRow--; break;
            case 'down': newRow++; break;
            case 'left': newCol--; break;
            case 'right': newCol++; break;
        }
        
        if (newRow < 0 || newRow >= this.contents.length || 
            newCol < 0 || newCol >= this.contents.length) {
            return false;
        }
        
        let targetCell = this.contents[newRow][newCol];
        
        if (targetCell.value === "#") {
            return false;
        }
        
        let currentCell = this.contents[this.playerPos.row][this.playerPos.col];
        if (currentCell === this.start) {
            currentCell.value = "S";
        } else {
            currentCell.value = "T";
        }
        
        this.playerPos.row = newRow;
        this.playerPos.col = newCol;
        
        this.playerTrail.push({ row: newRow, col: newCol });
        
        if (targetCell === this.end) {
            targetCell.value = "Player";
            return 'win';
        }
        
        // Place player at new position
        targetCell.value = "Player";
        return true;                          // Move was successful
    }
    
//BFS pathy finidng uing Queue
    solveBFS() {
        // Clear previous solution
        for (let row of this.contents) {
            for (let cell of row) {
                if (cell.value === "P") {
                    cell.value = " ";
                }
                cell.visited = false;
                cell.parent = null;
            }
        }
        
        let queue = new Queue();
        this.start.visited = true;
        queue.enqueue(this.start);
        
        while (!queue.isEmpty()) {
            let current = queue.dequeue();
            
            if (current === this.end) {
                this.drawPath(current);
                return;
            }
            
            let neighbors = this.getNeighbors(current);
            for (let neighbor of neighbors) {
                if (!neighbor.visited && (neighbor.value === " " || neighbor.value === "E")) {
                    neighbor.visited = true;
                    neighbor.parent = current;
                    queue.enqueue(neighbor);
                }
            }
        }
    }
    
    getNeighbors(cell) {
        let neighbors = [];
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (let dir of directions) {
            let newRow = cell.row + dir[0];
            let newCol = cell.column + dir[1];
            
            if (newRow >= 0 && newRow < this.contents.length &&
                newCol >= 0 && newCol < this.contents.length) {
                neighbors.push(this.contents[newRow][newCol]);
            }
        }
        
        return neighbors;
    }
    
    drawPath(endCell) {
        let path = [];
        let current = endCell.parent;
        
        while (current && current !== this.start) {
            path.push(current);
            current = current.parent;
        }
        
        let i = path.length - 1;
        let drawNext = () => {
            if (i >= 0) {
                if (path[i].value === " ") {
                    path[i].value = "P";
                }
                i--;
                this.render(canvas, ctx);
                setTimeout(drawNext, 50);
            }
        };
        drawNext();
    }
    render(canvas, ctx) {
        let size = this.contents.length;
        let cellSize = Math.min(canvas.width, canvas.height) / size;
        
        ctx.fillStyle = "#0a0a1e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let row of this.contents) {
            for (let cell of row) {
                let x = cell.column * cellSize;
                let y = cell.row * cellSize;
                
                ctx.fillStyle = cell.getColor();
                ctx.fillRect(x, y, cellSize, cellSize);
                
                if (cell.value !== "#") {
                    ctx.strokeStyle = "#16213e";
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(x, y, cellSize, cellSize);
                }
            }
        }
    }
}
