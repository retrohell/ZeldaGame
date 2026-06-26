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
            'xd ddd)ddz',
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
            for(let j = 0; j < 10; j++){
                const square = document.createElement('div');
                square.setAttribute('id', i * width + j);

                const char = currentMap[i][j];
                addMapElement(square, char, j, i)

                grid.appendChild(square);
                squares.push(square)
            }
        }
    }
    createBoard();

    console.log(squares);


    function addMapElement(square, char, x, y){
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
                // createSlicer(x,y)
                break;
            case '}':
                // createSkeletor(x,y)
                break;







        }
    }

})
