function Milk() {

    var elLiquid = $('.liquid');

    /** The current dimensions of the screen (updated on resize) */
    var WIDTH = elLiquid.width();
    var HEIGHT = elLiquid.height();

    /** milk settings */
    var DENSITY = 1.75;
    var FRICTION = 1.24;
    var MOUSE_PULL = 0.01; // The strength at which the mouse pulls particles within the AOE
    var AOE = 10; // Area of effect for mouse pull
    var DETAIL = Math.round(WIDTH / 10); // The number of particles used to build up the milk
    var TWITCH_INTERVAL = 1000; // The interval between random impulses being inserted into the milk to keep it moving

    var ms = {
        x: 0,
        y: 0
    }; // Mouse speed
    var mp = {
        x: 0,
        y: 0
    }; // Mouse position

    var canvas, context, particles;

    var timeUpdateInterval, twitchInterval;

    this.Initialize = function (canvasID) {
        canvas = document.getElementById(canvasID);

        if (canvas && canvas.getContext) {
            context = canvas.getContext('2d');

            particles = [];

            // Generate our milk particles
            for (var i = 0; i < DETAIL + 1; i++) {
                particles.push({
                    x: WIDTH / (DETAIL - 4) * (i - 2), // Pad by two particles on each side
                    y: HEIGHT * .05,
                    original: {
                        x: 0,
                        y: HEIGHT * .05
                    },
                    velocity: {
                        x: 0,
                        y: Math.random() * 3
                    }, // Random for some initial movement in the milk
                    force: {
                        x: 0,
                        y: 0
                    },
                    mass: 10
                });
            }
            $(window).resize(ResizeCanvas);

            timeUpdateInterval = setInterval(TimeUpdate, 40);
            twitchInterval = setInterval(Twitch, TWITCH_INTERVAL);
            ResizeCanvas();

        }
    };

    function Twitch() {
        if (ms.x < 6 || ms.y < 6) {
            var forceRange = 1; // -value to +value
            InsertImpulse(Math.random() * WIDTH, (Math.random() * (forceRange * 2) - forceRange));
        }
    }

    function InsertImpulse(positionX, forceY) {
        var particle = particles[Math.round(positionX / WIDTH * particles.length)];

        if (particle) {
            particle.force.y += forceY;
        }
    }

    function TimeUpdate(e) {
        var gradientFill = context.createLinearGradient(WIDTH * .5, HEIGHT * .2, WIDTH * .5, HEIGHT);
        gradientFill.addColorStop(0, '#f2f2f2');
        gradientFill.addColorStop(1, '#f2f2f2');

        context.clearRect(0, 0, WIDTH, HEIGHT);
        context.fillStyle = gradientFill;

        context.beginPath();
        context.moveTo(particles[0].x, particles[0].y);

        var len = particles.length;
        var i;

        var current, previous, next;

        for (i = 0; i < len; i++) {
            current = particles[i];
            previous = particles[i - 1];
            next = particles[i + 1];

            if (previous && next) {

                var forceY = 0;

                forceY += -DENSITY * (previous.y - current.y);
                forceY += DENSITY * (current.y - next.y);
                forceY += DENSITY / 15 * (current.y - current.original.y);

                current.velocity.y += -(forceY / current.mass) + current.force.y;
                current.velocity.y /= FRICTION;
                current.force.y /= FRICTION;
                current.y += current.velocity.y;

                var distance = DistanceBetween(mp, current);

                if (distance < AOE) {
                    var distance = DistanceBetween(mp, {
                        x: current.original.x,
                        y: current.original.y
                    });

                    ms.x = ms.x * .98;
                    ms.y = ms.y * .98;

                    current.force.y += (MOUSE_PULL * (1 - (distance / AOE))) * ms.y;
                }

                // cx, cy, ax, ay
                context.quadraticCurveTo(previous.x, previous.y, previous.x + (current.x - previous.x) / 2, previous.y + (current.y - previous.y) / 2);
            }

        }

        context.lineTo(particles[particles.length - 1].x, particles[particles.length - 1].y);
        context.lineTo(WIDTH, HEIGHT);
        context.lineTo(0, HEIGHT);
        context.lineTo(particles[0].x, particles[0].y);

        context.fill();
    }

    function ResizeCanvas() {
        /** The current dimensions of the screen (updated on resize) */
        WIDTH = elLiquid.width();
        HEIGHT = elLiquid.height();

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        /*
        for (var i = 0; i < DETAIL + 1; i++) {
            particles[i].x = WIDTH / (DETAIL - 4) * (i - 2);
            particles[i].y = HEIGHT * .5;

            particles[i].original.x = particles[i].x;
            particles[i].original.y = particles[i].y;
        }
        */
    }

    function DistanceBetween(p1, p2) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

}