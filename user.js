let currentUser = null;
let users = {};

function loadUsers() {
    const saved = localStorage.getItem('mazeUsers');
    if (saved) {
        try {
            users = JSON.parse(saved);
        } catch (e) {
            users = {};
        }
    }
}

function saveUsers() {
    localStorage.setItem('mazeUsers', JSON.stringify(users));
}

function registerUser(username, password) {
    if (!username || !password) {
        return { success: false, message: 'Username and password required!' };
    }
    if (users[username]) {
        return { success: false, message: 'Username already taken!' };
    }
    users[username] = {
        password: password,
        progress: {
            currentStage: 0,
            completedStages: [],
            highestUnlocked: 0
        }
    };
    saveUsers();
    return { success: true, message: 'Account created!' };
}

function loginUser(username, password) {
    if (!users[username]) {
        return { success: false, message: 'User not found!' };
    }
    if (users[username].password !== password) {
        return { success: false, message: 'Wrong password!' };
    }
    return { success: true, message: 'Welcome back!' };
}

function saveProgress(currentStage, completedStages, highestUnlocked) {
    if (currentUser && users[currentUser]) {
        users[currentUser].progress = {
            currentStage: currentStage,
            completedStages: completedStages,
            highestUnlocked: highestUnlocked
        };
        saveUsers();
    }
}

function loadProgress() {
    if (currentUser && users[currentUser]) {
        return users[currentUser].progress;
    }
    
    return null;
}
