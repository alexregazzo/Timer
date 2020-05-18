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
// let current_time = 0;
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
            noStroke();
            fill(255, 0, 0);
            let clock_size = min(width / 2, height / 2);

            let p = (millis() - starttime) / duration;
            arc(width / 2, height / 2, clock_size, clock_size, -90, lerp(270, -90, p));
            noStroke();
            fill(255);
            textAlign(CENTER);
            textSize(font_size);
            text(`Serie: ${current_serie + 1}`, width / 2, height / 2);
            let parsed_left = parse_time(duration - (millis() - starttime));
            text(`${parsed_left['days'].toString().padStart(3, "0")}:${parsed_left['hours'].toString().padStart(2, "0")}:${parsed_left['minutes'].toString().padStart(2, "0")}:${parsed_left['seconds'].toFixed(2).padStart(5, "0")}`, width / 2, height / 2 + font_size);
        }

    } else {
        // not started
        fill(255);
        noStroke();
        textAlign(CENTER);
        textSize(font_size);
        text("Utilize as setas para cima e para baixo para alterar o tempo", width / 2, height / 2);
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

    while (millis() - t < 75) {
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
        if (series < 0) series = 0;
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



