let started = false;
let duration = 5000; // miliseconds
let series = 2;
let current_picker = 0;
let starttime = 0; // miliseconds
let font_size = 20;
let time_changes = [1000, 60, 60, 24];
let padding = 50;
let current_serie = 0;
let is_mobile = is_mob();
let mobile_clicked = false;
let mobile_released = false;

function beep_serie() {
    let sound = new Audio("serie.mp3");
    sound.play();
}

function beep_state() {
    let sound = new Audio("state.mp3");
    sound.play();
}

function parse_time(milliseconds) {
    let days = floor(milliseconds / (24 * 60 * 60 * 1000));
    milliseconds %= (24 * 60 * 60 * 1000);
    let hours = floor(milliseconds / (60 * 60 * 1000));
    milliseconds %= (60 * 60 * 1000);
    let minutes = floor(milliseconds / (60 * 1000));
    milliseconds %= (60 * 1000);
    let seconds = milliseconds / (1000);
    return {days, hours, minutes, seconds};
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
}

function draw() {
    if (is_mobile && (!mobile_clicked || !mobile_released)) {
        background(100, 100, 200);
        textAlign(CENTER);
        textSize(font_size);
        text("Pressione na tela para começar", width / 2, height / 2);
        if (mouseIsPressed) {
            mobile_clicked = true;
        } else if (mobile_clicked && !mouseIsPressed) {
            mobile_released = true;
        }
        if (mobile_clicked){
            text("Solte a tela para começar", width / 2, height / 2 + font_size * 3);

        }
    } else {
        background(0);
        if (started) {
            if (millis() - starttime > duration) {
                //serie is over
                current_serie++;
                if (current_serie < series) {
                    beep_serie();
                    starttime = millis();
                } else {
                    beep_state();
                    started = false;
                }
            } else {
                let clock_size = min(width, height) - padding;

                let serie_time_left = duration - (millis() - starttime);
                let total_time_left = (series - current_serie - 1) * duration + duration - (millis() - starttime);

                let parsed_left = parse_time(serie_time_left);
                let parsed_total_left = parse_time(total_time_left);

                let p_serie = serie_time_left / duration;
                let p_total = total_time_left / (duration * series);

                //total
                noStroke();
                fill(100, 100, 200, 100);
                arc(width / 2, height / 2, clock_size, clock_size, -90, lerp(270, -90, 1 - p_total));
                //parcial
                noStroke();
                fill(255, 0, 0);
                arc(width / 2, height / 2, clock_size, clock_size, -90, lerp(270, -90, 1 - p_serie));
                noStroke();
                fill(255);
                textAlign(CENTER);
                textSize(font_size);
                text(`Serie: ${current_serie + 1}/${series}`,
                    width / 2, height / 2 - font_size * 3);
                text(`${parsed_left['days'].toString().padStart(3, "0")}:${parsed_left['hours'].toString().padStart(2, "0")}:${parsed_left['minutes'].toString().padStart(2, "0")}:${parsed_left['seconds'].toFixed(2).padStart(5, "0")}`,
                    width / 2, height / 2);
                text(`${parsed_total_left['days'].toString().padStart(3, "0")}:${parsed_total_left['hours'].toString().padStart(2, "0")}:${parsed_total_left['minutes'].toString().padStart(2, "0")}:${parsed_total_left['seconds'].toFixed(2).padStart(5, "0")}`,
                    width / 2, height / 2 + font_size * 3);
            }

            if (is_mobile) {
                draw_mobile_arrows(true);
                handle_arrows();
            }
        } else {
            // not started
            fill(255);
            noStroke();
            textAlign(CENTER);
            textSize(font_size);
            if (is_mobile) {
                text("Utilize os quadrados para alterar", width / 2, height / 2 - font_size);
            } else {
                text("Utilize as setas para alterar", width / 2, height / 2 - font_size);
            }
            let parsed_duration = parse_time(duration);
            text(`Series: ${current_picker === 4 ? '*' : ''}${series}${current_picker === 4 ? '*' : ''}`, width / 2, height / 2 + font_size);
            text(`Duração: ${current_picker === 3 ? '*' : ''}${parsed_duration['days'].toString().padStart(3, "0")}${current_picker === 3 ? '*' : ''}:${current_picker === 2 ? '*' : ''}${parsed_duration['hours'].toString().padStart(2, "0")}${current_picker === 2 ? '*' : ''}:${current_picker === 1 ? '*' : ''}${parsed_duration['minutes'].toString().padStart(2, "0")}${current_picker === 1 ? '*' : ''}:${current_picker === 0 ? '*' : ''}${parsed_duration['seconds'].toString().padStart(2, "0")}${current_picker === 0 ? '*' : ''}`,
                width / 2, height / 2 + font_size * 2);
            text("Pressione ESPAÇO para iniciar", width / 2, height / 2 + font_size * 3);
            if (is_mobile) {
                draw_mobile_arrows();
            }
            handle_arrows();
        }
    }
}

function is_inside_rect(x, y, rx, ry, rw, rh) {
    return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh
}

function rects_pos(n) {
    if (n >= 0 && n < 5) {
        let xs = width / 5;
        let ys = height / 5;

        switch (n) {
            case 0:
                return [xs * 2, 0, xs, ys];
            case 1:
                return [0, ys * 2, xs, ys];
            case 2:
                return [xs * 4, ys * 2, xs, ys];
            case 3:
                return [xs * 2, ys * 4, xs, ys];
            case 4:
                return [xs * 2, ys * 2, xs, ys];
        }
    } else {
        throw Error("Invalid n")
    }
}

function draw_mobile_arrows(only_center = false) {
    noStroke();
    if (!only_center) {
        //corners
        fill(255, 0, 0, 150);
        for (let i = 0; i < 4; i++) {
            rect(...rects_pos(i));
        }
    }
    //center
    fill(255, 255, 0, 100);
    rect(...rects_pos(4));
}

function start() {
    if (!started) {
        starttime = millis();
        current_serie = 0;
        beep_state();
    }
    started = !started;
}

function upPicker() {
    console.log("up picker");
    if (current_picker < 4) current_picker++;

}

function downPicker() {
    console.log("down picker");
    if (current_picker > 0) current_picker--;
}

function handle_arrows() {
    if (is_mobile) {
        // not mobile
        if (mouseIsPressed) {
            if (!started) {
                if (is_inside_rect(mouseX, mouseY, ...rects_pos(0))) upDuration();
                if (is_inside_rect(mouseX, mouseY, ...rects_pos(1))) upPicker();
                if (is_inside_rect(mouseX, mouseY, ...rects_pos(2))) downPicker();
                if (is_inside_rect(mouseX, mouseY, ...rects_pos(3))) downDuration();
            }
            if (is_inside_rect(mouseX, mouseY, ...rects_pos(4))) start();

            let t = millis();

            while (millis() - t < 275) {
                if (
                    !is_inside_rect(mouseX, mouseY, ...rects_pos(0)) &&
                    !is_inside_rect(mouseX, mouseY, ...rects_pos(1)) &&
                    !is_inside_rect(mouseX, mouseY, ...rects_pos(2)) &&
                    !is_inside_rect(mouseX, mouseY, ...rects_pos(3)) &&
                    !is_inside_rect(mouseX, mouseY, ...rects_pos(4))
                ) break;
            }
        }
    } else {
        // not mobile
        if (keyIsDown(UP_ARROW)) upDuration();
        if (keyIsDown(DOWN_ARROW)) downDuration();
        if (keyIsDown(LEFT_ARROW)) upPicker();
        if (keyIsDown(RIGHT_ARROW)) downPicker();

        let t = millis();
        while (millis() - t < 90) {
            if (
                !keyIsDown(UP_ARROW) &&
                !keyIsDown(DOWN_ARROW) &&
                !keyIsDown(LEFT_ARROW) &&
                !keyIsDown(RIGHT_ARROW)
            ) break;
        }
    }
}

function upDuration() {
    console.log("up duration");
    if (current_picker === 4) {
        // mudar series
        series++;
    } else {
        // mudar tempo
        let amt = time_changes.reduce((acc, val, ind) => ind <= current_picker ? acc * val : acc, 1);
        duration += amt;
    }
}

function downDuration() {
    console.log("down duration");
    if (current_picker === 4) {
        // mudar series
        series--;
        if (series < 1) series = 1;
    } else {
        // mudar tempo
        let amt = time_changes.reduce((acc, val, ind) => ind <= current_picker ? acc * val : acc, 1);
        duration -= amt;
        if (duration < 0) duration = 0;
    }
}

function keyPressed(e) {
    if (e.keyCode === 32) {
        e.preventDefault();
        start();
    }
}

function is_mob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    is_mobile = is_mob();
}


