let f_s_width;
let max_num;

function TestMeL(goal) {
    Initialize(goal);
    Calculate();
    return found_solutions;
}

function Initialize(goal) {
    grid_goal = goal;
    g_g_width = goal.length;
    g_g_height = goal[0].length;
    f_s_width = (g_g_width + 2);
    max_num = Pow2(f_s_width);
}

function Calculate() {
    //prepare for row1
    let curr_row = [];
    all_rows = [];
    for (let y = 0; y < max_num; y++) {
        for (let x = 0; x < max_num; x++) {
            all_rows.push([y, x]);
        }
    }

    for (let i = 0; i < g_g_height; i++) {
        curr_row = all_rows.slice(0);
        all_rows = [];
        let row = get_row(i);
        curr_row.forEach(function (testcase) {
            GenerateNexts(testcase, row, i);
        });
    }
    console.log("Reconstructing...");
    ReconstructPath(all_rows);
    console.log("Verifying...");
    VerifyResults(found_solutions, grid_goal);
}


function ReconstructPath(thisRow) {
    found_solutions = [];
    thisRow.forEach(function (path) {

        let temp = make2DArray(f_s_width, path.length);
        for (let y = 0; y < path.length; y++) {
            let bits = array_from_num(path[y]);
            for (let x = 0; x < f_s_width; x++) {
                temp[x][y] = bits[x];
            }
        }
        found_solutions.push(temp);
    });
}

// Generates additions to all_rows given the previous result and the one before that.
function GenerateNexts(previousRows, row, depth) {
    let last_row =  array_from_num(previousRows[depth]);
    let current_row = array_from_num(previousRows[depth + 1]);
    let pattern_grid;
    if (depth === 0) //is this the first? If so, then check to see if the top is fine.
    {
        pattern_grid = make_step_forward(pad(lines_to_array_2D(last_row, current_row)));
        for (let x = 0; x < g_g_width + 4; x++) {
            if (pattern_grid[x][0] !== 0 || pattern_grid[x][1] !== 0) {
                return; //run awaaay
            }
        }
    }

    for (let i = 0; i < max_num; i++) {
        let test_row = array_from_num(i);
        //strict version uses make_step_forward
        let is_good = true;
        pattern_grid = make_step_forward(pad(lines_to_array_3(last_row, current_row, test_row, g_g_width + 2)));

        //if we're at the bottom of the tree, check the bottom of the pattern
        if (depth === g_g_height - 1) {
            for (let x = 0; x < g_g_width + 4; x++) {
                if (pattern_grid[x][3] !== 0 || pattern_grid[x][4] !== 0) {
                    is_good = false;
                    break;
                }
            }
        }
        if (!is_good) {
            continue;
        }

        for (let x = 2; x < g_g_width + 2; x++) {
            if (pattern_grid[x][2] !== row[x - 2]) {
                is_good = false;
                break;
            }
        }
        if (!is_good) {
            continue;
        }

        //check sides
        for (let y = 0; y < 5; y++) {
            if (pattern_grid[0][y] !== 0 || pattern_grid[1][y] !== 0 || pattern_grid[g_g_width + 2][y] !== 0 || pattern_grid[g_g_width + 3][y] !== 0) {
                is_good = false;
                break;
            }
        }
        if (is_good) {
            all_rows.push(Append(previousRows, i));
        }
    }
}

function get_row(y) {
    let result = new Array(g_g_width);
    for (let x = 0; x < g_g_width; x++) {
        result[x] = grid_goal[x][y];
    }
    return result;
}