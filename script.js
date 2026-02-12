const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Charger les tâches sauvegardées au démarrage
loadTasks();

function addTask() {
    const taskTextValue = taskInput.value.trim();

    if (taskTextValue !== "") {
        createTaskElement(taskTextValue);
        saveTasks(); // Sauvegarder après l'ajout

        taskInput.value = "";
        taskInput.focus();
    } else {
        alert("Veuillez entrer une tâche !");
    }
}

// Fonction pour créer l'élément HTML d'une tâche
function createTaskElement(text, completed = false) {
    const li = document.createElement('li');
    
    const span = document.createElement('span');
    span.textContent = text;
    if (completed) {
        span.classList.add('completed');
    }

    // Conteneur pour les boutons
    const buttonsDiv = document.createElement('div');

    // Bouton Terminé (V)
    const doneBtn = document.createElement('button');
    doneBtn.textContent = 'V';
    doneBtn.className = 'done-btn';
    doneBtn.addEventListener('click', function() {
        span.classList.toggle('completed');
        saveTasks();
        // Appliquer le filtre actuel après modification
        filterTasks(document.querySelector('.filter-btn.active').dataset.filter);
    });

    // Bouton Supprimer (X)
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', function() {
        li.remove();
        saveTasks(); // Sauvegarder après la suppression
    });

    buttonsDiv.appendChild(doneBtn);
    buttonsDiv.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttonsDiv);
    taskList.appendChild(li);
}

// Sauvegarder la liste actuelle dans le LocalStorage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(function(li) {
        const span = li.querySelector('span');
        tasks.push({
            text: span.textContent,
            completed: span.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Charger les tâches depuis le LocalStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(function(task) {
        // Gestion de la compatibilité (si l'ancien format était juste du texte)
        if (typeof task === 'string') {
            createTaskElement(task);
        } else {
            createTaskElement(task.text, task.completed);
        }
    });
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Gestion des filtres
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        filterTasks(btn.dataset.filter);
    });
});

function filterTasks(filter) {
    const tasks = taskList.querySelectorAll('li');
    tasks.forEach(task => {
        const isCompleted = task.querySelector('span').classList.contains('completed');
        switch(filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'todo':
                task.style.display = isCompleted ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = isCompleted ? 'flex' : 'none';
                break;
        }
    });
}