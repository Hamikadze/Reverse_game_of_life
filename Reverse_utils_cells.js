
let patterns_all; //all patterns that fit in a 3x3 grid.
let patterns_all_live; //live in the center
let patterns_all_die; //die in the center
//1: pat number. 2: solution number. 3: solution
let patterns_l_live;
let patterns_l_die;
let patterns_u_live;
let patterns_u_die;
let patterns_ul_live;
let patterns_ul_die;

//let grid_goal;

//let g_g_width; // grid_goal = g_g
//let g_g_height;

//let all_rows;
//let found_solutions;

function TestMe(goal) {
    Initialize(goal);
    Calculate();
    return found_solutions;
}

function Initialize(goal) {
    console.log("Initializing...");
    grid_goal = goal;

    g_g_width = goal.length;
    g_g_height = goal[0].length;


    let patt_all_length = 512; //patterns_all = patt_all


    patterns_all = new Array(patt_all_length);

    for (let i = 0; i < patt_all_length; i++) {
        let bits = getbits(patt_all_length + i);
        bits.shift();
        patterns_all[i] = partition(bits, 3);
    }

    //generate lengths for each of the arrays
    let patt_all_live_length = 0;
    let patt_all_die_length = 0;
    let patt_l_live_length = new Array(64).fill(0);
    let patt_l_die_length = new Array(64).fill(0);
    let patt_u_live_length = new Array(64).fill(0);
    let patt_u_die_length = new Array(64).fill(0);
    let patt_ul_live_length = new Array(256).fill(0);
    let patt_ul_die_length = new Array(256).fill(0);

    for (let i = 0; i < patt_all_length; i++) {
        if (make_step_forward(patterns_all[i])[1][1] === 1) {
            patt_all_live_length++;
            patt_l_live_length[GetHashCode(left_item(patterns_all[i]))]++;
            patt_u_live_length[GetHashCode(top_item(patterns_all[i]))]++;
            patt_ul_live_length[GetHashUL1(patterns_all[i])]++;
        } else {
            patt_all_die_length++;
            patt_l_die_length[GetHashCode(left_item(patterns_all[i]))]++;
            patt_u_die_length[GetHashCode(top_item(patterns_all[i]))]++;
            patt_ul_die_length[GetHashUL1(patterns_all[i])]++;
        }
    }

    //Initialize 2nd levels of arrays
    patterns_all_live = new Array(patt_all_live_length).fill([]);
    patterns_all_die = new Array(patt_all_die_length).fill([]);
    patterns_l_live = new Array(64).fill([]);
    patterns_l_die = new Array(64).fill([]);
    patterns_u_die = new Array(64).fill([]);
    patterns_u_live = new Array(64).fill([]);
    patterns_ul_live = new Array(256).fill([]);
    patterns_ul_die = new Array(256).fill([]);
    for (let i = 0; i < 64; i++) {
        patterns_l_live[i] = new Array(patt_l_live_length[i]).fill([]);
        patterns_l_die[i] = new Array(patt_l_die_length[i]).fill([]);
        patterns_u_live[i] = new Array(patt_u_live_length[i]).fill([]);
        patterns_u_die[i] = new Array(patt_u_die_length[i]).fill([]);
    }
    for (let i = 0; i < 256; i++) {
        patterns_ul_live[i] = new Array(patt_ul_live_length[i]).fill([]);
        patterns_ul_die[i] = new Array(patt_ul_die_length[i]).fill([]);
    }

    let patt_all_live_key = 0;
    let patt_all_die_key = 0;
    let patt_l_live_key = new Array(64).fill(0);
    let patt_l_die_key = new Array(64).fill(0);
    let patt_u_live_key = new Array(64).fill(0);
    let patt_u_die_key = new Array(64).fill(0);
    let patt_ul_live_key = new Array(256).fill(0);
    let patt_ul_die_key = new Array(256).fill(0);

    let hash_l;
    let hash_u;
    let hash_ul;

    //hashtables
    for (let i = 0; i < 512; i++) {
        hash_l = GetHashCode(left_item(patterns_all[i]));
        hash_u = GetHashCode(top_item(patterns_all[i]));
        hash_ul = GetHashUL1(patterns_all[i]);
        if (make_step_forward(patterns_all[i])[1][1] === 1) {
            patterns_all_live[patt_all_live_key] = patterns_all[i];
            patt_all_live_key++;

            patterns_l_live[hash_l][patt_l_live_key[hash_l]] = patterns_all[i];
            patt_l_live_key[hash_l]++;
            patterns_u_live[hash_u][patt_u_live_key[hash_u]] = patterns_all[i];
            patt_u_live_key[hash_u]++;
            patterns_ul_live[hash_ul][patt_ul_live_key[hash_ul]] = patterns_all[i];
            patt_ul_live_key[hash_ul]++;
        } else {
            patterns_all_die[patt_all_die_key] = patterns_all[i];
            patt_all_die_key++;

            patterns_l_die[hash_l][patt_l_die_key[hash_l]] = patterns_all[i];
            patt_l_die_key[hash_l]++;
            patterns_u_die[hash_u][patt_u_die_key[hash_u]] = patterns_all[i];
            patt_u_die_key[hash_u]++;
            patterns_ul_die[hash_ul][patt_ul_die_key[hash_ul]] = patterns_all[i];
            patt_ul_die_key[hash_ul]++;
        }
    }

    console.log("Finished initializing");
}

function Calculate() {
    console.log("Calculating...");
    let curr_row = [];
    let step_forward;
    //Initialize

    if (grid_goal[0][0] === 0) {
        for (let i = 0; i < patterns_all_die.length; i++) {

            step_forward = make_step_forward(pad(patterns_all_die[i]));
            if (step_forward[0][0] === 0 &&
                step_forward[1][0] === 0 &&
                step_forward[2][0] === 0 &&
                step_forward[0][1] === 0 &&
                step_forward[1][1] === 0 &&
                step_forward[2][1] === 0 &&
                step_forward[0][2] === 0 &&
                step_forward[1][2] === 0) {
                curr_row.push([patterns_all_die[i]]);
            }
        }
    } else {
        for (let i = 0; i < patterns_all_live.length; i++) {

            step_forward = make_step_forward(pad(patterns_all_live[i]));
            if (step_forward[0][0] === 0 &&
                step_forward[1][0] === 0 &&
                step_forward[2][0] === 0 &&
                step_forward[0][1] === 0 &&
                step_forward[1][1] === 0 &&
                step_forward[2][1] === 0 &&
                step_forward[0][2] === 0 &&
                step_forward[1][2] === 0) {
                curr_row.push([patterns_all_live[i]]);
            }
        }
    }

    //$('.progress-bar').css('g_g_width', 0 + '%').attr('aria-valuemax', progress_max);


    for (let y = 0; y < g_g_height; y++) {
        for (let x = 0; x < g_g_width; x++) {
            if (x === 0 && y === 0) {
                continue;
            }


            let prev_row = curr_row.slice(0);
            curr_row = [];

            let hash;
            prev_row.forEach(function (path) {


                let last_path = path[path.length - 1];
                if (y === 0) {
                    if (x === (g_g_width - 1)) {
                        hash = GetHashCode(right_item(last_path));
                        if (grid_goal[x][y] === 0) {
                            for (let i = 0; i < patterns_l_die[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_l_die[hash][i]));
                                if (step_forward[2][0] === 0 &&
                                    step_forward[3][0] === 0 &&
                                    step_forward[4][0] === 0 &&
                                    step_forward[2][1] === 0 &&
                                    step_forward[3][1] === 0 &&
                                    step_forward[4][1] === 0 &&
                                    step_forward[3][2] === 0 &&
                                    step_forward[4][2] === 0) {
                                    curr_row.push(Append(path, patterns_l_die[hash][i]));
                                }
                            }
                        } else {
                            for (let i = 0; i < patterns_l_live[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_l_live[hash][i]));
                                if (step_forward[2][0] === 0 &&
                                    step_forward[3][0] === 0 &&
                                    step_forward[4][0] === 0 &&
                                    step_forward[2][1] === 0 &&
                                    step_forward[3][1] === 0 &&
                                    step_forward[4][1] === 0 &&
                                    step_forward[3][2] === 0 &&
                                    step_forward[4][2] === 0) {
                                    curr_row.push(Append(path, patterns_l_live[hash][i]));
                                }
                            }
                        }

                    } else {
                        hash = GetHashCode(right_item(last_path));

                        if (grid_goal[x][y] === 0) {
                            for (let i = 0; i < patterns_l_die[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_l_die[hash][i]));
                                if (step_forward[2][0] === 0 && step_forward[2][1] === 0) {
                                    curr_row.push(Append(path, patterns_l_die[hash][i]));
                                }
                            }
                        } else {
                            for (let i = 0; i < patterns_l_live[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_l_live[hash][i]));
                                if (step_forward[2][0] === 0 && step_forward[2][1] === 0) {
                                    curr_row.push(Append(path, patterns_l_live[hash][i]));
                                }
                            }
                        }

                    }

                } else if (y === (g_g_height - 1)) {
                    if (x === 0) {
                        hash = GetHashCode(bottom_item(path[path.length - g_g_width]));
                        if (grid_goal[x][y] === 0) {
                            for (let i = 0; i < patterns_u_die[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_u_die[hash][i]));
                                if (step_forward[0][2] === 0 &&
                                    step_forward[1][2] === 0 &&
                                    step_forward[0][3] === 0 &&
                                    step_forward[1][3] === 0 &&
                                    step_forward[2][3] === 0 &&
                                    step_forward[0][4] === 0 &&
                                    step_forward[1][4] === 0 &&
                                    step_forward[2][4] === 0) {
                                    curr_row.push(Append(path, patterns_u_die[hash][i]));
                                }
                            }
                        } else {
                            for (let i = 0; i < patterns_u_live[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_u_live[hash][i]));
                                if (step_forward[0][2] === 0 &&
                                    step_forward[1][2] === 0 &&
                                    step_forward[0][3] === 0 &&
                                    step_forward[1][3] === 0 &&
                                    step_forward[2][3] === 0 &&
                                    step_forward[0][4] === 0 &&
                                    step_forward[1][4] === 0 &&
                                    step_forward[2][4] === 0) {
                                    curr_row.push(Append(path, patterns_u_live[hash][i]));
                                }
                            }
                        }

                    } else if (x === (g_g_width - 1)) {
                        //middle
                        hash = GetHashUL2(last_path, path[path.length - g_g_width]);
                        if (grid_goal[x][y] === 0) {
                            for (let i = 0; i < patterns_ul_die[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_ul_die[hash][i]));
                                if (step_forward[3][2] === 0 &&
                                    step_forward[4][2] === 0 &&
                                    step_forward[2][3] === 0 &&
                                    step_forward[3][3] === 0 &&
                                    step_forward[4][3] === 0 &&
                                    step_forward[2][4] === 0 &&
                                    step_forward[3][4] === 0 &&
                                    step_forward[4][4] === 0) {
                                    curr_row.push(Append(path, patterns_ul_die[hash][i]));
                                }
                            }
                        } else {
                            for (let i = 0; i < patterns_ul_live[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_ul_live[hash][i]));
                                if (step_forward[3][2] === 0 &&
                                    step_forward[4][2] === 0 &&
                                    step_forward[2][3] === 0 &&
                                    step_forward[3][3] === 0 &&
                                    step_forward[4][3] === 0 &&
                                    step_forward[2][4] === 0 &&
                                    step_forward[3][4] === 0 &&
                                    step_forward[4][4] === 0) {
                                    curr_row.push(Append(path, patterns_ul_live[hash][i]));
                                }
                            }
                        }

                    } else {
                        hash = GetHashUL2(last_path, path[path.length - g_g_width]);
                        if (grid_goal[x][y] === 0) {
                            for (let i = 0; i < patterns_ul_die[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_ul_die[hash][i]));
                                if (step_forward[2][3] === 0 &&
                                    step_forward[2][4] === 0) {
                                    curr_row.push(Append(path, patterns_ul_die[hash][i]));
                                }
                            }
                        } else {
                            for (let i = 0; i < patterns_ul_live[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_ul_live[hash][i]));
                                if (step_forward[2][3] === 0 &&
                                    step_forward[2][4] === 0) {
                                    curr_row.push(Append(path, patterns_ul_live[hash][i]));
                                }
                            }
                        }

                    }

                } else {
                    if (x === 0) {
                        hash = GetHashCode(bottom_item(path[path.length - g_g_width]));
                        if (grid_goal[x][y] === 0) {
                            for (let i = 0; i < patterns_u_die[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_u_die[hash][i]));
                                if (step_forward[0][2] === 0 &&
                                    step_forward[1][2] === 0) {
                                    curr_row.push(Append(path, patterns_u_die[hash][i]));
                                }
                            }
                        } else {
                            for (let i = 0; i < patterns_u_live[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_u_live[hash][i]));
                                if (step_forward[0][2] === 0 && step_forward[1][2] === 0) {
                                    curr_row.push(Append(path, patterns_u_live[hash][i]));
                                }
                            }
                        }

                    } else if (x === (g_g_width - 1)) {
                        hash = GetHashUL2(last_path, path[path.length - g_g_width]);
                        if (grid_goal[x][y] === 0) {
                            for (let i = 0; i < patterns_ul_die[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_ul_die[hash][i]));
                                if (step_forward[3][2] === 0 &&
                                    step_forward[4][2] === 0) {
                                    curr_row.push(Append(path, patterns_ul_die[hash][i]));
                                }
                            }
                        } else {
                            for (let i = 0; i < patterns_ul_live[hash].length; i++) {
                                step_forward = make_step_forward(pad(patterns_ul_live[hash][i]));
                                if (step_forward[3][2] === 0 && step_forward[4][2] === 0) {
                                    curr_row.push(Append(path, patterns_ul_live[hash][i]));
                                }
                            }
                        }

                    } else {
                        //search
                        hash = GetHashUL2(last_path, path[path.length - g_g_width]);
                        if (grid_goal[x][y] === 0) {
                            for (let i = 0; i < patterns_ul_die[hash].length; i++) {
                                curr_row.push(Append(path, patterns_ul_die[hash][i]));
                            }
                        } else {
                            for (let i = 0; i < patterns_ul_live[hash].length; i++) {
                                curr_row.push(Append(path, patterns_ul_live[hash][i]));
                            }
                        }

                    }

                }

            });

            //$('.progress-bar').css('g_g_width', ((progress_value / progress_max) * 100) + '%').attr('aria-valuenow', progress_value);
            console.log("Variations for (" + x + "," + y + ") :" + curr_row.length);
        }
    }
    console.log("choosing minimal...");
    all_rows = curr_row.slice(0);
    console.log("Reconstructing...");
    ReconstructPaths();
    console.log("Verifying...");
    VerifyResults(found_solutions, grid_goal);
}

function ReconstructPaths() {
    found_solutions = [];
    let cells_count = (g_g_width) * (g_g_height);
    let temp;
    all_rows.forEach(function (path) {

        temp = make2DArray(g_g_width + 2, g_g_height + 2);
        for (let i = 0; i < cells_count; i++) {

            temp = fill_wide_grid(temp,
                path[i],
                [i % g_g_width, i / g_g_width]);
        }

        found_solutions.push(temp);

    });


}


