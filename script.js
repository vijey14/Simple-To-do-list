// Get DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const clearBtn = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// State
let todos = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();
});

// Load todos from localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    todos = saved ? JSON.parse(saved) : [];
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Add todo event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Add new todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        todoInput.focus();
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    todos.unshift(newTodo);
    saveTodos();
    todoInput.value = '';
    todoInput.focus();
    renderTodos();
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Clear completed todos
clearBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
});

// Filter todos
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Filter logic
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Render todos
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    // Update task count
    const activeTodos = todos.filter(t => !t.completed).length;
    const totalTodos = todos.length;
    taskCount.textContent = `${activeTodos} of ${totalTodos} tasks`;

    // Clear list
    todoList.innerHTML = '';

    // Show empty message
    if (filteredTodos.length === 0) {
        const emptyMsg = document.createElement('li');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = currentFilter === 'all' 
            ? 'No tasks yet. Add one to get started!' 
            : `No ${currentFilter} tasks.`;
        todoList.appendChild(emptyMsg);
        return;
    }

    // Render todos
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        
        todoList.appendChild(li);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
