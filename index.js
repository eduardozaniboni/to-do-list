const tasks = []
let taskId = 0
let dragged = null
let placeholder = document.createElement('div')
placeholder.classList.add('placeholder')

onload = () => {
    window.addEventListener('keypress', handleEnterPress)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
    const modeToggle = document.querySelector('.mode-toggle')

    modeToggle.addEventListener('click', () => {
        body = document.body.classList
        body.toggle('dark-mode')
        if (body.contains('dark-mode')) {
            modeToggle.innerHTML = `
                <div class="toggle-items">
                    <span class="toggle-text">Light Mode</span>
                    <img class="img-icon" src="image/sol.png" alt="ícone com imagem da lua" />
                </div>
            `
        } else {
            modeToggle.innerHTML = `
                <div class="toggle-items">
                    <span class="toggle-text">Dark Mode</span>
                    <img class="img-icon" src="image/lua.png" alt="ícone com imagem da lua" />
                </div>
            `
        }
    })
}

const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
        addTask()
    }
}

const createTask = (task) => {
    const newTask = document.createElement('div')
    newTask.classList.add('task')
    newTask.setAttribute('data-id', taskId)
    newTask.setAttribute('draggable', true)
    newTask.innerHTML = `
        <div class="task-item">
            <input id="inputTask-${task.id}" class="checkbox-task" type="checkbox" onclick="toggleTaskCompletion(${task.id})" />
            <label for="inputTask-${task.id}" class="custom-checkbox"></label>
            <label id="labelTask-${task.id}" for="inputTask-${task.id}" class="label-task">${task.name}</label>
        </div>
        <span class="remove-task" onclick="removeTask(${task.id})">-</span>
    `

    newTask.addEventListener('dragstart', handleDragStart)
    newTask.addEventListener('dragend', handleDragEnd)
    newTask.addEventListener('dragover', handleDragOver)
    // newTask.addEventListener('dragleave', handleDragLeave)
    // newTask.addEventListener('drop', handleDrop)
    newTask.addEventListener('touchstart', handleTouchStart)
    newTask.addEventListener('touchmove', handleTouchMove)
    newTask.addEventListener('touchend', handleTouchEnd)

    return newTask
}

const addTask = () => {
    const taskGroup = document.querySelector('.task-group')
    const taskInputName = document.querySelector('.task-input-name')
    const taskName = taskInputName.value.trim()

    if (taskName) {
        taskId++
        const newTask = { id: taskId, name: taskName, completed: false }
        tasks.push(newTask)

        const newTaskDiv = createTask(newTask)
        taskGroup.appendChild(newTaskDiv)
        taskInputName.value = ''
    }
}

const removeTask = (taskId) => {
    const taskGroup = document.querySelector('.task-group')
    const taskElement = taskGroup.querySelector(`.task[data-id='${taskId}']`)

    if (taskElement) {
        taskGroup.removeChild(taskElement)

        const taskIndex = tasks.findIndex((task) => task.id === taskId)

        tasks.splice(taskIndex, 1)

        console.log('Tarefa removida: ', taskId)
        console.log('Tarefa restantes: ', tasks)
    }
}

const toggleTaskCompletion = (taskId) => {
    const task = tasks.find((task) => task.id === taskId)

    if (task) {
        task.completed = !task.completed
        console.log(task)

        const labelTask = document.querySelector(`.task[data-id='${taskId}'] .label-task`)
        if (task.completed) {
            labelTask.innerHTML = `<s>${task.name}</s>`
        } else {
            labelTask.innerHTML = task.name
        }
    }
}

const handleTouchStart = (event) => {
    initialTouchY = event.touches[0].clientY
    dragged = event.target.closest('.task')
    dragged.classList.add('dragging')
    document.body.classList.add('no-scroll')
}

const handleTouchMove = (event) => {
    if (!dragged) return

    const touchY = event.touches[0].clientY
    const taskGroup = document.querySelector('.task-group')
    const targetElement = document.elementFromPoint(event.touches[0].clientX, touchY)

    if (targetElement && targetElement.classList.contains('task') && targetElement !== dragged) {
        const targetRect = targetElement.getBoundingClientRect()
        const isUpperHalf = touchY < targetRect.top + targetRect.height / 2

        if (isUpperHalf) {
            if (placeholder.nextSibling !== targetElement) {
                taskGroup.insertBefore(placeholder, targetElement)
            }
        } else {
            if (targetElement.nextSibling !== placeholder) {
                taskGroup.insertBefore(placeholder, targetElement.nextSibling)
            }
        }
    }
}

const handleTouchEnd = (event) => {
    if (!dragged) return

    const taskGroup = document.querySelector('.task-group')

    if (placeholder.parentNode) {
        taskGroup.insertBefore(dragged, placeholder)
        placeholder.remove()
    }

    dragged.classList.remove('dragging')
    dragged = null
    document.body.classList.remove('no-scroll')
}

const handleDragStart = (event) => {
    dragged = event.target.closest('.task')
    dragged.classList.add('dragging')
    console.log(tasks)
}

const handleDragOver = (event) => {
    event.preventDefault()

    if (!dragged) return

    const dragY = event.clientY
    const taskGroup = document.querySelector('.task-group')
    const targetElement = document.elementFromPoint(event.clientX, dragY)

    if (targetElement && event.target.classList.contains('task') && targetElement !== dragged) {
        const targetRect = targetElement.getBoundingClientRect()
        const isUpperHalf = dragY < targetRect.top + targetRect.height / 2

        if (isUpperHalf) {
            if (placeholder.nextSibling !== targetElement) {
                taskGroup.insertBefore(placeholder, targetElement)
            }
        } else {
            if (targetElement.nextSibling !== placeholder) {
                taskGroup.insertBefore(placeholder, targetElement.nextSibling)
            }
        }
    }
}

const handleDragEnd = (event) => {
    event.preventDefault()

    if (!dragged) return

    const taskGroup = document.querySelector('.task-group')

    if (placeholder.parentNode) {
        taskGroup.insertBefore(dragged, placeholder)
        placeholder.remove()
    }

    dragged.classList.remove('dragging')
    dragged = null

    updateTasksArray()
}

// const handleDrop = (event) => {
//     event.preventDefault()
// }

// const handleDragLeave = (event) => {
//     event.preventDefault()
// }

function updateTasksArray() {
    const taskElements = document.querySelectorAll('.task')
    const newTasks = []

    taskElements.forEach((taskElement) => {
        const taskId = parseInt(taskElement.getAttribute('data-id'))
        const taskIndex = tasks.findIndex((task) => task.id === taskId)
        newTasks.push(tasks[taskIndex])
    })

    tasks.length = 0
    tasks.push(...newTasks)
}
