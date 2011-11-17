var defaults = {
    w: 64,
    h: 64,
    s: 3,
    a: 5,
    g: 5,
    scale: 8,
};
var ctx, obj;
var going = false;
function array_2d(rows, cols, value) {
    var a = new Array(rows);
    var j, i;
    for(j = 0; j < rows; j++) {
        a[j] = new Array(cols);
        for(i = 0; i < cols; ++i) {
            a[j][i] = value;
        }
    }
    return a;
}

// arr[j][i] <  0 --> refactory
// arr[j][i] == 0 --> resting
// arr[j][i] >  0 --> excited

// s = resting -> active threshold
// a = number of active states
// g = number of refactory states

function calculate(a1, a2, w, h, s, a, g) {
    var j, i, ex;
    for(j = 0; j < h; ++j) {
        for(i = 0; i < w; ++i) {
            ex = 0;
            if(a1[j][i] != 0) {
                a2[j][i] = a1[j][i] + 1;
                if(a2[j][i] > a) {
                    a2[j][i] = -g;
                }
            } else {
                if(j > 0) {
                    if(i > 0) {
                        ex += (a1[j-1][i-1] > 0);
                    }
                    ex += (a1[j-1][i] > 0);
                    if(i < w-1) {
                        ex += (a1[j-1][i+1] > 0);
                    }
                }
                if(i > 0)
                    ex += (a1[j][i-1] > 0);
                if(i < w-1)
                    ex += (a1[j][i+1] > 0);
                if(j < h-1) {
                    if(i > 0) {
                        ex += (a1[j+1][i-1] > 0);
                    }
                    ex += (a1[j+1][i] > 0);
                    if(i < w-1) {
                        ex += (a1[j+1][i+1] > 0);
                    }
                }
                if(ex >= s) {
                    a2[j][i] = 1;
                } else {
                    a2[j][i] = 0;
                }
            }
        }
    }
}
function Automaton(w, h, s, a, g) {
    this.counter = 0;
    this.a1 = array_2d(h, w, 0);
    this.a2 = array_2d(h, w, 0);
    this.w = w;
    this.h = h;
    this.s = s;
    this.a = a;
    this.g = g;
}
Automaton.prototype.step = function() {
    ++this.counter;
    if(this.counter % 2) {
        calculate(this.a1, this.a2, this.w, this.h, this.s, this.a, this.g);
    } else {
        calculate(this.a2, this.a1, this.w, this.h, this.s, this.a, this.g);
    }
};
Automaton.prototype.draw = function(ctx) {
    var j, i;
    var a = (this.counter % 2 ? this.a2 : this.a1);
    var rcolors = [];
    for(i = 1; i <= this.g; ++i) {
        rcolors[i] = parseInt(i/this.g*255);
    }
    var acolors = [];
    for(i = 1; i <= this.a; ++i) {
        acolors[i] = parseInt(i/this.a*255);
    }
    for(j = 0; j < this.h; ++j) {
        for(i = 0; i < this.w; ++i) {
            if(a[j][i] == 0) {
                ctx.fillStyle = "#000";
            } else if(a[j][i] > 0) {
                ctx.fillStyle = "rgb(" + (acolors[a[j][i]]) + ",0,0)";
            } else {
                ctx.fillStyle = "rgb(0,0," + (rcolors[-a[j][i]]) + ")";
            }
            ctx.fillRect(i, j, 1, 1);
        }
    }
};
Automaton.prototype.clear = function() {
    var j, i;
    for(j = 0; j < this.h; ++j) {
        for(i = 0; i < this.w; ++i) {
            this.a1[j][i] = 0;
            this.a2[j][i] = 0;
        }
    }
    this.counter = 0;
};
Automaton.prototype.fill_random = function() {
    var j, i;
    for(j = 0; j < this.h; ++j) {
        for(i = 0; i < this.w; ++i) {
            this.a1[j][i] = parseInt(Math.random()*(this.a+this.g))-this.g;
        }
    }
    this.counter = 0;
};
function loop() {
    obj.step();
    obj.draw(ctx);
    if(going) {
        setTimeout(loop, 50);
    }
}
function reset() {
    document.getElementById("s").value = defaults.s;
    document.getElementById("a").value = defaults.a;
    document.getElementById("g").value = defaults.g;
    update_settings();
}
function start() {
    going = true;
    document.getElementById("start").disabled = "disabled";
    document.getElementById("stop").removeAttribute("disabled");
    document.getElementById("step").disabled = "disabled";
    loop();
}
function stop() {
    going = false;
    document.getElementById("stop").disabled = "disabled";
    document.getElementById("start").removeAttribute("disabled");
    document.getElementById("step").removeAttribute("disabled");
}
function step() {
    if(!going) {
        loop();
    }
}
function highlight_apply_button() {
    document.getElementById("apply").className = "clickme";
}
function update_settings() {
    document.getElementById("apply").className = "";
    var s = parseInt(document.getElementById("s").value);
    var a = parseInt(document.getElementById("a").value);
    var g = parseInt(document.getElementById("g").value);
    if(isNaN(s) || isNaN(a) || isNaN(g)) {
        alert("Noooooooooooooooo!");
    } else {
        obj.s = s;
        obj.a = a;
        obj.g = g;
    }
    return false;
}
function save() {
    stop();
    document.getElementById("blackouter").className = "blackout";
    var b = document.getElementById("savebox");
    b.innerHTML = "<p>Right click on the image below and click <q>Save Image As</q> to save it.</p><p><a href='javascript:void 0'><strong>Close this window</strong></a> when you're done.</p>"
                                + '<img alt="[image]" src="' + document.getElementById("canvas").toDataURL() + '" />';
    b.className = "popup";
    b.getElementsByTagName("a")[0].onclick = function() {
        document.getElementById("blackouter").className = "";
        document.getElementById("savebox").className = "";
        document.getElementById("savebox").innerHTML = "";
        window.scrollTo(0, 0);
        return false;
    };
}
function load() {
    var canvas = document.getElementById("canvas");
    if(canvas.getContext) {
        document.forms[0].onsubmit = update_settings;
        document.getElementById("random").onclick = function() { obj.fill_random(); if(!going) obj.draw(ctx); };
        document.getElementById("clear").onclick = function() { obj.clear(); if(!going) obj.draw(ctx); };
        document.getElementById("reset").onclick = reset;
        document.getElementById("start").onclick = start;
        document.getElementById("stop").onclick = stop;
        document.getElementById("step").onclick = step;
        document.getElementById("save").onclick = save;
        var controls = document.getElementById("controls").getElementsByTagName("input");
        for(var i = 0; i < controls.length; ++i) {
            controls[i].onchange = highlight_apply_button;
            controls[i].onkeypress = highlight_apply_button;
        }
        document.getElementById("s").value = defaults.s;
        document.getElementById("a").value = defaults.a;
        document.getElementById("g").value = defaults.g;
        canvas.setAttribute("width", defaults.w*defaults.scale);
        canvas.setAttribute("height", defaults.h*defaults.scale);
        ctx = canvas.getContext("2d");
        ctx.scale(defaults.scale, defaults.scale);
        obj = new Automaton(defaults.w, defaults.h, defaults.s, defaults.a, defaults.g);
        obj.fill_random();
        start();
    }
}
window.onload = load;
