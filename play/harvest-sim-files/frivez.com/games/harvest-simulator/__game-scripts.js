var GameManager = pc.createScript("gameManager");
GameManager.attributes.add("money_counter", {
    type: "entity"
}), GameManager.attributes.add("levels", {
    type: "asset",
    array: !0
}), GameManager.attributes.add("current_level", {
    type: "entity"
}), GameManager.prototype.initialize = function() {
    GameManager.instance = this, this.money = Number(this.loadString("money", 0)), this.money_counter.element.text = Math.floor(this.money), this.level_number = Number(this.loadString("level", 0)), this.advanceLevel(), this.debug_mode = window.location.href.indexOf("launch.playcanvas.com") > -1, this.cool_down = 0, this.pitch = 1
}, GameManager.prototype.advanceLevel = function() {
    this.spawnLevel(this.level_number + 1)
}, GameManager.prototype.spawnLevel = function(e) {
    null != this.current_level && (this.current_level.destroy(), BarCont.instance.clear()), this.saveString("level", this.level_number), this.level_number = e, this.current_level = this.levels[(this.level_number - 1) % this.levels.length].resource.instantiate(), this.app.root.addChild(this.current_level)
}, GameManager.prototype.addMoney = function(e) {
    let t = this.money;
    this.money += e, this.saveString("money", this.money), this.money_counter.element.text = Math.floor(this.money), e > 0 && Math.floor(t) != Math.floor(this.money) && (SoundManager.instance.setPitch("pop", this.pitch), SoundManager.instance.playSound("pop"), this.pitch += .01)
}, GameManager.prototype.update = function(e) {
    this.debug_mode && (this.app.keyboard.isPressed(pc.KEY_N) && this.addMoney(20), this.app.keyboard.isPressed(pc.KEY_R) && (localStorage.clear(), window.location.reload()), this.app.keyboard.isPressed(pc.KEY_L) && this.cool_down <= 0 && (Harvest.all_harvest = [], CompleteMessage.instance.showMessage(function() {
        Fade.instance.fadeIn(.5, function() {
            GameManager.instance.advanceLevel(), Fade.instance.fadeOut()
        }.bind(this))
    }.bind(this)), this.cool_down = 1), this.cool_down -= e), this.pitch = pc.math.lerp(this.pitch, 1, e)
}, GameManager.prototype.saveString = function(e, t) {
    this.supports_local_storage() && localStorage.setItem(e, t)
}, GameManager.prototype.loadString = function(e, t) {
    return this.supports_local_storage() && localStorage.hasOwnProperty(e) ? localStorage.getItem(e) : t
}, GameManager.prototype.supports_local_storage = function() {
    try {
        return "localStorage" in window && null !== window.localStorage
    } catch (e) {
        return !1
    }
};
var BarCont = pc.createScript("barCont");
BarCont.attributes.add("bar_template", {
    type: "asset"
}), BarCont.prototype.initialize = function() {
    BarCont.instance = this, this.bars = []
}, BarCont.prototype.addBar = function(t) {
    let r = this.bar_template.resource.instantiate();
    r.script.radialBar.bar.element.color = t.bar_color, r.script.radialBar.harvest = t, r.script.radialBar.icon_entity.element.sprite = t.icon.resource, this.entity.addChild(r), this.bars.push(r.script.radialBar)
}, BarCont.prototype.update = function() {
    for (let t = 0; t < this.bars.length; t++) this.bars[t].setProgress(this.bars[t].harvest.progress)
}, BarCont.prototype.clear = function() {
    for (let t = 0; t < this.bars.length; t++) this.bars[t].entity.destroy();
    this.bars.length = 0
};
var Harvest = pc.createScript("harvest");
Harvest.attributes.add("plantModel", {
    type: "asset"
}), Harvest.attributes.add("plantMaterial", {
    type: "asset"
}), Harvest.attributes.add("density", {
    type: "number",
    default: 1,
    title: "Densidad (plantas/m)"
}), Harvest.attributes.add("bar_color", {
    type: "rgb"
}), Harvest.attributes.add("icon", {
    type: "asset"
}), Harvest.prototype.initialize = function() {
    this.initialized = !1, this.entity.render.enabled = !1
}, Harvest.prototype.init = function() {
    this.initialized = !0, Harvest.all_harvest || (Harvest.all_harvest = []), Harvest.all_harvest.push(this), this.physicalHeight = this.entity.getLocalScale().z, this.physicalWidth = this.entity.getLocalScale().x, this.center = this.entity.getPosition(), this.numCellsX = Math.round(this.physicalWidth * this.density), this.numCellsZ = Math.round(this.physicalHeight * this.density), this.cellSizeX = this.physicalWidth / this.numCellsX, this.cellSizeZ = this.physicalHeight / this.numCellsZ, this.harvested = new Uint8Array(this.numCellsX * this.numCellsZ), this.instanceCount = this.numCellsX * this.numCellsZ, this.harvestedCount = 0, this.matrices = new Float32Array(16 * this.instanceCount), this.matrix = new pc.Mat4;
    for (var t = 0; t < this.instanceCount; t++) {
        var e = t % this.numCellsX,
            i = Math.floor(t / this.numCellsX),
            s = e * this.cellSizeX - this.physicalWidth / 2 + this.center.x,
            a = i * this.cellSizeZ - this.physicalHeight / 2 + this.center.z,
            h = pc.math.random(.4 * -this.cellSizeX, .4 * this.cellSizeX),
            n = pc.math.random(.4 * -this.cellSizeZ, .4 * this.cellSizeZ),
            r = pc.math.random(0, 360),
            l = new pc.Quat;
        l.setFromEulerAngles(pc.math.random(-5, 5), r, pc.math.random(-5, 5));
        var c = pc.math.random(.7, 1);
        this.matrix.setTRS(new pc.Vec3(s + h, 0, a + n), l, new pc.Vec3(c, c, c)), this.matrices.set(this.matrix.data, 16 * t)
    }
    var o = this.app.graphicsDevice,
        d = pc.VertexFormat.getDefaultInstancingFormat(o);
    this.instanceBuffer = new pc.VertexBuffer(o, d, this.instanceCount, pc.BUFFER_DYNAMIC, this.matrices);
    var p = this.plantModel.resource.meshes[0],
        u = this.plantMaterial.resource;
    this.meshInstance = new pc.MeshInstance(p, u), this.meshInstance.setInstancing(this.instanceBuffer);
    var m = new pc.Entity;
    m.addComponent("render", {
        meshInstances: [this.meshInstance]
    }), this.entity.addChild(m), this.instanceDataNeedsUpdate = !1, BarCont.instance.addBar(this), this.progress = 0, this._cutter = Cutter.instance
}, Harvest.prototype.harvestCell = function(t, e, i) {
    var s = t + e * this.numCellsX;
    if (this.harvested[s]) return !1;
    this.harvested[s] = 1, i ? (this.harvestedCount++, Trunk.instance.current++, CarMovement.volume_to = 1) : this.instanceCount--;
    var a = pc.math.random(.4 * -this.cellSizeX, .4 * this.cellSizeX),
        h = pc.math.random(.4 * -this.cellSizeZ, .4 * this.cellSizeZ),
        n = t * this.cellSizeX - this.physicalWidth / 2 + this.center.x + a,
        r = e * this.cellSizeZ - this.physicalHeight / 2 + this.center.z + h;
    return this.matrix.setTRS(new pc.Vec3(n, .01, r), (new pc.Quat).setFromEulerAngles(90, pc.math.random(0, 360), 0), new pc.Vec3(.1, .1, .1)), this.matrices.set(this.matrix.data, 16 * s), this.progress = this.harvestedCount / this.instanceCount, this.harvestedCount == this.instanceCount && (this.enabled = !1, Harvest.all_harvest = Harvest.all_harvest.filter((t => t !== this)), SoundManager.instance.playSound("bell"), 0 == Harvest.all_harvest.length && CompleteMessage.instance.showMessage(function() {
        Fade.instance.fadeIn(.5, function() {
            GameManager.instance.advanceLevel(), Fade.instance.fadeOut(0, function() {
                AdsManager.instance.gameplayStart()
            }.bind(this))
        }.bind(this))
    }.bind(this))), !0
}, Harvest.prototype.update = function(t) {
    if (!this.initialized) return void(Cutter.instance && this.init());
    if (!this._cutter.is_down) return;
    let e = CarMovement.instance.entity.script.trunk.cutter.getPosition();
    var i = this.getYaw(CarMovement.instance.entity.getRotation());
    this.harvestInRect(e.x, e.z, Cutter.instance.amount + 2, 2.5, -i)
}, Harvest.prototype.getYaw = function(t) {
    return Math.atan2(2 * (t.w * t.y + t.x * t.z), 1 - 2 * (t.y * t.y + t.z * t.z)) * (180 / Math.PI)
}, Harvest.prototype.harvestInRect = function(t, e, i, s, a) {
    for (var h = a * (Math.PI / 180), n = Math.cos(h), r = Math.sin(h), l = i / 2, c = s / 2, o = Math.abs(n * l) + Math.abs(r * c), d = Math.abs(r * l) + Math.abs(n * c), p = t - o, u = t + o, m = e - d, v = e + d, y = Math.max(0, Math.floor((p - this.center.x + this.physicalWidth / 2) / this.cellSizeX)), M = Math.min(this.numCellsX - 1, Math.ceil((u - this.center.x + this.physicalWidth / 2) / this.cellSizeX)), z = Math.max(0, Math.floor((m - this.center.z + this.physicalHeight / 2) / this.cellSizeZ)), C = Math.min(this.numCellsZ - 1, Math.ceil((v - this.center.z + this.physicalHeight / 2) / this.cellSizeZ)), f = y; f <= M; f++)
        for (var S = z; S <= C; S++) {
            var g = f * this.cellSizeX - this.physicalWidth / 2 + this.center.x + this.cellSizeX / 2 - t,
                H = S * this.cellSizeZ - this.physicalHeight / 2 + this.center.z + this.cellSizeZ / 2 - e,
                X = n * g + r * H,
                b = -r * g + n * H;
            Math.abs(X) <= l && Math.abs(b) <= c && this.harvestCell(f, S, !0) && (this.instanceDataNeedsUpdate = !0)
        }
    this.instanceDataNeedsUpdate && (this.instanceBuffer.setData(this.matrices), this.instanceDataNeedsUpdate = !1)
}, Harvest.prototype.harvestInArea = function(t, e, i) {
    for (var s = (t - this.center.x + this.physicalWidth / 2) / this.cellSizeX, a = (e - this.center.z + this.physicalHeight / 2) / this.cellSizeZ, h = i / Math.min(this.cellSizeX, this.cellSizeZ), n = h * h, r = Math.max(0, Math.floor(s - h)), l = Math.min(this.numCellsX - 1, Math.ceil(s + h)), c = Math.max(0, Math.floor(a - h)), o = Math.min(this.numCellsZ - 1, Math.ceil(a + h)), d = r; d <= l; d++)
        for (var p = c; p <= o; p++) {
            var u = d + .5 - s,
                m = p + .5 - a;
            u * u + m * m <= n && this.harvestCell(d, p, !1) && (this.instanceDataNeedsUpdate = !0)
        }
    this.instanceDataNeedsUpdate && (this.instanceBuffer.setData(this.matrices), this.instanceDataNeedsUpdate = !1)
};
var CarMovement = pc.createScript("carMovement");
CarMovement.attributes.add("speed", {
    type: "number",
    default: 8,
    title: "Velocidad"
}), CarMovement.attributes.add("turnSpeed", {
    type: "number",
    default: 90,
    title: "Velocidad de giro"
}), CarMovement.attributes.add("acceleration", {
    type: "number",
    default: 5,
    title: "Factor de aceleración"
}), CarMovement.attributes.add("wheel_left", {
    type: "entity"
}), CarMovement.attributes.add("wheel_right", {
    type: "entity"
}), CarMovement.prototype.initialize = function() {
    CarMovement.instance = this, this.allow_input = !0, this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this), this.app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this), this.moveForward = !1, this.moveBackward = !1, this.turnLeft = !1, this.turnRight = !1, this.currentSpeed = 0, this.entity.collision && this.entity.collision.on("collisionstart", this.onCollisionStart, this), CarMovement.volume = 0, CarMovement.volume_to = 0
}, CarMovement.prototype.update = function(e) {
    let t = 0,
        i = 0;
    this.moveForward || Controls.instance.up ? t = -1 : (this.moveBackward || Controls.instance.down) && (t = 1), this.turnLeft || Controls.instance.left ? i = 1 : (this.turnRight || Controls.instance.right) && (i = -1), t <= 0 && (i = -i);
    let a = 1 + UpgradeScreen.instance.speed_level / 6;
    this.allow_input || (t = 0, i = 0);
    var n = t * this.speed * a;
    this.currentSpeed = pc.math.lerp(this.currentSpeed, n, this.acceleration * e), SoundManager.instance.setPitch("engine_loop", .9 + Math.abs(this.currentSpeed) / 40);
    var o = this.entity.forward.clone().scale(this.currentSpeed),
        r = this.entity.rigidbody.linearVelocity.clone(),
        s = new pc.Vec3;
    s.sub2(o, r);
    var c = s.scale(this.entity.rigidbody.mass * this.acceleration);
    this.entity.rigidbody.applyForce(c);
    var l = -i * this.turnSpeed * .5 * a;
    this.entity.rigidbody.applyTorque(new pc.Vec3(0, l, 0));
    let p = 20 * i,
        h = this.wheel_right.getLocalEulerAngles(),
        d = pc.math.lerpAngle(h.y, p, 8 * e);
    this.wheel_left.setLocalEulerAngles(0, -d, 0), this.wheel_right.setLocalEulerAngles(0, d, 180), CarMovement.volume = pc.math.lerp(CarMovement.volume, CarMovement.volume_to, 5 * e), CarMovement.volume_to = 0, SoundManager.instance.setVolume("cutting_loop", CarMovement.volume)
}, CarMovement.prototype.onCollisionStart = function(e) {
    this.currentSpeed = 0
}, CarMovement.prototype.onKeyDown = function(e) {
    switch (e.key) {
        case pc.KEY_W:
        case pc.KEY_UP:
            this.moveForward = !0;
            break;
        case pc.KEY_S:
        case pc.KEY_DOWN:
            this.moveBackward = !0;
            break;
        case pc.KEY_A:
        case pc.KEY_LEFT:
            this.turnLeft = !0;
            break;
        case pc.KEY_D:
        case pc.KEY_RIGHT:
            this.turnRight = !0
    }
}, CarMovement.prototype.onKeyUp = function(e) {
    switch (e.key) {
        case pc.KEY_W:
        case pc.KEY_UP:
            this.moveForward = !1;
            break;
        case pc.KEY_S:
        case pc.KEY_DOWN:
            this.moveBackward = !1;
            break;
        case pc.KEY_A:
        case pc.KEY_LEFT:
            this.turnLeft = !1;
            break;
        case pc.KEY_D:
        case pc.KEY_RIGHT:
            this.turnRight = !1
    }
};
var CameraMovement = pc.createScript("cameraMovement");
CameraMovement.attributes.add("target_focus", {
    type: "entity"
}), CameraMovement.attributes.add("target_position", {
    type: "entity"
}), CameraMovement.attributes.add("target_position2", {
    type: "entity"
}), CameraMovement.prototype.initialize = function() {
    this.entity.setPosition(this.target_position.getPosition()), this.current_target = this.target_position
}, CameraMovement.prototype.postUpdate = function(t) {
    this.entity.setPosition((new pc.Vec3).lerp(this.entity.getPosition(), this.current_target.getPosition(), 8 * t)), this.entity.lookAt(this.target_focus.getPosition())
};
pc.script.createLoadingScreen((function(e) {
    e.p = !0, window.addEventListener("keydown", (e => {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", " "].includes(e.key) && e.preventDefault()
    })), window.addEventListener("wheel", (e => e.preventDefault()), {
        passive: !1
    }), e.p && (PokiSDK.init().then((() => {
        e.ab = !1
    })).catch((() => {
        e.ab = !0
    })), PokiSDK.gameLoadingStart());
    var a, r;
    a = ["body {", "    background-color: #70a1eb;", "}", "", "#application-splash-wrapper {", "    position: absolute;", "    top: 0;", "    left: 0;", "    height: 100%;", "    width: 100%;", "background: ", "conic-gradient(", "from 0deg,", "transparent 0deg,", "transparent 15deg,", "rgba(0,116,255,1) 15deg,", "rgba(0,116,255,1) 30deg,", "transparent 30deg,", "transparent 45deg,", "rgba(0,116,255,1) 45deg,", "rgba(0,116,255,1) 60deg,", "transparent 60deg,", "transparent 75deg,", "rgba(0,116,255,1) 75deg,", "rgba(0,116,255,1) 90deg,", "transparent 90deg,", "transparent 105deg,", "rgba(0,116,255,1) 105deg,", "rgba(0,116,255,1) 120deg,", "transparent 120deg,", "transparent 135deg,", "rgba(0,116,255,1) 135deg,", "rgba(0,116,255,1) 150deg,", "transparent 150deg,", "transparent 165deg,", "rgba(0,116,255,1) 165deg,", "rgba(0,116,255,1) 180deg,", "transparent 180deg,", "transparent 195deg,", "rgba(0,116,255,1) 195deg,", "rgba(0,116,255,1) 210deg,", "transparent 210deg,", "transparent 225deg,", "rgba(0,116,255,1) 225deg,", "rgba(0,116,255,1) 240deg,", "transparent 240deg,", "transparent 255deg,", "rgba(0,116,255,1) 255deg,", "rgba(0,116,255,1) 270deg,", "transparent 270deg,", "transparent 285deg,", "rgba(0,116,255,1) 285deg,", "rgba(0,116,255,1) 300deg,", "transparent 300deg,", "transparent 315deg,", "rgba(0,116,255,1) 315deg,", "rgba(0,116,255,1) 330deg,", "transparent 330deg,", "transparent 345deg,", "rgba(0,116,255,1) 345deg,", "rgba(0,116,255,1) 360deg", "),", "radial-gradient(circle, rgba(147,237,255,1), rgba(0,116,255,1));", "background-blend-mode: screen;", "}", "", "#application-splash {", "    position: absolute;", "    top: calc(45% - 28px);", "    width: 64px;", "    left: calc(50% - 32px);", "}", "", "#application-splash img {", "    width: 100%;", "}", "", "#progress-bar-container {", "    margin: 20px auto 0 auto;", "    height: 2px;", "    width: 100%;", "    background-color: #AABBFF;", "}", "", "#progress-bar {", "    width: 0%;", "    height: 100%;", "    background-color: #fff;", "}"].join("\n"), (r = document.createElement("style")).type = "text/css", r.styleSheet ? r.styleSheet.cssText = a : r.appendChild(document.createTextNode(a)), document.head.appendChild(r),
        function() {
            var e = document.createElement("div");
            e.id = "application-splash-wrapper", document.body.appendChild(e);
            var a = document.createElement("div");
            a.id = "application-splash", e.appendChild(a), a.style.display = "none";
            var r = document.createElement("img");
            r.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAB2CAYAAAB4SpVuAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAYHSURBVHja7J17bBVFFIdXK4gPFAiBIhLRKhq1FcVXJIpUG7UqUGlUKkVqDSi+EAUMok0UX5QErY3WB1Z5RLANPmIxUWlMVBRBwdCKVMCCGF8oiqgYxM8/Zm682d7d+5qZe2f3/pL7T+/uzDlfd2dnzjk71wGcDH7uBKZm0oZMOl/B/6oIG4CxdFV5WAAU462SoAM4lvgqCDKAjgQAbAa6BRHAiySupUEDUE7yqgwKgMOB31IAsAc4IggAniV1vWA7gALS1/E2A3hJAYCFtgI4GnUaZCOAWQoB3GsjgA6FADpsAzAU9SqyCcA9GgDMtAnAuxoAvGMLgG7AjxoAfA8cZAOA09CnQhsAlGoEcJkNAG7VCKDaBgCPagQwxwYA8zUCmGcDgOc1AmiwAcAzGgE8ZQOAWo0AHrMBwIMaAcy2AcCNGgGMtwHAxRoBFNsAoADYr8H5/cBgW1aD2zQA2GrTcrhZA4BlNgG4WQOAm2wCMFjD/T/QtqDoRwoBvKczKFoInAmcDZwKDAD6Ad2z6DaYnKYthwD9Za7iDOBc6W+REyN89SfwO9AJfCDT2ncDFwF9kuj0SNlOutoN9Eyi3/7AFXLWuFheiTukLX+7w2wO8E0SxvwKvAXcBhyXgDHzDM3/TwamyWDsniTa3uEA7Skatg94FVHw5GXYgDQnRf8A+T7tjwNa0mj/Swf4RMF/6VO8S90e1hABqgbaFNjd7gCtCgerVcAIl7E9gJ9TaGsncLCrrRJgrUJ72xxggYZJSx1wQJTho1Joo9SVa3hag52rHOB+TSu3z4GTopxYmMS5jVHnnZLGOBVPrzhAlcbl6x/AaOlIHqIELp42RV0918R4dKnUXAcYhn5FAhknyEepl36JerxWGbDrFkdOMnYZhDDF55hJBp0HuDByn7Ua6nAgcJTP9/0QRVEmtBfIjwB4wFCnG4B6n+/rga8M2bI6ejU4kvCpPhpAd+C7kAEY444HPBEi53cDh7oBDA8RgCaviNAXIQFQ6gWgOgTOb8QnJnignI0FWdXECYpODbDzP+GKdXpFWjYFFMDVJBgWD+LEaDVJ5gVeDhiAE5MF0APYHhDn7yLFzFAh8K/lzi8hzdTYKIudX4Oi3GCFhc6vi8z3UZQcLbfI+eVyDFOeHR4JfJvlztehOT3eF3gzS2d512KwPmAyIuuaDVqAiCemVB8wE5iLqPB8CJgOTACuROTQe/s00BOoQc8bIoloGSKs75ecHS6jP5MQ7zI9gsha1wIznAQ62YVIfjYC1wNDYnTUR4Jcb8DpLYiUeaHHvGUKsAiRmdobr7FUFz7vI4omYtUIjJBX1GcKnW4DnpSBjDy61gbMBj5Ood3NjiSVqvbJNcMleBdNlsnbpAlRreGXKd4pj2mS55Qjskmx2r4ceD3d4IgDfKjov7QCOC+Bgccv65PIpgnFwEpFNrc7Gh5pdfhvfDDW59wxPuf1Bp5TbOt6B3hcw0DVCVzq4Uilz3kVPusRHY/cVgeYoXHEnqYAQI1G+xojg4lONbocGp8EgMWabatJdHMjFROWiFMTfY6bEHXccgN2XRep3NhmoLOlUY8vL0Uep82Y0ekR2osMdTgRUarqaRB6X7mJ1g/AYSbe83HLb+K1waAdLdGrwSGET/e5l8NrQgZgqBvA9BA5vzFWQGRQiADM8YoINYcEQIEXgGEhcP4N4sQEgz4YnhMPwFkBdr7LVjxea+8lQb/34wHohZ73fzOpmNtvZOo1eNPaisdrgPHib40BAeC5AVMi2ZN1ljs/jjRTY70wV8GtWrejKDeYj9oNEk3oDhQnR3uRWvYlE6pCY3a4IYsd3wJcgIH0eCWZywh7qUFepcbqA/oiskCZ1krS2F1GxSYEhYgtrv4y7PjbKPhVCpW7MRyD2Et4reZ7vNa9oiMLt9AoQlSdv0Z6OYftiOTtLOB8utYGWLG7fJ68TcrkxGSFj8Mt8pirJETtvzSRiR9ZKfEBUGzankwASCY5mgMQRACVuSsgByAHIDcG5K6AHIDcLZC7AsIKwC/hckMYAJQhtuvoBL6Wn075t9Gm7flvAA/6B3PU1BZ3AAAAAElFTkSuQmCC", a.appendChild(r), r.onload = function() {
                a.style.display = "block"
            };
            var n = document.createElement("div");
            n.id = "progress-bar-container", a.appendChild(n);
            var t = document.createElement("div");
            t.id = "progress-bar", n.appendChild(t)
        }(), e.on("preload:end", (function() {
            e.p && PokiSDK.gameLoadingFinished(), e.off("preload:progress")
        })), e.on("preload:progress", (function(e) {
            var a = document.getElementById("progress-bar");
            a && (e = Math.min(1, Math.max(0, e)), a.style.width = 100 * e + "%")
        })), e.on("start", (function() {
            var e = document.getElementById("application-splash-wrapper");
            e.parentElement.removeChild(e)
        }))
}));
var AdsManager = pc.createScript("adsManager");
AdsManager.prototype.initialize = function() {
    AdsManager.instance = this, this.adActive = !1, this.gameplay = !1, this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.inputDown, this), this.app.touch && this.app.touch.on(pc.EVENT_TOUCHSTART, this.inputDown, this)
}, AdsManager.prototype.inputDown = function(t) {
    this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.inputDown, this), this.app.touch && this.app.touch.off(pc.EVENT_TOUCHSTART, this.inputDown, this), this.gameplayStart()
}, AdsManager.prototype.update = function(t) {}, AdsManager.prototype.showCommercialBreak = function(t = null) {
    this.app.p ? (this.app.systems.sound.volume = 0, this.adActive = !0, this.app.timeScale = 0, PokiSDK.commercialBreak().then(function() {
        this.adActive = !1, this.app.systems.sound.volume = 1, this.app.timeScale = 1, t && t()
    }.bind(this))) : t && t()
}, AdsManager.prototype.showRewardedBreak = function(t = null) {
    this.app.p ? (this.app.systems.sound.volume = 0, this.adActive = !0, this.app.timeScale = 0, PokiSDK.rewardedBreak().then(function(a) {
        this.adActive = !1, this.app.systems.sound.volume = 1, this.app.timeScale = 1, t && t(a)
    }.bind(this))) : t && t(!1)
}, AdsManager.prototype.gameplayStart = function() {
    this.gameplay || (this.gameplay = !0, this.app.p && (PokiSDK.gameplayStart(), console.log("start")))
}, AdsManager.prototype.gameplayStop = function() {
    this.gameplay && (this.gameplay = !1, this.app.p && (PokiSDK.gameplayStop(), console.log("stop")))
};
var HarvestCircle = pc.createScript("harvestCircle");
HarvestCircle.attributes.add("radius", {
    type: "number"
}), HarvestCircle.prototype.initialize = function() {}, HarvestCircle.prototype.update = function(t) {
    if (Harvest.all_harvest) {
        for (let t = 0; t < Harvest.all_harvest.length; t++) Harvest.all_harvest[t].harvestInArea(this.entity.getPosition().x, this.entity.getPosition().z, this.radius);
        this.enabled = !1
    } else console.log("wait another frame")
};
var Controls = pc.createScript("controls");
Controls.attributes.add("button_left", {
    type: "entity"
}), Controls.attributes.add("button_right", {
    type: "entity"
}), Controls.attributes.add("button_up", {
    type: "entity"
}), Controls.attributes.add("button_down", {
    type: "entity"
}), Controls.attributes.add("button_left_l", {
    type: "entity"
}), Controls.attributes.add("button_right_l", {
    type: "entity"
}), Controls.attributes.add("button_up_l", {
    type: "entity"
}), Controls.attributes.add("button_down_l", {
    type: "entity"
}), Controls.attributes.add("screen_portrait", {
    type: "entity"
}), Controls.attributes.add("screen_landscape", {
    type: "entity"
}), Controls.prototype.initialize = function() {
    Controls.instance = this, this.left = !1, this.right = !1, this.up = !1, this.down = !1, this.show_on_pc = !1, this.up_from_button = !1, this.button_left && (this.button_left.enabled = pc.platform.touch || this.show_on_pc, this.button_left.button.on("pressedstart", (function() {
        this.left = !0
    }), this), this.button_left.button.on("pressedend", (function() {
        this.left = !1
    }), this)), this.button_left_l && (this.button_left_l.enabled = pc.platform.touch || this.show_on_pc, this.button_left_l.button.on("pressedstart", (function() {
        this.left = !0
    }), this), this.button_left_l.button.on("pressedend", (function() {
        this.left = !1
    }), this)), this.button_right && (this.button_right.enabled = pc.platform.touch || this.show_on_pc, this.button_right.button.on("pressedstart", (function() {
        this.right = !0
    }), this), this.button_right.button.on("pressedend", (function() {
        this.right = !1
    }), this)), this.button_right_l && (this.button_right_l.enabled = pc.platform.touch || this.show_on_pc, this.button_right_l.button.on("pressedstart", (function() {
        this.right = !0
    }), this), this.button_right_l.button.on("pressedend", (function() {
        this.right = !1
    }), this)), this.button_up && (this.button_up.enabled = pc.platform.touch || this.show_on_pc, this.button_up.button.on("pressedstart", (function() {
        this.up = !0
    }), this), this.button_up.button.on("pressedend", (function() {
        this.up = !1
    }), this)), this.button_up_l && (this.button_up_l.enabled = pc.platform.touch || this.show_on_pc, this.button_up_l.button.on("pressedstart", (function() {
        this.up = !0
    }), this), this.button_up_l.button.on("pressedend", (function() {
        this.up = !1
    }), this)), this.button_down && (this.button_down.enabled = pc.platform.touch || this.show_on_pc, this.button_down.button.on("pressedstart", (function() {
        this.down = !0
    }), this), this.button_down.button.on("pressedend", (function() {
        this.down = !1
    }), this)), this.button_down_l && (this.button_down_l.enabled = pc.platform.touch || this.show_on_pc, this.button_down_l.button.on("pressedstart", (function() {
        this.down = !0
    }), this), this.button_down_l.button.on("pressedend", (function() {
        this.down = !1
    }), this))
}, Controls.prototype.showMobileControls = function() {
    pc.platform.touch && (this.button_left.enabled = !0, this.button_right.enabled = !0, this.button_up.enabled = !0, this.button_down.enabled = !0)
}, Controls.prototype.hideMobileControls = function() {
    pc.platform.touch && (this.button_left.enabled = !1, this.button_right.enabled = !1, this.button_up.enabled = !1, this.button_down.enabled = !1)
}, Controls.prototype.update = function(t) {
    let n = window.innerWidth > window.innerHeight;
    this.screen_portrait.enabled = !n, this.screen_landscape.enabled = n
};
var FovAspectRatio = pc.createScript("fovAspectRatio");
FovAspectRatio.attributes.add("fov_landscape", {
    type: "number"
}), FovAspectRatio.attributes.add("fov_portrait", {
    type: "number"
}), FovAspectRatio.prototype.initialize = function() {}, FovAspectRatio.prototype.update = function(t) {
    window.innerWidth > window.innerHeight ? this.entity.camera.fov = this.fov_landscape : this.entity.camera.fov = this.fov_portrait
};
var RadialBar = pc.createScript("radialBar");
RadialBar.attributes.add("bar_mask", {
    type: "entity"
}), RadialBar.attributes.add("bar", {
    type: "entity"
}), RadialBar.attributes.add("text_entity", {
    type: "entity"
}), RadialBar.attributes.add("icon_entity", {
    type: "entity"
}), RadialBar.prototype.initialize = function() {
    this.progress = 0
}, RadialBar.prototype.setProgress = function(t) {
    this.progress = t
}, RadialBar.prototype.update = function(t) {
    this.bar_mask.element.height = 70 * this.progress, this.text_entity.element.text = Math.floor(100 * this.progress) + "%"
};
var Trunk = pc.createScript("trunk");
Trunk.attributes.add("bar", {
    type: "entity"
}), Trunk.attributes.add("text_entity", {
    type: "entity"
}), Trunk.attributes.add("pile", {
    type: "entity"
}), Trunk.attributes.add("cutter", {
    type: "entity"
}), Trunk.prototype.initialize = function() {
    this.max_capacity = 1e3, this.current = 0, Trunk.instance = this, this.empty_first_flag = !1
}, Trunk.prototype.update = function(t) {
    this.max_capacity = 2e3 + 1e3 * (UpgradeScreen.instance.capacity_level - 1);
    var e = this.current / this.max_capacity;
    e >= 1 ? (Arrow.instance.showToBarn(), this.bar.element.height = 240, this.text_entity.element.text = "FULL", this.pile.setLocalPosition(0, 3.75, -1.75), this.cutter.script.cutter.toggle(!1)) : (e > 0 && (this.empty_first_flag = !1), this.bar.element.height = 240 * e, this.text_entity.element.text = Math.floor(100 * e) + "%", this.pile.setLocalPosition(0, pc.math.lerp(2.05, 3.75, e), -1.75), this.cutter.script.cutter.toggle(!0))
}, Trunk.prototype.removeCargo = function(t) {
    let e = Math.min(t, this.current);
    return this.current -= e, this.current <= 0 && (this.empty_first_flag || (this.empty_first_flag = !0, AdsManager.instance.gameplayStop(), AdsManager.instance.showCommercialBreak(function() {
        AdsManager.instance.gameplayStart()
    }.bind(this)))), e
};
var Cutter = pc.createScript("cutter");
Cutter.attributes.add("side_left", {
    type: "entity"
}), Cutter.attributes.add("side_right", {
    type: "entity"
}), Cutter.attributes.add("segment", {
    type: "asset"
}), Cutter.attributes.add("sub_cont", {
    type: "entity"
}), Cutter.prototype.initialize = function() {
    Cutter.instance = this, this.segments = [], this.amount = 0, this.spawnSegements(6), this.is_down = !0
}, Cutter.prototype.update = function(t) {}, Cutter.prototype.toggle = function(t) {
    if (this.is_down == t) return;
    this.is_down = t, this.cont = {
        value: 0
    };
    let e = this.entity.tween(this.cont).to({
            value: 1
        }, .5, pc.CubicInOut),
        s = this.is_down ? -60 : 0,
        i = this.is_down ? 0 : -60;
    e.on("update", function() {
        let t = pc.math.lerp(s, i, this.cont.value);
        this.entity.setLocalEulerAngles(t, 0, 0)
    }.bind(this)), e.start()
}, Cutter.prototype.spawnSegements = function(t) {
    this.amount = t;
    for (let t = 0; t < this.segments.length; t++) this.segments[t].destroy();
    this.segments = [];
    for (let e = 0; e < t; e++) {
        let s = this.segment.resource.instantiate();
        this.sub_cont.addChild(s), s.setLocalPosition(e + .5 - t / 2, 0, 0), this.segments.push(s)
    }
    this.side_left.setLocalPosition(-t / 2, 0, 0), this.side_right.setLocalPosition(t / 2, 0, 0), this.entity.collision.halfExtents = new pc.Vec3(t / 2, 1.5, 1.8)
};
pc.extend(pc, function() {
        var TweenManager = function(t) {
            this._app = t, this._tweens = [], this._add = []
        };
        TweenManager.prototype = {
            add: function(t) {
                return this._add.push(t), t
            },
            update: function(t) {
                for (var i = 0, e = this._tweens.length; i < e;) this._tweens[i].update(t) ? i++ : (this._tweens.splice(i, 1), e--);
                this._add.length && (this._tweens = this._tweens.concat(this._add), this._add.length = 0)
            }
        };
        var Tween = function(t, i, e) {
                pc.events.attach(this), this.manager = i, e && (this.entity = null), this.time = 0, this.complete = !1, this.playing = !1, this.stopped = !0, this.pending = !1, this.target = t, this.duration = 0, this._currentDelay = 0, this.timeScale = 1, this._reverse = !1, this._delay = 0, this._yoyo = !1, this._count = 0, this._numRepeats = 0, this._repeatDelay = 0, this._from = !1, this._slerp = !1, this._fromQuat = new pc.Quat, this._toQuat = new pc.Quat, this._quat = new pc.Quat, this.easing = pc.Linear, this._sv = {}, this._ev = {}
            },
            _parseProperties = function(t) {
                var i;
                return t instanceof pc.Vec2 ? i = {
                    x: t.x,
                    y: t.y
                } : t instanceof pc.Vec3 ? i = {
                    x: t.x,
                    y: t.y,
                    z: t.z
                } : t instanceof pc.Vec4 || t instanceof pc.Quat ? i = {
                    x: t.x,
                    y: t.y,
                    z: t.z,
                    w: t.w
                } : t instanceof pc.Color ? (i = {
                    r: t.r,
                    g: t.g,
                    b: t.b
                }, void 0 !== t.a && (i.a = t.a)) : i = t, i
            };
        Tween.prototype = {
            to: function(t, i, e, s, n, r) {
                return this._properties = _parseProperties(t), this.duration = i, e && (this.easing = e), s && this.delay(s), n && this.repeat(n), r && this.yoyo(r), this
            },
            from: function(t, i, e, s, n, r) {
                return this._properties = _parseProperties(t), this.duration = i, e && (this.easing = e), s && this.delay(s), n && this.repeat(n), r && this.yoyo(r), this._from = !0, this
            },
            rotate: function(t, i, e, s, n, r) {
                return this._properties = _parseProperties(t), this.duration = i, e && (this.easing = e), s && this.delay(s), n && this.repeat(n), r && this.yoyo(r), this._slerp = !0, this
            },
            start: function() {
                var t, i, e, s;
                if (this.playing = !0, this.complete = !1, this.stopped = !1, this._count = 0, this.pending = this._delay > 0, this._reverse && !this.pending ? this.time = this.duration : this.time = 0, this._from) {
                    for (t in this._properties) this._properties.hasOwnProperty(t) && (this._sv[t] = this._properties[t], this._ev[t] = this.target[t]);
                    this._slerp && (this._toQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), i = void 0 !== this._properties.x ? this._properties.x : this.target.x, e = void 0 !== this._properties.y ? this._properties.y : this.target.y, s = void 0 !== this._properties.z ? this._properties.z : this.target.z, this._fromQuat.setFromEulerAngles(i, e, s))
                } else {
                    for (t in this._properties) this._properties.hasOwnProperty(t) && (this._sv[t] = this.target[t], this._ev[t] = this._properties[t]);
                    this._slerp && (this._fromQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), i = void 0 !== this._properties.x ? this._properties.x : this.target.x, e = void 0 !== this._properties.y ? this._properties.y : this.target.y, s = void 0 !== this._properties.z ? this._properties.z : this.target.z, this._toQuat.setFromEulerAngles(i, e, s))
                }
                return this._currentDelay = this._delay, this.manager.add(this), this
            },
            pause: function() {
                this.playing = !1
            },
            resume: function() {
                this.playing = !0
            },
            stop: function() {
                this.playing = !1, this.stopped = !0
            },
            delay: function(t) {
                return this._delay = t, this.pending = !0, this
            },
            repeat: function(t, i) {
                return this._count = 0, this._numRepeats = t, this._repeatDelay = i || 0, this
            },
            loop: function(t) {
                return t ? (this._count = 0, this._numRepeats = 1 / 0) : this._numRepeats = 0, this
            },
            yoyo: function(t) {
                return this._yoyo = t, this
            },
            reverse: function() {
                return this._reverse = !this._reverse, this
            },
            chain: function() {
                for (var t = arguments.length; t--;) t > 0 ? arguments[t - 1]._chained = arguments[t] : this._chained = arguments[t];
                return this
            },
            update: function(t) {
                if (this.stopped) return !1;
                if (!this.playing) return !0;
                if (!this._reverse || this.pending ? this.time += t * this.timeScale : this.time -= t * this.timeScale, this.pending) {
                    if (!(this.time > this._currentDelay)) return !0;
                    this._reverse ? this.time = this.duration - (this.time - this._currentDelay) : this.time -= this._currentDelay, this.pending = !1
                }
                var i = 0;
                (!this._reverse && this.time > this.duration || this._reverse && this.time < 0) && (this._count++, this.complete = !0, this.playing = !1, this._reverse ? (i = this.duration - this.time, this.time = 0) : (i = this.time - this.duration, this.time = this.duration));
                var e, s, n = 0 === this.duration ? 1 : this.time / this.duration,
                    r = this.easing(n);
                for (var h in this._properties) this._properties.hasOwnProperty(h) && (e = this._sv[h], s = this._ev[h], this.target[h] = e + (s - e) * r);
                if (this._slerp && this._quat.slerp(this._fromQuat, this._toQuat, r), this.entity && (this.entity._dirtifyLocal(), this.element && this.entity.element && (this.entity.element[this.element] = this.target), this._slerp && this.entity.setLocalRotation(this._quat)), this.fire("update", t), this.complete) {
                    var a = this._repeat(i);
                    return a ? this.fire("loop") : (this.fire("complete", i), this.entity && this.entity.off("destroy", this.stop, this), this._chained && this._chained.start()), a
                }
                return !0
            },
            _repeat: function(t) {
                if (this._count < this._numRepeats) {
                    if (this._reverse ? this.time = this.duration - t : this.time = t, this.complete = !1, this.playing = !0, this._currentDelay = this._repeatDelay, this.pending = !0, this._yoyo) {
                        for (var i in this._properties) {
                            var e = this._sv[i];
                            this._sv[i] = this._ev[i], this._ev[i] = e
                        }
                        this._slerp && (this._quat.copy(this._fromQuat), this._fromQuat.copy(this._toQuat), this._toQuat.copy(this._quat))
                    }
                    return !0
                }
                return !1
            }
        };
        var BounceOut = function(t) {
                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
            },
            BounceIn = function(t) {
                return 1 - BounceOut(1 - t)
            };
        return {
            TweenManager: TweenManager,
            Tween: Tween,
            Linear: function(t) {
                return t
            },
            QuadraticIn: function(t) {
                return t * t
            },
            QuadraticOut: function(t) {
                return t * (2 - t)
            },
            QuadraticInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
            },
            CubicIn: function(t) {
                return t * t * t
            },
            CubicOut: function(t) {
                return --t * t * t + 1
            },
            CubicInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
            },
            QuarticIn: function(t) {
                return t * t * t * t
            },
            QuarticOut: function(t) {
                return 1 - --t * t * t * t
            },
            QuarticInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
            },
            QuinticIn: function(t) {
                return t * t * t * t * t
            },
            QuinticOut: function(t) {
                return --t * t * t * t * t + 1
            },
            QuinticInOut: function(t) {
                return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
            },
            SineIn: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : 1 - Math.cos(t * Math.PI / 2)
            },
            SineOut: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : Math.sin(t * Math.PI / 2)
            },
            SineInOut: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : .5 * (1 - Math.cos(Math.PI * t))
            },
            ExponentialIn: function(t) {
                return 0 === t ? 0 : Math.pow(1024, t - 1)
            },
            ExponentialOut: function(t) {
                return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
            },
            ExponentialInOut: function(t) {
                return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
            },
            CircularIn: function(t) {
                return 1 - Math.sqrt(1 - t * t)
            },
            CircularOut: function(t) {
                return Math.sqrt(1 - --t * t)
            },
            CircularInOut: function(t) {
                return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
            },
            BackIn: function(t) {
                var i = 1.70158;
                return t * t * ((i + 1) * t - i)
            },
            BackOut: function(t) {
                var i = 1.70158;
                return --t * t * ((i + 1) * t + i) + 1
            },
            BackInOut: function(t) {
                var i = 2.5949095;
                return (t *= 2) < 1 ? t * t * ((i + 1) * t - i) * .5 : .5 * ((t -= 2) * t * ((i + 1) * t + i) + 2)
            },
            BounceIn: BounceIn,
            BounceOut: BounceOut,
            BounceInOut: function(t) {
                return t < .5 ? .5 * BounceIn(2 * t) : .5 * BounceOut(2 * t - 1) + .5
            },
            ElasticIn: function(t) {
                var i, e = .1;
                return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI), -e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / .4))
            },
            ElasticOut: function(t) {
                var i, e = .1;
                return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI), e * Math.pow(2, -10 * t) * Math.sin((t - i) * (2 * Math.PI) / .4) + 1)
            },
            ElasticInOut: function(t) {
                var i, e = .1,
                    s = .4;
                return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = s * Math.asin(1 / e) / (2 * Math.PI), (t *= 2) < 1 ? e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / s) * -.5 : e * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / s) * .5 + 1)
            }
        }
    }()),
    function() {
        pc.AppBase.prototype.addTweenManager = function() {
            this._tweenManager = new pc.TweenManager(this), this.on("update", (function(t) {
                this._tweenManager.update(t)
            }))
        }, pc.AppBase.prototype.tween = function(t) {
            return new pc.Tween(t, this._tweenManager)
        }, pc.Entity.prototype.tween = function(t, i) {
            var e = this._app.tween(t);
            return e.entity = this, this.once("destroy", e.stop, e), i && i.element && (e.element = i.element), e
        };
        var t = pc.AppBase.getApplication();
        t && t.addTweenManager()
    }();
var Barn = pc.createScript("barn");
Barn.prototype.initialize = function() {
    Barn.instance = this, this.entity.collision.on("triggerenter", this.onEnter, this), this.entity.collision.on("triggerleave", this.onLeave, this), this.inside = !1, this.first_time = !0
}, Barn.prototype.onEnter = function() {
    this.inside = !0
}, Barn.prototype.onLeave = function() {
    this.inside = !1, GameManager.instance.money >= 20 && this.first_time && (this.first_time = !1, Arrow.instance.showToUpgrades())
}, Barn.prototype.update = function(t) {
    if (this.inside) {
        Arrow.instance.target == this.entity && (Arrow.instance.target = null);
        let t = Trunk.instance.removeCargo(Math.max(5, Trunk.instance.current / 40));
        GameManager.instance.addMoney(t / 100)
    }
};
var ChangeCamera = pc.createScript("changeCamera");
ChangeCamera.attributes.add("camera_entity", {
    type: "entity"
}), ChangeCamera.attributes.add("text", {
    type: "entity"
}), ChangeCamera.prototype.initialize = function() {
    this.entity.button.on("click", (function() {
        this.swapCamera()
    }), this), this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this), this.app.touch && (this.text.enabled = !1)
}, ChangeCamera.prototype.onKeyDown = function(t) {
    t.key === pc.KEY_E && this.swapCamera()
}, ChangeCamera.prototype.swapCamera = function() {
    let t = this.camera_entity.script.cameraMovement;
    t.current_target == t.target_position ? t.current_target = t.target_position2 : t.current_target = t.target_position
};
var UpgradeScreen = pc.createScript("upgradeScreen");
UpgradeScreen.attributes.add("cont", {
    type: "entity"
}), UpgradeScreen.attributes.add("close_button", {
    type: "entity"
}), UpgradeScreen.attributes.add("spread_button", {
    type: "entity"
}), UpgradeScreen.attributes.add("capacity_button", {
    type: "entity"
}), UpgradeScreen.attributes.add("speed_button", {
    type: "entity"
}), UpgradeScreen.attributes.add("spread_text", {
    type: "entity"
}), UpgradeScreen.attributes.add("capacity_text", {
    type: "entity"
}), UpgradeScreen.attributes.add("speed_text", {
    type: "entity"
}), UpgradeScreen.attributes.add("spread_button_yellow", {
    type: "entity"
}), UpgradeScreen.attributes.add("capacity_button_yellow", {
    type: "entity"
}), UpgradeScreen.attributes.add("speed_button_yellow", {
    type: "entity"
}), UpgradeScreen.attributes.add("spread_lvl_text", {
    type: "entity"
}), UpgradeScreen.attributes.add("capacity_lvl_text", {
    type: "entity"
}), UpgradeScreen.attributes.add("speed_lvl_text", {
    type: "entity"
}), UpgradeScreen.attributes.add("spread_ad_button", {
    type: "entity"
}), UpgradeScreen.attributes.add("capacity_ad_button", {
    type: "entity"
}), UpgradeScreen.attributes.add("speed_ad_button", {
    type: "entity"
}), UpgradeScreen.prototype.initialize = function() {
    UpgradeScreen.instance = this, this.cont.enabled = !1, this.cooldown = .5, this.spread_ad_watched = !1, this.capacity_ad_watched = !1, this.speed_ad_watched = !1, this.close_button.button.on("click", (function() {
        this.hide()
    }), this), this.spread_level = Number(GameManager.instance.loadString("spread_level", 1)), this.capacity_level = Number(GameManager.instance.loadString("capacity_level", 1)), this.speed_level = Number(GameManager.instance.loadString("speed_level", 1)), Cutter.instance.spawnSegements(5 + this.spread_level), this.spread_cost = 0, this.capacity_cost = 0, this.speed_cost = 0, this.spread_button.button.on("click", (function() {
        this.spread_ad_watched || this.handleUpgrade(this.spread_cost, function(e) {
            this.spread_level++, e && (this.spread_ad_watched = !0), Cutter.instance.spawnSegements(5 + this.spread_level), GameManager.instance.saveString("spread_level", this.spread_level)
        }.bind(this))
    }), this), this.capacity_button.button.on("click", (function() {
        this.capacity_ad_watched || this.handleUpgrade(this.capacity_cost, function(e) {
            e && (this.capacity_ad_watched = !0), this.capacity_level++, GameManager.instance.saveString("capacity_level", this.capacity_level)
        }.bind(this))
    }), this), this.speed_button.button.on("click", (function() {
        this.speed_ad_watched || this.handleUpgrade(this.speed_cost, function(e) {
            e && (this.speed_ad_watched = !0), this.speed_level++, GameManager.instance.saveString("speed_level", this.speed_level)
        }.bind(this))
    }), this)
}, UpgradeScreen.prototype.handleUpgrade = function(e, t) {
    GameManager.instance.money >= e ? (GameManager.instance.addMoney(-e), t(!1), SoundManager.instance.playSound("register"), this.updateButtons()) : AdsManager.instance.adActive || AdsManager.instance.showRewardedBreak(function(e) {
        e && (t(!0), SoundManager.instance.playSound("register"), this.updateButtons())
    }.bind(this))
}, UpgradeScreen.prototype.update = function(e) {
    this.cooldown -= e, !AdsManager.instance.adActive && this.app.keyboard.isPressed(pc.KEY_ESCAPE) && this.hide()
}, UpgradeScreen.prototype.show = function() {
    this.cooldown > 0 || (this.cont.enabled = !0, this.spread_ad_watched = !1, this.capacity_ad_watched = !1, this.speed_ad_watched = !1, this.updateButtons(), Barn.instance.first_time = !1, AdsManager.instance.gameplayStop())
}, UpgradeScreen.prototype.hide = function() {
    this.cooldown > 0 || (this.cont.enabled = !1, AdsManager.instance.gameplayStart())
}, UpgradeScreen.prototype.updateButtons = function() {
    this.spread_cost = 20 * this.spread_level, this.spread_text.element.text = this.spread_cost, this.spread_button_yellow.enabled = GameManager.instance.money >= this.spread_cost, this.spread_ad_button.enabled = !this.spread_button_yellow.enabled, this.spread_lvl_text.element.text = "lvl" + this.spread_level, this.spread_ad_button.element.opacity = this.spread_ad_watched ? .2 : 1, this.speed_cost = 20 * this.speed_level, this.speed_text.element.text = this.speed_cost, this.speed_button_yellow.enabled = GameManager.instance.money >= this.speed_cost, this.speed_ad_button.enabled = !this.speed_button_yellow.enabled, this.speed_lvl_text.element.text = "lvl" + this.speed_level, this.speed_ad_button.element.opacity = this.speed_ad_watched ? .2 : 1, this.capacity_cost = 20 * this.capacity_level, this.capacity_text.element.text = this.capacity_cost, this.capacity_button_yellow.enabled = GameManager.instance.money >= this.capacity_cost, this.capacity_ad_button.enabled = !this.capacity_button_yellow.enabled, this.capacity_lvl_text.element.text = "lvl" + this.capacity_level, this.capacity_ad_button.element.opacity = this.capacity_ad_watched ? .2 : 1
};
var UpgradeArea = pc.createScript("upgradeArea");
UpgradeArea.prototype.initialize = function() {
    this.entity.collision.on("triggerenter", this.onEnter, this), this.entity.collision.on("triggerleave", this.onLeave, this)
}, UpgradeArea.prototype.onEnter = function(e) {
    Arrow.instance.target == this.entity && (Arrow.instance.target = null), UpgradeScreen.instance.show()
}, UpgradeArea.prototype.onLeave = function() {
    UpgradeScreen.instance.hide()
};
var SoundManager = pc.createScript("soundManager");
SoundManager.prototype.initialize = function() {
    SoundManager.instance = this, this.mute = !1, this.start_volume = this.entity.sound.volume, this.app.on("mute_down", function() {
        this.mute = !this.mute, this.entity.sound.volume = this.mute ? 0 : this.start_volume
    }.bind(this))
}, SoundManager.prototype.playSound = function(t, n = 0) {
    setTimeout(function() {
        this.entity.sound.play(t)
    }.bind(this), 1e3 * n)
}, SoundManager.prototype.setVolume = function(t, n) {
    this.entity.sound.slot(t).volume = n
}, SoundManager.prototype.setPitch = function(t, n) {
    this.entity.sound.slot(t).pitch = n
};
var MuteButton = pc.createScript("muteButton");
MuteButton.attributes.add("on_icon", {
    type: "asset"
}), MuteButton.attributes.add("off_icon", {
    type: "asset"
}), MuteButton.attributes.add("icon_entity", {
    type: "entity"
}), MuteButton.attributes.add("text", {
    type: "entity"
}), MuteButton.prototype.initialize = function() {
    this.icon_entity.element.sprite = SoundManager.instance.mute ? this.off_icon.resource : this.on_icon.resource, this.entity.button.on("click", function() {
        this.onMute()
    }.bind(this)), this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this), this.app.touch && (this.text.enabled = !1)
}, MuteButton.prototype.onKeyDown = function(t) {
    t.key === pc.KEY_M && this.onMute()
}, MuteButton.prototype.onMute = function() {
    this.app.fire("mute_down"), this.icon_entity.element.sprite = SoundManager.instance.mute ? this.off_icon.resource : this.on_icon.resource
};
var AvixRotate = pc.createScript("avixRotate");
AvixRotate.attributes.add("speed", {
    type: "vec3"
}), AvixRotate.attributes.add("speedRandom", {
    type: "vec3"
}), AvixRotate.attributes.add("randomSignX", {
    type: "boolean"
}), AvixRotate.attributes.add("randomSignY", {
    type: "boolean"
}), AvixRotate.attributes.add("randomSignZ", {
    type: "boolean"
}), AvixRotate.prototype.initialize = function() {
    this.signX = 1, this.randomSignX && Math.random() > .5 && (this.signX = -1), this.signY = 1, this.randomSignY && Math.random() > .5 && (this.signY = -1), this.signZ = 1, this.randomSignZ && Math.random() > .5 && (this.signZ = -1), this.currentRandomSpeed = new pc.Vec3(Math.random() * this.speedRandom.x, Math.random() * this.speedRandom.y, Math.random() * this.speedRandom.z)
}, AvixRotate.prototype.update = function(t) {
    this.entity.rotateLocal((this.speed.x + this.currentRandomSpeed.x) * t * this.signX, (this.speed.y + this.currentRandomSpeed.y) * t * this.signY, (this.speed.z + this.currentRandomSpeed.z) * t * this.signZ)
};
var AvixSine = pc.createScript("avixSine");
AvixSine.attributes.add("unscaled_update", {
    type: "boolean"
}), AvixSine.schemaSine = [{
    name: "enabled",
    type: "boolean",
    default: !1
}, {
    name: "wave",
    type: "string",
    default: "sine",
    enum: [{
        sine: "sine"
    }, {
        triangle: "triangle"
    }, {
        sawtooth: "sawtooth"
    }, {
        reverseSawtooth: "reverseSawtooth"
    }, {
        square: "square"
    }]
}, {
    name: "vector",
    type: "vec3"
}, {
    name: "vectorRandom",
    type: "vec3"
}, {
    name: "period",
    type: "number",
    default: 4
}, {
    name: "periodRandom",
    type: "number",
    default: 0
}, {
    name: "periodOffset",
    type: "number",
    default: 0
}, {
    name: "periodOffsetRandom",
    type: "number",
    default: 0
}, {
    name: "magnitude",
    type: "number",
    default: 1
}, {
    name: "magnitudeRandom",
    type: "number",
    default: 0
}], AvixSine.attributes.add("sineScale", {
    type: "json",
    schema: AvixSine.schemaSine
}), AvixSine.attributes.add("sinePosition", {
    type: "json",
    schema: AvixSine.schemaSine
}), AvixSine.attributes.add("sineAngle", {
    type: "json",
    schema: AvixSine.schemaSine
}), AvixSine.prototype.initialize = function() {
    this._2pi = 2 * Math.PI, this._pi_2 = Math.PI / 2, this._3pi_2 = 3 * Math.PI / 2, this.sineScale.movement = "scale", this.sinePosition.movement = "position", this.sineAngle.movement = "angle", this.sineScaleNew = this.initSine(this.sineScale), this.sinePositionNew = this.initSine(this.sinePosition), this.sineAngleNew = this.initSine(this.sineAngle), this.app.on("frameupdate", this.unscaledUpdate, this)
}, AvixSine.prototype.initSine = function(e) {
    let t = {};
    switch (0 == e.period ? t.i = 0 : (t.i = e.periodOffset / e.period * this._2pi, t.i += Math.random() * e.periodOffsetRandom / e.period * this._2pi), t.mag = Math.random() * e.magnitudeRandom, t.vectorRandom = new pc.Vec3(Math.random() * e.vectorRandom.x, Math.random() * e.vectorRandom.y, Math.random() * e.vectorRandom.z), t.periodRandom = Math.random() * e.periodRandom, t.initialValue = new pc.Vec3(0, 0, 0), e.movement) {
        case "scale":
            t.initialValue = this.entity.getLocalScale().clone();
            break;
        case "position":
            t.initialValue = this.entity.getLocalPosition().clone();
            break;
        case "angle":
            t.initialValue = this.entity.getLocalEulerAngles().clone()
    }
    return t.lastKnownValue = t.initialValue, t.r = new pc.Vec3, t.r2 = new pc.Vec3, t
}, AvixSine.prototype.update = function(e) {
    this.unscaled_update || this.generalUpdate(e)
}, AvixSine.prototype.unscaledUpdate = function(e) {
    this.unscaled_update && this.enabled && this.generalUpdate(e / 1e3)
}, AvixSine.prototype.generalUpdate = function(e) {
    this.updateSine(this.sineScaleNew, this.sineScale, e), this.updateSine(this.sinePositionNew, this.sinePosition, e), this.updateSine(this.sineAngleNew, this.sineAngle, e)
}, AvixSine.prototype.updateSine = function(e, t, i) {
    if (!t.enabled) return;
    t.period + e.periodRandom == 0 ? e.i = 0 : (e.i += i / (t.period + e.periodRandom) * this._2pi, e.i = e.i % this._2pi);
    let n = this.waveFunc(t, e.i) * (t.magnitude + e.mag);
    if ("scale" == t.movement) {
        this.entity.getLocalScale().equals(e.lastKnownValue) || (e.r.sub2(this.entity.getLocalScale(), e.lastKnownValue), e.initialValue.add(e.r)), e.r.x = e.initialValue.x + (t.vector.x + e.vectorRandom.x) * n, e.r.y = e.initialValue.y + (t.vector.y + e.vectorRandom.y) * n, e.r.z = e.initialValue.z + (t.vector.z + e.vectorRandom.z) * n;
        let i = e.r.clone();
        this.entity.setLocalScale(i), e.lastKnownValue = this.entity.getLocalScale()
    } else if ("position" == t.movement) {
        this.entity.getLocalPosition().equals(e.lastKnownValue) || (e.r.sub2(this.entity.getLocalPosition().clone(), e.lastKnownValue), e.initialValue.add(e.r)), e.r.x = e.initialValue.x + (t.vector.x + e.vectorRandom.x) * n, e.r.y = e.initialValue.y + (t.vector.y + e.vectorRandom.y) * n, e.r.z = e.initialValue.z + (t.vector.z + e.vectorRandom.z) * n;
        let i = e.r.clone();
        this.entity.setLocalPosition(i), e.lastKnownValue = this.entity.getLocalPosition().clone()
    } else if ("angle" == t.movement) {
        this.entity.getLocalEulerAngles().equals(e.lastKnownValue) || (e.r.sub2(this.entity.getLocalEulerAngles().clone(), e.lastKnownValue), e.initialValue.add(e.r)), e.r.x = e.initialValue.x + (t.vector.x + e.vectorRandom.x) * n, e.r.y = e.initialValue.y + (t.vector.y + e.vectorRandom.y) * n, e.r.z = e.initialValue.z + (t.vector.z + e.vectorRandom.z) * n;
        let i = e.r.clone();
        this.entity.setLocalEulerAngles(i), e.lastKnownValue = this.entity.getLocalEulerAngles().clone()
    }
}, AvixSine.prototype.waveFunc = function(e, t) {
    switch (t %= this._2pi, e.wave) {
        case "sine":
            return Math.sin(t);
        case "triangle":
            return t <= this._pi_2 ? t / this._pi_2 : t <= this._3pi_2 ? 1 - 2 * (t - this._pi_2) / Math.PI : (t - this._3pi_2) / this._pi_2 - 1;
        case "sawtooth":
            return 2 * t / this._2pi - 1;
        case "reverseSawtooth":
            return -2 * t / this._2pi + 1;
        case "square":
            return t < Math.PI ? -1 : 1
    }
    return 0
};
var Arrow = pc.createScript("arrow");
Arrow.attributes.add("target", {
    type: "entity"
}), Arrow.attributes.add("my_arrow", {
    type: "entity"
}), Arrow.attributes.add("sell_area", {
    type: "entity"
}), Arrow.attributes.add("upgrade_area", {
    type: "entity"
}), Arrow.prototype.initialize = function() {
    Arrow.instance = this, this.visible = !1, this.target = null
}, Arrow.prototype.update = function(t) {
    if (null == this.target) return void(this.my_arrow.enabled = !1);
    let e = this.distanceXZ(this.entity.getPosition(), this.target.getPosition());
    e < 20 && this.hide(), e > 22 && this.show(), this.visible && (this.entity.lookAt(this.target.getPosition()), this.entity.setEulerAngles(0, this.entity.getEulerAngles().y, 0))
}, Arrow.prototype.showToBarn = function() {
    this.target = this.sell_area
}, Arrow.prototype.showToUpgrades = function() {
    this.target = this.upgrade_area
}, Arrow.prototype.hide = function() {
    if (!this.visible) return;
    this.visible = !1, this.cont = {
        value: 0
    };
    let t = this.entity.tween(this.cont).to({
            value: 1
        }, .25, pc.CubicInOut),
        e = new pc.Vec3(2, 2, 2),
        i = new pc.Vec3(0, 0, 0);
    t.on("update", function() {
        let t = (new pc.Vec3).lerp(e, i, this.cont.value);
        this.my_arrow.setLocalScale(t)
    }.bind(this)), t.on("complete", function() {
        this.my_arrow.enabled = !1
    }.bind(this)), t.start()
}, Arrow.prototype.show = function() {
    if (this.visible) return;
    this.visible = !0, this.my_arrow.enabled = !0, this.cont = {
        value: 0
    };
    let t = this.entity.tween(this.cont).to({
            value: 1
        }, .25, pc.CubicInOut),
        e = new pc.Vec3(0, 0, 0),
        i = new pc.Vec3(2, 2, 2);
    t.on("update", function() {
        let t = (new pc.Vec3).lerp(e, i, this.cont.value);
        this.my_arrow.setLocalScale(t)
    }.bind(this)), t.start()
}, Arrow.prototype.distanceXZ = function(t, e) {
    var i = t.x - e.x,
        r = t.z - e.z;
    return Math.sqrt(i * i + r * r)
};
var CompleteMessage = pc.createScript("completeMessage");
CompleteMessage.attributes.add("text_entity", {
    type: "entity"
}), CompleteMessage.prototype.initialize = function() {
    CompleteMessage.instance = this, this.showing = !1
}, CompleteMessage.prototype.update = function(t) {}, CompleteMessage.prototype.showMessage = function(t) {
    this.showing = !0, this.cont = {
        value: 0
    }, this.entity.element.enabled = !0, this.entity.element.opacity = 0, this.text_entity.enabled = !0, this.text_entity.setLocalPosition(-900, 0, 0);
    var e = this.entity.tween(this.cont).to({
        value: 1
    }, .5, pc.BackOut);
    e.on("update", function(t) {
        this.entity.element.opacity = this.cont.value, this.text_entity.setLocalPosition(pc.math.lerp(-900, 0, this.cont.value), 0, 0)
    }.bind(this)), e.on("complete", function() {
        this.showing = !1, AdsManager.instance.gameplayStop(), AdsManager.instance.showCommercialBreak()
    }.bind(this));
    var i = this.entity.tween(this.cont).to({
        value: 0
    }, .5, pc.BackOut);
    i.on("update", function(t) {
        this.entity.element.opacity = this.cont.value, this.text_entity.setLocalPosition(pc.math.lerp(900, 0, this.cont.value), 0, 0)
    }.bind(this)), i.on("complete", function() {
        this.showing = !1, t()
    }.bind(this)), e.delay(1).chain(i.delay(2)), e.start()
};
var Fade = pc.createScript("fade");
Fade.prototype.initialize = function() {
    Fade.instance = this, this.entity.element.enabled = !0, this.entity.element.opacity = 1, this.fadeOut()
}, Fade.prototype.fadeIn = function(t, e = null) {
    this.entity.element.opacity = 0, this.entity.element.enabled = !0, this.cont = {
        value: 0
    };
    var n = this.entity.tween(this.cont).to({
        value: 1
    }, .7, pc.Linear);
    n.on("update", function(t) {
        this.entity.element.opacity = this.cont.value
    }.bind(this)), n.on("complete", function() {
        null != e && e()
    }.bind(this)), n.delay(t).start()
}, Fade.prototype.fadeOut = function(t, e = null) {
    this.entity.element.opacity = 1, this.entity.element.enabled = !0, this.cont = {
        value: 1
    };
    var n = this.entity.tween(this.cont).to({
        value: 0
    }, .7, pc.Linear);
    n.on("update", function(t) {
        this.entity.element.opacity = this.cont.value
    }.bind(this)), n.on("complete", function() {
        null != e && e()
    }.bind(this)), n.delay(t).start()
};