// Assign dom elements to variables
var canvas = document.getElementById("drawing-canvas"),
    expression_view = document.getElementById("expression-container"),
    working_area = document.getElementById("working-area"),
    first_number_view = document.getElementById("first-number"),
    second_number_view = document.getElementById("second-number"),
    result_input = document.getElementById("third-number"),
    ctx = canvas.getContext("2d");

// Configuration object containing project properties
var config = {
    axis_zero_y : canvas.height - 4,
    axis_left_margin : 0,
    axis_part_interval_length : 39,
    first_arrow_height : 200,
    second_arrow_height : 150
}

// Generate math expression
var expression = {  a : getRandomIntInRange(6, 9),
                    result : getRandomIntInRange(11, 14)};

expression.b = expression.result - expression.a;

// Show expression on page
initExpressionView();
var arrow_1_middle_point_info, arrow_2_middle_point_info, input_1, input_2;
arrow_1_middle_point_info = drawCurvedArrow(0, expression.a, config.first_arrow_height);
input_1 = generateArrowInput(arrow_1_middle_point_info.middle_x, arrow_1_middle_point_info.arrow_height);
input_1.oninput = onFirstInputChanged;

function onFirstInputChanged() {
        if (input_1.value == expression.a) {
            // If first answer is correct
            // Disable input
            input_1.readOnly = true;
            input_1.style.color = "black";
            input_1.style.borderWidth = "0px";
            // Revert mistake showing
            first_number_view.style.backgroundColor = "white";
            // Draw arrow and save middle point info for input positioning
            arrow_2_middle_point_info = drawCurvedArrow(expression.a, expression.result, config.second_arrow_height);
            // Generate input and assign on input change function
            input_2 = generateArrowInput(arrow_2_middle_point_info.middle_x, arrow_2_middle_point_info.arrow_height);
            input_2.oninput = onSecondInputChanged;
        } else {
            // If first answer is wrong
            // Highlight input with red
            input_1.style.color = "red";
            // Highlight number in expression with orange
            first_number_view.style.backgroundColor = "orange";
        }
}

function onSecondInputChanged() {
    if (input_2.value == expression.b) {
        // Second answer is correct
        input_2.readOnly = true;
        input_2.style.color = "black";
        input_2.style.borderWidth = "0px";
        second_number_view.style.backgroundColor = "white";
        result_input.readOnly = false;
        result_input.style.borderWidth = "2px";
        result_input.value = ""
        result_input.oninput = onResultInputChanged;
    } else {
        input_2.style.color = "red";
        second_number_view.style.backgroundColor = "orange";
    }
}

function onResultInputChanged() {
    if (result_input.value == expression.result) {
        // Result answer is correct
        result_input.readOnly = true;
        result_input.style.color = "black";
        result_input.style.borderWidth = "0px";
    } else {
        result_input.style.color = "red";
    }
}

function generateArrowInput(x, y) {
    // Create input element in the DOM and position it according to arrow shape
    var input = document.createElement("input");
    working_area.appendChild(input);
    input.type = Text;
    input.classList.add("input-arrow");
    input.maxLength = 1;
    input.style.left = String(x + 40 - input.offsetWidth / 2) + "px";
    input.style.bottom = String(y * 0.5 + 57) + "px";
    
    return input;
}

function drawCurvedArrow(number_1, number_2, arrow_height, arrow_head_radius = 18, arrow_head_length = 20, bodyWidth = 3, headWidth = 2) {
    // Draw arrow with Bezier curve based on three points
    var x1 = config.axis_left_margin + number_1 * config.axis_part_interval_length;
    var x3 = config.axis_left_margin + number_2 * config.axis_part_interval_length;
    var x2 = Math.abs((x3+x1)/2);
    // Draw arrow body
    ctx.strokeStyle = "red";
    ctx.lineWidth = bodyWidth;
    ctx.beginPath();
    ctx.bezierCurveTo(x1, config.axis_zero_y, x2, config.axis_zero_y - arrow_height, x3, config.axis_zero_y);
    ctx.stroke();
    // Draw arrow head
    ctx.lineWidth = headWidth;
    midPoint = {x: x3, y:config.axis_zero_y};
    drawArrowHeadSide(arrow_head_radius);
    drawArrowHeadSide(-arrow_head_radius);

    function drawArrowHeadSide(rotationRadius = 0) {
        ctx.save();
        ctx.translate(midPoint.x, midPoint.y);
        ctx.rotate(Math.atan2(arrow_height, x3-x2) + rotationRadius / 180 * Math.PI);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrow_head_length, 0)
        ctx.stroke();
        ctx.restore();
    }
    return {middle_x : x2, arrow_height: arrow_height};
}

function initExpressionView() {
    first_number_view.innerHTML = expression.a;
    second_number_view.innerHTML = expression.b;
    result_input.value = "?";
}

function getRandomIntInRange(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}