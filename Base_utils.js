function getbits(num) {
    let length = Math.floor(Math.log2(num) + 1);
    let result = new Array(length);
    let index = length - 1;
    while (num !== 0) {
        result[index] = num % 2;
        index--;
        num = num >> 1;
    }
    return result;
}

function partition(lis, length) {
    let num_lines = div(lis.length, length);
    let result = make2DArray(length, num_lines);
    for (let i = 0; i < lis.length; i++) {
        result[i % length][div(i, length)] = lis[i];
    }
    return result;
}

function div(val, by) {
    return (val - val % by) / by;
}

/**
 * @return {boolean}
 */
function Equals(a, b) {
    for (let x = 0; x < a.length; x++) {
        for (let y = 0; y < a[0].length; y++) {
            if (a[x][y] !== b[x][y]) {
                return false;
            }
        }
    }
    return true;
}


/**
 * @return {number}
 */
function GetHashCode(a) {
    let res = 0;
    a.forEach(function (b) {
        b.forEach(function (c) {

            res = 2 * res + c;
        })
    });
    return res;
}

function left_item(array) {
    let result = make2DArray(array.length - 1, array[0].length);
    for (let x = 0; x < array.length - 1; x++) {
        for (let y = 0; y < array[0].length; y++) {
            result[x][y] = array[x][y];
        }
    }
    return result;
}

function right_item(array) {
    let result = make2DArray(array.length - 1, array[0].length);
    for (let x = 1; x < array.length; x++) {
        for (let y = 0; y < array[0].length; y++) {
            result[x - 1][y] = array[x][y];
        }
    }
    return result;
}

function top_item(array) {
    let result = make2DArray(array.length, array[0].length - 1);
    for (let x = 0; x < array.length; x++) {
        for (let y = 0; y < array[0].length - 1; y++) {
            result[x][y] = array[x][y];
        }
    }
    return result;
}

function bottom_item(array) {
    let result = make2DArray(array.length, array[0].length - 1);
    for (let x = 0; x < array.length; x++) {
        for (let y = 1; y < array[0].length; y++) {
            result[x][y - 1] = array[x][y];
        }
    }
    return result;
}

function make_step_forward(array) {
    const x_length = array.length;
    const y_length = array[0].length;
    const result = make2DArray(x_length, y_length);
    let is_left;
    let is_up;
    let is_right;
    let is_down;
    let count;
    for (let x = 0; x < x_length; x++) {
        for (let y = 0; y < y_length; y++) {
            is_left = (y === 0);
            is_right = (y === (y_length - 1));
            is_up = (x === 0);
            is_down = (x === (x_length - 1));

            count = (is_left ? 0 : array[x][y - 1]) +
                (is_left || is_up ? 0 : array[x - 1][y - 1]) +
                (is_up ? 0 : array[x - 1][y]) +
                (is_up || is_right ? 0 : array[x - 1][y + 1]) +
                (is_right ? 0 : array[x][y + 1]) +
                (is_right || is_down ? 0 : array[x + 1][y + 1]) +
                (is_down ? 0 : array[x + 1][y]) +
                (is_down || is_left ? 0 : array[x + 1][y - 1]);

            result[x][y] = ((count === 3 || (array[x][y] === 1 && count === 2)) ? 1 : 0);
        }
    }
    return result;
}

function fill_wide_grid(base, additional, position) {
    const result = make2DArray(base.length, base[0].length);
    const x_min = position[0];
    const x_max = (x_min + additional.length);
    const y_min = position[1];
    const y_max = (y_min + additional[0].length);
    const x_range = base.length;
    const y_range = base[0].length;

    for (let x = 0; x < x_range; x++) {
        for (let y = 0; y < y_range; y++) {
            if (x_min <= x && x < x_max && y_min <= y && y < y_max) {
                result[x][y] = (additional[x - x_min][y - y_min] | base[x][y]);
            } else {
                result[x][y] = base[x][y];
            }
        }
    }
    return result;
}

function pad(grid, pad_width = 1) {
    const result = make2DArray(grid.length + pad_width * 2, grid[0].length + pad_width * 2);
    return fill_wide_grid(result, grid, [pad_width, pad_width]);
}