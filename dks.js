import { gsap } from '/node_modules/gsap/index.js';
const pi = Math.PI;
const canvas = document.getElementById('canvas');
const pre = document.getElementById('pre');
let c = canvas.getContext('2d');
let p = pre.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
pre.width = innerWidth;
pre.height = innerHeight;
const no = document.getElementsByClassName("no")[0];
const dabbi = document.getElementsByClassName("dabbi")[0];
const bigscr = document.getElementsByClassName("bigscr")[0];
const start = document.getElementsByClassName("start")[0];
const btn = document.getElementsByClassName("btn")[0];
const main = document.getElementsByClassName("main")[0];
const welcome = document.getElementsByClassName("welcome")[0];
let score = 0;
let colarr = [
    "#EFEFEF", "#FFCC00", "#FF5722", "white", "red", "blue", "purple", "pink"
];
function polar(angle, radius = 1) {
    let coord = {
        cos: Math.cos(angle) * radius,
        sin: Math.sin(angle) * radius
    }
    return coord;
}
function rand(max, min = 0) {
    return min + Math.random() * (max - min);
}
class Player {
    constructor(x, y, r, col) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.col = col;
        this.update = () => {
            this.draw();
        };
        this.draw = () => {
            c.save();
            c.beginPath();
            c.arc(this.x, this.y, this.r, 0, 2 * pi);
            c.shadowColor = this.col;
            c.shadowBlur = 10;
            c.fillStyle = gradient;
            c.fill();
            c.closePath();
            c.restore();
        }
    }
}
class Projectile {
    constructor(x, y, r, col, velocity) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.col = col;
        this.velocity = velocity;
        this.update = () => {
            this.draw();
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        };
        this.draw = () => {
            c.beginPath();
            c.arc(this.x, this.y, this.r, 0, 2 * pi);
            c.fillStyle = this.col;
            c.fill();
            c.closePath();
        }
    }
}
class Enemy {
    constructor(x, y, r, col, velocity) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.col = col;
        this.velocity = velocity;
        this.update = () => {
            this.draw();
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        };
        this.draw = () => {
            c.beginPath();
            c.arc(this.x, this.y, this.r, 0, 2 * pi);
            c.fillStyle = this.col;
            c.fill();
            c.closePath();
        }
    }
}
class Dot {
    constructor(x, y, r, col) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.col = col;
        this.update = () => {
            this.draw();
        };
        this.draw = () => {
            c.beginPath();
            c.arc(this.x, this.y, this.r, 0, 2 * pi);
            c.fillStyle = colarr[this.col];
            c.fill();
            c.closePath();
        }
    }
}
class pDot {
    constructor(x, y, r, col) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.col = col;
        this.update = () => {
            this.draw();
        };
        this.draw = () => {
            p.beginPath();
            p.arc(this.x, this.y, this.r, 0, 2 * pi);
            p.fillStyle = colarr[this.col];
            p.fill();
            p.closePath();
        }
    }
}
let pdots = [];
const len = 300;
for (let i = 0; i < len; i++) {
    pdots.push(new pDot(rand(canvas.width), rand(canvas.height), rand(1.2, 0.5), Math.floor(rand(colarr.length))))
}
pdots.forEach((e) => {
    e.update();
})
class Particle {
    constructor(x, y, r, col, velocity) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.col = col;
        this.velocity = velocity;
        this.alpha = 1;
        this.friction = 0.99;
        this.update = () => {
            this.draw();
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.005;
        };
        this.draw = () => {
            c.save();
            c.globalAlpha = this.alpha;
            c.beginPath();
            c.arc(this.x, this.y, this.r, 0, 2 * pi);
            c.fillStyle = this.col;
            c.fill();
            c.closePath();
            c.restore();
        }
    }
}
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
})
const playerRadius = 32;
const gradient = c.createLinearGradient(canvas.width / 2, canvas.height / 2 - playerRadius, canvas.width / 2, canvas.height / 2 + playerRadius);
gradient.addColorStop(0, "white");
gradient.addColorStop(0.3, 'yellow')
gradient.addColorStop(1, "orange");
let player = new Player(canvas.width / 2, canvas.height / 2, playerRadius, 'orange');
let projectiles = [];
let enemies = [];
let particles = [];
let dots = [];
const Prospeed = 7;
function init() {
    enemies = [];
    projectiles = [];
    particles = [];
    player = new Player(canvas.width / 2, canvas.height / 2, playerRadius, 'orange');
    dots = [];
    const len = 300;
    for (let i = 0; i < len; i++) {
        dots.push(new Dot(rand(canvas.width), rand(canvas.height), rand(1.2, 0.5), Math.floor(rand(colarr.length))))
    }
}
function spawnEnemies() {
    setInterval(() => {
        let x;
        let y;
        const radius = rand(8, 30);
        if (rand(1) < 0.5) {
            x = rand(1) < 0.5 ? 0 - radius : canvas.width + radius;
            y = rand(canvas.height);
        }
        else {
            x = rand(canvas.width);
            y = rand(1) < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const col = `hsl(${rand(360)},100%,50%)`;
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const velocity = {
            x: polar(angle).cos,
            y: polar(angle).sin
        }
        enemies.push(new Enemy(x, y, radius, col, velocity))
    }, 1000)
}
window.addEventListener('click', (e) => {
    let x = e.clientX;
    let y = e.clientY;
    const angle = Math.atan2(-canvas.height / 2 + y, -canvas.width / 2 + x);
    const velocity = {
        x: polar(angle, Prospeed).cos,
        y: polar(angle, Prospeed).sin
    }
    projectiles.push(new Projectile(canvas.width / 2 + playerRadius * polar(angle).cos,
        canvas.height / 2 + playerRadius * polar(angle).sin, 5, 'red',
        velocity));
})
start.addEventListener('click', () => {
    dabbi.style.display = "none";
    init();
    animate();
    no.innerHTML = score;
    score = 0;
})
btn.addEventListener('click', () => {
    welcome.style.display = "none";
    main.style.display = "block";
})
let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0,0,0,0.08)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    dots.forEach((e) => {
        e.update();
    })
    player.update();
    projectiles.forEach((e, i) => {
        e.update();
        if (e.x + e.r < 0 || e.x - e.r > canvas.width || e.y + e.r < 0 || e.y - e.r > canvas.height) {
            projectiles.splice(i, 1);
        }
    });
    enemies.forEach((e, p) => {
        e.update();
        const dist = Math.hypot(player.x - e.x, player.y - e.y);
        if (dist - player.r - e.r <= 0) {
            cancelAnimationFrame(animationId);
            dabbi.style.display = "flex";
            bigscr.innerHTML = score;
            score = 0;
        }
        particles.forEach((e, i) => {
            if (e.alpha <= 0) {
                particles.splice(i, 1);
            }
            else {
                e.update();
            }
        })
        projectiles.forEach((a, i) => {
            const power = rand(8, 2);
            const dist = Math.hypot(a.x - e.x, a.y - e.y);
            if (dist - e.r - a.r <= 0) {
                for (let i = 0; i < a.r * 2; i++) {
                    particles.push(new Particle(a.x, a.y, rand(3), e.col, {
                        x: rand(0.5, -0.5) * power,
                        y: rand(0.5, -0.5) * power
                    }))
                }
                if (e.r > 18) {
                    gsap.to(e, {
                        r: e.r - 8,
                    })
                    setTimeout(() => {
                        score += 50;
                        no.innerHTML = score;
                        projectiles.splice(i, 1);
                    }, 0);
                }
                else {
                    setTimeout(() => {
                        score += 100;
                        no.innerHTML = score;
                        enemies.splice(p, 1);
                        projectiles.splice(i, 1);
                    }, 0);
                }
            }
        });
    });

}
init();
animate();
spawnEnemies();