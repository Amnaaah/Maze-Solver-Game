# Maze-Solver-Game  - 100 Level Challenge
A data-structures-based maze project using custom Linked Lists, Depth First Search, Stacks, and Queues to generate mazes with backtracking and solve them using Breadth-First Search.

A progressively challenging maze game featuring 100 levels with increasing difficulty. Built with vanilla JavaScript, this project demonstrates core programming concepts including data structures and algorithms

## Features

- **100 Progressive Levels**: Mazes increase in size and complexity from 11x11 to 81x81 grids
- **User Account System**: Save and track your progress across sessions using localStorage
- **Guest Mode**: Play without registration
- **Automatic Solver**: Built-in BFS pathfinding algorithm to visualize the shortest solution path
- **Dual Control Modes**: Play with keyboard arrows or mouse drag
- **Visual Trail System**: See your path as you navigate through the maze
- **Seeded Maze Generation**: Each level generates the same maze pattern for consistency

## Technologies Used

- HTML5 Canvas for rendering
- JavaScript
- CSS3 for styling
- LocalStorage API for data persistence

## Data Structures & Algorithms

This project implements several fundamental computer science concepts:

### Data Structures
- **2D Arrays**: Maze grid representation
- **Queue (FIFO)**: Used in BFS pathfinding algorithm
- **Stack (LIFO)**: Maze generation using recursive backtracking
- **Linked List**: Path reconstruction in shortest path algorithm

### Algorithms
- **Breadth-First Search (BFS)**: Finds shortest path from start to end
- **Recursive Backtracking**: Generates random maze layouts with guaranteed solution paths
- **Seeded Random Generation**: Ensures consistent maze patterns per level

## Installation & Setup

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No additional dependencies or build steps required
4. Open index.html in your preferred browser

## How to Play
Starting the Game
Login: Create an account to save progress
Register: New users can create an account with username and password
Guest Mode: Play without saving progress
Controls
Keyboard: Use arrow keys (↑ ↓ ← →) to move through the maze
Mouse: Click and drag to navigate adjacent cells
Solve Button: Show the AI-calculated shortest path
Restart Button: Reset the current level
Objectives
Navigate from the green starting cell (S) to the pink ending cell (E)
Complete all 100 levels to become a maze master
Try to beat levels without using the solver for extra challenge

## Browser Compatibility
Chrome (recommended)
Firefox
Edge
Safari
Any modern browser with HTML5 Canvas support

## Educational Purpose
This project was developed as the coursework of Programming Data Strucrures & Algorithms module to demonstrate understanding of:
Data structure implementation and usage
Algorithm design and analysis
Time and space complexity considerations
Practical application of theoretical concepts
