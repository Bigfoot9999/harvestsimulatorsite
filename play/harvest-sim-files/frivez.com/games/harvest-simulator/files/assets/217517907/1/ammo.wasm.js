// This is ammo.js, a port of Bullet Physics to JavaScript. zlib licensed.

var Ammo = (() => {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
        function(moduleArg = {}) {

            var a = moduleArg,
                aa, ba;
            a.ready = new Promise((b, c) => {
                aa = b;
                ba = c
            });
            var ca = Object.assign({}, a),
                da = "object" == typeof window,
                ea = "function" == typeof importScripts,
                fa = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node,
                ha = "",
                ia, ja, ka;
            if (fa) {
                var fs = require("fs"),
                    la = require("path");
                ha = ea ? la.dirname(ha) + "/" : __dirname + "/";
                ia = (b, c) => {
                    b = b.startsWith("file://") ? new URL(b) : la.normalize(b);
                    return fs.readFileSync(b, c ? void 0 : "utf8")
                };
                ka = b => {
                    b = ia(b, !0);
                    b.buffer || (b = new Uint8Array(b));
                    return b
                };
                ja = (b, c, d, e = !0) => {
                    b = b.startsWith("file://") ? new URL(b) : la.normalize(b);
                    fs.readFile(b, e ? void 0 : "utf8", (g, B) => {
                        g ? d(g) : c(e ? B.buffer : B)
                    })
                };
                !a.thisProgram && 1 < process.argv.length && process.argv[1].replace(/\\/g, "/");
                process.argv.slice(2);
                a.inspect = () => "[Emscripten Module object]"
            } else if (da ||
                ea) ea ? ha = self.location.href : "undefined" != typeof document && document.currentScript && (ha = document.currentScript.src), _scriptDir && (ha = _scriptDir), ha = 0 !== ha.indexOf("blob:") ? ha.substr(0, ha.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", ia = b => {
                var c = new XMLHttpRequest;
                c.open("GET", b, !1);
                c.send(null);
                return c.responseText
            }, ea && (ka = b => {
                var c = new XMLHttpRequest;
                c.open("GET", b, !1);
                c.responseType = "arraybuffer";
                c.send(null);
                return new Uint8Array(c.response)
            }), ja = (b, c, d) => {
                var e = new XMLHttpRequest;
                e.open("GET", b, !0);
                e.responseType = "arraybuffer";
                e.onload = () => {
                    200 == e.status || 0 == e.status && e.response ? c(e.response) : d()
                };
                e.onerror = d;
                e.send(null)
            };
            a.print || console.log.bind(console);
            var ma = a.printErr || console.error.bind(console);
            Object.assign(a, ca);
            ca = null;
            var na;
            a.wasmBinary && (na = a.wasmBinary);
            var noExitRuntime = a.noExitRuntime || !0;
            "object" != typeof WebAssembly && oa("no native wasm support detected");
            var pa, qa = !1,
                ra, sa, ta, ua, va, wa = [],
                xa = [],
                ya = [],
                za = !1;

            function Aa() {
                var b = a.preRun.shift();
                wa.unshift(b)
            }
            var Ba = 0,
                Ca = null,
                Da = null;

            function oa(b) {
                if (a.onAbort) a.onAbort(b);
                b = "Aborted(" + b + ")";
                ma(b);
                qa = !0;
                b = new WebAssembly.RuntimeError(b + ". Build with -sASSERTIONS for more info.");
                ba(b);
                throw b;
            }

            function Ea(b) {
                return b.startsWith("data:application/octet-stream;base64,")
            }
            var Fa;
            Fa = "ammo.wasm.wasm";
            if (!Ea(Fa)) {
                var Ga = Fa;
                Fa = a.locateFile ? a.locateFile(Ga, ha) : ha + Ga
            }

            function Ha(b) {
                try {
                    if (b == Fa && na) return new Uint8Array(na);
                    if (ka) return ka(b);
                    throw "both async and sync fetching of the wasm failed";
                } catch (c) {
                    oa(c)
                }
            }

            function Ia(b) {
                if (!na && (da || ea)) {
                    if ("function" == typeof fetch && !b.startsWith("file://")) return fetch(b, {
                        credentials: "same-origin"
                    }).then(c => {
                        if (!c.ok) throw "failed to load wasm binary file at '" + b + "'";
                        return c.arrayBuffer()
                    }).catch(() => Ha(b));
                    if (ja) return new Promise((c, d) => {
                        ja(b, e => c(new Uint8Array(e)), d)
                    })
                }
                return Promise.resolve().then(() => Ha(b))
            }

            function Ja(b, c, d) {
                return Ia(b).then(e => WebAssembly.instantiate(e, c)).then(e => e).then(d, e => {
                    ma("failed to asynchronously prepare wasm: " + e);
                    oa(e)
                })
            }

            function Ka(b, c) {
                var d = Fa;
                return na || "function" != typeof WebAssembly.instantiateStreaming || Ea(d) || d.startsWith("file://") || fa || "function" != typeof fetch ? Ja(d, b, c) : fetch(d, {
                    credentials: "same-origin"
                }).then(e => WebAssembly.instantiateStreaming(e, b).then(c, function(g) {
                    ma("wasm streaming compile failed: " + g);
                    ma("falling back to ArrayBuffer instantiation");
                    return Ja(d, b, c)
                }))
            }
            var La = {
                    22896: (b, c) => {
                        b = a.getCache(a.MotionState)[b];
                        if (!b.hasOwnProperty("getWorldTransform")) throw "a JSImplementation must implement all functions, you forgot MotionState::getWorldTransform.";
                        b.getWorldTransform(c)
                    },
                    23137: (b, c) => {
                        b = a.getCache(a.MotionState)[b];
                        if (!b.hasOwnProperty("setWorldTransform")) throw "a JSImplementation must implement all functions, you forgot MotionState::setWorldTransform.";
                        b.setWorldTransform(c)
                    },
                    23378: (b, c, d, e, g, B, H, Oa) => {
                        b = a.getCache(a.ConcreteContactResultCallback)[b];
                        if (!b.hasOwnProperty("addSingleResult")) throw "a JSImplementation must implement all functions, you forgot ConcreteContactResultCallback::addSingleResult.";
                        return b.addSingleResult(c, d, e, g, B, H, Oa)
                    }
                },
                Ma = b => {
                    for (; 0 < b.length;) b.shift()(a)
                },
                Na = [],
                Pa = (b, c) => {
                    Na.length = 0;
                    var d;
                    for (c >>= 2; d = ra[b++];) c += 105 != d & c, Na.push(105 == d ? sa[c] : ua[c++ >> 1]), ++c;
                    return Na
                },
                Qa = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
                Ra = b => {
                    if (b) {
                        for (var c = ra, d = b + void 0, e = b; c[e] && !(e >= d);) ++e;
                        if (16 < e - b && c.buffer && Qa) b =
                            Qa.decode(c.subarray(b, e));
                        else {
                            for (d = ""; b < e;) {
                                var g = c[b++];
                                if (g & 128) {
                                    var B = c[b++] & 63;
                                    if (192 == (g & 224)) d += String.fromCharCode((g & 31) << 6 | B);
                                    else {
                                        var H = c[b++] & 63;
                                        g = 224 == (g & 240) ? (g & 15) << 12 | B << 6 | H : (g & 7) << 18 | B << 12 | H << 6 | c[b++] & 63;
                                        65536 > g ? d += String.fromCharCode(g) : (g -= 65536, d += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023))
                                    }
                                } else d += String.fromCharCode(g)
                            }
                            b = d
                        }
                    } else b = "";
                    return b
                },
                Sa = void 0,
                Ta = [],
                Ua = {
                    a: () => {
                        oa("")
                    },
                    d: (b, c, d) => {
                        c = Pa(c, d);
                        return La[b].apply(null, c)
                    },
                    e: (b, c, d) => {
                        c = Pa(c, d);
                        return La[b].apply(null,
                            c)
                    },
                    c: function() {
                        return Date.now()
                    },
                    b: () => {
                        oa("OOM")
                    }
                };
            (function() {
                function b(d) {
                    d = d.exports;
                    a.asm = d;
                    pa = a.asm.f;
                    var e = pa.buffer;
                    a.HEAP8 = new Int8Array(e);
                    a.HEAP16 = new Int16Array(e);
                    a.HEAP32 = sa = new Int32Array(e);
                    a.HEAPU8 = ra = new Uint8Array(e);
                    a.HEAPU16 = new Uint16Array(e);
                    a.HEAPU32 = new Uint32Array(e);
                    a.HEAPF32 = ta = new Float32Array(e);
                    a.HEAPF64 = ua = new Float64Array(e);
                    va = a.asm.qp;
                    xa.unshift(a.asm.g);
                    Ba--;
                    a.monitorRunDependencies && a.monitorRunDependencies(Ba);
                    0 == Ba && (null !== Ca && (clearInterval(Ca), Ca = null), Da && (e = Da, Da = null, e()));
                    return d
                }
                var c = {
                    a: Ua
                };
                Ba++;
                a.monitorRunDependencies &&
                    a.monitorRunDependencies(Ba);
                if (a.instantiateWasm) try {
                    return a.instantiateWasm(c, b)
                } catch (d) {
                    ma("Module.instantiateWasm callback failed with error: " + d), ba(d)
                }
                Ka(c, function(d) {
                    b(d.instance)
                }).catch(ba);
                return {}
            })();
            var Va = a._emscripten_bind_btCollisionShape_setLocalScaling_1 = function() {
                    return (Va = a._emscripten_bind_btCollisionShape_setLocalScaling_1 = a.asm.h).apply(null, arguments)
                },
                Wa = a._emscripten_bind_btCollisionShape_getLocalScaling_0 = function() {
                    return (Wa = a._emscripten_bind_btCollisionShape_getLocalScaling_0 = a.asm.i).apply(null, arguments)
                },
                Xa = a._emscripten_bind_btCollisionShape_calculateLocalInertia_2 = function() {
                    return (Xa = a._emscripten_bind_btCollisionShape_calculateLocalInertia_2 = a.asm.j).apply(null, arguments)
                },
                Ya = a._emscripten_bind_btCollisionShape_setMargin_1 = function() {
                    return (Ya = a._emscripten_bind_btCollisionShape_setMargin_1 = a.asm.k).apply(null, arguments)
                },
                Za = a._emscripten_bind_btCollisionShape_getMargin_0 = function() {
                    return (Za = a._emscripten_bind_btCollisionShape_getMargin_0 = a.asm.l).apply(null, arguments)
                },
                $a = a._emscripten_bind_btCollisionShape___destroy___0 = function() {
                    return ($a = a._emscripten_bind_btCollisionShape___destroy___0 = a.asm.m).apply(null, arguments)
                },
                ab = a._emscripten_bind_btConcaveShape_setLocalScaling_1 =
                function() {
                    return (ab = a._emscripten_bind_btConcaveShape_setLocalScaling_1 = a.asm.n).apply(null, arguments)
                },
                bb = a._emscripten_bind_btConcaveShape_getLocalScaling_0 = function() {
                    return (bb = a._emscripten_bind_btConcaveShape_getLocalScaling_0 = a.asm.o).apply(null, arguments)
                },
                cb = a._emscripten_bind_btConcaveShape_calculateLocalInertia_2 = function() {
                    return (cb = a._emscripten_bind_btConcaveShape_calculateLocalInertia_2 = a.asm.p).apply(null, arguments)
                },
                db = a._emscripten_bind_btConcaveShape___destroy___0 = function() {
                    return (db =
                        a._emscripten_bind_btConcaveShape___destroy___0 = a.asm.q).apply(null, arguments)
                },
                eb = a._emscripten_bind_btCollisionAlgorithm___destroy___0 = function() {
                    return (eb = a._emscripten_bind_btCollisionAlgorithm___destroy___0 = a.asm.r).apply(null, arguments)
                },
                fb = a._emscripten_bind_btCollisionWorld_getDispatcher_0 = function() {
                    return (fb = a._emscripten_bind_btCollisionWorld_getDispatcher_0 = a.asm.s).apply(null, arguments)
                },
                gb = a._emscripten_bind_btCollisionWorld_rayTest_3 = function() {
                    return (gb = a._emscripten_bind_btCollisionWorld_rayTest_3 =
                        a.asm.t).apply(null, arguments)
                },
                hb = a._emscripten_bind_btCollisionWorld_getPairCache_0 = function() {
                    return (hb = a._emscripten_bind_btCollisionWorld_getPairCache_0 = a.asm.u).apply(null, arguments)
                },
                ib = a._emscripten_bind_btCollisionWorld_getDispatchInfo_0 = function() {
                    return (ib = a._emscripten_bind_btCollisionWorld_getDispatchInfo_0 = a.asm.v).apply(null, arguments)
                },
                jb = a._emscripten_bind_btCollisionWorld_addCollisionObject_1 = function() {
                    return (jb = a._emscripten_bind_btCollisionWorld_addCollisionObject_1 = a.asm.w).apply(null,
                        arguments)
                },
                kb = a._emscripten_bind_btCollisionWorld_addCollisionObject_2 = function() {
                    return (kb = a._emscripten_bind_btCollisionWorld_addCollisionObject_2 = a.asm.x).apply(null, arguments)
                },
                lb = a._emscripten_bind_btCollisionWorld_addCollisionObject_3 = function() {
                    return (lb = a._emscripten_bind_btCollisionWorld_addCollisionObject_3 = a.asm.y).apply(null, arguments)
                },
                mb = a._emscripten_bind_btCollisionWorld_removeCollisionObject_1 = function() {
                    return (mb = a._emscripten_bind_btCollisionWorld_removeCollisionObject_1 = a.asm.z).apply(null,
                        arguments)
                },
                nb = a._emscripten_bind_btCollisionWorld_getBroadphase_0 = function() {
                    return (nb = a._emscripten_bind_btCollisionWorld_getBroadphase_0 = a.asm.A).apply(null, arguments)
                },
                ob = a._emscripten_bind_btCollisionWorld_convexSweepTest_5 = function() {
                    return (ob = a._emscripten_bind_btCollisionWorld_convexSweepTest_5 = a.asm.B).apply(null, arguments)
                },
                pb = a._emscripten_bind_btCollisionWorld_contactPairTest_3 = function() {
                    return (pb = a._emscripten_bind_btCollisionWorld_contactPairTest_3 = a.asm.C).apply(null, arguments)
                },
                qb =
                a._emscripten_bind_btCollisionWorld_contactTest_2 = function() {
                    return (qb = a._emscripten_bind_btCollisionWorld_contactTest_2 = a.asm.D).apply(null, arguments)
                },
                rb = a._emscripten_bind_btCollisionWorld_updateSingleAabb_1 = function() {
                    return (rb = a._emscripten_bind_btCollisionWorld_updateSingleAabb_1 = a.asm.E).apply(null, arguments)
                },
                sb = a._emscripten_bind_btCollisionWorld___destroy___0 = function() {
                    return (sb = a._emscripten_bind_btCollisionWorld___destroy___0 = a.asm.F).apply(null, arguments)
                },
                tb = a._emscripten_bind_btVector3_btVector3_0 =
                function() {
                    return (tb = a._emscripten_bind_btVector3_btVector3_0 = a.asm.G).apply(null, arguments)
                },
                ub = a._emscripten_bind_btVector3_btVector3_3 = function() {
                    return (ub = a._emscripten_bind_btVector3_btVector3_3 = a.asm.H).apply(null, arguments)
                },
                vb = a._emscripten_bind_btVector3_length_0 = function() {
                    return (vb = a._emscripten_bind_btVector3_length_0 = a.asm.I).apply(null, arguments)
                },
                wb = a._emscripten_bind_btVector3_x_0 = function() {
                    return (wb = a._emscripten_bind_btVector3_x_0 = a.asm.J).apply(null, arguments)
                },
                xb = a._emscripten_bind_btVector3_y_0 =
                function() {
                    return (xb = a._emscripten_bind_btVector3_y_0 = a.asm.K).apply(null, arguments)
                },
                yb = a._emscripten_bind_btVector3_z_0 = function() {
                    return (yb = a._emscripten_bind_btVector3_z_0 = a.asm.L).apply(null, arguments)
                },
                zb = a._emscripten_bind_btVector3_setX_1 = function() {
                    return (zb = a._emscripten_bind_btVector3_setX_1 = a.asm.M).apply(null, arguments)
                },
                Ab = a._emscripten_bind_btVector3_setY_1 = function() {
                    return (Ab = a._emscripten_bind_btVector3_setY_1 = a.asm.N).apply(null, arguments)
                },
                Bb = a._emscripten_bind_btVector3_setZ_1 =
                function() {
                    return (Bb = a._emscripten_bind_btVector3_setZ_1 = a.asm.O).apply(null, arguments)
                },
                Cb = a._emscripten_bind_btVector3_setValue_3 = function() {
                    return (Cb = a._emscripten_bind_btVector3_setValue_3 = a.asm.P).apply(null, arguments)
                },
                Db = a._emscripten_bind_btVector3_normalize_0 = function() {
                    return (Db = a._emscripten_bind_btVector3_normalize_0 = a.asm.Q).apply(null, arguments)
                },
                Eb = a._emscripten_bind_btVector3_rotate_2 = function() {
                    return (Eb = a._emscripten_bind_btVector3_rotate_2 = a.asm.R).apply(null, arguments)
                },
                Fb = a._emscripten_bind_btVector3_dot_1 =
                function() {
                    return (Fb = a._emscripten_bind_btVector3_dot_1 = a.asm.S).apply(null, arguments)
                },
                Gb = a._emscripten_bind_btVector3_op_mul_1 = function() {
                    return (Gb = a._emscripten_bind_btVector3_op_mul_1 = a.asm.T).apply(null, arguments)
                },
                Hb = a._emscripten_bind_btVector3_op_add_1 = function() {
                    return (Hb = a._emscripten_bind_btVector3_op_add_1 = a.asm.U).apply(null, arguments)
                },
                Ib = a._emscripten_bind_btVector3_op_sub_1 = function() {
                    return (Ib = a._emscripten_bind_btVector3_op_sub_1 = a.asm.V).apply(null, arguments)
                },
                Jb = a._emscripten_bind_btVector3___destroy___0 =
                function() {
                    return (Jb = a._emscripten_bind_btVector3___destroy___0 = a.asm.W).apply(null, arguments)
                },
                Kb = a._emscripten_bind_btQuadWord_x_0 = function() {
                    return (Kb = a._emscripten_bind_btQuadWord_x_0 = a.asm.X).apply(null, arguments)
                },
                Lb = a._emscripten_bind_btQuadWord_y_0 = function() {
                    return (Lb = a._emscripten_bind_btQuadWord_y_0 = a.asm.Y).apply(null, arguments)
                },
                Mb = a._emscripten_bind_btQuadWord_z_0 = function() {
                    return (Mb = a._emscripten_bind_btQuadWord_z_0 = a.asm.Z).apply(null, arguments)
                },
                Nb = a._emscripten_bind_btQuadWord_w_0 =
                function() {
                    return (Nb = a._emscripten_bind_btQuadWord_w_0 = a.asm._).apply(null, arguments)
                },
                Ob = a._emscripten_bind_btQuadWord_setX_1 = function() {
                    return (Ob = a._emscripten_bind_btQuadWord_setX_1 = a.asm.$).apply(null, arguments)
                },
                Pb = a._emscripten_bind_btQuadWord_setY_1 = function() {
                    return (Pb = a._emscripten_bind_btQuadWord_setY_1 = a.asm.aa).apply(null, arguments)
                },
                Qb = a._emscripten_bind_btQuadWord_setZ_1 = function() {
                    return (Qb = a._emscripten_bind_btQuadWord_setZ_1 = a.asm.ba).apply(null, arguments)
                },
                Rb = a._emscripten_bind_btQuadWord_setW_1 =
                function() {
                    return (Rb = a._emscripten_bind_btQuadWord_setW_1 = a.asm.ca).apply(null, arguments)
                },
                Sb = a._emscripten_bind_btQuadWord___destroy___0 = function() {
                    return (Sb = a._emscripten_bind_btQuadWord___destroy___0 = a.asm.da).apply(null, arguments)
                },
                Tb = a._emscripten_bind_btMotionState_getWorldTransform_1 = function() {
                    return (Tb = a._emscripten_bind_btMotionState_getWorldTransform_1 = a.asm.ea).apply(null, arguments)
                },
                Ub = a._emscripten_bind_btMotionState_setWorldTransform_1 = function() {
                    return (Ub = a._emscripten_bind_btMotionState_setWorldTransform_1 =
                        a.asm.fa).apply(null, arguments)
                },
                Vb = a._emscripten_bind_btMotionState___destroy___0 = function() {
                    return (Vb = a._emscripten_bind_btMotionState___destroy___0 = a.asm.ga).apply(null, arguments)
                },
                Wb = a._emscripten_bind_btCollisionObject_setAnisotropicFriction_2 = function() {
                    return (Wb = a._emscripten_bind_btCollisionObject_setAnisotropicFriction_2 = a.asm.ha).apply(null, arguments)
                },
                Xb = a._emscripten_bind_btCollisionObject_getCollisionShape_0 = function() {
                    return (Xb = a._emscripten_bind_btCollisionObject_getCollisionShape_0 =
                        a.asm.ia).apply(null, arguments)
                },
                Yb = a._emscripten_bind_btCollisionObject_setContactProcessingThreshold_1 = function() {
                    return (Yb = a._emscripten_bind_btCollisionObject_setContactProcessingThreshold_1 = a.asm.ja).apply(null, arguments)
                },
                Zb = a._emscripten_bind_btCollisionObject_setActivationState_1 = function() {
                    return (Zb = a._emscripten_bind_btCollisionObject_setActivationState_1 = a.asm.ka).apply(null, arguments)
                },
                $b = a._emscripten_bind_btCollisionObject_forceActivationState_1 = function() {
                    return ($b = a._emscripten_bind_btCollisionObject_forceActivationState_1 =
                        a.asm.la).apply(null, arguments)
                },
                ac = a._emscripten_bind_btCollisionObject_activate_0 = function() {
                    return (ac = a._emscripten_bind_btCollisionObject_activate_0 = a.asm.ma).apply(null, arguments)
                },
                bc = a._emscripten_bind_btCollisionObject_activate_1 = function() {
                    return (bc = a._emscripten_bind_btCollisionObject_activate_1 = a.asm.na).apply(null, arguments)
                },
                cc = a._emscripten_bind_btCollisionObject_isActive_0 = function() {
                    return (cc = a._emscripten_bind_btCollisionObject_isActive_0 = a.asm.oa).apply(null, arguments)
                },
                dc = a._emscripten_bind_btCollisionObject_isKinematicObject_0 =
                function() {
                    return (dc = a._emscripten_bind_btCollisionObject_isKinematicObject_0 = a.asm.pa).apply(null, arguments)
                },
                ec = a._emscripten_bind_btCollisionObject_isStaticObject_0 = function() {
                    return (ec = a._emscripten_bind_btCollisionObject_isStaticObject_0 = a.asm.qa).apply(null, arguments)
                },
                fc = a._emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0 = function() {
                    return (fc = a._emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0 = a.asm.ra).apply(null, arguments)
                },
                gc = a._emscripten_bind_btCollisionObject_getRestitution_0 =
                function() {
                    return (gc = a._emscripten_bind_btCollisionObject_getRestitution_0 = a.asm.sa).apply(null, arguments)
                },
                hc = a._emscripten_bind_btCollisionObject_getFriction_0 = function() {
                    return (hc = a._emscripten_bind_btCollisionObject_getFriction_0 = a.asm.ta).apply(null, arguments)
                },
                ic = a._emscripten_bind_btCollisionObject_getRollingFriction_0 = function() {
                    return (ic = a._emscripten_bind_btCollisionObject_getRollingFriction_0 = a.asm.ua).apply(null, arguments)
                },
                jc = a._emscripten_bind_btCollisionObject_setRestitution_1 = function() {
                    return (jc =
                        a._emscripten_bind_btCollisionObject_setRestitution_1 = a.asm.va).apply(null, arguments)
                },
                kc = a._emscripten_bind_btCollisionObject_setFriction_1 = function() {
                    return (kc = a._emscripten_bind_btCollisionObject_setFriction_1 = a.asm.wa).apply(null, arguments)
                },
                lc = a._emscripten_bind_btCollisionObject_setRollingFriction_1 = function() {
                    return (lc = a._emscripten_bind_btCollisionObject_setRollingFriction_1 = a.asm.xa).apply(null, arguments)
                },
                mc = a._emscripten_bind_btCollisionObject_getWorldTransform_0 = function() {
                    return (mc = a._emscripten_bind_btCollisionObject_getWorldTransform_0 =
                        a.asm.ya).apply(null, arguments)
                },
                nc = a._emscripten_bind_btCollisionObject_getCollisionFlags_0 = function() {
                    return (nc = a._emscripten_bind_btCollisionObject_getCollisionFlags_0 = a.asm.za).apply(null, arguments)
                },
                oc = a._emscripten_bind_btCollisionObject_setCollisionFlags_1 = function() {
                    return (oc = a._emscripten_bind_btCollisionObject_setCollisionFlags_1 = a.asm.Aa).apply(null, arguments)
                },
                pc = a._emscripten_bind_btCollisionObject_setWorldTransform_1 = function() {
                    return (pc = a._emscripten_bind_btCollisionObject_setWorldTransform_1 =
                        a.asm.Ba).apply(null, arguments)
                },
                qc = a._emscripten_bind_btCollisionObject_setCollisionShape_1 = function() {
                    return (qc = a._emscripten_bind_btCollisionObject_setCollisionShape_1 = a.asm.Ca).apply(null, arguments)
                },
                rc = a._emscripten_bind_btCollisionObject_setCcdMotionThreshold_1 = function() {
                    return (rc = a._emscripten_bind_btCollisionObject_setCcdMotionThreshold_1 = a.asm.Da).apply(null, arguments)
                },
                sc = a._emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1 = function() {
                    return (sc = a._emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1 =
                        a.asm.Ea).apply(null, arguments)
                },
                tc = a._emscripten_bind_btCollisionObject_getUserIndex_0 = function() {
                    return (tc = a._emscripten_bind_btCollisionObject_getUserIndex_0 = a.asm.Fa).apply(null, arguments)
                },
                uc = a._emscripten_bind_btCollisionObject_setUserIndex_1 = function() {
                    return (uc = a._emscripten_bind_btCollisionObject_setUserIndex_1 = a.asm.Ga).apply(null, arguments)
                },
                vc = a._emscripten_bind_btCollisionObject_getUserPointer_0 = function() {
                    return (vc = a._emscripten_bind_btCollisionObject_getUserPointer_0 = a.asm.Ha).apply(null,
                        arguments)
                },
                wc = a._emscripten_bind_btCollisionObject_setUserPointer_1 = function() {
                    return (wc = a._emscripten_bind_btCollisionObject_setUserPointer_1 = a.asm.Ia).apply(null, arguments)
                },
                xc = a._emscripten_bind_btCollisionObject_getBroadphaseHandle_0 = function() {
                    return (xc = a._emscripten_bind_btCollisionObject_getBroadphaseHandle_0 = a.asm.Ja).apply(null, arguments)
                },
                yc = a._emscripten_bind_btCollisionObject___destroy___0 = function() {
                    return (yc = a._emscripten_bind_btCollisionObject___destroy___0 = a.asm.Ka).apply(null, arguments)
                },
                zc = a._emscripten_bind_RayResultCallback_hasHit_0 = function() {
                    return (zc = a._emscripten_bind_RayResultCallback_hasHit_0 = a.asm.La).apply(null, arguments)
                },
                Ac = a._emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0 = function() {
                    return (Ac = a._emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0 = a.asm.Ma).apply(null, arguments)
                },
                Bc = a._emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1 = function() {
                    return (Bc = a._emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1 = a.asm.Na).apply(null,
                        arguments)
                },
                Cc = a._emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0 = function() {
                    return (Cc = a._emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0 = a.asm.Oa).apply(null, arguments)
                },
                Dc = a._emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1 = function() {
                    return (Dc = a._emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1 = a.asm.Pa).apply(null, arguments)
                },
                Ec = a._emscripten_bind_RayResultCallback_get_m_closestHitFraction_0 = function() {
                    return (Ec = a._emscripten_bind_RayResultCallback_get_m_closestHitFraction_0 =
                        a.asm.Qa).apply(null, arguments)
                },
                Fc = a._emscripten_bind_RayResultCallback_set_m_closestHitFraction_1 = function() {
                    return (Fc = a._emscripten_bind_RayResultCallback_set_m_closestHitFraction_1 = a.asm.Ra).apply(null, arguments)
                },
                Gc = a._emscripten_bind_RayResultCallback_get_m_collisionObject_0 = function() {
                    return (Gc = a._emscripten_bind_RayResultCallback_get_m_collisionObject_0 = a.asm.Sa).apply(null, arguments)
                },
                Hc = a._emscripten_bind_RayResultCallback_set_m_collisionObject_1 = function() {
                    return (Hc = a._emscripten_bind_RayResultCallback_set_m_collisionObject_1 =
                        a.asm.Ta).apply(null, arguments)
                },
                Ic = a._emscripten_bind_RayResultCallback_get_m_flags_0 = function() {
                    return (Ic = a._emscripten_bind_RayResultCallback_get_m_flags_0 = a.asm.Ua).apply(null, arguments)
                },
                Jc = a._emscripten_bind_RayResultCallback_set_m_flags_1 = function() {
                    return (Jc = a._emscripten_bind_RayResultCallback_set_m_flags_1 = a.asm.Va).apply(null, arguments)
                },
                Kc = a._emscripten_bind_RayResultCallback___destroy___0 = function() {
                    return (Kc = a._emscripten_bind_RayResultCallback___destroy___0 = a.asm.Wa).apply(null, arguments)
                },
                Lc = a._emscripten_bind_ContactResultCallback_addSingleResult_7 = function() {
                    return (Lc = a._emscripten_bind_ContactResultCallback_addSingleResult_7 = a.asm.Xa).apply(null, arguments)
                },
                Mc = a._emscripten_bind_ContactResultCallback___destroy___0 = function() {
                    return (Mc = a._emscripten_bind_ContactResultCallback___destroy___0 = a.asm.Ya).apply(null, arguments)
                },
                Nc = a._emscripten_bind_ConvexResultCallback_hasHit_0 = function() {
                    return (Nc = a._emscripten_bind_ConvexResultCallback_hasHit_0 = a.asm.Za).apply(null, arguments)
                },
                Oc = a._emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0 =
                function() {
                    return (Oc = a._emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0 = a.asm._a).apply(null, arguments)
                },
                Pc = a._emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1 = function() {
                    return (Pc = a._emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1 = a.asm.$a).apply(null, arguments)
                },
                Qc = a._emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0 = function() {
                    return (Qc = a._emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0 = a.asm.ab).apply(null, arguments)
                },
                Rc = a._emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1 = function() {
                    return (Rc = a._emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1 = a.asm.bb).apply(null, arguments)
                },
                Sc = a._emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0 = function() {
                    return (Sc = a._emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0 = a.asm.cb).apply(null, arguments)
                },
                Tc = a._emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1 = function() {
                    return (Tc = a._emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1 =
                        a.asm.db).apply(null, arguments)
                },
                Uc = a._emscripten_bind_ConvexResultCallback___destroy___0 = function() {
                    return (Uc = a._emscripten_bind_ConvexResultCallback___destroy___0 = a.asm.eb).apply(null, arguments)
                },
                Vc = a._emscripten_bind_btConvexShape_setLocalScaling_1 = function() {
                    return (Vc = a._emscripten_bind_btConvexShape_setLocalScaling_1 = a.asm.fb).apply(null, arguments)
                },
                Wc = a._emscripten_bind_btConvexShape_getLocalScaling_0 = function() {
                    return (Wc = a._emscripten_bind_btConvexShape_getLocalScaling_0 = a.asm.gb).apply(null,
                        arguments)
                },
                Xc = a._emscripten_bind_btConvexShape_calculateLocalInertia_2 = function() {
                    return (Xc = a._emscripten_bind_btConvexShape_calculateLocalInertia_2 = a.asm.hb).apply(null, arguments)
                },
                Yc = a._emscripten_bind_btConvexShape_setMargin_1 = function() {
                    return (Yc = a._emscripten_bind_btConvexShape_setMargin_1 = a.asm.ib).apply(null, arguments)
                },
                Zc = a._emscripten_bind_btConvexShape_getMargin_0 = function() {
                    return (Zc = a._emscripten_bind_btConvexShape_getMargin_0 = a.asm.jb).apply(null, arguments)
                },
                $c = a._emscripten_bind_btConvexShape___destroy___0 =
                function() {
                    return ($c = a._emscripten_bind_btConvexShape___destroy___0 = a.asm.kb).apply(null, arguments)
                },
                ad = a._emscripten_bind_btCapsuleShape_btCapsuleShape_2 = function() {
                    return (ad = a._emscripten_bind_btCapsuleShape_btCapsuleShape_2 = a.asm.lb).apply(null, arguments)
                },
                bd = a._emscripten_bind_btCapsuleShape_setMargin_1 = function() {
                    return (bd = a._emscripten_bind_btCapsuleShape_setMargin_1 = a.asm.mb).apply(null, arguments)
                },
                cd = a._emscripten_bind_btCapsuleShape_getMargin_0 = function() {
                    return (cd = a._emscripten_bind_btCapsuleShape_getMargin_0 =
                        a.asm.nb).apply(null, arguments)
                },
                dd = a._emscripten_bind_btCapsuleShape_getUpAxis_0 = function() {
                    return (dd = a._emscripten_bind_btCapsuleShape_getUpAxis_0 = a.asm.ob).apply(null, arguments)
                },
                ed = a._emscripten_bind_btCapsuleShape_getRadius_0 = function() {
                    return (ed = a._emscripten_bind_btCapsuleShape_getRadius_0 = a.asm.pb).apply(null, arguments)
                },
                fd = a._emscripten_bind_btCapsuleShape_getHalfHeight_0 = function() {
                    return (fd = a._emscripten_bind_btCapsuleShape_getHalfHeight_0 = a.asm.qb).apply(null, arguments)
                },
                gd = a._emscripten_bind_btCapsuleShape_setLocalScaling_1 =
                function() {
                    return (gd = a._emscripten_bind_btCapsuleShape_setLocalScaling_1 = a.asm.rb).apply(null, arguments)
                },
                hd = a._emscripten_bind_btCapsuleShape_getLocalScaling_0 = function() {
                    return (hd = a._emscripten_bind_btCapsuleShape_getLocalScaling_0 = a.asm.sb).apply(null, arguments)
                },
                jd = a._emscripten_bind_btCapsuleShape_calculateLocalInertia_2 = function() {
                    return (jd = a._emscripten_bind_btCapsuleShape_calculateLocalInertia_2 = a.asm.tb).apply(null, arguments)
                },
                kd = a._emscripten_bind_btCapsuleShape___destroy___0 = function() {
                    return (kd =
                        a._emscripten_bind_btCapsuleShape___destroy___0 = a.asm.ub).apply(null, arguments)
                },
                ld = a._emscripten_bind_btCylinderShape_btCylinderShape_1 = function() {
                    return (ld = a._emscripten_bind_btCylinderShape_btCylinderShape_1 = a.asm.vb).apply(null, arguments)
                },
                md = a._emscripten_bind_btCylinderShape_setMargin_1 = function() {
                    return (md = a._emscripten_bind_btCylinderShape_setMargin_1 = a.asm.wb).apply(null, arguments)
                },
                nd = a._emscripten_bind_btCylinderShape_getMargin_0 = function() {
                    return (nd = a._emscripten_bind_btCylinderShape_getMargin_0 =
                        a.asm.xb).apply(null, arguments)
                },
                od = a._emscripten_bind_btCylinderShape_setLocalScaling_1 = function() {
                    return (od = a._emscripten_bind_btCylinderShape_setLocalScaling_1 = a.asm.yb).apply(null, arguments)
                },
                pd = a._emscripten_bind_btCylinderShape_getLocalScaling_0 = function() {
                    return (pd = a._emscripten_bind_btCylinderShape_getLocalScaling_0 = a.asm.zb).apply(null, arguments)
                },
                qd = a._emscripten_bind_btCylinderShape_calculateLocalInertia_2 = function() {
                    return (qd = a._emscripten_bind_btCylinderShape_calculateLocalInertia_2 =
                        a.asm.Ab).apply(null, arguments)
                },
                rd = a._emscripten_bind_btCylinderShape___destroy___0 = function() {
                    return (rd = a._emscripten_bind_btCylinderShape___destroy___0 = a.asm.Bb).apply(null, arguments)
                },
                sd = a._emscripten_bind_btConeShape_btConeShape_2 = function() {
                    return (sd = a._emscripten_bind_btConeShape_btConeShape_2 = a.asm.Cb).apply(null, arguments)
                },
                td = a._emscripten_bind_btConeShape_setLocalScaling_1 = function() {
                    return (td = a._emscripten_bind_btConeShape_setLocalScaling_1 = a.asm.Db).apply(null, arguments)
                },
                ud = a._emscripten_bind_btConeShape_getLocalScaling_0 =
                function() {
                    return (ud = a._emscripten_bind_btConeShape_getLocalScaling_0 = a.asm.Eb).apply(null, arguments)
                },
                vd = a._emscripten_bind_btConeShape_calculateLocalInertia_2 = function() {
                    return (vd = a._emscripten_bind_btConeShape_calculateLocalInertia_2 = a.asm.Fb).apply(null, arguments)
                },
                wd = a._emscripten_bind_btConeShape___destroy___0 = function() {
                    return (wd = a._emscripten_bind_btConeShape___destroy___0 = a.asm.Gb).apply(null, arguments)
                },
                xd = a._emscripten_bind_btStridingMeshInterface_setScaling_1 = function() {
                    return (xd = a._emscripten_bind_btStridingMeshInterface_setScaling_1 =
                        a.asm.Hb).apply(null, arguments)
                },
                yd = a._emscripten_bind_btStridingMeshInterface___destroy___0 = function() {
                    return (yd = a._emscripten_bind_btStridingMeshInterface___destroy___0 = a.asm.Ib).apply(null, arguments)
                },
                zd = a._emscripten_bind_btTriangleMeshShape_setLocalScaling_1 = function() {
                    return (zd = a._emscripten_bind_btTriangleMeshShape_setLocalScaling_1 = a.asm.Jb).apply(null, arguments)
                },
                Ad = a._emscripten_bind_btTriangleMeshShape_getLocalScaling_0 = function() {
                    return (Ad = a._emscripten_bind_btTriangleMeshShape_getLocalScaling_0 =
                        a.asm.Kb).apply(null, arguments)
                },
                Bd = a._emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2 = function() {
                    return (Bd = a._emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2 = a.asm.Lb).apply(null, arguments)
                },
                Cd = a._emscripten_bind_btTriangleMeshShape___destroy___0 = function() {
                    return (Cd = a._emscripten_bind_btTriangleMeshShape___destroy___0 = a.asm.Mb).apply(null, arguments)
                },
                Dd = a._emscripten_bind_btPrimitiveManagerBase_is_trimesh_0 = function() {
                    return (Dd = a._emscripten_bind_btPrimitiveManagerBase_is_trimesh_0 =
                        a.asm.Nb).apply(null, arguments)
                },
                Ed = a._emscripten_bind_btPrimitiveManagerBase_get_primitive_count_0 = function() {
                    return (Ed = a._emscripten_bind_btPrimitiveManagerBase_get_primitive_count_0 = a.asm.Ob).apply(null, arguments)
                },
                Fd = a._emscripten_bind_btPrimitiveManagerBase_get_primitive_box_2 = function() {
                    return (Fd = a._emscripten_bind_btPrimitiveManagerBase_get_primitive_box_2 = a.asm.Pb).apply(null, arguments)
                },
                Gd = a._emscripten_bind_btPrimitiveManagerBase_get_primitive_triangle_2 = function() {
                    return (Gd = a._emscripten_bind_btPrimitiveManagerBase_get_primitive_triangle_2 =
                        a.asm.Qb).apply(null, arguments)
                },
                Hd = a._emscripten_bind_btPrimitiveManagerBase___destroy___0 = function() {
                    return (Hd = a._emscripten_bind_btPrimitiveManagerBase___destroy___0 = a.asm.Rb).apply(null, arguments)
                },
                Id = a._emscripten_bind_btGImpactShapeInterface_updateBound_0 = function() {
                    return (Id = a._emscripten_bind_btGImpactShapeInterface_updateBound_0 = a.asm.Sb).apply(null, arguments)
                },
                Jd = a._emscripten_bind_btGImpactShapeInterface_postUpdate_0 = function() {
                    return (Jd = a._emscripten_bind_btGImpactShapeInterface_postUpdate_0 =
                        a.asm.Tb).apply(null, arguments)
                },
                Kd = a._emscripten_bind_btGImpactShapeInterface_getShapeType_0 = function() {
                    return (Kd = a._emscripten_bind_btGImpactShapeInterface_getShapeType_0 = a.asm.Ub).apply(null, arguments)
                },
                Ld = a._emscripten_bind_btGImpactShapeInterface_getName_0 = function() {
                    return (Ld = a._emscripten_bind_btGImpactShapeInterface_getName_0 = a.asm.Vb).apply(null, arguments)
                },
                Md = a._emscripten_bind_btGImpactShapeInterface_getPrimitiveManager_0 = function() {
                    return (Md = a._emscripten_bind_btGImpactShapeInterface_getPrimitiveManager_0 =
                        a.asm.Wb).apply(null, arguments)
                },
                Nd = a._emscripten_bind_btGImpactShapeInterface_getNumChildShapes_0 = function() {
                    return (Nd = a._emscripten_bind_btGImpactShapeInterface_getNumChildShapes_0 = a.asm.Xb).apply(null, arguments)
                },
                Od = a._emscripten_bind_btGImpactShapeInterface_childrenHasTransform_0 = function() {
                    return (Od = a._emscripten_bind_btGImpactShapeInterface_childrenHasTransform_0 = a.asm.Yb).apply(null, arguments)
                },
                Pd = a._emscripten_bind_btGImpactShapeInterface_needsRetrieveTriangles_0 = function() {
                    return (Pd = a._emscripten_bind_btGImpactShapeInterface_needsRetrieveTriangles_0 =
                        a.asm.Zb).apply(null, arguments)
                },
                Qd = a._emscripten_bind_btGImpactShapeInterface_needsRetrieveTetrahedrons_0 = function() {
                    return (Qd = a._emscripten_bind_btGImpactShapeInterface_needsRetrieveTetrahedrons_0 = a.asm._b).apply(null, arguments)
                },
                Rd = a._emscripten_bind_btGImpactShapeInterface_getBulletTriangle_2 = function() {
                    return (Rd = a._emscripten_bind_btGImpactShapeInterface_getBulletTriangle_2 = a.asm.$b).apply(null, arguments)
                },
                Sd = a._emscripten_bind_btGImpactShapeInterface_getBulletTetrahedron_2 = function() {
                    return (Sd =
                        a._emscripten_bind_btGImpactShapeInterface_getBulletTetrahedron_2 = a.asm.ac).apply(null, arguments)
                },
                Td = a._emscripten_bind_btGImpactShapeInterface_getChildShape_1 = function() {
                    return (Td = a._emscripten_bind_btGImpactShapeInterface_getChildShape_1 = a.asm.bc).apply(null, arguments)
                },
                Ud = a._emscripten_bind_btGImpactShapeInterface_getChildTransform_1 = function() {
                    return (Ud = a._emscripten_bind_btGImpactShapeInterface_getChildTransform_1 = a.asm.cc).apply(null, arguments)
                },
                Vd = a._emscripten_bind_btGImpactShapeInterface_setChildTransform_2 =
                function() {
                    return (Vd = a._emscripten_bind_btGImpactShapeInterface_setChildTransform_2 = a.asm.dc).apply(null, arguments)
                },
                Wd = a._emscripten_bind_btGImpactShapeInterface_setLocalScaling_1 = function() {
                    return (Wd = a._emscripten_bind_btGImpactShapeInterface_setLocalScaling_1 = a.asm.ec).apply(null, arguments)
                },
                Xd = a._emscripten_bind_btGImpactShapeInterface_getLocalScaling_0 = function() {
                    return (Xd = a._emscripten_bind_btGImpactShapeInterface_getLocalScaling_0 = a.asm.fc).apply(null, arguments)
                },
                Yd = a._emscripten_bind_btGImpactShapeInterface_calculateLocalInertia_2 =
                function() {
                    return (Yd = a._emscripten_bind_btGImpactShapeInterface_calculateLocalInertia_2 = a.asm.gc).apply(null, arguments)
                },
                Zd = a._emscripten_bind_btGImpactShapeInterface___destroy___0 = function() {
                    return (Zd = a._emscripten_bind_btGImpactShapeInterface___destroy___0 = a.asm.hc).apply(null, arguments)
                },
                $d = a._emscripten_bind_btActivatingCollisionAlgorithm___destroy___0 = function() {
                    return ($d = a._emscripten_bind_btActivatingCollisionAlgorithm___destroy___0 = a.asm.ic).apply(null, arguments)
                },
                ae = a._emscripten_bind_btDispatcher_getNumManifolds_0 =
                function() {
                    return (ae = a._emscripten_bind_btDispatcher_getNumManifolds_0 = a.asm.jc).apply(null, arguments)
                },
                be = a._emscripten_bind_btDispatcher_getManifoldByIndexInternal_1 = function() {
                    return (be = a._emscripten_bind_btDispatcher_getManifoldByIndexInternal_1 = a.asm.kc).apply(null, arguments)
                },
                ce = a._emscripten_bind_btDispatcher___destroy___0 = function() {
                    return (ce = a._emscripten_bind_btDispatcher___destroy___0 = a.asm.lc).apply(null, arguments)
                },
                de = a._emscripten_bind_btTypedConstraint_enableFeedback_1 = function() {
                    return (de =
                        a._emscripten_bind_btTypedConstraint_enableFeedback_1 = a.asm.mc).apply(null, arguments)
                },
                ee = a._emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0 = function() {
                    return (ee = a._emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0 = a.asm.nc).apply(null, arguments)
                },
                fe = a._emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1 = function() {
                    return (fe = a._emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1 = a.asm.oc).apply(null, arguments)
                },
                ge = a._emscripten_bind_btTypedConstraint_getParam_2 =
                function() {
                    return (ge = a._emscripten_bind_btTypedConstraint_getParam_2 = a.asm.pc).apply(null, arguments)
                },
                he = a._emscripten_bind_btTypedConstraint_setParam_3 = function() {
                    return (he = a._emscripten_bind_btTypedConstraint_setParam_3 = a.asm.qc).apply(null, arguments)
                },
                ie = a._emscripten_bind_btTypedConstraint___destroy___0 = function() {
                    return (ie = a._emscripten_bind_btTypedConstraint___destroy___0 = a.asm.rc).apply(null, arguments)
                },
                je = a._emscripten_bind_btDynamicsWorld_addAction_1 = function() {
                    return (je = a._emscripten_bind_btDynamicsWorld_addAction_1 =
                        a.asm.sc).apply(null, arguments)
                },
                ke = a._emscripten_bind_btDynamicsWorld_removeAction_1 = function() {
                    return (ke = a._emscripten_bind_btDynamicsWorld_removeAction_1 = a.asm.tc).apply(null, arguments)
                },
                le = a._emscripten_bind_btDynamicsWorld_getSolverInfo_0 = function() {
                    return (le = a._emscripten_bind_btDynamicsWorld_getSolverInfo_0 = a.asm.uc).apply(null, arguments)
                },
                me = a._emscripten_bind_btDynamicsWorld_setInternalTickCallback_1 = function() {
                    return (me = a._emscripten_bind_btDynamicsWorld_setInternalTickCallback_1 = a.asm.vc).apply(null,
                        arguments)
                },
                ne = a._emscripten_bind_btDynamicsWorld_setInternalTickCallback_2 = function() {
                    return (ne = a._emscripten_bind_btDynamicsWorld_setInternalTickCallback_2 = a.asm.wc).apply(null, arguments)
                },
                oe = a._emscripten_bind_btDynamicsWorld_setInternalTickCallback_3 = function() {
                    return (oe = a._emscripten_bind_btDynamicsWorld_setInternalTickCallback_3 = a.asm.xc).apply(null, arguments)
                },
                pe = a._emscripten_bind_btDynamicsWorld_getDispatcher_0 = function() {
                    return (pe = a._emscripten_bind_btDynamicsWorld_getDispatcher_0 = a.asm.yc).apply(null,
                        arguments)
                },
                qe = a._emscripten_bind_btDynamicsWorld_rayTest_3 = function() {
                    return (qe = a._emscripten_bind_btDynamicsWorld_rayTest_3 = a.asm.zc).apply(null, arguments)
                },
                re = a._emscripten_bind_btDynamicsWorld_getPairCache_0 = function() {
                    return (re = a._emscripten_bind_btDynamicsWorld_getPairCache_0 = a.asm.Ac).apply(null, arguments)
                },
                se = a._emscripten_bind_btDynamicsWorld_getDispatchInfo_0 = function() {
                    return (se = a._emscripten_bind_btDynamicsWorld_getDispatchInfo_0 = a.asm.Bc).apply(null, arguments)
                },
                te = a._emscripten_bind_btDynamicsWorld_addCollisionObject_1 =
                function() {
                    return (te = a._emscripten_bind_btDynamicsWorld_addCollisionObject_1 = a.asm.Cc).apply(null, arguments)
                },
                ue = a._emscripten_bind_btDynamicsWorld_addCollisionObject_2 = function() {
                    return (ue = a._emscripten_bind_btDynamicsWorld_addCollisionObject_2 = a.asm.Dc).apply(null, arguments)
                },
                ve = a._emscripten_bind_btDynamicsWorld_addCollisionObject_3 = function() {
                    return (ve = a._emscripten_bind_btDynamicsWorld_addCollisionObject_3 = a.asm.Ec).apply(null, arguments)
                },
                we = a._emscripten_bind_btDynamicsWorld_removeCollisionObject_1 =
                function() {
                    return (we = a._emscripten_bind_btDynamicsWorld_removeCollisionObject_1 = a.asm.Fc).apply(null, arguments)
                },
                xe = a._emscripten_bind_btDynamicsWorld_getBroadphase_0 = function() {
                    return (xe = a._emscripten_bind_btDynamicsWorld_getBroadphase_0 = a.asm.Gc).apply(null, arguments)
                },
                ye = a._emscripten_bind_btDynamicsWorld_convexSweepTest_5 = function() {
                    return (ye = a._emscripten_bind_btDynamicsWorld_convexSweepTest_5 = a.asm.Hc).apply(null, arguments)
                },
                ze = a._emscripten_bind_btDynamicsWorld_contactPairTest_3 = function() {
                    return (ze =
                        a._emscripten_bind_btDynamicsWorld_contactPairTest_3 = a.asm.Ic).apply(null, arguments)
                },
                Ae = a._emscripten_bind_btDynamicsWorld_contactTest_2 = function() {
                    return (Ae = a._emscripten_bind_btDynamicsWorld_contactTest_2 = a.asm.Jc).apply(null, arguments)
                },
                Be = a._emscripten_bind_btDynamicsWorld_updateSingleAabb_1 = function() {
                    return (Be = a._emscripten_bind_btDynamicsWorld_updateSingleAabb_1 = a.asm.Kc).apply(null, arguments)
                },
                Ce = a._emscripten_bind_btDynamicsWorld___destroy___0 = function() {
                    return (Ce = a._emscripten_bind_btDynamicsWorld___destroy___0 =
                        a.asm.Lc).apply(null, arguments)
                },
                De = a._emscripten_bind_VoidPtr___destroy___0 = function() {
                    return (De = a._emscripten_bind_VoidPtr___destroy___0 = a.asm.Mc).apply(null, arguments)
                },
                Ee = a._emscripten_bind_btVector4_btVector4_0 = function() {
                    return (Ee = a._emscripten_bind_btVector4_btVector4_0 = a.asm.Nc).apply(null, arguments)
                },
                Fe = a._emscripten_bind_btVector4_btVector4_4 = function() {
                    return (Fe = a._emscripten_bind_btVector4_btVector4_4 = a.asm.Oc).apply(null, arguments)
                },
                Ge = a._emscripten_bind_btVector4_w_0 = function() {
                    return (Ge =
                        a._emscripten_bind_btVector4_w_0 = a.asm.Pc).apply(null, arguments)
                },
                He = a._emscripten_bind_btVector4_setValue_4 = function() {
                    return (He = a._emscripten_bind_btVector4_setValue_4 = a.asm.Qc).apply(null, arguments)
                },
                Ie = a._emscripten_bind_btVector4_length_0 = function() {
                    return (Ie = a._emscripten_bind_btVector4_length_0 = a.asm.Rc).apply(null, arguments)
                },
                Je = a._emscripten_bind_btVector4_x_0 = function() {
                    return (Je = a._emscripten_bind_btVector4_x_0 = a.asm.Sc).apply(null, arguments)
                },
                Ke = a._emscripten_bind_btVector4_y_0 = function() {
                    return (Ke =
                        a._emscripten_bind_btVector4_y_0 = a.asm.Tc).apply(null, arguments)
                },
                Le = a._emscripten_bind_btVector4_z_0 = function() {
                    return (Le = a._emscripten_bind_btVector4_z_0 = a.asm.Uc).apply(null, arguments)
                },
                Me = a._emscripten_bind_btVector4_setX_1 = function() {
                    return (Me = a._emscripten_bind_btVector4_setX_1 = a.asm.Vc).apply(null, arguments)
                },
                Ne = a._emscripten_bind_btVector4_setY_1 = function() {
                    return (Ne = a._emscripten_bind_btVector4_setY_1 = a.asm.Wc).apply(null, arguments)
                },
                Oe = a._emscripten_bind_btVector4_setZ_1 = function() {
                    return (Oe =
                        a._emscripten_bind_btVector4_setZ_1 = a.asm.Xc).apply(null, arguments)
                },
                Pe = a._emscripten_bind_btVector4_normalize_0 = function() {
                    return (Pe = a._emscripten_bind_btVector4_normalize_0 = a.asm.Yc).apply(null, arguments)
                },
                Qe = a._emscripten_bind_btVector4_rotate_2 = function() {
                    return (Qe = a._emscripten_bind_btVector4_rotate_2 = a.asm.Zc).apply(null, arguments)
                },
                Re = a._emscripten_bind_btVector4_dot_1 = function() {
                    return (Re = a._emscripten_bind_btVector4_dot_1 = a.asm._c).apply(null, arguments)
                },
                Se = a._emscripten_bind_btVector4_op_mul_1 =
                function() {
                    return (Se = a._emscripten_bind_btVector4_op_mul_1 = a.asm.$c).apply(null, arguments)
                },
                Te = a._emscripten_bind_btVector4_op_add_1 = function() {
                    return (Te = a._emscripten_bind_btVector4_op_add_1 = a.asm.ad).apply(null, arguments)
                },
                Ue = a._emscripten_bind_btVector4_op_sub_1 = function() {
                    return (Ue = a._emscripten_bind_btVector4_op_sub_1 = a.asm.bd).apply(null, arguments)
                },
                Ve = a._emscripten_bind_btVector4___destroy___0 = function() {
                    return (Ve = a._emscripten_bind_btVector4___destroy___0 = a.asm.cd).apply(null, arguments)
                },
                We = a._emscripten_bind_btQuaternion_btQuaternion_4 = function() {
                    return (We = a._emscripten_bind_btQuaternion_btQuaternion_4 = a.asm.dd).apply(null, arguments)
                },
                Xe = a._emscripten_bind_btQuaternion_setValue_4 = function() {
                    return (Xe = a._emscripten_bind_btQuaternion_setValue_4 = a.asm.ed).apply(null, arguments)
                },
                Ye = a._emscripten_bind_btQuaternion_setEulerZYX_3 = function() {
                    return (Ye = a._emscripten_bind_btQuaternion_setEulerZYX_3 = a.asm.fd).apply(null, arguments)
                },
                Ze = a._emscripten_bind_btQuaternion_setRotation_2 = function() {
                    return (Ze =
                        a._emscripten_bind_btQuaternion_setRotation_2 = a.asm.gd).apply(null, arguments)
                },
                $e = a._emscripten_bind_btQuaternion_normalize_0 = function() {
                    return ($e = a._emscripten_bind_btQuaternion_normalize_0 = a.asm.hd).apply(null, arguments)
                },
                af = a._emscripten_bind_btQuaternion_length2_0 = function() {
                    return (af = a._emscripten_bind_btQuaternion_length2_0 = a.asm.id).apply(null, arguments)
                },
                bf = a._emscripten_bind_btQuaternion_length_0 = function() {
                    return (bf = a._emscripten_bind_btQuaternion_length_0 = a.asm.jd).apply(null, arguments)
                },
                cf = a._emscripten_bind_btQuaternion_dot_1 = function() {
                    return (cf = a._emscripten_bind_btQuaternion_dot_1 = a.asm.kd).apply(null, arguments)
                },
                df = a._emscripten_bind_btQuaternion_normalized_0 = function() {
                    return (df = a._emscripten_bind_btQuaternion_normalized_0 = a.asm.ld).apply(null, arguments)
                },
                ef = a._emscripten_bind_btQuaternion_getAxis_0 = function() {
                    return (ef = a._emscripten_bind_btQuaternion_getAxis_0 = a.asm.md).apply(null, arguments)
                },
                ff = a._emscripten_bind_btQuaternion_inverse_0 = function() {
                    return (ff = a._emscripten_bind_btQuaternion_inverse_0 =
                        a.asm.nd).apply(null, arguments)
                },
                gf = a._emscripten_bind_btQuaternion_getAngle_0 = function() {
                    return (gf = a._emscripten_bind_btQuaternion_getAngle_0 = a.asm.od).apply(null, arguments)
                },
                hf = a._emscripten_bind_btQuaternion_getAngleShortestPath_0 = function() {
                    return (hf = a._emscripten_bind_btQuaternion_getAngleShortestPath_0 = a.asm.pd).apply(null, arguments)
                },
                jf = a._emscripten_bind_btQuaternion_angle_1 = function() {
                    return (jf = a._emscripten_bind_btQuaternion_angle_1 = a.asm.qd).apply(null, arguments)
                },
                kf = a._emscripten_bind_btQuaternion_angleShortestPath_1 =
                function() {
                    return (kf = a._emscripten_bind_btQuaternion_angleShortestPath_1 = a.asm.rd).apply(null, arguments)
                },
                lf = a._emscripten_bind_btQuaternion_op_add_1 = function() {
                    return (lf = a._emscripten_bind_btQuaternion_op_add_1 = a.asm.sd).apply(null, arguments)
                },
                mf = a._emscripten_bind_btQuaternion_op_sub_1 = function() {
                    return (mf = a._emscripten_bind_btQuaternion_op_sub_1 = a.asm.td).apply(null, arguments)
                },
                nf = a._emscripten_bind_btQuaternion_op_mul_1 = function() {
                    return (nf = a._emscripten_bind_btQuaternion_op_mul_1 = a.asm.ud).apply(null,
                        arguments)
                },
                of = a._emscripten_bind_btQuaternion_op_mulq_1 = function() {
                    return ( of = a._emscripten_bind_btQuaternion_op_mulq_1 = a.asm.vd).apply(null, arguments)
                },
                pf = a._emscripten_bind_btQuaternion_op_div_1 = function() {
                    return (pf = a._emscripten_bind_btQuaternion_op_div_1 = a.asm.wd).apply(null, arguments)
                },
                qf = a._emscripten_bind_btQuaternion_x_0 = function() {
                    return (qf = a._emscripten_bind_btQuaternion_x_0 = a.asm.xd).apply(null, arguments)
                },
                rf = a._emscripten_bind_btQuaternion_y_0 = function() {
                    return (rf = a._emscripten_bind_btQuaternion_y_0 =
                        a.asm.yd).apply(null, arguments)
                },
                sf = a._emscripten_bind_btQuaternion_z_0 = function() {
                    return (sf = a._emscripten_bind_btQuaternion_z_0 = a.asm.zd).apply(null, arguments)
                },
                tf = a._emscripten_bind_btQuaternion_w_0 = function() {
                    return (tf = a._emscripten_bind_btQuaternion_w_0 = a.asm.Ad).apply(null, arguments)
                },
                uf = a._emscripten_bind_btQuaternion_setX_1 = function() {
                    return (uf = a._emscripten_bind_btQuaternion_setX_1 = a.asm.Bd).apply(null, arguments)
                },
                vf = a._emscripten_bind_btQuaternion_setY_1 = function() {
                    return (vf = a._emscripten_bind_btQuaternion_setY_1 =
                        a.asm.Cd).apply(null, arguments)
                },
                wf = a._emscripten_bind_btQuaternion_setZ_1 = function() {
                    return (wf = a._emscripten_bind_btQuaternion_setZ_1 = a.asm.Dd).apply(null, arguments)
                },
                xf = a._emscripten_bind_btQuaternion_setW_1 = function() {
                    return (xf = a._emscripten_bind_btQuaternion_setW_1 = a.asm.Ed).apply(null, arguments)
                },
                yf = a._emscripten_bind_btQuaternion___destroy___0 = function() {
                    return (yf = a._emscripten_bind_btQuaternion___destroy___0 = a.asm.Fd).apply(null, arguments)
                },
                zf = a._emscripten_bind_btMatrix3x3_setEulerZYX_3 = function() {
                    return (zf =
                        a._emscripten_bind_btMatrix3x3_setEulerZYX_3 = a.asm.Gd).apply(null, arguments)
                },
                Af = a._emscripten_bind_btMatrix3x3_getRotation_1 = function() {
                    return (Af = a._emscripten_bind_btMatrix3x3_getRotation_1 = a.asm.Hd).apply(null, arguments)
                },
                Bf = a._emscripten_bind_btMatrix3x3_getRow_1 = function() {
                    return (Bf = a._emscripten_bind_btMatrix3x3_getRow_1 = a.asm.Id).apply(null, arguments)
                },
                Cf = a._emscripten_bind_btMatrix3x3___destroy___0 = function() {
                    return (Cf = a._emscripten_bind_btMatrix3x3___destroy___0 = a.asm.Jd).apply(null, arguments)
                },
                Df = a._emscripten_bind_btTransform_btTransform_0 = function() {
                    return (Df = a._emscripten_bind_btTransform_btTransform_0 = a.asm.Kd).apply(null, arguments)
                },
                Ef = a._emscripten_bind_btTransform_btTransform_2 = function() {
                    return (Ef = a._emscripten_bind_btTransform_btTransform_2 = a.asm.Ld).apply(null, arguments)
                },
                Ff = a._emscripten_bind_btTransform_setIdentity_0 = function() {
                    return (Ff = a._emscripten_bind_btTransform_setIdentity_0 = a.asm.Md).apply(null, arguments)
                },
                Gf = a._emscripten_bind_btTransform_setOrigin_1 = function() {
                    return (Gf =
                        a._emscripten_bind_btTransform_setOrigin_1 = a.asm.Nd).apply(null, arguments)
                },
                Hf = a._emscripten_bind_btTransform_setRotation_1 = function() {
                    return (Hf = a._emscripten_bind_btTransform_setRotation_1 = a.asm.Od).apply(null, arguments)
                },
                If = a._emscripten_bind_btTransform_getOrigin_0 = function() {
                    return (If = a._emscripten_bind_btTransform_getOrigin_0 = a.asm.Pd).apply(null, arguments)
                },
                Jf = a._emscripten_bind_btTransform_getRotation_0 = function() {
                    return (Jf = a._emscripten_bind_btTransform_getRotation_0 = a.asm.Qd).apply(null,
                        arguments)
                },
                Kf = a._emscripten_bind_btTransform_getBasis_0 = function() {
                    return (Kf = a._emscripten_bind_btTransform_getBasis_0 = a.asm.Rd).apply(null, arguments)
                },
                Lf = a._emscripten_bind_btTransform_setFromOpenGLMatrix_1 = function() {
                    return (Lf = a._emscripten_bind_btTransform_setFromOpenGLMatrix_1 = a.asm.Sd).apply(null, arguments)
                },
                Mf = a._emscripten_bind_btTransform_inverse_0 = function() {
                    return (Mf = a._emscripten_bind_btTransform_inverse_0 = a.asm.Td).apply(null, arguments)
                },
                Nf = a._emscripten_bind_btTransform_op_mul_1 = function() {
                    return (Nf =
                        a._emscripten_bind_btTransform_op_mul_1 = a.asm.Ud).apply(null, arguments)
                },
                Of = a._emscripten_bind_btTransform___destroy___0 = function() {
                    return (Of = a._emscripten_bind_btTransform___destroy___0 = a.asm.Vd).apply(null, arguments)
                },
                Pf = a._emscripten_bind_MotionState_MotionState_0 = function() {
                    return (Pf = a._emscripten_bind_MotionState_MotionState_0 = a.asm.Wd).apply(null, arguments)
                },
                Qf = a._emscripten_bind_MotionState_getWorldTransform_1 = function() {
                    return (Qf = a._emscripten_bind_MotionState_getWorldTransform_1 = a.asm.Xd).apply(null,
                        arguments)
                },
                Rf = a._emscripten_bind_MotionState_setWorldTransform_1 = function() {
                    return (Rf = a._emscripten_bind_MotionState_setWorldTransform_1 = a.asm.Yd).apply(null, arguments)
                },
                Sf = a._emscripten_bind_MotionState___destroy___0 = function() {
                    return (Sf = a._emscripten_bind_MotionState___destroy___0 = a.asm.Zd).apply(null, arguments)
                },
                Tf = a._emscripten_bind_btDefaultMotionState_btDefaultMotionState_0 = function() {
                    return (Tf = a._emscripten_bind_btDefaultMotionState_btDefaultMotionState_0 = a.asm._d).apply(null, arguments)
                },
                Uf = a._emscripten_bind_btDefaultMotionState_btDefaultMotionState_1 = function() {
                    return (Uf = a._emscripten_bind_btDefaultMotionState_btDefaultMotionState_1 = a.asm.$d).apply(null, arguments)
                },
                Vf = a._emscripten_bind_btDefaultMotionState_btDefaultMotionState_2 = function() {
                    return (Vf = a._emscripten_bind_btDefaultMotionState_btDefaultMotionState_2 = a.asm.ae).apply(null, arguments)
                },
                Wf = a._emscripten_bind_btDefaultMotionState_getWorldTransform_1 = function() {
                    return (Wf = a._emscripten_bind_btDefaultMotionState_getWorldTransform_1 =
                        a.asm.be).apply(null, arguments)
                },
                Xf = a._emscripten_bind_btDefaultMotionState_setWorldTransform_1 = function() {
                    return (Xf = a._emscripten_bind_btDefaultMotionState_setWorldTransform_1 = a.asm.ce).apply(null, arguments)
                },
                Yf = a._emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0 = function() {
                    return (Yf = a._emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0 = a.asm.de).apply(null, arguments)
                },
                Zf = a._emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1 = function() {
                    return (Zf = a._emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1 =
                        a.asm.ee).apply(null, arguments)
                },
                $f = a._emscripten_bind_btDefaultMotionState___destroy___0 = function() {
                    return ($f = a._emscripten_bind_btDefaultMotionState___destroy___0 = a.asm.fe).apply(null, arguments)
                },
                ag = a._emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0 = function() {
                    return (ag = a._emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0 = a.asm.ge).apply(null, arguments)
                },
                bg = a._emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0 = function() {
                    return (bg = a._emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0 =
                        a.asm.he).apply(null, arguments)
                },
                cg = a._emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0 = function() {
                    return (cg = a._emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0 = a.asm.ie).apply(null, arguments)
                },
                dg = a._emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2 = function() {
                    return (dg = a._emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2 = a.asm.je).apply(null, arguments)
                },
                eg = a._emscripten_bind_ClosestRayResultCallback_hasHit_0 = function() {
                    return (eg = a._emscripten_bind_ClosestRayResultCallback_hasHit_0 =
                        a.asm.ke).apply(null, arguments)
                },
                fg = a._emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0 = function() {
                    return (fg = a._emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0 = a.asm.le).apply(null, arguments)
                },
                gg = a._emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1 = function() {
                    return (gg = a._emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1 = a.asm.me).apply(null, arguments)
                },
                hg = a._emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0 = function() {
                    return (hg = a._emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0 =
                        a.asm.ne).apply(null, arguments)
                },
                ig = a._emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1 = function() {
                    return (ig = a._emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1 = a.asm.oe).apply(null, arguments)
                },
                jg = a._emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0 = function() {
                    return (jg = a._emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0 = a.asm.pe).apply(null, arguments)
                },
                kg = a._emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1 = function() {
                    return (kg = a._emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1 =
                        a.asm.qe).apply(null, arguments)
                },
                lg = a._emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0 = function() {
                    return (lg = a._emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0 = a.asm.re).apply(null, arguments)
                },
                mg = a._emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1 = function() {
                    return (mg = a._emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1 = a.asm.se).apply(null, arguments)
                },
                ng = a._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0 = function() {
                    return (ng =
                        a._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0 = a.asm.te).apply(null, arguments)
                },
                og = a._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1 = function() {
                    return (og = a._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1 = a.asm.ue).apply(null, arguments)
                },
                pg = a._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0 = function() {
                    return (pg = a._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0 = a.asm.ve).apply(null, arguments)
                },
                qg = a._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1 = function() {
                    return (qg = a._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1 = a.asm.we).apply(null, arguments)
                },
                rg = a._emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0 = function() {
                    return (rg = a._emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0 = a.asm.xe).apply(null, arguments)
                },
                sg = a._emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1 = function() {
                    return (sg = a._emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1 =
                        a.asm.ye).apply(null, arguments)
                },
                tg = a._emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0 = function() {
                    return (tg = a._emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0 = a.asm.ze).apply(null, arguments)
                },
                ug = a._emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1 = function() {
                    return (ug = a._emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1 = a.asm.Ae).apply(null, arguments)
                },
                vg = a._emscripten_bind_ClosestRayResultCallback_get_m_flags_0 = function() {
                    return (vg =
                        a._emscripten_bind_ClosestRayResultCallback_get_m_flags_0 = a.asm.Be).apply(null, arguments)
                },
                wg = a._emscripten_bind_ClosestRayResultCallback_set_m_flags_1 = function() {
                    return (wg = a._emscripten_bind_ClosestRayResultCallback_set_m_flags_1 = a.asm.Ce).apply(null, arguments)
                },
                xg = a._emscripten_bind_ClosestRayResultCallback___destroy___0 = function() {
                    return (xg = a._emscripten_bind_ClosestRayResultCallback___destroy___0 = a.asm.De).apply(null, arguments)
                },
                yg = a._emscripten_bind_btConstCollisionObjectArray_size_0 = function() {
                    return (yg =
                        a._emscripten_bind_btConstCollisionObjectArray_size_0 = a.asm.Ee).apply(null, arguments)
                },
                zg = a._emscripten_bind_btConstCollisionObjectArray_at_1 = function() {
                    return (zg = a._emscripten_bind_btConstCollisionObjectArray_at_1 = a.asm.Fe).apply(null, arguments)
                },
                Ag = a._emscripten_bind_btConstCollisionObjectArray___destroy___0 = function() {
                    return (Ag = a._emscripten_bind_btConstCollisionObjectArray___destroy___0 = a.asm.Ge).apply(null, arguments)
                },
                Bg = a._emscripten_bind_btScalarArray_size_0 = function() {
                    return (Bg = a._emscripten_bind_btScalarArray_size_0 =
                        a.asm.He).apply(null, arguments)
                },
                Cg = a._emscripten_bind_btScalarArray_at_1 = function() {
                    return (Cg = a._emscripten_bind_btScalarArray_at_1 = a.asm.Ie).apply(null, arguments)
                },
                Dg = a._emscripten_bind_btScalarArray___destroy___0 = function() {
                    return (Dg = a._emscripten_bind_btScalarArray___destroy___0 = a.asm.Je).apply(null, arguments)
                },
                Eg = a._emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2 = function() {
                    return (Eg = a._emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2 = a.asm.Ke).apply(null,
                        arguments)
                },
                Fg = a._emscripten_bind_AllHitsRayResultCallback_hasHit_0 = function() {
                    return (Fg = a._emscripten_bind_AllHitsRayResultCallback_hasHit_0 = a.asm.Le).apply(null, arguments)
                },
                Gg = a._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0 = function() {
                    return (Gg = a._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0 = a.asm.Me).apply(null, arguments)
                },
                Hg = a._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1 = function() {
                    return (Hg = a._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1 =
                        a.asm.Ne).apply(null, arguments)
                },
                Ig = a._emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0 = function() {
                    return (Ig = a._emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0 = a.asm.Oe).apply(null, arguments)
                },
                Jg = a._emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1 = function() {
                    return (Jg = a._emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1 = a.asm.Pe).apply(null, arguments)
                },
                Kg = a._emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0 = function() {
                    return (Kg = a._emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0 =
                        a.asm.Qe).apply(null, arguments)
                },
                Lg = a._emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1 = function() {
                    return (Lg = a._emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1 = a.asm.Re).apply(null, arguments)
                },
                Mg = a._emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0 = function() {
                    return (Mg = a._emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0 = a.asm.Se).apply(null, arguments)
                },
                Ng = a._emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1 = function() {
                    return (Ng = a._emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1 =
                        a.asm.Te).apply(null, arguments)
                },
                Og = a._emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0 = function() {
                    return (Og = a._emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0 = a.asm.Ue).apply(null, arguments)
                },
                Pg = a._emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1 = function() {
                    return (Pg = a._emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1 = a.asm.Ve).apply(null, arguments)
                },
                Qg = a._emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0 = function() {
                    return (Qg = a._emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0 =
                        a.asm.We).apply(null, arguments)
                },
                Rg = a._emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1 = function() {
                    return (Rg = a._emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1 = a.asm.Xe).apply(null, arguments)
                },
                Sg = a._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0 = function() {
                    return (Sg = a._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0 = a.asm.Ye).apply(null, arguments)
                },
                Tg = a._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1 = function() {
                    return (Tg =
                        a._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1 = a.asm.Ze).apply(null, arguments)
                },
                Ug = a._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0 = function() {
                    return (Ug = a._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0 = a.asm._e).apply(null, arguments)
                },
                Vg = a._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1 = function() {
                    return (Vg = a._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1 = a.asm.$e).apply(null, arguments)
                },
                Wg = a._emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0 = function() {
                    return (Wg = a._emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0 = a.asm.af).apply(null, arguments)
                },
                Xg = a._emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1 = function() {
                    return (Xg = a._emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1 = a.asm.bf).apply(null, arguments)
                },
                Yg = a._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0 = function() {
                    return (Yg = a._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0 =
                        a.asm.cf).apply(null, arguments)
                },
                Zg = a._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1 = function() {
                    return (Zg = a._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1 = a.asm.df).apply(null, arguments)
                },
                $g = a._emscripten_bind_AllHitsRayResultCallback_get_m_flags_0 = function() {
                    return ($g = a._emscripten_bind_AllHitsRayResultCallback_get_m_flags_0 = a.asm.ef).apply(null, arguments)
                },
                ah = a._emscripten_bind_AllHitsRayResultCallback_set_m_flags_1 = function() {
                    return (ah = a._emscripten_bind_AllHitsRayResultCallback_set_m_flags_1 =
                        a.asm.ff).apply(null, arguments)
                },
                bh = a._emscripten_bind_AllHitsRayResultCallback___destroy___0 = function() {
                    return (bh = a._emscripten_bind_AllHitsRayResultCallback___destroy___0 = a.asm.gf).apply(null, arguments)
                },
                ch = a._emscripten_bind_btManifoldPoint_getPositionWorldOnA_0 = function() {
                    return (ch = a._emscripten_bind_btManifoldPoint_getPositionWorldOnA_0 = a.asm.hf).apply(null, arguments)
                },
                dh = a._emscripten_bind_btManifoldPoint_getPositionWorldOnB_0 = function() {
                    return (dh = a._emscripten_bind_btManifoldPoint_getPositionWorldOnB_0 =
                        a.asm.jf).apply(null, arguments)
                },
                eh = a._emscripten_bind_btManifoldPoint_getAppliedImpulse_0 = function() {
                    return (eh = a._emscripten_bind_btManifoldPoint_getAppliedImpulse_0 = a.asm.kf).apply(null, arguments)
                },
                fh = a._emscripten_bind_btManifoldPoint_getDistance_0 = function() {
                    return (fh = a._emscripten_bind_btManifoldPoint_getDistance_0 = a.asm.lf).apply(null, arguments)
                },
                gh = a._emscripten_bind_btManifoldPoint_get_m_localPointA_0 = function() {
                    return (gh = a._emscripten_bind_btManifoldPoint_get_m_localPointA_0 = a.asm.mf).apply(null,
                        arguments)
                },
                hh = a._emscripten_bind_btManifoldPoint_set_m_localPointA_1 = function() {
                    return (hh = a._emscripten_bind_btManifoldPoint_set_m_localPointA_1 = a.asm.nf).apply(null, arguments)
                },
                ih = a._emscripten_bind_btManifoldPoint_get_m_localPointB_0 = function() {
                    return (ih = a._emscripten_bind_btManifoldPoint_get_m_localPointB_0 = a.asm.of).apply(null, arguments)
                },
                jh = a._emscripten_bind_btManifoldPoint_set_m_localPointB_1 = function() {
                    return (jh = a._emscripten_bind_btManifoldPoint_set_m_localPointB_1 = a.asm.pf).apply(null,
                        arguments)
                },
                kh = a._emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0 = function() {
                    return (kh = a._emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0 = a.asm.qf).apply(null, arguments)
                },
                lh = a._emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1 = function() {
                    return (lh = a._emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1 = a.asm.rf).apply(null, arguments)
                },
                mh = a._emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0 = function() {
                    return (mh = a._emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0 =
                        a.asm.sf).apply(null, arguments)
                },
                nh = a._emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1 = function() {
                    return (nh = a._emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1 = a.asm.tf).apply(null, arguments)
                },
                oh = a._emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0 = function() {
                    return (oh = a._emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0 = a.asm.uf).apply(null, arguments)
                },
                ph = a._emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1 = function() {
                    return (ph = a._emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1 =
                        a.asm.vf).apply(null, arguments)
                },
                qh = a._emscripten_bind_btManifoldPoint_get_m_userPersistentData_0 = function() {
                    return (qh = a._emscripten_bind_btManifoldPoint_get_m_userPersistentData_0 = a.asm.wf).apply(null, arguments)
                },
                rh = a._emscripten_bind_btManifoldPoint_set_m_userPersistentData_1 = function() {
                    return (rh = a._emscripten_bind_btManifoldPoint_set_m_userPersistentData_1 = a.asm.xf).apply(null, arguments)
                },
                sh = a._emscripten_bind_btManifoldPoint___destroy___0 = function() {
                    return (sh = a._emscripten_bind_btManifoldPoint___destroy___0 =
                        a.asm.yf).apply(null, arguments)
                },
                th = a._emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0 = function() {
                    return (th = a._emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0 = a.asm.zf).apply(null, arguments)
                },
                uh = a._emscripten_bind_ConcreteContactResultCallback_addSingleResult_7 = function() {
                    return (uh = a._emscripten_bind_ConcreteContactResultCallback_addSingleResult_7 = a.asm.Af).apply(null, arguments)
                },
                vh = a._emscripten_bind_ConcreteContactResultCallback___destroy___0 =
                function() {
                    return (vh = a._emscripten_bind_ConcreteContactResultCallback___destroy___0 = a.asm.Bf).apply(null, arguments)
                },
                wh = a._emscripten_bind_LocalShapeInfo_get_m_shapePart_0 = function() {
                    return (wh = a._emscripten_bind_LocalShapeInfo_get_m_shapePart_0 = a.asm.Cf).apply(null, arguments)
                },
                xh = a._emscripten_bind_LocalShapeInfo_set_m_shapePart_1 = function() {
                    return (xh = a._emscripten_bind_LocalShapeInfo_set_m_shapePart_1 = a.asm.Df).apply(null, arguments)
                },
                yh = a._emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0 = function() {
                    return (yh =
                        a._emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0 = a.asm.Ef).apply(null, arguments)
                },
                zh = a._emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1 = function() {
                    return (zh = a._emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1 = a.asm.Ff).apply(null, arguments)
                },
                Ah = a._emscripten_bind_LocalShapeInfo___destroy___0 = function() {
                    return (Ah = a._emscripten_bind_LocalShapeInfo___destroy___0 = a.asm.Gf).apply(null, arguments)
                },
                Bh = a._emscripten_bind_LocalConvexResult_LocalConvexResult_5 = function() {
                    return (Bh = a._emscripten_bind_LocalConvexResult_LocalConvexResult_5 =
                        a.asm.Hf).apply(null, arguments)
                },
                Ch = a._emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0 = function() {
                    return (Ch = a._emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0 = a.asm.If).apply(null, arguments)
                },
                Dh = a._emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1 = function() {
                    return (Dh = a._emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1 = a.asm.Jf).apply(null, arguments)
                },
                Eh = a._emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0 = function() {
                    return (Eh = a._emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0 =
                        a.asm.Kf).apply(null, arguments)
                },
                Fh = a._emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1 = function() {
                    return (Fh = a._emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1 = a.asm.Lf).apply(null, arguments)
                },
                Gh = a._emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0 = function() {
                    return (Gh = a._emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0 = a.asm.Mf).apply(null, arguments)
                },
                Hh = a._emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1 = function() {
                    return (Hh = a._emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1 =
                        a.asm.Nf).apply(null, arguments)
                },
                Ih = a._emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0 = function() {
                    return (Ih = a._emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0 = a.asm.Of).apply(null, arguments)
                },
                Jh = a._emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1 = function() {
                    return (Jh = a._emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1 = a.asm.Pf).apply(null, arguments)
                },
                Kh = a._emscripten_bind_LocalConvexResult_get_m_hitFraction_0 = function() {
                    return (Kh = a._emscripten_bind_LocalConvexResult_get_m_hitFraction_0 =
                        a.asm.Qf).apply(null, arguments)
                },
                Lh = a._emscripten_bind_LocalConvexResult_set_m_hitFraction_1 = function() {
                    return (Lh = a._emscripten_bind_LocalConvexResult_set_m_hitFraction_1 = a.asm.Rf).apply(null, arguments)
                },
                Mh = a._emscripten_bind_LocalConvexResult___destroy___0 = function() {
                    return (Mh = a._emscripten_bind_LocalConvexResult___destroy___0 = a.asm.Sf).apply(null, arguments)
                },
                Nh = a._emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2 = function() {
                    return (Nh = a._emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2 =
                        a.asm.Tf).apply(null, arguments)
                },
                Oh = a._emscripten_bind_ClosestConvexResultCallback_hasHit_0 = function() {
                    return (Oh = a._emscripten_bind_ClosestConvexResultCallback_hasHit_0 = a.asm.Uf).apply(null, arguments)
                },
                Ph = a._emscripten_bind_ClosestConvexResultCallback_get_m_hitCollisionObject_0 = function() {
                    return (Ph = a._emscripten_bind_ClosestConvexResultCallback_get_m_hitCollisionObject_0 = a.asm.Vf).apply(null, arguments)
                },
                Qh = a._emscripten_bind_ClosestConvexResultCallback_set_m_hitCollisionObject_1 = function() {
                    return (Qh =
                        a._emscripten_bind_ClosestConvexResultCallback_set_m_hitCollisionObject_1 = a.asm.Wf).apply(null, arguments)
                },
                Rh = a._emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0 = function() {
                    return (Rh = a._emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0 = a.asm.Xf).apply(null, arguments)
                },
                Sh = a._emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1 = function() {
                    return (Sh = a._emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1 = a.asm.Yf).apply(null, arguments)
                },
                Th = a._emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0 = function() {
                    return (Th = a._emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0 = a.asm.Zf).apply(null, arguments)
                },
                Uh = a._emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1 = function() {
                    return (Uh = a._emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1 = a.asm._f).apply(null, arguments)
                },
                Vh = a._emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0 = function() {
                    return (Vh = a._emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0 =
                        a.asm.$f).apply(null, arguments)
                },
                Wh = a._emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1 = function() {
                    return (Wh = a._emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1 = a.asm.ag).apply(null, arguments)
                },
                Xh = a._emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0 = function() {
                    return (Xh = a._emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0 = a.asm.bg).apply(null, arguments)
                },
                Yh = a._emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1 = function() {
                    return (Yh =
                        a._emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1 = a.asm.cg).apply(null, arguments)
                },
                Zh = a._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0 = function() {
                    return (Zh = a._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0 = a.asm.dg).apply(null, arguments)
                },
                $h = a._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1 = function() {
                    return ($h = a._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1 = a.asm.eg).apply(null,
                        arguments)
                },
                ai = a._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0 = function() {
                    return (ai = a._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0 = a.asm.fg).apply(null, arguments)
                },
                bi = a._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1 = function() {
                    return (bi = a._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1 = a.asm.gg).apply(null, arguments)
                },
                ci = a._emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0 =
                function() {
                    return (ci = a._emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0 = a.asm.hg).apply(null, arguments)
                },
                di = a._emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1 = function() {
                    return (di = a._emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1 = a.asm.ig).apply(null, arguments)
                },
                ei = a._emscripten_bind_ClosestConvexResultCallback___destroy___0 = function() {
                    return (ei = a._emscripten_bind_ClosestConvexResultCallback___destroy___0 = a.asm.jg).apply(null, arguments)
                },
                fi = a._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1 = function() {
                    return (fi = a._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1 = a.asm.kg).apply(null, arguments)
                },
                gi = a._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2 = function() {
                    return (gi = a._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2 = a.asm.lg).apply(null, arguments)
                },
                hi = a._emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1 = function() {
                    return (hi = a._emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1 =
                        a.asm.mg).apply(null, arguments)
                },
                ii = a._emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0 = function() {
                    return (ii = a._emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0 = a.asm.ng).apply(null, arguments)
                },
                ji = a._emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2 = function() {
                    return (ji = a._emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2 = a.asm.og).apply(null, arguments)
                },
                ki = a._emscripten_bind_btConvexTriangleMeshShape_setMargin_1 = function() {
                    return (ki = a._emscripten_bind_btConvexTriangleMeshShape_setMargin_1 =
                        a.asm.pg).apply(null, arguments)
                },
                li = a._emscripten_bind_btConvexTriangleMeshShape_getMargin_0 = function() {
                    return (li = a._emscripten_bind_btConvexTriangleMeshShape_getMargin_0 = a.asm.qg).apply(null, arguments)
                },
                mi = a._emscripten_bind_btConvexTriangleMeshShape___destroy___0 = function() {
                    return (mi = a._emscripten_bind_btConvexTriangleMeshShape___destroy___0 = a.asm.rg).apply(null, arguments)
                },
                ni = a._emscripten_bind_btBoxShape_btBoxShape_1 = function() {
                    return (ni = a._emscripten_bind_btBoxShape_btBoxShape_1 = a.asm.sg).apply(null,
                        arguments)
                },
                oi = a._emscripten_bind_btBoxShape_setMargin_1 = function() {
                    return (oi = a._emscripten_bind_btBoxShape_setMargin_1 = a.asm.tg).apply(null, arguments)
                },
                pi = a._emscripten_bind_btBoxShape_getMargin_0 = function() {
                    return (pi = a._emscripten_bind_btBoxShape_getMargin_0 = a.asm.ug).apply(null, arguments)
                },
                qi = a._emscripten_bind_btBoxShape_setLocalScaling_1 = function() {
                    return (qi = a._emscripten_bind_btBoxShape_setLocalScaling_1 = a.asm.vg).apply(null, arguments)
                },
                ri = a._emscripten_bind_btBoxShape_getLocalScaling_0 = function() {
                    return (ri =
                        a._emscripten_bind_btBoxShape_getLocalScaling_0 = a.asm.wg).apply(null, arguments)
                },
                si = a._emscripten_bind_btBoxShape_calculateLocalInertia_2 = function() {
                    return (si = a._emscripten_bind_btBoxShape_calculateLocalInertia_2 = a.asm.xg).apply(null, arguments)
                },
                ti = a._emscripten_bind_btBoxShape___destroy___0 = function() {
                    return (ti = a._emscripten_bind_btBoxShape___destroy___0 = a.asm.yg).apply(null, arguments)
                },
                ui = a._emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2 = function() {
                    return (ui = a._emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2 =
                        a.asm.zg).apply(null, arguments)
                },
                vi = a._emscripten_bind_btCapsuleShapeX_setMargin_1 = function() {
                    return (vi = a._emscripten_bind_btCapsuleShapeX_setMargin_1 = a.asm.Ag).apply(null, arguments)
                },
                wi = a._emscripten_bind_btCapsuleShapeX_getMargin_0 = function() {
                    return (wi = a._emscripten_bind_btCapsuleShapeX_getMargin_0 = a.asm.Bg).apply(null, arguments)
                },
                xi = a._emscripten_bind_btCapsuleShapeX_getUpAxis_0 = function() {
                    return (xi = a._emscripten_bind_btCapsuleShapeX_getUpAxis_0 = a.asm.Cg).apply(null, arguments)
                },
                yi = a._emscripten_bind_btCapsuleShapeX_getRadius_0 =
                function() {
                    return (yi = a._emscripten_bind_btCapsuleShapeX_getRadius_0 = a.asm.Dg).apply(null, arguments)
                },
                zi = a._emscripten_bind_btCapsuleShapeX_getHalfHeight_0 = function() {
                    return (zi = a._emscripten_bind_btCapsuleShapeX_getHalfHeight_0 = a.asm.Eg).apply(null, arguments)
                },
                Ai = a._emscripten_bind_btCapsuleShapeX_setLocalScaling_1 = function() {
                    return (Ai = a._emscripten_bind_btCapsuleShapeX_setLocalScaling_1 = a.asm.Fg).apply(null, arguments)
                },
                Bi = a._emscripten_bind_btCapsuleShapeX_getLocalScaling_0 = function() {
                    return (Bi = a._emscripten_bind_btCapsuleShapeX_getLocalScaling_0 =
                        a.asm.Gg).apply(null, arguments)
                },
                Ci = a._emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2 = function() {
                    return (Ci = a._emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2 = a.asm.Hg).apply(null, arguments)
                },
                Di = a._emscripten_bind_btCapsuleShapeX___destroy___0 = function() {
                    return (Di = a._emscripten_bind_btCapsuleShapeX___destroy___0 = a.asm.Ig).apply(null, arguments)
                },
                Ei = a._emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2 = function() {
                    return (Ei = a._emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2 = a.asm.Jg).apply(null,
                        arguments)
                },
                Fi = a._emscripten_bind_btCapsuleShapeZ_setMargin_1 = function() {
                    return (Fi = a._emscripten_bind_btCapsuleShapeZ_setMargin_1 = a.asm.Kg).apply(null, arguments)
                },
                Gi = a._emscripten_bind_btCapsuleShapeZ_getMargin_0 = function() {
                    return (Gi = a._emscripten_bind_btCapsuleShapeZ_getMargin_0 = a.asm.Lg).apply(null, arguments)
                },
                Hi = a._emscripten_bind_btCapsuleShapeZ_getUpAxis_0 = function() {
                    return (Hi = a._emscripten_bind_btCapsuleShapeZ_getUpAxis_0 = a.asm.Mg).apply(null, arguments)
                },
                Ii = a._emscripten_bind_btCapsuleShapeZ_getRadius_0 =
                function() {
                    return (Ii = a._emscripten_bind_btCapsuleShapeZ_getRadius_0 = a.asm.Ng).apply(null, arguments)
                },
                Ji = a._emscripten_bind_btCapsuleShapeZ_getHalfHeight_0 = function() {
                    return (Ji = a._emscripten_bind_btCapsuleShapeZ_getHalfHeight_0 = a.asm.Og).apply(null, arguments)
                },
                Ki = a._emscripten_bind_btCapsuleShapeZ_setLocalScaling_1 = function() {
                    return (Ki = a._emscripten_bind_btCapsuleShapeZ_setLocalScaling_1 = a.asm.Pg).apply(null, arguments)
                },
                Li = a._emscripten_bind_btCapsuleShapeZ_getLocalScaling_0 = function() {
                    return (Li = a._emscripten_bind_btCapsuleShapeZ_getLocalScaling_0 =
                        a.asm.Qg).apply(null, arguments)
                },
                Mi = a._emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2 = function() {
                    return (Mi = a._emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2 = a.asm.Rg).apply(null, arguments)
                },
                Ni = a._emscripten_bind_btCapsuleShapeZ___destroy___0 = function() {
                    return (Ni = a._emscripten_bind_btCapsuleShapeZ___destroy___0 = a.asm.Sg).apply(null, arguments)
                },
                Oi = a._emscripten_bind_btCylinderShapeX_btCylinderShapeX_1 = function() {
                    return (Oi = a._emscripten_bind_btCylinderShapeX_btCylinderShapeX_1 = a.asm.Tg).apply(null,
                        arguments)
                },
                Pi = a._emscripten_bind_btCylinderShapeX_setMargin_1 = function() {
                    return (Pi = a._emscripten_bind_btCylinderShapeX_setMargin_1 = a.asm.Ug).apply(null, arguments)
                },
                Qi = a._emscripten_bind_btCylinderShapeX_getMargin_0 = function() {
                    return (Qi = a._emscripten_bind_btCylinderShapeX_getMargin_0 = a.asm.Vg).apply(null, arguments)
                },
                Ri = a._emscripten_bind_btCylinderShapeX_setLocalScaling_1 = function() {
                    return (Ri = a._emscripten_bind_btCylinderShapeX_setLocalScaling_1 = a.asm.Wg).apply(null, arguments)
                },
                Si = a._emscripten_bind_btCylinderShapeX_getLocalScaling_0 =
                function() {
                    return (Si = a._emscripten_bind_btCylinderShapeX_getLocalScaling_0 = a.asm.Xg).apply(null, arguments)
                },
                Ti = a._emscripten_bind_btCylinderShapeX_calculateLocalInertia_2 = function() {
                    return (Ti = a._emscripten_bind_btCylinderShapeX_calculateLocalInertia_2 = a.asm.Yg).apply(null, arguments)
                },
                Ui = a._emscripten_bind_btCylinderShapeX___destroy___0 = function() {
                    return (Ui = a._emscripten_bind_btCylinderShapeX___destroy___0 = a.asm.Zg).apply(null, arguments)
                },
                Vi = a._emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1 = function() {
                    return (Vi =
                        a._emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1 = a.asm._g).apply(null, arguments)
                },
                Wi = a._emscripten_bind_btCylinderShapeZ_setMargin_1 = function() {
                    return (Wi = a._emscripten_bind_btCylinderShapeZ_setMargin_1 = a.asm.$g).apply(null, arguments)
                },
                Xi = a._emscripten_bind_btCylinderShapeZ_getMargin_0 = function() {
                    return (Xi = a._emscripten_bind_btCylinderShapeZ_getMargin_0 = a.asm.ah).apply(null, arguments)
                },
                Yi = a._emscripten_bind_btCylinderShapeZ_setLocalScaling_1 = function() {
                    return (Yi = a._emscripten_bind_btCylinderShapeZ_setLocalScaling_1 =
                        a.asm.bh).apply(null, arguments)
                },
                Zi = a._emscripten_bind_btCylinderShapeZ_getLocalScaling_0 = function() {
                    return (Zi = a._emscripten_bind_btCylinderShapeZ_getLocalScaling_0 = a.asm.ch).apply(null, arguments)
                },
                $i = a._emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2 = function() {
                    return ($i = a._emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2 = a.asm.dh).apply(null, arguments)
                },
                aj = a._emscripten_bind_btCylinderShapeZ___destroy___0 = function() {
                    return (aj = a._emscripten_bind_btCylinderShapeZ___destroy___0 = a.asm.eh).apply(null,
                        arguments)
                },
                bj = a._emscripten_bind_btSphereShape_btSphereShape_1 = function() {
                    return (bj = a._emscripten_bind_btSphereShape_btSphereShape_1 = a.asm.fh).apply(null, arguments)
                },
                cj = a._emscripten_bind_btSphereShape_setMargin_1 = function() {
                    return (cj = a._emscripten_bind_btSphereShape_setMargin_1 = a.asm.gh).apply(null, arguments)
                },
                dj = a._emscripten_bind_btSphereShape_getMargin_0 = function() {
                    return (dj = a._emscripten_bind_btSphereShape_getMargin_0 = a.asm.hh).apply(null, arguments)
                },
                ej = a._emscripten_bind_btSphereShape_setLocalScaling_1 =
                function() {
                    return (ej = a._emscripten_bind_btSphereShape_setLocalScaling_1 = a.asm.ih).apply(null, arguments)
                },
                fj = a._emscripten_bind_btSphereShape_getLocalScaling_0 = function() {
                    return (fj = a._emscripten_bind_btSphereShape_getLocalScaling_0 = a.asm.jh).apply(null, arguments)
                },
                gj = a._emscripten_bind_btSphereShape_calculateLocalInertia_2 = function() {
                    return (gj = a._emscripten_bind_btSphereShape_calculateLocalInertia_2 = a.asm.kh).apply(null, arguments)
                },
                hj = a._emscripten_bind_btSphereShape___destroy___0 = function() {
                    return (hj =
                        a._emscripten_bind_btSphereShape___destroy___0 = a.asm.lh).apply(null, arguments)
                },
                ij = a._emscripten_bind_btMultiSphereShape_btMultiSphereShape_3 = function() {
                    return (ij = a._emscripten_bind_btMultiSphereShape_btMultiSphereShape_3 = a.asm.mh).apply(null, arguments)
                },
                jj = a._emscripten_bind_btMultiSphereShape_setLocalScaling_1 = function() {
                    return (jj = a._emscripten_bind_btMultiSphereShape_setLocalScaling_1 = a.asm.nh).apply(null, arguments)
                },
                kj = a._emscripten_bind_btMultiSphereShape_getLocalScaling_0 = function() {
                    return (kj =
                        a._emscripten_bind_btMultiSphereShape_getLocalScaling_0 = a.asm.oh).apply(null, arguments)
                },
                lj = a._emscripten_bind_btMultiSphereShape_calculateLocalInertia_2 = function() {
                    return (lj = a._emscripten_bind_btMultiSphereShape_calculateLocalInertia_2 = a.asm.ph).apply(null, arguments)
                },
                mj = a._emscripten_bind_btMultiSphereShape___destroy___0 = function() {
                    return (mj = a._emscripten_bind_btMultiSphereShape___destroy___0 = a.asm.qh).apply(null, arguments)
                },
                nj = a._emscripten_bind_btConeShapeX_btConeShapeX_2 = function() {
                    return (nj =
                        a._emscripten_bind_btConeShapeX_btConeShapeX_2 = a.asm.rh).apply(null, arguments)
                },
                oj = a._emscripten_bind_btConeShapeX_setLocalScaling_1 = function() {
                    return (oj = a._emscripten_bind_btConeShapeX_setLocalScaling_1 = a.asm.sh).apply(null, arguments)
                },
                pj = a._emscripten_bind_btConeShapeX_getLocalScaling_0 = function() {
                    return (pj = a._emscripten_bind_btConeShapeX_getLocalScaling_0 = a.asm.th).apply(null, arguments)
                },
                qj = a._emscripten_bind_btConeShapeX_calculateLocalInertia_2 = function() {
                    return (qj = a._emscripten_bind_btConeShapeX_calculateLocalInertia_2 =
                        a.asm.uh).apply(null, arguments)
                },
                rj = a._emscripten_bind_btConeShapeX___destroy___0 = function() {
                    return (rj = a._emscripten_bind_btConeShapeX___destroy___0 = a.asm.vh).apply(null, arguments)
                },
                sj = a._emscripten_bind_btConeShapeZ_btConeShapeZ_2 = function() {
                    return (sj = a._emscripten_bind_btConeShapeZ_btConeShapeZ_2 = a.asm.wh).apply(null, arguments)
                },
                tj = a._emscripten_bind_btConeShapeZ_setLocalScaling_1 = function() {
                    return (tj = a._emscripten_bind_btConeShapeZ_setLocalScaling_1 = a.asm.xh).apply(null, arguments)
                },
                uj = a._emscripten_bind_btConeShapeZ_getLocalScaling_0 =
                function() {
                    return (uj = a._emscripten_bind_btConeShapeZ_getLocalScaling_0 = a.asm.yh).apply(null, arguments)
                },
                vj = a._emscripten_bind_btConeShapeZ_calculateLocalInertia_2 = function() {
                    return (vj = a._emscripten_bind_btConeShapeZ_calculateLocalInertia_2 = a.asm.zh).apply(null, arguments)
                },
                wj = a._emscripten_bind_btConeShapeZ___destroy___0 = function() {
                    return (wj = a._emscripten_bind_btConeShapeZ___destroy___0 = a.asm.Ah).apply(null, arguments)
                },
                xj = a._emscripten_bind_btIntArray_size_0 = function() {
                    return (xj = a._emscripten_bind_btIntArray_size_0 =
                        a.asm.Bh).apply(null, arguments)
                },
                yj = a._emscripten_bind_btIntArray_at_1 = function() {
                    return (yj = a._emscripten_bind_btIntArray_at_1 = a.asm.Ch).apply(null, arguments)
                },
                zj = a._emscripten_bind_btIntArray___destroy___0 = function() {
                    return (zj = a._emscripten_bind_btIntArray___destroy___0 = a.asm.Dh).apply(null, arguments)
                },
                Aj = a._emscripten_bind_btFace_get_m_indices_0 = function() {
                    return (Aj = a._emscripten_bind_btFace_get_m_indices_0 = a.asm.Eh).apply(null, arguments)
                },
                Bj = a._emscripten_bind_btFace_set_m_indices_1 = function() {
                    return (Bj =
                        a._emscripten_bind_btFace_set_m_indices_1 = a.asm.Fh).apply(null, arguments)
                },
                Cj = a._emscripten_bind_btFace_get_m_plane_1 = function() {
                    return (Cj = a._emscripten_bind_btFace_get_m_plane_1 = a.asm.Gh).apply(null, arguments)
                },
                Dj = a._emscripten_bind_btFace_set_m_plane_2 = function() {
                    return (Dj = a._emscripten_bind_btFace_set_m_plane_2 = a.asm.Hh).apply(null, arguments)
                },
                Ej = a._emscripten_bind_btFace___destroy___0 = function() {
                    return (Ej = a._emscripten_bind_btFace___destroy___0 = a.asm.Ih).apply(null, arguments)
                },
                Fj = a._emscripten_bind_btVector3Array_size_0 =
                function() {
                    return (Fj = a._emscripten_bind_btVector3Array_size_0 = a.asm.Jh).apply(null, arguments)
                },
                Gj = a._emscripten_bind_btVector3Array_at_1 = function() {
                    return (Gj = a._emscripten_bind_btVector3Array_at_1 = a.asm.Kh).apply(null, arguments)
                },
                Hj = a._emscripten_bind_btVector3Array___destroy___0 = function() {
                    return (Hj = a._emscripten_bind_btVector3Array___destroy___0 = a.asm.Lh).apply(null, arguments)
                },
                Ij = a._emscripten_bind_btFaceArray_size_0 = function() {
                    return (Ij = a._emscripten_bind_btFaceArray_size_0 = a.asm.Mh).apply(null,
                        arguments)
                },
                Jj = a._emscripten_bind_btFaceArray_at_1 = function() {
                    return (Jj = a._emscripten_bind_btFaceArray_at_1 = a.asm.Nh).apply(null, arguments)
                },
                Kj = a._emscripten_bind_btFaceArray___destroy___0 = function() {
                    return (Kj = a._emscripten_bind_btFaceArray___destroy___0 = a.asm.Oh).apply(null, arguments)
                },
                Lj = a._emscripten_bind_btConvexPolyhedron_get_m_vertices_0 = function() {
                    return (Lj = a._emscripten_bind_btConvexPolyhedron_get_m_vertices_0 = a.asm.Ph).apply(null, arguments)
                },
                Mj = a._emscripten_bind_btConvexPolyhedron_set_m_vertices_1 =
                function() {
                    return (Mj = a._emscripten_bind_btConvexPolyhedron_set_m_vertices_1 = a.asm.Qh).apply(null, arguments)
                },
                Nj = a._emscripten_bind_btConvexPolyhedron_get_m_faces_0 = function() {
                    return (Nj = a._emscripten_bind_btConvexPolyhedron_get_m_faces_0 = a.asm.Rh).apply(null, arguments)
                },
                Oj = a._emscripten_bind_btConvexPolyhedron_set_m_faces_1 = function() {
                    return (Oj = a._emscripten_bind_btConvexPolyhedron_set_m_faces_1 = a.asm.Sh).apply(null, arguments)
                },
                Pj = a._emscripten_bind_btConvexPolyhedron___destroy___0 = function() {
                    return (Pj =
                        a._emscripten_bind_btConvexPolyhedron___destroy___0 = a.asm.Th).apply(null, arguments)
                },
                Qj = a._emscripten_bind_btCompoundShape_btCompoundShape_0 = function() {
                    return (Qj = a._emscripten_bind_btCompoundShape_btCompoundShape_0 = a.asm.Uh).apply(null, arguments)
                },
                Rj = a._emscripten_bind_btCompoundShape_btCompoundShape_1 = function() {
                    return (Rj = a._emscripten_bind_btCompoundShape_btCompoundShape_1 = a.asm.Vh).apply(null, arguments)
                },
                Sj = a._emscripten_bind_btCompoundShape_addChildShape_2 = function() {
                    return (Sj = a._emscripten_bind_btCompoundShape_addChildShape_2 =
                        a.asm.Wh).apply(null, arguments)
                },
                Tj = a._emscripten_bind_btCompoundShape_removeChildShape_1 = function() {
                    return (Tj = a._emscripten_bind_btCompoundShape_removeChildShape_1 = a.asm.Xh).apply(null, arguments)
                },
                Uj = a._emscripten_bind_btCompoundShape_removeChildShapeByIndex_1 = function() {
                    return (Uj = a._emscripten_bind_btCompoundShape_removeChildShapeByIndex_1 = a.asm.Yh).apply(null, arguments)
                },
                Vj = a._emscripten_bind_btCompoundShape_getNumChildShapes_0 = function() {
                    return (Vj = a._emscripten_bind_btCompoundShape_getNumChildShapes_0 =
                        a.asm.Zh).apply(null, arguments)
                },
                Wj = a._emscripten_bind_btCompoundShape_getChildShape_1 = function() {
                    return (Wj = a._emscripten_bind_btCompoundShape_getChildShape_1 = a.asm._h).apply(null, arguments)
                },
                Xj = a._emscripten_bind_btCompoundShape_updateChildTransform_2 = function() {
                    return (Xj = a._emscripten_bind_btCompoundShape_updateChildTransform_2 = a.asm.$h).apply(null, arguments)
                },
                Yj = a._emscripten_bind_btCompoundShape_updateChildTransform_3 = function() {
                    return (Yj = a._emscripten_bind_btCompoundShape_updateChildTransform_3 =
                        a.asm.ai).apply(null, arguments)
                },
                Zj = a._emscripten_bind_btCompoundShape_setMargin_1 = function() {
                    return (Zj = a._emscripten_bind_btCompoundShape_setMargin_1 = a.asm.bi).apply(null, arguments)
                },
                ak = a._emscripten_bind_btCompoundShape_getMargin_0 = function() {
                    return (ak = a._emscripten_bind_btCompoundShape_getMargin_0 = a.asm.ci).apply(null, arguments)
                },
                bk = a._emscripten_bind_btCompoundShape_setLocalScaling_1 = function() {
                    return (bk = a._emscripten_bind_btCompoundShape_setLocalScaling_1 = a.asm.di).apply(null, arguments)
                },
                ck =
                a._emscripten_bind_btCompoundShape_getLocalScaling_0 = function() {
                    return (ck = a._emscripten_bind_btCompoundShape_getLocalScaling_0 = a.asm.ei).apply(null, arguments)
                },
                dk = a._emscripten_bind_btCompoundShape_calculateLocalInertia_2 = function() {
                    return (dk = a._emscripten_bind_btCompoundShape_calculateLocalInertia_2 = a.asm.fi).apply(null, arguments)
                },
                ek = a._emscripten_bind_btCompoundShape___destroy___0 = function() {
                    return (ek = a._emscripten_bind_btCompoundShape___destroy___0 = a.asm.gi).apply(null, arguments)
                },
                fk = a._emscripten_bind_btIndexedMesh_get_m_numTriangles_0 =
                function() {
                    return (fk = a._emscripten_bind_btIndexedMesh_get_m_numTriangles_0 = a.asm.hi).apply(null, arguments)
                },
                gk = a._emscripten_bind_btIndexedMesh_set_m_numTriangles_1 = function() {
                    return (gk = a._emscripten_bind_btIndexedMesh_set_m_numTriangles_1 = a.asm.ii).apply(null, arguments)
                },
                hk = a._emscripten_bind_btIndexedMesh___destroy___0 = function() {
                    return (hk = a._emscripten_bind_btIndexedMesh___destroy___0 = a.asm.ji).apply(null, arguments)
                },
                ik = a._emscripten_bind_btIndexedMeshArray_size_0 = function() {
                    return (ik = a._emscripten_bind_btIndexedMeshArray_size_0 =
                        a.asm.ki).apply(null, arguments)
                },
                jk = a._emscripten_bind_btIndexedMeshArray_at_1 = function() {
                    return (jk = a._emscripten_bind_btIndexedMeshArray_at_1 = a.asm.li).apply(null, arguments)
                },
                kk = a._emscripten_bind_btIndexedMeshArray___destroy___0 = function() {
                    return (kk = a._emscripten_bind_btIndexedMeshArray___destroy___0 = a.asm.mi).apply(null, arguments)
                },
                lk = a._emscripten_bind_btTriangleMesh_btTriangleMesh_0 = function() {
                    return (lk = a._emscripten_bind_btTriangleMesh_btTriangleMesh_0 = a.asm.ni).apply(null, arguments)
                },
                mk = a._emscripten_bind_btTriangleMesh_btTriangleMesh_1 =
                function() {
                    return (mk = a._emscripten_bind_btTriangleMesh_btTriangleMesh_1 = a.asm.oi).apply(null, arguments)
                },
                nk = a._emscripten_bind_btTriangleMesh_btTriangleMesh_2 = function() {
                    return (nk = a._emscripten_bind_btTriangleMesh_btTriangleMesh_2 = a.asm.pi).apply(null, arguments)
                },
                ok = a._emscripten_bind_btTriangleMesh_addTriangle_3 = function() {
                    return (ok = a._emscripten_bind_btTriangleMesh_addTriangle_3 = a.asm.qi).apply(null, arguments)
                },
                pk = a._emscripten_bind_btTriangleMesh_addTriangle_4 = function() {
                    return (pk = a._emscripten_bind_btTriangleMesh_addTriangle_4 =
                        a.asm.ri).apply(null, arguments)
                },
                qk = a._emscripten_bind_btTriangleMesh_findOrAddVertex_2 = function() {
                    return (qk = a._emscripten_bind_btTriangleMesh_findOrAddVertex_2 = a.asm.si).apply(null, arguments)
                },
                rk = a._emscripten_bind_btTriangleMesh_addIndex_1 = function() {
                    return (rk = a._emscripten_bind_btTriangleMesh_addIndex_1 = a.asm.ti).apply(null, arguments)
                },
                sk = a._emscripten_bind_btTriangleMesh_getIndexedMeshArray_0 = function() {
                    return (sk = a._emscripten_bind_btTriangleMesh_getIndexedMeshArray_0 = a.asm.ui).apply(null, arguments)
                },
                tk = a._emscripten_bind_btTriangleMesh_setScaling_1 = function() {
                    return (tk = a._emscripten_bind_btTriangleMesh_setScaling_1 = a.asm.vi).apply(null, arguments)
                },
                uk = a._emscripten_bind_btTriangleMesh___destroy___0 = function() {
                    return (uk = a._emscripten_bind_btTriangleMesh___destroy___0 = a.asm.wi).apply(null, arguments)
                },
                vk = a._emscripten_bind_btEmptyShape_btEmptyShape_0 = function() {
                    return (vk = a._emscripten_bind_btEmptyShape_btEmptyShape_0 = a.asm.xi).apply(null, arguments)
                },
                wk = a._emscripten_bind_btEmptyShape_setLocalScaling_1 =
                function() {
                    return (wk = a._emscripten_bind_btEmptyShape_setLocalScaling_1 = a.asm.yi).apply(null, arguments)
                },
                xk = a._emscripten_bind_btEmptyShape_getLocalScaling_0 = function() {
                    return (xk = a._emscripten_bind_btEmptyShape_getLocalScaling_0 = a.asm.zi).apply(null, arguments)
                },
                yk = a._emscripten_bind_btEmptyShape_calculateLocalInertia_2 = function() {
                    return (yk = a._emscripten_bind_btEmptyShape_calculateLocalInertia_2 = a.asm.Ai).apply(null, arguments)
                },
                zk = a._emscripten_bind_btEmptyShape___destroy___0 = function() {
                    return (zk = a._emscripten_bind_btEmptyShape___destroy___0 =
                        a.asm.Bi).apply(null, arguments)
                },
                Ak = a._emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2 = function() {
                    return (Ak = a._emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2 = a.asm.Ci).apply(null, arguments)
                },
                Bk = a._emscripten_bind_btStaticPlaneShape_setLocalScaling_1 = function() {
                    return (Bk = a._emscripten_bind_btStaticPlaneShape_setLocalScaling_1 = a.asm.Di).apply(null, arguments)
                },
                Ck = a._emscripten_bind_btStaticPlaneShape_getLocalScaling_0 = function() {
                    return (Ck = a._emscripten_bind_btStaticPlaneShape_getLocalScaling_0 =
                        a.asm.Ei).apply(null, arguments)
                },
                Dk = a._emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2 = function() {
                    return (Dk = a._emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2 = a.asm.Fi).apply(null, arguments)
                },
                Ek = a._emscripten_bind_btStaticPlaneShape___destroy___0 = function() {
                    return (Ek = a._emscripten_bind_btStaticPlaneShape___destroy___0 = a.asm.Gi).apply(null, arguments)
                },
                Fk = a._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2 = function() {
                    return (Fk = a._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2 =
                        a.asm.Hi).apply(null, arguments)
                },
                Gk = a._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3 = function() {
                    return (Gk = a._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3 = a.asm.Ii).apply(null, arguments)
                },
                Hk = a._emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1 = function() {
                    return (Hk = a._emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1 = a.asm.Ji).apply(null, arguments)
                },
                Ik = a._emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0 = function() {
                    return (Ik = a._emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0 =
                        a.asm.Ki).apply(null, arguments)
                },
                Jk = a._emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2 = function() {
                    return (Jk = a._emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2 = a.asm.Li).apply(null, arguments)
                },
                Kk = a._emscripten_bind_btBvhTriangleMeshShape___destroy___0 = function() {
                    return (Kk = a._emscripten_bind_btBvhTriangleMeshShape___destroy___0 = a.asm.Mi).apply(null, arguments)
                },
                Lk = a._emscripten_bind_btAABB_btAABB_4 = function() {
                    return (Lk = a._emscripten_bind_btAABB_btAABB_4 = a.asm.Ni).apply(null,
                        arguments)
                },
                Mk = a._emscripten_bind_btAABB_invalidate_0 = function() {
                    return (Mk = a._emscripten_bind_btAABB_invalidate_0 = a.asm.Oi).apply(null, arguments)
                },
                Nk = a._emscripten_bind_btAABB_increment_margin_1 = function() {
                    return (Nk = a._emscripten_bind_btAABB_increment_margin_1 = a.asm.Pi).apply(null, arguments)
                },
                Ok = a._emscripten_bind_btAABB_copy_with_margin_2 = function() {
                    return (Ok = a._emscripten_bind_btAABB_copy_with_margin_2 = a.asm.Qi).apply(null, arguments)
                },
                Pk = a._emscripten_bind_btAABB___destroy___0 = function() {
                    return (Pk =
                        a._emscripten_bind_btAABB___destroy___0 = a.asm.Ri).apply(null, arguments)
                },
                Qk = a._emscripten_bind_btPrimitiveTriangle_btPrimitiveTriangle_0 = function() {
                    return (Qk = a._emscripten_bind_btPrimitiveTriangle_btPrimitiveTriangle_0 = a.asm.Si).apply(null, arguments)
                },
                Rk = a._emscripten_bind_btPrimitiveTriangle___destroy___0 = function() {
                    return (Rk = a._emscripten_bind_btPrimitiveTriangle___destroy___0 = a.asm.Ti).apply(null, arguments)
                },
                Sk = a._emscripten_bind_btTriangleShapeEx_btTriangleShapeEx_3 = function() {
                    return (Sk = a._emscripten_bind_btTriangleShapeEx_btTriangleShapeEx_3 =
                        a.asm.Ui).apply(null, arguments)
                },
                Tk = a._emscripten_bind_btTriangleShapeEx_getAabb_3 = function() {
                    return (Tk = a._emscripten_bind_btTriangleShapeEx_getAabb_3 = a.asm.Vi).apply(null, arguments)
                },
                Uk = a._emscripten_bind_btTriangleShapeEx_applyTransform_1 = function() {
                    return (Uk = a._emscripten_bind_btTriangleShapeEx_applyTransform_1 = a.asm.Wi).apply(null, arguments)
                },
                Vk = a._emscripten_bind_btTriangleShapeEx_buildTriPlane_1 = function() {
                    return (Vk = a._emscripten_bind_btTriangleShapeEx_buildTriPlane_1 = a.asm.Xi).apply(null, arguments)
                },
                Wk = a._emscripten_bind_btTriangleShapeEx___destroy___0 = function() {
                    return (Wk = a._emscripten_bind_btTriangleShapeEx___destroy___0 = a.asm.Yi).apply(null, arguments)
                },
                Xk = a._emscripten_bind_btTetrahedronShapeEx_btTetrahedronShapeEx_0 = function() {
                    return (Xk = a._emscripten_bind_btTetrahedronShapeEx_btTetrahedronShapeEx_0 = a.asm.Zi).apply(null, arguments)
                },
                Yk = a._emscripten_bind_btTetrahedronShapeEx_setVertices_4 = function() {
                    return (Yk = a._emscripten_bind_btTetrahedronShapeEx_setVertices_4 = a.asm._i).apply(null, arguments)
                },
                Zk = a._emscripten_bind_btTetrahedronShapeEx___destroy___0 = function() {
                    return (Zk = a._emscripten_bind_btTetrahedronShapeEx___destroy___0 = a.asm.$i).apply(null, arguments)
                },
                $k = a._emscripten_bind_CompoundPrimitiveManager_get_primitive_count_0 = function() {
                    return ($k = a._emscripten_bind_CompoundPrimitiveManager_get_primitive_count_0 = a.asm.aj).apply(null, arguments)
                },
                al = a._emscripten_bind_CompoundPrimitiveManager_get_primitive_box_2 = function() {
                    return (al = a._emscripten_bind_CompoundPrimitiveManager_get_primitive_box_2 =
                        a.asm.bj).apply(null, arguments)
                },
                bl = a._emscripten_bind_CompoundPrimitiveManager_get_primitive_triangle_2 = function() {
                    return (bl = a._emscripten_bind_CompoundPrimitiveManager_get_primitive_triangle_2 = a.asm.cj).apply(null, arguments)
                },
                cl = a._emscripten_bind_CompoundPrimitiveManager_is_trimesh_0 = function() {
                    return (cl = a._emscripten_bind_CompoundPrimitiveManager_is_trimesh_0 = a.asm.dj).apply(null, arguments)
                },
                dl = a._emscripten_bind_CompoundPrimitiveManager_get_m_compoundShape_0 = function() {
                    return (dl = a._emscripten_bind_CompoundPrimitiveManager_get_m_compoundShape_0 =
                        a.asm.ej).apply(null, arguments)
                },
                el = a._emscripten_bind_CompoundPrimitiveManager_set_m_compoundShape_1 = function() {
                    return (el = a._emscripten_bind_CompoundPrimitiveManager_set_m_compoundShape_1 = a.asm.fj).apply(null, arguments)
                },
                fl = a._emscripten_bind_CompoundPrimitiveManager___destroy___0 = function() {
                    return (fl = a._emscripten_bind_CompoundPrimitiveManager___destroy___0 = a.asm.gj).apply(null, arguments)
                },
                gl = a._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_0 = function() {
                    return (gl = a._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_0 =
                        a.asm.hj).apply(null, arguments)
                },
                hl = a._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_1 = function() {
                    return (hl = a._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_1 = a.asm.ij).apply(null, arguments)
                },
                il = a._emscripten_bind_btGImpactCompoundShape_childrenHasTransform_0 = function() {
                    return (il = a._emscripten_bind_btGImpactCompoundShape_childrenHasTransform_0 = a.asm.jj).apply(null, arguments)
                },
                jl = a._emscripten_bind_btGImpactCompoundShape_getPrimitiveManager_0 = function() {
                    return (jl = a._emscripten_bind_btGImpactCompoundShape_getPrimitiveManager_0 =
                        a.asm.kj).apply(null, arguments)
                },
                kl = a._emscripten_bind_btGImpactCompoundShape_getCompoundPrimitiveManager_0 = function() {
                    return (kl = a._emscripten_bind_btGImpactCompoundShape_getCompoundPrimitiveManager_0 = a.asm.lj).apply(null, arguments)
                },
                ll = a._emscripten_bind_btGImpactCompoundShape_getNumChildShapes_0 = function() {
                    return (ll = a._emscripten_bind_btGImpactCompoundShape_getNumChildShapes_0 = a.asm.mj).apply(null, arguments)
                },
                ml = a._emscripten_bind_btGImpactCompoundShape_addChildShape_2 = function() {
                    return (ml = a._emscripten_bind_btGImpactCompoundShape_addChildShape_2 =
                        a.asm.nj).apply(null, arguments)
                },
                nl = a._emscripten_bind_btGImpactCompoundShape_getChildShape_1 = function() {
                    return (nl = a._emscripten_bind_btGImpactCompoundShape_getChildShape_1 = a.asm.oj).apply(null, arguments)
                },
                ol = a._emscripten_bind_btGImpactCompoundShape_getChildAabb_4 = function() {
                    return (ol = a._emscripten_bind_btGImpactCompoundShape_getChildAabb_4 = a.asm.pj).apply(null, arguments)
                },
                pl = a._emscripten_bind_btGImpactCompoundShape_getChildTransform_1 = function() {
                    return (pl = a._emscripten_bind_btGImpactCompoundShape_getChildTransform_1 =
                        a.asm.qj).apply(null, arguments)
                },
                ql = a._emscripten_bind_btGImpactCompoundShape_setChildTransform_2 = function() {
                    return (ql = a._emscripten_bind_btGImpactCompoundShape_setChildTransform_2 = a.asm.rj).apply(null, arguments)
                },
                rl = a._emscripten_bind_btGImpactCompoundShape_calculateLocalInertia_2 = function() {
                    return (rl = a._emscripten_bind_btGImpactCompoundShape_calculateLocalInertia_2 = a.asm.sj).apply(null, arguments)
                },
                sl = a._emscripten_bind_btGImpactCompoundShape_getName_0 = function() {
                    return (sl = a._emscripten_bind_btGImpactCompoundShape_getName_0 =
                        a.asm.tj).apply(null, arguments)
                },
                tl = a._emscripten_bind_btGImpactCompoundShape_setLocalScaling_1 = function() {
                    return (tl = a._emscripten_bind_btGImpactCompoundShape_setLocalScaling_1 = a.asm.uj).apply(null, arguments)
                },
                ul = a._emscripten_bind_btGImpactCompoundShape_getLocalScaling_0 = function() {
                    return (ul = a._emscripten_bind_btGImpactCompoundShape_getLocalScaling_0 = a.asm.vj).apply(null, arguments)
                },
                vl = a._emscripten_bind_btGImpactCompoundShape_updateBound_0 = function() {
                    return (vl = a._emscripten_bind_btGImpactCompoundShape_updateBound_0 =
                        a.asm.wj).apply(null, arguments)
                },
                wl = a._emscripten_bind_btGImpactCompoundShape_postUpdate_0 = function() {
                    return (wl = a._emscripten_bind_btGImpactCompoundShape_postUpdate_0 = a.asm.xj).apply(null, arguments)
                },
                xl = a._emscripten_bind_btGImpactCompoundShape_getShapeType_0 = function() {
                    return (xl = a._emscripten_bind_btGImpactCompoundShape_getShapeType_0 = a.asm.yj).apply(null, arguments)
                },
                yl = a._emscripten_bind_btGImpactCompoundShape_needsRetrieveTriangles_0 = function() {
                    return (yl = a._emscripten_bind_btGImpactCompoundShape_needsRetrieveTriangles_0 =
                        a.asm.zj).apply(null, arguments)
                },
                zl = a._emscripten_bind_btGImpactCompoundShape_needsRetrieveTetrahedrons_0 = function() {
                    return (zl = a._emscripten_bind_btGImpactCompoundShape_needsRetrieveTetrahedrons_0 = a.asm.Aj).apply(null, arguments)
                },
                Al = a._emscripten_bind_btGImpactCompoundShape_getBulletTriangle_2 = function() {
                    return (Al = a._emscripten_bind_btGImpactCompoundShape_getBulletTriangle_2 = a.asm.Bj).apply(null, arguments)
                },
                Bl = a._emscripten_bind_btGImpactCompoundShape_getBulletTetrahedron_2 = function() {
                    return (Bl = a._emscripten_bind_btGImpactCompoundShape_getBulletTetrahedron_2 =
                        a.asm.Cj).apply(null, arguments)
                },
                Cl = a._emscripten_bind_btGImpactCompoundShape___destroy___0 = function() {
                    return (Cl = a._emscripten_bind_btGImpactCompoundShape___destroy___0 = a.asm.Dj).apply(null, arguments)
                },
                Dl = a._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_0 = function() {
                    return (Dl = a._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_0 = a.asm.Ej).apply(null, arguments)
                },
                El = a._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_1 = function() {
                    return (El = a._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_1 =
                        a.asm.Fj).apply(null, arguments)
                },
                Fl = a._emscripten_bind_TrimeshPrimitiveManager_lock_0 = function() {
                    return (Fl = a._emscripten_bind_TrimeshPrimitiveManager_lock_0 = a.asm.Gj).apply(null, arguments)
                },
                Gl = a._emscripten_bind_TrimeshPrimitiveManager_unlock_0 = function() {
                    return (Gl = a._emscripten_bind_TrimeshPrimitiveManager_unlock_0 = a.asm.Hj).apply(null, arguments)
                },
                Hl = a._emscripten_bind_TrimeshPrimitiveManager_is_trimesh_0 = function() {
                    return (Hl = a._emscripten_bind_TrimeshPrimitiveManager_is_trimesh_0 = a.asm.Ij).apply(null,
                        arguments)
                },
                Il = a._emscripten_bind_TrimeshPrimitiveManager_get_vertex_count_0 = function() {
                    return (Il = a._emscripten_bind_TrimeshPrimitiveManager_get_vertex_count_0 = a.asm.Jj).apply(null, arguments)
                },
                Jl = a._emscripten_bind_TrimeshPrimitiveManager_get_indices_4 = function() {
                    return (Jl = a._emscripten_bind_TrimeshPrimitiveManager_get_indices_4 = a.asm.Kj).apply(null, arguments)
                },
                Kl = a._emscripten_bind_TrimeshPrimitiveManager_get_vertex_2 = function() {
                    return (Kl = a._emscripten_bind_TrimeshPrimitiveManager_get_vertex_2 = a.asm.Lj).apply(null,
                        arguments)
                },
                Ll = a._emscripten_bind_TrimeshPrimitiveManager_get_bullet_triangle_2 = function() {
                    return (Ll = a._emscripten_bind_TrimeshPrimitiveManager_get_bullet_triangle_2 = a.asm.Mj).apply(null, arguments)
                },
                Ml = a._emscripten_bind_TrimeshPrimitiveManager_get_m_margin_0 = function() {
                    return (Ml = a._emscripten_bind_TrimeshPrimitiveManager_get_m_margin_0 = a.asm.Nj).apply(null, arguments)
                },
                Nl = a._emscripten_bind_TrimeshPrimitiveManager_set_m_margin_1 = function() {
                    return (Nl = a._emscripten_bind_TrimeshPrimitiveManager_set_m_margin_1 =
                        a.asm.Oj).apply(null, arguments)
                },
                Ol = a._emscripten_bind_TrimeshPrimitiveManager_get_m_meshInterface_0 = function() {
                    return (Ol = a._emscripten_bind_TrimeshPrimitiveManager_get_m_meshInterface_0 = a.asm.Pj).apply(null, arguments)
                },
                Pl = a._emscripten_bind_TrimeshPrimitiveManager_set_m_meshInterface_1 = function() {
                    return (Pl = a._emscripten_bind_TrimeshPrimitiveManager_set_m_meshInterface_1 = a.asm.Qj).apply(null, arguments)
                },
                Ql = a._emscripten_bind_TrimeshPrimitiveManager_get_m_part_0 = function() {
                    return (Ql = a._emscripten_bind_TrimeshPrimitiveManager_get_m_part_0 =
                        a.asm.Rj).apply(null, arguments)
                },
                Rl = a._emscripten_bind_TrimeshPrimitiveManager_set_m_part_1 = function() {
                    return (Rl = a._emscripten_bind_TrimeshPrimitiveManager_set_m_part_1 = a.asm.Sj).apply(null, arguments)
                },
                Sl = a._emscripten_bind_TrimeshPrimitiveManager_get_m_lock_count_0 = function() {
                    return (Sl = a._emscripten_bind_TrimeshPrimitiveManager_get_m_lock_count_0 = a.asm.Tj).apply(null, arguments)
                },
                Tl = a._emscripten_bind_TrimeshPrimitiveManager_set_m_lock_count_1 = function() {
                    return (Tl = a._emscripten_bind_TrimeshPrimitiveManager_set_m_lock_count_1 =
                        a.asm.Uj).apply(null, arguments)
                },
                Ul = a._emscripten_bind_TrimeshPrimitiveManager_get_numverts_0 = function() {
                    return (Ul = a._emscripten_bind_TrimeshPrimitiveManager_get_numverts_0 = a.asm.Vj).apply(null, arguments)
                },
                Vl = a._emscripten_bind_TrimeshPrimitiveManager_set_numverts_1 = function() {
                    return (Vl = a._emscripten_bind_TrimeshPrimitiveManager_set_numverts_1 = a.asm.Wj).apply(null, arguments)
                },
                Wl = a._emscripten_bind_TrimeshPrimitiveManager_get_type_0 = function() {
                    return (Wl = a._emscripten_bind_TrimeshPrimitiveManager_get_type_0 =
                        a.asm.Xj).apply(null, arguments)
                },
                Xl = a._emscripten_bind_TrimeshPrimitiveManager_set_type_1 = function() {
                    return (Xl = a._emscripten_bind_TrimeshPrimitiveManager_set_type_1 = a.asm.Yj).apply(null, arguments)
                },
                Yl = a._emscripten_bind_TrimeshPrimitiveManager_get_stride_0 = function() {
                    return (Yl = a._emscripten_bind_TrimeshPrimitiveManager_get_stride_0 = a.asm.Zj).apply(null, arguments)
                },
                Zl = a._emscripten_bind_TrimeshPrimitiveManager_set_stride_1 = function() {
                    return (Zl = a._emscripten_bind_TrimeshPrimitiveManager_set_stride_1 =
                        a.asm._j).apply(null, arguments)
                },
                $l = a._emscripten_bind_TrimeshPrimitiveManager_get_indexstride_0 = function() {
                    return ($l = a._emscripten_bind_TrimeshPrimitiveManager_get_indexstride_0 = a.asm.$j).apply(null, arguments)
                },
                am = a._emscripten_bind_TrimeshPrimitiveManager_set_indexstride_1 = function() {
                    return (am = a._emscripten_bind_TrimeshPrimitiveManager_set_indexstride_1 = a.asm.ak).apply(null, arguments)
                },
                bm = a._emscripten_bind_TrimeshPrimitiveManager_get_numfaces_0 = function() {
                    return (bm = a._emscripten_bind_TrimeshPrimitiveManager_get_numfaces_0 =
                        a.asm.bk).apply(null, arguments)
                },
                cm = a._emscripten_bind_TrimeshPrimitiveManager_set_numfaces_1 = function() {
                    return (cm = a._emscripten_bind_TrimeshPrimitiveManager_set_numfaces_1 = a.asm.ck).apply(null, arguments)
                },
                dm = a._emscripten_bind_TrimeshPrimitiveManager_get_indicestype_0 = function() {
                    return (dm = a._emscripten_bind_TrimeshPrimitiveManager_get_indicestype_0 = a.asm.dk).apply(null, arguments)
                },
                em = a._emscripten_bind_TrimeshPrimitiveManager_set_indicestype_1 = function() {
                    return (em = a._emscripten_bind_TrimeshPrimitiveManager_set_indicestype_1 =
                        a.asm.ek).apply(null, arguments)
                },
                fm = a._emscripten_bind_TrimeshPrimitiveManager___destroy___0 = function() {
                    return (fm = a._emscripten_bind_TrimeshPrimitiveManager___destroy___0 = a.asm.fk).apply(null, arguments)
                },
                gm = a._emscripten_bind_btGImpactMeshShapePart_btGImpactMeshShapePart_2 = function() {
                    return (gm = a._emscripten_bind_btGImpactMeshShapePart_btGImpactMeshShapePart_2 = a.asm.gk).apply(null, arguments)
                },
                hm = a._emscripten_bind_btGImpactMeshShapePart_getTrimeshPrimitiveManager_0 = function() {
                    return (hm = a._emscripten_bind_btGImpactMeshShapePart_getTrimeshPrimitiveManager_0 =
                        a.asm.hk).apply(null, arguments)
                },
                im = a._emscripten_bind_btGImpactMeshShapePart_getVertexCount_0 = function() {
                    return (im = a._emscripten_bind_btGImpactMeshShapePart_getVertexCount_0 = a.asm.ik).apply(null, arguments)
                },
                jm = a._emscripten_bind_btGImpactMeshShapePart_getVertex_2 = function() {
                    return (jm = a._emscripten_bind_btGImpactMeshShapePart_getVertex_2 = a.asm.jk).apply(null, arguments)
                },
                km = a._emscripten_bind_btGImpactMeshShapePart_getPart_0 = function() {
                    return (km = a._emscripten_bind_btGImpactMeshShapePart_getPart_0 =
                        a.asm.kk).apply(null, arguments)
                },
                lm = a._emscripten_bind_btGImpactMeshShapePart_setLocalScaling_1 = function() {
                    return (lm = a._emscripten_bind_btGImpactMeshShapePart_setLocalScaling_1 = a.asm.lk).apply(null, arguments)
                },
                mm = a._emscripten_bind_btGImpactMeshShapePart_getLocalScaling_0 = function() {
                    return (mm = a._emscripten_bind_btGImpactMeshShapePart_getLocalScaling_0 = a.asm.mk).apply(null, arguments)
                },
                nm = a._emscripten_bind_btGImpactMeshShapePart_updateBound_0 = function() {
                    return (nm = a._emscripten_bind_btGImpactMeshShapePart_updateBound_0 =
                        a.asm.nk).apply(null, arguments)
                },
                om = a._emscripten_bind_btGImpactMeshShapePart_postUpdate_0 = function() {
                    return (om = a._emscripten_bind_btGImpactMeshShapePart_postUpdate_0 = a.asm.ok).apply(null, arguments)
                },
                pm = a._emscripten_bind_btGImpactMeshShapePart_getShapeType_0 = function() {
                    return (pm = a._emscripten_bind_btGImpactMeshShapePart_getShapeType_0 = a.asm.pk).apply(null, arguments)
                },
                qm = a._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTriangles_0 = function() {
                    return (qm = a._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTriangles_0 =
                        a.asm.qk).apply(null, arguments)
                },
                rm = a._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTetrahedrons_0 = function() {
                    return (rm = a._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTetrahedrons_0 = a.asm.rk).apply(null, arguments)
                },
                sm = a._emscripten_bind_btGImpactMeshShapePart_getBulletTriangle_2 = function() {
                    return (sm = a._emscripten_bind_btGImpactMeshShapePart_getBulletTriangle_2 = a.asm.sk).apply(null, arguments)
                },
                tm = a._emscripten_bind_btGImpactMeshShapePart_getBulletTetrahedron_2 = function() {
                    return (tm = a._emscripten_bind_btGImpactMeshShapePart_getBulletTetrahedron_2 =
                        a.asm.tk).apply(null, arguments)
                },
                um = a._emscripten_bind_btGImpactMeshShapePart___destroy___0 = function() {
                    return (um = a._emscripten_bind_btGImpactMeshShapePart___destroy___0 = a.asm.uk).apply(null, arguments)
                },
                wm = a._emscripten_bind_btGImpactMeshShape_btGImpactMeshShape_1 = function() {
                    return (wm = a._emscripten_bind_btGImpactMeshShape_btGImpactMeshShape_1 = a.asm.vk).apply(null, arguments)
                },
                xm = a._emscripten_bind_btGImpactMeshShape_getMeshInterface_0 = function() {
                    return (xm = a._emscripten_bind_btGImpactMeshShape_getMeshInterface_0 =
                        a.asm.wk).apply(null, arguments)
                },
                ym = a._emscripten_bind_btGImpactMeshShape_getMeshPartCount_0 = function() {
                    return (ym = a._emscripten_bind_btGImpactMeshShape_getMeshPartCount_0 = a.asm.xk).apply(null, arguments)
                },
                zm = a._emscripten_bind_btGImpactMeshShape_getMeshPart_1 = function() {
                    return (zm = a._emscripten_bind_btGImpactMeshShape_getMeshPart_1 = a.asm.yk).apply(null, arguments)
                },
                Am = a._emscripten_bind_btGImpactMeshShape_calculateSerializeBufferSize_0 = function() {
                    return (Am = a._emscripten_bind_btGImpactMeshShape_calculateSerializeBufferSize_0 =
                        a.asm.zk).apply(null, arguments)
                },
                Bm = a._emscripten_bind_btGImpactMeshShape_setLocalScaling_1 = function() {
                    return (Bm = a._emscripten_bind_btGImpactMeshShape_setLocalScaling_1 = a.asm.Ak).apply(null, arguments)
                },
                Cm = a._emscripten_bind_btGImpactMeshShape_getLocalScaling_0 = function() {
                    return (Cm = a._emscripten_bind_btGImpactMeshShape_getLocalScaling_0 = a.asm.Bk).apply(null, arguments)
                },
                Dm = a._emscripten_bind_btGImpactMeshShape_updateBound_0 = function() {
                    return (Dm = a._emscripten_bind_btGImpactMeshShape_updateBound_0 = a.asm.Ck).apply(null,
                        arguments)
                },
                Em = a._emscripten_bind_btGImpactMeshShape_postUpdate_0 = function() {
                    return (Em = a._emscripten_bind_btGImpactMeshShape_postUpdate_0 = a.asm.Dk).apply(null, arguments)
                },
                Fm = a._emscripten_bind_btGImpactMeshShape_getShapeType_0 = function() {
                    return (Fm = a._emscripten_bind_btGImpactMeshShape_getShapeType_0 = a.asm.Ek).apply(null, arguments)
                },
                Gm = a._emscripten_bind_btGImpactMeshShape_needsRetrieveTriangles_0 = function() {
                    return (Gm = a._emscripten_bind_btGImpactMeshShape_needsRetrieveTriangles_0 = a.asm.Fk).apply(null,
                        arguments)
                },
                Hm = a._emscripten_bind_btGImpactMeshShape_needsRetrieveTetrahedrons_0 = function() {
                    return (Hm = a._emscripten_bind_btGImpactMeshShape_needsRetrieveTetrahedrons_0 = a.asm.Gk).apply(null, arguments)
                },
                Im = a._emscripten_bind_btGImpactMeshShape_getBulletTriangle_2 = function() {
                    return (Im = a._emscripten_bind_btGImpactMeshShape_getBulletTriangle_2 = a.asm.Hk).apply(null, arguments)
                },
                Jm = a._emscripten_bind_btGImpactMeshShape_getBulletTetrahedron_2 = function() {
                    return (Jm = a._emscripten_bind_btGImpactMeshShape_getBulletTetrahedron_2 =
                        a.asm.Ik).apply(null, arguments)
                },
                Km = a._emscripten_bind_btGImpactMeshShape___destroy___0 = function() {
                    return (Km = a._emscripten_bind_btGImpactMeshShape___destroy___0 = a.asm.Jk).apply(null, arguments)
                },
                Lm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_0 = function() {
                    return (Lm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_0 = a.asm.Kk).apply(null, arguments)
                },
                Mm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_2 =
                function() {
                    return (Mm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_2 = a.asm.Lk).apply(null, arguments)
                },
                Nm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_dispatcher1_0 = function() {
                    return (Nm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_dispatcher1_0 = a.asm.Mk).apply(null, arguments)
                },
                Om = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_dispatcher1_1 = function() {
                    return (Om = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_dispatcher1_1 =
                        a.asm.Nk).apply(null, arguments)
                },
                Pm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_manifold_0 = function() {
                    return (Pm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_manifold_0 = a.asm.Ok).apply(null, arguments)
                },
                Qm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_manifold_1 = function() {
                    return (Qm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_manifold_1 = a.asm.Pk).apply(null, arguments)
                },
                Rm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo___destroy___0 =
                function() {
                    return (Rm = a._emscripten_bind_btCollisionAlgorithmConstructionInfo___destroy___0 = a.asm.Qk).apply(null, arguments)
                },
                Sm = a._emscripten_bind_btGImpactCollisionAlgorithm_btGImpactCollisionAlgorithm_3 = function() {
                    return (Sm = a._emscripten_bind_btGImpactCollisionAlgorithm_btGImpactCollisionAlgorithm_3 = a.asm.Rk).apply(null, arguments)
                },
                Tm = a._emscripten_bind_btGImpactCollisionAlgorithm_registerAlgorithm_1 = function() {
                    return (Tm = a._emscripten_bind_btGImpactCollisionAlgorithm_registerAlgorithm_1 = a.asm.Sk).apply(null,
                        arguments)
                },
                Um = a._emscripten_bind_btGImpactCollisionAlgorithm___destroy___0 = function() {
                    return (Um = a._emscripten_bind_btGImpactCollisionAlgorithm___destroy___0 = a.asm.Tk).apply(null, arguments)
                },
                Vm = a._emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0 = function() {
                    return (Vm = a._emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0 = a.asm.Uk).apply(null, arguments)
                },
                Wm = a._emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0 =
                function() {
                    return (Wm = a._emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0 = a.asm.Vk).apply(null, arguments)
                },
                Xm = a._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0 = function() {
                    return (Xm = a._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0 = a.asm.Wk).apply(null, arguments)
                },
                Ym = a._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1 = function() {
                    return (Ym = a._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1 =
                        a.asm.Xk).apply(null, arguments)
                },
                Zm = a._emscripten_bind_btDefaultCollisionConfiguration___destroy___0 = function() {
                    return (Zm = a._emscripten_bind_btDefaultCollisionConfiguration___destroy___0 = a.asm.Yk).apply(null, arguments)
                },
                $m = a._emscripten_bind_btPersistentManifold_btPersistentManifold_0 = function() {
                    return ($m = a._emscripten_bind_btPersistentManifold_btPersistentManifold_0 = a.asm.Zk).apply(null, arguments)
                },
                an = a._emscripten_bind_btPersistentManifold_getBody0_0 = function() {
                    return (an = a._emscripten_bind_btPersistentManifold_getBody0_0 =
                        a.asm._k).apply(null, arguments)
                },
                bn = a._emscripten_bind_btPersistentManifold_getBody1_0 = function() {
                    return (bn = a._emscripten_bind_btPersistentManifold_getBody1_0 = a.asm.$k).apply(null, arguments)
                },
                cn = a._emscripten_bind_btPersistentManifold_getNumContacts_0 = function() {
                    return (cn = a._emscripten_bind_btPersistentManifold_getNumContacts_0 = a.asm.al).apply(null, arguments)
                },
                dn = a._emscripten_bind_btPersistentManifold_getContactPoint_1 = function() {
                    return (dn = a._emscripten_bind_btPersistentManifold_getContactPoint_1 =
                        a.asm.bl).apply(null, arguments)
                },
                en = a._emscripten_bind_btPersistentManifold___destroy___0 = function() {
                    return (en = a._emscripten_bind_btPersistentManifold___destroy___0 = a.asm.cl).apply(null, arguments)
                },
                fn = a._emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1 = function() {
                    return (fn = a._emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1 = a.asm.dl).apply(null, arguments)
                },
                gn = a._emscripten_bind_btCollisionDispatcher_getNumManifolds_0 = function() {
                    return (gn = a._emscripten_bind_btCollisionDispatcher_getNumManifolds_0 =
                        a.asm.el).apply(null, arguments)
                },
                hn = a._emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1 = function() {
                    return (hn = a._emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1 = a.asm.fl).apply(null, arguments)
                },
                jn = a._emscripten_bind_btCollisionDispatcher___destroy___0 = function() {
                    return (jn = a._emscripten_bind_btCollisionDispatcher___destroy___0 = a.asm.gl).apply(null, arguments)
                },
                kn = a._emscripten_bind_btOverlappingPairCallback___destroy___0 = function() {
                    return (kn = a._emscripten_bind_btOverlappingPairCallback___destroy___0 =
                        a.asm.hl).apply(null, arguments)
                },
                ln = a._emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1 = function() {
                    return (ln = a._emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1 = a.asm.il).apply(null, arguments)
                },
                mn = a._emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0 = function() {
                    return (mn = a._emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0 = a.asm.jl).apply(null, arguments)
                },
                nn = a._emscripten_bind_btOverlappingPairCache___destroy___0 = function() {
                    return (nn =
                        a._emscripten_bind_btOverlappingPairCache___destroy___0 = a.asm.kl).apply(null, arguments)
                },
                on = a._emscripten_bind_btAxisSweep3_btAxisSweep3_2 = function() {
                    return (on = a._emscripten_bind_btAxisSweep3_btAxisSweep3_2 = a.asm.ll).apply(null, arguments)
                },
                pn = a._emscripten_bind_btAxisSweep3_btAxisSweep3_3 = function() {
                    return (pn = a._emscripten_bind_btAxisSweep3_btAxisSweep3_3 = a.asm.ml).apply(null, arguments)
                },
                qn = a._emscripten_bind_btAxisSweep3_btAxisSweep3_4 = function() {
                    return (qn = a._emscripten_bind_btAxisSweep3_btAxisSweep3_4 =
                        a.asm.nl).apply(null, arguments)
                },
                rn = a._emscripten_bind_btAxisSweep3_btAxisSweep3_5 = function() {
                    return (rn = a._emscripten_bind_btAxisSweep3_btAxisSweep3_5 = a.asm.ol).apply(null, arguments)
                },
                sn = a._emscripten_bind_btAxisSweep3___destroy___0 = function() {
                    return (sn = a._emscripten_bind_btAxisSweep3___destroy___0 = a.asm.pl).apply(null, arguments)
                },
                tn = a._emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0 = function() {
                    return (tn = a._emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0 = a.asm.ql).apply(null,
                        arguments)
                },
                un = a._emscripten_bind_btBroadphaseInterface___destroy___0 = function() {
                    return (un = a._emscripten_bind_btBroadphaseInterface___destroy___0 = a.asm.rl).apply(null, arguments)
                },
                vn = a._emscripten_bind_btCollisionConfiguration___destroy___0 = function() {
                    return (vn = a._emscripten_bind_btCollisionConfiguration___destroy___0 = a.asm.sl).apply(null, arguments)
                },
                wn = a._emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0 = function() {
                    return (wn = a._emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0 = a.asm.tl).apply(null,
                        arguments)
                },
                xn = a._emscripten_bind_btDbvtBroadphase___destroy___0 = function() {
                    return (xn = a._emscripten_bind_btDbvtBroadphase___destroy___0 = a.asm.ul).apply(null, arguments)
                },
                yn = a._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0 = function() {
                    return (yn = a._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0 = a.asm.vl).apply(null, arguments)
                },
                zn = a._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1 = function() {
                    return (zn = a._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1 =
                        a.asm.wl).apply(null, arguments)
                },
                An = a._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0 = function() {
                    return (An = a._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0 = a.asm.xl).apply(null, arguments)
                },
                Bn = a._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1 = function() {
                    return (Bn = a._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1 = a.asm.yl).apply(null, arguments)
                },
                Cn = a._emscripten_bind_btBroadphaseProxy___destroy___0 = function() {
                    return (Cn = a._emscripten_bind_btBroadphaseProxy___destroy___0 =
                        a.asm.zl).apply(null, arguments)
                },
                Dn = a._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3 = function() {
                    return (Dn = a._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3 = a.asm.Al).apply(null, arguments)
                },
                En = a._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4 = function() {
                    return (En = a._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4 = a.asm.Bl).apply(null, arguments)
                },
                Fn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0 =
                function() {
                    return (Fn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0 = a.asm.Cl).apply(null, arguments)
                },
                Gn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1 = function() {
                    return (Gn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1 = a.asm.Dl).apply(null, arguments)
                },
                Hn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0 = function() {
                    return (Hn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0 = a.asm.El).apply(null,
                        arguments)
                },
                In = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1 = function() {
                    return (In = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1 = a.asm.Fl).apply(null, arguments)
                },
                Jn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0 = function() {
                    return (Jn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0 = a.asm.Gl).apply(null, arguments)
                },
                Kn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1 = function() {
                    return (Kn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1 =
                        a.asm.Hl).apply(null, arguments)
                },
                Ln = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0 = function() {
                    return (Ln = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0 = a.asm.Il).apply(null, arguments)
                },
                Mn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1 = function() {
                    return (Mn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1 = a.asm.Jl).apply(null, arguments)
                },
                Nn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0 =
                function() {
                    return (Nn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0 = a.asm.Kl).apply(null, arguments)
                },
                On = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1 = function() {
                    return (On = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1 = a.asm.Ll).apply(null, arguments)
                },
                Pn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0 = function() {
                    return (Pn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0 = a.asm.Ml).apply(null,
                        arguments)
                },
                Qn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1 = function() {
                    return (Qn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1 = a.asm.Nl).apply(null, arguments)
                },
                Rn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0 = function() {
                    return (Rn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0 = a.asm.Ol).apply(null, arguments)
                },
                Sn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1 =
                function() {
                    return (Sn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1 = a.asm.Pl).apply(null, arguments)
                },
                Tn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0 = function() {
                    return (Tn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0 = a.asm.Ql).apply(null, arguments)
                },
                Un = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1 = function() {
                    return (Un = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1 =
                        a.asm.Rl).apply(null, arguments)
                },
                Vn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0 = function() {
                    return (Vn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0 = a.asm.Sl).apply(null, arguments)
                },
                Wn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1 = function() {
                    return (Wn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1 = a.asm.Tl).apply(null, arguments)
                },
                Xn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0 =
                function() {
                    return (Xn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0 = a.asm.Ul).apply(null, arguments)
                },
                Yn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1 = function() {
                    return (Yn = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1 = a.asm.Vl).apply(null, arguments)
                },
                Zn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0 = function() {
                    return (Zn = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0 =
                        a.asm.Wl).apply(null, arguments)
                },
                $n = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1 = function() {
                    return ($n = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1 = a.asm.Xl).apply(null, arguments)
                },
                ao = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0 = function() {
                    return (ao = a._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0 = a.asm.Yl).apply(null, arguments)
                },
                bo = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1 = function() {
                    return (bo = a._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1 = a.asm.Zl).apply(null, arguments)
                },
                co = a._emscripten_bind_btRigidBodyConstructionInfo___destroy___0 = function() {
                    return (co = a._emscripten_bind_btRigidBodyConstructionInfo___destroy___0 = a.asm._l).apply(null, arguments)
                },
                eo = a._emscripten_bind_btRigidBody_btRigidBody_1 = function() {
                    return (eo = a._emscripten_bind_btRigidBody_btRigidBody_1 =
                        a.asm.$l).apply(null, arguments)
                },
                fo = a._emscripten_bind_btRigidBody_getCenterOfMassTransform_0 = function() {
                    return (fo = a._emscripten_bind_btRigidBody_getCenterOfMassTransform_0 = a.asm.am).apply(null, arguments)
                },
                go = a._emscripten_bind_btRigidBody_setCenterOfMassTransform_1 = function() {
                    return (go = a._emscripten_bind_btRigidBody_setCenterOfMassTransform_1 = a.asm.bm).apply(null, arguments)
                },
                ho = a._emscripten_bind_btRigidBody_setSleepingThresholds_2 = function() {
                    return (ho = a._emscripten_bind_btRigidBody_setSleepingThresholds_2 =
                        a.asm.cm).apply(null, arguments)
                },
                io = a._emscripten_bind_btRigidBody_getLinearDamping_0 = function() {
                    return (io = a._emscripten_bind_btRigidBody_getLinearDamping_0 = a.asm.dm).apply(null, arguments)
                },
                jo = a._emscripten_bind_btRigidBody_getAngularDamping_0 = function() {
                    return (jo = a._emscripten_bind_btRigidBody_getAngularDamping_0 = a.asm.em).apply(null, arguments)
                },
                ko = a._emscripten_bind_btRigidBody_setDamping_2 = function() {
                    return (ko = a._emscripten_bind_btRigidBody_setDamping_2 = a.asm.fm).apply(null, arguments)
                },
                lo = a._emscripten_bind_btRigidBody_setMassProps_2 =
                function() {
                    return (lo = a._emscripten_bind_btRigidBody_setMassProps_2 = a.asm.gm).apply(null, arguments)
                },
                mo = a._emscripten_bind_btRigidBody_getLinearFactor_0 = function() {
                    return (mo = a._emscripten_bind_btRigidBody_getLinearFactor_0 = a.asm.hm).apply(null, arguments)
                },
                no = a._emscripten_bind_btRigidBody_setLinearFactor_1 = function() {
                    return (no = a._emscripten_bind_btRigidBody_setLinearFactor_1 = a.asm.im).apply(null, arguments)
                },
                oo = a._emscripten_bind_btRigidBody_applyTorque_1 = function() {
                    return (oo = a._emscripten_bind_btRigidBody_applyTorque_1 =
                        a.asm.jm).apply(null, arguments)
                },
                po = a._emscripten_bind_btRigidBody_applyLocalTorque_1 = function() {
                    return (po = a._emscripten_bind_btRigidBody_applyLocalTorque_1 = a.asm.km).apply(null, arguments)
                },
                qo = a._emscripten_bind_btRigidBody_applyForce_2 = function() {
                    return (qo = a._emscripten_bind_btRigidBody_applyForce_2 = a.asm.lm).apply(null, arguments)
                },
                ro = a._emscripten_bind_btRigidBody_applyCentralForce_1 = function() {
                    return (ro = a._emscripten_bind_btRigidBody_applyCentralForce_1 = a.asm.mm).apply(null, arguments)
                },
                so = a._emscripten_bind_btRigidBody_applyCentralLocalForce_1 =
                function() {
                    return (so = a._emscripten_bind_btRigidBody_applyCentralLocalForce_1 = a.asm.nm).apply(null, arguments)
                },
                to = a._emscripten_bind_btRigidBody_applyTorqueImpulse_1 = function() {
                    return (to = a._emscripten_bind_btRigidBody_applyTorqueImpulse_1 = a.asm.om).apply(null, arguments)
                },
                uo = a._emscripten_bind_btRigidBody_applyImpulse_2 = function() {
                    return (uo = a._emscripten_bind_btRigidBody_applyImpulse_2 = a.asm.pm).apply(null, arguments)
                },
                vo = a._emscripten_bind_btRigidBody_applyCentralImpulse_1 = function() {
                    return (vo = a._emscripten_bind_btRigidBody_applyCentralImpulse_1 =
                        a.asm.qm).apply(null, arguments)
                },
                wo = a._emscripten_bind_btRigidBody_updateInertiaTensor_0 = function() {
                    return (wo = a._emscripten_bind_btRigidBody_updateInertiaTensor_0 = a.asm.rm).apply(null, arguments)
                },
                xo = a._emscripten_bind_btRigidBody_getLinearVelocity_0 = function() {
                    return (xo = a._emscripten_bind_btRigidBody_getLinearVelocity_0 = a.asm.sm).apply(null, arguments)
                },
                yo = a._emscripten_bind_btRigidBody_getAngularVelocity_0 = function() {
                    return (yo = a._emscripten_bind_btRigidBody_getAngularVelocity_0 = a.asm.tm).apply(null,
                        arguments)
                },
                zo = a._emscripten_bind_btRigidBody_setLinearVelocity_1 = function() {
                    return (zo = a._emscripten_bind_btRigidBody_setLinearVelocity_1 = a.asm.um).apply(null, arguments)
                },
                Ao = a._emscripten_bind_btRigidBody_setAngularVelocity_1 = function() {
                    return (Ao = a._emscripten_bind_btRigidBody_setAngularVelocity_1 = a.asm.vm).apply(null, arguments)
                },
                Bo = a._emscripten_bind_btRigidBody_getMotionState_0 = function() {
                    return (Bo = a._emscripten_bind_btRigidBody_getMotionState_0 = a.asm.wm).apply(null, arguments)
                },
                Co = a._emscripten_bind_btRigidBody_setMotionState_1 =
                function() {
                    return (Co = a._emscripten_bind_btRigidBody_setMotionState_1 = a.asm.xm).apply(null, arguments)
                },
                Do = a._emscripten_bind_btRigidBody_getAngularFactor_0 = function() {
                    return (Do = a._emscripten_bind_btRigidBody_getAngularFactor_0 = a.asm.ym).apply(null, arguments)
                },
                Eo = a._emscripten_bind_btRigidBody_setAngularFactor_1 = function() {
                    return (Eo = a._emscripten_bind_btRigidBody_setAngularFactor_1 = a.asm.zm).apply(null, arguments)
                },
                Fo = a._emscripten_bind_btRigidBody_upcast_1 = function() {
                    return (Fo = a._emscripten_bind_btRigidBody_upcast_1 =
                        a.asm.Am).apply(null, arguments)
                },
                Go = a._emscripten_bind_btRigidBody_getAabb_2 = function() {
                    return (Go = a._emscripten_bind_btRigidBody_getAabb_2 = a.asm.Bm).apply(null, arguments)
                },
                Ho = a._emscripten_bind_btRigidBody_applyGravity_0 = function() {
                    return (Ho = a._emscripten_bind_btRigidBody_applyGravity_0 = a.asm.Cm).apply(null, arguments)
                },
                Io = a._emscripten_bind_btRigidBody_getGravity_0 = function() {
                    return (Io = a._emscripten_bind_btRigidBody_getGravity_0 = a.asm.Dm).apply(null, arguments)
                },
                Jo = a._emscripten_bind_btRigidBody_setGravity_1 =
                function() {
                    return (Jo = a._emscripten_bind_btRigidBody_setGravity_1 = a.asm.Em).apply(null, arguments)
                },
                Ko = a._emscripten_bind_btRigidBody_getBroadphaseProxy_0 = function() {
                    return (Ko = a._emscripten_bind_btRigidBody_getBroadphaseProxy_0 = a.asm.Fm).apply(null, arguments)
                },
                Lo = a._emscripten_bind_btRigidBody_clearForces_0 = function() {
                    return (Lo = a._emscripten_bind_btRigidBody_clearForces_0 = a.asm.Gm).apply(null, arguments)
                },
                Mo = a._emscripten_bind_btRigidBody_setFlags_1 = function() {
                    return (Mo = a._emscripten_bind_btRigidBody_setFlags_1 =
                        a.asm.Hm).apply(null, arguments)
                },
                No = a._emscripten_bind_btRigidBody_getFlags_0 = function() {
                    return (No = a._emscripten_bind_btRigidBody_getFlags_0 = a.asm.Im).apply(null, arguments)
                },
                Oo = a._emscripten_bind_btRigidBody_setAnisotropicFriction_2 = function() {
                    return (Oo = a._emscripten_bind_btRigidBody_setAnisotropicFriction_2 = a.asm.Jm).apply(null, arguments)
                },
                Po = a._emscripten_bind_btRigidBody_getCollisionShape_0 = function() {
                    return (Po = a._emscripten_bind_btRigidBody_getCollisionShape_0 = a.asm.Km).apply(null, arguments)
                },
                Qo = a._emscripten_bind_btRigidBody_setContactProcessingThreshold_1 = function() {
                    return (Qo = a._emscripten_bind_btRigidBody_setContactProcessingThreshold_1 = a.asm.Lm).apply(null, arguments)
                },
                Ro = a._emscripten_bind_btRigidBody_setActivationState_1 = function() {
                    return (Ro = a._emscripten_bind_btRigidBody_setActivationState_1 = a.asm.Mm).apply(null, arguments)
                },
                So = a._emscripten_bind_btRigidBody_forceActivationState_1 = function() {
                    return (So = a._emscripten_bind_btRigidBody_forceActivationState_1 = a.asm.Nm).apply(null, arguments)
                },
                To = a._emscripten_bind_btRigidBody_activate_0 = function() {
                    return (To = a._emscripten_bind_btRigidBody_activate_0 = a.asm.Om).apply(null, arguments)
                },
                Uo = a._emscripten_bind_btRigidBody_activate_1 = function() {
                    return (Uo = a._emscripten_bind_btRigidBody_activate_1 = a.asm.Pm).apply(null, arguments)
                },
                Vo = a._emscripten_bind_btRigidBody_isActive_0 = function() {
                    return (Vo = a._emscripten_bind_btRigidBody_isActive_0 = a.asm.Qm).apply(null, arguments)
                },
                Wo = a._emscripten_bind_btRigidBody_isKinematicObject_0 = function() {
                    return (Wo = a._emscripten_bind_btRigidBody_isKinematicObject_0 =
                        a.asm.Rm).apply(null, arguments)
                },
                Xo = a._emscripten_bind_btRigidBody_isStaticObject_0 = function() {
                    return (Xo = a._emscripten_bind_btRigidBody_isStaticObject_0 = a.asm.Sm).apply(null, arguments)
                },
                Yo = a._emscripten_bind_btRigidBody_isStaticOrKinematicObject_0 = function() {
                    return (Yo = a._emscripten_bind_btRigidBody_isStaticOrKinematicObject_0 = a.asm.Tm).apply(null, arguments)
                },
                Zo = a._emscripten_bind_btRigidBody_getRestitution_0 = function() {
                    return (Zo = a._emscripten_bind_btRigidBody_getRestitution_0 = a.asm.Um).apply(null,
                        arguments)
                },
                $o = a._emscripten_bind_btRigidBody_getFriction_0 = function() {
                    return ($o = a._emscripten_bind_btRigidBody_getFriction_0 = a.asm.Vm).apply(null, arguments)
                },
                ap = a._emscripten_bind_btRigidBody_getRollingFriction_0 = function() {
                    return (ap = a._emscripten_bind_btRigidBody_getRollingFriction_0 = a.asm.Wm).apply(null, arguments)
                },
                bp = a._emscripten_bind_btRigidBody_setRestitution_1 = function() {
                    return (bp = a._emscripten_bind_btRigidBody_setRestitution_1 = a.asm.Xm).apply(null, arguments)
                },
                cp = a._emscripten_bind_btRigidBody_setFriction_1 =
                function() {
                    return (cp = a._emscripten_bind_btRigidBody_setFriction_1 = a.asm.Ym).apply(null, arguments)
                },
                dp = a._emscripten_bind_btRigidBody_setRollingFriction_1 = function() {
                    return (dp = a._emscripten_bind_btRigidBody_setRollingFriction_1 = a.asm.Zm).apply(null, arguments)
                },
                ep = a._emscripten_bind_btRigidBody_getWorldTransform_0 = function() {
                    return (ep = a._emscripten_bind_btRigidBody_getWorldTransform_0 = a.asm._m).apply(null, arguments)
                },
                fp = a._emscripten_bind_btRigidBody_getCollisionFlags_0 = function() {
                    return (fp = a._emscripten_bind_btRigidBody_getCollisionFlags_0 =
                        a.asm.$m).apply(null, arguments)
                },
                gp = a._emscripten_bind_btRigidBody_setCollisionFlags_1 = function() {
                    return (gp = a._emscripten_bind_btRigidBody_setCollisionFlags_1 = a.asm.an).apply(null, arguments)
                },
                hp = a._emscripten_bind_btRigidBody_setWorldTransform_1 = function() {
                    return (hp = a._emscripten_bind_btRigidBody_setWorldTransform_1 = a.asm.bn).apply(null, arguments)
                },
                ip = a._emscripten_bind_btRigidBody_setCollisionShape_1 = function() {
                    return (ip = a._emscripten_bind_btRigidBody_setCollisionShape_1 = a.asm.cn).apply(null, arguments)
                },
                jp = a._emscripten_bind_btRigidBody_setCcdMotionThreshold_1 = function() {
                    return (jp = a._emscripten_bind_btRigidBody_setCcdMotionThreshold_1 = a.asm.dn).apply(null, arguments)
                },
                kp = a._emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1 = function() {
                    return (kp = a._emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1 = a.asm.en).apply(null, arguments)
                },
                lp = a._emscripten_bind_btRigidBody_getUserIndex_0 = function() {
                    return (lp = a._emscripten_bind_btRigidBody_getUserIndex_0 = a.asm.fn).apply(null, arguments)
                },
                mp = a._emscripten_bind_btRigidBody_setUserIndex_1 =
                function() {
                    return (mp = a._emscripten_bind_btRigidBody_setUserIndex_1 = a.asm.gn).apply(null, arguments)
                },
                np = a._emscripten_bind_btRigidBody_getUserPointer_0 = function() {
                    return (np = a._emscripten_bind_btRigidBody_getUserPointer_0 = a.asm.hn).apply(null, arguments)
                },
                op = a._emscripten_bind_btRigidBody_setUserPointer_1 = function() {
                    return (op = a._emscripten_bind_btRigidBody_setUserPointer_1 = a.asm.jn).apply(null, arguments)
                },
                pp = a._emscripten_bind_btRigidBody_getBroadphaseHandle_0 = function() {
                    return (pp = a._emscripten_bind_btRigidBody_getBroadphaseHandle_0 =
                        a.asm.kn).apply(null, arguments)
                },
                qp = a._emscripten_bind_btRigidBody___destroy___0 = function() {
                    return (qp = a._emscripten_bind_btRigidBody___destroy___0 = a.asm.ln).apply(null, arguments)
                },
                rp = a._emscripten_bind_btConstraintSetting_btConstraintSetting_0 = function() {
                    return (rp = a._emscripten_bind_btConstraintSetting_btConstraintSetting_0 = a.asm.mn).apply(null, arguments)
                },
                sp = a._emscripten_bind_btConstraintSetting_get_m_tau_0 = function() {
                    return (sp = a._emscripten_bind_btConstraintSetting_get_m_tau_0 = a.asm.nn).apply(null,
                        arguments)
                },
                tp = a._emscripten_bind_btConstraintSetting_set_m_tau_1 = function() {
                    return (tp = a._emscripten_bind_btConstraintSetting_set_m_tau_1 = a.asm.on).apply(null, arguments)
                },
                up = a._emscripten_bind_btConstraintSetting_get_m_damping_0 = function() {
                    return (up = a._emscripten_bind_btConstraintSetting_get_m_damping_0 = a.asm.pn).apply(null, arguments)
                },
                vp = a._emscripten_bind_btConstraintSetting_set_m_damping_1 = function() {
                    return (vp = a._emscripten_bind_btConstraintSetting_set_m_damping_1 = a.asm.qn).apply(null, arguments)
                },
                wp = a._emscripten_bind_btConstraintSetting_get_m_impulseClamp_0 = function() {
                    return (wp = a._emscripten_bind_btConstraintSetting_get_m_impulseClamp_0 = a.asm.rn).apply(null, arguments)
                },
                xp = a._emscripten_bind_btConstraintSetting_set_m_impulseClamp_1 = function() {
                    return (xp = a._emscripten_bind_btConstraintSetting_set_m_impulseClamp_1 = a.asm.sn).apply(null, arguments)
                },
                yp = a._emscripten_bind_btConstraintSetting___destroy___0 = function() {
                    return (yp = a._emscripten_bind_btConstraintSetting___destroy___0 = a.asm.tn).apply(null,
                        arguments)
                },
                zp = a._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2 = function() {
                    return (zp = a._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2 = a.asm.un).apply(null, arguments)
                },
                Ap = a._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4 = function() {
                    return (Ap = a._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4 = a.asm.vn).apply(null, arguments)
                },
                Bp = a._emscripten_bind_btPoint2PointConstraint_setPivotA_1 = function() {
                    return (Bp = a._emscripten_bind_btPoint2PointConstraint_setPivotA_1 =
                        a.asm.wn).apply(null, arguments)
                },
                Cp = a._emscripten_bind_btPoint2PointConstraint_setPivotB_1 = function() {
                    return (Cp = a._emscripten_bind_btPoint2PointConstraint_setPivotB_1 = a.asm.xn).apply(null, arguments)
                },
                Dp = a._emscripten_bind_btPoint2PointConstraint_getPivotInA_0 = function() {
                    return (Dp = a._emscripten_bind_btPoint2PointConstraint_getPivotInA_0 = a.asm.yn).apply(null, arguments)
                },
                Ep = a._emscripten_bind_btPoint2PointConstraint_getPivotInB_0 = function() {
                    return (Ep = a._emscripten_bind_btPoint2PointConstraint_getPivotInB_0 =
                        a.asm.zn).apply(null, arguments)
                },
                Fp = a._emscripten_bind_btPoint2PointConstraint_enableFeedback_1 = function() {
                    return (Fp = a._emscripten_bind_btPoint2PointConstraint_enableFeedback_1 = a.asm.An).apply(null, arguments)
                },
                Gp = a._emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0 = function() {
                    return (Gp = a._emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0 = a.asm.Bn).apply(null, arguments)
                },
                Hp = a._emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1 = function() {
                    return (Hp =
                        a._emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1 = a.asm.Cn).apply(null, arguments)
                },
                Ip = a._emscripten_bind_btPoint2PointConstraint_getParam_2 = function() {
                    return (Ip = a._emscripten_bind_btPoint2PointConstraint_getParam_2 = a.asm.Dn).apply(null, arguments)
                },
                Jp = a._emscripten_bind_btPoint2PointConstraint_setParam_3 = function() {
                    return (Jp = a._emscripten_bind_btPoint2PointConstraint_setParam_3 = a.asm.En).apply(null, arguments)
                },
                Kp = a._emscripten_bind_btPoint2PointConstraint_get_m_setting_0 = function() {
                    return (Kp =
                        a._emscripten_bind_btPoint2PointConstraint_get_m_setting_0 = a.asm.Fn).apply(null, arguments)
                },
                Lp = a._emscripten_bind_btPoint2PointConstraint_set_m_setting_1 = function() {
                    return (Lp = a._emscripten_bind_btPoint2PointConstraint_set_m_setting_1 = a.asm.Gn).apply(null, arguments)
                },
                Mp = a._emscripten_bind_btPoint2PointConstraint___destroy___0 = function() {
                    return (Mp = a._emscripten_bind_btPoint2PointConstraint___destroy___0 = a.asm.Hn).apply(null, arguments)
                },
                Np = a._emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0 =
                function() {
                    return (Np = a._emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0 = a.asm.In).apply(null, arguments)
                },
                Op = a._emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0 = function() {
                    return (Op = a._emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0 = a.asm.Jn).apply(null, arguments)
                },
                Pp = a._emscripten_bind_btFixedConstraint_btFixedConstraint_4 = function() {
                    return (Pp = a._emscripten_bind_btFixedConstraint_btFixedConstraint_4 = a.asm.Kn).apply(null,
                        arguments)
                },
                Qp = a._emscripten_bind_btFixedConstraint_enableFeedback_1 = function() {
                    return (Qp = a._emscripten_bind_btFixedConstraint_enableFeedback_1 = a.asm.Ln).apply(null, arguments)
                },
                Rp = a._emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0 = function() {
                    return (Rp = a._emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0 = a.asm.Mn).apply(null, arguments)
                },
                Sp = a._emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1 = function() {
                    return (Sp = a._emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1 =
                        a.asm.Nn).apply(null, arguments)
                },
                Tp = a._emscripten_bind_btFixedConstraint_getParam_2 = function() {
                    return (Tp = a._emscripten_bind_btFixedConstraint_getParam_2 = a.asm.On).apply(null, arguments)
                },
                Up = a._emscripten_bind_btFixedConstraint_setParam_3 = function() {
                    return (Up = a._emscripten_bind_btFixedConstraint_setParam_3 = a.asm.Pn).apply(null, arguments)
                },
                Vp = a._emscripten_bind_btFixedConstraint___destroy___0 = function() {
                    return (Vp = a._emscripten_bind_btFixedConstraint___destroy___0 = a.asm.Qn).apply(null, arguments)
                },
                Wp =
                a._emscripten_bind_btConstraintSolver___destroy___0 = function() {
                    return (Wp = a._emscripten_bind_btConstraintSolver___destroy___0 = a.asm.Rn).apply(null, arguments)
                },
                Xp = a._emscripten_bind_btDispatcherInfo_get_m_timeStep_0 = function() {
                    return (Xp = a._emscripten_bind_btDispatcherInfo_get_m_timeStep_0 = a.asm.Sn).apply(null, arguments)
                },
                Yp = a._emscripten_bind_btDispatcherInfo_set_m_timeStep_1 = function() {
                    return (Yp = a._emscripten_bind_btDispatcherInfo_set_m_timeStep_1 = a.asm.Tn).apply(null, arguments)
                },
                Zp = a._emscripten_bind_btDispatcherInfo_get_m_stepCount_0 =
                function() {
                    return (Zp = a._emscripten_bind_btDispatcherInfo_get_m_stepCount_0 = a.asm.Un).apply(null, arguments)
                },
                $p = a._emscripten_bind_btDispatcherInfo_set_m_stepCount_1 = function() {
                    return ($p = a._emscripten_bind_btDispatcherInfo_set_m_stepCount_1 = a.asm.Vn).apply(null, arguments)
                },
                aq = a._emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0 = function() {
                    return (aq = a._emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0 = a.asm.Wn).apply(null, arguments)
                },
                bq = a._emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1 =
                function() {
                    return (bq = a._emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1 = a.asm.Xn).apply(null, arguments)
                },
                cq = a._emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0 = function() {
                    return (cq = a._emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0 = a.asm.Yn).apply(null, arguments)
                },
                dq = a._emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1 = function() {
                    return (dq = a._emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1 = a.asm.Zn).apply(null, arguments)
                },
                eq = a._emscripten_bind_btDispatcherInfo_get_m_useContinuous_0 =
                function() {
                    return (eq = a._emscripten_bind_btDispatcherInfo_get_m_useContinuous_0 = a.asm._n).apply(null, arguments)
                },
                fq = a._emscripten_bind_btDispatcherInfo_set_m_useContinuous_1 = function() {
                    return (fq = a._emscripten_bind_btDispatcherInfo_set_m_useContinuous_1 = a.asm.$n).apply(null, arguments)
                },
                gq = a._emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0 = function() {
                    return (gq = a._emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0 = a.asm.ao).apply(null, arguments)
                },
                hq = a._emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1 =
                function() {
                    return (hq = a._emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1 = a.asm.bo).apply(null, arguments)
                },
                iq = a._emscripten_bind_btDispatcherInfo_get_m_enableSPU_0 = function() {
                    return (iq = a._emscripten_bind_btDispatcherInfo_get_m_enableSPU_0 = a.asm.co).apply(null, arguments)
                },
                jq = a._emscripten_bind_btDispatcherInfo_set_m_enableSPU_1 = function() {
                    return (jq = a._emscripten_bind_btDispatcherInfo_set_m_enableSPU_1 = a.asm.eo).apply(null, arguments)
                },
                kq = a._emscripten_bind_btDispatcherInfo_get_m_useEpa_0 = function() {
                    return (kq =
                        a._emscripten_bind_btDispatcherInfo_get_m_useEpa_0 = a.asm.fo).apply(null, arguments)
                },
                lq = a._emscripten_bind_btDispatcherInfo_set_m_useEpa_1 = function() {
                    return (lq = a._emscripten_bind_btDispatcherInfo_set_m_useEpa_1 = a.asm.go).apply(null, arguments)
                },
                mq = a._emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0 = function() {
                    return (mq = a._emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0 = a.asm.ho).apply(null, arguments)
                },
                nq = a._emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1 =
                function() {
                    return (nq = a._emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1 = a.asm.io).apply(null, arguments)
                },
                oq = a._emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0 = function() {
                    return (oq = a._emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0 = a.asm.jo).apply(null, arguments)
                },
                pq = a._emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1 = function() {
                    return (pq = a._emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1 =
                        a.asm.ko).apply(null, arguments)
                },
                qq = a._emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0 = function() {
                    return (qq = a._emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0 = a.asm.lo).apply(null, arguments)
                },
                rq = a._emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1 = function() {
                    return (rq = a._emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1 = a.asm.mo).apply(null, arguments)
                },
                sq = a._emscripten_bind_btDispatcherInfo___destroy___0 =
                function() {
                    return (sq = a._emscripten_bind_btDispatcherInfo___destroy___0 = a.asm.no).apply(null, arguments)
                },
                tq = a._emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0 = function() {
                    return (tq = a._emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0 = a.asm.oo).apply(null, arguments)
                },
                uq = a._emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1 = function() {
                    return (uq = a._emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1 = a.asm.po).apply(null, arguments)
                },
                vq = a._emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0 =
                function() {
                    return (vq = a._emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0 = a.asm.qo).apply(null, arguments)
                },
                wq = a._emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1 = function() {
                    return (wq = a._emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1 = a.asm.ro).apply(null, arguments)
                },
                xq = a._emscripten_bind_btContactSolverInfo_get_m_numIterations_0 = function() {
                    return (xq = a._emscripten_bind_btContactSolverInfo_get_m_numIterations_0 = a.asm.so).apply(null,
                        arguments)
                },
                yq = a._emscripten_bind_btContactSolverInfo_set_m_numIterations_1 = function() {
                    return (yq = a._emscripten_bind_btContactSolverInfo_set_m_numIterations_1 = a.asm.to).apply(null, arguments)
                },
                zq = a._emscripten_bind_btContactSolverInfo___destroy___0 = function() {
                    return (zq = a._emscripten_bind_btContactSolverInfo___destroy___0 = a.asm.uo).apply(null, arguments)
                },
                Aq = a._emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4 = function() {
                    return (Aq = a._emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4 =
                        a.asm.vo).apply(null, arguments)
                },
                Bq = a._emscripten_bind_btDiscreteDynamicsWorld_setGravity_1 = function() {
                    return (Bq = a._emscripten_bind_btDiscreteDynamicsWorld_setGravity_1 = a.asm.wo).apply(null, arguments)
                },
                Cq = a._emscripten_bind_btDiscreteDynamicsWorld_getGravity_0 = function() {
                    return (Cq = a._emscripten_bind_btDiscreteDynamicsWorld_getGravity_0 = a.asm.xo).apply(null, arguments)
                },
                Dq = a._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1 = function() {
                    return (Dq = a._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1 =
                        a.asm.yo).apply(null, arguments)
                },
                Eq = a._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3 = function() {
                    return (Eq = a._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3 = a.asm.zo).apply(null, arguments)
                },
                Fq = a._emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1 = function() {
                    return (Fq = a._emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1 = a.asm.Ao).apply(null, arguments)
                },
                Gq = a._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1 = function() {
                    return (Gq = a._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1 =
                        a.asm.Bo).apply(null, arguments)
                },
                Hq = a._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2 = function() {
                    return (Hq = a._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2 = a.asm.Co).apply(null, arguments)
                },
                Iq = a._emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1 = function() {
                    return (Iq = a._emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1 = a.asm.Do).apply(null, arguments)
                },
                Jq = a._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1 = function() {
                    return (Jq = a._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1 =
                        a.asm.Eo).apply(null, arguments)
                },
                Kq = a._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2 = function() {
                    return (Kq = a._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2 = a.asm.Fo).apply(null, arguments)
                },
                Lq = a._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3 = function() {
                    return (Lq = a._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3 = a.asm.Go).apply(null, arguments)
                },
                Mq = a._emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1 = function() {
                    return (Mq = a._emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1 =
                        a.asm.Ho).apply(null, arguments)
                },
                Nq = a._emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1 = function() {
                    return (Nq = a._emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1 = a.asm.Io).apply(null, arguments)
                },
                Oq = a._emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1 = function() {
                    return (Oq = a._emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1 = a.asm.Jo).apply(null, arguments)
                },
                Pq = a._emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0 =
                function() {
                    return (Pq = a._emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0 = a.asm.Ko).apply(null, arguments)
                },
                Qq = a._emscripten_bind_btDiscreteDynamicsWorld_rayTest_3 = function() {
                    return (Qq = a._emscripten_bind_btDiscreteDynamicsWorld_rayTest_3 = a.asm.Lo).apply(null, arguments)
                },
                Rq = a._emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0 = function() {
                    return (Rq = a._emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0 = a.asm.Mo).apply(null, arguments)
                },
                Sq = a._emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0 =
                function() {
                    return (Sq = a._emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0 = a.asm.No).apply(null, arguments)
                },
                Tq = a._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1 = function() {
                    return (Tq = a._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1 = a.asm.Oo).apply(null, arguments)
                },
                Uq = a._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2 = function() {
                    return (Uq = a._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2 = a.asm.Po).apply(null, arguments)
                },
                Vq = a._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3 =
                function() {
                    return (Vq = a._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3 = a.asm.Qo).apply(null, arguments)
                },
                Wq = a._emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1 = function() {
                    return (Wq = a._emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1 = a.asm.Ro).apply(null, arguments)
                },
                Xq = a._emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0 = function() {
                    return (Xq = a._emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0 = a.asm.So).apply(null, arguments)
                },
                Yq = a._emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5 =
                function() {
                    return (Yq = a._emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5 = a.asm.To).apply(null, arguments)
                },
                Zq = a._emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3 = function() {
                    return (Zq = a._emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3 = a.asm.Uo).apply(null, arguments)
                },
                $q = a._emscripten_bind_btDiscreteDynamicsWorld_contactTest_2 = function() {
                    return ($q = a._emscripten_bind_btDiscreteDynamicsWorld_contactTest_2 = a.asm.Vo).apply(null, arguments)
                },
                ar = a._emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1 =
                function() {
                    return (ar = a._emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1 = a.asm.Wo).apply(null, arguments)
                },
                br = a._emscripten_bind_btDiscreteDynamicsWorld_addAction_1 = function() {
                    return (br = a._emscripten_bind_btDiscreteDynamicsWorld_addAction_1 = a.asm.Xo).apply(null, arguments)
                },
                cr = a._emscripten_bind_btDiscreteDynamicsWorld_removeAction_1 = function() {
                    return (cr = a._emscripten_bind_btDiscreteDynamicsWorld_removeAction_1 = a.asm.Yo).apply(null, arguments)
                },
                dr = a._emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0 =
                function() {
                    return (dr = a._emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0 = a.asm.Zo).apply(null, arguments)
                },
                er = a._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1 = function() {
                    return (er = a._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1 = a.asm._o).apply(null, arguments)
                },
                fr = a._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2 = function() {
                    return (fr = a._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2 = a.asm.$o).apply(null, arguments)
                },
                gr = a._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3 = function() {
                    return (gr = a._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3 = a.asm.ap).apply(null, arguments)
                },
                hr = a._emscripten_bind_btDiscreteDynamicsWorld___destroy___0 = function() {
                    return (hr = a._emscripten_bind_btDiscreteDynamicsWorld___destroy___0 = a.asm.bp).apply(null, arguments)
                },
                ir = a._emscripten_bind_btActionInterface_updateAction_2 = function() {
                    return (ir = a._emscripten_bind_btActionInterface_updateAction_2 = a.asm.cp).apply(null,
                        arguments)
                },
                jr = a._emscripten_bind_btActionInterface___destroy___0 = function() {
                    return (jr = a._emscripten_bind_btActionInterface___destroy___0 = a.asm.dp).apply(null, arguments)
                },
                kr = a._emscripten_bind_btGhostPairCallback_btGhostPairCallback_0 = function() {
                    return (kr = a._emscripten_bind_btGhostPairCallback_btGhostPairCallback_0 = a.asm.ep).apply(null, arguments)
                },
                lr = a._emscripten_bind_btGhostPairCallback___destroy___0 = function() {
                    return (lr = a._emscripten_bind_btGhostPairCallback___destroy___0 = a.asm.fp).apply(null,
                        arguments)
                },
                mr = a._emscripten_enum_PHY_ScalarType_PHY_FLOAT = function() {
                    return (mr = a._emscripten_enum_PHY_ScalarType_PHY_FLOAT = a.asm.gp).apply(null, arguments)
                },
                nr = a._emscripten_enum_PHY_ScalarType_PHY_DOUBLE = function() {
                    return (nr = a._emscripten_enum_PHY_ScalarType_PHY_DOUBLE = a.asm.hp).apply(null, arguments)
                },
                or = a._emscripten_enum_PHY_ScalarType_PHY_INTEGER = function() {
                    return (or = a._emscripten_enum_PHY_ScalarType_PHY_INTEGER = a.asm.ip).apply(null, arguments)
                },
                pr = a._emscripten_enum_PHY_ScalarType_PHY_SHORT = function() {
                    return (pr =
                        a._emscripten_enum_PHY_ScalarType_PHY_SHORT = a.asm.jp).apply(null, arguments)
                },
                qr = a._emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88 = function() {
                    return (qr = a._emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88 = a.asm.kp).apply(null, arguments)
                },
                rr = a._emscripten_enum_PHY_ScalarType_PHY_UCHAR = function() {
                    return (rr = a._emscripten_enum_PHY_ScalarType_PHY_UCHAR = a.asm.lp).apply(null, arguments)
                },
                sr = a._emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP = function() {
                    return (sr = a._emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP =
                        a.asm.mp).apply(null, arguments)
                },
                tr = a._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP = function() {
                    return (tr = a._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP = a.asm.np).apply(null, arguments)
                },
                ur = a._emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM = function() {
                    return (ur = a._emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM = a.asm.op).apply(null, arguments)
                },
                vr = a._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM = function() {
                    return (vr = a._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM =
                        a.asm.pp).apply(null, arguments)
                };
            a._malloc = function() {
                return (a._malloc = a.asm.rp).apply(null, arguments)
            };
            a.___start_em_js = 22798;
            a.___stop_em_js = 22896;
            a.addFunction = function(b, c) {
                if (!Sa) {
                    Sa = new WeakMap;
                    var d = va.length;
                    if (Sa)
                        for (var e = 0; e < 0 + d; e++) {
                            var g = va.get(e);
                            g && Sa.set(g, e)
                        }
                }
                if (d = Sa.get(b) || 0) return d;
                if (Ta.length) d = Ta.pop();
                else {
                    try {
                        va.grow(1)
                    } catch (Oa) {
                        if (!(Oa instanceof RangeError)) throw Oa;
                        throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
                    }
                    d = va.length - 1
                }
                try {
                    va.set(d, b)
                } catch (Oa) {
                    if (!(Oa instanceof TypeError)) throw Oa;
                    if ("function" == typeof WebAssembly.Function) {
                        e = WebAssembly.Function;
                        g = {
                            i: "i32",
                            j: "i64",
                            f: "f32",
                            d: "f64",
                            p: "i32"
                        };
                        for (var B = {
                                parameters: [],
                                results: "v" == c[0] ? [] : [g[c[0]]]
                            }, H = 1; H < c.length; ++H) B.parameters.push(g[c[H]]);
                        c = new e(B, b)
                    } else {
                        e = [1];
                        g = c.slice(0, 1);
                        c = c.slice(1);
                        B = {
                            i: 127,
                            p: 127,
                            j: 126,
                            f: 125,
                            d: 124
                        };
                        e.push(96);
                        H = c.length;
                        128 > H ? e.push(H) : e.push(H % 128 | 128, H >> 7);
                        for (H = 0; H < c.length; ++H) e.push(B[c[H]]);
                        "v" == g ? e.push(0) : e.push(1, B[g]);
                        c = [0, 97, 115, 109, 1, 0, 0, 0, 1];
                        g = e.length;
                        128 > g ? c.push(g) : c.push(g % 128 | 128, g >> 7);
                        c.push.apply(c, e);
                        c.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
                        c = new WebAssembly.Module(new Uint8Array(c));
                        c = (new WebAssembly.Instance(c, {
                            e: {
                                f: b
                            }
                        })).exports.f
                    }
                    va.set(d, c)
                }
                Sa.set(b, d);
                return d
            };
            var wr;
            Da = function xr() {
                wr || yr();
                wr || (Da = xr)
            };

            function yr() {
                function b() {
                    if (!wr && (wr = !0, a.calledRun = !0, !qa)) {
                        za = !0;
                        Ma(xa);
                        aa(a);
                        if (a.onRuntimeInitialized) a.onRuntimeInitialized();
                        if (a.postRun)
                            for ("function" == typeof a.postRun && (a.postRun = [a.postRun]); a.postRun.length;) {
                                var c = a.postRun.shift();
                                ya.unshift(c)
                            }
                        Ma(ya)
                    }
                }
                if (!(0 < Ba)) {
                    if (a.preRun)
                        for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length;) Aa();
                    Ma(wa);
                    0 < Ba || (a.setStatus ? (a.setStatus("Running..."), setTimeout(function() {
                        setTimeout(function() {
                            a.setStatus("")
                        }, 1);
                        b()
                    }, 1)) : b())
                }
            }
            if (a.preInit)
                for ("function" == typeof a.preInit && (a.preInit = [a.preInit]); 0 < a.preInit.length;) a.preInit.pop()();
            yr();

            function f() {}
            f.prototype = Object.create(f.prototype);
            f.prototype.constructor = f;
            f.prototype.tp = f;
            f.up = {};
            a.WrapperObject = f;

            function h(b) {
                return (b || f).up
            }
            a.getCache = h;

            function k(b, c) {
                var d = h(c),
                    e = d[b];
                if (e) return e;
                e = Object.create((c || f).prototype);
                e.sp = b;
                return d[b] = e
            }
            a.wrapPointer = k;
            a.castObject = function(b, c) {
                return k(b.sp, c)
            };
            a.NULL = k(0);
            a.destroy = function(b) {
                if (!b.__destroy__) throw "Error: Cannot destroy object. (Did you create it yourself?)";
                b.__destroy__();
                delete h(b.tp)[b.sp]
            };
            a.compare = function(b, c) {
                return b.sp === c.sp
            };
            a.getPointer = function(b) {
                return b.sp
            };
            a.getClass = function(b) {
                return b.tp
            };
            var zr = 0,
                Ar = 0,
                Br = 0,
                Cr = [],
                Dr = 0;

            function Er() {
                if (Dr) {
                    for (var b = 0; b < Cr.length; b++) a._free(Cr[b]);
                    Cr.length = 0;
                    a._free(zr);
                    zr = 0;
                    Ar += Dr;
                    Dr = 0
                }
                zr || (Ar += 128, (zr = a._malloc(Ar)) || oa());
                Br = 0
            }

            function Fr(b) {
                if ("object" === typeof b) {
                    var c = ta;
                    zr || oa();
                    c = b.length * c.BYTES_PER_ELEMENT;
                    c = c + 7 & -8;
                    if (Br + c >= Ar) {
                        0 < c || oa();
                        Dr += c;
                        var d = a._malloc(c);
                        Cr.push(d)
                    } else d = zr + Br, Br += c;
                    c = d;
                    var e = ta;
                    d = c >>> 0;
                    switch (e.BYTES_PER_ELEMENT) {
                        case 2:
                            d >>>= 1;
                            break;
                        case 4:
                            d >>>= 2;
                            break;
                        case 8:
                            d >>>= 3
                    }
                    for (var g = 0; g < b.length; g++) e[d + g] = b[g];
                    return c
                }
                return b
            }

            function l() {
                throw "cannot construct a btCollisionShape, no constructor in IDL";
            }
            l.prototype = Object.create(f.prototype);
            l.prototype.constructor = l;
            l.prototype.tp = l;
            l.up = {};
            a.btCollisionShape = l;
            l.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Va(c, b)
            };
            l.prototype.getLocalScaling = function() {
                return k(Wa(this.sp), m)
            };
            l.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Xa(d, b, c)
            };
            l.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Ya(c, b)
            };
            l.prototype.getMargin = function() {
                return Za(this.sp)
            };
            l.prototype.__destroy__ = function() {
                $a(this.sp)
            };

            function Gr() {
                throw "cannot construct a btConcaveShape, no constructor in IDL";
            }
            Gr.prototype = Object.create(l.prototype);
            Gr.prototype.constructor = Gr;
            Gr.prototype.tp = Gr;
            Gr.up = {};
            a.btConcaveShape = Gr;
            Gr.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ab(c, b)
            };
            Gr.prototype.getLocalScaling = function() {
                return k(bb(this.sp), m)
            };
            Gr.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                cb(d, b, c)
            };
            Gr.prototype.__destroy__ = function() {
                db(this.sp)
            };

            function Hr() {
                throw "cannot construct a btCollisionAlgorithm, no constructor in IDL";
            }
            Hr.prototype = Object.create(f.prototype);
            Hr.prototype.constructor = Hr;
            Hr.prototype.tp = Hr;
            Hr.up = {};
            a.btCollisionAlgorithm = Hr;
            Hr.prototype.__destroy__ = function() {
                eb(this.sp)
            };

            function n() {
                throw "cannot construct a btCollisionWorld, no constructor in IDL";
            }
            n.prototype = Object.create(f.prototype);
            n.prototype.constructor = n;
            n.prototype.tp = n;
            n.up = {};
            a.btCollisionWorld = n;
            n.prototype.getDispatcher = function() {
                return k(fb(this.sp), Ir)
            };
            n.prototype.rayTest = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                gb(e, b, c, d)
            };
            n.prototype.getPairCache = function() {
                return k(hb(this.sp), Jr)
            };
            n.prototype.getDispatchInfo = function() {
                return k(ib(this.sp), p)
            };
            n.prototype.addCollisionObject = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                void 0 === c ? jb(e, b) : void 0 === d ? kb(e, b, c) : lb(e, b, c, d)
            };
            n.prototype.removeCollisionObject = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                mb(c, b)
            };
            n.prototype.getBroadphase = function() {
                return k(nb(this.sp), Kr)
            };
            n.prototype.convexSweepTest = function(b, c, d, e, g) {
                var B = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                g && "object" === typeof g && (g = g.sp);
                ob(B, b, c, d, e, g)
            };
            n.prototype.contactPairTest = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                pb(e, b, c, d)
            };
            n.prototype.contactTest = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                qb(d, b, c)
            };
            n.prototype.updateSingleAabb = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                rb(c, b)
            };
            n.prototype.__destroy__ = function() {
                sb(this.sp)
            };

            function m(b, c, d) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                this.sp = void 0 === b ? tb() : void 0 === c ? _emscripten_bind_btVector3_btVector3_1(b) : void 0 === d ? _emscripten_bind_btVector3_btVector3_2(b, c) : ub(b, c, d);
                h(m)[this.sp] = this
            }
            m.prototype = Object.create(f.prototype);
            m.prototype.constructor = m;
            m.prototype.tp = m;
            m.up = {};
            a.btVector3 = m;
            m.prototype.length = m.prototype.length = function() {
                return vb(this.sp)
            };
            m.prototype.x = m.prototype.x = function() {
                return wb(this.sp)
            };
            m.prototype.y = m.prototype.y = function() {
                return xb(this.sp)
            };
            m.prototype.z = m.prototype.z = function() {
                return yb(this.sp)
            };
            m.prototype.setX = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                zb(c, b)
            };
            m.prototype.setY = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Ab(c, b)
            };
            m.prototype.setZ = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Bb(c, b)
            };
            m.prototype.setValue = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                Cb(e, b, c, d)
            };
            m.prototype.normalize = m.prototype.normalize = function() {
                Db(this.sp)
            };
            m.prototype.rotate = m.prototype.rotate = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                return k(Eb(d, b, c), m)
            };
            m.prototype.dot = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return Fb(c, b)
            };
            m.prototype.op_mul = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Gb(c, b), m)
            };
            m.prototype.op_add = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Hb(c, b), m)
            };
            m.prototype.op_sub = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Ib(c, b), m)
            };
            m.prototype.__destroy__ = function() {
                Jb(this.sp)
            };

            function q() {
                throw "cannot construct a btQuadWord, no constructor in IDL";
            }
            q.prototype = Object.create(f.prototype);
            q.prototype.constructor = q;
            q.prototype.tp = q;
            q.up = {};
            a.btQuadWord = q;
            q.prototype.x = q.prototype.x = function() {
                return Kb(this.sp)
            };
            q.prototype.y = q.prototype.y = function() {
                return Lb(this.sp)
            };
            q.prototype.z = q.prototype.z = function() {
                return Mb(this.sp)
            };
            q.prototype.w = q.prototype.w = function() {
                return Nb(this.sp)
            };
            q.prototype.setX = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Ob(c, b)
            };
            q.prototype.setY = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Pb(c, b)
            };
            q.prototype.setZ = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Qb(c, b)
            };
            q.prototype.setW = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Rb(c, b)
            };
            q.prototype.__destroy__ = function() {
                Sb(this.sp)
            };

            function Lr() {
                throw "cannot construct a btMotionState, no constructor in IDL";
            }
            Lr.prototype = Object.create(f.prototype);
            Lr.prototype.constructor = Lr;
            Lr.prototype.tp = Lr;
            Lr.up = {};
            a.btMotionState = Lr;
            Lr.prototype.getWorldTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Tb(c, b)
            };
            Lr.prototype.setWorldTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Ub(c, b)
            };
            Lr.prototype.__destroy__ = function() {
                Vb(this.sp)
            };

            function r() {
                throw "cannot construct a btCollisionObject, no constructor in IDL";
            }
            r.prototype = Object.create(f.prototype);
            r.prototype.constructor = r;
            r.prototype.tp = r;
            r.up = {};
            a.btCollisionObject = r;
            r.prototype.setAnisotropicFriction = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Wb(d, b, c)
            };
            r.prototype.getCollisionShape = function() {
                return k(Xb(this.sp), l)
            };
            r.prototype.setContactProcessingThreshold = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Yb(c, b)
            };
            r.prototype.setActivationState = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Zb(c, b)
            };
            r.prototype.forceActivationState = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                $b(c, b)
            };
            r.prototype.activate = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                void 0 === b ? ac(c) : bc(c, b)
            };
            r.prototype.isActive = function() {
                return !!cc(this.sp)
            };
            r.prototype.isKinematicObject = function() {
                return !!dc(this.sp)
            };
            r.prototype.isStaticObject = function() {
                return !!ec(this.sp)
            };
            r.prototype.isStaticOrKinematicObject = function() {
                return !!fc(this.sp)
            };
            r.prototype.getRestitution = function() {
                return gc(this.sp)
            };
            r.prototype.getFriction = function() {
                return hc(this.sp)
            };
            r.prototype.getRollingFriction = function() {
                return ic(this.sp)
            };
            r.prototype.setRestitution = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                jc(c, b)
            };
            r.prototype.setFriction = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                kc(c, b)
            };
            r.prototype.setRollingFriction = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                lc(c, b)
            };
            r.prototype.getWorldTransform = function() {
                return k(mc(this.sp), t)
            };
            r.prototype.getCollisionFlags = function() {
                return nc(this.sp)
            };
            r.prototype.setCollisionFlags = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                oc(c, b)
            };
            r.prototype.setWorldTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                pc(c, b)
            };
            r.prototype.setCollisionShape = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                qc(c, b)
            };
            r.prototype.setCcdMotionThreshold = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                rc(c, b)
            };
            r.prototype.setCcdSweptSphereRadius = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                sc(c, b)
            };
            r.prototype.getUserIndex = function() {
                return tc(this.sp)
            };
            r.prototype.setUserIndex = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                uc(c, b)
            };
            r.prototype.getUserPointer = function() {
                return k(vc(this.sp), Mr)
            };
            r.prototype.setUserPointer = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                wc(c, b)
            };
            r.prototype.getBroadphaseHandle = function() {
                return k(xc(this.sp), u)
            };
            r.prototype.__destroy__ = function() {
                yc(this.sp)
            };

            function v() {
                throw "cannot construct a RayResultCallback, no constructor in IDL";
            }
            v.prototype = Object.create(f.prototype);
            v.prototype.constructor = v;
            v.prototype.tp = v;
            v.up = {};
            a.RayResultCallback = v;
            v.prototype.hasHit = function() {
                return !!zc(this.sp)
            };
            v.prototype.get_m_collisionFilterGroup = v.prototype.vp = function() {
                return Ac(this.sp)
            };
            v.prototype.set_m_collisionFilterGroup = v.prototype.xp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Bc(c, b)
            };
            Object.defineProperty(v.prototype, "m_collisionFilterGroup", {
                get: v.prototype.vp,
                set: v.prototype.xp
            });
            v.prototype.get_m_collisionFilterMask = v.prototype.wp = function() {
                return Cc(this.sp)
            };
            v.prototype.set_m_collisionFilterMask = v.prototype.yp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Dc(c, b)
            };
            Object.defineProperty(v.prototype, "m_collisionFilterMask", {
                get: v.prototype.wp,
                set: v.prototype.yp
            });
            v.prototype.get_m_closestHitFraction = v.prototype.zp = function() {
                return Ec(this.sp)
            };
            v.prototype.set_m_closestHitFraction = v.prototype.Ap = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Fc(c, b)
            };
            Object.defineProperty(v.prototype, "m_closestHitFraction", {
                get: v.prototype.zp,
                set: v.prototype.Ap
            });
            v.prototype.get_m_collisionObject = v.prototype.Bp = function() {
                return k(Gc(this.sp), r)
            };
            v.prototype.set_m_collisionObject = v.prototype.Fp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Hc(c, b)
            };
            Object.defineProperty(v.prototype, "m_collisionObject", {
                get: v.prototype.Bp,
                set: v.prototype.Fp
            });
            v.prototype.get_m_flags = v.prototype.Cp = function() {
                return Ic(this.sp)
            };
            v.prototype.set_m_flags = v.prototype.Gp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Jc(c, b)
            };
            Object.defineProperty(v.prototype, "m_flags", {
                get: v.prototype.Cp,
                set: v.prototype.Gp
            });
            v.prototype.__destroy__ = function() {
                Kc(this.sp)
            };

            function Nr() {
                throw "cannot construct a ContactResultCallback, no constructor in IDL";
            }
            Nr.prototype = Object.create(f.prototype);
            Nr.prototype.constructor = Nr;
            Nr.prototype.tp = Nr;
            Nr.up = {};
            a.ContactResultCallback = Nr;
            Nr.prototype.addSingleResult = function(b, c, d, e, g, B, H) {
                var Oa = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                g && "object" === typeof g && (g = g.sp);
                B && "object" === typeof B && (B = B.sp);
                H && "object" === typeof H && (H = H.sp);
                return Lc(Oa, b, c, d, e, g, B, H)
            };
            Nr.prototype.__destroy__ = function() {
                Mc(this.sp)
            };

            function w() {
                throw "cannot construct a ConvexResultCallback, no constructor in IDL";
            }
            w.prototype = Object.create(f.prototype);
            w.prototype.constructor = w;
            w.prototype.tp = w;
            w.up = {};
            a.ConvexResultCallback = w;
            w.prototype.hasHit = function() {
                return !!Nc(this.sp)
            };
            w.prototype.get_m_collisionFilterGroup = w.prototype.vp = function() {
                return Oc(this.sp)
            };
            w.prototype.set_m_collisionFilterGroup = w.prototype.xp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Pc(c, b)
            };
            Object.defineProperty(w.prototype, "m_collisionFilterGroup", {
                get: w.prototype.vp,
                set: w.prototype.xp
            });
            w.prototype.get_m_collisionFilterMask = w.prototype.wp = function() {
                return Qc(this.sp)
            };
            w.prototype.set_m_collisionFilterMask = w.prototype.yp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Rc(c, b)
            };
            Object.defineProperty(w.prototype, "m_collisionFilterMask", {
                get: w.prototype.wp,
                set: w.prototype.yp
            });
            w.prototype.get_m_closestHitFraction = w.prototype.zp = function() {
                return Sc(this.sp)
            };
            w.prototype.set_m_closestHitFraction = w.prototype.Ap = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Tc(c, b)
            };
            Object.defineProperty(w.prototype, "m_closestHitFraction", {
                get: w.prototype.zp,
                set: w.prototype.Ap
            });
            w.prototype.__destroy__ = function() {
                Uc(this.sp)
            };

            function Or() {
                throw "cannot construct a btConvexShape, no constructor in IDL";
            }
            Or.prototype = Object.create(l.prototype);
            Or.prototype.constructor = Or;
            Or.prototype.tp = Or;
            Or.up = {};
            a.btConvexShape = Or;
            Or.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Vc(c, b)
            };
            Or.prototype.getLocalScaling = function() {
                return k(Wc(this.sp), m)
            };
            Or.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Xc(d, b, c)
            };
            Or.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Yc(c, b)
            };
            Or.prototype.getMargin = function() {
                return Zc(this.sp)
            };
            Or.prototype.__destroy__ = function() {
                $c(this.sp)
            };

            function x(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = ad(b, c);
                h(x)[this.sp] = this
            }
            x.prototype = Object.create(l.prototype);
            x.prototype.constructor = x;
            x.prototype.tp = x;
            x.up = {};
            a.btCapsuleShape = x;
            x.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                bd(c, b)
            };
            x.prototype.getMargin = function() {
                return cd(this.sp)
            };
            x.prototype.getUpAxis = function() {
                return dd(this.sp)
            };
            x.prototype.getRadius = function() {
                return ed(this.sp)
            };
            x.prototype.getHalfHeight = function() {
                return fd(this.sp)
            };
            x.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                gd(c, b)
            };
            x.prototype.getLocalScaling = function() {
                return k(hd(this.sp), m)
            };
            x.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                jd(d, b, c)
            };
            x.prototype.__destroy__ = function() {
                kd(this.sp)
            };

            function Pr(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = ld(b);
                h(Pr)[this.sp] = this
            }
            Pr.prototype = Object.create(l.prototype);
            Pr.prototype.constructor = Pr;
            Pr.prototype.tp = Pr;
            Pr.up = {};
            a.btCylinderShape = Pr;
            Pr.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                md(c, b)
            };
            Pr.prototype.getMargin = function() {
                return nd(this.sp)
            };
            Pr.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                od(c, b)
            };
            Pr.prototype.getLocalScaling = function() {
                return k(pd(this.sp), m)
            };
            Pr.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                qd(d, b, c)
            };
            Pr.prototype.__destroy__ = function() {
                rd(this.sp)
            };

            function Qr(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = sd(b, c);
                h(Qr)[this.sp] = this
            }
            Qr.prototype = Object.create(l.prototype);
            Qr.prototype.constructor = Qr;
            Qr.prototype.tp = Qr;
            Qr.up = {};
            a.btConeShape = Qr;
            Qr.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                td(c, b)
            };
            Qr.prototype.getLocalScaling = function() {
                return k(ud(this.sp), m)
            };
            Qr.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                vd(d, b, c)
            };
            Qr.prototype.__destroy__ = function() {
                wd(this.sp)
            };

            function Rr() {
                throw "cannot construct a btStridingMeshInterface, no constructor in IDL";
            }
            Rr.prototype = Object.create(f.prototype);
            Rr.prototype.constructor = Rr;
            Rr.prototype.tp = Rr;
            Rr.up = {};
            a.btStridingMeshInterface = Rr;
            Rr.prototype.setScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                xd(c, b)
            };
            Rr.prototype.__destroy__ = function() {
                yd(this.sp)
            };

            function Sr() {
                throw "cannot construct a btTriangleMeshShape, no constructor in IDL";
            }
            Sr.prototype = Object.create(Gr.prototype);
            Sr.prototype.constructor = Sr;
            Sr.prototype.tp = Sr;
            Sr.up = {};
            a.btTriangleMeshShape = Sr;
            Sr.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                zd(c, b)
            };
            Sr.prototype.getLocalScaling = function() {
                return k(Ad(this.sp), m)
            };
            Sr.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Bd(d, b, c)
            };
            Sr.prototype.__destroy__ = function() {
                Cd(this.sp)
            };

            function Tr() {
                throw "cannot construct a btPrimitiveManagerBase, no constructor in IDL";
            }
            Tr.prototype = Object.create(f.prototype);
            Tr.prototype.constructor = Tr;
            Tr.prototype.tp = Tr;
            Tr.up = {};
            a.btPrimitiveManagerBase = Tr;
            Tr.prototype.is_trimesh = function() {
                return !!Dd(this.sp)
            };
            Tr.prototype.get_primitive_count = function() {
                return Ed(this.sp)
            };
            Tr.prototype.get_primitive_box = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Fd(d, b, c)
            };
            Tr.prototype.get_primitive_triangle = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Gd(d, b, c)
            };
            Tr.prototype.__destroy__ = function() {
                Hd(this.sp)
            };

            function y() {
                throw "cannot construct a btGImpactShapeInterface, no constructor in IDL";
            }
            y.prototype = Object.create(Gr.prototype);
            y.prototype.constructor = y;
            y.prototype.tp = y;
            y.up = {};
            a.btGImpactShapeInterface = y;
            y.prototype.updateBound = function() {
                Id(this.sp)
            };
            y.prototype.postUpdate = function() {
                Jd(this.sp)
            };
            y.prototype.getShapeType = function() {
                return Kd(this.sp)
            };
            y.prototype.getName = function() {
                return Ra(Ld(this.sp))
            };
            y.prototype.getPrimitiveManager = function() {
                return k(Md(this.sp), Tr)
            };
            y.prototype.getNumChildShapes = function() {
                return Nd(this.sp)
            };
            y.prototype.childrenHasTransform = function() {
                return !!Od(this.sp)
            };
            y.prototype.needsRetrieveTriangles = function() {
                return !!Pd(this.sp)
            };
            y.prototype.needsRetrieveTetrahedrons = function() {
                return !!Qd(this.sp)
            };
            y.prototype.getBulletTriangle = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Rd(d, b, c)
            };
            y.prototype.getBulletTetrahedron = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Sd(d, b, c)
            };
            y.prototype.getChildShape = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Td(c, b), l)
            };
            y.prototype.getChildTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Ud(c, b), t)
            };
            y.prototype.setChildTransform = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Vd(d, b, c)
            };
            y.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Wd(c, b)
            };
            y.prototype.getLocalScaling = function() {
                return k(Xd(this.sp), m)
            };
            y.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Yd(d, b, c)
            };
            y.prototype.__destroy__ = function() {
                Zd(this.sp)
            };

            function Ur() {
                throw "cannot construct a btActivatingCollisionAlgorithm, no constructor in IDL";
            }
            Ur.prototype = Object.create(Hr.prototype);
            Ur.prototype.constructor = Ur;
            Ur.prototype.tp = Ur;
            Ur.up = {};
            a.btActivatingCollisionAlgorithm = Ur;
            Ur.prototype.__destroy__ = function() {
                $d(this.sp)
            };

            function Ir() {
                throw "cannot construct a btDispatcher, no constructor in IDL";
            }
            Ir.prototype = Object.create(f.prototype);
            Ir.prototype.constructor = Ir;
            Ir.prototype.tp = Ir;
            Ir.up = {};
            a.btDispatcher = Ir;
            Ir.prototype.getNumManifolds = function() {
                return ae(this.sp)
            };
            Ir.prototype.getManifoldByIndexInternal = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(be(c, b), Vr)
            };
            Ir.prototype.__destroy__ = function() {
                ce(this.sp)
            };

            function Wr() {
                throw "cannot construct a btTypedConstraint, no constructor in IDL";
            }
            Wr.prototype = Object.create(f.prototype);
            Wr.prototype.constructor = Wr;
            Wr.prototype.tp = Wr;
            Wr.up = {};
            a.btTypedConstraint = Wr;
            Wr.prototype.enableFeedback = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                de(c, b)
            };
            Wr.prototype.getBreakingImpulseThreshold = function() {
                return ee(this.sp)
            };
            Wr.prototype.setBreakingImpulseThreshold = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                fe(c, b)
            };
            Wr.prototype.getParam = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                return ge(d, b, c)
            };
            Wr.prototype.setParam = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                he(e, b, c, d)
            };
            Wr.prototype.__destroy__ = function() {
                ie(this.sp)
            };

            function z() {
                throw "cannot construct a btDynamicsWorld, no constructor in IDL";
            }
            z.prototype = Object.create(n.prototype);
            z.prototype.constructor = z;
            z.prototype.tp = z;
            z.up = {};
            a.btDynamicsWorld = z;
            z.prototype.addAction = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                je(c, b)
            };
            z.prototype.removeAction = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ke(c, b)
            };
            z.prototype.getSolverInfo = function() {
                return k(le(this.sp), A)
            };
            z.prototype.setInternalTickCallback = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                void 0 === c ? me(e, b) : void 0 === d ? ne(e, b, c) : oe(e, b, c, d)
            };
            z.prototype.getDispatcher = function() {
                return k(pe(this.sp), Ir)
            };
            z.prototype.rayTest = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                qe(e, b, c, d)
            };
            z.prototype.getPairCache = function() {
                return k(re(this.sp), Jr)
            };
            z.prototype.getDispatchInfo = function() {
                return k(se(this.sp), p)
            };
            z.prototype.addCollisionObject = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                void 0 === c ? te(e, b) : void 0 === d ? ue(e, b, c) : ve(e, b, c, d)
            };
            z.prototype.removeCollisionObject = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                we(c, b)
            };
            z.prototype.getBroadphase = function() {
                return k(xe(this.sp), Kr)
            };
            z.prototype.convexSweepTest = function(b, c, d, e, g) {
                var B = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                g && "object" === typeof g && (g = g.sp);
                ye(B, b, c, d, e, g)
            };
            z.prototype.contactPairTest = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                ze(e, b, c, d)
            };
            z.prototype.contactTest = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Ae(d, b, c)
            };
            z.prototype.updateSingleAabb = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Be(c, b)
            };
            z.prototype.__destroy__ = function() {
                Ce(this.sp)
            };

            function Mr() {
                throw "cannot construct a VoidPtr, no constructor in IDL";
            }
            Mr.prototype = Object.create(f.prototype);
            Mr.prototype.constructor = Mr;
            Mr.prototype.tp = Mr;
            Mr.up = {};
            a.VoidPtr = Mr;
            Mr.prototype.__destroy__ = function() {
                De(this.sp)
            };

            function C(b, c, d, e) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                this.sp = void 0 === b ? Ee() : void 0 === c ? _emscripten_bind_btVector4_btVector4_1(b) : void 0 === d ? _emscripten_bind_btVector4_btVector4_2(b, c) : void 0 === e ? _emscripten_bind_btVector4_btVector4_3(b, c, d) : Fe(b, c, d, e);
                h(C)[this.sp] = this
            }
            C.prototype = Object.create(m.prototype);
            C.prototype.constructor = C;
            C.prototype.tp = C;
            C.up = {};
            a.btVector4 = C;
            C.prototype.w = C.prototype.w = function() {
                return Ge(this.sp)
            };
            C.prototype.setValue = function(b, c, d, e) {
                var g = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                He(g, b, c, d, e)
            };
            C.prototype.length = C.prototype.length = function() {
                return Ie(this.sp)
            };
            C.prototype.x = C.prototype.x = function() {
                return Je(this.sp)
            };
            C.prototype.y = C.prototype.y = function() {
                return Ke(this.sp)
            };
            C.prototype.z = C.prototype.z = function() {
                return Le(this.sp)
            };
            C.prototype.setX = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Me(c, b)
            };
            C.prototype.setY = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Ne(c, b)
            };
            C.prototype.setZ = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Oe(c, b)
            };
            C.prototype.normalize = C.prototype.normalize = function() {
                Pe(this.sp)
            };
            C.prototype.rotate = C.prototype.rotate = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                return k(Qe(d, b, c), m)
            };
            C.prototype.dot = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return Re(c, b)
            };
            C.prototype.op_mul = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Se(c, b), m)
            };
            C.prototype.op_add = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Te(c, b), m)
            };
            C.prototype.op_sub = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Ue(c, b), m)
            };
            C.prototype.__destroy__ = function() {
                Ve(this.sp)
            };

            function D(b, c, d, e) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                this.sp = We(b, c, d, e);
                h(D)[this.sp] = this
            }
            D.prototype = Object.create(q.prototype);
            D.prototype.constructor = D;
            D.prototype.tp = D;
            D.up = {};
            a.btQuaternion = D;
            D.prototype.setValue = function(b, c, d, e) {
                var g = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                Xe(g, b, c, d, e)
            };
            D.prototype.setEulerZYX = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                Ye(e, b, c, d)
            };
            D.prototype.setRotation = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Ze(d, b, c)
            };
            D.prototype.normalize = D.prototype.normalize = function() {
                $e(this.sp)
            };
            D.prototype.length2 = function() {
                return af(this.sp)
            };
            D.prototype.length = D.prototype.length = function() {
                return bf(this.sp)
            };
            D.prototype.dot = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return cf(c, b)
            };
            D.prototype.normalized = function() {
                return k(df(this.sp), D)
            };
            D.prototype.getAxis = function() {
                return k(ef(this.sp), m)
            };
            D.prototype.inverse = D.prototype.inverse = function() {
                return k(ff(this.sp), D)
            };
            D.prototype.getAngle = function() {
                return gf(this.sp)
            };
            D.prototype.getAngleShortestPath = function() {
                return hf(this.sp)
            };
            D.prototype.angle = D.prototype.angle = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return jf(c, b)
            };
            D.prototype.angleShortestPath = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return kf(c, b)
            };
            D.prototype.op_add = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(lf(c, b), D)
            };
            D.prototype.op_sub = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(mf(c, b), D)
            };
            D.prototype.op_mul = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(nf(c, b), D)
            };
            D.prototype.op_mulq = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k( of (c, b), D)
            };
            D.prototype.op_div = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(pf(c, b), D)
            };
            D.prototype.x = D.prototype.x = function() {
                return qf(this.sp)
            };
            D.prototype.y = D.prototype.y = function() {
                return rf(this.sp)
            };
            D.prototype.z = D.prototype.z = function() {
                return sf(this.sp)
            };
            D.prototype.w = D.prototype.w = function() {
                return tf(this.sp)
            };
            D.prototype.setX = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                uf(c, b)
            };
            D.prototype.setY = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                vf(c, b)
            };
            D.prototype.setZ = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                wf(c, b)
            };
            D.prototype.setW = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                xf(c, b)
            };
            D.prototype.__destroy__ = function() {
                yf(this.sp)
            };

            function Xr() {
                throw "cannot construct a btMatrix3x3, no constructor in IDL";
            }
            Xr.prototype = Object.create(f.prototype);
            Xr.prototype.constructor = Xr;
            Xr.prototype.tp = Xr;
            Xr.up = {};
            a.btMatrix3x3 = Xr;
            Xr.prototype.setEulerZYX = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                zf(e, b, c, d)
            };
            Xr.prototype.getRotation = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Af(c, b)
            };
            Xr.prototype.getRow = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Bf(c, b), m)
            };
            Xr.prototype.__destroy__ = function() {
                Cf(this.sp)
            };

            function t(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = void 0 === b ? Df() : void 0 === c ? _emscripten_bind_btTransform_btTransform_1(b) : Ef(b, c);
                h(t)[this.sp] = this
            }
            t.prototype = Object.create(f.prototype);
            t.prototype.constructor = t;
            t.prototype.tp = t;
            t.up = {};
            a.btTransform = t;
            t.prototype.setIdentity = function() {
                Ff(this.sp)
            };
            t.prototype.setOrigin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Gf(c, b)
            };
            t.prototype.setRotation = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Hf(c, b)
            };
            t.prototype.getOrigin = function() {
                return k(If(this.sp), m)
            };
            t.prototype.getRotation = function() {
                return k(Jf(this.sp), D)
            };
            t.prototype.getBasis = function() {
                return k(Kf(this.sp), Xr)
            };
            t.prototype.setFromOpenGLMatrix = function(b) {
                var c = this.sp;
                Er();
                "object" == typeof b && (b = Fr(b));
                Lf(c, b)
            };
            t.prototype.inverse = t.prototype.inverse = function() {
                return k(Mf(this.sp), t)
            };
            t.prototype.op_mul = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Nf(c, b), t)
            };
            t.prototype.__destroy__ = function() {
                Of(this.sp)
            };

            function Yr() {
                this.sp = Pf();
                h(Yr)[this.sp] = this
            }
            Yr.prototype = Object.create(Lr.prototype);
            Yr.prototype.constructor = Yr;
            Yr.prototype.tp = Yr;
            Yr.up = {};
            a.MotionState = Yr;
            Yr.prototype.getWorldTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Qf(c, b)
            };
            Yr.prototype.setWorldTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Rf(c, b)
            };
            Yr.prototype.__destroy__ = function() {
                Sf(this.sp)
            };

            function E(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = void 0 === b ? Tf() : void 0 === c ? Uf(b) : Vf(b, c);
                h(E)[this.sp] = this
            }
            E.prototype = Object.create(Lr.prototype);
            E.prototype.constructor = E;
            E.prototype.tp = E;
            E.up = {};
            a.btDefaultMotionState = E;
            E.prototype.getWorldTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Wf(c, b)
            };
            E.prototype.setWorldTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Xf(c, b)
            };
            E.prototype.get_m_graphicsWorldTrans = E.prototype.lq = function() {
                return k(Yf(this.sp), t)
            };
            E.prototype.set_m_graphicsWorldTrans = E.prototype.yr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Zf(c, b)
            };
            Object.defineProperty(E.prototype, "m_graphicsWorldTrans", {
                get: E.prototype.lq,
                set: E.prototype.yr
            });
            E.prototype.__destroy__ = function() {
                $f(this.sp)
            };

            function Zr() {
                throw "cannot construct a btCollisionObjectWrapper, no constructor in IDL";
            }
            Zr.prototype = Object.create(f.prototype);
            Zr.prototype.constructor = Zr;
            Zr.prototype.tp = Zr;
            Zr.up = {};
            a.btCollisionObjectWrapper = Zr;
            Zr.prototype.getWorldTransform = function() {
                return k(ag(this.sp), t)
            };
            Zr.prototype.getCollisionObject = function() {
                return k(bg(this.sp), r)
            };
            Zr.prototype.getCollisionShape = function() {
                return k(cg(this.sp), l)
            };

            function F(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = dg(b, c);
                h(F)[this.sp] = this
            }
            F.prototype = Object.create(v.prototype);
            F.prototype.constructor = F;
            F.prototype.tp = F;
            F.up = {};
            a.ClosestRayResultCallback = F;
            F.prototype.hasHit = function() {
                return !!eg(this.sp)
            };
            F.prototype.get_m_rayFromWorld = F.prototype.Kp = function() {
                return k(fg(this.sp), m)
            };
            F.prototype.set_m_rayFromWorld = F.prototype.Np = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                gg(c, b)
            };
            Object.defineProperty(F.prototype, "m_rayFromWorld", {
                get: F.prototype.Kp,
                set: F.prototype.Np
            });
            F.prototype.get_m_rayToWorld = F.prototype.Lp = function() {
                return k(hg(this.sp), m)
            };
            F.prototype.set_m_rayToWorld = F.prototype.Op = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ig(c, b)
            };
            Object.defineProperty(F.prototype, "m_rayToWorld", {
                get: F.prototype.Lp,
                set: F.prototype.Op
            });
            F.prototype.get_m_hitNormalWorld = F.prototype.Dp = function() {
                return k(jg(this.sp), m)
            };
            F.prototype.set_m_hitNormalWorld = F.prototype.Hp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                kg(c, b)
            };
            Object.defineProperty(F.prototype, "m_hitNormalWorld", {
                get: F.prototype.Dp,
                set: F.prototype.Hp
            });
            F.prototype.get_m_hitPointWorld = F.prototype.Ep = function() {
                return k(lg(this.sp), m)
            };
            F.prototype.set_m_hitPointWorld = F.prototype.Ip = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                mg(c, b)
            };
            Object.defineProperty(F.prototype, "m_hitPointWorld", {
                get: F.prototype.Ep,
                set: F.prototype.Ip
            });
            F.prototype.get_m_collisionFilterGroup = F.prototype.vp = function() {
                return ng(this.sp)
            };
            F.prototype.set_m_collisionFilterGroup = F.prototype.xp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                og(c, b)
            };
            Object.defineProperty(F.prototype, "m_collisionFilterGroup", {
                get: F.prototype.vp,
                set: F.prototype.xp
            });
            F.prototype.get_m_collisionFilterMask = F.prototype.wp = function() {
                return pg(this.sp)
            };
            F.prototype.set_m_collisionFilterMask = F.prototype.yp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                qg(c, b)
            };
            Object.defineProperty(F.prototype, "m_collisionFilterMask", {
                get: F.prototype.wp,
                set: F.prototype.yp
            });
            F.prototype.get_m_closestHitFraction = F.prototype.zp = function() {
                return rg(this.sp)
            };
            F.prototype.set_m_closestHitFraction = F.prototype.Ap = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                sg(c, b)
            };
            Object.defineProperty(F.prototype, "m_closestHitFraction", {
                get: F.prototype.zp,
                set: F.prototype.Ap
            });
            F.prototype.get_m_collisionObject = F.prototype.Bp = function() {
                return k(tg(this.sp), r)
            };
            F.prototype.set_m_collisionObject = F.prototype.Fp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ug(c, b)
            };
            Object.defineProperty(F.prototype, "m_collisionObject", {
                get: F.prototype.Bp,
                set: F.prototype.Fp
            });
            F.prototype.get_m_flags = F.prototype.Cp = function() {
                return vg(this.sp)
            };
            F.prototype.set_m_flags = F.prototype.Gp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                wg(c, b)
            };
            Object.defineProperty(F.prototype, "m_flags", {
                get: F.prototype.Cp,
                set: F.prototype.Gp
            });
            F.prototype.__destroy__ = function() {
                xg(this.sp)
            };

            function $r() {
                throw "cannot construct a btConstCollisionObjectArray, no constructor in IDL";
            }
            $r.prototype = Object.create(f.prototype);
            $r.prototype.constructor = $r;
            $r.prototype.tp = $r;
            $r.up = {};
            a.btConstCollisionObjectArray = $r;
            $r.prototype.size = $r.prototype.size = function() {
                return yg(this.sp)
            };
            $r.prototype.at = $r.prototype.at = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(zg(c, b), r)
            };
            $r.prototype.__destroy__ = function() {
                Ag(this.sp)
            };

            function as() {
                throw "cannot construct a btScalarArray, no constructor in IDL";
            }
            as.prototype = Object.create(f.prototype);
            as.prototype.constructor = as;
            as.prototype.tp = as;
            as.up = {};
            a.btScalarArray = as;
            as.prototype.size = as.prototype.size = function() {
                return Bg(this.sp)
            };
            as.prototype.at = as.prototype.at = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return Cg(c, b)
            };
            as.prototype.__destroy__ = function() {
                Dg(this.sp)
            };

            function G(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = Eg(b, c);
                h(G)[this.sp] = this
            }
            G.prototype = Object.create(v.prototype);
            G.prototype.constructor = G;
            G.prototype.tp = G;
            G.up = {};
            a.AllHitsRayResultCallback = G;
            G.prototype.hasHit = function() {
                return !!Fg(this.sp)
            };
            G.prototype.get_m_collisionObjects = G.prototype.Zp = function() {
                return k(Gg(this.sp), $r)
            };
            G.prototype.set_m_collisionObjects = G.prototype.lr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Hg(c, b)
            };
            Object.defineProperty(G.prototype, "m_collisionObjects", {
                get: G.prototype.Zp,
                set: G.prototype.lr
            });
            G.prototype.get_m_rayFromWorld = G.prototype.Kp = function() {
                return k(Ig(this.sp), m)
            };
            G.prototype.set_m_rayFromWorld = G.prototype.Np = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Jg(c, b)
            };
            Object.defineProperty(G.prototype, "m_rayFromWorld", {
                get: G.prototype.Kp,
                set: G.prototype.Np
            });
            G.prototype.get_m_rayToWorld = G.prototype.Lp = function() {
                return k(Kg(this.sp), m)
            };
            G.prototype.set_m_rayToWorld = G.prototype.Op = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Lg(c, b)
            };
            Object.defineProperty(G.prototype, "m_rayToWorld", {
                get: G.prototype.Lp,
                set: G.prototype.Op
            });
            G.prototype.get_m_hitNormalWorld = G.prototype.Dp = function() {
                return k(Mg(this.sp), bs)
            };
            G.prototype.set_m_hitNormalWorld = G.prototype.Hp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Ng(c, b)
            };
            Object.defineProperty(G.prototype, "m_hitNormalWorld", {
                get: G.prototype.Dp,
                set: G.prototype.Hp
            });
            G.prototype.get_m_hitPointWorld = G.prototype.Ep = function() {
                return k(Og(this.sp), bs)
            };
            G.prototype.set_m_hitPointWorld = G.prototype.Ip = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Pg(c, b)
            };
            Object.defineProperty(G.prototype, "m_hitPointWorld", {
                get: G.prototype.Ep,
                set: G.prototype.Ip
            });
            G.prototype.get_m_hitFractions = G.prototype.nq = function() {
                return k(Qg(this.sp), as)
            };
            G.prototype.set_m_hitFractions = G.prototype.Ar = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Rg(c, b)
            };
            Object.defineProperty(G.prototype, "m_hitFractions", {
                get: G.prototype.nq,
                set: G.prototype.Ar
            });
            G.prototype.get_m_collisionFilterGroup = G.prototype.vp = function() {
                return Sg(this.sp)
            };
            G.prototype.set_m_collisionFilterGroup = G.prototype.xp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Tg(c, b)
            };
            Object.defineProperty(G.prototype, "m_collisionFilterGroup", {
                get: G.prototype.vp,
                set: G.prototype.xp
            });
            G.prototype.get_m_collisionFilterMask = G.prototype.wp = function() {
                return Ug(this.sp)
            };
            G.prototype.set_m_collisionFilterMask = G.prototype.yp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Vg(c, b)
            };
            Object.defineProperty(G.prototype, "m_collisionFilterMask", {
                get: G.prototype.wp,
                set: G.prototype.yp
            });
            G.prototype.get_m_closestHitFraction = G.prototype.zp = function() {
                return Wg(this.sp)
            };
            G.prototype.set_m_closestHitFraction = G.prototype.Ap = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Xg(c, b)
            };
            Object.defineProperty(G.prototype, "m_closestHitFraction", {
                get: G.prototype.zp,
                set: G.prototype.Ap
            });
            G.prototype.get_m_collisionObject = G.prototype.Bp = function() {
                return k(Yg(this.sp), r)
            };
            G.prototype.set_m_collisionObject = G.prototype.Fp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Zg(c, b)
            };
            Object.defineProperty(G.prototype, "m_collisionObject", {
                get: G.prototype.Bp,
                set: G.prototype.Fp
            });
            G.prototype.get_m_flags = G.prototype.Cp = function() {
                return $g(this.sp)
            };
            G.prototype.set_m_flags = G.prototype.Gp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ah(c, b)
            };
            Object.defineProperty(G.prototype, "m_flags", {
                get: G.prototype.Cp,
                set: G.prototype.Gp
            });
            G.prototype.__destroy__ = function() {
                bh(this.sp)
            };

            function I() {
                throw "cannot construct a btManifoldPoint, no constructor in IDL";
            }
            I.prototype = Object.create(f.prototype);
            I.prototype.constructor = I;
            I.prototype.tp = I;
            I.up = {};
            a.btManifoldPoint = I;
            I.prototype.getPositionWorldOnA = function() {
                return k(ch(this.sp), m)
            };
            I.prototype.getPositionWorldOnB = function() {
                return k(dh(this.sp), m)
            };
            I.prototype.getAppliedImpulse = function() {
                return eh(this.sp)
            };
            I.prototype.getDistance = function() {
                return fh(this.sp)
            };
            I.prototype.get_m_localPointA = I.prototype.uq = function() {
                return k(gh(this.sp), m)
            };
            I.prototype.set_m_localPointA = I.prototype.Hr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                hh(c, b)
            };
            Object.defineProperty(I.prototype, "m_localPointA", {
                get: I.prototype.uq,
                set: I.prototype.Hr
            });
            I.prototype.get_m_localPointB = I.prototype.vq = function() {
                return k(ih(this.sp), m)
            };
            I.prototype.set_m_localPointB = I.prototype.Ir = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                jh(c, b)
            };
            Object.defineProperty(I.prototype, "m_localPointB", {
                get: I.prototype.vq,
                set: I.prototype.Ir
            });
            I.prototype.get_m_positionWorldOnB = I.prototype.Hq = function() {
                return k(kh(this.sp), m)
            };
            I.prototype.set_m_positionWorldOnB = I.prototype.Ur = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                lh(c, b)
            };
            Object.defineProperty(I.prototype, "m_positionWorldOnB", {
                get: I.prototype.Hq,
                set: I.prototype.Ur
            });
            I.prototype.get_m_positionWorldOnA = I.prototype.Gq = function() {
                return k(mh(this.sp), m)
            };
            I.prototype.set_m_positionWorldOnA = I.prototype.Tr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                nh(c, b)
            };
            Object.defineProperty(I.prototype, "m_positionWorldOnA", {
                get: I.prototype.Gq,
                set: I.prototype.Tr
            });
            I.prototype.get_m_normalWorldOnB = I.prototype.Bq = function() {
                return k(oh(this.sp), m)
            };
            I.prototype.set_m_normalWorldOnB = I.prototype.Or = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ph(c, b)
            };
            Object.defineProperty(I.prototype, "m_normalWorldOnB", {
                get: I.prototype.Bq,
                set: I.prototype.Or
            });
            I.prototype.get_m_userPersistentData = I.prototype.Wq = function() {
                return qh(this.sp)
            };
            I.prototype.set_m_userPersistentData = I.prototype.ls = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                rh(c, b)
            };
            Object.defineProperty(I.prototype, "m_userPersistentData", {
                get: I.prototype.Wq,
                set: I.prototype.ls
            });
            I.prototype.__destroy__ = function() {
                sh(this.sp)
            };

            function cs() {
                this.sp = th();
                h(cs)[this.sp] = this
            }
            cs.prototype = Object.create(Nr.prototype);
            cs.prototype.constructor = cs;
            cs.prototype.tp = cs;
            cs.up = {};
            a.ConcreteContactResultCallback = cs;
            cs.prototype.addSingleResult = function(b, c, d, e, g, B, H) {
                var Oa = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                g && "object" === typeof g && (g = g.sp);
                B && "object" === typeof B && (B = B.sp);
                H && "object" === typeof H && (H = H.sp);
                return uh(Oa, b, c, d, e, g, B, H)
            };
            cs.prototype.__destroy__ = function() {
                vh(this.sp)
            };

            function J() {
                throw "cannot construct a LocalShapeInfo, no constructor in IDL";
            }
            J.prototype = Object.create(f.prototype);
            J.prototype.constructor = J;
            J.prototype.tp = J;
            J.up = {};
            a.LocalShapeInfo = J;
            J.prototype.get_m_shapePart = J.prototype.Lq = function() {
                return wh(this.sp)
            };
            J.prototype.set_m_shapePart = J.prototype.Yr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                xh(c, b)
            };
            Object.defineProperty(J.prototype, "m_shapePart", {
                get: J.prototype.Lq,
                set: J.prototype.Yr
            });
            J.prototype.get_m_triangleIndex = J.prototype.Sq = function() {
                return yh(this.sp)
            };
            J.prototype.set_m_triangleIndex = J.prototype.gs = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                zh(c, b)
            };
            Object.defineProperty(J.prototype, "m_triangleIndex", {
                get: J.prototype.Sq,
                set: J.prototype.gs
            });
            J.prototype.__destroy__ = function() {
                Ah(this.sp)
            };

            function K(b, c, d, e, g) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                g && "object" === typeof g && (g = g.sp);
                this.sp = Bh(b, c, d, e, g);
                h(K)[this.sp] = this
            }
            K.prototype = Object.create(f.prototype);
            K.prototype.constructor = K;
            K.prototype.tp = K;
            K.up = {};
            a.LocalConvexResult = K;
            K.prototype.get_m_hitCollisionObject = K.prototype.Jp = function() {
                return k(Ch(this.sp), r)
            };
            K.prototype.set_m_hitCollisionObject = K.prototype.Mp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Dh(c, b)
            };
            Object.defineProperty(K.prototype, "m_hitCollisionObject", {
                get: K.prototype.Jp,
                set: K.prototype.Mp
            });
            K.prototype.get_m_localShapeInfo = K.prototype.wq = function() {
                return k(Eh(this.sp), J)
            };
            K.prototype.set_m_localShapeInfo = K.prototype.Jr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Fh(c, b)
            };
            Object.defineProperty(K.prototype, "m_localShapeInfo", {
                get: K.prototype.wq,
                set: K.prototype.Jr
            });
            K.prototype.get_m_hitNormalLocal = K.prototype.oq = function() {
                return k(Gh(this.sp), m)
            };
            K.prototype.set_m_hitNormalLocal = K.prototype.Br = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Hh(c, b)
            };
            Object.defineProperty(K.prototype, "m_hitNormalLocal", {
                get: K.prototype.oq,
                set: K.prototype.Br
            });
            K.prototype.get_m_hitPointLocal = K.prototype.pq = function() {
                return k(Ih(this.sp), m)
            };
            K.prototype.set_m_hitPointLocal = K.prototype.Cr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Jh(c, b)
            };
            Object.defineProperty(K.prototype, "m_hitPointLocal", {
                get: K.prototype.pq,
                set: K.prototype.Cr
            });
            K.prototype.get_m_hitFraction = K.prototype.mq = function() {
                return Kh(this.sp)
            };
            K.prototype.set_m_hitFraction = K.prototype.zr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Lh(c, b)
            };
            Object.defineProperty(K.prototype, "m_hitFraction", {
                get: K.prototype.mq,
                set: K.prototype.zr
            });
            K.prototype.__destroy__ = function() {
                Mh(this.sp)
            };

            function L(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = Nh(b, c);
                h(L)[this.sp] = this
            }
            L.prototype = Object.create(w.prototype);
            L.prototype.constructor = L;
            L.prototype.tp = L;
            L.up = {};
            a.ClosestConvexResultCallback = L;
            L.prototype.hasHit = function() {
                return !!Oh(this.sp)
            };
            L.prototype.get_m_hitCollisionObject = L.prototype.Jp = function() {
                return k(Ph(this.sp), r)
            };
            L.prototype.set_m_hitCollisionObject = L.prototype.Mp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Qh(c, b)
            };
            Object.defineProperty(L.prototype, "m_hitCollisionObject", {
                get: L.prototype.Jp,
                set: L.prototype.Mp
            });
            L.prototype.get_m_convexFromWorld = L.prototype.bq = function() {
                return k(Rh(this.sp), m)
            };
            L.prototype.set_m_convexFromWorld = L.prototype.pr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Sh(c, b)
            };
            Object.defineProperty(L.prototype, "m_convexFromWorld", {
                get: L.prototype.bq,
                set: L.prototype.pr
            });
            L.prototype.get_m_convexToWorld = L.prototype.cq = function() {
                return k(Th(this.sp), m)
            };
            L.prototype.set_m_convexToWorld = L.prototype.qr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Uh(c, b)
            };
            Object.defineProperty(L.prototype, "m_convexToWorld", {
                get: L.prototype.cq,
                set: L.prototype.qr
            });
            L.prototype.get_m_hitNormalWorld = L.prototype.Dp = function() {
                return k(Vh(this.sp), m)
            };
            L.prototype.set_m_hitNormalWorld = L.prototype.Hp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Wh(c, b)
            };
            Object.defineProperty(L.prototype, "m_hitNormalWorld", {
                get: L.prototype.Dp,
                set: L.prototype.Hp
            });
            L.prototype.get_m_hitPointWorld = L.prototype.Ep = function() {
                return k(Xh(this.sp), m)
            };
            L.prototype.set_m_hitPointWorld = L.prototype.Ip = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Yh(c, b)
            };
            Object.defineProperty(L.prototype, "m_hitPointWorld", {
                get: L.prototype.Ep,
                set: L.prototype.Ip
            });
            L.prototype.get_m_collisionFilterGroup = L.prototype.vp = function() {
                return Zh(this.sp)
            };
            L.prototype.set_m_collisionFilterGroup = L.prototype.xp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                $h(c, b)
            };
            Object.defineProperty(L.prototype, "m_collisionFilterGroup", {
                get: L.prototype.vp,
                set: L.prototype.xp
            });
            L.prototype.get_m_collisionFilterMask = L.prototype.wp = function() {
                return ai(this.sp)
            };
            L.prototype.set_m_collisionFilterMask = L.prototype.yp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                bi(c, b)
            };
            Object.defineProperty(L.prototype, "m_collisionFilterMask", {
                get: L.prototype.wp,
                set: L.prototype.yp
            });
            L.prototype.get_m_closestHitFraction = L.prototype.zp = function() {
                return ci(this.sp)
            };
            L.prototype.set_m_closestHitFraction = L.prototype.Ap = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                di(c, b)
            };
            Object.defineProperty(L.prototype, "m_closestHitFraction", {
                get: L.prototype.zp,
                set: L.prototype.Ap
            });
            L.prototype.__destroy__ = function() {
                ei(this.sp)
            };

            function ds(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = void 0 === c ? fi(b) : gi(b, c);
                h(ds)[this.sp] = this
            }
            ds.prototype = Object.create(Or.prototype);
            ds.prototype.constructor = ds;
            ds.prototype.tp = ds;
            ds.up = {};
            a.btConvexTriangleMeshShape = ds;
            ds.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                hi(c, b)
            };
            ds.prototype.getLocalScaling = function() {
                return k(ii(this.sp), m)
            };
            ds.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                ji(d, b, c)
            };
            ds.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ki(c, b)
            };
            ds.prototype.getMargin = function() {
                return li(this.sp)
            };
            ds.prototype.__destroy__ = function() {
                mi(this.sp)
            };

            function es(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = ni(b);
                h(es)[this.sp] = this
            }
            es.prototype = Object.create(l.prototype);
            es.prototype.constructor = es;
            es.prototype.tp = es;
            es.up = {};
            a.btBoxShape = es;
            es.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                oi(c, b)
            };
            es.prototype.getMargin = function() {
                return pi(this.sp)
            };
            es.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                qi(c, b)
            };
            es.prototype.getLocalScaling = function() {
                return k(ri(this.sp), m)
            };
            es.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                si(d, b, c)
            };
            es.prototype.__destroy__ = function() {
                ti(this.sp)
            };

            function gs(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = ui(b, c);
                h(gs)[this.sp] = this
            }
            gs.prototype = Object.create(x.prototype);
            gs.prototype.constructor = gs;
            gs.prototype.tp = gs;
            gs.up = {};
            a.btCapsuleShapeX = gs;
            gs.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                vi(c, b)
            };
            gs.prototype.getMargin = function() {
                return wi(this.sp)
            };
            gs.prototype.getUpAxis = function() {
                return xi(this.sp)
            };
            gs.prototype.getRadius = function() {
                return yi(this.sp)
            };
            gs.prototype.getHalfHeight = function() {
                return zi(this.sp)
            };
            gs.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Ai(c, b)
            };
            gs.prototype.getLocalScaling = function() {
                return k(Bi(this.sp), m)
            };
            gs.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Ci(d, b, c)
            };
            gs.prototype.__destroy__ = function() {
                Di(this.sp)
            };

            function hs(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = Ei(b, c);
                h(hs)[this.sp] = this
            }
            hs.prototype = Object.create(x.prototype);
            hs.prototype.constructor = hs;
            hs.prototype.tp = hs;
            hs.up = {};
            a.btCapsuleShapeZ = hs;
            hs.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Fi(c, b)
            };
            hs.prototype.getMargin = function() {
                return Gi(this.sp)
            };
            hs.prototype.getUpAxis = function() {
                return Hi(this.sp)
            };
            hs.prototype.getRadius = function() {
                return Ii(this.sp)
            };
            hs.prototype.getHalfHeight = function() {
                return Ji(this.sp)
            };
            hs.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Ki(c, b)
            };
            hs.prototype.getLocalScaling = function() {
                return k(Li(this.sp), m)
            };
            hs.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Mi(d, b, c)
            };
            hs.prototype.__destroy__ = function() {
                Ni(this.sp)
            };

            function is(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = Oi(b);
                h(is)[this.sp] = this
            }
            is.prototype = Object.create(Pr.prototype);
            is.prototype.constructor = is;
            is.prototype.tp = is;
            is.up = {};
            a.btCylinderShapeX = is;
            is.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Pi(c, b)
            };
            is.prototype.getMargin = function() {
                return Qi(this.sp)
            };
            is.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Ri(c, b)
            };
            is.prototype.getLocalScaling = function() {
                return k(Si(this.sp), m)
            };
            is.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Ti(d, b, c)
            };
            is.prototype.__destroy__ = function() {
                Ui(this.sp)
            };

            function js(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = Vi(b);
                h(js)[this.sp] = this
            }
            js.prototype = Object.create(Pr.prototype);
            js.prototype.constructor = js;
            js.prototype.tp = js;
            js.up = {};
            a.btCylinderShapeZ = js;
            js.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Wi(c, b)
            };
            js.prototype.getMargin = function() {
                return Xi(this.sp)
            };
            js.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Yi(c, b)
            };
            js.prototype.getLocalScaling = function() {
                return k(Zi(this.sp), m)
            };
            js.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                $i(d, b, c)
            };
            js.prototype.__destroy__ = function() {
                aj(this.sp)
            };

            function ks(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = bj(b);
                h(ks)[this.sp] = this
            }
            ks.prototype = Object.create(l.prototype);
            ks.prototype.constructor = ks;
            ks.prototype.tp = ks;
            ks.up = {};
            a.btSphereShape = ks;
            ks.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                cj(c, b)
            };
            ks.prototype.getMargin = function() {
                return dj(this.sp)
            };
            ks.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ej(c, b)
            };
            ks.prototype.getLocalScaling = function() {
                return k(fj(this.sp), m)
            };
            ks.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                gj(d, b, c)
            };
            ks.prototype.__destroy__ = function() {
                hj(this.sp)
            };

            function ls(b, c, d) {
                Er();
                b && "object" === typeof b && (b = b.sp);
                "object" == typeof c && (c = Fr(c));
                d && "object" === typeof d && (d = d.sp);
                this.sp = ij(b, c, d);
                h(ls)[this.sp] = this
            }
            ls.prototype = Object.create(l.prototype);
            ls.prototype.constructor = ls;
            ls.prototype.tp = ls;
            ls.up = {};
            a.btMultiSphereShape = ls;
            ls.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                jj(c, b)
            };
            ls.prototype.getLocalScaling = function() {
                return k(kj(this.sp), m)
            };
            ls.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                lj(d, b, c)
            };
            ls.prototype.__destroy__ = function() {
                mj(this.sp)
            };

            function ms(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = nj(b, c);
                h(ms)[this.sp] = this
            }
            ms.prototype = Object.create(Qr.prototype);
            ms.prototype.constructor = ms;
            ms.prototype.tp = ms;
            ms.up = {};
            a.btConeShapeX = ms;
            ms.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                oj(c, b)
            };
            ms.prototype.getLocalScaling = function() {
                return k(pj(this.sp), m)
            };
            ms.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                qj(d, b, c)
            };
            ms.prototype.__destroy__ = function() {
                rj(this.sp)
            };

            function ns(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = sj(b, c);
                h(ns)[this.sp] = this
            }
            ns.prototype = Object.create(Qr.prototype);
            ns.prototype.constructor = ns;
            ns.prototype.tp = ns;
            ns.up = {};
            a.btConeShapeZ = ns;
            ns.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                tj(c, b)
            };
            ns.prototype.getLocalScaling = function() {
                return k(uj(this.sp), m)
            };
            ns.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                vj(d, b, c)
            };
            ns.prototype.__destroy__ = function() {
                wj(this.sp)
            };

            function ps() {
                throw "cannot construct a btIntArray, no constructor in IDL";
            }
            ps.prototype = Object.create(f.prototype);
            ps.prototype.constructor = ps;
            ps.prototype.tp = ps;
            ps.up = {};
            a.btIntArray = ps;
            ps.prototype.size = ps.prototype.size = function() {
                return xj(this.sp)
            };
            ps.prototype.at = ps.prototype.at = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return yj(c, b)
            };
            ps.prototype.__destroy__ = function() {
                zj(this.sp)
            };

            function M() {
                throw "cannot construct a btFace, no constructor in IDL";
            }
            M.prototype = Object.create(f.prototype);
            M.prototype.constructor = M;
            M.prototype.tp = M;
            M.up = {};
            a.btFace = M;
            M.prototype.get_m_indices = M.prototype.rq = function() {
                return k(Aj(this.sp), ps)
            };
            M.prototype.set_m_indices = M.prototype.Er = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Bj(c, b)
            };
            Object.defineProperty(M.prototype, "m_indices", {
                get: M.prototype.rq,
                set: M.prototype.Er
            });
            M.prototype.get_m_plane = M.prototype.Fq = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return Cj(c, b)
            };
            M.prototype.set_m_plane = M.prototype.Sr = function(b, c) {
                var d = this.sp;
                Er();
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Dj(d, b, c)
            };
            Object.defineProperty(M.prototype, "m_plane", {
                get: M.prototype.Fq,
                set: M.prototype.Sr
            });
            M.prototype.__destroy__ = function() {
                Ej(this.sp)
            };

            function bs() {
                throw "cannot construct a btVector3Array, no constructor in IDL";
            }
            bs.prototype = Object.create(f.prototype);
            bs.prototype.constructor = bs;
            bs.prototype.tp = bs;
            bs.up = {};
            a.btVector3Array = bs;
            bs.prototype.size = bs.prototype.size = function() {
                return Fj(this.sp)
            };
            bs.prototype.at = bs.prototype.at = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Gj(c, b), m)
            };
            bs.prototype.__destroy__ = function() {
                Hj(this.sp)
            };

            function qs() {
                throw "cannot construct a btFaceArray, no constructor in IDL";
            }
            qs.prototype = Object.create(f.prototype);
            qs.prototype.constructor = qs;
            qs.prototype.tp = qs;
            qs.up = {};
            a.btFaceArray = qs;
            qs.prototype.size = qs.prototype.size = function() {
                return Ij(this.sp)
            };
            qs.prototype.at = qs.prototype.at = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Jj(c, b), M)
            };
            qs.prototype.__destroy__ = function() {
                Kj(this.sp)
            };

            function N() {
                throw "cannot construct a btConvexPolyhedron, no constructor in IDL";
            }
            N.prototype = Object.create(f.prototype);
            N.prototype.constructor = N;
            N.prototype.tp = N;
            N.up = {};
            a.btConvexPolyhedron = N;
            N.prototype.get_m_vertices = N.prototype.Xq = function() {
                return k(Lj(this.sp), bs)
            };
            N.prototype.set_m_vertices = N.prototype.ms = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Mj(c, b)
            };
            Object.defineProperty(N.prototype, "m_vertices", {
                get: N.prototype.Xq,
                set: N.prototype.ms
            });
            N.prototype.get_m_faces = N.prototype.jq = function() {
                return k(Nj(this.sp), qs)
            };
            N.prototype.set_m_faces = N.prototype.wr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Oj(c, b)
            };
            Object.defineProperty(N.prototype, "m_faces", {
                get: N.prototype.jq,
                set: N.prototype.wr
            });
            N.prototype.__destroy__ = function() {
                Pj(this.sp)
            };

            function O(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = void 0 === b ? Qj() : Rj(b);
                h(O)[this.sp] = this
            }
            O.prototype = Object.create(l.prototype);
            O.prototype.constructor = O;
            O.prototype.tp = O;
            O.up = {};
            a.btCompoundShape = O;
            O.prototype.addChildShape = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Sj(d, b, c)
            };
            O.prototype.removeChildShape = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Tj(c, b)
            };
            O.prototype.removeChildShapeByIndex = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Uj(c, b)
            };
            O.prototype.getNumChildShapes = function() {
                return Vj(this.sp)
            };
            O.prototype.getChildShape = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Wj(c, b), l)
            };
            O.prototype.updateChildTransform = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                void 0 === d ? Xj(e, b, c) : Yj(e, b, c, d)
            };
            O.prototype.setMargin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Zj(c, b)
            };
            O.prototype.getMargin = function() {
                return ak(this.sp)
            };
            O.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                bk(c, b)
            };
            O.prototype.getLocalScaling = function() {
                return k(ck(this.sp), m)
            };
            O.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                dk(d, b, c)
            };
            O.prototype.__destroy__ = function() {
                ek(this.sp)
            };

            function rs() {
                throw "cannot construct a btIndexedMesh, no constructor in IDL";
            }
            rs.prototype = Object.create(f.prototype);
            rs.prototype.constructor = rs;
            rs.prototype.tp = rs;
            rs.up = {};
            a.btIndexedMesh = rs;
            rs.prototype.get_m_numTriangles = rs.prototype.Dq = function() {
                return fk(this.sp)
            };
            rs.prototype.set_m_numTriangles = rs.prototype.Qr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                gk(c, b)
            };
            Object.defineProperty(rs.prototype, "m_numTriangles", {
                get: rs.prototype.Dq,
                set: rs.prototype.Qr
            });
            rs.prototype.__destroy__ = function() {
                hk(this.sp)
            };

            function ss() {
                throw "cannot construct a btIndexedMeshArray, no constructor in IDL";
            }
            ss.prototype = Object.create(f.prototype);
            ss.prototype.constructor = ss;
            ss.prototype.tp = ss;
            ss.up = {};
            a.btIndexedMeshArray = ss;
            ss.prototype.size = ss.prototype.size = function() {
                return ik(this.sp)
            };
            ss.prototype.at = ss.prototype.at = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(jk(c, b), rs)
            };
            ss.prototype.__destroy__ = function() {
                kk(this.sp)
            };

            function ts(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = void 0 === b ? lk() : void 0 === c ? mk(b) : nk(b, c);
                h(ts)[this.sp] = this
            }
            ts.prototype = Object.create(Rr.prototype);
            ts.prototype.constructor = ts;
            ts.prototype.tp = ts;
            ts.up = {};
            a.btTriangleMesh = ts;
            ts.prototype.addTriangle = function(b, c, d, e) {
                var g = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                void 0 === e ? ok(g, b, c, d) : pk(g, b, c, d, e)
            };
            ts.prototype.findOrAddVertex = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                return qk(d, b, c)
            };
            ts.prototype.addIndex = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                rk(c, b)
            };
            ts.prototype.getIndexedMeshArray = function() {
                return k(sk(this.sp), ss)
            };
            ts.prototype.setScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                tk(c, b)
            };
            ts.prototype.__destroy__ = function() {
                uk(this.sp)
            };

            function us() {
                this.sp = vk();
                h(us)[this.sp] = this
            }
            us.prototype = Object.create(Gr.prototype);
            us.prototype.constructor = us;
            us.prototype.tp = us;
            us.up = {};
            a.btEmptyShape = us;
            us.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                wk(c, b)
            };
            us.prototype.getLocalScaling = function() {
                return k(xk(this.sp), m)
            };
            us.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                yk(d, b, c)
            };
            us.prototype.__destroy__ = function() {
                zk(this.sp)
            };

            function vs(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = Ak(b, c);
                h(vs)[this.sp] = this
            }
            vs.prototype = Object.create(Gr.prototype);
            vs.prototype.constructor = vs;
            vs.prototype.tp = vs;
            vs.up = {};
            a.btStaticPlaneShape = vs;
            vs.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Bk(c, b)
            };
            vs.prototype.getLocalScaling = function() {
                return k(Ck(this.sp), m)
            };
            vs.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Dk(d, b, c)
            };
            vs.prototype.__destroy__ = function() {
                Ek(this.sp)
            };

            function xs(b, c, d) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                this.sp = void 0 === d ? Fk(b, c) : Gk(b, c, d);
                h(xs)[this.sp] = this
            }
            xs.prototype = Object.create(Sr.prototype);
            xs.prototype.constructor = xs;
            xs.prototype.tp = xs;
            xs.up = {};
            a.btBvhTriangleMeshShape = xs;
            xs.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Hk(c, b)
            };
            xs.prototype.getLocalScaling = function() {
                return k(Ik(this.sp), m)
            };
            xs.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Jk(d, b, c)
            };
            xs.prototype.__destroy__ = function() {
                Kk(this.sp)
            };

            function ys(b, c, d, e) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                this.sp = Lk(b, c, d, e);
                h(ys)[this.sp] = this
            }
            ys.prototype = Object.create(f.prototype);
            ys.prototype.constructor = ys;
            ys.prototype.tp = ys;
            ys.up = {};
            a.btAABB = ys;
            ys.prototype.invalidate = function() {
                Mk(this.sp)
            };
            ys.prototype.increment_margin = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Nk(c, b)
            };
            ys.prototype.copy_with_margin = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Ok(d, b, c)
            };
            ys.prototype.__destroy__ = function() {
                Pk(this.sp)
            };

            function zs() {
                this.sp = Qk();
                h(zs)[this.sp] = this
            }
            zs.prototype = Object.create(f.prototype);
            zs.prototype.constructor = zs;
            zs.prototype.tp = zs;
            zs.up = {};
            a.btPrimitiveTriangle = zs;
            zs.prototype.__destroy__ = function() {
                Rk(this.sp)
            };

            function As(b, c, d) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                this.sp = Sk(b, c, d);
                h(As)[this.sp] = this
            }
            As.prototype = Object.create(f.prototype);
            As.prototype.constructor = As;
            As.prototype.tp = As;
            As.up = {};
            a.btTriangleShapeEx = As;
            As.prototype.getAabb = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                Tk(e, b, c, d)
            };
            As.prototype.applyTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Uk(c, b)
            };
            As.prototype.buildTriPlane = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Vk(c, b)
            };
            As.prototype.__destroy__ = function() {
                Wk(this.sp)
            };

            function Bs() {
                this.sp = Xk();
                h(Bs)[this.sp] = this
            }
            Bs.prototype = Object.create(f.prototype);
            Bs.prototype.constructor = Bs;
            Bs.prototype.tp = Bs;
            Bs.up = {};
            a.btTetrahedronShapeEx = Bs;
            Bs.prototype.setVertices = function(b, c, d, e) {
                var g = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                Yk(g, b, c, d, e)
            };
            Bs.prototype.__destroy__ = function() {
                Zk(this.sp)
            };

            function P() {
                throw "cannot construct a CompoundPrimitiveManager, no constructor in IDL";
            }
            P.prototype = Object.create(Tr.prototype);
            P.prototype.constructor = P;
            P.prototype.tp = P;
            P.up = {};
            a.CompoundPrimitiveManager = P;
            P.prototype.get_primitive_count = function() {
                return $k(this.sp)
            };
            P.prototype.get_primitive_box = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                al(d, b, c)
            };
            P.prototype.get_primitive_triangle = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                bl(d, b, c)
            };
            P.prototype.is_trimesh = function() {
                return !!cl(this.sp)
            };
            P.prototype.get_m_compoundShape = P.prototype.$p = function() {
                return k(dl(this.sp), Q)
            };
            P.prototype.set_m_compoundShape = P.prototype.mr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                el(c, b)
            };
            Object.defineProperty(P.prototype, "m_compoundShape", {
                get: P.prototype.$p,
                set: P.prototype.mr
            });
            P.prototype.__destroy__ = function() {
                fl(this.sp)
            };

            function Q(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = void 0 === b ? gl() : hl(b);
                h(Q)[this.sp] = this
            }
            Q.prototype = Object.create(y.prototype);
            Q.prototype.constructor = Q;
            Q.prototype.tp = Q;
            Q.up = {};
            a.btGImpactCompoundShape = Q;
            Q.prototype.childrenHasTransform = function() {
                return !!il(this.sp)
            };
            Q.prototype.getPrimitiveManager = function() {
                return k(jl(this.sp), Tr)
            };
            Q.prototype.getCompoundPrimitiveManager = function() {
                return k(kl(this.sp), P)
            };
            Q.prototype.getNumChildShapes = function() {
                return ll(this.sp)
            };
            Q.prototype.addChildShape = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                ml(d, b, c)
            };
            Q.prototype.getChildShape = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(nl(c, b), l)
            };
            Q.prototype.getChildAabb = function(b, c, d, e) {
                var g = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                ol(g, b, c, d, e)
            };
            Q.prototype.getChildTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(pl(c, b), t)
            };
            Q.prototype.setChildTransform = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                ql(d, b, c)
            };
            Q.prototype.calculateLocalInertia = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                rl(d, b, c)
            };
            Q.prototype.getName = function() {
                return Ra(sl(this.sp))
            };
            Q.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                tl(c, b)
            };
            Q.prototype.getLocalScaling = function() {
                return k(ul(this.sp), m)
            };
            Q.prototype.updateBound = function() {
                vl(this.sp)
            };
            Q.prototype.postUpdate = function() {
                wl(this.sp)
            };
            Q.prototype.getShapeType = function() {
                return xl(this.sp)
            };
            Q.prototype.needsRetrieveTriangles = function() {
                return !!yl(this.sp)
            };
            Q.prototype.needsRetrieveTetrahedrons = function() {
                return !!zl(this.sp)
            };
            Q.prototype.getBulletTriangle = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Al(d, b, c)
            };
            Q.prototype.getBulletTetrahedron = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Bl(d, b, c)
            };
            Q.prototype.__destroy__ = function() {
                Cl(this.sp)
            };

            function R(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = void 0 === b ? Dl() : El(b);
                h(R)[this.sp] = this
            }
            R.prototype = Object.create(Tr.prototype);
            R.prototype.constructor = R;
            R.prototype.tp = R;
            R.up = {};
            a.TrimeshPrimitiveManager = R;
            R.prototype.lock = R.prototype.lock = function() {
                Fl(this.sp)
            };
            R.prototype.unlock = R.prototype.unlock = function() {
                Gl(this.sp)
            };
            R.prototype.is_trimesh = function() {
                return !!Hl(this.sp)
            };
            R.prototype.get_vertex_count = function() {
                return Il(this.sp)
            };
            R.prototype.get_indices = function(b, c, d, e) {
                var g = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                Jl(g, b, c, d, e)
            };
            R.prototype.get_vertex = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Kl(d, b, c)
            };
            R.prototype.get_bullet_triangle = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Ll(d, b, c)
            };
            R.prototype.get_m_margin = R.prototype.zq = function() {
                return Ml(this.sp)
            };
            R.prototype.set_m_margin = R.prototype.Mr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Nl(c, b)
            };
            Object.defineProperty(R.prototype, "m_margin", {
                get: R.prototype.zq,
                set: R.prototype.Mr
            });
            R.prototype.get_m_meshInterface = R.prototype.Aq = function() {
                return k(Ol(this.sp), Rr)
            };
            R.prototype.set_m_meshInterface = R.prototype.Nr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Pl(c, b)
            };
            Object.defineProperty(R.prototype, "m_meshInterface", {
                get: R.prototype.Aq,
                set: R.prototype.Nr
            });
            R.prototype.get_m_part = R.prototype.Eq = function() {
                return Ql(this.sp)
            };
            R.prototype.set_m_part = R.prototype.Rr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Rl(c, b)
            };
            Object.defineProperty(R.prototype, "m_part", {
                get: R.prototype.Eq,
                set: R.prototype.Rr
            });
            R.prototype.get_m_lock_count = R.prototype.xq = function() {
                return Sl(this.sp)
            };
            R.prototype.set_m_lock_count = R.prototype.Kr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Tl(c, b)
            };
            Object.defineProperty(R.prototype, "m_lock_count", {
                get: R.prototype.xq,
                set: R.prototype.Kr
            });
            R.prototype.get_numverts = R.prototype.Zq = function() {
                return Ul(this.sp)
            };
            R.prototype.set_numverts = R.prototype.ps = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Vl(c, b)
            };
            Object.defineProperty(R.prototype, "numverts", {
                get: R.prototype.Zq,
                set: R.prototype.ps
            });
            R.prototype.get_type = R.prototype.ar = function() {
                return Wl(this.sp)
            };
            R.prototype.set_type = R.prototype.rs = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Xl(c, b)
            };
            Object.defineProperty(R.prototype, "type", {
                get: R.prototype.ar,
                set: R.prototype.rs
            });
            R.prototype.get_stride = R.prototype.$q = function() {
                return Yl(this.sp)
            };
            R.prototype.set_stride = R.prototype.qs = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Zl(c, b)
            };
            Object.defineProperty(R.prototype, "stride", {
                get: R.prototype.$q,
                set: R.prototype.qs
            });
            R.prototype.get_indexstride = R.prototype.Pp = function() {
                return $l(this.sp)
            };
            R.prototype.set_indexstride = R.prototype.br = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                am(c, b)
            };
            Object.defineProperty(R.prototype, "indexstride", {
                get: R.prototype.Pp,
                set: R.prototype.br
            });
            R.prototype.get_numfaces = R.prototype.Yq = function() {
                return bm(this.sp)
            };
            R.prototype.set_numfaces = R.prototype.ns = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                cm(c, b)
            };
            Object.defineProperty(R.prototype, "numfaces", {
                get: R.prototype.Yq,
                set: R.prototype.ns
            });
            R.prototype.get_indicestype = R.prototype.Qp = function() {
                return dm(this.sp)
            };
            R.prototype.set_indicestype = R.prototype.cr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                em(c, b)
            };
            Object.defineProperty(R.prototype, "indicestype", {
                get: R.prototype.Qp,
                set: R.prototype.cr
            });
            R.prototype.__destroy__ = function() {
                fm(this.sp)
            };

            function S(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = gm(b, c);
                h(S)[this.sp] = this
            }
            S.prototype = Object.create(y.prototype);
            S.prototype.constructor = S;
            S.prototype.tp = S;
            S.up = {};
            a.btGImpactMeshShapePart = S;
            S.prototype.getTrimeshPrimitiveManager = function() {
                return k(hm(this.sp), R)
            };
            S.prototype.getVertexCount = function() {
                return im(this.sp)
            };
            S.prototype.getVertex = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                jm(d, b, c)
            };
            S.prototype.getPart = function() {
                return km(this.sp)
            };
            S.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                lm(c, b)
            };
            S.prototype.getLocalScaling = function() {
                return k(mm(this.sp), m)
            };
            S.prototype.updateBound = function() {
                nm(this.sp)
            };
            S.prototype.postUpdate = function() {
                om(this.sp)
            };
            S.prototype.getShapeType = function() {
                return pm(this.sp)
            };
            S.prototype.needsRetrieveTriangles = function() {
                return !!qm(this.sp)
            };
            S.prototype.needsRetrieveTetrahedrons = function() {
                return !!rm(this.sp)
            };
            S.prototype.getBulletTriangle = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                sm(d, b, c)
            };
            S.prototype.getBulletTetrahedron = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                tm(d, b, c)
            };
            S.prototype.__destroy__ = function() {
                um(this.sp)
            };

            function T(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = wm(b);
                h(T)[this.sp] = this
            }
            T.prototype = Object.create(y.prototype);
            T.prototype.constructor = T;
            T.prototype.tp = T;
            T.up = {};
            a.btGImpactMeshShape = T;
            T.prototype.getMeshInterface = function() {
                return k(xm(this.sp), Rr)
            };
            T.prototype.getMeshPartCount = function() {
                return ym(this.sp)
            };
            T.prototype.getMeshPart = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(zm(c, b), S)
            };
            T.prototype.calculateSerializeBufferSize = function() {
                return Am(this.sp)
            };
            T.prototype.setLocalScaling = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Bm(c, b)
            };
            T.prototype.getLocalScaling = function() {
                return k(Cm(this.sp), m)
            };
            T.prototype.updateBound = function() {
                Dm(this.sp)
            };
            T.prototype.postUpdate = function() {
                Em(this.sp)
            };
            T.prototype.getShapeType = function() {
                return Fm(this.sp)
            };
            T.prototype.needsRetrieveTriangles = function() {
                return !!Gm(this.sp)
            };
            T.prototype.needsRetrieveTetrahedrons = function() {
                return !!Hm(this.sp)
            };
            T.prototype.getBulletTriangle = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Im(d, b, c)
            };
            T.prototype.getBulletTetrahedron = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Jm(d, b, c)
            };
            T.prototype.__destroy__ = function() {
                Km(this.sp)
            };

            function U(b, c) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                this.sp = void 0 === b ? Lm() : void 0 === c ? _emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_1(b) : Mm(b, c);
                h(U)[this.sp] = this
            }
            U.prototype = Object.create(f.prototype);
            U.prototype.constructor = U;
            U.prototype.tp = U;
            U.up = {};
            a.btCollisionAlgorithmConstructionInfo = U;
            U.prototype.get_m_dispatcher1 = U.prototype.gq = function() {
                return k(Nm(this.sp), Ir)
            };
            U.prototype.set_m_dispatcher1 = U.prototype.tr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Om(c, b)
            };
            Object.defineProperty(U.prototype, "m_dispatcher1", {
                get: U.prototype.gq,
                set: U.prototype.tr
            });
            U.prototype.get_m_manifold = U.prototype.yq = function() {
                return k(Pm(this.sp), Vr)
            };
            U.prototype.set_m_manifold = U.prototype.Lr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Qm(c, b)
            };
            Object.defineProperty(U.prototype, "m_manifold", {
                get: U.prototype.yq,
                set: U.prototype.Lr
            });
            U.prototype.__destroy__ = function() {
                Rm(this.sp)
            };

            function Cs(b, c, d) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                this.sp = Sm(b, c, d);
                h(Cs)[this.sp] = this
            }
            Cs.prototype = Object.create(Ur.prototype);
            Cs.prototype.constructor = Cs;
            Cs.prototype.tp = Cs;
            Cs.up = {};
            a.btGImpactCollisionAlgorithm = Cs;
            Cs.prototype.registerAlgorithm = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Tm(c, b)
            };
            Cs.prototype.__destroy__ = function() {
                Um(this.sp)
            };

            function Ds() {
                this.sp = Vm();
                h(Ds)[this.sp] = this
            }
            Ds.prototype = Object.create(f.prototype);
            Ds.prototype.constructor = Ds;
            Ds.prototype.tp = Ds;
            Ds.up = {};
            a.btDefaultCollisionConstructionInfo = Ds;
            Ds.prototype.__destroy__ = function() {
                Wm(this.sp)
            };

            function Es(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = void 0 === b ? Xm() : Ym(b);
                h(Es)[this.sp] = this
            }
            Es.prototype = Object.create(f.prototype);
            Es.prototype.constructor = Es;
            Es.prototype.tp = Es;
            Es.up = {};
            a.btDefaultCollisionConfiguration = Es;
            Es.prototype.__destroy__ = function() {
                Zm(this.sp)
            };

            function Vr() {
                this.sp = $m();
                h(Vr)[this.sp] = this
            }
            Vr.prototype = Object.create(f.prototype);
            Vr.prototype.constructor = Vr;
            Vr.prototype.tp = Vr;
            Vr.up = {};
            a.btPersistentManifold = Vr;
            Vr.prototype.getBody0 = function() {
                return k(an(this.sp), r)
            };
            Vr.prototype.getBody1 = function() {
                return k(bn(this.sp), r)
            };
            Vr.prototype.getNumContacts = function() {
                return cn(this.sp)
            };
            Vr.prototype.getContactPoint = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(dn(c, b), I)
            };
            Vr.prototype.__destroy__ = function() {
                en(this.sp)
            };

            function Fs(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = fn(b);
                h(Fs)[this.sp] = this
            }
            Fs.prototype = Object.create(Ir.prototype);
            Fs.prototype.constructor = Fs;
            Fs.prototype.tp = Fs;
            Fs.up = {};
            a.btCollisionDispatcher = Fs;
            Fs.prototype.getNumManifolds = function() {
                return gn(this.sp)
            };
            Fs.prototype.getManifoldByIndexInternal = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(hn(c, b), Vr)
            };
            Fs.prototype.__destroy__ = function() {
                jn(this.sp)
            };

            function Gs() {
                throw "cannot construct a btOverlappingPairCallback, no constructor in IDL";
            }
            Gs.prototype = Object.create(f.prototype);
            Gs.prototype.constructor = Gs;
            Gs.prototype.tp = Gs;
            Gs.up = {};
            a.btOverlappingPairCallback = Gs;
            Gs.prototype.__destroy__ = function() {
                kn(this.sp)
            };

            function Jr() {
                throw "cannot construct a btOverlappingPairCache, no constructor in IDL";
            }
            Jr.prototype = Object.create(f.prototype);
            Jr.prototype.constructor = Jr;
            Jr.prototype.tp = Jr;
            Jr.up = {};
            a.btOverlappingPairCache = Jr;
            Jr.prototype.setInternalGhostPairCallback = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ln(c, b)
            };
            Jr.prototype.getNumOverlappingPairs = function() {
                return mn(this.sp)
            };
            Jr.prototype.__destroy__ = function() {
                nn(this.sp)
            };

            function Hs(b, c, d, e, g) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                g && "object" === typeof g && (g = g.sp);
                this.sp = void 0 === d ? on(b, c) : void 0 === e ? pn(b, c, d) : void 0 === g ? qn(b, c, d, e) : rn(b, c, d, e, g);
                h(Hs)[this.sp] = this
            }
            Hs.prototype = Object.create(f.prototype);
            Hs.prototype.constructor = Hs;
            Hs.prototype.tp = Hs;
            Hs.up = {};
            a.btAxisSweep3 = Hs;
            Hs.prototype.__destroy__ = function() {
                sn(this.sp)
            };

            function Kr() {
                throw "cannot construct a btBroadphaseInterface, no constructor in IDL";
            }
            Kr.prototype = Object.create(f.prototype);
            Kr.prototype.constructor = Kr;
            Kr.prototype.tp = Kr;
            Kr.up = {};
            a.btBroadphaseInterface = Kr;
            Kr.prototype.getOverlappingPairCache = function() {
                return k(tn(this.sp), Jr)
            };
            Kr.prototype.__destroy__ = function() {
                un(this.sp)
            };

            function Is() {
                throw "cannot construct a btCollisionConfiguration, no constructor in IDL";
            }
            Is.prototype = Object.create(f.prototype);
            Is.prototype.constructor = Is;
            Is.prototype.tp = Is;
            Is.up = {};
            a.btCollisionConfiguration = Is;
            Is.prototype.__destroy__ = function() {
                vn(this.sp)
            };

            function Js() {
                this.sp = wn();
                h(Js)[this.sp] = this
            }
            Js.prototype = Object.create(f.prototype);
            Js.prototype.constructor = Js;
            Js.prototype.tp = Js;
            Js.up = {};
            a.btDbvtBroadphase = Js;
            Js.prototype.__destroy__ = function() {
                xn(this.sp)
            };

            function u() {
                throw "cannot construct a btBroadphaseProxy, no constructor in IDL";
            }
            u.prototype = Object.create(f.prototype);
            u.prototype.constructor = u;
            u.prototype.tp = u;
            u.up = {};
            a.btBroadphaseProxy = u;
            u.prototype.get_m_collisionFilterGroup = u.prototype.vp = function() {
                return yn(this.sp)
            };
            u.prototype.set_m_collisionFilterGroup = u.prototype.xp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                zn(c, b)
            };
            Object.defineProperty(u.prototype, "m_collisionFilterGroup", {
                get: u.prototype.vp,
                set: u.prototype.xp
            });
            u.prototype.get_m_collisionFilterMask = u.prototype.wp = function() {
                return An(this.sp)
            };
            u.prototype.set_m_collisionFilterMask = u.prototype.yp = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Bn(c, b)
            };
            Object.defineProperty(u.prototype, "m_collisionFilterMask", {
                get: u.prototype.wp,
                set: u.prototype.yp
            });
            u.prototype.__destroy__ = function() {
                Cn(this.sp)
            };

            function V(b, c, d, e) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                this.sp = void 0 === e ? Dn(b, c, d) : En(b, c, d, e);
                h(V)[this.sp] = this
            }
            V.prototype = Object.create(f.prototype);
            V.prototype.constructor = V;
            V.prototype.tp = V;
            V.up = {};
            a.btRigidBodyConstructionInfo = V;
            V.prototype.get_m_linearDamping = V.prototype.sq = function() {
                return Fn(this.sp)
            };
            V.prototype.set_m_linearDamping = V.prototype.Fr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Gn(c, b)
            };
            Object.defineProperty(V.prototype, "m_linearDamping", {
                get: V.prototype.sq,
                set: V.prototype.Fr
            });
            V.prototype.get_m_angularDamping = V.prototype.Xp = function() {
                return Hn(this.sp)
            };
            V.prototype.set_m_angularDamping = V.prototype.jr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                In(c, b)
            };
            Object.defineProperty(V.prototype, "m_angularDamping", {
                get: V.prototype.Xp,
                set: V.prototype.jr
            });
            V.prototype.get_m_friction = V.prototype.kq = function() {
                return Jn(this.sp)
            };
            V.prototype.set_m_friction = V.prototype.xr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Kn(c, b)
            };
            Object.defineProperty(V.prototype, "m_friction", {
                get: V.prototype.kq,
                set: V.prototype.xr
            });
            V.prototype.get_m_rollingFriction = V.prototype.Jq = function() {
                return Ln(this.sp)
            };
            V.prototype.set_m_rollingFriction = V.prototype.Wr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Mn(c, b)
            };
            Object.defineProperty(V.prototype, "m_rollingFriction", {
                get: V.prototype.Jq,
                set: V.prototype.Wr
            });
            V.prototype.get_m_restitution = V.prototype.Iq = function() {
                return Nn(this.sp)
            };
            V.prototype.set_m_restitution = V.prototype.Vr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                On(c, b)
            };
            Object.defineProperty(V.prototype, "m_restitution", {
                get: V.prototype.Iq,
                set: V.prototype.Vr
            });
            V.prototype.get_m_linearSleepingThreshold = V.prototype.tq = function() {
                return Pn(this.sp)
            };
            V.prototype.set_m_linearSleepingThreshold = V.prototype.Gr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Qn(c, b)
            };
            Object.defineProperty(V.prototype, "m_linearSleepingThreshold", {
                get: V.prototype.tq,
                set: V.prototype.Gr
            });
            V.prototype.get_m_angularSleepingThreshold = V.prototype.Yp = function() {
                return Rn(this.sp)
            };
            V.prototype.set_m_angularSleepingThreshold = V.prototype.kr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Sn(c, b)
            };
            Object.defineProperty(V.prototype, "m_angularSleepingThreshold", {
                get: V.prototype.Yp,
                set: V.prototype.kr
            });
            V.prototype.get_m_additionalDamping = V.prototype.Tp = function() {
                return !!Tn(this.sp)
            };
            V.prototype.set_m_additionalDamping = V.prototype.fr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Un(c, b)
            };
            Object.defineProperty(V.prototype, "m_additionalDamping", {
                get: V.prototype.Tp,
                set: V.prototype.fr
            });
            V.prototype.get_m_additionalDampingFactor = V.prototype.Up = function() {
                return Vn(this.sp)
            };
            V.prototype.set_m_additionalDampingFactor = V.prototype.gr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Wn(c, b)
            };
            Object.defineProperty(V.prototype, "m_additionalDampingFactor", {
                get: V.prototype.Up,
                set: V.prototype.gr
            });
            V.prototype.get_m_additionalLinearDampingThresholdSqr = V.prototype.Vp = function() {
                return Xn(this.sp)
            };
            V.prototype.set_m_additionalLinearDampingThresholdSqr = V.prototype.hr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Yn(c, b)
            };
            Object.defineProperty(V.prototype, "m_additionalLinearDampingThresholdSqr", {
                get: V.prototype.Vp,
                set: V.prototype.hr
            });
            V.prototype.get_m_additionalAngularDampingThresholdSqr = V.prototype.Sp = function() {
                return Zn(this.sp)
            };
            V.prototype.set_m_additionalAngularDampingThresholdSqr = V.prototype.er = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                $n(c, b)
            };
            Object.defineProperty(V.prototype, "m_additionalAngularDampingThresholdSqr", {
                get: V.prototype.Sp,
                set: V.prototype.er
            });
            V.prototype.get_m_additionalAngularDampingFactor = V.prototype.Rp = function() {
                return ao(this.sp)
            };
            V.prototype.set_m_additionalAngularDampingFactor = V.prototype.dr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                bo(c, b)
            };
            Object.defineProperty(V.prototype, "m_additionalAngularDampingFactor", {
                get: V.prototype.Rp,
                set: V.prototype.dr
            });
            V.prototype.__destroy__ = function() {
                co(this.sp)
            };

            function W(b) {
                b && "object" === typeof b && (b = b.sp);
                this.sp = eo(b);
                h(W)[this.sp] = this
            }
            W.prototype = Object.create(r.prototype);
            W.prototype.constructor = W;
            W.prototype.tp = W;
            W.up = {};
            a.btRigidBody = W;
            W.prototype.getCenterOfMassTransform = function() {
                return k(fo(this.sp), t)
            };
            W.prototype.setCenterOfMassTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                go(c, b)
            };
            W.prototype.setSleepingThresholds = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                ho(d, b, c)
            };
            W.prototype.getLinearDamping = function() {
                return io(this.sp)
            };
            W.prototype.getAngularDamping = function() {
                return jo(this.sp)
            };
            W.prototype.setDamping = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                ko(d, b, c)
            };
            W.prototype.setMassProps = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                lo(d, b, c)
            };
            W.prototype.getLinearFactor = function() {
                return k(mo(this.sp), m)
            };
            W.prototype.setLinearFactor = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                no(c, b)
            };
            W.prototype.applyTorque = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                oo(c, b)
            };
            W.prototype.applyLocalTorque = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                po(c, b)
            };
            W.prototype.applyForce = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                qo(d, b, c)
            };
            W.prototype.applyCentralForce = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ro(c, b)
            };
            W.prototype.applyCentralLocalForce = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                so(c, b)
            };
            W.prototype.applyTorqueImpulse = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                to(c, b)
            };
            W.prototype.applyImpulse = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                uo(d, b, c)
            };
            W.prototype.applyCentralImpulse = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                vo(c, b)
            };
            W.prototype.updateInertiaTensor = function() {
                wo(this.sp)
            };
            W.prototype.getLinearVelocity = function() {
                return k(xo(this.sp), m)
            };
            W.prototype.getAngularVelocity = function() {
                return k(yo(this.sp), m)
            };
            W.prototype.setLinearVelocity = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                zo(c, b)
            };
            W.prototype.setAngularVelocity = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Ao(c, b)
            };
            W.prototype.getMotionState = function() {
                return k(Bo(this.sp), Lr)
            };
            W.prototype.setMotionState = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Co(c, b)
            };
            W.prototype.getAngularFactor = function() {
                return k(Do(this.sp), m)
            };
            W.prototype.setAngularFactor = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Eo(c, b)
            };
            W.prototype.upcast = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                return k(Fo(c, b), W)
            };
            W.prototype.getAabb = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Go(d, b, c)
            };
            W.prototype.applyGravity = function() {
                Ho(this.sp)
            };
            W.prototype.getGravity = function() {
                return k(Io(this.sp), m)
            };
            W.prototype.setGravity = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Jo(c, b)
            };
            W.prototype.getBroadphaseProxy = function() {
                return k(Ko(this.sp), u)
            };
            W.prototype.clearForces = function() {
                Lo(this.sp)
            };
            W.prototype.setFlags = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Mo(c, b)
            };
            W.prototype.getFlags = function() {
                return No(this.sp)
            };
            W.prototype.setAnisotropicFriction = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                Oo(d, b, c)
            };
            W.prototype.getCollisionShape = function() {
                return k(Po(this.sp), l)
            };
            W.prototype.setContactProcessingThreshold = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Qo(c, b)
            };
            W.prototype.setActivationState = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Ro(c, b)
            };
            W.prototype.forceActivationState = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                So(c, b)
            };
            W.prototype.activate = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                void 0 === b ? To(c) : Uo(c, b)
            };
            W.prototype.isActive = function() {
                return !!Vo(this.sp)
            };
            W.prototype.isKinematicObject = function() {
                return !!Wo(this.sp)
            };
            W.prototype.isStaticObject = function() {
                return !!Xo(this.sp)
            };
            W.prototype.isStaticOrKinematicObject = function() {
                return !!Yo(this.sp)
            };
            W.prototype.getRestitution = function() {
                return Zo(this.sp)
            };
            W.prototype.getFriction = function() {
                return $o(this.sp)
            };
            W.prototype.getRollingFriction = function() {
                return ap(this.sp)
            };
            W.prototype.setRestitution = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                bp(c, b)
            };
            W.prototype.setFriction = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                cp(c, b)
            };
            W.prototype.setRollingFriction = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                dp(c, b)
            };
            W.prototype.getWorldTransform = function() {
                return k(ep(this.sp), t)
            };
            W.prototype.getCollisionFlags = function() {
                return fp(this.sp)
            };
            W.prototype.setCollisionFlags = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                gp(c, b)
            };
            W.prototype.setWorldTransform = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                hp(c, b)
            };
            W.prototype.setCollisionShape = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ip(c, b)
            };
            W.prototype.setCcdMotionThreshold = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                jp(c, b)
            };
            W.prototype.setCcdSweptSphereRadius = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                kp(c, b)
            };
            W.prototype.getUserIndex = function() {
                return lp(this.sp)
            };
            W.prototype.setUserIndex = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                mp(c, b)
            };
            W.prototype.getUserPointer = function() {
                return k(np(this.sp), Mr)
            };
            W.prototype.setUserPointer = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                op(c, b)
            };
            W.prototype.getBroadphaseHandle = function() {
                return k(pp(this.sp), u)
            };
            W.prototype.__destroy__ = function() {
                qp(this.sp)
            };

            function X() {
                this.sp = rp();
                h(X)[this.sp] = this
            }
            X.prototype = Object.create(f.prototype);
            X.prototype.constructor = X;
            X.prototype.tp = X;
            X.up = {};
            a.btConstraintSetting = X;
            X.prototype.get_m_tau = X.prototype.Pq = function() {
                return sp(this.sp)
            };
            X.prototype.set_m_tau = X.prototype.cs = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                tp(c, b)
            };
            Object.defineProperty(X.prototype, "m_tau", {
                get: X.prototype.Pq,
                set: X.prototype.cs
            });
            X.prototype.get_m_damping = X.prototype.eq = function() {
                return up(this.sp)
            };
            X.prototype.set_m_damping = X.prototype.rr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                vp(c, b)
            };
            Object.defineProperty(X.prototype, "m_damping", {
                get: X.prototype.eq,
                set: X.prototype.rr
            });
            X.prototype.get_m_impulseClamp = X.prototype.qq = function() {
                return wp(this.sp)
            };
            X.prototype.set_m_impulseClamp = X.prototype.Dr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                xp(c, b)
            };
            Object.defineProperty(X.prototype, "m_impulseClamp", {
                get: X.prototype.qq,
                set: X.prototype.Dr
            });
            X.prototype.__destroy__ = function() {
                yp(this.sp)
            };

            function Y(b, c, d, e) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                this.sp = void 0 === d ? zp(b, c) : void 0 === e ? _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_3(b, c, d) : Ap(b, c, d, e);
                h(Y)[this.sp] = this
            }
            Y.prototype = Object.create(Wr.prototype);
            Y.prototype.constructor = Y;
            Y.prototype.tp = Y;
            Y.up = {};
            a.btPoint2PointConstraint = Y;
            Y.prototype.setPivotA = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Bp(c, b)
            };
            Y.prototype.setPivotB = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Cp(c, b)
            };
            Y.prototype.getPivotInA = function() {
                return k(Dp(this.sp), m)
            };
            Y.prototype.getPivotInB = function() {
                return k(Ep(this.sp), m)
            };
            Y.prototype.enableFeedback = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Fp(c, b)
            };
            Y.prototype.getBreakingImpulseThreshold = function() {
                return Gp(this.sp)
            };
            Y.prototype.setBreakingImpulseThreshold = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Hp(c, b)
            };
            Y.prototype.getParam = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                return Ip(d, b, c)
            };
            Y.prototype.setParam = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                Jp(e, b, c, d)
            };
            Y.prototype.get_m_setting = Y.prototype.Kq = function() {
                return k(Kp(this.sp), X)
            };
            Y.prototype.set_m_setting = Y.prototype.Xr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Lp(c, b)
            };
            Object.defineProperty(Y.prototype, "m_setting", {
                get: Y.prototype.Kq,
                set: Y.prototype.Xr
            });
            Y.prototype.__destroy__ = function() {
                Mp(this.sp)
            };

            function Ks() {
                this.sp = Np();
                h(Ks)[this.sp] = this
            }
            Ks.prototype = Object.create(f.prototype);
            Ks.prototype.constructor = Ks;
            Ks.prototype.tp = Ks;
            Ks.up = {};
            a.btSequentialImpulseConstraintSolver = Ks;
            Ks.prototype.__destroy__ = function() {
                Op(this.sp)
            };

            function Ls(b, c, d, e) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                this.sp = Pp(b, c, d, e);
                h(Ls)[this.sp] = this
            }
            Ls.prototype = Object.create(Wr.prototype);
            Ls.prototype.constructor = Ls;
            Ls.prototype.tp = Ls;
            Ls.up = {};
            a.btFixedConstraint = Ls;
            Ls.prototype.enableFeedback = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Qp(c, b)
            };
            Ls.prototype.getBreakingImpulseThreshold = function() {
                return Rp(this.sp)
            };
            Ls.prototype.setBreakingImpulseThreshold = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Sp(c, b)
            };
            Ls.prototype.getParam = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                return Tp(d, b, c)
            };
            Ls.prototype.setParam = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                Up(e, b, c, d)
            };
            Ls.prototype.__destroy__ = function() {
                Vp(this.sp)
            };

            function Ms() {
                throw "cannot construct a btConstraintSolver, no constructor in IDL";
            }
            Ms.prototype = Object.create(f.prototype);
            Ms.prototype.constructor = Ms;
            Ms.prototype.tp = Ms;
            Ms.up = {};
            a.btConstraintSolver = Ms;
            Ms.prototype.__destroy__ = function() {
                Wp(this.sp)
            };

            function p() {
                throw "cannot construct a btDispatcherInfo, no constructor in IDL";
            }
            p.prototype = Object.create(f.prototype);
            p.prototype.constructor = p;
            p.prototype.tp = p;
            p.up = {};
            a.btDispatcherInfo = p;
            p.prototype.get_m_timeStep = p.prototype.Rq = function() {
                return Xp(this.sp)
            };
            p.prototype.set_m_timeStep = p.prototype.es = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Yp(c, b)
            };
            Object.defineProperty(p.prototype, "m_timeStep", {
                get: p.prototype.Rq,
                set: p.prototype.es
            });
            p.prototype.get_m_stepCount = p.prototype.Oq = function() {
                return Zp(this.sp)
            };
            p.prototype.set_m_stepCount = p.prototype.bs = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                $p(c, b)
            };
            Object.defineProperty(p.prototype, "m_stepCount", {
                get: p.prototype.Oq,
                set: p.prototype.bs
            });
            p.prototype.get_m_dispatchFunc = p.prototype.fq = function() {
                return aq(this.sp)
            };
            p.prototype.set_m_dispatchFunc = p.prototype.sr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                bq(c, b)
            };
            Object.defineProperty(p.prototype, "m_dispatchFunc", {
                get: p.prototype.fq,
                set: p.prototype.sr
            });
            p.prototype.get_m_timeOfImpact = p.prototype.Qq = function() {
                return cq(this.sp)
            };
            p.prototype.set_m_timeOfImpact = p.prototype.ds = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                dq(c, b)
            };
            Object.defineProperty(p.prototype, "m_timeOfImpact", {
                get: p.prototype.Qq,
                set: p.prototype.ds
            });
            p.prototype.get_m_useContinuous = p.prototype.Tq = function() {
                return !!eq(this.sp)
            };
            p.prototype.set_m_useContinuous = p.prototype.hs = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                fq(c, b)
            };
            Object.defineProperty(p.prototype, "m_useContinuous", {
                get: p.prototype.Tq,
                set: p.prototype.hs
            });
            p.prototype.get_m_enableSatConvex = p.prototype.iq = function() {
                return !!gq(this.sp)
            };
            p.prototype.set_m_enableSatConvex = p.prototype.vr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                hq(c, b)
            };
            Object.defineProperty(p.prototype, "m_enableSatConvex", {
                get: p.prototype.iq,
                set: p.prototype.vr
            });
            p.prototype.get_m_enableSPU = p.prototype.hq = function() {
                return !!iq(this.sp)
            };
            p.prototype.set_m_enableSPU = p.prototype.ur = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                jq(c, b)
            };
            Object.defineProperty(p.prototype, "m_enableSPU", {
                get: p.prototype.hq,
                set: p.prototype.ur
            });
            p.prototype.get_m_useEpa = p.prototype.Vq = function() {
                return !!kq(this.sp)
            };
            p.prototype.set_m_useEpa = p.prototype.ks = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                lq(c, b)
            };
            Object.defineProperty(p.prototype, "m_useEpa", {
                get: p.prototype.Vq,
                set: p.prototype.ks
            });
            p.prototype.get_m_allowedCcdPenetration = p.prototype.Wp = function() {
                return mq(this.sp)
            };
            p.prototype.set_m_allowedCcdPenetration = p.prototype.ir = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                nq(c, b)
            };
            Object.defineProperty(p.prototype, "m_allowedCcdPenetration", {
                get: p.prototype.Wp,
                set: p.prototype.ir
            });
            p.prototype.get_m_useConvexConservativeDistanceUtil = p.prototype.Uq = function() {
                return !!oq(this.sp)
            };
            p.prototype.set_m_useConvexConservativeDistanceUtil = p.prototype.js = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                pq(c, b)
            };
            Object.defineProperty(p.prototype, "m_useConvexConservativeDistanceUtil", {
                get: p.prototype.Uq,
                set: p.prototype.js
            });
            p.prototype.get_m_convexConservativeDistanceThreshold = p.prototype.aq = function() {
                return qq(this.sp)
            };
            p.prototype.set_m_convexConservativeDistanceThreshold = p.prototype.nr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                rq(c, b)
            };
            Object.defineProperty(p.prototype, "m_convexConservativeDistanceThreshold", {
                get: p.prototype.aq,
                set: p.prototype.nr
            });
            p.prototype.__destroy__ = function() {
                sq(this.sp)
            };

            function A() {
                throw "cannot construct a btContactSolverInfo, no constructor in IDL";
            }
            A.prototype = Object.create(f.prototype);
            A.prototype.constructor = A;
            A.prototype.tp = A;
            A.up = {};
            a.btContactSolverInfo = A;
            A.prototype.get_m_splitImpulse = A.prototype.Mq = function() {
                return !!tq(this.sp)
            };
            A.prototype.set_m_splitImpulse = A.prototype.Zr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                uq(c, b)
            };
            Object.defineProperty(A.prototype, "m_splitImpulse", {
                get: A.prototype.Mq,
                set: A.prototype.Zr
            });
            A.prototype.get_m_splitImpulsePenetrationThreshold = A.prototype.Nq = function() {
                return vq(this.sp)
            };
            A.prototype.set_m_splitImpulsePenetrationThreshold = A.prototype.$r = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                wq(c, b)
            };
            Object.defineProperty(A.prototype, "m_splitImpulsePenetrationThreshold", {
                get: A.prototype.Nq,
                set: A.prototype.$r
            });
            A.prototype.get_m_numIterations = A.prototype.Cq = function() {
                return xq(this.sp)
            };
            A.prototype.set_m_numIterations = A.prototype.Pr = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                yq(c, b)
            };
            Object.defineProperty(A.prototype, "m_numIterations", {
                get: A.prototype.Cq,
                set: A.prototype.Pr
            });
            A.prototype.__destroy__ = function() {
                zq(this.sp)
            };

            function Z(b, c, d, e) {
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                this.sp = Aq(b, c, d, e);
                h(Z)[this.sp] = this
            }
            Z.prototype = Object.create(z.prototype);
            Z.prototype.constructor = Z;
            Z.prototype.tp = Z;
            Z.up = {};
            a.btDiscreteDynamicsWorld = Z;
            Z.prototype.setGravity = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Bq(c, b)
            };
            Z.prototype.getGravity = function() {
                return k(Cq(this.sp), m)
            };
            Z.prototype.addRigidBody = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                void 0 === c ? Dq(e, b) : void 0 === d ? _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_2(e, b, c) : Eq(e, b, c, d)
            };
            Z.prototype.removeRigidBody = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Fq(c, b)
            };
            Z.prototype.addConstraint = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                void 0 === c ? Gq(d, b) : Hq(d, b, c)
            };
            Z.prototype.removeConstraint = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Iq(c, b)
            };
            Z.prototype.stepSimulation = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                return void 0 === c ? Jq(e, b) : void 0 === d ? Kq(e, b, c) : Lq(e, b, c, d)
            };
            Z.prototype.setContactAddedCallback = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Mq(c, b)
            };
            Z.prototype.setContactProcessedCallback = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Nq(c, b)
            };
            Z.prototype.setContactDestroyedCallback = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Oq(c, b)
            };
            Z.prototype.getDispatcher = function() {
                return k(Pq(this.sp), Ir)
            };
            Z.prototype.rayTest = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                Qq(e, b, c, d)
            };
            Z.prototype.getPairCache = function() {
                return k(Rq(this.sp), Jr)
            };
            Z.prototype.getDispatchInfo = function() {
                return k(Sq(this.sp), p)
            };
            Z.prototype.addCollisionObject = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                void 0 === c ? Tq(e, b) : void 0 === d ? Uq(e, b, c) : Vq(e, b, c, d)
            };
            Z.prototype.removeCollisionObject = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                Wq(c, b)
            };
            Z.prototype.getBroadphase = function() {
                return k(Xq(this.sp), Kr)
            };
            Z.prototype.convexSweepTest = function(b, c, d, e, g) {
                var B = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                e && "object" === typeof e && (e = e.sp);
                g && "object" === typeof g && (g = g.sp);
                Yq(B, b, c, d, e, g)
            };
            Z.prototype.contactPairTest = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                Zq(e, b, c, d)
            };
            Z.prototype.contactTest = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                $q(d, b, c)
            };
            Z.prototype.updateSingleAabb = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                ar(c, b)
            };
            Z.prototype.addAction = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                br(c, b)
            };
            Z.prototype.removeAction = function(b) {
                var c = this.sp;
                b && "object" === typeof b && (b = b.sp);
                cr(c, b)
            };
            Z.prototype.getSolverInfo = function() {
                return k(dr(this.sp), A)
            };
            Z.prototype.setInternalTickCallback = function(b, c, d) {
                var e = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                d && "object" === typeof d && (d = d.sp);
                void 0 === c ? er(e, b) : void 0 === d ? fr(e, b, c) : gr(e, b, c, d)
            };
            Z.prototype.__destroy__ = function() {
                hr(this.sp)
            };

            function Ns() {
                throw "cannot construct a btActionInterface, no constructor in IDL";
            }
            Ns.prototype = Object.create(f.prototype);
            Ns.prototype.constructor = Ns;
            Ns.prototype.tp = Ns;
            Ns.up = {};
            a.btActionInterface = Ns;
            Ns.prototype.updateAction = function(b, c) {
                var d = this.sp;
                b && "object" === typeof b && (b = b.sp);
                c && "object" === typeof c && (c = c.sp);
                ir(d, b, c)
            };
            Ns.prototype.__destroy__ = function() {
                jr(this.sp)
            };

            function Os() {
                this.sp = kr();
                h(Os)[this.sp] = this
            }
            Os.prototype = Object.create(f.prototype);
            Os.prototype.constructor = Os;
            Os.prototype.tp = Os;
            Os.up = {};
            a.btGhostPairCallback = Os;
            Os.prototype.__destroy__ = function() {
                lr(this.sp)
            };
            (function() {
                function b() {
                    a.PHY_FLOAT = mr();
                    a.PHY_DOUBLE = nr();
                    a.PHY_INTEGER = or();
                    a.PHY_SHORT = pr();
                    a.PHY_FIXEDPOINT88 = qr();
                    a.PHY_UCHAR = rr();
                    a.BT_CONSTRAINT_ERP = sr();
                    a.BT_CONSTRAINT_STOP_ERP = tr();
                    a.BT_CONSTRAINT_CFM = ur();
                    a.BT_CONSTRAINT_STOP_CFM = vr()
                }
                za ? b() : xa.unshift(b)
            })();
            a.CONTACT_ADDED_CALLBACK_SIGNATURE = "iiiiiiii";
            a.CONTACT_DESTROYED_CALLBACK_SIGNATURE = "ii";
            a.CONTACT_PROCESSED_CALLBACK_SIGNATURE = "iiii";
            a.INTERNAL_TICK_CALLBACK_SIGNATURE = "vif";
            this.Ammo = a;


            return moduleArg.ready
        }

    );
})();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = Ammo;
else if (typeof define === 'function' && define['amd'])
    define([], function() {
        return Ammo;
    });
else if (typeof exports === 'object')
    exports["Ammo"] = Ammo;