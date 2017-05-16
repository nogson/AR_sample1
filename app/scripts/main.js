(() => {

    window.addEventListener('load', () => {

        //////////////////////////////////////////////////////////////////////////////////
        //		Init
        //////////////////////////////////////////////////////////////////////////////////

        let width = window.innerWidth;
        let height = window.innerHeight;


        // init renderer
        var renderer = new THREE.WebGLRenderer({
            // antialias	: true,
            alpha: true
        });

        renderer.setClearColor(new THREE.Color('lightgrey'), 0)
            // renderer.setPixelRatio( 1/2 );
        renderer.setSize(width, height);
        renderer.domElement.style.position = 'absolute'
        renderer.domElement.style.top = '0px'
        renderer.domElement.style.left = '0px'
        document.body.appendChild(renderer.domElement);

        // array of functions for the rendering loop
        var onRenderFcts = [];

        // init scene and camera
        var scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight(0x666666);
        scene.add(ambient);

        var directionalLight = new THREE.DirectionalLight(0x887766);
        directionalLight.position.set(-1, 1, 1).normalize();
        scene.add(directionalLight);

        //////////////////////////////////////////////////////////////////////////////////
        //		Initialize a basic camera
        //////////////////////////////////////////////////////////////////////////////////

        // Create a camera
        var camera = new THREE.Camera();
        scene.add(camera);

        ////////////////////////////////////////////////////////////////////////////////
        //          handle arToolkitSource
        ////////////////////////////////////////////////////////////////////////////////

        //マーカ−
        var arToolkitSource = new THREEx.ArToolkitSource({
            // to read from the webcam 
            sourceType: 'webcam',

            // to read from an image
            // sourceType: 'image',
            // sourceUrl: 'images/kuva.jpg',

            // to read from a video
            // sourceType : 'video',
            // sourceUrl : '../../data/videos/headtracking.mp4',		

            sourceWidth: 80 * 3,
            sourceHeight: 60 * 3,
        })

        arToolkitSource.init(function onReady() {
            // handle resize of renderer
            arToolkitSource.onResize(renderer.domElement)
        })

        // // handle resize
        window.addEventListener('resize', function() {
                // handle arToolkitSource resize
                arToolkitSource.onResize(renderer.domElement)
            })
            ////////////////////////////////////////////////////////////////////////////////
            //          initialize arToolkitContext
            ////////////////////////////////////////////////////////////////////////////////

        var arToolkitContext = new THREEx.ArToolkitContext({
                cameraParametersUrl: 'images/camera_para.dat',
                detectionMode: 'mono',
                imageSmoothingEnabled: true,
                maxDetectionRate: 60,
                canvasWidth: arToolkitSource.parameters.sourceWidth,
                canvasHeight: arToolkitSource.parameters.sourceHeight,
            })
            // initialize it
        arToolkitContext.init(function onCompleted() {
            // copy projection matrix to camera
            camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
        })


        // update artoolkit on every frame
        onRenderFcts.push(function() {
            if (arToolkitSource.ready === false) return
            arToolkitContext.update(arToolkitSource.domElement)
        })


        // ////////////////////////////////////////////////////////////////////////////////
        // //          Create a ArMarkerControls
        // ////////////////////////////////////////////////////////////////////////////////

        var markerRoot = new THREE.Group
        scene.add(markerRoot)
        var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
            type: 'pattern',
            patternUrl: 'images/nogson.pat',
            minConfidence: 0.9,
            //changeMatrixMode: 'cameraTransformMatrix'
        })

        //////////////////////////////////////////////////////////////////////////////////
        //		add an object in the scene
        //////////////////////////////////////////////////////////////////////////////////

        // add a torus knot	
        // var geometry = new THREE.CubeGeometry(1, 1, 1);
        // var material = new THREE.MeshNormalMaterial({
        //     transparent: true,
        //     opacity: 0.5,
        //     side: THREE.DoubleSide
        // });
        // var mesh = new THREE.Mesh(geometry, material);
        // mesh.position.z = geometry.parameters.height / 2
        // markerRoot.add(mesh);

        // var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 32, 32);
        // var material = new THREE.MeshNormalMaterial();
        // var mesh = new THREE.Mesh(geometry, material);
        // mesh.position.z = 0.5


        let video = new VideoMesh(width, height);

        let mesh = video.create();
        mesh.position.x = -0.5;

        markerRoot.add(mesh);

        video.play();

        onRenderFcts.push(function() {
            video.render();
            //mesh.rotation.x += 0.1
        });


        //////////////////////////////////////////////////////////////////////////////////
        //		render the whole thing on the page
        //////////////////////////////////////////////////////////////////////////////////
        var stats = new Stats();
        document.body.appendChild(stats.domElement);
        // render the scene
        onRenderFcts.push(function() {
            renderer.render(scene, camera);
            stats.update();
        })

        // run the rendering loop
        var lastTimeMsec = null
        requestAnimationFrame(function animate(nowMsec) {
            // keep looping
            requestAnimationFrame(animate);
            // measure time
            lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
            var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
            lastTimeMsec = nowMsec
                // call each update function
            onRenderFcts.forEach(function(onRenderFct) {
                onRenderFct(deltaMsec / 1000, nowMsec / 1000)
            })
        })



    }, false);
})();