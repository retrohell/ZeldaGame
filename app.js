document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const enemiesDisplay = document.getElementById('enemies');

    const width = 10;
    const tileSize = 48;

    const squares = [];

    let score = 0;
    let level = 0;
    let enemies = [];
    let playerPosition = 40;
    let playerDirection = 'right';
    let gameRunning = true;

    // y, w, x,z = corner walls | a, b = side walls | c, d = top/bottom walls
    // ) = laterns | ( fire pots | %  = left door | ´ = top door | $ = stairs
    // * = slicer enemy | } = skeletor enemy | space = empty walkable area
    const maps = [
        // Level 1 layout
        [
            'ycc)cc´c(w',
            'a        b',
            'a      * b',
            'a       }$',
            'a        b',
            'a        b',
            'a   *    b',
            'a        b',
            'xd)ddd)ddz',
        ],
        // Level 2 layout
        [
            'yccccccwyb',
            'a        b',
            'a %      b',
            'a %      b',
            'a      * b',
            'a   (    b',
            'a %      b',
            'a     )  b',
            'yccccccwyb',
        ],
        // Level 3 layout
        [
            'ycc)xdd))c',
            'a        b',
            'a %      b',
            'a      * b',
            'a   (    b',
            'a %      b',
            'a %      b',
            'a     )  b',
            'xdd))cc´cw',
        ]
    ];

    function createBoard() {

        const currentMap = maps[level];

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 10; j++) {
                const square = document.createElement('div');
                square.setAttribute('id', i * width + j);

                const char = currentMap[i][j];
                addMapElement(square, char, j, i)

                grid.appendChild(square);
                squares.push(square)
            }
        }
        createPlayer()
    }

    createBoard();

    console.log(squares);


    function addMapElement(square, char, x, y) {
        switch (char) {
            case 'a':
                square.classList.add('left-wall')
                break;
            case 'b':
                square.classList.add('right-wall')
                break;
            case 'c':
                square.classList.add('top-wall')
                break;
            case 'd':
                square.classList.add('bottom-wall')
                break;
            case 'w':
                square.classList.add('top-right-wall')
                break;
            case 'x':
                square.classList.add('bottom-left-wall')
                break;
            case 'y':
                square.classList.add('top-left-wall')
                break;
            case 'z':
                square.classList.add('bottom-right-wall')
                break;
            case '%':
                square.classList.add('left-door')
                break;
            case '´':
                square.classList.add('top-door')
                break;
            case '$':
                square.classList.add('stairs')
                break;
            case ')':
                square.classList.add('lanterns')
                break;
            case '(':
                square.classList.add('fire-pot')
                break;
            case '*':
                createSlicer(x, y)
                break;
            case '}':
                createSkeletor(x, y)
                break;
        }
    }

    function createPlayer() {
        const playerElement = document.createElement('div')
        playerElement.className = 'link-going-right'
        playerElement.id = 'player'

        console.log((playerPosition % width) * tileSize)

        playerElement.style.left = `${(playerPosition % width) * tileSize}px `
        playerElement.style.top = `${Math.floor(playerPosition / width) * tileSize}px `

        grid.appendChild(playerElement)
    }

    function createSlicer(x, y) {
        const slicerElement = document.createElement('div')
        slicerElement.className = 'slicer'
        slicerElement.id = 'slicer'
        slicerElement.style.left = `${x * tileSize}px`
        slicerElement.style.top = `${y * tileSize}px`

        const slicer = {
            x, y,
            direction: -1,
            type: 'slicer',
            slicerElement
        }

        enemies.push(slicer)

        grid.appendChild(slicerElement)
    }

    function createSkeletor(x, y) {
        const skeletorElement = document.createElement('div')
        skeletorElement.className = 'skeletor'
        skeletorElement.style.left = `${x * tileSize}px`
        skeletorElement.style.top = `${y * tileSize}px`

        const skeletor = {
            x, y,
            direction: -1,
            timer: Math.random() * 5,
            type: 'skeletor',
            skeletorElement
        }

        enemies.push(skeletor)

        grid.appendChild(skeletorElement)
    }

    function movePlayer(direction) {
        const playerElement = document.getElementById('player')
        let newPosition = playerPosition

        switch (direction) {
            case 'left':
                if (playerPosition % width !== 0) newPosition = newPosition - 1
                playerElement.className = 'link-going-left'
                playerDirection = 'left'
                break;
            case 'right':
                if (playerPosition % width !== width - 1) newPosition = newPosition + 1
                playerElement.className = 'link-going-right'
                playerDirection = 'right'
                break;
            case 'up':
                if (playerPosition - width >= 0) newPosition = newPosition - width
                playerElement.className = 'link-going-up'
                playerDirection = 'up'
                break;
            case 'down':
                if (playerPosition + width < width * 9) newPosition = newPosition + width
                playerElement.className = 'link-going-down'
                playerDirection = 'down'
                break;
        }

        if (canMoveTo(newPosition)) {
            const square = squares[newPosition]

            if (square.classList.contains('left-door')) {
                square.classList.remove('left-door')
            }
            if (square.classList.contains('top-door') || square.classList.contains('stairs')) {
                if (enemies.length === 0) {
                    nextLevel()
                } else {
                    showEnemiesRemainingMessage()
                }
                return
            }

            playerPosition = newPosition
            playerElement.style.left = `${(playerPosition % width) * tileSize}px `
            playerElement.style.top = `${Math.floor(playerPosition / width) * tileSize}px `
        }
    }

    function canMoveTo(position) {
        if (position < 0 || position >= squares.length) return false
        const square = squares[position]

        return !square.classList.contains('left-wall') &&
            !square.classList.contains('right-wall') &&
            !square.classList.contains('top-wall') &&
            !square.classList.contains('bottom-wall') &&
            !square.classList.contains('top-left-wall') &&
            !square.classList.contains('top-right-wall') &&
            !square.classList.contains('bottom-left-wall') &&
            !square.classList.contains('bottom-right-wall') &&
            !square.classList.contains('lanterns') &&
            !square.classList.contains('fire-pot')
    }


    function spawnKaboom() {
        let kaboomX = playerPosition % width
        let kaboomY = Math.floor(playerPosition / width)

        switch (playerPosition) {
            case 'left':
                kaboomX -= 1
                break
            case 'right':
                kaboomX += 1
                break
            case 'up':
                kaboomY -= 1
                break
            case 'down':
                kaboomY += 1
                break
        }

        // < >
        if (kaboomX < width && kaboomX >= 0 && kaboomY < 9 || kaboomY >= 0) {
            const kaboomElement = document.createElement('div')
            kaboomElement.className = 'kaboom'
            kaboomElement.style.left = `${kaboomX * tileSize}px`
            kaboomElement.style.top = `${kaboomY * tileSize}px`
            grid.appendChild(kaboomElement)

            checkKaboomEnemyCollision(kaboomX, kaboomY)

            setTimeout(() => {
                if (kaboomElement.parentNode) {
                    kaboomElement.parentNode.removeChild(kaboomElement)
                }
            }, 1000)
        }

    }


    function checkKaboomEnemyCollision(kaboomX, kaboomY) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const enemyX = Math.round(enemy.x)
            const enemyY = Math.round(enemy.y)

            if (enemyX === kaboomX && enemyY === kaboomY) {
                if (enemy.element.parentNode) {
                    enemy.element.parentNode.removeChild(enemy.element)
                }
                enemies.splice(i, 1)
                score++
                updateDisplay()
                break
            }
        }
    }

    function updateDisplay(){
        scoreDisplay.innerHTML = score
        levelDisplay.innerHTML = level + 1
        enemiesDisplay.innerHTML = enemies.length
    }


    function nextLevel() {
        level = (level + 1) % maps.length
        createBoard()
    }

    function showEnemiesRemainingMessage() {
        grid.style.fliter = 'hue-rotate(0deg) saturate(2) brightness(1.5)'
        grid.style.boxShadow = '0 0 20px red'

        setTimeout(() => {
            grid.style.fliter = ''
            grid.style.boxShadow = ''
        }, 300)

        showTemporaryMessage('Enemies remaining: ' + enemies.length, 'red', 2000)
    }

    function showTemporaryMessage(message, color, duration) {
        const existing = document.getElementById('temp-message')
        if (existing) {
            existing.remove()
        }

        const messageElement = document.createElement('div')
        messageElement.id = 'temp-message'
        messageElement.textContent = message
        messageElement.style.color = color
        grid.appendChild(messageElement)

        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove()
            }
        }, duration)
    }


    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault()
                movePlayer('left')
                break
            case 'ArrowRight':
                e.preventDefault()
                movePlayer('right')
                break
            case 'ArrowUp':
                e.preventDefault()
                movePlayer('up')
                break
            case 'ArrowDown':
                e.preventDefault()
                movePlayer('down')
                break
            case 'Space':
                e.preventDefault()
                spawnKaboom()
                break
        }
    })

})
