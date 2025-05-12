document.addEventListener('DOMContentLoaded', function() {
   
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const totalCount = document.getElementById('total-count');
    const completedCount = document.getElementById('completed-count');
    
 
    let tasks = [];
    
   
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        renderTasks();
    }
    
    function addTask() {
        const taskText = todoInput.value.trim();
        
        if (taskText !== '') {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            todoInput.value = '';
            todoInput.focus();
        }
    }
    
    function renderTasks() {
        todoList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            
            if (task.completed) {
                li.classList.add('completed');
            }
            
            li.innerHTML = `
                <span>${task.text}</span>
                <button class="delete-btn">Delete</button>
            `;
            
            li.addEventListener('click', function(e) {
                if (e.target.tagName !== 'BUTTON') {
                    toggleCompleted(task.id);
                }
            });
            
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteTask(task.id);
            });
            
            todoList.appendChild(li);
        });
        
        updateStats();
    }
    
    function toggleCompleted(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    }
    
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
    
    function updateStats() {
        totalCount.textContent = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        completedCount.textContent = completedTasks;
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    addBtn.addEventListener('click', addTask);
    
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});
