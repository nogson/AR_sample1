class VideoMesh {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.xgrid = 10;
        this.ygrid = 7;
        this.meshLenght = this.xgrid * this.ygrid;
        this.videoSizeW = 1.28;
        this.videoSizeH = 0.72;
        this.meshPos = [];
        this.group = new THREE.Group();
        this.sizeX = this.videoSizeW / this.xgrid;
        this.sizeY = this.videoSizeH / this.ygrid;
        this.video = document.getElementById('video');

    }

    create() {

        let texture = new THREE.VideoTexture(this.video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;

        for (var i = 0; i < this.xgrid; i++) {
            for (var j = 0; j < this.ygrid; j++) {
                let geometry = new THREE.BoxGeometry(this.sizeX, this.sizeY, this.sizeX);
                let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, overdraw: true, side: THREE.DoubleSide });
                let mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.position.x = i * this.sizeX;
                mesh.position.y = j * this.sizeY;

                //初回の表示位置を残しておく
                this.meshPos.push({ x: mesh.position.x, y: mesh.position.y, z: mesh.position.z });
                //位置をランダムにする
                mesh.position.x = Math.random() * this.width;
                mesh.position.y = Math.random() * this.height;
                mesh.position.z = Math.random() * 200 - Math.random() * 200;
                mesh.rotation.x = Math.random() * 3;
                mesh.rotation.y = Math.random() * 3;
                mesh.rotation.z = Math.random() * 3;
                this.changeUvs(geometry, 1 / this.xgrid, 1 / this.ygrid, i, j);
                this.group.add(mesh);
            }
        }

        return this.group;
    }

    changeUvs(geometry, unitx, unity, offsetx, offsety) {
        let faceVertexUvs = geometry.faceVertexUvs[0];
        for (let i = 0; i < faceVertexUvs.length; i++) {

            let uvs = faceVertexUvs[i];

            for (let j = 0; j < uvs.length; j++) {
                let uv = uvs[j];
                uv.x = (uv.x + offsetx) * unitx;
                uv.y = (uv.y + offsety) * unity;
            }
        }
    }

    render() {
        //rendering
        for (let i = 0; i < this.meshLenght; i++) {
            let mesh = this.group.children[i];
            mesh.position.x += (this.meshPos[i].x - mesh.position.x) / 30;
            mesh.position.y += (this.meshPos[i].y - mesh.position.y) / 30;
            mesh.position.z += (this.meshPos[i].z - mesh.position.z) / 30;
            if (mesh.rotation.x > 0) {
                mesh.rotation.x += (0 - 0.05) / 10;
                mesh.rotation.y += (0 - 0.05) / 10;
                mesh.rotation.z += (0 - 0.05) / 10;
            } else {
                mesh.rotation.x = 0;
                mesh.rotation.y = 0;
                mesh.rotation.z = 0;
            }

        }
    }

    play() {
        this.video.play();
    }

}