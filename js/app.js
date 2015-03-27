(function () {

    // Matter aliases
    var Engine = Matter.Engine,
            Gui = Matter.Gui,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Body = Matter.Body,
            Composite = Matter.Composite,
            Composites = Matter.Composites,
            Common = Matter.Common,
            Constraint = Matter.Constraint,
            Events = Matter.Events,
            MouseConstraint = Matter.MouseConstraint;

    var genchanFlag = 0;
    var genchanHp = 3;
    var oldrock = {};

    var Demo = {};

    var _engine,
            _sceneName = 'mixed',
            _sceneWidth,
            _sceneHeight;

    _sceneWidth = 304;
    _sceneHeight = 440;

    Demo.init = function () {
        var canvasContainer = document.getElementById('world');


        _engine = Engine.create(canvasContainer, {
            render: {
                options: {
                    wireframes: false,
                    showAngleIndicator: false,
                    showDebug: false
                }
            }
        });

        _engine.enableSleeping = true;
        
        setTimeout(function () {
            Engine.run(_engine);
            Demo.updateScene();
        }, 0.1);

//        window.addEventListener('deviceorientation', Demo.updateGravity, true);
////        window.addEventListener('touchstart', Demo.fullscreen);
//        window.addEventListener('orientationchange', function () {
////            Demo.updateGravity();
//            Demo.updateScene();
//        }, false);
    };

    window.addEventListener('load', Demo.init);

    Demo.mixed = function () {
        var _world = _engine.world;

        Common._seed = 0;

        World.clear(_world);
        Engine.clear(_engine);

        var offset = 5;
        var underBlock = Bodies.rectangle(_sceneWidth * 0.5, _sceneHeight + offset, _sceneWidth + 0.5, 20, {density:100,isStatic: true});
        World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, -offset, _sceneWidth + 0.5, 20, {density:100,isStatic: true}));
        World.addBody(_world, underBlock);
        World.addBody(_world, Bodies.rectangle(_sceneWidth + offset, _sceneHeight * 0.5, 20, _sceneHeight + 0.5, {density:100,isStatic: true}));
        World.addBody(_world, Bodies.rectangle(-offset, _sceneHeight * 0.5, 20, _sceneHeight + 0.5, {density:100,isStatic: true}));

        _world.gravity.x = 0;
        _world.gravity.y = 0;

        World.add(_world, MouseConstraint.create(_engine));

//        var stack = Composites.stack(100, 50, 1, 10, 0, 0, function(x, y, column, row) {
//            
//            return Bodies.rectangle(x, y, 50, 50, {
//                    render: {//ボールのレンダリングの設定
//                        sprite: {//スプライトの設定
//                            texture: './img/resize/player.png' //スプライトに使うテクスチャ画像を指定
//                        }
//                    }
//                });
        var blocks = new Object();
        blockCount = 0;
        for (var x=0;x<8;x++) {
            for(var y=0;y<6;y++) {
                blocks[blockCount] =  Bodies.rectangle(32+15+30*x,50+10*y,30,10,{density:100,isStatic:false,isSleeping:true});
                blockCount++;
            }
        }
//        var stack = Composites.stack(32, 50, 8, 6, 0, 0, function (x, y, column, row) {
//
//            return Bodies.rectangle(x, y, 30, 10, {isStatic: true});
////            switch (Math.round(Common.random(0, 1))) {
////                
////            case 0:
////                if (Common.random() < 0.8) {
////                    return Bodies.rectangle(x, y, Common.random(20, 40), Common.random(20, 40), { friction: 0.01, restitution: 0.4 });
////                } else {
////                    return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30), { friction: 0.01, restitution: 0.4 });
////                }
////                break;
////            case 1:
////                return Bodies.polygon(x, y, Math.round(Common.random(4, 6)), Common.random(20, 40), { friction: 0.01, restitution: 0.4 });
////            
////            }
//        });
//        var bodyStackX = Composites.stack(5,5,2,1,_sceneWidth-5,0,function(x,y,column,row){
//            return Bodies.rectangle(x, y, 1, _sceneHeight,{ density: 1/_sceneHeight,isStatic:true,friction:0});
//        });
//        var bodyStackY = Composites.stack(5,5,1,2,0,_sceneHeight,function(x,y,column,row){
//            return Bodies.rectangle(x, y, _sceneWidth,1,{ density: 1/_sceneWidth,isStati  c:true,friction:0});
//        });

        rockOptions = {restitution: 0.1, frictionAir: 0, friction: 0,
            render: {//ボールのレンダリングの設定
                sprite: {//スプライトの設定
                    texture: './img/resize/player.png' //スプライトに使うテクスチャ画像を指定
                }
            }
        },
        rock = Bodies.circle(152, 350, 7.5, rockOptions),
                anchor = {x: 152, y: 330},
        elastic = Constraint.create({
            pointA: anchor,
            bodyB: rock,
            stiffness: 0.05,
            render: {
                lineWidth: 5,
                strokeStyle: '#dfa417'
            }
        });
//
//        var genchan = Bodies.circle(152, 300, 7.5, {restitution: 1.25, frictionAir: 0, friction: 0,
//            render: {//ボールのレンダリングの設定
//                sprite: {//スプライトの設定
//                    texture: './img/resize/player.png' //スプライトに使うテクスチャ画像を指定
//                }
//            }
//        });

        World.add(_world, [rock, elastic]);
        for (i=0;i<blockCount;i++){
            World.add(_world, blocks[i]);
        }

        
        Events.on(_engine, 'tick', function (event) {
            
            if (_engine.input.mouse.button !== -1 && genchanFlag === 5) {
                genchanFlag = 0;
            }
            if (_engine.input.mouse.button !== -1 && rock.isSleeping !== true && genchanFlag === 0){
                genchanFlag=1;
            }
            if (_engine.input.mouse.button !== -1 && (rock.position.x !== 152 || rock.position.y !== 300) && genchanFlag === 1) {
                genchanFlag = 2;
            }
            if (_engine.input.mouse.button === -1 && (rock.position.y > 350) && genchanFlag === 2) {
                genchanFlag = 3;
            }
            if (genchanFlag === 3 && rock.position.y < 300) {
                genchanFlag = 4;
                    oldrock = rock;
                    rock = Bodies.circle(152, 350,0.1  , rockOptions);
                    World.add(_engine.world, rock);
                    elastic.bodyB = rock;
                    underBlock.isStatic = false;
            }
            for(b=0;b<blockCount;b++){
                if(blocks[b].isSleeping === false){
                    World.remove(_engine.world, blocks[b]);
                }
            }
            if((underBlock.isSleeping === false || oldrock.isSleeping === true) && genchanFlag === 4) {
                genchanHp--;
                World.remove(_engine.world, underBlock);
                underBlock = Bodies.rectangle(_sceneWidth * 0.5, _sceneHeight + offset, _sceneWidth + 0.5, 20, {density:100,isStatic: false,isSleeping:true});
                World.addBody(_engine.world, underBlock);
                if(genchanHp === 0) {
                    World.remove(_engine.world, oldrock);
                    genchanHp =3;
                    tmprock = rock;
                    World.remove(_engine.world, tmprock);
                    //新しいげんちゃんをセット
                    rock = Bodies.circle(152, 350, 7.5  , rockOptions);
                    World.add(_engine.world, rock);
                    elastic.bodyB = rock;
                    genchanFlag = 5;
                    underBlock.isStatic = true;
                }
            }
        });
        var renderOptions = _engine.render.options;
        renderOptions.wireframes = false;
        renderOptions.showAngleIndicator = false;

//        World.add(_world, bodyStackX);
//        World.add(_world, bodyStackY);
    };

    Demo.updateScene = function () {
        if (!_engine)
            return;

        var boundsMax = _engine.world.bounds.max,
                renderOptions = _engine.render.options,
                canvas = _engine.render.canvas;

        boundsMax.x = _sceneWidth;
        boundsMax.y = _sceneHeight;

        canvas.width = renderOptions.width = _sceneWidth;
        canvas.height = renderOptions.height = _sceneHeight;

        Demo[_sceneName]();
    };

    Demo.updateGravity = function () {
        if (!_engine)
            return;

        var orientation = window.orientation,
                gravity = _engine.world.gravity;

        if (orientation === 0) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(event.beta, -90, 90) / 90;
        } else if (orientation === 180) {
            gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
            gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
        } else if (orientation === 90) {
            gravity.x = Common.clamp(event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
        } else if (orientation === -90) {
            gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
            gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
        }
    };

    Demo.reset = function () {
        var _world = _engine.world;

        Common._seed = 0;

        World.clear(_world);
        Engine.clear(_engine);

        var offset = 5;
        World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, -offset, _sceneWidth + 0.5, 20, {density:100,isStatic: true}));
        World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, _sceneHeight + offset, _sceneWidth + 0.5, 20, {density:100,isStatic: true}));
        World.addBody(_world, Bodies.rectangle(_sceneWidth + offset, _sceneHeight * 0.5, 20, _sceneHeight + 0.5, {density:100,isStatic: true}));
        World.addBody(_world, Bodies.rectangle(-offset, _sceneHeight * 0.5, 20, _sceneHeight + 0.5, {density:100,isStatic: true}));
    };



})();