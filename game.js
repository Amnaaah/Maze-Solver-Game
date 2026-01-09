
let canvas, ctx;
let myMaze = null;
let currentStage = 0;
let completedStages = [];
let highestUnlocked = 0;

const WIDTH = 600;
const HEIGHT = 600;

function generateStage(level) {
    console.log('Generating level', level);
    currentStage = level;
    
    let size = 11 + Math.floor(level * 0.7);
    if (size > 81) size = 81;
    if (size % 2 === 0) size++;
    
    myMaze = new Maze();
    myMaze.createSimpleMaze(size, level);
    myMaze.initPlayer();
    myMaze.render(canvas, ctx);
    
    updateUI();
    console.log('Level ready!');
}

function updateUI() {
    document.getElementById('level-display').textContent = `LEVEL ${currentStage + 1}`;
    document.getElementById('progress-bar').textContent = `${completedStages.length} / 100`;
    document.getElementById('current-level').textContent = ` Level ${currentStage + 1}`;
    
    updateLevelButtons();
}

function updateLevelButtons() {
    const container = document.getElementById('stages-container');
    container.innerHTML = '';
    
    let maxShow = Math.min(highestUnlocked + 1, 100);
    
    for (let i = 0; i <= maxShow; i++) {
        const btn = document.createElement('button');
        btn.className = 'stage-btn';
        btn.innerHTML = `<span class="stage-emoji"></span><span class="stage-num">Level ${i + 1}</span>`;
        
        if (completedStages.includes(i)) {
            btn.classList.add('completed');
        }
        
        if (i === currentStage) {
            btn.classList.add('active');
        }
        
        if (i > highestUnlocked) {
            btn.classList.add('locked');
            btn.disabled = true;
        } else {
            btn.addEventListener('click', () => generateStage(i));
        }
        
        container.appendChild(btn);
    }
}

function setupGameControls() {
    document.getElementById('solve').addEventListener('click', function() {
        if (!myMaze) return;
        myMaze.solveBFS();
    });
    
    document.getElementById('restart').addEventListener('click', function() {
        if (!myMaze) {
            generateStage(0);
        } else {
            generateStage(currentStage);
        }
    });
    
    const prevBtn = document.getElementById('prev-level');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStage > 0) {
                generateStage(currentStage - 1);
            }
        });
    }
    
    const nextBtn = document.getElementById('next-level');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStage < highestUnlocked) {
                generateStage(currentStage + 1);
            }
        });
    }
    
    const searchInput = document.getElementById('level-search');
    if (searchInput) {
        searchInput.addEventListener('change', function() {
            let level = parseInt(this.value) - 1;
            if (level >= 0 && level <= highestUnlocked) {
                generateStage(level);
            }
            this.value = '';
        });
    }
}

function setupKeyboardControls() {
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        if (!myMaze || !myMaze.playerPos) return;
        
        let moved = false;
        
        switch(e.key) {
            case 'ArrowUp':
                moved = myMaze.movePlayer('up');
                e.preventDefault();
                break;
            case 'ArrowDown':
                moved = myMaze.movePlayer('down');
                e.preventDefault();
                break;
            case 'ArrowLeft':
                moved = myMaze.movePlayer('left');
                e.preventDefault();
                break;
            case 'ArrowRight':
                moved = myMaze.movePlayer('right');
                e.preventDefault();
                break;
        }
        
        if (moved === 'win') {
            handleLevelComplete();
        } else if (moved) {
            myMaze.render(canvas, ctx);
        }
    });
}

function setupMouseControls() {
    let isDrawing = false;
    let lastCell = null;
    
    canvas.addEventListener('mousedown', function(e) {
        if (!myMaze) return;
        isDrawing = true;
        handleMouseMove(e);
    });
    
    canvas.addEventListener('mousemove', function(e) {
        if (!isDrawing || !myMaze) return;
        handleMouseMove(e);
    });
    
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);
    
    function handleMouseMove(e) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        let size = myMaze.contents.length;
        let cellSize = canvas.width / size;
        
        let col = Math.floor(x / cellSize);
        let row = Math.floor(y / cellSize);
        
        if (row < 0 || row >= size || col < 0 || col >= size) return;
        
        let cell = myMaze.contents[row][col];
        
        if (lastCell === cell) return;
        lastCell = cell;
        
        if (!myMaze.playerPos) return;
        
        let rowDiff = Math.abs(row - myMaze.playerPos.row);
        let colDiff = Math.abs(col - myMaze.playerPos.col);
        
        if (rowDiff + colDiff !== 1) return;
        
        let direction = '';
        if (row < myMaze.playerPos.row) direction = 'up';
        else if (row > myMaze.playerPos.row) direction = 'down';
        else if (col < myMaze.playerPos.col) direction = 'left';
        else if (col > myMaze.playerPos.col) direction = 'right';
        
        let result = myMaze.movePlayer(direction);
        
        if (result === 'win') {
            handleLevelComplete();
        } else if (result) {
            myMaze.render(canvas, ctx);
        }
    }
}

function handleLevelComplete() {
    myMaze.render(canvas, ctx);
    
    if (!completedStages.includes(currentStage)) {
        completedStages.push(currentStage);
        if (currentStage === highestUnlocked && highestUnlocked < 99) {
            highestUnlocked++;
        }
        saveProgress(currentStage, completedStages, highestUnlocked);
    }
    
    setTimeout(() => {
        alert(`🎉 Level ${currentStage + 1} Complete!\n\nPress OK to continue`);
        if (currentStage < highestUnlocked) {
            generateStage(currentStage + 1);
        } else {
            updateUI();
        }
    }, 100);
}


function updateUserDisplay() {
    const userDisplay = document.getElementById('user-display');
    
    if (currentUser) {
        userDisplay.innerHTML = `
            <span style="color: #00ff88; font-weight: 700; font-size: 1.1em;">👤 ${currentUser}</span>
            <button id="logout-btn" style="margin-left: 15px; padding: 8px 15px; background: rgba(255, 0, 102, 0.3); color: #ff0066; border: 2px solid #ff0066; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.9em; transition: all 0.3s;">LOGOUT</button>
        `;
        
        document.getElementById('logout-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                currentUser = null;
                currentStage = 0;
                completedStages = [];
                highestUnlocked = 0;
                document.getElementById('login-modal').style.display = 'flex';
                updateUserDisplay();
            }
        });
    } else {
        userDisplay.innerHTML = `
            <span style="color: #ffcc00; font-weight: 700; font-size: 1.1em;"> Guest Mode</span>
            <button id="login-btn" style="margin-left: 15px; padding: 8px 15px; background: rgba(0, 255, 136, 0.3); color: #00ff88; border: 2px solid #00ff88; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.9em; transition: all 0.3s;">LOGIN</button>
        `;
        
        document.getElementById('login-btn').addEventListener('click', function() {
            document.getElementById('login-modal').style.display = 'flex';
        });
    }
}

function setupLoginSystem() {
    loadUsers();
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const result = loginUser(username, password);
            
            if (result.success) {
                currentUser = username;
                document.getElementById('login-modal').style.display = 'none';
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                
                const progress = loadProgress();
                if (progress) {
                    currentStage = progress.currentStage || 0;
                    completedStages = progress.completedStages || [];
                    highestUnlocked = progress.highestUnlocked || 0;
                }
                
                updateUserDisplay();
                generateStage(currentStage);
            } else {
                alert(result.message);
            }
        });
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;
            
            if (password !== confirm) {
                alert('Passwords do not match!');
                return;
            }
            
            const result = registerUser(username, password);
            
            if (result.success) {
                alert(result.message + '\nPlease login now.');
                document.getElementById('reg-username').value = '';
                document.getElementById('reg-password').value = '';
                document.getElementById('reg-confirm').value = '';
                document.getElementById('register-section').style.display = 'none';
                document.getElementById('login-section').style.display = 'block';
            } else {
                alert(result.message);
            }
        });
    }
    
    const guestBtn = document.getElementById('guest-btn');
    if (guestBtn) {
        guestBtn.addEventListener('click', function() {
            console.log('Guest mode starting...');
            currentUser = null;
            document.getElementById('login-modal').style.display = 'none';
            updateUserDisplay();
            generateStage(0);
        });
    }
    
    const showRegisterLink = document.getElementById('show-register');
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('register-section').style.display = 'block';
        });
    }
    
    const showLoginLink = document.getElementById('show-login');
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('register-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'block';
        });
    }
    
    document.getElementById('login-modal').style.display = 'flex';
}

window.addEventListener('load', function() {
    console.log('Game loading...');
    
    canvas = document.querySelector('canvas');
    if (!canvas) {
        alert('Canvas not found!');
        return;
    }
    
    ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    console.log('Setting up controls...');
    setupGameControls();
    setupKeyboardControls();
    setupMouseControls();
    setupLoginSystem();
    
    console.log('Game ready!');
});
