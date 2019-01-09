let grid;
let size = 500;
let input_cells = 3;
let drawThings;
let oneStep;


let output_grid = [];
let output_cells = input_cells + 2;
let grids_array = [];

const sketch_forward = function (p) {
    let resolution;
    p.setup = function () {
        p.frameRate(15);
        p.createCanvas(size, size);

        grid = make2DArray(input_cells, input_cells);
        for (let i = 0; i < input_cells; i++) {
            for (let j = 0; j < input_cells; j++) {
                grid[i][j] = p.floor(random(2));
            }
        }
    };

    p.draw = function () {
        resolution = size / input_cells;
        p.background(255);

        for (let i = 0; i < input_cells; i++) {
            let x = i * resolution;
            p.line(0, x, x + size, x);
            p.line(x, 0, x, x + size);
            for (let j = 0; j < input_cells; j++) {

                let y = j * resolution;
                if (grid[i][j]) {
                    p.fill(0);
                    p.stroke(0);
                    p.rect(x, y, resolution - 1, resolution - 1);
                }
            }
        }
        if (drawThings || oneStep) {
            oneStep = false;
            grid = make_step_forward(grid);
        }
    };

    p.mouseClicked = function () {
        if (Math.abs(Math.floor(p.mouseY)) <= size && Math.abs(Math.floor(p.mouseX)) <= size) {
            let y = p.floor(p.mouseY / resolution);
            let x = p.floor(p.mouseX / resolution);
            grid[x][y] = int(!grid[x][y]);
        }
    }
};


let sketch_reverse = function (p) {
    $("#btn_calc_back").on("click", function () {
        $("#coverScreen").show();
        setTimeout(function () {
            output_cells = input_cells + 2;
            grids_array = TestMe(grid);
            refill();
            $("#coverScreen").hide();
        }, 300);
    });
    $("#variantsSelect").change(function () {
        let value = int($("#variantsSelect").find(":selected").val());
        output_grid = grids_array[int(value)];
        p.redraw();
    });

    p.setup = function () {
        p.noLoop();
        p.frameRate(15);
        p.createCanvas(size, size);
    };

    function refill() {
        for (let i = 0; i < grids_array.length; i++) {
            $("#variantsSelect").append('<option value="' + i + '">' + i + '</option>').val(0);
        }
        output_grid = grids_array[0];
        p.redraw();
    }

    p.draw = function () {
        if (grids_array.length > 0) {
            p.background(255);
            let resolution = size / output_cells;

            for (let i = 0; i < output_cells; i++) {
                let x = i * resolution;

                p.line(0, x, x + size, x);
                p.line(x, 0, x, x + size);
                for (let j = 0; j < output_cells; j++) {

                    let y = j * resolution;
                    if (output_grid[i][j]) {
                        p.fill(0);
                        p.stroke(0);
                        p.rect(x, y, resolution - 1, resolution - 1);
                    }
                }
            }
        }
    };
};

function setup() {
    const input_p5 = new p5(sketch_forward, 'input_grid');
    const output_p5 = new p5(sketch_reverse, 'output_grid');
    for (let i = 3; i <= 8; i++) {
        $("#gridSizeSelect").append('<option value="' + i + '">' + i + "x" + i + '</option>');
    }
    $("#gridSizeSelect").change(function () {
        input_cells = int($("#gridSizeSelect").find(":selected").val());
        grid = make2DArray(input_cells, input_cells);
        for (let i = 0; i < input_cells; i++) {
            for (let j = 0; j < input_cells; j++) {
                grid[i][j] = Math.floor(random(2));
            }
        }
        input_p5.redraw();
        output_p5.redraw();
    });

    $("#btn_start").on("click", function () {
        drawThings = true;
    });


    $("#btn_stop").on("click", function () {
        drawThings = false;
    });
    $("#btn_step").on("click", function () {
        oneStep = true;
    });

    $("#btn_clear").on("click", function () {
        grid = make2DArray(input_cells, input_cells);
        for (let i = 0; i < input_cells; i++) {
            grid[i].fill(0);
        }
        input_p5.redraw();
    });

    $("#coverScreen").hide();
}


function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows).fill(0);
    }
    return arr;
}