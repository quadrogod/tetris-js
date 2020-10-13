//@todo: для практики сделать то же самое на react и vue
let canvas, ctx,
    point_w, point_h, // размер точки
    columns = 16, rows; // ширина в колонках
let initial_offset_x = 0;
let offset_x, offset_y = 0;
let direction_x = 0, direction_y = 1;
let game_tick;
let isPaused = false;
let isRotate = false;
let out_of_range = false;

let figure = [];
let figure_next = []; //@todo: добавить в resetFigure сброс следующей, и вывод следующей фигуры
let figures = [
    [0,2,4,6], // |
    [0,2,3,5], // S
    [1,3,2,4], // Z
    [0,2,4,5], // L
    [0,1,2,4], // Г
    [1,2,3,5], // T
    [0,1,2,3], // square
];
//
window.onload = function()
{
    canvas = document.getElementById('area');
    ctx = canvas.getContext('2d');
    point_w = point_h = Math.round(canvas.width / columns);
    rows = Math.round(canvas.height / point_h);
    initial_offset_x = columns / 2 - 1;
    offset_x = initial_offset_x; offset_y = -1;
    out_of_range = false;
    // console.log(rows, columns, canvas.width, canvas.height);
    //
    document.addEventListener('keydown', keydown);
    //
    game_tick = setInterval(game, 1000 / 2);
    // game();
}

function keydown(e)
{
    switch (e.key) {
        case 'Enter':
            if (isPaused) {
                game_tick = setInterval(game, 1000);
                isPaused = false;
            } else {
                clearInterval(game_tick);
                isPaused = true;
            }
            break;
        case ' ':
        case 'ArrowUp':
            isRotate = true;
            break;
        case 'ArrowDown':
            break;
        case 'ArrowLeft':
            direction_x = -1;
            break;
        case 'ArrowRight':
            direction_x = 1;
            break;
    }
}


function resetFigure()
{
    figure = [];
    offset_x = initial_offset_x; offset_y = -1;
}

function getFigure(figures)
{
    let fig_no = Math.floor(Math.random() * figures.length);
    let figure = [];
    for (let i = 0; i < 4; i++) {
        figure[i] = {x: figures[fig_no][i] % 2, y: Math.floor(figures[fig_no][i] / 2)};
    }
    //
    return figure;
}

function game()
{
    ctx.fillStyle = 'gray'; // очищаем весь canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // получаем фигуру для отрисовки
    if (figure.length == 0) {
        figure = getFigure(figures);
    }

    //@todo: при вращении надо учитывать выход за пределы и смещать фигуру к краю
    if (isRotate)
    {
        let figure_center = figure[1];
        for (let i = 0; i < 4; i++)
        {
            let x = figure[i].y - figure_center.y;
            let y = figure[i].x - figure_center.x;
            figure[i].x = figure_center.x - x;
            figure[i].y = figure_center.y + y;
        }
        // if (!check()) for (int i=0;i<4;i++) a[i]=b[i];
    }

    // отрисовка фигуры
    ctx.fillStyle = 'black';
    let visible_blocks = 0;

    for (let i = 0; i < 4; i++) {
        let x = figure[i].x + offset_x;
        let y = figure[i].y + offset_y;
        if (!out_of_range && direction_x != 0 && ((x <= 0 && direction_x < 0) || (x >= columns - 1 && direction_x > 0))) {
            out_of_range = true;
        }
        x = x * point_w;
        y = y * point_h;
        // рисуем только если ушло за горизонт :)
        if (y < canvas.height) {
            visible_blocks++;
            ctx.fillRect(x, y, point_w, point_h);
        }
    }
    // меняем фигуру
    if (visible_blocks == 0) {
        resetFigure();
    }
    // обнуляем смещение, если
    if (out_of_range) {
        out_of_range = false;
        direction_x = 0;
    }
    // смещение фигуры на следующий тик
    offset_x += direction_x;
    offset_y += direction_y;
    // сбрасываем модификаторы
    direction_x = direction_x !== 0 ? 0 : direction_x;
    isRotate = isRotate !== false ? false : isRotate;
}


// let figures = [
//     [
//         [1,0],
//         [1,0],
//         [1,0],
//         [1,0],
//     ], // |
//     [
//         [1,0],
//         [1,1],
//         [0,1],
//         [0,0],
//     ], // S
// ];
//
// for old massive context
// for (let fc = 0; fc < 4; fc++) {
//     for (let fr = 0; fr < 2; fr++) {
//         let isPoint = figure[fc][fr] > 0;
//         if (isPoint) {
//             let x = fr * point_w;
//             let y = fc * point_h;
//             // console.log(x,y, isPoint);
//             ctx.fillRect(x, y, point_w, point_h);
//         }
//     }
// }
