let grid;
let size = 500;
let input_cells = 3;
let drawThings;
let oneStep;

var sketch_forward = function (p) {
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
            for (let j = 0; j < input_cells; j++) {
                let x = i * resolution;
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
            grid[x][y] = !grid[x][y];
        }
    }
};


let sketch_reverse = function (p) {
    let output_cells = input_cells + 2;
    let grids_array = [];
    let value;
    p.setup = function () {
        p.noLoop();
        document.getElementById("btn_calc_back").onclick = function () {
            grids_array = TestMe(grid);
            refill();
        };
        p.frameRate(15);
        p.createCanvas(size, size);

        //$("#variantsSelect").selectpicker("refresh");

    };

    function refill() {
        for (let i = 0; i < grids_array.length; i++) {
            $("#variantsSelect").append('<option value="' + i + '">' + i + '</option>');
        }
        $("#variantsSelect").change(function () {
            value = int($("#variantsSelect").find(":selected").val());
            p.redraw();
        });
        $("#variantsSelect").val(0);
    }

    p.draw = function () {
        if (grids_array.length > 0) {
            p.background(255);
            let resolution = size / output_cells;

            let output_grid = grids_array[int(value)];
            for (let i = 0; i < output_cells; i++) {
                for (let j = 0; j < output_cells; j++) {
                    let x = i * resolution;
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
    //TestMe([[1,0,0],[0,1,1],[1,1,0]]);
    var output_p5 = new p5(sketch_reverse, 'output_grid');
    for (let i = 3; i <= 10; i++) {
        $("#gridSizeSelect").append('<option value="' + i + '">' + i + "x" + i + '</option>');
    }
    //$("#gridSizeSelect").val(0);
    $("#gridSizeSelect").change(function () {
        input_cells = int($("#gridSizeSelect").find(":selected").val());
        grid = make2DArray(input_cells, input_cells);
        input_p5.redraw();
        output_p5.redraw();
    });


    document.getElementById("btn_start").onclick = function () {
        drawThings = true;
    };
    document.getElementById("btn_stop").onclick = function () {
        drawThings = false;
    };
    document.getElementById("btn_step").onclick = function () {
        oneStep = true;
    };

    document.getElementById("btn_random").onclick = function () {
        grid = make2DArray(input_cells, input_cells);
        for (let i = 0; i < input_cells; i++) {
            for (let j = 0; j < input_cells; j++) {
                grid[i][j] = Math.floor(random(2));
            }
        }
        input_p5.redraw();
    };
}


function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows).fill(0);
    }
    return arr;
}