function beep_serie() {
    let sound = new Audio("serie.mp3");
    sound.play();
}

function beep_state() {
    let sound = new Audio("state.mp3");
    sound.play();
}

let started = false;
let duration = 10000; // miliseconds
let series = 2;
let current_picker = 0;
let starttime = 0; // miliseconds
let font_size = 20;
let time_changes = [1000, 60, 60, 24];
let padding = 50;
let current_serie = 0;


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

            noStroke();
            fill(0, 0, 255, 100);
            arc(width / 2, height / 2, clock_size, clock_size, -90, lerp(270, -90, 1 - p_total));
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
    } else {
        // not started
        fill(255);
        noStroke();
        textAlign(CENTER);
        textSize(font_size);
        text("Utilize as setas para cima e para baixo para alterar o tempo e a quantidade de serie", width / 2, height / 2 - font_size * 2);
        text("Utilize as setas para esquerda e para direita para alterar o que será alterado", width / 2, height / 2 - font_size);
        let parsed_duration = parse_time(duration);
        text(`Series: ${current_picker === 4 ? '*' : ''}${series}${current_picker === 4 ? '*' : ''}`, width / 2, height / 2 + font_size);
        text(`Duração: ${current_picker === 3 ? '*' : ''}${parsed_duration['days'].toString().padStart(3, "0")}${current_picker === 3 ? '*' : ''}:${current_picker === 2 ? '*' : ''}${parsed_duration['hours'].toString().padStart(2, "0")}${current_picker === 2 ? '*' : ''}:${current_picker === 1 ? '*' : ''}${parsed_duration['minutes'].toString().padStart(2, "0")}${current_picker === 1 ? '*' : ''}:${current_picker === 0 ? '*' : ''}${parsed_duration['seconds'].toString().padStart(2, "0")}${current_picker === 0 ? '*' : ''}`,
            width / 2, height / 2 + font_size * 2);
        text("Pressione ESPAÇO para iniciar", width / 2, height / 2 + font_size * 3);
        handle_arrows();
    }
}

function start() {
    if (!started) {
        starttime = millis();
        current_serie = 0;
        beep_state();
    }
    started = !started;

}

function handle_arrows() {
    if (keyIsDown(UP_ARROW)) {
        upDuration();
    }
    if (keyIsDown(DOWN_ARROW)) {
        downDuration()
    }
    if (keyIsDown(LEFT_ARROW)) {
        if (current_picker < 4) current_picker++;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        if (current_picker > 0) current_picker--;
    }
    let t = millis();

    while (millis() - t < 90) {
        if (!keyIsDown(UP_ARROW) && !keyIsDown(DOWN_ARROW) && !keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)){
            break;
        }

    }
}

function upDuration() {
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



