function hexToHSL(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    var HSL = new Object();
    HSL['h'] = h * 360;
    HSL['s'] = s * 100;
    HSL['l'] = l * 100;
    return HSL;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function color(color) {
    electronAPI.setTitle({
        color: `rgb(${color}, ${color}, ${color})`
    })
    return hexToHSL(rgbToHex(Number(color), Number(color), Number(color)))
}

function HSLToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function contrastColor(hex, up) {
    let HSL = hexToHSL(hex)
    if (HSL.h != 0 && HSL.s != 0) {
        if (HSL.l <= 50) {
            if (HSL.s >= 20) HSL.s = HSL.s - 20
            if (HSL.h >= 2) HSL.h = HSL.h - 2
        } else {
            if (HSL.s <= 80) HSL.s = HSL.s + 20
            if (HSL.h <= 358) HSL.h = HSL.h + 2
        }
    }
    HSL.l = up ? HSL.l + 10.196078431372555 : HSL.l - 10.196078431372555
    let newHSL = HSLToHex(HSL.h, HSL.s, HSL.l)
    return newHSL
}

function setColor(hex) {
    electronAPI.setTitle({
        color: hex
    })
    document.getElementById('topLeft').style.backgroundColor = contrastColor(hex, false)
}

function randHex() {
    var hex = Math.floor(Math.random() * 16777215).toString(16)
    hex = "#" + ("000000" + hex).slice(-6)
    return hex
}

function visualizeColor(color) {
    console.log('%c   ', 'color: black; background-color: ' + color)
}