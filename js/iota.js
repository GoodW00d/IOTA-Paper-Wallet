 ! function a(b, c, d) {
     function e(g, h) {
         if (!c[g]) {
             if (!b[g]) {
                 var i = "function" == typeof require && require;
                 if (!h && i) return i(g, !0);
                 if (f) return f(g, !0);
                 var j = new Error("Cannot find module '" + g + "'");
                 throw j.code = "MODULE_NOT_FOUND", j
             }
             var k = c[g] = {
                 exports: {}
             };
             b[g][0].call(k.exports, function(a) {
                 var c = b[g][1][a];
                 return e(c ? c : a)
             }, k, k.exports, a, b, c, d)
         }
         return c[g].exports
     }
     for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
     return e
 }({
     1: [function(a, b, c) {
         window.IOTA = a("./lib/iota.js")
     }, {
         "./lib/iota.js": 10
     }],
     2: [function(a, b, c) {
         function m(a, b) {
             this._makeRequest = a, this.sandbox = b
         }
         var d = a("./apiCommands"),
             e = a("../errors/inputErrors"),
             f = a("../utils/inputValidator"),
             h = (a("../crypto/curl"), a("../crypto/converter")),
             i = a("../crypto/signing"),
             j = a("../crypto/bundle"),
             k = a("../utils/utils"),
             l = a("async");
         m.prototype.sendCommand = function(a, b) {
             return this._makeRequest.send(a, b)
         }, m.prototype.attachToTangle = function(a, b, c, g, h) {
             if (!f.isHash(a)) return h(e.invalidTrunkOrBranch(a));
             if (!f.isHash(b)) return h(e.invalidTrunkOrBranch(b));
             if (!f.isValue(c)) return h(e.notInt());
             if (!f.isArrayOfTrytes(g)) return h(e.invalidTrytes());
             var i = d.attachToTangle(a, b, c, g);
             return this.sendCommand(i, h)
         }, m.prototype.findTransactions = function(a, b) {
             if (!f.isObject(a)) return b(e.invalidKey());
             var c = Object.keys(a),
                 g = ["bundles", "addresses", "tags", "approvees"];
             c.forEach(function(c) {
                 if (g.indexOf(c) === -1) return b(e.invalidKey());
                 var d = a[c];
                 if ("tags" === c) d.forEach(function(a) {
                     for (; a.length < 27;) a += "9";
                     if (!f.isTrytes(a, 27)) return b(e.invalidTrytes())
                 }), a[c] = d;
                 else if (!f.isArrayOfHashes(d)) return b(e.invalidTrytes())
             });
             var h = d.findTransactions(a);
             return this.sendCommand(h, b)
         }, m.prototype.getBalances = function(a, b, c) {
             if (!f.isArrayOfHashes(a)) return c(e.invalidTrytes());
             var g = d.getBalances(a, b);
             return this.sendCommand(g, c)
         }, m.prototype.getInclusionStates = function(a, b, c) {
             if (!f.isArrayOfHashes(a)) return c(e.invalidTrytes());
             if (!f.isArrayOfHashes(b)) return c(e.invalidTrytes());
             var g = d.getInclusionStates(a, b);
             return this.sendCommand(g, c)
         }, m.prototype.getNodeInfo = function(a) {
             var b = d.getNodeInfo();
             return this.sendCommand(b, a)
         }, m.prototype.getNeighbors = function(a) {
             var b = d.getNeighbors();
             return this.sendCommand(b, a)
         }, m.prototype.addNeighbors = function(a, b) {
             for (var c = 0; c < a.length; c++)
                 if (!f.isUri(a[c])) return b(e.invalidUri(a[c]));
             var g = d.addNeighbors(a);
             return this.sendCommand(g, b)
         }, m.prototype.removeNeighbors = function(a, b) {
             for (var c = 0; c < a.length; c++)
                 if (!f.isUri(a[c])) return b(e.invalidUri(a[c]));
             var g = d.removeNeighbors(a);
             return this.sendCommand(g, b)
         }, m.prototype.getTips = function(a) {
             var b = d.getTips();
             return this.sendCommand(b, a)
         }, m.prototype.getTransactionsToApprove = function(a, b) {
             if (!f.isValue(a)) return b(e.invalidInputs());
             var c = d.getTransactionsToApprove(a);
             return this.sendCommand(c, b)
         }, m.prototype.getTrytes = function(a, b) {
             if (!f.isArrayOfHashes(a)) return b(e.invalidTrytes());
             var c = d.getTrytes(a);
             return this.sendCommand(c, b)
         }, m.prototype.interruptAttachingToTangle = function(a) {
             var b = d.interruptAttachingToTangle();
             return this.sendCommand(b, a)
         }, m.prototype.broadcastTransactions = function(a, b) {
             if (!f.isArrayOfAttachedTrytes(a)) return b(e.invalidAttachedTrytes());
             var c = d.broadcastTransactions(a);
             return this.sendCommand(c, b)
         }, m.prototype.storeTransactions = function(a, b) {
             if (!f.isArrayOfAttachedTrytes(a)) return b(e.invalidAttachedTrytes());
             var c = d.storeTransactions(a);
             return this.sendCommand(c, b)
         }, m.prototype.getTransactionsObjects = function(a, b) {
             return f.isArrayOfHashes(a) ? void this.getTrytes(a, function(a, c) {
                 if (a) return b(a);
                 var d = [];
                 return c.forEach(function(a) {
                     a ? d.push(k.transactionObject(a)) : transactionObject.push(null)
                 }), b(null, d)
             }) : b(e.invalidInputs)
         }, m.prototype.findTransactionObjects = function(a, b) {
             var c = this;
             c.findTransactions(a, function(a, d) {
                 return a ? b(a) : void c.getTransactionsObjects(d, b)
             })
         }, m.prototype.getLatestInclusion = function(a, b) {
             var c = this;
             c.getNodeInfo(function(d, e) {
                 if (d) return b(d);
                 var f = e.latestSolidSubtangleMilestone;
                 return c.getInclusionStates(a, Array(f), b)
             })
         }, m.prototype.broadcastAndStore = function(a, b) {
             var c = this;
             c.broadcastTransactions(a, function(d, e) {
                 d || c.storeTransactions(a, function(a, c) {
                     return b ? b(a, c) : e
                 })
             })
         }, m.prototype.sendTrytes = function(a, b, c, d) {
             var g = this;
             return f.isValue(b) || f.isValue(c) ? void g.getTransactionsToApprove(b, function(b, e) {
                 return b ? d(b) : void g.attachToTangle(e.trunkTransaction, e.branchTransaction, c, a, function(a, b) {
                     if (a) return d(a);
                     if (g.sandbox) {
                         var c = g.sandbox + "/jobs/" + b.id;
                         g._makeRequest.sandboxSend(c, function(a, b) {
                             return a ? d(a) : void g.broadcastAndStore(b, function(a, c) {
                                 if (!a) {
                                     var e = [];
                                     return b.forEach(function(a) {
                                         e.push(k.transactionObject(a))
                                     }), d(null, e)
                                 }
                             })
                         })
                     } else g.broadcastAndStore(b, function(a, c) {
                         if (!a) {
                             var e = [];
                             return b.forEach(function(a) {
                                 e.push(k.transactionObject(a))
                             }), d(null, e)
                         }
                     })
                 })
             }) : d(e.invalidInputs())
         }, m.prototype.sendTransfer = function(a, b, c, d, g, h) {
             var i = this;
             return arguments.length < 5 ? h(new Error("Invalid number of arguments")) : (5 === arguments.length && "[object Function]" === Object.prototype.toString.call(g) && (h = g, g = {}), f.isValue(b) || f.isValue(c) ? void i.prepareTransfers(a, d, g, function(a, d) {
                 return a ? h(a) : void i.sendTrytes(d, b, c, h)
             }) : h(e.invalidInputs()))
         }, m.prototype.replayBundle = function(a, b, c, d) {
             var g = this;
             return f.isHash(a) ? f.isValue(b) || f.isValue(c) ? void g.getBundle(a, function(a, e) {
                 if (a) return d(a);
                 var f = [];
                 return e.forEach(function(a) {
                     f.push(k.transactionTrytes(a))
                 }), g.sendTrytes(f.reverse(), b, c, d)
             }) : d(e.invalidInputs()) : d(e.invalidTrytes())
         }, m.prototype.broadcastBundle = function(a, b) {
             var c = this;
             return f.isHash(a) ? void c.getBundle(a, function(a, d) {
                 if (a) return b(a);
                 var e = [];
                 return d.forEach(function(a) {
                     e.push(k.transactionTrytes(a))
                 }), c.broadcastTransactions(e.reverse(), b)
             }) : b(e.invalidTrytes())
         }, m.prototype._newAddress = function(a, b, c, d) {
             var e = i.key(h.trits(a), b, c),
                 f = i.digests(e),
                 g = i.address(f),
                 j = h.trytes(g);
             return d && (j = k.addChecksum(j)), j
         }, m.prototype.getNewAddress = function(a, b, c) {
             var d = this;
             if (2 === arguments.length && "[object Function]" === Object.prototype.toString.call(b) && (c = b, b = {}), !f.isTrytes(a)) return c(e.invalidSeed());
             var g = b.index || 0,
                 h = b.checksum || !1,
                 i = b.total || null,
                 j = b.security || 2,
                 k = [];
             if (i) {
                 for (var m = 0; m < i; m++, g++) {
                     var n = d._newAddress(a, g, j, h);
                     k.push(n)
                 }
                 return console.log("GENERATED NEW ADDRESS: " + n + " at key index: " + g), c(null, k)
             }
             l.doWhilst(function(b) {
                 var c = d._newAddress(a, g, j, h);
                 console.log("GENERATED NEW ADDRESS: " + c + " at key index: " + g), d.findTransactions({
                     addresses: Array(c)
                 }, function(a, d) {
                     return a ? b(a) : void b(null, c, d)
                 })
             }, function(a, c) {
                 return b.returnAll && k.push(a), console.log("ADDRESS ALREADY USED: ", c.length > 0), g += 1, c.length > 0
             }, function(a, d) {
                 if (a) return c(a);
                 var e = b.returnAll ? k : d;
                 return c(null, e)
             })
         }, m.prototype.getInputs = function(a, b, c) {
             function n(a) {
                 d.getBalances(a, 100, function(b, d) {
                     if (b) return c(b);
                     for (var e = {
                             inputs: [],
                             totalBalance: 0
                         }, f = !i, h = 0; h < a.length; h++) {
                         var k = parseInt(d.balances[h]);
                         if (k > 0) {
                             var l = {
                                 address: a[h],
                                 balance: k,
                                 keyIndex: g + h,
                                 security: j
                             };
                             if (e.inputs.push(l), e.totalBalance += k, i && e.totalBalance >= i) {
                                 f = !0;
                                 break
                             }
                         }
                     }
                     return f ? c(null, e) : c(new Error("Not enough balance"))
                 })
             }
             var d = this;
             if (2 === arguments.length && "[object Function]" === Object.prototype.toString.call(b) && (c = b, b = {}), !f.isTrytes(a)) return c(e.invalidSeed());
             var g = b.start || 0,
                 h = b.end || null,
                 i = b.threshold || null,
                 j = b.security || 2;
             if (g > h || h > g + 500) return c(new Error("Invalid inputs provided"));
             if (h) {
                 for (var k = [], l = g; l < h; l++) {
                     var m = d._newAddress(a, l, j, !1);
                     k.push(m)
                 }
                 n(k)
             } else d.getNewAddress(a, {
                 index: g,
                 returnAll: !0,
                 security: j
             }, function(a, b) {
                 return a ? c(a) : void n(b)
             })
         }, m.prototype.prepareTransfers = function(a, b, c, d) {
             function A(b) {
                 for (var c = p, d = 0; d < b.length; d++) {
                     var e = b[d].balance,
                         f = 0 - e,
                         h = Math.floor(Date.now() / 1e3);
                     if (o.addEntry(b[d].security, b[d].address, f, r, h), e >= c) {
                         var i = e - c;
                         i > 0 && l ? (o.addEntry(1, l, i, r, h), B(b)) : i > 0 ? g.getNewAddress(a, {
                             security: n
                         }, function(a, c) {
                             var d = Math.floor(Date.now() / 1e3);
                             o.addEntry(1, c, i, r, d), B(b)
                         }) : B(b)
                     } else c -= e
                 }
             }

             function B(b) {
                 o.finalize(), o.addTrytes(q);
                 for (var c = 0; c < o.bundle.length; c++)
                     if (o.bundle[c].value < 0) {
                         for (var f, g, e = o.bundle[c].address, j = 0; j < b.length; j++)
                             if (b[j].address === e) {
                                 f = b[j].keyIndex, g = b[j].security ? b[j].security : n;
                                 break
                             }
                         for (var l = o.bundle[c].bundle, m = i.key(h.trits(a), f, g), p = o.normalizedBundle(l), r = [], s = 0; s < 3; s++) r[s] = p.slice(27 * s, 27 * (s + 1));
                         var t = m.slice(0, 6561),
                             u = r[0],
                             v = i.signatureFragment(u, t);
                         o.bundle[c].signatureMessageFragment = h.trytes(v);
                         for (var w = 1; w < g; w++)
                             if (o.bundle[c + w].address === e && 0 === o.bundle[c + w].value) {
                                 var x = m.slice(6561 * w, 6561 * (w + 1)),
                                     y = r[w],
                                     z = i.signatureFragment(y, x);
                                 o.bundle[c + w].signatureMessageFragment = h.trytes(z)
                             }
                     }
                 var A = [];
                 return o.bundle.forEach(function(a) {
                     A.push(k.transactionTrytes(a))
                 }), d(null, A.reverse())
             }
             var g = this;
             if (3 === arguments.length && "[object Function]" === Object.prototype.toString.call(c) && (d = c, c = {}), !f.isTrytes(a)) return d(e.invalidSeed());
             if (b.forEach(function(a) {
                     return a.message = a.message ? a.message : "", a.tag = a.tag ? a.tag : "", 90 !== a.address.length || k.isValidChecksum(a.address) ? void(a.address = k.noChecksum(a.address)) : d(e.invalidChecksum(a.address))
                 }), !f.isTransfersArray(b)) return d(e.invalidTransfers());
             if (c.inputs && !f.isInputs(c.inputs)) return d(e.invalidInputs());
             for (var r, l = c.address || null, n = (c.inputs || [], c.security || 2), o = new j, p = 0, q = [], s = 0; s < b.length; s++) {
                 var t = 1;
                 if (b[s].message.length > 2187) {
                     t += Math.floor(b[s].message.length / 2187);
                     for (var u = b[s].message; u;) {
                         var v = u.slice(0, 2187);
                         u = u.slice(2187, u.length);
                         for (var w = 0; v.length < 2187; w++) v += "9";
                         q.push(v)
                     }
                 } else {
                     var v = "";
                     b[s].message && (v = b[s].message.slice(0, 2187));
                     for (var w = 0; v.length < 2187; w++) v += "9";
                     q.push(v)
                 }
                 var x = Math.floor(Date.now() / 1e3);
                 r = b[s].tag ? b[s].tag : "999999999999999999999999999";
                 for (var w = 0; r.length < 27; w++) r += "9";
                 o.addEntry(t, b[s].address, b[s].value, r, x), p += parseInt(b[s].value)
             }
             if (!p) {
                 o.finalize(), o.addTrytes(q);
                 var z = [];
                 return o.bundle.forEach(function(a) {
                     z.push(k.transactionTrytes(a))
                 }), d(null, z.reverse())
             }
             if (c.inputs) {
                 var y = [];
                 c.inputs.forEach(function(a) {
                     y.push(a.address)
                 }), g.getBalances(y, 100, function(a, b) {
                     for (var e = [], f = 0, g = 0; g < b.balances.length; g++) {
                         var h = parseInt(b.balances[g]);
                         if (h > 0) {
                             f += h;
                             var i = c.inputs[g];
                             if (i.balance = h, e.push(i), f >= p) break
                         }
                     }
                     return p > f ? d(new Error("Not enough balance")) : void A(e)
                 })
             } else g.getInputs(a, {
                 threshold: p,
                 security: n
             }, function(a, b) {
                 return a ? d(a) : void A(b.inputs)
             })
         }, m.prototype.traverseBundle = function(a, b, c, d) {
             var e = this;
             e.getTrytes(Array(a), function(a, f) {
                 if (a) return d(a);
                 var g = f[0];
                 if (!g) return d(new Error("Bundle transactions not visible"));
                 var h = k.transactionObject(g);
                 if (!h) return d(new Error("Invalid trytes, could not create object"));
                 if (!b && 0 !== h.currentIndex) return d(new Error("Invalid tail transaction supplied."));
                 if (b || (b = h.bundle), b !== h.bundle) return d(null, c);
                 if (0 === h.lastIndex && 0 === h.currentIndex) return d(null, Array(h));
                 var i = h.trunkTransaction;
                 return c.push(h), e.traverseBundle(i, b, c, d)
             })
         }, m.prototype.getBundle = function(a, b) {
             var c = this;
             return f.isHash(a) ? void c.traverseBundle(a, null, Array(), function(a, c) {
                 return a ? b(a) : k.isBundle(c) ? b(null, c) : b(new Error("Invalid Bundle provided"))
             }) : b(e.invalidInputs(a))
         }, m.prototype._bundlesFromAddresses = function(a, b, c) {
             var d = this;
             d.findTransactionObjects({
                 addresses: a
             }, function(a, e) {
                 if (a) return c(a);
                 var f = new Set,
                     g = new Set;
                 e.forEach(function(a) {
                     0 === a.currentIndex ? f.add(a.hash) : g.add(a.bundle)
                 }), d.findTransactionObjects({
                     bundles: Array.from(g)
                 }, function(a, e) {
                     if (a) return c(a);
                     e.forEach(function(a) {
                         0 === a.currentIndex && f.add(a.hash)
                     });
                     var g = [],
                         h = Array.from(f);
                     l.waterfall([function(a) {
                         b ? d.getLatestInclusion(h, function(b, d) {
                             return b ? c(b) : void a(null, d)
                         }) : a(null, [])
                     }, function(a, e) {
                         l.mapSeries(h, function(c, e) {
                             d.getBundle(c, function(d, f) {
                                 if (!d) {
                                     if (b) {
                                         var i = a[h.indexOf(c)];
                                         f.forEach(function(a) {
                                             a.persistence = i
                                         })
                                     }
                                     g.push(f)
                                 }
                                 e(null, !0)
                             })
                         }, function(a, b) {
                             return g.sort(function(a, b) {
                                 var c = parseInt(a[0].timestamp),
                                     d = parseInt(b[0].timestamp);
                                 return c < d ? -1 : c > d ? 1 : 0
                             }), c(a, g)
                         })
                     }])
                 })
             })
         }, m.prototype.getTransfers = function(a, b, c) {
             var d = this;
             if (2 === arguments.length && "[object Function]" === Object.prototype.toString.call(b) && (c = b, b = {}), !f.isTrytes(a)) return c(e.invalidSeed(a));
             var g = b.start || 0,
                 h = b.end || null,
                 i = b.inclusionStates || null,
                 j = b.security || 2;
             if (g > h || h > g + 500) return c(new Error("Invalid inputs provided"));
             var k = {
                 index: g,
                 total: h ? h - g : null,
                 returnAll: !0,
                 security: j
             };
             d.getNewAddress(a, k, function(a, b) {
                 return a ? c(a) : d._bundlesFromAddresses(b, i, c)
             })
         }, m.prototype.getAccountData = function(a, b, c) {
             var d = this;
             if (2 === arguments.length && "[object Function]" === Object.prototype.toString.call(b) && (c = b, b = {}), !f.isTrytes(a)) return c(e.invalidSeed(a));
             var g = b.start || 0,
                 h = b.end || null,
                 i = b.security || 2;
             if (g > h || h > g + 500) return c(new Error("Invalid inputs provided"));
             var j = {
                     addresses: [],
                     transfers: [],
                     balance: 0
                 },
                 k = {
                     index: g,
                     total: h ? h - g : null,
                     returnAll: !0,
                     security: i
                 };
             d.getNewAddress(a, k, function(a, b) {
                 return a ? c(a) : (j.addresses = b.slice(0, -1), void d._bundlesFromAddresses(b, !0, function(a, b) {
                     return a ? c(a) : (j.transfers = b, void d.getBalances(j.addresses, 100, function(a, b) {
                         return b.balances.forEach(function(a) {
                             j.balance += parseInt(a)
                         }), c(null, j)
                     }))
                 }))
             })
         }, m.prototype.shouldYouReplay = function(a) {
             var b = this,
                 a = k.noChecksum(a);
             b.findTransactions({
                 address: a
             }, function(a, c) {
                 b.getTrytes(c, function(a, c) {
                     var d = [];
                     return c.forEach(function(a) {
                         var b = k.transactionObject(c);
                         b.value < 0 && d.push(b.hash)
                     }), !(d.length > 0) || void b.getLatestInclusion(d, function(a, b) {
                         return b.indexOf(!0) === -1
                     })
                 })
             })
         }, b.exports = m
     }, {
         "../crypto/bundle": 4,
         "../crypto/converter": 5,
         "../crypto/curl": 6,
         "../crypto/signing": 7,
         "../errors/inputErrors": 8,
         "../utils/inputValidator": 14,
         "../utils/utils": 16,
         "./apiCommands": 3,
         async: 17
     }],
     3: [function(a, b, c) {
         var d = function(a, b, c, d) {
                 var e = {
                     command: "attachToTangle",
                     trunkTransaction: a,
                     branchTransaction: b,
                     minWeightMagnitude: c,
                     trytes: d
                 };
                 return e
             },
             e = function(a) {
                 var b = {
                         command: "findTransactions"
                     },
                     c = Object.keys(a);
                 return c.forEach(function(c) {
                     b[c] = a[c]
                 }), b
             },
             f = function(a, b) {
                 var c = {
                     command: "getBalances",
                     addresses: a,
                     threshold: b
                 };
                 return c
             },
             g = function(a, b) {
                 var c = {
                     command: "getInclusionStates",
                     transactions: a,
                     tips: b
                 };
                 return c
             },
             h = function() {
                 var a = {
                     command: "getNodeInfo"
                 };
                 return a
             },
             i = function() {
                 var a = {
                     command: "getNeighbors"
                 };
                 return a
             },
             j = function(a) {
                 var b = {
                     command: "addNeighbors",
                     uris: a
                 };
                 return b
             },
             k = function(a) {
                 var b = {
                     command: "removeNeighbors",
                     uris: a
                 };
                 return b
             },
             l = function() {
                 var a = {
                     command: "getTips"
                 };
                 return a
             },
             m = function(a) {
                 var b = {
                     command: "getTransactionsToApprove",
                     depth: a
                 };
                 return b
             },
             n = function(a) {
                 var b = {
                     command: "getTrytes",
                     hashes: a
                 };
                 return b
             },
             o = function() {
                 var a = {
                     command: "interruptAttachingToTangle"
                 };
                 return a
             },
             p = function(a) {
                 var b = {
                     command: "broadcastTransactions",
                     trytes: a
                 };
                 return b
             },
             q = function(a) {
                 var b = {
                     command: "storeTransactions",
                     trytes: a
                 };
                 return b
             };
         b.exports = {
             attachToTangle: d,
             findTransactions: e,
             getBalances: f,
             getInclusionStates: g,
             getNodeInfo: h,
             getNeighbors: i,
             addNeighbors: j,
             removeNeighbors: k,
             getTips: l,
             getTransactionsToApprove: m,
             getTrytes: n,
             interruptAttachingToTangle: o,
             broadcastTransactions: p,
             storeTransactions: q
         }
     }, {}],
     4: [function(a, b, c) {
         function f() {
             this.bundle = []
         }
         var d = a("./curl"),
             e = a("./converter");
         f.prototype.addEntry = function(a, b, c, d, e, f) {
             for (var g = 0; g < a; g++) {
                 var h = new Object;
                 h.address = b, h.value = 0 == g ? c : 0, h.tag = d, h.timestamp = e, this.bundle[this.bundle.length] = h
             }
         }, f.prototype.addTrytes = function(a) {
             for (var c = "", d = "999999999999999999999999999999999999999999999999999999999999999999999999999999999", e = 0; c.length < 2187; e++) c += "9";
             for (var f = 0; f < this.bundle.length; f++) this.bundle[f].signatureMessageFragment = a[f] ? a[f] : c, this.bundle[f].trunkTransaction = d, this.bundle[f].branchTransaction = d, this.bundle[f].nonce = d
         }, f.prototype.finalize = function() {
             var a = new d;
             a.initialize();
             for (var b = 0; b < this.bundle.length; b++) {
                 for (var c = e.trits(this.bundle[b].value); c.length < 81;) c[c.length] = 0;
                 for (var f = e.trits(this.bundle[b].timestamp); f.length < 27;) f[f.length] = 0;
                 for (var g = e.trits(this.bundle[b].currentIndex = b); g.length < 27;) g[g.length] = 0;
                 for (var h = e.trits(this.bundle[b].lastIndex = this.bundle.length - 1); h.length < 27;) h[h.length] = 0;
                 a.absorb(e.trits(this.bundle[b].address + e.trytes(c) + this.bundle[b].tag + e.trytes(f) + e.trytes(g) + e.trytes(h)))
             }
             var i = [];
             a.squeeze(i), i = e.trytes(i);
             for (var b = 0; b < this.bundle.length; b++) this.bundle[b].bundle = i
         }, f.prototype.normalizedBundle = function(a) {
             for (var b = [], c = 0; c < 3; c++) {
                 for (var d = 0, f = 0; f < 27; f++) d += b[27 * c + f] = e.value(e.trits(a.charAt(27 * c + f)));
                 if (d >= 0) {
                     for (; d-- > 0;)
                         for (var f = 0; f < 27; f++)
                             if (b[27 * c + f] > -13) {
                                 b[27 * c + f]--;
                                 break
                             }
                 } else
                     for (; d++ < 0;)
                         for (var f = 0; f < 27; f++)
                             if (b[27 * c + f] < 13) {
                                 b[27 * c + f]++;
                                 break
                             }
             }
             return b
         }, b.exports = f
     }, {
         "./converter": 5,
         "./curl": 6
     }],
     5: [function(a, b, c) {
         var d = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ",
             e = [
                 [0, 0, 0],
                 [1, 0, 0],
                 [-1, 1, 0],
                 [0, 1, 0],
                 [1, 1, 0],
                 [-1, -1, 1],
                 [0, -1, 1],
                 [1, -1, 1],
                 [-1, 0, 1],
                 [0, 0, 1],
                 [1, 0, 1],
                 [-1, 1, 1],
                 [0, 1, 1],
                 [1, 1, 1],
                 [-1, -1, -1],
                 [0, -1, -1],
                 [1, -1, -1],
                 [-1, 0, -1],
                 [0, 0, -1],
                 [1, 0, -1],
                 [-1, 1, -1],
                 [0, 1, -1],
                 [1, 1, -1],
                 [-1, -1, 0],
                 [0, -1, 0],
                 [1, -1, 0],
                 [-1, 0, 0]
             ],
             f = function(a, b) {
                 var c = b || [];
                 if (Number.isInteger(a)) {
                     for (var f = a < 0 ? -a : a; f > 0;) {
                         var g = f % 3;
                         f = Math.floor(f / 3), g > 1 && (g = -1, f++), c[c.length] = g
                     }
                     if (a < 0)
                         for (var h = 0; h < c.length; h++) c[h] = -c[h]
                 } else
                     for (var h = 0; h < a.length; h++) {
                         var i = d.indexOf(a.charAt(h));
                         c[3 * h] = e[i][0], c[3 * h + 1] = e[i][1], c[3 * h + 2] = e[i][2]
                     }
                 return c
             },
             g = function(a) {
                 for (var b = "", c = 0; c < a.length; c += 3)
                     for (var f = 0; f < d.length; f++)
                         if (e[f][0] == a[c] && e[f][1] == a[c + 1] && e[f][2] == a[c + 2]) {
                             b += d.charAt(f);
                             break
                         }
                 return b
             },
             h = function(a) {
                 for (var b = 0, c = a.length; c-- > 0;) b = 3 * b + a[c];
                 return b
             };
         b.exports = {
             trits: f,
             trytes: g,
             value: h
         }
     }, {}],
     6: [function(a, b, c) {
         function e() {
             this.truthTable = [1, 0, -1, 1, -1, 0, -1, 1, 0]
         }
         a("./converter");
         e.prototype.initialize = function(a) {
             if (a) this.state = a;
             else {
                 this.state = [];
                 for (var b = 0; b < 729; b++) this.state[b] = 0
             }
         }, e.prototype.absorb = function(a) {
             for (var b = 0; b < a.length;) {
                 for (var c = 0; b < a.length && c < 243;) this.state[c++] = a[b++];
                 this.transform(this.state)
             }
         }, e.prototype.squeeze = function(a) {
             for (var b = 0; b < 243; b++) a[b] = this.state[b];
             this.transform(this.state)
         }, e.prototype.transform = function() {
             for (var a = [], b = 0, c = 0; c < 27; c++) {
                 a = this.state.slice();
                 for (var d = 0; d < 729; d++) this.state[d] = this.truthTable[a[b] + 3 * a[b += b < 365 ? 364 : -365] + 4]
             }
         }, b.exports = e
     }, {
         "./converter": 5
     }],
     7: [function(a, b, c) {
         var d = a("./curl"),
             e = a("./converter"),
             f = a("./bundle"),
             g = function(a, b, c) {
                 for (var e = a.slice(), f = 0; f < b; f++)
                     for (var g = 0; g < 243 && ++e[g] > 1; g++) e[g] = -1;
                 var h = new d;
                 h.initialize(), h.absorb(e), h.squeeze(e), h.initialize(), h.absorb(e);
                 for (var i = [], j = 0, k = []; c-- > 0;)
                     for (var f = 0; f < 27; f++) {
                         h.squeeze(k);
                         for (var g = 0; g < 243; g++) i[j++] = k[g]
                     }
                 return i
             },
             h = function(a) {
                 for (var b = [], c = [], e = 0; e < Math.floor(a.length / 6561); e++) {
                     for (var f = a.slice(6561 * e, 6561 * (e + 1)), g = 0; g < 27; g++) {
                         c = f.slice(243 * g, 243 * (g + 1));
                         for (var h = 0; h < 26; h++) {
                             var i = new d;
                             i.initialize(), i.absorb(c), i.squeeze(c)
                         }
                         for (var h = 0; h < 243; h++) f[243 * g + h] = c[h]
                     }
                     var j = new d;
                     j.initialize(), j.absorb(f), j.squeeze(c);
                     for (var g = 0; g < 243; g++) b[243 * e + g] = c[g]
                 }
                 return b
             },
             i = function(a) {
                 var b = [],
                     c = new d;
                 return c.initialize(), c.absorb(a), c.squeeze(b), b
             },
             j = function(a, b) {
                 var c = [],
                     e = new d;
                 e.initialize();
                 for (var f = 0; f < 27; f++) {
                     c = b.slice(243 * f, 243 * (f + 1));
                     for (var g = a[f] + 13; g-- > 0;) {
                         var h = new d;
                         h.initialize(), h.absorb(c), h.squeeze(c)
                     }
                     e.absorb(c)
                 }
                 return e.squeeze(c), c
             },
             k = function(a, b) {
                 for (var c = b.slice(), e = [], f = new d, g = 0; g < 27; g++) {
                     e = c.slice(243 * g, 243 * (g + 1));
                     for (var h = 0; h < 13 - a[g]; h++) f.initialize(), f.absorb(e), f.squeeze(e);
                     for (var h = 0; h < 243; h++) c[243 * g + h] = e[h]
                 }
                 return c
             },
             l = function(a, b, c) {
                 for (var d = this, g = new f, h = [], i = g.normalizedBundle(c), k = 0; k < 3; k++) h[k] = i.slice(27 * k, 27 * (k + 1));
                 for (var l = [], k = 0; k < b.length; k++)
                     for (var m = j(h[k % 3], e.trits(b[k])), n = 0; n < 243; n++) l[243 * k + n] = m[n];
                 var o = e.trytes(d.address(l));
                 return a === o
             };
         b.exports = {
             key: g,
             digests: h,
             address: i,
             digest: j,
             signatureFragment: k,
             validateSignatures: l
         }
     }, {
         "./bundle": 4,
         "./converter": 5,
         "./curl": 6
     }],
     8: [function(a, b, c) {
         b.exports = {
             invalidTrytes: function() {
                 return new Error("Invalid Trytes provided")
             },
             invalidSeed: function() {
                 return new Error("Invalid Seed provided")
             },
             invalidChecksum: function(a) {
                 return new Error("Invalid Checksum supplied for address: " + a)
             },
             invalidAttachedTrytes: function() {
                 return new Error("Invalid attached Trytes provided")
             },
             invalidTransfers: function() {
                 return new Error("Invalid transfers object")
             },
             invalidKey: function() {
                 return new Error("You have provided an invalid key value")
             },
             invalidTrunkOrBranch: function(a) {
                 return new Error("You have provided an invalid hash as a trunk/branch: " + a)
             },
             invalidUri: function(a) {
                 return new Error("You have provided an invalid URI for your Neighbor: " + a)
             },
             notInt: function() {
                 return new Error("One of your inputs is not an integer")
             },
             invalidInputs: function() {
                 return new Error("Invalid inputs provided")
             }
         }
     }, {}],
     9: [function(a, b, c) {
         b.exports = {
             invalidResponse: function(a) {
                 return new Error("Invalid Response: " + a)
             },
             noConnection: function(a) {
                 return new Error("No connection to host: " + a)
             },
             requestError: function(a) {
                 return new Error("Request Error: " + a)
             }
         }
     }, {}],
     10: [function(a, b, c) {
         function h(b) {
             b = b || {}, this.host = b.host ? b.host : "http://localhost", this.port = b.port ? b.port : 14265, this.provider = b.provider || this.host.replace(/\/$/, "") + ":" + this.port, this.sandbox = b.sandbox || !1, this.token = b.token || !1, this.sandbox && (this.sandbox = this.provider.replace(/\/$/, ""), this.provider = this.sandbox + "/commands"), this._makeRequest = new e(this.provider, this.token), this.api = new f(this._makeRequest, this.sandbox), this.utils = d, this.valid = a("./utils/inputValidator"), this.multisig = new g(this._makeRequest)
         }
         var d = a("./utils/utils"),
             e = a("./utils/makeRequest"),
             f = a("./api/api"),
             g = a("./multisig/multisig");
         h.prototype.changeNode = function(a) {
             a = a || {}, this.host = a.host ? a.host : "http://localhost", this.port = a.port ? a.port : 14265, this.provider = a.provider || this.host + ":" + this.port, this._makeRequest.setProvider(this.provider)
         }, b.exports = h
     }, {
         "./api/api": 2,
         "./multisig/multisig": 11,
         "./utils/inputValidator": 14,
         "./utils/makeRequest": 15,
         "./utils/utils": 16
     }],
     11: [function(a, b, c) {
         function k(a) {
             this._makeRequest = a
         }
         var d = a("../crypto/signing"),
             e = a("../crypto/converter"),
             f = a("../crypto/curl"),
             g = a("../crypto/bundle"),
             h = a("../utils/utils"),
             i = a("../utils/inputValidator"),
             j = a("../errors/inputErrors");
         k.prototype.getKey = function(a, b, c) {
             return e.trytes(d.key(e.trits(a), b, c))
         }, k.prototype.getDigest = function(a, b, c) {
             var f = d.key(e.trits(a), b, c);
             return e.trytes(d.digests(f))
         }, k.prototype.addAddressDigest = function(a, b) {
             var c = e.trits(a),
                 d = b ? e.trits(b) : [],
                 g = new f;
             return g.initialize(d), g.absorb(c), e.trytes(g.state)
         }, k.prototype.finalizeAddress = function(a) {
             var b = e.trits(a),
                 c = new f;
             c.initialize(b);
             var d = [];
             return c.squeeze(d), e.trytes(d)
         }, k.prototype.validateAddress = function(a, b) {
             var c = new f;
             c.initialize(), b.forEach(function(a) {
                 c.absorb(e.trits(a))
             });
             var d = [];
             return c.squeeze(d), e.trytes(d) === a
         }, k.prototype.initiateTransfer = function(a, b, c, d, e) {
             var f = this;
             if (d.forEach(function(a) {
                     a.message = a.message ? a.message : "", a.tag = a.tag ? a.tag : "", a.address = h.noChecksum(a.address)
                 }), !i.isTransfersArray(d)) return e(j.invalidTransfers());
             if (!i.isInt(a)) return e(j.invalidInputs());
             if (!i.isAddress(b)) return e(j.invalidTrytes());
             if (c && !i.isAddress(c)) return e(j.invalidTrytes());
             for (var n, k = new g, l = 0, m = [], o = 0; o < d.length; o++) {
                 var p = 1;
                 if (d[o].message.length > 2187) {
                     p += Math.floor(d[o].message.length / 2187);
                     for (var q = d[o].message; q;) {
                         var r = q.slice(0, 2187);
                         q = q.slice(2187, q.length);
                         for (var s = 0; r.length < 2187; s++) r += "9";
                         m.push(r)
                     }
                 } else {
                     var r = "";
                     d[o].message && (r = d[o].message.slice(0, 2187));
                     for (var s = 0; r.length < 2187; s++) r += "9";
                     m.push(r)
                 }
                 var t = Math.floor(Date.now() / 1e3);
                 n = d[o].tag ? d[o].tag : "999999999999999999999999999";
                 for (var s = 0; n.length < 27; s++) n += "9";
                 k.addEntry(p, d[o].address.slice(0, 81), d[o].value, n, t), l += parseInt(d[o].value)
             }
             if (!l) return e(new Error("Invalid value transfer: the transfer does not require a signature."));
             var u = {
                 command: "getBalances",
                 addresses: new Array(b),
                 threshold: 100
             };
             f._makeRequest.send(u, function(d, f) {
                 var g = parseInt(f.balances[0]);
                 if (g > 0) {
                     var h = 0 - g,
                         i = Math.floor(Date.now() / 1e3);
                     k.addEntry(a, b, h, n, i)
                 }
                 if (l > g) return e(new Error("Not enough balance."));
                 if (g > l) {
                     var j = g - l;
                     if (!c) return e(new Error("No remainder address defined"));
                     k.addEntry(1, c, j, n, i)
                 }
                 return k.finalize(), k.addTrytes(m), e(null, k.bundle)
             })
         }, k.prototype.addSignature = function(a, b, c, f) {
             var h = new g;
             h.bundle = a;
             for (var j = c.length / 2187, c = e.trits(c), k = 0, l = 0; l < h.bundle.length; l++)
                 if (h.bundle[l].address === b) {
                     if (i.isNinesTrytes(h.bundle[l].signatureMessageFragment)) {
                         for (var m = h.bundle[l].bundle, n = c.slice(0, 6561), o = h.normalizedBundle(m), p = [], q = 0; q < 3; q++) p[q] = o.slice(27 * q, 27 * (q + 1));
                         var r = p[k % 3],
                             s = d.signatureFragment(r, n);
                         h.bundle[l].signatureMessageFragment = e.trytes(s);
                         for (var t = 1; t < j; t++) {
                             var u = c.slice(6561 * t, 6561 * (t + 1)),
                                 v = p[(k + t) % 3],
                                 w = d.signatureFragment(v, u);
                             h.bundle[l + t].signatureMessageFragment = e.trytes(w)
                         }
                         break
                     }
                     k++
                 }
             return f(null, h.bundle)
         }, b.exports = k
     }, {
         "../crypto/bundle": 4,
         "../crypto/converter": 5,
         "../crypto/curl": 6,
         "../crypto/signing": 7,
         "../errors/inputErrors": 8,
         "../utils/inputValidator": 14,
         "../utils/utils": 16
     }],
     12: [function(a, b, c) {
         function d(a) {
             if ("string" != typeof a) return null;
             for (var b = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ", c = "", d = 0; d < a.length; d++) {
                 var e = a[d],
                     f = e.charCodeAt(0);
                 if (f > 255) return null;
                 var g = f % 27,
                     h = (f - g) / 27,
                     i = b[g] + b[h];
                 c += i
             }
             return c
         }

         function e(a) {
             if ("string" != typeof a) return null;
             for (var b = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ", c = "", d = 0; d < a.length; d += 2) {
                 var e = a[d] + a[d + 1],
                     f = b.indexOf(e[0]),
                     g = b.indexOf(e[1]),
                     h = f + 27 * g,
                     i = String.fromCharCode(h);
                 c += i
             }
             return c
         }
         b.exports = {
             toTrytes: d,
             fromTrytes: e
         }
     }, {}],
     13: [function(a, b, c) {
         function f(a) {
             if (!e.isArray(a) || void 0 === a[0]) return null;
             var b = a[0].signatureMessageFragment[0] + a[0].signatureMessageFragment[1];
             if ("OD" !== b) return null;
             for (var c = 0, f = !0, g = "", h = 0, i = !1, j = ""; c < a.length && f;) {
                 for (var k = a[c].signatureMessageFragment, l = 0; l < k.length; l += 9) {
                     var m = k.slice(l, l + 9);
                     g += m;
                     for (var n = g.length - g.length % 2, o = g.slice(h, n), p = 0; p < o.length; p += 2) {
                         var q = o[p] + o[p + 1];
                         if (i && "99" === q) {
                             f = !1;
                             break
                         }
                         j += d.fromTrytes(q), "QD" === q && (i = !0)
                     }
                     if (!f) break;
                     h += o.length
                 }
                 c += 1
             }
             return f ? null : j
         }
         var d = a("./asciiToTrytes"),
             e = a("./inputValidator");
         b.exports = f
     }, {
         "./asciiToTrytes": 12,
         "./inputValidator": 14
     }],
     14: [function(a, b, c) {
         var d = function(a) {
                 if (90 === a.length) {
                     if (!e(a, 90)) return !1
                 } else if (!e(a, 81)) return !1;
                 return !0
             },
             e = function(a, b) {
                 b || (b = "0,");
                 var c = new RegExp("^[9A-Z]{" + b + "}$");
                 return c.test(a) && j(a)
             },
             f = function(a) {
                 return /^[9]+$/.test(a) && j(a)
             },
             g = function(a) {
                 return Number.isInteger(a)
             },
             h = function(a) {
                 return /^(\d+\.?\d{0,9}|\.\d{0,9})$/.test(a)
             },
             i = function(a) {
                 return !!e(a, 81)
             },
             j = function(a) {
                 return "string" == typeof a
             },
             k = function(a) {
                 return a instanceof Array
             },
             l = function(a) {
                 return "object" == typeof a
             },
             m = function(a) {
                 if (!k(a)) return !1;
                 for (var b = 0; b < a.length; b++) {
                     var c = a[b],
                         f = c.address;
                     if (!d(f)) return !1;
                     var h = c.value;
                     if (!g(h)) return !1;
                     var i = c.message;
                     if (!e(i, "0,")) return !1;
                     var j = c.tag;
                     if (!e(j, "0,27")) return !1
                 }
                 return !0
             },
             n = function(a) {
                 if (!k(a)) return !1;
                 for (var b = 0; b < a.length; b++) {
                     var c = a[b];
                     if (90 === c.length) {
                         if (!e(c, 90)) return !1
                     } else if (!e(c, 81)) return !1
                 }
                 return !0
             },
             o = function(a) {
                 if (!k(a)) return !1;
                 for (var b = 0; b < a.length; b++) {
                     var c = a[b];
                     if (!e(c, 2673)) return !1
                 }
                 return !0
             },
             p = function(a) {
                 if (!k(a)) return !1;
                 for (var b = 0; b < a.length; b++) {
                     var c = a[b];
                     if (!e(c, 2673)) return !1;
                     var d = c.slice(2430);
                     if (/^[9]+$/.test(d)) return !1
                 }
                 return !0
             },
             q = function(a) {
                 if (!k(a) || 0 === a.length) return !1;
                 var b = !0;
                 return a.forEach(function(a) {
                     for (var c = [{
                             key: "hash",
                             validator: i,
                             args: null
                         }, {
                             key: "signatureMessageFragment",
                             validator: e,
                             args: 2187
                         }, {
                             key: "address",
                             validator: i,
                             args: null
                         }, {
                             key: "value",
                             validator: g,
                             args: null
                         }, {
                             key: "tag",
                             validator: e,
                             args: 27
                         }, {
                             key: "timestamp",
                             validator: g,
                             args: null
                         }, {
                             key: "currentIndex",
                             validator: g,
                             args: null
                         }, {
                             key: "lastIndex",
                             validator: g,
                             args: null
                         }, {
                             key: "bundle",
                             validator: i,
                             args: null
                         }, {
                             key: "trunkTransaction",
                             validator: i,
                             args: null
                         }, {
                             key: "branchTransaction",
                             validator: i,
                             args: null
                         }, {
                             key: "nonce",
                             validator: i,
                             args: null
                         }], d = 0; d < c.length; d++) {
                         var f = c[d].key,
                             h = c[d].validator,
                             j = c[d].args;
                         if (!a.hasOwnProperty(f)) {
                             b = !1;
                             break
                         }
                         if (!h(a[f], j)) {
                             b = !1;
                             break
                         }
                     }
                 }), b
             },
             r = function(a) {
                 if (!k(a)) return !1;
                 for (var b = 0; b < a.length; b++) {
                     var c = a[b];
                     if (!c.hasOwnProperty("security") || !c.hasOwnProperty("keyIndex") || !c.hasOwnProperty("address")) return !1;
                     if (!d(c.address)) return !1;
                     if (!g(c.security)) return !1;
                     if (!g(c.keyIndex)) return !1
                 }
                 return !0
             },
             s = function(a) {
                 var b = /^udp:\/\/([\[][^\]\.]*[\]]|[^\[\]:]*)[:]{0,1}([0-9]{1,}$|$)/i,
                     c = /[\[]{0,1}([^\[\]]*)[\]]{0,1}/,
                     d = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))|(^\s*((?=.{1,255}$)(?=.*[A-Za-z].*)[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*)\s*$)/;
                 return !!b.test(a) && d.test(c.exec(b.exec(a)[1])[1])
             };
         b.exports = {
             isAddress: d,
             isTrytes: e,
             isNinesTrytes: f,
             isValue: g,
             isHash: i,
             isTransfersArray: m,
             isArrayOfHashes: n,
             isArrayOfTrytes: o,
             isArrayOfAttachedTrytes: p,
             isArrayOfTxObjects: q,
             isInputs: r,
             isString: j,
             isNum: h,
             isArray: k,
             isObject: l,
             isUri: s
         }
     }, {}],
     15: [function(a, b, c) {
         function f(a, b) {
             this.provider = a || "http://localhost:14265", this.token = b
         }
         var d = a("xmlhttprequest").XMLHttpRequest,
             e = a("../errors/requestErrors");
         f.prototype.setProvider = function(a) {
             this.provider = a || "http://localhost:14265"
         }, f.prototype.open = function() {
             var a = new d;
             return a.open("POST", this.provider, !0), this.token && (a.withCredentials = !0, a.setRequestHeader("Authorization", "token " + this.token)), a
         }, f.prototype.send = function(a, b) {
             var c = this,
                 d = this.open();
             d.onreadystatechange = function() {
                 if (4 === d.readyState) {
                     var e = d.responseText;
                     return c.prepareResult(e, a.command, b)
                 }
             };
             try {
                 d.send(JSON.stringify(a))
             } catch (a) {
                 return b(e.invalidResponse(a))
             }
         }, f.prototype.sandboxSend = function(a, b) {
             var c = setInterval(function() {
                 var f = new d;
                 f.onreadystatechange = function() {
                     if (4 === f.readyState) {
                         var a;
                         try {
                             a = JSON.parse(f.responseText)
                         } catch (a) {
                             return b(e.invalidResponse(a))
                         }
                         if ("FINISHED" === a.status) {
                             var d = a.attachToTangleResponse.trytes;
                             return clearInterval(c), b(null, d)
                         }
                         if ("FAILED" === a.status) return clearInterval(c), b(new Error("Sandbox transaction processing failed. Please retry."))
                     }
                 };
                 try {
                     f.open("GET", a, !0), f.send(JSON.stringify())
                 } catch (c) {
                     return b(new Error("No connection to Sandbox, failed with job: ", a))
                 }
             }, 5e3)
         }, f.prototype.prepareResult = function(a, b, c) {
             var f, d = {
                 getNeighbors: "neighbors",
                 addNeighbors: "addedNeighbors",
                 removeNeighbors: "removedNeighbors",
                 getTips: "hashes",
                 findTransactions: "hashes",
                 getTrytes: "trytes",
                 getInclusionStates: "states",
                 attachToTangle: "trytes"
             };
             try {
                 a = JSON.parse(a)
             } catch (b) {
                 f = e.invalidResponse(a), a = null
             }
             return !f && a.error && (f = e.requestError(a.error), a = null), !f && a.exception && (f = e.requestError(a.exception), a = null), a && d.hasOwnProperty(b) && (a = "attachToTangle" === b && a.hasOwnProperty("id") ? a : a[d[b]]), c(f, a)
         }, b.exports = f
     }, {
         "../errors/requestErrors": 9,
         xmlhttprequest: 53
     }],
     16: [function(a, b, c) {
         var d = a("./inputValidator"),
             f = (a("./makeRequest"), a("../crypto/curl")),
             g = a("../crypto/converter"),
             h = a("./asciiToTrytes"),
             i = a("./extractJson"),
             j = a("../crypto/signing"),
             k = {
                 i: 1,
                 Ki: 1e3,
                 Mi: 1e6,
                 Gi: 1e9,
                 Ti: 1e12,
                 Pi: 1e15
             },
             l = function(a, b, c) {
                 if (!d.isNum(a)) throw new Error("Invalid value input");
                 if (void 0 === k[b] || void 0 === k[c]) throw new Error("Invalid unit provided");
                 var e = parseFloat(a),
                     f = e * k[b] / k[c];
                 return f
             },
             m = function(a) {
                 var b = d.isString(a);
                 b && (a = Array(a));
                 var c = [];
                 return a.forEach(function(a) {
                     if (81 !== a.length) throw new Error("Invalid address input");
                     var b = new f;
                     b.initialize(), b.state = g.trits(a, b.state), b.transform();
                     var d = g.trytes(b.state).substring(0, 9);
                     c.push(a + d)
                 }), b ? c[0] : c
             },
             n = function(a) {
                 var b = d.isString(a);
                 b && (a = Array(a));
                 var c = [];
                 return a.forEach(function(a) {
                     c.push(a.slice(0, 81))
                 }), b ? c[0] : c
             },
             o = function(a) {
                 var b = n(a),
                     c = m(b);
                 return c === a
             },
             p = function(a) {
                 if (a) {
                     for (var b = 2279; b < 2295; b++)
                         if ("9" !== a.charAt(b)) return null;
                     var c = new Object,
                         d = g.trits(a),
                         e = [],
                         h = new f;
                     return h.initialize(), h.absorb(d), h.squeeze(e), c.hash = g.trytes(e), c.signatureMessageFragment = a.slice(0, 2187), c.address = a.slice(2187, 2268), c.value = g.value(d.slice(6804, 6837)), c.tag = a.slice(2295, 2322), c.timestamp = g.value(d.slice(6966, 6993)), c.currentIndex = g.value(d.slice(6993, 7020)), c.lastIndex = g.value(d.slice(7020, 7047)), c.bundle = a.slice(2349, 2430), c.trunkTransaction = a.slice(2430, 2511), c.branchTransaction = a.slice(2511, 2592), c.nonce = a.slice(2592, 2673), c
                 }
             },
             q = function(a) {
                 for (var b = g.trits(a.value); b.length < 81;) b[b.length] = 0;
                 for (var c = g.trits(a.timestamp); c.length < 27;) c[c.length] = 0;
                 for (var d = g.trits(a.currentIndex); d.length < 27;) d[d.length] = 0;
                 for (var e = g.trits(a.lastIndex); e.length < 27;) e[e.length] = 0;
                 return a.signatureMessageFragment + a.address + g.trytes(b) + a.tag + g.trytes(c) + g.trytes(d) + g.trytes(e) + a.bundle + a.trunkTransaction + a.branchTransaction + a.nonce
             },
             r = function(a, b) {
                 var c = {
                     sent: [],
                     received: []
                 };
                 return a.forEach(function(a) {
                     var d = !1;
                     a.forEach(function(e, f) {
                         if (b.indexOf(e.address) > -1) {
                             var g = e.currentIndex === e.lastIndex && 0 !== e.lastIndex;
                             e.value < 0 && !d && !g ? (c.sent.push(a), d = !0) : e.value >= 0 && !d && !g && c.received.push(a)
                         }
                     })
                 }), c
             },
             s = function(a, b) {
                 for (var c, e = [], f = 0; f < a.length; f++)
                     if (a[f].address === b) {
                         if (c = a[f].bundle, d.isNinesTrytes(a[f].signatureMessageFragment)) break;
                         e.push(a[f].signatureMessageFragment)
                     }
                 return j.validateSignatures(b, e, c)
             },
             t = function(a) {
                 if (!d.isArrayOfTxObjects(a)) return !1;
                 var b = 0,
                     e = a[0].bundle,
                     h = [],
                     i = new f;
                 i.initialize();
                 var k = [];
                 if (a.forEach(function(c, d) {
                         if (b += c.value, c.currentIndex !== d) return !1;
                         var e = q(c);
                         if (i.absorb(g.trits(e.slice(2187, 2349))), c.value < 0) {
                             for (var f = c.address, h = {
                                     address: f,
                                     signatureFragments: Array(c.signatureMessageFragment)
                                 }, j = d; j < a.length - 1; j++) {
                                 var l = a[j + 1];
                                 l.address === f && 0 === l.value && h.signatureFragments.push(l.signatureMessageFragment)
                             }
                             k.push(h)
                         }
                     }), 0 !== b) return !1;
                 i.squeeze(h);
                 var h = g.trytes(h);
                 if (h !== e) return !1;
                 if (a[a.length - 1].currentIndex !== a[a.length - 1].lastIndex) return !1;
                 for (var l = 0; l < k.length; l++) {
                     var m = j.validateSignatures(k[l].address, k[l].signatureFragments, e);
                     if (!m) return !1
                 }
                 return !0
             };
         b.exports = {
             convertUnits: l,
             addChecksum: m,
             noChecksum: n,
             isValidChecksum: o,
             transactionObject: p,
             transactionTrytes: q,
             categorizeTransfers: r,
             toTrytes: h.toTrytes,
             fromTrytes: h.fromTrytes,
             extractJson: i,
             validateSignatures: s,
             isBundle: t
         }
     }, {
         "../crypto/converter": 5,
         "../crypto/curl": 6,
         "../crypto/signing": 7,
         "./asciiToTrytes": 12,
         "./extractJson": 13,
         "./inputValidator": 14,
         "./makeRequest": 15
     }],
     17: [function(a, b, c) {
         (function(a, d) {
             ! function(a, d) {
                 "object" == typeof c && "undefined" != typeof b ? d(c) : "function" == typeof define && define.amd ? define(["exports"], d) : d(a.async = a.async || {})
             }(this, function(c) {
                 "use strict";

                 function e(a, b, c) {
                     switch (c.length) {
                         case 0:
                             return a.call(b);
                         case 1:
                             return a.call(b, c[0]);
                         case 2:
                             return a.call(b, c[0], c[1]);
                         case 3:
                             return a.call(b, c[0], c[1], c[2])
                     }
                     return a.apply(b, c)
                 }

                 function g(a, b, c) {
                     return b = f(void 0 === b ? a.length - 1 : b, 0),
                         function() {
                             for (var d = arguments, g = -1, h = f(d.length - b, 0), i = Array(h); ++g < h;) i[g] = d[b + g];
                             g = -1;
                             for (var j = Array(b + 1); ++g < b;) j[g] = d[g];
                             return j[b] = c(i), e(a, this, j)
                         }
                 }

                 function h(a) {
                     return a
                 }

                 function i(a, b) {
                     return g(a, b, h)
                 }

                 function k(a) {
                     return i(function(b, c) {
                         var d = j(function(c, d) {
                             var e = this;
                             return a(b, function(a, b) {
                                 a.apply(e, c.concat(b))
                             }, d)
                         });
                         return c.length ? d.apply(this, c) : d
                     })
                 }

                 function t(a) {
                     var b = q.call(a, s),
                         c = a[s];
                     try {
                         a[s] = void 0;
                         var d = !0
                     } catch (a) {}
                     var e = r.call(a);
                     return d && (b ? a[s] = c : delete a[s]), e
                 }

                 function w(a) {
                     return v.call(a)
                 }

                 function A(a) {
                     return null == a ? void 0 === a ? y : x : z && z in Object(a) ? t(a) : w(a)
                 }

                 function B(a) {
                     var b = typeof a;
                     return null != a && ("object" == b || "function" == b)
                 }

                 function G(a) {
                     if (!B(a)) return !1;
                     var b = A(a);
                     return b == D || b == E || b == C || b == F
                 }

                 function I(a) {
                     return "number" == typeof a && a > -1 && a % 1 == 0 && a <= H
                 }

                 function J(a) {
                     return null != a && I(a.length) && !G(a)
                 }

                 function L() {}

                 function M(a) {
                     return function() {
                         if (null !== a) {
                             var b = a;
                             a = null, b.apply(this, arguments)
                         }
                     }
                 }

                 function P(a, b) {
                     for (var c = -1, d = Array(a); ++c < a;) d[c] = b(c);
                     return d
                 }

                 function Q(a) {
                     return null != a && "object" == typeof a
                 }

                 function S(a) {
                     return Q(a) && A(a) == R
                 }

                 function Y() {
                     return !1
                 }

                 function fa(a, b) {
                     return b = null == b ? da : b, !!b && ("number" == typeof a || ea.test(a)) && a > -1 && a % 1 == 0 && a < b
                 }

                 function Fa(a) {
                     return Q(a) && I(a.length) && !!Ea[A(a)]
                 }

                 function Ga(a) {
                     return function(b) {
                         return a(b)
                     }
                 }

                 function Qa(a, b) {
                     var c = X(a),
                         d = !c && W(a),
                         e = !c && !d && ca(a),
                         f = !c && !d && !e && Na(a),
                         g = c || d || e || f,
                         h = g ? P(a.length, String) : [],
                         i = h.length;
                     for (var j in a) !b && !Pa.call(a, j) || g && ("length" == j || e && ("offset" == j || "parent" == j) || f && ("buffer" == j || "byteLength" == j || "byteOffset" == j) || fa(j, i)) || h.push(j);
                     return h
                 }

                 function Sa(a) {
                     var b = a && a.constructor,
                         c = "function" == typeof b && b.prototype || Ra;
                     return a === c
                 }

                 function Ta(a, b) {
                     return function(c) {
                         return a(b(c))
                     }
                 }

                 function Xa(a) {
                     if (!Sa(a)) return Ua(a);
                     var b = [];
                     for (var c in Object(a)) Wa.call(a, c) && "constructor" != c && b.push(c);
                     return b
                 }

                 function Ya(a) {
                     return J(a) ? Qa(a) : Xa(a)
                 }

                 function Za(a) {
                     var b = -1,
                         c = a.length;
                     return function() {
                         return ++b < c ? {
                             value: a[b],
                             key: b
                         } : null
                     }
                 }

                 function $a(a) {
                     var b = -1;
                     return function() {
                         var d = a.next();
                         return d.done ? null : (b++, {
                             value: d.value,
                             key: b
                         })
                     }
                 }

                 function _a(a) {
                     var b = Ya(a),
                         c = -1,
                         d = b.length;
                     return function() {
                         var f = b[++c];
                         return c < d ? {
                             value: a[f],
                             key: f
                         } : null
                     }
                 }

                 function ab(a) {
                     if (J(a)) return Za(a);
                     var b = O(a);
                     return b ? $a(b) : _a(a)
                 }

                 function bb(a) {
                     return function() {
                         if (null === a) throw new Error("Callback was already called.");
                         var b = a;
                         a = null, b.apply(this, arguments)
                     }
                 }

                 function cb(a) {
                     return function(b, c, d) {
                         function h(a, b) {
                             if (g -= 1, a) f = !0, d(a);
                             else {
                                 if (b === K || f && g <= 0) return f = !0, d(null);
                                 i()
                             }
                         }

                         function i() {
                             for (; g < a && !f;) {
                                 var b = e();
                                 if (null === b) return f = !0, void(g <= 0 && d(null));
                                 g += 1, c(b.value, b.key, bb(h))
                             }
                         }
                         if (d = M(d || L), a <= 0 || !b) return d(null);
                         var e = ab(b),
                             f = !1,
                             g = 0;
                         i()
                     }
                 }

                 function db(a, b, c, d) {
                     cb(b)(a, c, d)
                 }

                 function eb(a, b) {
                     return function(c, d, e) {
                         return a(c, b, d, e)
                     }
                 }

                 function fb(a, b, c) {
                     function g(a, b) {
                         a ? c(a) : ++e !== f && b !== K || c(null)
                     }
                     c = M(c || L);
                     var d = 0,
                         e = 0,
                         f = a.length;
                     for (0 === f && c(null); d < f; d++) b(a[d], d, bb(g))
                 }

                 function ib(a) {
                     return function(b, c, d) {
                         return a(hb, b, c, d)
                     }
                 }

                 function jb(a, b, c, d) {
                     d = d || L, b = b || [];
                     var e = [],
                         f = 0;
                     a(b, function(a, b, d) {
                         var g = f++;
                         c(a, function(a, b) {
                             e[g] = b, d(a)
                         })
                     }, function(a) {
                         d(a, e)
                     })
                 }

                 function mb(a) {
                     return function(b, c, d, e) {
                         return a(cb(c), b, d, e)
                     }
                 }

                 function rb(a) {
                     return j(function(b, c) {
                         var d;
                         try {
                             d = a.apply(this, b)
                         } catch (a) {
                             return c(a)
                         }
                         B(d) && "function" == typeof d.then ? d.then(function(a) {
                             c(null, a)
                         }, function(a) {
                             c(a.message ? a : new Error(a))
                         }) : c(null, d)
                     })
                 }

                 function sb(a, b) {
                     for (var c = -1, d = null == a ? 0 : a.length; ++c < d && b(a[c], c, a) !== !1;);
                     return a
                 }

                 function tb(a) {
                     return function(b, c, d) {
                         for (var e = -1, f = Object(b), g = d(b), h = g.length; h--;) {
                             var i = g[a ? h : ++e];
                             if (c(f[i], i, f) === !1) break
                         }
                         return b
                     }
                 }

                 function vb(a, b) {
                     return a && ub(a, b, Ya)
                 }

                 function wb(a, b, c, d) {
                     for (var e = a.length, f = c + (d ? 1 : -1); d ? f-- : ++f < e;)
                         if (b(a[f], f, a)) return f;
                     return -1
                 }

                 function xb(a) {
                     return a !== a
                 }

                 function yb(a, b, c) {
                     for (var d = c - 1, e = a.length; ++d < e;)
                         if (a[d] === b) return d;
                     return -1
                 }

                 function zb(a, b, c) {
                     return b === b ? yb(a, b, c) : wb(a, xb, c)
                 }

                 function Bb(a, b) {
                     for (var c = -1, d = null == a ? 0 : a.length, e = Array(d); ++c < d;) e[c] = b(a[c], c, a);
                     return e
                 }

                 function Db(a) {
                     return "symbol" == typeof a || Q(a) && A(a) == Cb
                 }

                 function Hb(a) {
                     if ("string" == typeof a) return a;
                     if (X(a)) return Bb(a, Hb) + "";
                     if (Db(a)) return Gb ? Gb.call(a) : "";
                     var b = a + "";
                     return "0" == b && 1 / a == -Eb ? "-0" : b
                 }

                 function Ib(a, b, c) {
                     var d = -1,
                         e = a.length;
                     b < 0 && (b = -b > e ? 0 : e + b), c = c > e ? e : c, c < 0 && (c += e), e = b > c ? 0 : c - b >>> 0, b >>>= 0;
                     for (var f = Array(e); ++d < e;) f[d] = a[d + b];
                     return f
                 }

                 function Jb(a, b, c) {
                     var d = a.length;
                     return c = void 0 === c ? d : c, !b && c >= d ? a : Ib(a, b, c)
                 }

                 function Kb(a, b) {
                     for (var c = a.length; c-- && zb(b, a[c], 0) > -1;);
                     return c
                 }

                 function Lb(a, b) {
                     for (var c = -1, d = a.length; ++c < d && zb(b, a[c], 0) > -1;);
                     return c
                 }

                 function Mb(a) {
                     return a.split("")
                 }

                 function Vb(a) {
                     return Ub.test(a)
                 }

                 function oc(a) {
                     return a.match(nc) || []
                 }

                 function pc(a) {
                     return Vb(a) ? oc(a) : Mb(a)
                 }

                 function qc(a) {
                     return null == a ? "" : Hb(a)
                 }

                 function sc(a, b, c) {
                     if (a = qc(a), a && (c || void 0 === b)) return a.replace(rc, "");
                     if (!a || !(b = Hb(b))) return a;
                     var d = pc(a),
                         e = pc(b),
                         f = Lb(d, e),
                         g = Kb(d, e) + 1;
                     return Jb(d, f, g).join("")
                 }

                 function xc(a) {
                     return a = a.toString().replace(wc, ""), a = a.match(tc)[2].replace(" ", ""), a = a ? a.split(uc) : [], a = a.map(function(a) {
                         return sc(a.replace(vc, ""))
                     })
                 }

                 function yc(a, b) {
                     var c = {};
                     vb(a, function(a, b) {
                         function e(b, c) {
                             var e = Bb(d, function(a) {
                                 return b[a]
                             });
                             e.push(c), a.apply(null, e)
                         }
                         var d;
                         if (X(a)) d = a.slice(0, -1), a = a[a.length - 1], c[b] = d.concat(d.length > 0 ? e : a);
                         else if (1 === a.length) c[b] = a;
                         else {
                             if (d = xc(a), 0 === a.length && 0 === d.length) throw new Error("autoInject task functions require explicit parameters.");
                             d.pop(), c[b] = d.concat(e)
                         }
                     }), Ab(c, b)
                 }

                 function Bc(a) {
                     setTimeout(a, 0)
                 }

                 function Cc(a) {
                     return i(function(b, c) {
                         a(function() {
                             b.apply(null, c)
                         })
                     })
                 }

                 function Fc() {
                     this.head = this.tail = null, this.length = 0
                 }

                 function Gc(a, b) {
                     a.length = 1, a.head = a.tail = b
                 }

                 function Hc(a, b, c) {
                     function d(a, b, c) {
                         if (null != c && "function" != typeof c) throw new Error("task callback must be a function");
                         if (j.started = !0, X(a) || (a = [a]), 0 === a.length && j.idle()) return Ec(function() {
                             j.drain()
                         });
                         for (var d = 0, e = a.length; d < e; d++) {
                             var f = {
                                 data: a[d],
                                 callback: c || L
                             };
                             b ? j._tasks.unshift(f) : j._tasks.push(f)
                         }
                         Ec(j.process)
                     }

                     function e(a) {
                         return i(function(b) {
                             f -= 1;
                             for (var c = 0, d = a.length; c < d; c++) {
                                 var e = a[c],
                                     h = zb(g, e, 0);
                                 h >= 0 && g.splice(h), e.callback.apply(e, b), null != b[0] && j.error(b[0], e.data)
                             }
                             f <= j.concurrency - j.buffer && j.unsaturated(), j.idle() && j.drain(), j.process()
                         })
                     }
                     if (null == b) b = 1;
                     else if (0 === b) throw new Error("Concurrency must not be zero");
                     var f = 0,
                         g = [],
                         h = !1,
                         j = {
                             _tasks: new Fc,
                             concurrency: b,
                             payload: c,
                             saturated: L,
                             unsaturated: L,
                             buffer: b / 4,
                             empty: L,
                             drain: L,
                             error: L,
                             started: !1,
                             paused: !1,
                             push: function(a, b) {
                                 d(a, !1, b)
                             },
                             kill: function() {
                                 j.drain = L, j._tasks.empty()
                             },
                             unshift: function(a, b) {
                                 d(a, !0, b)
                             },
                             process: function() {
                                 if (!h) {
                                     for (h = !0; !j.paused && f < j.concurrency && j._tasks.length;) {
                                         var b = [],
                                             c = [],
                                             d = j._tasks.length;
                                         j.payload && (d = Math.min(d, j.payload));
                                         for (var i = 0; i < d; i++) {
                                             var k = j._tasks.shift();
                                             b.push(k), c.push(k.data)
                                         }
                                         0 === j._tasks.length && j.empty(), f += 1, g.push(b[0]), f === j.concurrency && j.saturated();
                                         var l = bb(e(b));
                                         a(c, l)
                                     }
                                     h = !1
                                 }
                             },
                             length: function() {
                                 return j._tasks.length
                             },
                             running: function() {
                                 return f
                             },
                             workersList: function() {
                                 return g
                             },
                             idle: function() {
                                 return j._tasks.length + f === 0
                             },
                             pause: function() {
                                 j.paused = !0
                             },
                             resume: function() {
                                 j.paused !== !1 && (j.paused = !1, Ec(j.process))
                             }
                         };
                     return j
                 }

                 function Ic(a, b) {
                     return Hc(a, 1, b)
                 }

                 function Kc(a, b, c, d) {
                     d = M(d || L), Jc(a, function(a, d, e) {
                         c(b, a, function(a, c) {
                             b = c, e(a)
                         })
                     }, function(a) {
                         d(a, b)
                     })
                 }

                 function Nc(a, b, c, d) {
                     var e = [];
                     a(b, function(a, b, d) {
                         c(a, function(a, b) {
                             e = e.concat(b || []), d(a)
                         })
                     }, function(a) {
                         d(a, e)
                     })
                 }

                 function Pc(a) {
                     return function(b, c, d) {
                         return a(Jc, b, c, d)
                     }
                 }

                 function Sc(a, b) {
                     return function(c, d, e, f) {
                         f = f || L;
                         var h, g = !1;
                         c(d, function(c, d, f) {
                             e(c, function(d, e) {
                                 d ? f(d) : a(e) && !h ? (g = !0, h = b(!0, c), f(null, K)) : f()
                             })
                         }, function(a) {
                             a ? f(a) : f(null, g ? h : b(!1))
                         })
                     }
                 }

                 function Tc(a, b) {
                     return b
                 }

                 function Xc(a) {
                     return i(function(b, c) {
                         b.apply(null, c.concat(i(function(b, c) {
                             "object" == typeof console && (b ? console.error && console.error(b) : console[a] && sb(c, function(b) {
                                 console[a](b)
                             }))
                         })))
                     })
                 }

                 function Zc(a, b, c) {
                     function e(b, e) {
                         return b ? c(b) : e ? void a(d) : c(null)
                     }
                     c = bb(c || L);
                     var d = i(function(a, d) {
                         return a ? c(a) : (d.push(e), void b.apply(this, d))
                     });
                     e(null, !0)
                 }

                 function $c(a, b, c) {
                     c = bb(c || L);
                     var d = i(function(e, f) {
                         return e ? c(e) : b.apply(this, f) ? a(d) : void c.apply(null, [null].concat(f))
                     });
                     a(d)
                 }

                 function _c(a, b, c) {
                     $c(a, function() {
                         return !b.apply(this, arguments)
                     }, c)
                 }

                 function ad(a, b, c) {
                     function d(b) {
                         return b ? c(b) : void a(e)
                     }

                     function e(a, e) {
                         return a ? c(a) : e ? void b(d) : c(null)
                     }
                     c = bb(c || L), a(e)
                 }

                 function bd(a) {
                     return function(b, c, d) {
                         return a(b, d)
                     }
                 }

                 function cd(a, b, c) {
                     hb(a, bd(b), c)
                 }

                 function dd(a, b, c, d) {
                     cb(b)(a, bd(c), d)
                 }

                 function fd(a) {
                     return j(function(b, c) {
                         var d = !0;
                         b.push(function() {
                             var a = arguments;
                             d ? Ec(function() {
                                 c.apply(null, a)
                             }) : c.apply(null, a)
                         }), a.apply(this, b), d = !1
                     })
                 }

                 function gd(a) {
                     return !a
                 }

                 function kd(a) {
                     return function(b) {
                         return null == b ? void 0 : b[a]
                     }
                 }

                 function ld(a, b, c, d) {
                     var e = new Array(b.length);
                     a(b, function(a, b, d) {
                         c(a, function(a, c) {
                             e[b] = !!c, d(a)
                         })
                     }, function(a) {
                         if (a) return d(a);
                         for (var c = [], f = 0; f < b.length; f++) e[f] && c.push(b[f]);
                         d(null, c)
                     })
                 }

                 function md(a, b, c, d) {
                     var e = [];
                     a(b, function(a, b, d) {
                         c(a, function(c, f) {
                             c ? d(c) : (f && e.push({
                                 index: b,
                                 value: a
                             }), d())
                         })
                     }, function(a) {
                         a ? d(a) : d(null, Bb(e.sort(function(a, b) {
                             return a.index - b.index
                         }), kd("value")))
                     })
                 }

                 function nd(a, b, c, d) {
                     var e = J(b) ? ld : md;
                     e(a, b, c, d || L)
                 }

                 function rd(a, b) {
                     function e(a) {
                         return a ? c(a) : void d(e)
                     }
                     var c = bb(b || L),
                         d = fd(a);
                     e()
                 }

                 function td(a, b, c, d) {
                     d = M(d || L);
                     var e = {};
                     db(a, b, function(a, b, d) {
                         c(a, b, function(a, c) {
                             return a ? d(a) : (e[b] = c, void d())
                         })
                     }, function(a) {
                         d(a, e)
                     })
                 }

                 function wd(a, b) {
                     return b in a
                 }

                 function xd(a, b) {
                     var c = Object.create(null),
                         d = Object.create(null);
                     b = b || h;
                     var e = j(function(f, g) {
                         var h = b.apply(null, f);
                         wd(c, h) ? Ec(function() {
                             g.apply(null, c[h])
                         }) : wd(d, h) ? d[h].push(g) : (d[h] = [g], a.apply(null, f.concat(i(function(a) {
                             c[h] = a;
                             var b = d[h];
                             delete d[h];
                             for (var e = 0, f = b.length; e < f; e++) b[e].apply(null, a)
                         }))))
                     });
                     return e.memo = c, e.unmemoized = a, e
                 }

                 function Ad(a, b, c) {
                     c = c || L;
                     var d = J(b) ? [] : {};
                     a(b, function(a, b, c) {
                         a(i(function(a, e) {
                             e.length <= 1 && (e = e[0]), d[b] = e, c(a)
                         }))
                     }, function(a) {
                         c(a, d)
                     })
                 }

                 function Bd(a, b) {
                     Ad(hb, a, b)
                 }

                 function Cd(a, b, c) {
                     Ad(cb(b), a, c)
                 }

                 function Fd(a, b) {
                     if (b = M(b || L), !X(a)) return b(new TypeError("First argument to race must be an array of functions"));
                     if (!a.length) return b();
                     for (var c = 0, d = a.length; c < d; c++) a[c](b)
                 }

                 function Hd(a, b, c, d) {
                     var e = Gd.call(a).reverse();
                     Kc(e, b, c, d)
                 }

                 function Id(a) {
                     return j(function(c, d) {
                         return c.push(i(function(b, c) {
                             if (b) d(null, {
                                 error: b
                             });
                             else {
                                 var e = null;
                                 1 === c.length ? e = c[0] : c.length > 1 && (e = c), d(null, {
                                     value: e
                                 })
                             }
                         })), a.apply(this, c)
                     })
                 }

                 function Jd(a, b, c, d) {
                     nd(a, b, function(a, b) {
                         c(a, function(a, c) {
                             b(a, !c)
                         })
                     }, d)
                 }

                 function Ld(a) {
                     var b;
                     return X(a) ? b = Bb(a, Id) : (b = {}, vb(a, function(a, c) {
                         b[c] = Id.call(this, a)
                     })), b
                 }

                 function Od(a) {
                     return function() {
                         return a
                     }
                 }

                 function Pd(a, b, c) {
                     function g(a, b) {
                         if ("object" == typeof b) a.times = +b.times || d, a.intervalFunc = "function" == typeof b.interval ? b.interval : Od(+b.interval || e), a.errorFilter = b.errorFilter;
                         else {
                             if ("number" != typeof b && "string" != typeof b) throw new Error("Invalid arguments for async.retry");
                             a.times = +b || d
                         }
                     }

                     function i() {
                         b(function(a) {
                             a && h++ < f.times && ("function" != typeof f.errorFilter || f.errorFilter(a)) ? setTimeout(i, f.intervalFunc(h)) : c.apply(null, arguments)
                         })
                     }
                     var d = 5,
                         e = 0,
                         f = {
                             times: d,
                             intervalFunc: Od(e)
                         };
                     if (arguments.length < 3 && "function" == typeof a ? (c = b || L, b = a) : (g(f, a), c = c || L), "function" != typeof b) throw new Error("Invalid arguments for async.retry");
                     var h = 1;
                     i()
                 }

                 function Rd(a, b) {
                     Ad(Jc, a, b)
                 }

                 function Vd(a, b, c) {
                     function d(a, b) {
                         var c = a.criteria,
                             d = b.criteria;
                         return c < d ? -1 : c > d ? 1 : 0
                     }
                     kb(a, function(a, c) {
                         b(a, function(b, d) {
                             return b ? c(b) : void c(null, {
                                 value: a,
                                 criteria: d
                             })
                         })
                     }, function(a, b) {
                         return a ? c(a) : void c(null, Bb(b.sort(d), kd("value")))
                     })
                 }

                 function Wd(a, b, c) {
                     function g() {
                         f || (d.apply(null, arguments), clearTimeout(e))
                     }

                     function h() {
                         var b = a.name || "anonymous",
                             e = new Error('Callback function "' + b + '" timed out.');
                         e.code = "ETIMEDOUT", c && (e.info = c), f = !0, d(e)
                     }
                     var d, e, f = !1;
                     return j(function(c, f) {
                         d = f, e = setTimeout(h, b), a.apply(null, c.concat(g))
                     })
                 }

                 function Zd(a, b, c, d) {
                     for (var e = -1, f = Yd(Xd((b - a) / (c || 1)), 0), g = Array(f); f--;) g[d ? f : ++e] = a, a += c;
                     return g
                 }

                 function $d(a, b, c, d) {
                     nb(Zd(0, a, 1), b, c, d)
                 }

                 function be(a, b, c, d) {
                     3 === arguments.length && (d = c, c = b, b = X(a) ? [] : {}), d = M(d || L), hb(a, function(a, d, e) {
                         c(b, a, d, e)
                     }, function(a) {
                         d(a, b)
                     })
                 }

                 function ce(a) {
                     return function() {
                         return (a.unmemoized || a).apply(null, arguments)
                     }
                 }

                 function de(a, b, c) {
                     if (c = bb(c || L), !a()) return c(null);
                     var d = i(function(e, f) {
                         return e ? c(e) : a() ? b(d) : void c.apply(null, [null].concat(f))
                     });
                     b(d)
                 }

                 function ee(a, b, c) {
                     de(function() {
                         return !a.apply(this, arguments)
                     }, b, c)
                 }
                 var f = Math.max,
                     j = function(a) {
                         return i(function(b) {
                             var c = b.pop();
                             a.call(this, b, c)
                         })
                     },
                     l = "object" == typeof d && d && d.Object === Object && d,
                     m = "object" == typeof self && self && self.Object === Object && self,
                     n = l || m || Function("return this")(),
                     o = n.Symbol,
                     p = Object.prototype,
                     q = p.hasOwnProperty,
                     r = p.toString,
                     s = o ? o.toStringTag : void 0,
                     u = Object.prototype,
                     v = u.toString,
                     x = "[object Null]",
                     y = "[object Undefined]",
                     z = o ? o.toStringTag : void 0,
                     C = "[object AsyncFunction]",
                     D = "[object Function]",
                     E = "[object GeneratorFunction]",
                     F = "[object Proxy]",
                     H = 9007199254740991,
                     K = {},
                     N = "function" == typeof Symbol && Symbol.iterator,
                     O = function(a) {
                         return N && a[N] && a[N]()
                     },
                     R = "[object Arguments]",
                     T = Object.prototype,
                     U = T.hasOwnProperty,
                     V = T.propertyIsEnumerable,
                     W = S(function() {
                         return arguments
                     }()) ? S : function(a) {
                         return Q(a) && U.call(a, "callee") && !V.call(a, "callee")
                     },
                     X = Array.isArray,
                     Z = "object" == typeof c && c && !c.nodeType && c,
                     $ = Z && "object" == typeof b && b && !b.nodeType && b,
                     _ = $ && $.exports === Z,
                     aa = _ ? n.Buffer : void 0,
                     ba = aa ? aa.isBuffer : void 0,
                     ca = ba || Y,
                     da = 9007199254740991,
                     ea = /^(?:0|[1-9]\d*)$/,
                     ga = "[object Arguments]",
                     ha = "[object Array]",
                     ia = "[object Boolean]",
                     ja = "[object Date]",
                     ka = "[object Error]",
                     la = "[object Function]",
                     ma = "[object Map]",
                     na = "[object Number]",
                     oa = "[object Object]",
                     pa = "[object RegExp]",
                     qa = "[object Set]",
                     ra = "[object String]",
                     sa = "[object WeakMap]",
                     ta = "[object ArrayBuffer]",
                     ua = "[object DataView]",
                     va = "[object Float32Array]",
                     wa = "[object Float64Array]",
                     xa = "[object Int8Array]",
                     ya = "[object Int16Array]",
                     za = "[object Int32Array]",
                     Aa = "[object Uint8Array]",
                     Ba = "[object Uint8ClampedArray]",
                     Ca = "[object Uint16Array]",
                     Da = "[object Uint32Array]",
                     Ea = {};
                 Ea[va] = Ea[wa] = Ea[xa] = Ea[ya] = Ea[za] = Ea[Aa] = Ea[Ba] = Ea[Ca] = Ea[Da] = !0, Ea[ga] = Ea[ha] = Ea[ta] = Ea[ia] = Ea[ua] = Ea[ja] = Ea[ka] = Ea[la] = Ea[ma] = Ea[na] = Ea[oa] = Ea[pa] = Ea[qa] = Ea[ra] = Ea[sa] = !1;
                 var Dc, Ha = "object" == typeof c && c && !c.nodeType && c,
                     Ia = Ha && "object" == typeof b && b && !b.nodeType && b,
                     Ja = Ia && Ia.exports === Ha,
                     Ka = Ja && l.process,
                     La = function() {
                         try {
                             return Ka && Ka.binding && Ka.binding("util")
                         } catch (a) {}
                     }(),
                     Ma = La && La.isTypedArray,
                     Na = Ma ? Ga(Ma) : Fa,
                     Oa = Object.prototype,
                     Pa = Oa.hasOwnProperty,
                     Ra = Object.prototype,
                     Ua = Ta(Object.keys, Object),
                     Va = Object.prototype,
                     Wa = Va.hasOwnProperty,
                     gb = eb(db, 1 / 0),
                     hb = function(a, b, c) {
                         var d = J(a) ? fb : gb;
                         d(a, b, c)
                     },
                     kb = ib(jb),
                     lb = k(kb),
                     nb = mb(jb),
                     ob = eb(nb, 1),
                     pb = k(ob),
                     qb = i(function(a, b) {
                         return i(function(c) {
                             return a.apply(null, b.concat(c))
                         })
                     }),
                     ub = tb(),
                     Ab = function(a, b, c) {
                         function n(a, b) {
                             k.push(function() {
                                 r(a, b)
                             })
                         }

                         function o() {
                             if (0 === k.length && 0 === g) return c(null, f);
                             for (; k.length && g < b;) {
                                 var a = k.shift();
                                 a()
                             }
                         }

                         function p(a, b) {
                             var c = j[a];
                             c || (c = j[a] = []), c.push(b)
                         }

                         function q(a) {
                             var b = j[a] || [];
                             sb(b, function(a) {
                                 a()
                             }), o()
                         }

                         function r(a, b) {
                             if (!h) {
                                 var d = bb(i(function(b, d) {
                                     if (g--, d.length <= 1 && (d = d[0]), b) {
                                         var e = {};
                                         vb(f, function(a, b) {
                                             e[b] = a
                                         }), e[a] = d, h = !0, j = Object.create(null), c(b, e)
                                     } else f[a] = d, q(a)
                                 }));
                                 g++;
                                 var e = b[b.length - 1];
                                 b.length > 1 ? e(f, d) : e(d)
                             }
                         }

                         function s() {
                             for (var a, b = 0; l.length;) a = l.pop(), b++, sb(t(a), function(a) {
                                 0 === --m[a] && l.push(a)
                             });
                             if (b !== e) throw new Error("async.auto cannot execute tasks due to a recursive dependency")
                         }

                         function t(b) {
                             var c = [];
                             return vb(a, function(a, d) {
                                 X(a) && zb(a, b, 0) >= 0 && c.push(d)
                             }), c
                         }
                         "function" == typeof b && (c = b, b = null), c = M(c || L);
                         var d = Ya(a),
                             e = d.length;
                         if (!e) return c(null);
                         b || (b = e);
                         var f = {},
                             g = 0,
                             h = !1,
                             j = Object.create(null),
                             k = [],
                             l = [],
                             m = {};
                         vb(a, function(b, c) {
                             if (!X(b)) return n(c, [b]), void l.push(c);
                             var d = b.slice(0, b.length - 1),
                                 e = d.length;
                             return 0 === e ? (n(c, b), void l.push(c)) : (m[c] = e, void sb(d, function(f) {
                                 if (!a[f]) throw new Error("async.auto task `" + c + "` has a non-existent dependency `" + f + "` in " + d.join(", "));
                                 p(f, function() {
                                     e--, 0 === e && n(c, b)
                                 })
                             }))
                         }), s(), o()
                     },
                     Cb = "[object Symbol]",
                     Eb = 1 / 0,
                     Fb = o ? o.prototype : void 0,
                     Gb = Fb ? Fb.toString : void 0,
                     Nb = "\\ud800-\\udfff",
                     Ob = "\\u0300-\\u036f",
                     Pb = "\\ufe20-\\ufe2f",
                     Qb = "\\u20d0-\\u20ff",
                     Rb = Ob + Pb + Qb,
                     Sb = "\\ufe0e\\ufe0f",
                     Tb = "\\u200d",
                     Ub = RegExp("[" + Tb + Nb + Rb + Sb + "]"),
                     Wb = "\\ud800-\\udfff",
                     Xb = "\\u0300-\\u036f",
                     Yb = "\\ufe20-\\ufe2f",
                     Zb = "\\u20d0-\\u20ff",
                     $b = Xb + Yb + Zb,
                     _b = "\\ufe0e\\ufe0f",
                     ac = "[" + Wb + "]",
                     bc = "[" + $b + "]",
                     cc = "\\ud83c[\\udffb-\\udfff]",
                     dc = "(?:" + bc + "|" + cc + ")",
                     ec = "[^" + Wb + "]",
                     fc = "(?:\\ud83c[\\udde6-\\uddff]){2}",
                     gc = "[\\ud800-\\udbff][\\udc00-\\udfff]",
                     hc = "\\u200d",
                     ic = dc + "?",
                     jc = "[" + _b + "]?",
                     kc = "(?:" + hc + "(?:" + [ec, fc, gc].join("|") + ")" + jc + ic + ")*",
                     lc = jc + ic + kc,
                     mc = "(?:" + [ec + bc + "?", bc, fc, gc, ac].join("|") + ")",
                     nc = RegExp(cc + "(?=" + cc + ")|" + mc + lc, "g"),
                     rc = /^\s+|\s+$/g,
                     tc = /^(function)?\s*[^\(]*\(\s*([^\)]*)\)/m,
                     uc = /,/,
                     vc = /(=.+)?(\s*)$/,
                     wc = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
                     zc = "function" == typeof setImmediate && setImmediate,
                     Ac = "object" == typeof a && "function" == typeof a.nextTick;
                 Dc = zc ? setImmediate : Ac ? a.nextTick : Bc;
                 var Ec = Cc(Dc);
                 Fc.prototype.removeLink = function(a) {
                     return a.prev ? a.prev.next = a.next : this.head = a.next, a.next ? a.next.prev = a.prev : this.tail = a.prev, a.prev = a.next = null, this.length -= 1, a
                 }, Fc.prototype.empty = Fc, Fc.prototype.insertAfter = function(a, b) {
                     b.prev = a, b.next = a.next, a.next ? a.next.prev = b : this.tail = b, a.next = b, this.length += 1
                 }, Fc.prototype.insertBefore = function(a, b) {
                     b.prev = a.prev, b.next = a, a.prev ? a.prev.next = b : this.head = b, a.prev = b, this.length += 1
                 }, Fc.prototype.unshift = function(a) {
                     this.head ? this.insertBefore(this.head, a) : Gc(this, a)
                 }, Fc.prototype.push = function(a) {
                     this.tail ? this.insertAfter(this.tail, a) : Gc(this, a)
                 }, Fc.prototype.shift = function() {
                     return this.head && this.removeLink(this.head)
                 }, Fc.prototype.pop = function() {
                     return this.tail && this.removeLink(this.tail)
                 };
                 var yd, Jc = eb(db, 1),
                     Lc = i(function(b) {
                         return i(function(a) {
                             var c = this,
                                 d = a[a.length - 1];
                             "function" == typeof d ? a.pop() : d = L, Kc(b, a, function(a, b, d) {
                                 b.apply(c, a.concat(i(function(a, b) {
                                     d(a, b)
                                 })))
                             }, function(a, b) {
                                 d.apply(c, [a].concat(b))
                             })
                         })
                     }),
                     Mc = i(function(a) {
                         return Lc.apply(null, a.reverse())
                     }),
                     Oc = ib(Nc),
                     Qc = Pc(Nc),
                     Rc = i(function(a) {
                         var b = [null].concat(a);
                         return j(function(a, c) {
                             return c.apply(this, b)
                         })
                     }),
                     Uc = ib(Sc(h, Tc)),
                     Vc = mb(Sc(h, Tc)),
                     Wc = eb(Vc, 1),
                     Yc = Xc("dir"),
                     ed = eb(dd, 1),
                     hd = ib(Sc(gd, gd)),
                     id = mb(Sc(gd, gd)),
                     jd = eb(id, 1),
                     od = ib(nd),
                     pd = mb(nd),
                     qd = eb(pd, 1),
                     sd = Xc("log"),
                     ud = eb(td, 1 / 0),
                     vd = eb(td, 1);
                 yd = Ac ? a.nextTick : zc ? setImmediate : Bc;
                 var zd = Cc(yd),
                     Dd = function(a, b) {
                         return Hc(function(b, c) {
                             a(b[0], c)
                         }, b, 1)
                     },
                     Ed = function(a, b) {
                         var c = Dd(a, b);
                         return c.push = function(a, b, d) {
                             if (null == d && (d = L), "function" != typeof d) throw new Error("task callback must be a function");
                             if (c.started = !0, X(a) || (a = [a]), 0 === a.length) return Ec(function() {
                                 c.drain()
                             });
                             b = b || 0;
                             for (var e = c._tasks.head; e && b >= e.priority;) e = e.next;
                             for (var f = 0, g = a.length; f < g; f++) {
                                 var h = {
                                     data: a[f],
                                     priority: b,
                                     callback: d
                                 };
                                 e ? c._tasks.insertBefore(e, h) : c._tasks.push(h)
                             }
                             Ec(c.process)
                         }, delete c.unshift, c
                     },
                     Gd = Array.prototype.slice,
                     Kd = ib(Jd),
                     Md = mb(Jd),
                     Nd = eb(Md, 1),
                     Qd = function(a, b) {
                         return b || (b = a, a = null), j(function(c, d) {
                             function e(a) {
                                 b.apply(null, c.concat(a))
                             }
                             a ? Pd(a, e, d) : Pd(e, d)
                         })
                     },
                     Sd = ib(Sc(Boolean, h)),
                     Td = mb(Sc(Boolean, h)),
                     Ud = eb(Td, 1),
                     Xd = Math.ceil,
                     Yd = Math.max,
                     _d = eb($d, 1 / 0),
                     ae = eb($d, 1),
                     fe = function(a, b) {
                         function d(e) {
                             if (c === a.length) return b.apply(null, [null].concat(e));
                             var f = bb(i(function(a, c) {
                                 return a ? b.apply(null, [a].concat(c)) : void d(c)
                             }));
                             e.push(f);
                             var g = a[c++];
                             g.apply(null, e)
                         }
                         if (b = M(b || L), !X(a)) return b(new Error("First argument to waterfall must be an array of functions"));
                         if (!a.length) return b();
                         var c = 0;
                         d([])
                     },
                     ge = {
                         applyEach: lb,
                         applyEachSeries: pb,
                         apply: qb,
                         asyncify: rb,
                         auto: Ab,
                         autoInject: yc,
                         cargo: Ic,
                         compose: Mc,
                         concat: Oc,
                         concatSeries: Qc,
                         constant: Rc,
                         detect: Uc,
                         detectLimit: Vc,
                         detectSeries: Wc,
                         dir: Yc,
                         doDuring: Zc,
                         doUntil: _c,
                         doWhilst: $c,
                         during: ad,
                         each: cd,
                         eachLimit: dd,
                         eachOf: hb,
                         eachOfLimit: db,
                         eachOfSeries: Jc,
                         eachSeries: ed,
                         ensureAsync: fd,
                         every: hd,
                         everyLimit: id,
                         everySeries: jd,
                         filter: od,
                         filterLimit: pd,
                         filterSeries: qd,
                         forever: rd,
                         log: sd,
                         map: kb,
                         mapLimit: nb,
                         mapSeries: ob,
                         mapValues: ud,
                         mapValuesLimit: td,
                         mapValuesSeries: vd,
                         memoize: xd,
                         nextTick: zd,
                         parallel: Bd,
                         parallelLimit: Cd,
                         priorityQueue: Ed,
                         queue: Dd,
                         race: Fd,
                         reduce: Kc,
                         reduceRight: Hd,
                         reflect: Id,
                         reflectAll: Ld,
                         reject: Kd,
                         rejectLimit: Md,
                         rejectSeries: Nd,
                         retry: Pd,
                         retryable: Qd,
                         seq: Lc,
                         series: Rd,
                         setImmediate: Ec,
                         some: Sd,
                         someLimit: Td,
                         someSeries: Ud,
                         sortBy: Vd,
                         timeout: Wd,
                         times: _d,
                         timesLimit: $d,
                         timesSeries: ae,
                         transform: be,
                         unmemoize: ce,
                         until: ee,
                         waterfall: fe,
                         whilst: de,
                         all: hd,
                         any: Sd,
                         forEach: cd,
                         forEachSeries: ed,
                         forEachLimit: dd,
                         forEachOf: hb,
                         forEachOfSeries: Jc,
                         forEachOfLimit: db,
                         inject: Kc,
                         foldl: Kc,
                         foldr: Hd,
                         select: od,
                         selectLimit: pd,
                         selectSeries: qd,
                         wrapSync: rb
                     };
                 c.default = ge, c.applyEach = lb, c.applyEachSeries = pb, c.apply = qb, c.asyncify = rb, c.auto = Ab, c.autoInject = yc, c.cargo = Ic, c.compose = Mc, c.concat = Oc, c.concatSeries = Qc, c.constant = Rc, c.detect = Uc, c.detectLimit = Vc, c.detectSeries = Wc, c.dir = Yc, c.doDuring = Zc, c.doUntil = _c, c.doWhilst = $c, c.during = ad, c.each = cd, c.eachLimit = dd, c.eachOf = hb, c.eachOfLimit = db, c.eachOfSeries = Jc, c.eachSeries = ed, c.ensureAsync = fd, c.every = hd, c.everyLimit = id, c.everySeries = jd, c.filter = od, c.filterLimit = pd, c.filterSeries = qd, c.forever = rd, c.log = sd, c.map = kb, c.mapLimit = nb, c.mapSeries = ob, c.mapValues = ud, c.mapValuesLimit = td, c.mapValuesSeries = vd, c.memoize = xd, c.nextTick = zd, c.parallel = Bd, c.parallelLimit = Cd, c.priorityQueue = Ed, c.queue = Dd, c.race = Fd, c.reduce = Kc, c.reduceRight = Hd, c.reflect = Id, c.reflectAll = Ld, c.reject = Kd, c.rejectLimit = Md, c.rejectSeries = Nd, c.retry = Pd, c.retryable = Qd, c.seq = Lc, c.series = Rd, c.setImmediate = Ec, c.some = Sd, c.someLimit = Td, c.someSeries = Ud, c.sortBy = Vd, c.timeout = Wd, c.times = _d, c.timesLimit = $d, c.timesSeries = ae, c.transform = be, c.unmemoize = ce, c.until = ee, c.waterfall = fe, c.whilst = de, c.all = hd, c.allLimit = id, c.allSeries = jd, c.any = Sd, c.anyLimit = Td, c.anySeries = Ud, c.find = Uc, c.findLimit = Vc, c.findSeries = Wc, c.forEach = cd, c.forEachSeries = ed, c.forEachLimit = dd, c.forEachOf = hb, c.forEachOfSeries = Jc, c.forEachOfLimit = db, c.inject = Kc, c.foldl = Kc, c.foldr = Hd, c.select = od, c.selectLimit = pd, c.selectSeries = qd, c.wrapSync = rb, Object.defineProperty(c, "__esModule", {
                     value: !0
                 })
             })
         }).call(this, a("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
     }, {
         _process: 32
     }],
     18: [function(a, b, c) {
         "use strict";

         function j(a) {
             var b = a.length;
             if (b % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
             return "=" === a[b - 2] ? 2 : "=" === a[b - 1] ? 1 : 0
         }

         function k(a) {
             return 3 * a.length / 4 - j(a)
         }

         function l(a) {
             var b, c, d, g, h, i, k = a.length;
             h = j(a), i = new f(3 * k / 4 - h), d = h > 0 ? k - 4 : k;
             var l = 0;
             for (b = 0, c = 0; b < d; b += 4, c += 3) g = e[a.charCodeAt(b)] << 18 | e[a.charCodeAt(b + 1)] << 12 | e[a.charCodeAt(b + 2)] << 6 | e[a.charCodeAt(b + 3)], i[l++] = g >> 16 & 255, i[l++] = g >> 8 & 255, i[l++] = 255 & g;
             return 2 === h ? (g = e[a.charCodeAt(b)] << 2 | e[a.charCodeAt(b + 1)] >> 4, i[l++] = 255 & g) : 1 === h && (g = e[a.charCodeAt(b)] << 10 | e[a.charCodeAt(b + 1)] << 4 | e[a.charCodeAt(b + 2)] >> 2, i[l++] = g >> 8 & 255, i[l++] = 255 & g), i
         }

         function m(a) {
             return d[a >> 18 & 63] + d[a >> 12 & 63] + d[a >> 6 & 63] + d[63 & a]
         }

         function n(a, b, c) {
             for (var d, e = [], f = b; f < c; f += 3) d = (a[f] << 16) + (a[f + 1] << 8) + a[f + 2], e.push(m(d));
             return e.join("")
         }

         function o(a) {
             for (var b, c = a.length, e = c % 3, f = "", g = [], h = 16383, i = 0, j = c - e; i < j; i += h) g.push(n(a, i, i + h > j ? j : i + h));
             return 1 === e ? (b = a[c - 1], f += d[b >> 2], f += d[b << 4 & 63], f += "==") : 2 === e && (b = (a[c - 2] << 8) + a[c - 1], f += d[b >> 10], f += d[b >> 4 & 63], f += d[b << 2 & 63], f += "="), g.push(f), g.join("")
         }
         c.byteLength = k, c.toByteArray = l, c.fromByteArray = o;
         for (var d = [], e = [], f = "undefined" != typeof Uint8Array ? Uint8Array : Array, g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", h = 0, i = g.length; h < i; ++h) d[h] = g[h], e[g.charCodeAt(h)] = h;
         e["-".charCodeAt(0)] = 62, e["_".charCodeAt(0)] = 63
     }, {}],
     19: [function(a, b, c) {}, {}],
     20: [function(a, b, c) {
         arguments[4][19][0].apply(c, arguments)
     }, {
         dup: 19
     }],
     21: [function(a, b, c) {
         (function(b) {
             "use strict";
             var d = a("buffer"),
                 e = d.Buffer,
                 f = d.SlowBuffer,
                 g = d.kMaxLength || 2147483647;
             c.alloc = function(b, c, d) {
                 if ("function" == typeof e.alloc) return e.alloc(b, c, d);
                 if ("number" == typeof d) throw new TypeError("encoding must not be number");
                 if ("number" != typeof b) throw new TypeError("size must be a number");
                 if (b > g) throw new RangeError("size is too large");
                 var f = d,
                     h = c;
                 void 0 === h && (f = void 0, h = 0);
                 var i = new e(b);
                 if ("string" == typeof h)
                     for (var j = new e(h, f), k = j.length, l = -1; ++l < b;) i[l] = j[l % k];
                 else i.fill(h);
                 return i
             }, c.allocUnsafe = function(b) {
                 if ("function" == typeof e.allocUnsafe) return e.allocUnsafe(b);
                 if ("number" != typeof b) throw new TypeError("size must be a number");
                 if (b > g) throw new RangeError("size is too large");
                 return new e(b)
             }, c.from = function(c, d, f) {
                 if ("function" == typeof e.from && (!b.Uint8Array || Uint8Array.from !== e.from)) return e.from(c, d, f);
                 if ("number" == typeof c) throw new TypeError('"value" argument must not be a number');
                 if ("string" == typeof c) return new e(c, d);
                 if ("undefined" != typeof ArrayBuffer && c instanceof ArrayBuffer) {
                     var g = d;
                     if (1 === arguments.length) return new e(c);
                     "undefined" == typeof g && (g = 0);
                     var h = f;
                     if ("undefined" == typeof h && (h = c.byteLength - g), g >= c.byteLength) throw new RangeError("'offset' is out of bounds");
                     if (h > c.byteLength - g) throw new RangeError("'length' is out of bounds");
                     return new e(c.slice(g, g + h))
                 }
                 if (e.isBuffer(c)) {
                     var i = new e(c.length);
                     return c.copy(i, 0, 0, c.length), i
                 }
                 if (c) {
                     if (Array.isArray(c) || "undefined" != typeof ArrayBuffer && c.buffer instanceof ArrayBuffer || "length" in c) return new e(c);
                     if ("Buffer" === c.type && Array.isArray(c.data)) return new e(c.data)
                 }
                 throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
             }, c.allocUnsafeSlow = function(b) {
                 if ("function" == typeof e.allocUnsafeSlow) return e.allocUnsafeSlow(b);
                 if ("number" != typeof b) throw new TypeError("size must be a number");
                 if (b >= g) throw new RangeError("size is too large");
                 return new f(b)
             }
         }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
     }, {
         buffer: 22
     }],
     22: [function(a, b, c) {
         "use strict";

         function g() {
             try {
                 var a = new Uint8Array(1);
                 return a.__proto__ = {
                     __proto__: Uint8Array.prototype,
                     foo: function() {
                         return 42
                     }
                 }, 42 === a.foo()
             } catch (a) {
                 return !1
             }
         }

         function h(a) {
             if (a > f) throw new RangeError("Invalid typed array length");
             var b = new Uint8Array(a);
             return b.__proto__ = i.prototype, b
         }

         function i(a, b, c) {
             if ("number" == typeof a) {
                 if ("string" == typeof b) throw new Error("If encoding is specified then the first argument must be a string");
                 return m(a)
             }
             return j(a, b, c)
         }

         function j(a, b, c) {
             if ("number" == typeof a) throw new TypeError('"value" argument must not be a number');
             return a instanceof ArrayBuffer ? p(a, b, c) : "string" == typeof a ? n(a, b) : q(a)
         }

         function k(a) {
             if ("number" != typeof a) throw new TypeError('"size" argument must be a number');
             if (a < 0) throw new RangeError('"size" argument must not be negative')
         }

         function l(a, b, c) {
             return k(a), a <= 0 ? h(a) : void 0 !== b ? "string" == typeof c ? h(a).fill(b, c) : h(a).fill(b) : h(a)
         }

         function m(a) {
             return k(a), h(a < 0 ? 0 : 0 | r(a))
         }

         function n(a, b) {
             if ("string" == typeof b && "" !== b || (b = "utf8"), !i.isEncoding(b)) throw new TypeError('"encoding" must be a valid string encoding');
             var c = 0 | t(a, b),
                 d = h(c),
                 e = d.write(a, b);
             return e !== c && (d = d.slice(0, e)), d
         }

         function o(a) {
             for (var b = a.length < 0 ? 0 : 0 | r(a.length), c = h(b), d = 0; d < b; d += 1) c[d] = 255 & a[d];
             return c
         }

         function p(a, b, c) {
             if (b < 0 || a.byteLength < b) throw new RangeError("'offset' is out of bounds");
             if (a.byteLength < b + (c || 0)) throw new RangeError("'length' is out of bounds");
             var d;
             return d = void 0 === b && void 0 === c ? new Uint8Array(a) : void 0 === c ? new Uint8Array(a, b) : new Uint8Array(a, b, c), d.__proto__ = i.prototype, d
         }

         function q(a) {
             if (i.isBuffer(a)) {
                 var b = 0 | r(a.length),
                     c = h(b);
                 return 0 === c.length ? c : (a.copy(c, 0, 0, b), c)
             }
             if (a) {
                 if (ArrayBuffer.isView(a) || "length" in a) return "number" != typeof a.length || $(a.length) ? h(0) : o(a);
                 if ("Buffer" === a.type && Array.isArray(a.data)) return o(a.data)
             }
             throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
         }

         function r(a) {
             if (a >= f) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + f.toString(16) + " bytes");
             return 0 | a
         }

         function s(a) {
             return +a != a && (a = 0), i.alloc(+a)
         }

         function t(a, b) {
             if (i.isBuffer(a)) return a.length;
             if (ArrayBuffer.isView(a) || a instanceof ArrayBuffer) return a.byteLength;
             "string" != typeof a && (a = "" + a);
             var c = a.length;
             if (0 === c) return 0;
             for (var d = !1;;) switch (b) {
                 case "ascii":
                 case "latin1":
                 case "binary":
                     return c;
                 case "utf8":
                 case "utf-8":
                 case void 0:
                     return V(a).length;
                 case "ucs2":
                 case "ucs-2":
                 case "utf16le":
                 case "utf-16le":
                     return 2 * c;
                 case "hex":
                     return c >>> 1;
                 case "base64":
                     return Y(a).length;
                 default:
                     if (d) return V(a).length;
                     b = ("" + b).toLowerCase(), d = !0
             }
         }

         function u(a, b, c) {
             var d = !1;
             if ((void 0 === b || b < 0) && (b = 0), b > this.length) return "";
             if ((void 0 === c || c > this.length) && (c = this.length), c <= 0) return "";
             if (c >>>= 0, b >>>= 0, c <= b) return "";
             for (a || (a = "utf8");;) switch (a) {
                 case "hex":
                     return K(this, b, c);
                 case "utf8":
                 case "utf-8":
                     return F(this, b, c);
                 case "ascii":
                     return I(this, b, c);
                 case "latin1":
                 case "binary":
                     return J(this, b, c);
                 case "base64":
                     return E(this, b, c);
                 case "ucs2":
                 case "ucs-2":
                 case "utf16le":
                 case "utf-16le":
                     return L(this, b, c);
                 default:
                     if (d) throw new TypeError("Unknown encoding: " + a);
                     a = (a + "").toLowerCase(), d = !0
             }
         }

         function v(a, b, c) {
             var d = a[b];
             a[b] = a[c], a[c] = d
         }

         function w(a, b, c, d, e) {
             if (0 === a.length) return -1;
             if ("string" == typeof c ? (d = c, c = 0) : c > 2147483647 ? c = 2147483647 : c < -2147483648 && (c = -2147483648),
                 c = +c, isNaN(c) && (c = e ? 0 : a.length - 1), c < 0 && (c = a.length + c), c >= a.length) {
                 if (e) return -1;
                 c = a.length - 1
             } else if (c < 0) {
                 if (!e) return -1;
                 c = 0
             }
             if ("string" == typeof b && (b = i.from(b, d)), i.isBuffer(b)) return 0 === b.length ? -1 : x(a, b, c, d, e);
             if ("number" == typeof b) return b &= 255, "function" == typeof Uint8Array.prototype.indexOf ? e ? Uint8Array.prototype.indexOf.call(a, b, c) : Uint8Array.prototype.lastIndexOf.call(a, b, c) : x(a, [b], c, d, e);
             throw new TypeError("val must be string, number or Buffer")
         }

         function x(a, b, c, d, e) {
             function i(a, b) {
                 return 1 === f ? a[b] : a.readUInt16BE(b * f)
             }
             var f = 1,
                 g = a.length,
                 h = b.length;
             if (void 0 !== d && (d = String(d).toLowerCase(), "ucs2" === d || "ucs-2" === d || "utf16le" === d || "utf-16le" === d)) {
                 if (a.length < 2 || b.length < 2) return -1;
                 f = 2, g /= 2, h /= 2, c /= 2
             }
             var j;
             if (e) {
                 var k = -1;
                 for (j = c; j < g; j++)
                     if (i(a, j) === i(b, k === -1 ? 0 : j - k)) {
                         if (k === -1 && (k = j), j - k + 1 === h) return k * f
                     } else k !== -1 && (j -= j - k), k = -1
             } else
                 for (c + h > g && (c = g - h), j = c; j >= 0; j--) {
                     for (var l = !0, m = 0; m < h; m++)
                         if (i(a, j + m) !== i(b, m)) {
                             l = !1;
                             break
                         }
                     if (l) return j
                 }
             return -1
         }

         function y(a, b, c, d) {
             c = Number(c) || 0;
             var e = a.length - c;
             d ? (d = Number(d), d > e && (d = e)) : d = e;
             var f = b.length;
             if (f % 2 !== 0) throw new TypeError("Invalid hex string");
             d > f / 2 && (d = f / 2);
             for (var g = 0; g < d; ++g) {
                 var h = parseInt(b.substr(2 * g, 2), 16);
                 if (isNaN(h)) return g;
                 a[c + g] = h
             }
             return g
         }

         function z(a, b, c, d) {
             return Z(V(b, a.length - c), a, c, d)
         }

         function A(a, b, c, d) {
             return Z(W(b), a, c, d)
         }

         function B(a, b, c, d) {
             return A(a, b, c, d)
         }

         function C(a, b, c, d) {
             return Z(Y(b), a, c, d)
         }

         function D(a, b, c, d) {
             return Z(X(b, a.length - c), a, c, d)
         }

         function E(a, b, c) {
             return 0 === b && c === a.length ? d.fromByteArray(a) : d.fromByteArray(a.slice(b, c))
         }

         function F(a, b, c) {
             c = Math.min(a.length, c);
             for (var d = [], e = b; e < c;) {
                 var f = a[e],
                     g = null,
                     h = f > 239 ? 4 : f > 223 ? 3 : f > 191 ? 2 : 1;
                 if (e + h <= c) {
                     var i, j, k, l;
                     switch (h) {
                         case 1:
                             f < 128 && (g = f);
                             break;
                         case 2:
                             i = a[e + 1], 128 === (192 & i) && (l = (31 & f) << 6 | 63 & i, l > 127 && (g = l));
                             break;
                         case 3:
                             i = a[e + 1], j = a[e + 2], 128 === (192 & i) && 128 === (192 & j) && (l = (15 & f) << 12 | (63 & i) << 6 | 63 & j, l > 2047 && (l < 55296 || l > 57343) && (g = l));
                             break;
                         case 4:
                             i = a[e + 1], j = a[e + 2], k = a[e + 3], 128 === (192 & i) && 128 === (192 & j) && 128 === (192 & k) && (l = (15 & f) << 18 | (63 & i) << 12 | (63 & j) << 6 | 63 & k, l > 65535 && l < 1114112 && (g = l))
                     }
                 }
                 null === g ? (g = 65533, h = 1) : g > 65535 && (g -= 65536, d.push(g >>> 10 & 1023 | 55296), g = 56320 | 1023 & g), d.push(g), e += h
             }
             return H(d)
         }

         function H(a) {
             var b = a.length;
             if (b <= G) return String.fromCharCode.apply(String, a);
             for (var c = "", d = 0; d < b;) c += String.fromCharCode.apply(String, a.slice(d, d += G));
             return c
         }

         function I(a, b, c) {
             var d = "";
             c = Math.min(a.length, c);
             for (var e = b; e < c; ++e) d += String.fromCharCode(127 & a[e]);
             return d
         }

         function J(a, b, c) {
             var d = "";
             c = Math.min(a.length, c);
             for (var e = b; e < c; ++e) d += String.fromCharCode(a[e]);
             return d
         }

         function K(a, b, c) {
             var d = a.length;
             (!b || b < 0) && (b = 0), (!c || c < 0 || c > d) && (c = d);
             for (var e = "", f = b; f < c; ++f) e += U(a[f]);
             return e
         }

         function L(a, b, c) {
             for (var d = a.slice(b, c), e = "", f = 0; f < d.length; f += 2) e += String.fromCharCode(d[f] + 256 * d[f + 1]);
             return e
         }

         function M(a, b, c) {
             if (a % 1 !== 0 || a < 0) throw new RangeError("offset is not uint");
             if (a + b > c) throw new RangeError("Trying to access beyond buffer length")
         }

         function N(a, b, c, d, e, f) {
             if (!i.isBuffer(a)) throw new TypeError('"buffer" argument must be a Buffer instance');
             if (b > e || b < f) throw new RangeError('"value" argument is out of bounds');
             if (c + d > a.length) throw new RangeError("Index out of range")
         }

         function O(a, b, c, d, e, f) {
             if (c + d > a.length) throw new RangeError("Index out of range");
             if (c < 0) throw new RangeError("Index out of range")
         }

         function P(a, b, c, d, f) {
             return b = +b, c >>>= 0, f || O(a, b, c, 4, 3.4028234663852886e38, -3.4028234663852886e38), e.write(a, b, c, d, 23, 4), c + 4
         }

         function Q(a, b, c, d, f) {
             return b = +b, c >>>= 0, f || O(a, b, c, 8, 1.7976931348623157e308, -1.7976931348623157e308), e.write(a, b, c, d, 52, 8), c + 8
         }

         function S(a) {
             if (a = T(a).replace(R, ""), a.length < 2) return "";
             for (; a.length % 4 !== 0;) a += "=";
             return a
         }

         function T(a) {
             return a.trim ? a.trim() : a.replace(/^\s+|\s+$/g, "")
         }

         function U(a) {
             return a < 16 ? "0" + a.toString(16) : a.toString(16)
         }

         function V(a, b) {
             b = b || 1 / 0;
             for (var c, d = a.length, e = null, f = [], g = 0; g < d; ++g) {
                 if (c = a.charCodeAt(g), c > 55295 && c < 57344) {
                     if (!e) {
                         if (c > 56319) {
                             (b -= 3) > -1 && f.push(239, 191, 189);
                             continue
                         }
                         if (g + 1 === d) {
                             (b -= 3) > -1 && f.push(239, 191, 189);
                             continue
                         }
                         e = c;
                         continue
                     }
                     if (c < 56320) {
                         (b -= 3) > -1 && f.push(239, 191, 189), e = c;
                         continue
                     }
                     c = (e - 55296 << 10 | c - 56320) + 65536
                 } else e && (b -= 3) > -1 && f.push(239, 191, 189);
                 if (e = null, c < 128) {
                     if ((b -= 1) < 0) break;
                     f.push(c)
                 } else if (c < 2048) {
                     if ((b -= 2) < 0) break;
                     f.push(c >> 6 | 192, 63 & c | 128)
                 } else if (c < 65536) {
                     if ((b -= 3) < 0) break;
                     f.push(c >> 12 | 224, c >> 6 & 63 | 128, 63 & c | 128)
                 } else {
                     if (!(c < 1114112)) throw new Error("Invalid code point");
                     if ((b -= 4) < 0) break;
                     f.push(c >> 18 | 240, c >> 12 & 63 | 128, c >> 6 & 63 | 128, 63 & c | 128)
                 }
             }
             return f
         }

         function W(a) {
             for (var b = [], c = 0; c < a.length; ++c) b.push(255 & a.charCodeAt(c));
             return b
         }

         function X(a, b) {
             for (var c, d, e, f = [], g = 0; g < a.length && !((b -= 2) < 0); ++g) c = a.charCodeAt(g), d = c >> 8, e = c % 256, f.push(e), f.push(d);
             return f
         }

         function Y(a) {
             return d.toByteArray(S(a))
         }

         function Z(a, b, c, d) {
             for (var e = 0; e < d && !(e + c >= b.length || e >= a.length); ++e) b[e + c] = a[e];
             return e
         }

         function $(a) {
             return a !== a
         }
         var d = a("base64-js"),
             e = a("ieee754");
         c.Buffer = i, c.SlowBuffer = s, c.INSPECT_MAX_BYTES = 50;
         var f = 2147483647;
         c.kMaxLength = f, i.TYPED_ARRAY_SUPPORT = g(), i.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), "undefined" != typeof Symbol && Symbol.species && i[Symbol.species] === i && Object.defineProperty(i, Symbol.species, {
             value: null,
             configurable: !0,
             enumerable: !1,
             writable: !1
         }), i.poolSize = 8192, i.from = function(a, b, c) {
             return j(a, b, c)
         }, i.prototype.__proto__ = Uint8Array.prototype, i.__proto__ = Uint8Array, i.alloc = function(a, b, c) {
             return l(a, b, c)
         }, i.allocUnsafe = function(a) {
             return m(a)
         }, i.allocUnsafeSlow = function(a) {
             return m(a)
         }, i.isBuffer = function(b) {
             return null != b && b._isBuffer === !0
         }, i.compare = function(b, c) {
             if (!i.isBuffer(b) || !i.isBuffer(c)) throw new TypeError("Arguments must be Buffers");
             if (b === c) return 0;
             for (var d = b.length, e = c.length, f = 0, g = Math.min(d, e); f < g; ++f)
                 if (b[f] !== c[f]) {
                     d = b[f], e = c[f];
                     break
                 }
             return d < e ? -1 : e < d ? 1 : 0
         }, i.isEncoding = function(b) {
             switch (String(b).toLowerCase()) {
                 case "hex":
                 case "utf8":
                 case "utf-8":
                 case "ascii":
                 case "latin1":
                 case "binary":
                 case "base64":
                 case "ucs2":
                 case "ucs-2":
                 case "utf16le":
                 case "utf-16le":
                     return !0;
                 default:
                     return !1
             }
         }, i.concat = function(b, c) {
             if (!Array.isArray(b)) throw new TypeError('"list" argument must be an Array of Buffers');
             if (0 === b.length) return i.alloc(0);
             var d;
             if (void 0 === c)
                 for (c = 0, d = 0; d < b.length; ++d) c += b[d].length;
             var e = i.allocUnsafe(c),
                 f = 0;
             for (d = 0; d < b.length; ++d) {
                 var g = b[d];
                 if (!i.isBuffer(g)) throw new TypeError('"list" argument must be an Array of Buffers');
                 g.copy(e, f), f += g.length
             }
             return e
         }, i.byteLength = t, i.prototype._isBuffer = !0, i.prototype.swap16 = function() {
             var b = this.length;
             if (b % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
             for (var c = 0; c < b; c += 2) v(this, c, c + 1);
             return this
         }, i.prototype.swap32 = function() {
             var b = this.length;
             if (b % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
             for (var c = 0; c < b; c += 4) v(this, c, c + 3), v(this, c + 1, c + 2);
             return this
         }, i.prototype.swap64 = function() {
             var b = this.length;
             if (b % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
             for (var c = 0; c < b; c += 8) v(this, c, c + 7), v(this, c + 1, c + 6), v(this, c + 2, c + 5), v(this, c + 3, c + 4);
             return this
         }, i.prototype.toString = function() {
             var b = this.length;
             return 0 === b ? "" : 0 === arguments.length ? F(this, 0, b) : u.apply(this, arguments)
         }, i.prototype.equals = function(b) {
             if (!i.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
             return this === b || 0 === i.compare(this, b)
         }, i.prototype.inspect = function() {
             var b = "",
                 d = c.INSPECT_MAX_BYTES;
             return this.length > 0 && (b = this.toString("hex", 0, d).match(/.{2}/g).join(" "), this.length > d && (b += " ... ")), "<Buffer " + b + ">"
         }, i.prototype.compare = function(b, c, d, e, f) {
             if (!i.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
             if (void 0 === c && (c = 0), void 0 === d && (d = b ? b.length : 0), void 0 === e && (e = 0), void 0 === f && (f = this.length), c < 0 || d > b.length || e < 0 || f > this.length) throw new RangeError("out of range index");
             if (e >= f && c >= d) return 0;
             if (e >= f) return -1;
             if (c >= d) return 1;
             if (c >>>= 0, d >>>= 0, e >>>= 0, f >>>= 0, this === b) return 0;
             for (var g = f - e, h = d - c, j = Math.min(g, h), k = this.slice(e, f), l = b.slice(c, d), m = 0; m < j; ++m)
                 if (k[m] !== l[m]) {
                     g = k[m], h = l[m];
                     break
                 }
             return g < h ? -1 : h < g ? 1 : 0
         }, i.prototype.includes = function(b, c, d) {
             return this.indexOf(b, c, d) !== -1
         }, i.prototype.indexOf = function(b, c, d) {
             return w(this, b, c, d, !0)
         }, i.prototype.lastIndexOf = function(b, c, d) {
             return w(this, b, c, d, !1)
         }, i.prototype.write = function(b, c, d, e) {
             if (void 0 === c) e = "utf8", d = this.length, c = 0;
             else if (void 0 === d && "string" == typeof c) e = c, d = this.length, c = 0;
             else {
                 if (!isFinite(c)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                 c >>>= 0, isFinite(d) ? (d >>>= 0, void 0 === e && (e = "utf8")) : (e = d, d = void 0)
             }
             var f = this.length - c;
             if ((void 0 === d || d > f) && (d = f), b.length > 0 && (d < 0 || c < 0) || c > this.length) throw new RangeError("Attempt to write outside buffer bounds");
             e || (e = "utf8");
             for (var g = !1;;) switch (e) {
                 case "hex":
                     return y(this, b, c, d);
                 case "utf8":
                 case "utf-8":
                     return z(this, b, c, d);
                 case "ascii":
                     return A(this, b, c, d);
                 case "latin1":
                 case "binary":
                     return B(this, b, c, d);
                 case "base64":
                     return C(this, b, c, d);
                 case "ucs2":
                 case "ucs-2":
                 case "utf16le":
                 case "utf-16le":
                     return D(this, b, c, d);
                 default:
                     if (g) throw new TypeError("Unknown encoding: " + e);
                     e = ("" + e).toLowerCase(), g = !0
             }
         }, i.prototype.toJSON = function() {
             return {
                 type: "Buffer",
                 data: Array.prototype.slice.call(this._arr || this, 0)
             }
         };
         var G = 4096;
         i.prototype.slice = function(b, c) {
             var d = this.length;
             b = ~~b, c = void 0 === c ? d : ~~c, b < 0 ? (b += d, b < 0 && (b = 0)) : b > d && (b = d), c < 0 ? (c += d, c < 0 && (c = 0)) : c > d && (c = d), c < b && (c = b);
             var e = this.subarray(b, c);
             return e.__proto__ = i.prototype, e
         }, i.prototype.readUIntLE = function(b, c, d) {
             b >>>= 0, c >>>= 0, d || M(b, c, this.length);
             for (var e = this[b], f = 1, g = 0; ++g < c && (f *= 256);) e += this[b + g] * f;
             return e
         }, i.prototype.readUIntBE = function(b, c, d) {
             b >>>= 0, c >>>= 0, d || M(b, c, this.length);
             for (var e = this[b + --c], f = 1; c > 0 && (f *= 256);) e += this[b + --c] * f;
             return e
         }, i.prototype.readUInt8 = function(b, c) {
             return b >>>= 0, c || M(b, 1, this.length), this[b]
         }, i.prototype.readUInt16LE = function(b, c) {
             return b >>>= 0, c || M(b, 2, this.length), this[b] | this[b + 1] << 8
         }, i.prototype.readUInt16BE = function(b, c) {
             return b >>>= 0, c || M(b, 2, this.length), this[b] << 8 | this[b + 1]
         }, i.prototype.readUInt32LE = function(b, c) {
             return b >>>= 0, c || M(b, 4, this.length), (this[b] | this[b + 1] << 8 | this[b + 2] << 16) + 16777216 * this[b + 3]
         }, i.prototype.readUInt32BE = function(b, c) {
             return b >>>= 0, c || M(b, 4, this.length), 16777216 * this[b] + (this[b + 1] << 16 | this[b + 2] << 8 | this[b + 3])
         }, i.prototype.readIntLE = function(b, c, d) {
             b >>>= 0, c >>>= 0, d || M(b, c, this.length);
             for (var e = this[b], f = 1, g = 0; ++g < c && (f *= 256);) e += this[b + g] * f;
             return f *= 128, e >= f && (e -= Math.pow(2, 8 * c)), e
         }, i.prototype.readIntBE = function(b, c, d) {
             b >>>= 0, c >>>= 0, d || M(b, c, this.length);
             for (var e = c, f = 1, g = this[b + --e]; e > 0 && (f *= 256);) g += this[b + --e] * f;
             return f *= 128, g >= f && (g -= Math.pow(2, 8 * c)), g
         }, i.prototype.readInt8 = function(b, c) {
             return b >>>= 0, c || M(b, 1, this.length), 128 & this[b] ? (255 - this[b] + 1) * -1 : this[b]
         }, i.prototype.readInt16LE = function(b, c) {
             b >>>= 0, c || M(b, 2, this.length);
             var d = this[b] | this[b + 1] << 8;
             return 32768 & d ? 4294901760 | d : d
         }, i.prototype.readInt16BE = function(b, c) {
             b >>>= 0, c || M(b, 2, this.length);
             var d = this[b + 1] | this[b] << 8;
             return 32768 & d ? 4294901760 | d : d
         }, i.prototype.readInt32LE = function(b, c) {
             return b >>>= 0, c || M(b, 4, this.length), this[b] | this[b + 1] << 8 | this[b + 2] << 16 | this[b + 3] << 24
         }, i.prototype.readInt32BE = function(b, c) {
             return b >>>= 0, c || M(b, 4, this.length), this[b] << 24 | this[b + 1] << 16 | this[b + 2] << 8 | this[b + 3]
         }, i.prototype.readFloatLE = function(b, c) {
             return b >>>= 0, c || M(b, 4, this.length), e.read(this, b, !0, 23, 4)
         }, i.prototype.readFloatBE = function(b, c) {
             return b >>>= 0, c || M(b, 4, this.length), e.read(this, b, !1, 23, 4)
         }, i.prototype.readDoubleLE = function(b, c) {
             return b >>>= 0, c || M(b, 8, this.length), e.read(this, b, !0, 52, 8)
         }, i.prototype.readDoubleBE = function(b, c) {
             return b >>>= 0, c || M(b, 8, this.length), e.read(this, b, !1, 52, 8)
         }, i.prototype.writeUIntLE = function(b, c, d, e) {
             if (b = +b, c >>>= 0, d >>>= 0, !e) {
                 var f = Math.pow(2, 8 * d) - 1;
                 N(this, b, c, d, f, 0)
             }
             var g = 1,
                 h = 0;
             for (this[c] = 255 & b; ++h < d && (g *= 256);) this[c + h] = b / g & 255;
             return c + d
         }, i.prototype.writeUIntBE = function(b, c, d, e) {
             if (b = +b, c >>>= 0, d >>>= 0, !e) {
                 var f = Math.pow(2, 8 * d) - 1;
                 N(this, b, c, d, f, 0)
             }
             var g = d - 1,
                 h = 1;
             for (this[c + g] = 255 & b; --g >= 0 && (h *= 256);) this[c + g] = b / h & 255;
             return c + d
         }, i.prototype.writeUInt8 = function(b, c, d) {
             return b = +b, c >>>= 0, d || N(this, b, c, 1, 255, 0), this[c] = 255 & b, c + 1
         }, i.prototype.writeUInt16LE = function(b, c, d) {
             return b = +b, c >>>= 0, d || N(this, b, c, 2, 65535, 0), this[c] = 255 & b, this[c + 1] = b >>> 8, c + 2
         }, i.prototype.writeUInt16BE = function(b, c, d) {
             return b = +b, c >>>= 0, d || N(this, b, c, 2, 65535, 0), this[c] = b >>> 8, this[c + 1] = 255 & b, c + 2
         }, i.prototype.writeUInt32LE = function(b, c, d) {
             return b = +b, c >>>= 0, d || N(this, b, c, 4, 4294967295, 0), this[c + 3] = b >>> 24, this[c + 2] = b >>> 16, this[c + 1] = b >>> 8, this[c] = 255 & b, c + 4
         }, i.prototype.writeUInt32BE = function(b, c, d) {
             return b = +b, c >>>= 0, d || N(this, b, c, 4, 4294967295, 0), this[c] = b >>> 24, this[c + 1] = b >>> 16, this[c + 2] = b >>> 8, this[c + 3] = 255 & b, c + 4
         }, i.prototype.writeIntLE = function(b, c, d, e) {
             if (b = +b, c >>>= 0, !e) {
                 var f = Math.pow(2, 8 * d - 1);
                 N(this, b, c, d, f - 1, -f)
             }
             var g = 0,
                 h = 1,
                 i = 0;
             for (this[c] = 255 & b; ++g < d && (h *= 256);) b < 0 && 0 === i && 0 !== this[c + g - 1] && (i = 1), this[c + g] = (b / h >> 0) - i & 255;
             return c + d
         }, i.prototype.writeIntBE = function(b, c, d, e) {
             if (b = +b, c >>>= 0, !e) {
                 var f = Math.pow(2, 8 * d - 1);
                 N(this, b, c, d, f - 1, -f)
             }
             var g = d - 1,
                 h = 1,
                 i = 0;
             for (this[c + g] = 255 & b; --g >= 0 && (h *= 256);) b < 0 && 0 === i && 0 !== this[c + g + 1] && (i = 1), this[c + g] = (b / h >> 0) - i & 255;
             return c + d
         }, i.prototype.writeInt8 = function(b, c, d) {
             return b = +b, c >>>= 0, d || N(this, b, c, 1, 127, -128), b < 0 && (b = 255 + b + 1), this[c] = 255 & b, c + 1
         }, i.prototype.writeInt16LE = function(b, c, d) {
             return b = +b, c >>>= 0, d || N(this, b, c, 2, 32767, -32768), this[c] = 255 & b, this[c + 1] = b >>> 8, c + 2
         }, i.prototype.writeInt16BE = function(b, c, d) {
             return b = +b, c >>>= 0, d || N(this, b, c, 2, 32767, -32768), this[c] = b >>> 8, this[c + 1] = 255 & b, c + 2
         }, i.prototype.writeInt32LE = function(b, c, d) {
             return b = +b, c >>>= 0, d || N(this, b, c, 4, 2147483647, -2147483648), this[c] = 255 & b, this[c + 1] = b >>> 8, this[c + 2] = b >>> 16, this[c + 3] = b >>> 24, c + 4
         }, i.prototype.writeInt32BE = function(b, c, d) {
             return b = +b, c >>>= 0, d || N(this, b, c, 4, 2147483647, -2147483648), b < 0 && (b = 4294967295 + b + 1), this[c] = b >>> 24, this[c + 1] = b >>> 16, this[c + 2] = b >>> 8, this[c + 3] = 255 & b, c + 4
         }, i.prototype.writeFloatLE = function(b, c, d) {
             return P(this, b, c, !0, d)
         }, i.prototype.writeFloatBE = function(b, c, d) {
             return P(this, b, c, !1, d)
         }, i.prototype.writeDoubleLE = function(b, c, d) {
             return Q(this, b, c, !0, d)
         }, i.prototype.writeDoubleBE = function(b, c, d) {
             return Q(this, b, c, !1, d)
         }, i.prototype.copy = function(b, c, d, e) {
             if (d || (d = 0), e || 0 === e || (e = this.length), c >= b.length && (c = b.length), c || (c = 0), e > 0 && e < d && (e = d), e === d) return 0;
             if (0 === b.length || 0 === this.length) return 0;
             if (c < 0) throw new RangeError("targetStart out of bounds");
             if (d < 0 || d >= this.length) throw new RangeError("sourceStart out of bounds");
             if (e < 0) throw new RangeError("sourceEnd out of bounds");
             e > this.length && (e = this.length), b.length - c < e - d && (e = b.length - c + d);
             var g, f = e - d;
             if (this === b && d < c && c < e)
                 for (g = f - 1; g >= 0; --g) b[g + c] = this[g + d];
             else if (f < 1e3)
                 for (g = 0; g < f; ++g) b[g + c] = this[g + d];
             else Uint8Array.prototype.set.call(b, this.subarray(d, d + f), c);
             return f
         }, i.prototype.fill = function(b, c, d, e) {
             if ("string" == typeof b) {
                 if ("string" == typeof c ? (e = c, c = 0, d = this.length) : "string" == typeof d && (e = d, d = this.length), 1 === b.length) {
                     var f = b.charCodeAt(0);
                     f < 256 && (b = f)
                 }
                 if (void 0 !== e && "string" != typeof e) throw new TypeError("encoding must be a string");
                 if ("string" == typeof e && !i.isEncoding(e)) throw new TypeError("Unknown encoding: " + e)
             } else "number" == typeof b && (b &= 255);
             if (c < 0 || this.length < c || this.length < d) throw new RangeError("Out of range index");
             if (d <= c) return this;
             c >>>= 0, d = void 0 === d ? this.length : d >>> 0, b || (b = 0);
             var g;
             if ("number" == typeof b)
                 for (g = c; g < d; ++g) this[g] = b;
             else {
                 var h = i.isBuffer(b) ? b : new i(b, e),
                     j = h.length;
                 for (g = 0; g < d - c; ++g) this[g + c] = h[g % j]
             }
             return this
         };
         var R = /[^+\/0-9A-Za-z-_]/g
     }, {
         "base64-js": 18,
         ieee754: 27
     }],
     23: [function(a, b, c) {
         b.exports = {
             100: "Continue",
             101: "Switching Protocols",
             102: "Processing",
             200: "OK",
             201: "Created",
             202: "Accepted",
             203: "Non-Authoritative Information",
             204: "No Content",
             205: "Reset Content",
             206: "Partial Content",
             207: "Multi-Status",
             208: "Already Reported",
             226: "IM Used",
             300: "Multiple Choices",
             301: "Moved Permanently",
             302: "Found",
             303: "See Other",
             304: "Not Modified",
             305: "Use Proxy",
             307: "Temporary Redirect",
             308: "Permanent Redirect",
             400: "Bad Request",
             401: "Unauthorized",
             402: "Payment Required",
             403: "Forbidden",
             404: "Not Found",
             405: "Method Not Allowed",
             406: "Not Acceptable",
             407: "Proxy Authentication Required",
             408: "Request Timeout",
             409: "Conflict",
             410: "Gone",
             411: "Length Required",
             412: "Precondition Failed",
             413: "Payload Too Large",
             414: "URI Too Long",
             415: "Unsupported Media Type",
             416: "Range Not Satisfiable",
             417: "Expectation Failed",
             418: "I'm a teapot",
             421: "Misdirected Request",
             422: "Unprocessable Entity",
             423: "Locked",
             424: "Failed Dependency",
             425: "Unordered Collection",
             426: "Upgrade Required",
             428: "Precondition Required",
             429: "Too Many Requests",
             431: "Request Header Fields Too Large",
             451: "Unavailable For Legal Reasons",
             500: "Internal Server Error",
             501: "Not Implemented",
             502: "Bad Gateway",
             503: "Service Unavailable",
             504: "Gateway Timeout",
             505: "HTTP Version Not Supported",
             506: "Variant Also Negotiates",
             507: "Insufficient Storage",
             508: "Loop Detected",
             509: "Bandwidth Limit Exceeded",
             510: "Not Extended",
             511: "Network Authentication Required"
         }
     }, {}],
     24: [function(a, b, c) {
         (function(a) {
             function b(a) {
                 return Array.isArray ? Array.isArray(a) : "[object Array]" === q(a)
             }

             function d(a) {
                 return "boolean" == typeof a
             }

             function e(a) {
                 return null === a
             }

             function f(a) {
                 return null == a
             }

             function g(a) {
                 return "number" == typeof a
             }

             function h(a) {
                 return "string" == typeof a
             }

             function i(a) {
                 return "symbol" == typeof a
             }

             function j(a) {
                 return void 0 === a
             }

             function k(a) {
                 return "[object RegExp]" === q(a)
             }

             function l(a) {
                 return "object" == typeof a && null !== a
             }

             function m(a) {
                 return "[object Date]" === q(a)
             }

             function n(a) {
                 return "[object Error]" === q(a) || a instanceof Error
             }

             function o(a) {
                 return "function" == typeof a
             }

             function p(a) {
                 return null === a || "boolean" == typeof a || "number" == typeof a || "string" == typeof a || "symbol" == typeof a || "undefined" == typeof a
             }

             function q(a) {
                 return Object.prototype.toString.call(a)
             }
             c.isArray = b, c.isBoolean = d, c.isNull = e, c.isNullOrUndefined = f, c.isNumber = g, c.isString = h, c.isSymbol = i, c.isUndefined = j, c.isRegExp = k, c.isObject = l, c.isDate = m, c.isError = n, c.isFunction = o, c.isPrimitive = p, c.isBuffer = a.isBuffer
         }).call(this, {
             isBuffer: a("../../is-buffer/index.js")
         })
     }, {
         "../../is-buffer/index.js": 29
     }],
     25: [function(a, b, c) {
         function d() {
             this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
         }

         function e(a) {
             return "function" == typeof a
         }

         function f(a) {
             return "number" == typeof a
         }

         function g(a) {
             return "object" == typeof a && null !== a
         }

         function h(a) {
             return void 0 === a
         }
         b.exports = d, d.EventEmitter = d, d.prototype._events = void 0, d.prototype._maxListeners = void 0, d.defaultMaxListeners = 10, d.prototype.setMaxListeners = function(a) {
             if (!f(a) || a < 0 || isNaN(a)) throw TypeError("n must be a positive number");
             return this._maxListeners = a, this
         }, d.prototype.emit = function(a) {
             var b, c, d, f, i, j;
             if (this._events || (this._events = {}), "error" === a && (!this._events.error || g(this._events.error) && !this._events.error.length)) {
                 if (b = arguments[1], b instanceof Error) throw b;
                 var k = new Error('Uncaught, unspecified "error" event. (' + b + ")");
                 throw k.context = b, k
             }
             if (c = this._events[a], h(c)) return !1;
             if (e(c)) switch (arguments.length) {
                     case 1:
                         c.call(this);
                         break;
                     case 2:
                         c.call(this, arguments[1]);
                         break;
                     case 3:
                         c.call(this, arguments[1], arguments[2]);
                         break;
                     default:
                         f = Array.prototype.slice.call(arguments, 1), c.apply(this, f)
                 } else if (g(c))
                     for (f = Array.prototype.slice.call(arguments, 1), j = c.slice(), d = j.length, i = 0; i < d; i++) j[i].apply(this, f);
             return !0
         }, d.prototype.addListener = function(a, b) {
             var c;
             if (!e(b)) throw TypeError("listener must be a function");
             return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", a, e(b.listener) ? b.listener : b), this._events[a] ? g(this._events[a]) ? this._events[a].push(b) : this._events[a] = [this._events[a], b] : this._events[a] = b, g(this._events[a]) && !this._events[a].warned && (c = h(this._maxListeners) ? d.defaultMaxListeners : this._maxListeners, c && c > 0 && this._events[a].length > c && (this._events[a].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[a].length), "function" == typeof console.trace && console.trace())), this
         }, d.prototype.on = d.prototype.addListener, d.prototype.once = function(a, b) {
             function d() {
                 this.removeListener(a, d), c || (c = !0, b.apply(this, arguments))
             }
             if (!e(b)) throw TypeError("listener must be a function");
             var c = !1;
             return d.listener = b, this.on(a, d), this
         }, d.prototype.removeListener = function(a, b) {
             var c, d, f, h;
             if (!e(b)) throw TypeError("listener must be a function");
             if (!this._events || !this._events[a]) return this;
             if (c = this._events[a], f = c.length, d = -1, c === b || e(c.listener) && c.listener === b) delete this._events[a], this._events.removeListener && this.emit("removeListener", a, b);
             else if (g(c)) {
                 for (h = f; h-- > 0;)
                     if (c[h] === b || c[h].listener && c[h].listener === b) {
                         d = h;
                         break
                     }
                 if (d < 0) return this;
                 1 === c.length ? (c.length = 0, delete this._events[a]) : c.splice(d, 1), this._events.removeListener && this.emit("removeListener", a, b)
             }
             return this
         }, d.prototype.removeAllListeners = function(a) {
             var b, c;
             if (!this._events) return this;
             if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[a] && delete this._events[a], this;
             if (0 === arguments.length) {
                 for (b in this._events) "removeListener" !== b && this.removeAllListeners(b);
                 return this.removeAllListeners("removeListener"), this._events = {}, this
             }
             if (c = this._events[a], e(c)) this.removeListener(a, c);
             else if (c)
                 for (; c.length;) this.removeListener(a, c[c.length - 1]);
             return delete this._events[a], this
         }, d.prototype.listeners = function(a) {
             var b;
             return b = this._events && this._events[a] ? e(this._events[a]) ? [this._events[a]] : this._events[a].slice() : []
         }, d.prototype.listenerCount = function(a) {
             if (this._events) {
                 var b = this._events[a];
                 if (e(b)) return 1;
                 if (b) return b.length
             }
             return 0
         }, d.listenerCount = function(a, b) {
             return a.listenerCount(b)
         }
     }, {}],
     26: [function(a, b, c) {
         var d = a("http"),
             e = b.exports;
         for (var f in d) d.hasOwnProperty(f) && (e[f] = d[f]);
         e.request = function(a, b) {
             return a || (a = {}), a.scheme = "https", a.protocol = "https:", d.request.call(this, a, b)
         }
     }, {
         http: 44
     }],
     27: [function(a, b, c) {
         c.read = function(a, b, c, d, e) {
             var f, g, h = 8 * e - d - 1,
                 i = (1 << h) - 1,
                 j = i >> 1,
                 k = -7,
                 l = c ? e - 1 : 0,
                 m = c ? -1 : 1,
                 n = a[b + l];
             for (l += m, f = n & (1 << -k) - 1, n >>= -k, k += h; k > 0; f = 256 * f + a[b + l], l += m, k -= 8);
             for (g = f & (1 << -k) - 1, f >>= -k, k += d; k > 0; g = 256 * g + a[b + l], l += m, k -= 8);
             if (0 === f) f = 1 - j;
             else {
                 if (f === i) return g ? NaN : (n ? -1 : 1) * (1 / 0);
                 g += Math.pow(2, d), f -= j
             }
             return (n ? -1 : 1) * g * Math.pow(2, f - d)
         }, c.write = function(a, b, c, d, e, f) {
             var g, h, i, j = 8 * f - e - 1,
                 k = (1 << j) - 1,
                 l = k >> 1,
                 m = 23 === e ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                 n = d ? 0 : f - 1,
                 o = d ? 1 : -1,
                 p = b < 0 || 0 === b && 1 / b < 0 ? 1 : 0;
             for (b = Math.abs(b), isNaN(b) || b === 1 / 0 ? (h = isNaN(b) ? 1 : 0, g = k) : (g = Math.floor(Math.log(b) / Math.LN2), b * (i = Math.pow(2, -g)) < 1 && (g--, i *= 2), b += g + l >= 1 ? m / i : m * Math.pow(2, 1 - l), b * i >= 2 && (g++, i /= 2), g + l >= k ? (h = 0, g = k) : g + l >= 1 ? (h = (b * i - 1) * Math.pow(2, e), g += l) : (h = b * Math.pow(2, l - 1) * Math.pow(2, e), g = 0)); e >= 8; a[c + n] = 255 & h, n += o, h /= 256, e -= 8);
             for (g = g << e | h, j += e; j > 0; a[c + n] = 255 & g, n += o, g /= 256, j -= 8);
             a[c + n - o] |= 128 * p
         }
     }, {}],
     28: [function(a, b, c) {
         "function" == typeof Object.create ? b.exports = function(b, c) {
             b.super_ = c, b.prototype = Object.create(c.prototype, {
                 constructor: {
                     value: b,
                     enumerable: !1,
                     writable: !0,
                     configurable: !0
                 }
             })
         } : b.exports = function(b, c) {
             b.super_ = c;
             var d = function() {};
             d.prototype = c.prototype, b.prototype = new d, b.prototype.constructor = b
         }
     }, {}],
     29: [function(a, b, c) {
         function d(a) {
             return !!a.constructor && "function" == typeof a.constructor.isBuffer && a.constructor.isBuffer(a)
         }

         function e(a) {
             return "function" == typeof a.readFloatLE && "function" == typeof a.slice && d(a.slice(0, 0))
         }
         b.exports = function(a) {
             return null != a && (d(a) || e(a) || !!a._isBuffer)
         }
     }, {}],
     30: [function(a, b, c) {
         var d = {}.toString;
         b.exports = Array.isArray || function(a) {
             return "[object Array]" == d.call(a)
         }
     }, {}],
     31: [function(a, b, c) {
         (function(a) {
             "use strict";

             function c(b, c, d, e) {
                 if ("function" != typeof b) throw new TypeError('"callback" argument must be a function');
                 var g, h, f = arguments.length;
                 switch (f) {
                     case 0:
                     case 1:
                         return a.nextTick(b);
                     case 2:
                         return a.nextTick(function() {
                             b.call(null, c)
                         });
                     case 3:
                         return a.nextTick(function() {
                             b.call(null, c, d)
                         });
                     case 4:
                         return a.nextTick(function() {
                             b.call(null, c, d, e)
                         });
                     default:
                         for (g = new Array(f - 1), h = 0; h < g.length;) g[h++] = arguments[h];
                         return a.nextTick(function() {
                             b.apply(null, g)
                         })
                 }
             }!a.version || 0 === a.version.indexOf("v0.") || 0 === a.version.indexOf("v1.") && 0 !== a.version.indexOf("v1.8.") ? b.exports = c : b.exports = a.nextTick
         }).call(this, a("_process"))
     }, {
         _process: 32
     }],
     32: [function(a, b, c) {
         function g() {
             throw new Error("setTimeout has not been defined")
         }

         function h() {
             throw new Error("clearTimeout has not been defined")
         }

         function i(a) {
             if (e === setTimeout) return setTimeout(a, 0);
             if ((e === g || !e) && setTimeout) return e = setTimeout, setTimeout(a, 0);
             try {
                 return e(a, 0)
             } catch (b) {
                 try {
                     return e.call(null, a, 0)
                 } catch (b) {
                     return e.call(this, a, 0)
                 }
             }
         }

         function j(a) {
             if (f === clearTimeout) return clearTimeout(a);
             if ((f === h || !f) && clearTimeout) return f = clearTimeout, clearTimeout(a);
             try {
                 return f(a)
             } catch (b) {
                 try {
                     return f.call(null, a)
                 } catch (b) {
                     return f.call(this, a)
                 }
             }
         }

         function o() {
             l && m && (l = !1, m.length ? k = m.concat(k) : n = -1, k.length && p())
         }

         function p() {
             if (!l) {
                 var a = i(o);
                 l = !0;
                 for (var b = k.length; b;) {
                     for (m = k, k = []; ++n < b;) m && m[n].run();
                     n = -1, b = k.length
                 }
                 m = null, l = !1, j(a)
             }
         }

         function q(a, b) {
             this.fun = a, this.array = b
         }

         function r() {}
         var e, f, d = b.exports = {};
         ! function() {
             try {
                 e = "function" == typeof setTimeout ? setTimeout : g
             } catch (a) {
                 e = g
             }
             try {
                 f = "function" == typeof clearTimeout ? clearTimeout : h
             } catch (a) {
                 f = h
             }
         }();
         var m, k = [],
             l = !1,
             n = -1;
         d.nextTick = function(a) {
             var b = new Array(arguments.length - 1);
             if (arguments.length > 1)
                 for (var c = 1; c < arguments.length; c++) b[c - 1] = arguments[c];
             k.push(new q(a, b)), 1 !== k.length || l || i(p)
         }, q.prototype.run = function() {
             this.fun.apply(null, this.array)
         }, d.title = "browser", d.browser = !0, d.env = {}, d.argv = [], d.version = "", d.versions = {}, d.on = r, d.addListener = r, d.once = r, d.off = r, d.removeListener = r, d.removeAllListeners = r, d.emit = r, d.binding = function(a) {
             throw new Error("process.binding is not supported")
         }, d.cwd = function() {
             return "/"
         }, d.chdir = function(a) {
             throw new Error("process.chdir is not supported")
         }, d.umask = function() {
             return 0
         }
     }, {}],
     33: [function(a, b, c) {
         (function(a) {
             ! function(d) {
                 function z(a) {
                     throw new RangeError(u[a])
                 }

                 function A(a, b) {
                     for (var c = a.length, d = []; c--;) d[c] = b(a[c]);
                     return d
                 }

                 function B(a, b) {
                     var c = a.split("@"),
                         d = "";
                     c.length > 1 && (d = c[0] + "@", a = c[1]), a = a.replace(t, ".");
                     var e = a.split("."),
                         f = A(e, b).join(".");
                     return d + f
                 }

                 function C(a) {
                     for (var e, f, b = [], c = 0, d = a.length; c < d;) e = a.charCodeAt(c++), e >= 55296 && e <= 56319 && c < d ? (f = a.charCodeAt(c++), 56320 == (64512 & f) ? b.push(((1023 & e) << 10) + (1023 & f) + 65536) : (b.push(e), c--)) : b.push(e);
                     return b
                 }

                 function D(a) {
                     return A(a, function(a) {
                         var b = "";
                         return a > 65535 && (a -= 65536, b += x(a >>> 10 & 1023 | 55296), a = 56320 | 1023 & a), b += x(a)
                     }).join("")
                 }

                 function E(a) {
                     return a - 48 < 10 ? a - 22 : a - 65 < 26 ? a - 65 : a - 97 < 26 ? a - 97 : j
                 }

                 function F(a, b) {
                     return a + 22 + 75 * (a < 26) - ((0 != b) << 5)
                 }

                 function G(a, b, c) {
                     var d = 0;
                     for (a = c ? w(a / n) : a >> 1, a += w(a / b); a > v * l >> 1; d += j) a = w(a / v);
                     return w(d + (v + 1) * a / (a + m))
                 }

                 function H(a) {
                     var d, h, m, n, r, s, t, u, v, x, b = [],
                         c = a.length,
                         e = 0,
                         f = p,
                         g = o;
                     for (h = a.lastIndexOf(q), h < 0 && (h = 0), m = 0; m < h; ++m) a.charCodeAt(m) >= 128 && z("not-basic"), b.push(a.charCodeAt(m));
                     for (n = h > 0 ? h + 1 : 0; n < c;) {
                         for (r = e, s = 1, t = j; n >= c && z("invalid-input"), u = E(a.charCodeAt(n++)), (u >= j || u > w((i - e) / s)) && z("overflow"), e += u * s, v = t <= g ? k : t >= g + l ? l : t - g, !(u < v); t += j) x = j - v, s > w(i / x) && z("overflow"), s *= x;
                         d = b.length + 1, g = G(e - r, d, 0 == r), w(e / d) > i - f && z("overflow"), f += w(e / d), e %= d, b.splice(e++, 0, f)
                     }
                     return D(b)
                 }

                 function I(a) {
                     var b, c, d, e, f, g, h, m, n, r, s, u, v, y, A, t = [];
                     for (a = C(a), u = a.length, b = p, c = 0, f = o, g = 0; g < u; ++g) s = a[g], s < 128 && t.push(x(s));
                     for (d = e = t.length, e && t.push(q); d < u;) {
                         for (h = i, g = 0; g < u; ++g) s = a[g], s >= b && s < h && (h = s);
                         for (v = d + 1, h - b > w((i - c) / v) && z("overflow"), c += (h - b) * v, b = h, g = 0; g < u; ++g)
                             if (s = a[g], s < b && ++c > i && z("overflow"), s == b) {
                                 for (m = c, n = j; r = n <= f ? k : n >= f + l ? l : n - f, !(m < r); n += j) A = m - r, y = j - r, t.push(x(F(r + A % y, 0))), m = w(A / y);
                                 t.push(x(F(m, 0))), f = G(c, v, d == e), c = 0, ++d
                             }++c, ++b
                     }
                     return t.join("")
                 }

                 function J(a) {
                     return B(a, function(a) {
                         return r.test(a) ? H(a.slice(4).toLowerCase()) : a
                     })
                 }

                 function K(a) {
                     return B(a, function(a) {
                         return s.test(a) ? "xn--" + I(a) : a
                     })
                 }
                 var e = "object" == typeof c && c && !c.nodeType && c,
                     f = "object" == typeof b && b && !b.nodeType && b,
                     g = "object" == typeof a && a;
                 g.global !== g && g.window !== g && g.self !== g || (d = g);
                 var h, y, i = 2147483647,
                     j = 36,
                     k = 1,
                     l = 26,
                     m = 38,
                     n = 700,
                     o = 72,
                     p = 128,
                     q = "-",
                     r = /^xn--/,
                     s = /[^\x20-\x7E]/,
                     t = /[\x2E\u3002\uFF0E\uFF61]/g,
                     u = {
                         overflow: "Overflow: input needs wider integers to process",
                         "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                         "invalid-input": "Invalid input"
                     },
                     v = j - k,
                     w = Math.floor,
                     x = String.fromCharCode;
                 if (h = {
                         version: "1.4.1",
                         ucs2: {
                             decode: C,
                             encode: D
                         },
                         decode: H,
                         encode: I,
                         toASCII: K,
                         toUnicode: J
                     }, "function" == typeof define && "object" == typeof define.amd && define.amd) define("punycode", function() {
                     return h
                 });
                 else if (e && f)
                     if (b.exports == e) f.exports = h;
                     else
                         for (y in h) h.hasOwnProperty(y) && (e[y] = h[y]);
                 else d.punycode = h
             }(this)
         }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
     }, {}],
     34: [function(a, b, c) {
         "use strict";

         function d(a, b) {
             return Object.prototype.hasOwnProperty.call(a, b)
         }
         b.exports = function(a, b, c, f) {
             b = b || "&", c = c || "=";
             var g = {};
             if ("string" != typeof a || 0 === a.length) return g;
             var h = /\+/g;
             a = a.split(b);
             var i = 1e3;
             f && "number" == typeof f.maxKeys && (i = f.maxKeys);
             var j = a.length;
             i > 0 && j > i && (j = i);
             for (var k = 0; k < j; ++k) {
                 var n, o, p, q, l = a[k].replace(h, "%20"),
                     m = l.indexOf(c);
                 m >= 0 ? (n = l.substr(0, m), o = l.substr(m + 1)) : (n = l, o = ""), p = decodeURIComponent(n), q = decodeURIComponent(o), d(g, p) ? e(g[p]) ? g[p].push(q) : g[p] = [g[p], q] : g[p] = q
             }
             return g
         };
         var e = Array.isArray || function(a) {
             return "[object Array]" === Object.prototype.toString.call(a)
         }
     }, {}],
     35: [function(a, b, c) {
         "use strict";

         function f(a, b) {
             if (a.map) return a.map(b);
             for (var c = [], d = 0; d < a.length; d++) c.push(b(a[d], d));
             return c
         }
         var d = function(a) {
             switch (typeof a) {
                 case "string":
                     return a;
                 case "boolean":
                     return a ? "true" : "false";
                 case "number":
                     return isFinite(a) ? a : "";
                 default:
                     return ""
             }
         };
         b.exports = function(a, b, c, h) {
             return b = b || "&", c = c || "=", null === a && (a = void 0), "object" == typeof a ? f(g(a), function(g) {
                 var h = encodeURIComponent(d(g)) + c;
                 return e(a[g]) ? f(a[g], function(a) {
                     return h + encodeURIComponent(d(a))
                 }).join(b) : h + encodeURIComponent(d(a[g]))
             }).join(b) : h ? encodeURIComponent(d(h)) + c + encodeURIComponent(d(a)) : ""
         };
         var e = Array.isArray || function(a) {
                 return "[object Array]" === Object.prototype.toString.call(a)
             },
             g = Object.keys || function(a) {
                 var b = [];
                 for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && b.push(c);
                 return b
             }
     }, {}],
     36: [function(a, b, c) {
         "use strict";
         c.decode = c.parse = a("./decode"), c.encode = c.stringify = a("./encode")
     }, {
         "./decode": 34,
         "./encode": 35
     }],
     37: [function(a, b, c) {
         "use strict";

         function l(a) {
             return this instanceof l ? (g.call(this, a), h.call(this, a), a && a.readable === !1 && (this.readable = !1), a && a.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, a && a.allowHalfOpen === !1 && (this.allowHalfOpen = !1), void this.once("end", m)) : new l(a)
         }

         function m() {
             this.allowHalfOpen || this._writableState.ended || e(n, this)
         }

         function n(a) {
             a.end()
         }
         var d = Object.keys || function(a) {
             var b = [];
             for (var c in a) b.push(c);
             return b
         };
         b.exports = l;
         var e = a("process-nextick-args"),
             f = a("core-util-is");
         f.inherits = a("inherits");
         var g = a("./_stream_readable"),
             h = a("./_stream_writable");
         f.inherits(l, g);
         for (var i = d(h.prototype), j = 0; j < i.length; j++) {
             var k = i[j];
             l.prototype[k] || (l.prototype[k] = h.prototype[k])
         }
     }, {
         "./_stream_readable": 39,
         "./_stream_writable": 41,
         "core-util-is": 24,
         inherits: 28,
         "process-nextick-args": 31
     }],
     38: [function(a, b, c) {
         "use strict";

         function f(a) {
             return this instanceof f ? void d.call(this, a) : new f(a)
         }
         b.exports = f;
         var d = a("./_stream_transform"),
             e = a("core-util-is");
         e.inherits = a("inherits"), e.inherits(f, d), f.prototype._transform = function(a, b, c) {
             c(null, a)
         }
     }, {
         "./_stream_transform": 40,
         "core-util-is": 24,
         inherits: 28
     }],
     39: [function(a, b, c) {
         (function(c) {
             "use strict";

             function q(a, b, c) {
                 return "function" == typeof a.prependListener ? a.prependListener(b, c) : void(a._events && a._events[b] ? e(a._events[b]) ? a._events[b].unshift(c) : a._events[b] = [c, a._events[b]] : a.on(b, c))
             }

             function r(b, c) {
                 f = f || a("./_stream_duplex"), b = b || {}, this.objectMode = !!b.objectMode, c instanceof f && (this.objectMode = this.objectMode || !!b.readableObjectMode);
                 var d = b.highWaterMark,
                     e = this.objectMode ? 16 : 16384;
                 this.highWaterMark = d || 0 === d ? d : e, this.highWaterMark = ~~this.highWaterMark, this.buffer = new o, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1,
                     this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = b.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, b.encoding && (p || (p = a("string_decoder/").StringDecoder), this.decoder = new p(b.encoding), this.encoding = b.encoding)
             }

             function s(b) {
                 return f = f || a("./_stream_duplex"), this instanceof s ? (this._readableState = new r(b, this), this.readable = !0, b && "function" == typeof b.read && (this._read = b.read), void i.call(this)) : new s(b)
             }

             function t(a, b, c, d, e) {
                 var f = y(b, c);
                 if (f) a.emit("error", f);
                 else if (null === c) b.reading = !1, z(a, b);
                 else if (b.objectMode || c && c.length > 0)
                     if (b.ended && !e) {
                         var g = new Error("stream.push() after EOF");
                         a.emit("error", g)
                     } else if (b.endEmitted && e) {
                     var h = new Error("stream.unshift() after end event");
                     a.emit("error", h)
                 } else {
                     var i;
                     !b.decoder || e || d || (c = b.decoder.write(c), i = !b.objectMode && 0 === c.length), e || (b.reading = !1), i || (b.flowing && 0 === b.length && !b.sync ? (a.emit("data", c), a.read(0)) : (b.length += b.objectMode ? 1 : c.length, e ? b.buffer.unshift(c) : b.buffer.push(c), b.needReadable && A(a))), C(a, b)
                 } else e || (b.reading = !1);
                 return u(b)
             }

             function u(a) {
                 return !a.ended && (a.needReadable || a.length < a.highWaterMark || 0 === a.length)
             }

             function w(a) {
                 return a >= v ? a = v : (a--, a |= a >>> 1, a |= a >>> 2, a |= a >>> 4, a |= a >>> 8, a |= a >>> 16, a++), a
             }

             function x(a, b) {
                 return a <= 0 || 0 === b.length && b.ended ? 0 : b.objectMode ? 1 : a !== a ? b.flowing && b.length ? b.buffer.head.data.length : b.length : (a > b.highWaterMark && (b.highWaterMark = w(a)), a <= b.length ? a : b.ended ? b.length : (b.needReadable = !0, 0))
             }

             function y(a, b) {
                 var c = null;
                 return j.isBuffer(b) || "string" == typeof b || null === b || void 0 === b || a.objectMode || (c = new TypeError("Invalid non-string/buffer chunk")), c
             }

             function z(a, b) {
                 if (!b.ended) {
                     if (b.decoder) {
                         var c = b.decoder.end();
                         c && c.length && (b.buffer.push(c), b.length += b.objectMode ? 1 : c.length)
                     }
                     b.ended = !0, A(a)
                 }
             }

             function A(a) {
                 var b = a._readableState;
                 b.needReadable = !1, b.emittedReadable || (n("emitReadable", b.flowing), b.emittedReadable = !0, b.sync ? d(B, a) : B(a))
             }

             function B(a) {
                 n("emit readable"), a.emit("readable"), I(a)
             }

             function C(a, b) {
                 b.readingMore || (b.readingMore = !0, d(D, a, b))
             }

             function D(a, b) {
                 for (var c = b.length; !b.reading && !b.flowing && !b.ended && b.length < b.highWaterMark && (n("maybeReadMore read 0"), a.read(0), c !== b.length);) c = b.length;
                 b.readingMore = !1
             }

             function E(a) {
                 return function() {
                     var b = a._readableState;
                     n("pipeOnDrain", b.awaitDrain), b.awaitDrain && b.awaitDrain--, 0 === b.awaitDrain && h(a, "data") && (b.flowing = !0, I(a))
                 }
             }

             function F(a) {
                 n("readable nexttick read 0"), a.read(0)
             }

             function G(a, b) {
                 b.resumeScheduled || (b.resumeScheduled = !0, d(H, a, b))
             }

             function H(a, b) {
                 b.reading || (n("resume read 0"), a.read(0)), b.resumeScheduled = !1, b.awaitDrain = 0, a.emit("resume"), I(a), b.flowing && !b.reading && a.read(0)
             }

             function I(a) {
                 var b = a._readableState;
                 for (n("flow", b.flowing); b.flowing && null !== a.read(););
             }

             function J(a, b) {
                 if (0 === b.length) return null;
                 var c;
                 return b.objectMode ? c = b.buffer.shift() : !a || a >= b.length ? (c = b.decoder ? b.buffer.join("") : 1 === b.buffer.length ? b.buffer.head.data : b.buffer.concat(b.length), b.buffer.clear()) : c = K(a, b.buffer, b.decoder), c
             }

             function K(a, b, c) {
                 var d;
                 return a < b.head.data.length ? (d = b.head.data.slice(0, a), b.head.data = b.head.data.slice(a)) : d = a === b.head.data.length ? b.shift() : c ? L(a, b) : M(a, b), d
             }

             function L(a, b) {
                 var c = b.head,
                     d = 1,
                     e = c.data;
                 for (a -= e.length; c = c.next;) {
                     var f = c.data,
                         g = a > f.length ? f.length : a;
                     if (e += g === f.length ? f : f.slice(0, a), a -= g, 0 === a) {
                         g === f.length ? (++d, c.next ? b.head = c.next : b.head = b.tail = null) : (b.head = c, c.data = f.slice(g));
                         break
                     }++d
                 }
                 return b.length -= d, e
             }

             function M(a, b) {
                 var c = k.allocUnsafe(a),
                     d = b.head,
                     e = 1;
                 for (d.data.copy(c), a -= d.data.length; d = d.next;) {
                     var f = d.data,
                         g = a > f.length ? f.length : a;
                     if (f.copy(c, c.length - a, 0, g), a -= g, 0 === a) {
                         g === f.length ? (++e, d.next ? b.head = d.next : b.head = b.tail = null) : (b.head = d, d.data = f.slice(g));
                         break
                     }++e
                 }
                 return b.length -= e, c
             }

             function N(a) {
                 var b = a._readableState;
                 if (b.length > 0) throw new Error('"endReadable()" called on non-empty stream');
                 b.endEmitted || (b.ended = !0, d(O, b, a))
             }

             function O(a, b) {
                 a.endEmitted || 0 !== a.length || (a.endEmitted = !0, b.readable = !1, b.emit("end"))
             }

             function P(a, b) {
                 for (var c = 0, d = a.length; c < d; c++) b(a[c], c)
             }

             function Q(a, b) {
                 for (var c = 0, d = a.length; c < d; c++)
                     if (a[c] === b) return c;
                 return -1
             }
             b.exports = s;
             var f, d = a("process-nextick-args"),
                 e = a("isarray");
             s.ReadableState = r;
             var i, h = (a("events").EventEmitter, function(a, b) {
                 return a.listeners(b).length
             });
             ! function() {
                 try {
                     i = a("stream")
                 } catch (a) {} finally {
                     i || (i = a("events").EventEmitter)
                 }
             }();
             var j = a("buffer").Buffer,
                 k = a("buffer-shims"),
                 l = a("core-util-is");
             l.inherits = a("inherits");
             var m = a("util"),
                 n = void 0;
             n = m && m.debuglog ? m.debuglog("stream") : function() {};
             var p, o = a("./internal/streams/BufferList");
             l.inherits(s, i), s.prototype.push = function(a, b) {
                 var c = this._readableState;
                 return c.objectMode || "string" != typeof a || (b = b || c.defaultEncoding, b !== c.encoding && (a = k.from(a, b), b = "")), t(this, c, a, b, !1)
             }, s.prototype.unshift = function(a) {
                 var b = this._readableState;
                 return t(this, b, a, "", !0)
             }, s.prototype.isPaused = function() {
                 return this._readableState.flowing === !1
             }, s.prototype.setEncoding = function(b) {
                 return p || (p = a("string_decoder/").StringDecoder), this._readableState.decoder = new p(b), this._readableState.encoding = b, this
             };
             var v = 8388608;
             s.prototype.read = function(a) {
                 n("read", a), a = parseInt(a, 10);
                 var b = this._readableState,
                     c = a;
                 if (0 !== a && (b.emittedReadable = !1), 0 === a && b.needReadable && (b.length >= b.highWaterMark || b.ended)) return n("read: emitReadable", b.length, b.ended), 0 === b.length && b.ended ? N(this) : A(this), null;
                 if (a = x(a, b), 0 === a && b.ended) return 0 === b.length && N(this), null;
                 var d = b.needReadable;
                 n("need readable", d), (0 === b.length || b.length - a < b.highWaterMark) && (d = !0, n("length less than watermark", d)), b.ended || b.reading ? (d = !1, n("reading or ended", d)) : d && (n("do read"), b.reading = !0, b.sync = !0, 0 === b.length && (b.needReadable = !0), this._read(b.highWaterMark), b.sync = !1, b.reading || (a = x(c, b)));
                 var e;
                 return e = a > 0 ? J(a, b) : null, null === e ? (b.needReadable = !0, a = 0) : b.length -= a, 0 === b.length && (b.ended || (b.needReadable = !0), c !== a && b.ended && N(this)), null !== e && this.emit("data", e), e
             }, s.prototype._read = function(a) {
                 this.emit("error", new Error("_read() is not implemented"))
             }, s.prototype.pipe = function(a, b) {
                 function j(a) {
                     n("onunpipe"), a === e && o()
                 }

                 function k() {
                     n("onend"), a.end()
                 }

                 function o() {
                     n("cleanup"), a.removeListener("close", t), a.removeListener("finish", u), a.removeListener("drain", l), a.removeListener("error", s), a.removeListener("unpipe", j), e.removeListener("end", k), e.removeListener("end", o), e.removeListener("data", r), m = !0, !f.awaitDrain || a._writableState && !a._writableState.needDrain || l()
                 }

                 function r(b) {
                     n("ondata"), p = !1;
                     var c = a.write(b);
                     !1 !== c || p || ((1 === f.pipesCount && f.pipes === a || f.pipesCount > 1 && Q(f.pipes, a) !== -1) && !m && (n("false write response, pause", e._readableState.awaitDrain), e._readableState.awaitDrain++, p = !0), e.pause())
                 }

                 function s(b) {
                     n("onerror", b), v(), a.removeListener("error", s), 0 === h(a, "error") && a.emit("error", b)
                 }

                 function t() {
                     a.removeListener("finish", u), v()
                 }

                 function u() {
                     n("onfinish"), a.removeListener("close", t), v()
                 }

                 function v() {
                     n("unpipe"), e.unpipe(a)
                 }
                 var e = this,
                     f = this._readableState;
                 switch (f.pipesCount) {
                     case 0:
                         f.pipes = a;
                         break;
                     case 1:
                         f.pipes = [f.pipes, a];
                         break;
                     default:
                         f.pipes.push(a)
                 }
                 f.pipesCount += 1, n("pipe count=%d opts=%j", f.pipesCount, b);
                 var g = (!b || b.end !== !1) && a !== c.stdout && a !== c.stderr,
                     i = g ? k : o;
                 f.endEmitted ? d(i) : e.once("end", i), a.on("unpipe", j);
                 var l = E(e);
                 a.on("drain", l);
                 var m = !1,
                     p = !1;
                 return e.on("data", r), q(a, "error", s), a.once("close", t), a.once("finish", u), a.emit("pipe", e), f.flowing || (n("pipe resume"), e.resume()), a
             }, s.prototype.unpipe = function(a) {
                 var b = this._readableState;
                 if (0 === b.pipesCount) return this;
                 if (1 === b.pipesCount) return a && a !== b.pipes ? this : (a || (a = b.pipes), b.pipes = null, b.pipesCount = 0, b.flowing = !1, a && a.emit("unpipe", this), this);
                 if (!a) {
                     var c = b.pipes,
                         d = b.pipesCount;
                     b.pipes = null, b.pipesCount = 0, b.flowing = !1;
                     for (var e = 0; e < d; e++) c[e].emit("unpipe", this);
                     return this
                 }
                 var f = Q(b.pipes, a);
                 return f === -1 ? this : (b.pipes.splice(f, 1), b.pipesCount -= 1, 1 === b.pipesCount && (b.pipes = b.pipes[0]), a.emit("unpipe", this), this)
             }, s.prototype.on = function(a, b) {
                 var c = i.prototype.on.call(this, a, b);
                 if ("data" === a) this._readableState.flowing !== !1 && this.resume();
                 else if ("readable" === a) {
                     var e = this._readableState;
                     e.endEmitted || e.readableListening || (e.readableListening = e.needReadable = !0, e.emittedReadable = !1, e.reading ? e.length && A(this, e) : d(F, this))
                 }
                 return c
             }, s.prototype.addListener = s.prototype.on, s.prototype.resume = function() {
                 var a = this._readableState;
                 return a.flowing || (n("resume"), a.flowing = !0, G(this, a)), this
             }, s.prototype.pause = function() {
                 return n("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (n("pause"), this._readableState.flowing = !1, this.emit("pause")), this
             }, s.prototype.wrap = function(a) {
                 var b = this._readableState,
                     c = !1,
                     d = this;
                 a.on("end", function() {
                     if (n("wrapped end"), b.decoder && !b.ended) {
                         var a = b.decoder.end();
                         a && a.length && d.push(a)
                     }
                     d.push(null)
                 }), a.on("data", function(e) {
                     if (n("wrapped data"), b.decoder && (e = b.decoder.write(e)), (!b.objectMode || null !== e && void 0 !== e) && (b.objectMode || e && e.length)) {
                         var f = d.push(e);
                         f || (c = !0, a.pause())
                     }
                 });
                 for (var e in a) void 0 === this[e] && "function" == typeof a[e] && (this[e] = function(b) {
                     return function() {
                         return a[b].apply(a, arguments)
                     }
                 }(e));
                 var f = ["error", "close", "destroy", "pause", "resume"];
                 return P(f, function(b) {
                     a.on(b, d.emit.bind(d, b))
                 }), d._read = function(b) {
                     n("wrapped _read", b), c && (c = !1, a.resume())
                 }, d
             }, s._fromList = J
         }).call(this, a("_process"))
     }, {
         "./_stream_duplex": 37,
         "./internal/streams/BufferList": 42,
         _process: 32,
         buffer: 22,
         "buffer-shims": 21,
         "core-util-is": 24,
         events: 25,
         inherits: 28,
         isarray: 30,
         "process-nextick-args": 31,
         "string_decoder/": 48,
         util: 19
     }],
     40: [function(a, b, c) {
         "use strict";

         function f(a) {
             this.afterTransform = function(b, c) {
                 return g(a, b, c)
             }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null
         }

         function g(a, b, c) {
             var d = a._transformState;
             d.transforming = !1;
             var e = d.writecb;
             if (!e) return a.emit("error", new Error("no writecb in Transform class"));
             d.writechunk = null, d.writecb = null, null !== c && void 0 !== c && a.push(c), e(b);
             var f = a._readableState;
             f.reading = !1, (f.needReadable || f.length < f.highWaterMark) && a._read(f.highWaterMark)
         }

         function h(a) {
             if (!(this instanceof h)) return new h(a);
             d.call(this, a), this._transformState = new f(this);
             var b = this;
             this._readableState.needReadable = !0, this._readableState.sync = !1, a && ("function" == typeof a.transform && (this._transform = a.transform), "function" == typeof a.flush && (this._flush = a.flush)), this.once("prefinish", function() {
                 "function" == typeof this._flush ? this._flush(function(a, c) {
                     i(b, a, c)
                 }) : i(b)
             })
         }

         function i(a, b, c) {
             if (b) return a.emit("error", b);
             null !== c && void 0 !== c && a.push(c);
             var d = a._writableState,
                 e = a._transformState;
             if (d.length) throw new Error("Calling transform done when ws.length != 0");
             if (e.transforming) throw new Error("Calling transform done when still transforming");
             return a.push(null)
         }
         b.exports = h;
         var d = a("./_stream_duplex"),
             e = a("core-util-is");
         e.inherits = a("inherits"), e.inherits(h, d), h.prototype.push = function(a, b) {
             return this._transformState.needTransform = !1, d.prototype.push.call(this, a, b)
         }, h.prototype._transform = function(a, b, c) {
             throw new Error("_transform() is not implemented")
         }, h.prototype._write = function(a, b, c) {
             var d = this._transformState;
             if (d.writecb = c, d.writechunk = a, d.writeencoding = b, !d.transforming) {
                 var e = this._readableState;
                 (d.needTransform || e.needReadable || e.length < e.highWaterMark) && this._read(e.highWaterMark)
             }
         }, h.prototype._read = function(a) {
             var b = this._transformState;
             null !== b.writechunk && b.writecb && !b.transforming ? (b.transforming = !0, this._transform(b.writechunk, b.writeencoding, b.afterTransform)) : b.needTransform = !0
         }
     }, {
         "./_stream_duplex": 37,
         "core-util-is": 24,
         inherits: 28
     }],
     41: [function(a, b, c) {
         (function(c) {
             "use strict";

             function l() {}

             function m(a, b, c) {
                 this.chunk = a, this.encoding = b, this.callback = c, this.next = null
             }

             function n(b, c) {
                 f = f || a("./_stream_duplex"), b = b || {}, this.objectMode = !!b.objectMode, c instanceof f && (this.objectMode = this.objectMode || !!b.writableObjectMode);
                 var d = b.highWaterMark,
                     e = this.objectMode ? 16 : 16384;
                 this.highWaterMark = d || 0 === d ? d : e, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
                 var g = b.decodeStrings === !1;
                 this.decodeStrings = !g, this.defaultEncoding = b.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(a) {
                     x(c, a)
                 }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new F(this)
             }

             function p(b) {
                 return f = f || a("./_stream_duplex"), o.call(p, this) || this instanceof f ? (this._writableState = new n(b, this), this.writable = !0, b && ("function" == typeof b.write && (this._write = b.write), "function" == typeof b.writev && (this._writev = b.writev)), void i.call(this)) : new p(b)
             }

             function q(a, b) {
                 var c = new Error("write after end");
                 a.emit("error", c), d(b, c)
             }

             function r(a, b, c, e) {
                 var f = !0,
                     g = !1;
                 return null === c ? g = new TypeError("May not write null values to stream") : "string" == typeof c || void 0 === c || b.objectMode || (g = new TypeError("Invalid non-string/buffer chunk")), g && (a.emit("error", g), d(e, g), f = !1), f
             }

             function s(a, b, c) {
                 return a.objectMode || a.decodeStrings === !1 || "string" != typeof b || (b = k.from(b, c)), b
             }

             function t(a, b, c, d, e, f) {
                 c || (d = s(b, d, e), j.isBuffer(d) && (e = "buffer"));
                 var g = b.objectMode ? 1 : d.length;
                 b.length += g;
                 var h = b.length < b.highWaterMark;
                 if (h || (b.needDrain = !0), b.writing || b.corked) {
                     var i = b.lastBufferedRequest;
                     b.lastBufferedRequest = new m(d, e, f), i ? i.next = b.lastBufferedRequest : b.bufferedRequest = b.lastBufferedRequest, b.bufferedRequestCount += 1
                 } else u(a, b, !1, g, d, e, f);
                 return h
             }

             function u(a, b, c, d, e, f, g) {
                 b.writelen = d, b.writecb = g, b.writing = !0, b.sync = !0, c ? a._writev(e, b.onwrite) : a._write(e, f, b.onwrite), b.sync = !1
             }

             function v(a, b, c, e, f) {
                 --b.pendingcb, c ? d(f, e) : f(e), a._writableState.errorEmitted = !0, a.emit("error", e)
             }

             function w(a) {
                 a.writing = !1, a.writecb = null, a.length -= a.writelen, a.writelen = 0
             }

             function x(a, b) {
                 var c = a._writableState,
                     d = c.sync,
                     f = c.writecb;
                 if (w(c), b) v(a, c, d, b, f);
                 else {
                     var g = B(c);
                     g || c.corked || c.bufferProcessing || !c.bufferedRequest || A(a, c), d ? e(y, a, c, g, f) : y(a, c, g, f)
                 }
             }

             function y(a, b, c, d) {
                 c || z(a, b), b.pendingcb--, d(), D(a, b)
             }

             function z(a, b) {
                 0 === b.length && b.needDrain && (b.needDrain = !1, a.emit("drain"))
             }

             function A(a, b) {
                 b.bufferProcessing = !0;
                 var c = b.bufferedRequest;
                 if (a._writev && c && c.next) {
                     var d = b.bufferedRequestCount,
                         e = new Array(d),
                         f = b.corkedRequestsFree;
                     f.entry = c;
                     for (var g = 0; c;) e[g] = c, c = c.next, g += 1;
                     u(a, b, !0, b.length, e, "", f.finish), b.pendingcb++, b.lastBufferedRequest = null, f.next ? (b.corkedRequestsFree = f.next, f.next = null) : b.corkedRequestsFree = new F(b)
                 } else {
                     for (; c;) {
                         var h = c.chunk,
                             i = c.encoding,
                             j = c.callback,
                             k = b.objectMode ? 1 : h.length;
                         if (u(a, b, !1, k, h, i, j), c = c.next, b.writing) break
                     }
                     null === c && (b.lastBufferedRequest = null)
                 }
                 b.bufferedRequestCount = 0, b.bufferedRequest = c, b.bufferProcessing = !1
             }

             function B(a) {
                 return a.ending && 0 === a.length && null === a.bufferedRequest && !a.finished && !a.writing
             }

             function C(a, b) {
                 b.prefinished || (b.prefinished = !0, a.emit("prefinish"))
             }

             function D(a, b) {
                 var c = B(b);
                 return c && (0 === b.pendingcb ? (C(a, b), b.finished = !0, a.emit("finish")) : C(a, b)), c
             }

             function E(a, b, c) {
                 b.ending = !0, D(a, b), c && (b.finished ? d(c) : a.once("finish", c)), b.ended = !0, a.writable = !1
             }

             function F(a) {
                 var b = this;
                 this.next = null, this.entry = null, this.finish = function(c) {
                     var d = b.entry;
                     for (b.entry = null; d;) {
                         var e = d.callback;
                         a.pendingcb--, e(c), d = d.next
                     }
                     a.corkedRequestsFree ? a.corkedRequestsFree.next = b : a.corkedRequestsFree = b
                 }
             }
             b.exports = p;
             var f, d = a("process-nextick-args"),
                 e = !c.browser && ["v0.10", "v0.9."].indexOf(c.version.slice(0, 5)) > -1 ? setImmediate : d;
             p.WritableState = n;
             var g = a("core-util-is");
             g.inherits = a("inherits");
             var i, h = {
                 deprecate: a("util-deprecate")
             };
             ! function() {
                 try {
                     i = a("stream")
                 } catch (a) {} finally {
                     i || (i = a("events").EventEmitter)
                 }
             }();
             var j = a("buffer").Buffer,
                 k = a("buffer-shims");
             g.inherits(p, i), n.prototype.getBuffer = function() {
                     for (var b = this.bufferedRequest, c = []; b;) c.push(b), b = b.next;
                     return c
                 },
                 function() {
                     try {
                         Object.defineProperty(n.prototype, "buffer", {
                             get: h.deprecate(function() {
                                 return this.getBuffer()
                             }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
                         })
                     } catch (a) {}
                 }();
             var o;
             "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (o = Function.prototype[Symbol.hasInstance], Object.defineProperty(p, Symbol.hasInstance, {
                 value: function(a) {
                     return !!o.call(this, a) || a && a._writableState instanceof n
                 }
             })) : o = function(a) {
                 return a instanceof this
             }, p.prototype.pipe = function() {
                 this.emit("error", new Error("Cannot pipe, not readable"))
             }, p.prototype.write = function(a, b, c) {
                 var d = this._writableState,
                     e = !1,
                     f = j.isBuffer(a);
                 return "function" == typeof b && (c = b, b = null), f ? b = "buffer" : b || (b = d.defaultEncoding), "function" != typeof c && (c = l), d.ended ? q(this, c) : (f || r(this, d, a, c)) && (d.pendingcb++, e = t(this, d, f, a, b, c)), e
             }, p.prototype.cork = function() {
                 var a = this._writableState;
                 a.corked++
             }, p.prototype.uncork = function() {
                 var a = this._writableState;
                 a.corked && (a.corked--, a.writing || a.corked || a.finished || a.bufferProcessing || !a.bufferedRequest || A(this, a))
             }, p.prototype.setDefaultEncoding = function(b) {
                 if ("string" == typeof b && (b = b.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((b + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + b);
                 return this._writableState.defaultEncoding = b, this
             }, p.prototype._write = function(a, b, c) {
                 c(new Error("_write() is not implemented"))
             }, p.prototype._writev = null, p.prototype.end = function(a, b, c) {
                 var d = this._writableState;
                 "function" == typeof a ? (c = a, a = null, b = null) : "function" == typeof b && (c = b, b = null), null !== a && void 0 !== a && this.write(a, b), d.corked && (d.corked = 1, this.uncork()), d.ending || d.finished || E(this, d, c)
             }
         }).call(this, a("_process"))
     }, {
         "./_stream_duplex": 37,
         _process: 32,
         buffer: 22,
         "buffer-shims": 21,
         "core-util-is": 24,
         events: 25,
         inherits: 28,
         "process-nextick-args": 31,
         "util-deprecate": 52
     }],
     42: [function(a, b, c) {
         "use strict";

         function f() {
             this.head = null, this.tail = null, this.length = 0
         }
         var e = (a("buffer").Buffer, a("buffer-shims"));
         b.exports = f, f.prototype.push = function(a) {
             var b = {
                 data: a,
                 next: null
             };
             this.length > 0 ? this.tail.next = b : this.head = b, this.tail = b, ++this.length
         }, f.prototype.unshift = function(a) {
             var b = {
                 data: a,
                 next: this.head
             };
             0 === this.length && (this.tail = b), this.head = b, ++this.length
         }, f.prototype.shift = function() {
             if (0 !== this.length) {
                 var a = this.head.data;
                 return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, a
             }
         }, f.prototype.clear = function() {
             this.head = this.tail = null, this.length = 0
         }, f.prototype.join = function(a) {
             if (0 === this.length) return "";
             for (var b = this.head, c = "" + b.data; b = b.next;) c += a + b.data;
             return c
         }, f.prototype.concat = function(a) {
             if (0 === this.length) return e.alloc(0);
             if (1 === this.length) return this.head.data;
             for (var b = e.allocUnsafe(a >>> 0), c = this.head, d = 0; c;) c.data.copy(b, d), d += c.data.length, c = c.next;
             return b
         }
     }, {
         buffer: 22,
         "buffer-shims": 21
     }],
     43: [function(a, b, c) {
         (function(d) {
             var e = function() {
                 try {
                     return a("stream")
                 } catch (a) {}
             }();
             c = b.exports = a("./lib/_stream_readable.js"), c.Stream = e || c, c.Readable = c, c.Writable = a("./lib/_stream_writable.js"), c.Duplex = a("./lib/_stream_duplex.js"), c.Transform = a("./lib/_stream_transform.js"), c.PassThrough = a("./lib/_stream_passthrough.js"), !d.browser && "disable" === d.env.READABLE_STREAM && e && (b.exports = e)
         }).call(this, a("_process"))
     }, {
         "./lib/_stream_duplex.js": 37,
         "./lib/_stream_passthrough.js": 38,
         "./lib/_stream_readable.js": 39,
         "./lib/_stream_transform.js": 40,
         "./lib/_stream_writable.js": 41,
         _process: 32
     }],
     44: [function(a, b, c) {
         (function(b) {
             var d = a("./lib/request"),
                 e = a("xtend"),
                 f = a("builtin-status-codes"),
                 g = a("url"),
                 h = c;
             h.request = function(a, c) {
                 a = "string" == typeof a ? g.parse(a) : e(a);
                 var f = b.location.protocol.search(/^https?:$/) === -1 ? "http:" : "",
                     h = a.protocol || f,
                     i = a.hostname || a.host,
                     j = a.port,
                     k = a.path || "/";
                 i && i.indexOf(":") !== -1 && (i = "[" + i + "]"), a.url = (i ? h + "//" + i : "") + (j ? ":" + j : "") + k, a.method = (a.method || "GET").toUpperCase(), a.headers = a.headers || {};
                 var l = new d(a);
                 return c && l.on("response", c), l
             }, h.get = function(b, c) {
                 var d = h.request(b, c);
                 return d.end(), d
             }, h.Agent = function() {}, h.Agent.defaultMaxSockets = 4, h.STATUS_CODES = f, h.METHODS = ["CHECKOUT", "CONNECT", "COPY", "DELETE", "GET", "HEAD", "LOCK", "M-SEARCH", "MERGE", "MKACTIVITY", "MKCOL", "MOVE", "NOTIFY", "OPTIONS", "PATCH", "POST", "PROPFIND", "PROPPATCH", "PURGE", "PUT", "REPORT", "SEARCH", "SUBSCRIBE", "TRACE", "UNLOCK", "UNSUBSCRIBE"]
         }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
     }, {
         "./lib/request": 46,
         "builtin-status-codes": 23,
         url: 50,
         xtend: 54
     }],
     45: [function(a, b, c) {
         (function(a) {
             function d() {
                 if (void 0 !== b) return b;
                 if (a.XMLHttpRequest) {
                     b = new a.XMLHttpRequest;
                     try {
                         b.open("GET", a.XDomainRequest ? "/" : "https://example.com")
                     } catch (a) {
                         b = null
                     }
                 } else b = null;
                 return b
             }

             function e(a) {
                 var b = d();
                 if (!b) return !1;
                 try {
                     return b.responseType = a, b.responseType === a
                 } catch (a) {}
                 return !1
             }

             function h(a) {
                 return "function" == typeof a
             }
             c.fetch = h(a.fetch) && h(a.ReadableStream), c.blobConstructor = !1;
             try {
                 new Blob([new ArrayBuffer(1)]), c.blobConstructor = !0
             } catch (a) {}
             var b, f = "undefined" != typeof a.ArrayBuffer,
                 g = f && h(a.ArrayBuffer.prototype.slice);
             c.arraybuffer = c.fetch || f && e("arraybuffer"), c.msstream = !c.fetch && g && e("ms-stream"), c.mozchunkedarraybuffer = !c.fetch && f && e("moz-chunked-arraybuffer"), c.overrideMimeType = c.fetch || !!d() && h(d().overrideMimeType), c.vbArray = h(a.VBArray), b = null
         }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
     }, {}],
     46: [function(a, b, c) {
         (function(c, d, e) {
             function m(a, b) {
                 return f.fetch && b ? "fetch" : f.mozchunkedarraybuffer ? "moz-chunked-arraybuffer" : f.msstream ? "ms-stream" : f.arraybuffer && a ? "arraybuffer" : f.vbArray && a ? "text:vbarray" : "text"
             }

             function o(a) {
                 try {
                     var b = a.status;
                     return null !== b && 0 !== b
                 } catch (a) {
                     return !1
                 }
             }
             var f = a("./capability"),
                 g = a("inherits"),
                 h = a("./response"),
                 i = a("readable-stream"),
                 j = a("to-arraybuffer"),
                 k = h.IncomingMessage,
                 l = h.readyStates,
                 n = b.exports = function(a) {
                     var b = this;
                     i.Writable.call(b), b._opts = a, b._body = [], b._headers = {}, a.auth && b.setHeader("Authorization", "Basic " + new e(a.auth).toString("base64")), Object.keys(a.headers).forEach(function(c) {
                         b.setHeader(c, a.headers[c])
                     });
                     var c, d = !0;
                     if ("disable-fetch" === a.mode || "timeout" in a) d = !1, c = !0;
                     else if ("prefer-streaming" === a.mode) c = !1;
                     else if ("allow-wrong-content-type" === a.mode) c = !f.overrideMimeType;
                     else {
                         if (a.mode && "default" !== a.mode && "prefer-fast" !== a.mode) throw new Error("Invalid value for opts.mode");
                         c = !0
                     }
                     b._mode = m(c, d), b.on("finish", function() {
                         b._onFinish()
                     })
                 };
             g(n, i.Writable), n.prototype.setHeader = function(a, b) {
                 var c = this,
                     d = a.toLowerCase();
                 p.indexOf(d) === -1 && (c._headers[d] = {
                     name: a,
                     value: b
                 })
             }, n.prototype.getHeader = function(a) {
                 var b = this;
                 return b._headers[a.toLowerCase()].value
             }, n.prototype.removeHeader = function(a) {
                 var b = this;
                 delete b._headers[a.toLowerCase()]
             }, n.prototype._onFinish = function() {
                 var a = this;
                 if (!a._destroyed) {
                     var b = a._opts,
                         g = a._headers,
                         h = null;
                     if ("POST" !== b.method && "PUT" !== b.method && "PATCH" !== b.method && "MERGE" !== b.method || (h = f.blobConstructor ? new d.Blob(a._body.map(function(a) {
                             return j(a)
                         }), {
                             type: (g["content-type"] || {}).value || ""
                         }) : e.concat(a._body).toString()), "fetch" === a._mode) {
                         var i = Object.keys(g).map(function(a) {
                             return [g[a].name, g[a].value]
                         });
                         d.fetch(a._opts.url, {
                             method: a._opts.method,
                             headers: i,
                             body: h || void 0,
                             mode: "cors",
                             credentials: b.withCredentials ? "include" : "same-origin"
                         }).then(function(b) {
                             a._fetchResponse = b, a._connect()
                         }, function(b) {
                             a.emit("error", b)
                         })
                     } else {
                         var k = a._xhr = new d.XMLHttpRequest;
                         try {
                             k.open(a._opts.method, a._opts.url, !0)
                         } catch (b) {
                             return void c.nextTick(function() {
                                 a.emit("error", b)
                             })
                         }
                         "responseType" in k && (k.responseType = a._mode.split(":")[0]), "withCredentials" in k && (k.withCredentials = !!b.withCredentials), "text" === a._mode && "overrideMimeType" in k && k.overrideMimeType("text/plain; charset=x-user-defined"), "timeout" in b && (k.timeout = b.timeout, k.ontimeout = function() {
                             a.emit("timeout")
                         }), Object.keys(g).forEach(function(a) {
                             k.setRequestHeader(g[a].name, g[a].value)
                         }), a._response = null, k.onreadystatechange = function() {
                             switch (k.readyState) {
                                 case l.LOADING:
                                 case l.DONE:
                                     a._onXHRProgress()
                             }
                         }, "moz-chunked-arraybuffer" === a._mode && (k.onprogress = function() {
                             a._onXHRProgress()
                         }), k.onerror = function() {
                             a._destroyed || a.emit("error", new Error("XHR error"))
                         };
                         try {
                             k.send(h)
                         } catch (b) {
                             return void c.nextTick(function() {
                                 a.emit("error", b)
                             })
                         }
                     }
                 }
             }, n.prototype._onXHRProgress = function() {
                 var a = this;
                 o(a._xhr) && !a._destroyed && (a._response || a._connect(), a._response._onXHRProgress())
             }, n.prototype._connect = function() {
                 var a = this;
                 a._destroyed || (a._response = new k(a._xhr, a._fetchResponse, a._mode), a._response.on("error", function(b) {
                     a.emit("error", b)
                 }), a.emit("response", a._response))
             }, n.prototype._write = function(a, b, c) {
                 var d = this;
                 d._body.push(a), c()
             }, n.prototype.abort = n.prototype.destroy = function() {
                 var a = this;
                 a._destroyed = !0, a._response && (a._response._destroyed = !0), a._xhr && a._xhr.abort()
             }, n.prototype.end = function(a, b, c) {
                 var d = this;
                 "function" == typeof a && (c = a, a = void 0), i.Writable.prototype.end.call(d, a, b, c)
             }, n.prototype.flushHeaders = function() {}, n.prototype.setTimeout = function() {}, n.prototype.setNoDelay = function() {}, n.prototype.setSocketKeepAlive = function() {};
             var p = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "date", "dnt", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "user-agent", "via"]
         }).call(this, a("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, a("buffer").Buffer)
     }, {
         "./capability": 45,
         "./response": 47,
         _process: 32,
         buffer: 22,
         inherits: 28,
         "readable-stream": 43,
         "to-arraybuffer": 49
     }],
     47: [function(a, b, c) {
         (function(b, d, e) {
             var f = a("./capability"),
                 g = a("inherits"),
                 h = a("readable-stream"),
                 i = c.readyStates = {
                     UNSENT: 0,
                     OPENED: 1,
                     HEADERS_RECEIVED: 2,
                     LOADING: 3,
                     DONE: 4
                 },
                 j = c.IncomingMessage = function(a, c, d) {
                     function j() {
                         i.read().then(function(a) {
                             if (!g._destroyed) {
                                 if (a.done) return void g.push(null);
                                 g.push(new e(a.value)), j()
                             }
                         }).catch(function(a) {
                             g.emit("error", a)
                         })
                     }
                     var g = this;
                     if (h.Readable.call(g), g._mode = d, g.headers = {}, g.rawHeaders = [], g.trailers = {}, g.rawTrailers = [], g.on("end", function() {
                             b.nextTick(function() {
                                 g.emit("close")
                             })
                         }), "fetch" === d) {
                         g._fetchResponse = c, g.url = c.url, g.statusCode = c.status, g.statusMessage = c.statusText, c.headers.forEach(function(a, b) {
                             g.headers[b.toLowerCase()] = a, g.rawHeaders.push(b, a)
                         });
                         var i = c.body.getReader();
                         j()
                     } else {
                         g._xhr = a, g._pos = 0, g.url = a.responseURL, g.statusCode = a.status, g.statusMessage = a.statusText;
                         var k = a.getAllResponseHeaders().split(/\r?\n/);
                         if (k.forEach(function(a) {
                                 var b = a.match(/^([^:]+):\s*(.*)/);
                                 if (b) {
                                     var c = b[1].toLowerCase();
                                     "set-cookie" === c ? (void 0 === g.headers[c] && (g.headers[c] = []), g.headers[c].push(b[2])) : void 0 !== g.headers[c] ? g.headers[c] += ", " + b[2] : g.headers[c] = b[2], g.rawHeaders.push(b[1], b[2])
                                 }
                             }), g._charset = "x-user-defined", !f.overrideMimeType) {
                             var l = g.rawHeaders["mime-type"];
                             if (l) {
                                 var m = l.match(/;\s*charset=([^;])(;|$)/);
                                 m && (g._charset = m[1].toLowerCase())
                             }
                             g._charset || (g._charset = "utf-8")
                         }
                     }
                 };
             g(j, h.Readable), j.prototype._read = function() {}, j.prototype._onXHRProgress = function() {
                 var a = this,
                     b = a._xhr,
                     c = null;
                 switch (a._mode) {
                     case "text:vbarray":
                         if (b.readyState !== i.DONE) break;
                         try {
                             c = new d.VBArray(b.responseBody).toArray()
                         } catch (a) {}
                         if (null !== c) {
                             a.push(new e(c));
                             break
                         }
                     case "text":
                         try {
                             c = b.responseText
                         } catch (b) {
                             a._mode = "text:vbarray";
                             break
                         }
                         if (c.length > a._pos) {
                             var f = c.substr(a._pos);
                             if ("x-user-defined" === a._charset) {
                                 for (var g = new e(f.length), h = 0; h < f.length; h++) g[h] = 255 & f.charCodeAt(h);
                                 a.push(g)
                             } else a.push(f, a._charset);
                             a._pos = c.length
                         }
                         break;
                     case "arraybuffer":
                         if (b.readyState !== i.DONE || !b.response) break;
                         c = b.response, a.push(new e(new Uint8Array(c)));
                         break;
                     case "moz-chunked-arraybuffer":
                         if (c = b.response, b.readyState !== i.LOADING || !c) break;
                         a.push(new e(new Uint8Array(c)));
                         break;
                     case "ms-stream":
                         if (c = b.response, b.readyState !== i.LOADING) break;
                         var j = new d.MSStreamReader;
                         j.onprogress = function() {
                             j.result.byteLength > a._pos && (a.push(new e(new Uint8Array(j.result.slice(a._pos)))), a._pos = j.result.byteLength)
                         }, j.onload = function() {
                             a.push(null)
                         }, j.readAsArrayBuffer(c)
                 }
                 a._xhr.readyState === i.DONE && "ms-stream" !== a._mode && a.push(null)
             }
         }).call(this, a("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, a("buffer").Buffer)
     }, {
         "./capability": 45,
         _process: 32,
         buffer: 22,
         inherits: 28,
         "readable-stream": 43
     }],
     48: [function(a, b, c) {
         function f(a) {
             if (a && !e(a)) throw new Error("Unknown encoding: " + a)
         }

         function h(a) {
             return a.toString(this.encoding)
         }

         function i(a) {
             this.charReceived = a.length % 2, this.charLength = this.charReceived ? 2 : 0
         }

         function j(a) {
             this.charReceived = a.length % 3, this.charLength = this.charReceived ? 3 : 0
         }
         var d = a("buffer").Buffer,
             e = d.isEncoding || function(a) {
                 switch (a && a.toLowerCase()) {
                     case "hex":
                     case "utf8":
                     case "utf-8":
                     case "ascii":
                     case "binary":
                     case "base64":
                     case "ucs2":
                     case "ucs-2":
                     case "utf16le":
                     case "utf-16le":
                     case "raw":
                         return !0;
                     default:
                         return !1
                 }
             },
             g = c.StringDecoder = function(a) {
                 switch (this.encoding = (a || "utf8").toLowerCase().replace(/[-_]/, ""), f(a), this.encoding) {
                     case "utf8":
                         this.surrogateSize = 3;
                         break;
                     case "ucs2":
                     case "utf16le":
                         this.surrogateSize = 2, this.detectIncompleteChar = i;
                         break;
                     case "base64":
                         this.surrogateSize = 3, this.detectIncompleteChar = j;
                         break;
                     default:
                         return void(this.write = h)
                 }
                 this.charBuffer = new d(6), this.charReceived = 0, this.charLength = 0
             };
         g.prototype.write = function(a) {
             for (var b = ""; this.charLength;) {
                 var c = a.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : a.length;
                 if (a.copy(this.charBuffer, this.charReceived, 0, c), this.charReceived += c, this.charReceived < this.charLength) return "";
                 a = a.slice(c, a.length), b = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
                 var d = b.charCodeAt(b.length - 1);
                 if (!(d >= 55296 && d <= 56319)) {
                     if (this.charReceived = this.charLength = 0, 0 === a.length) return b;
                     break
                 }
                 this.charLength += this.surrogateSize, b = ""
             }
             this.detectIncompleteChar(a);
             var e = a.length;
             this.charLength && (a.copy(this.charBuffer, 0, a.length - this.charReceived, e), e -= this.charReceived), b += a.toString(this.encoding, 0, e);
             var e = b.length - 1,
                 d = b.charCodeAt(e);
             if (d >= 55296 && d <= 56319) {
                 var f = this.surrogateSize;
                 return this.charLength += f, this.charReceived += f, this.charBuffer.copy(this.charBuffer, f, 0, f), a.copy(this.charBuffer, 0, 0, f), b.substring(0, e)
             }
             return b
         }, g.prototype.detectIncompleteChar = function(a) {
             for (var b = a.length >= 3 ? 3 : a.length; b > 0; b--) {
                 var c = a[a.length - b];
                 if (1 == b && c >> 5 == 6) {
                     this.charLength = 2;
                     break
                 }
                 if (b <= 2 && c >> 4 == 14) {
                     this.charLength = 3;
                     break
                 }
                 if (b <= 3 && c >> 3 == 30) {
                     this.charLength = 4;
                     break
                 }
             }
             this.charReceived = b
         }, g.prototype.end = function(a) {
             var b = "";
             if (a && a.length && (b = this.write(a)), this.charReceived) {
                 var c = this.charReceived,
                     d = this.charBuffer,
                     e = this.encoding;
                 b += d.slice(0, c).toString(e)
             }
             return b
         }
     }, {
         buffer: 22
     }],
     49: [function(a, b, c) {
         var d = a("buffer").Buffer;
         b.exports = function(a) {
             if (a instanceof Uint8Array) {
                 if (0 === a.byteOffset && a.byteLength === a.buffer.byteLength) return a.buffer;
                 if ("function" == typeof a.buffer.slice) return a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength)
             }
             if (d.isBuffer(a)) {
                 for (var b = new Uint8Array(a.length), c = a.length, e = 0; e < c; e++) b[e] = a[e];
                 return b.buffer
             }
             throw new Error("Argument must be a Buffer")
         }
     }, {
         buffer: 22
     }],
     50: [function(a, b, c) {
         "use strict";

         function f() {
             this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null
         }

         function v(a, b, c) {
             if (a && e.isObject(a) && a instanceof f) return a;
             var d = new f;
             return d.parse(a, b, c), d
         }

         function w(a) {
             return e.isString(a) && (a = v(a)), a instanceof f ? a.format() : f.prototype.format.call(a)
         }

         function x(a, b) {
             return v(a, !1, !0).resolve(b)
         }

         function y(a, b) {
             return a ? v(a, !1, !0).resolveObject(b) : b
         }
         var d = a("punycode"),
             e = a("./util");
         c.parse = v, c.resolve = x, c.resolveObject = y, c.format = w, c.Url = f;
         var g = /^([a-z0-9.+-]+:)/i,
             h = /:[0-9]*$/,
             i = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
             j = ["<", ">", '"', "`", " ", "\r", "\n", "\t"],
             k = ["{", "}", "|", "\\", "^", "`"].concat(j),
             l = ["'"].concat(k),
             m = ["%", "/", "?", ";", "#"].concat(l),
             n = ["/", "?", "#"],
             o = 255,
             p = /^[+a-z0-9A-Z_-]{0,63}$/,
             q = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
             r = {
                 javascript: !0,
                 "javascript:": !0
             },
             s = {
                 javascript: !0,
                 "javascript:": !0
             },
             t = {
                 http: !0,
                 https: !0,
                 ftp: !0,
                 gopher: !0,
                 file: !0,
                 "http:": !0,
                 "https:": !0,
                 "ftp:": !0,
                 "gopher:": !0,
                 "file:": !0
             },
             u = a("querystring");
         f.prototype.parse = function(a, b, c) {
             if (!e.isString(a)) throw new TypeError("Parameter 'url' must be a string, not " + typeof a);
             var f = a.indexOf("?"),
                 h = f !== -1 && f < a.indexOf("#") ? "?" : "#",
                 j = a.split(h),
                 k = /\\/g;
             j[0] = j[0].replace(k, "/"), a = j.join(h);
             var v = a;
             if (v = v.trim(), !c && 1 === a.split("#").length) {
                 var w = i.exec(v);
                 if (w) return this.path = v, this.href = v, this.pathname = w[1], w[2] ? (this.search = w[2], b ? this.query = u.parse(this.search.substr(1)) : this.query = this.search.substr(1)) : b && (this.search = "", this.query = {}), this
             }
             var x = g.exec(v);
             if (x) {
                 x = x[0];
                 var y = x.toLowerCase();
                 this.protocol = y, v = v.substr(x.length)
             }
             if (c || x || v.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                 var z = "//" === v.substr(0, 2);
                 !z || x && s[x] || (v = v.substr(2), this.slashes = !0)
             }
             if (!s[x] && (z || x && !t[x])) {
                 for (var A = -1, B = 0; B < n.length; B++) {
                     var C = v.indexOf(n[B]);
                     C !== -1 && (A === -1 || C < A) && (A = C)
                 }
                 var D, E;
                 E = A === -1 ? v.lastIndexOf("@") : v.lastIndexOf("@", A), E !== -1 && (D = v.slice(0, E), v = v.slice(E + 1), this.auth = decodeURIComponent(D)), A = -1;
                 for (var B = 0; B < m.length; B++) {
                     var C = v.indexOf(m[B]);
                     C !== -1 && (A === -1 || C < A) && (A = C)
                 }
                 A === -1 && (A = v.length), this.host = v.slice(0, A), v = v.slice(A), this.parseHost(), this.hostname = this.hostname || "";
                 var F = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
                 if (!F)
                     for (var G = this.hostname.split(/\./), B = 0, H = G.length; B < H; B++) {
                         var I = G[B];
                         if (I && !I.match(p)) {
                             for (var J = "", K = 0, L = I.length; K < L; K++) J += I.charCodeAt(K) > 127 ? "x" : I[K];
                             if (!J.match(p)) {
                                 var M = G.slice(0, B),
                                     N = G.slice(B + 1),
                                     O = I.match(q);
                                 O && (M.push(O[1]), N.unshift(O[2])), N.length && (v = "/" + N.join(".") + v), this.hostname = M.join(".");
                                 break
                             }
                         }
                     }
                 this.hostname.length > o ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), F || (this.hostname = d.toASCII(this.hostname));
                 var P = this.port ? ":" + this.port : "",
                     Q = this.hostname || "";
                 this.host = Q + P, this.href += this.host, F && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== v[0] && (v = "/" + v))
             }
             if (!r[y])
                 for (var B = 0, H = l.length; B < H; B++) {
                     var R = l[B];
                     if (v.indexOf(R) !== -1) {
                         var S = encodeURIComponent(R);
                         S === R && (S = escape(R)), v = v.split(R).join(S)
                     }
                 }
             var T = v.indexOf("#");
             T !== -1 && (this.hash = v.substr(T), v = v.slice(0, T));
             var U = v.indexOf("?");
             if (U !== -1 ? (this.search = v.substr(U), this.query = v.substr(U + 1), b && (this.query = u.parse(this.query)), v = v.slice(0, U)) : b && (this.search = "", this.query = {}), v && (this.pathname = v), t[y] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
                 var P = this.pathname || "",
                     V = this.search || "";
                 this.path = P + V
             }
             return this.href = this.format(), this
         }, f.prototype.format = function() {
             var a = this.auth || "";
             a && (a = encodeURIComponent(a), a = a.replace(/%3A/i, ":"), a += "@");
             var b = this.protocol || "",
                 c = this.pathname || "",
                 d = this.hash || "",
                 f = !1,
                 g = "";
             this.host ? f = a + this.host : this.hostname && (f = a + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]"), this.port && (f += ":" + this.port)), this.query && e.isObject(this.query) && Object.keys(this.query).length && (g = u.stringify(this.query));
             var h = this.search || g && "?" + g || "";
             return b && ":" !== b.substr(-1) && (b += ":"), this.slashes || (!b || t[b]) && f !== !1 ? (f = "//" + (f || ""), c && "/" !== c.charAt(0) && (c = "/" + c)) : f || (f = ""), d && "#" !== d.charAt(0) && (d = "#" + d), h && "?" !== h.charAt(0) && (h = "?" + h), c = c.replace(/[?#]/g, function(a) {
                 return encodeURIComponent(a)
             }), h = h.replace("#", "%23"), b + f + c + h + d
         }, f.prototype.resolve = function(a) {
             return this.resolveObject(v(a, !1, !0)).format()
         }, f.prototype.resolveObject = function(a) {
             if (e.isString(a)) {
                 var b = new f;
                 b.parse(a, !1, !0), a = b
             }
             for (var c = new f, d = Object.keys(this), g = 0; g < d.length; g++) {
                 var h = d[g];
                 c[h] = this[h]
             }
             if (c.hash = a.hash, "" === a.href) return c.href = c.format(), c;
             if (a.slashes && !a.protocol) {
                 for (var i = Object.keys(a), j = 0; j < i.length; j++) {
                     var k = i[j];
                     "protocol" !== k && (c[k] = a[k])
                 }
                 return t[c.protocol] && c.hostname && !c.pathname && (c.path = c.pathname = "/"), c.href = c.format(), c
             }
             if (a.protocol && a.protocol !== c.protocol) {
                 if (!t[a.protocol]) {
                     for (var l = Object.keys(a), m = 0; m < l.length; m++) {
                         var n = l[m];
                         c[n] = a[n]
                     }
                     return c.href = c.format(), c
                 }
                 if (c.protocol = a.protocol, a.host || s[a.protocol]) c.pathname = a.pathname;
                 else {
                     for (var o = (a.pathname || "").split("/"); o.length && !(a.host = o.shift()););
                     a.host || (a.host = ""), a.hostname || (a.hostname = ""), "" !== o[0] && o.unshift(""), o.length < 2 && o.unshift(""), c.pathname = o.join("/")
                 }
                 if (c.search = a.search, c.query = a.query, c.host = a.host || "", c.auth = a.auth, c.hostname = a.hostname || a.host, c.port = a.port, c.pathname || c.search) {
                     var p = c.pathname || "",
                         q = c.search || "";
                     c.path = p + q
                 }
                 return c.slashes = c.slashes || a.slashes, c.href = c.format(), c
             }
             var r = c.pathname && "/" === c.pathname.charAt(0),
                 u = a.host || a.pathname && "/" === a.pathname.charAt(0),
                 v = u || r || c.host && a.pathname,
                 w = v,
                 x = c.pathname && c.pathname.split("/") || [],
                 o = a.pathname && a.pathname.split("/") || [],
                 y = c.protocol && !t[c.protocol];
             if (y && (c.hostname = "", c.port = null, c.host && ("" === x[0] ? x[0] = c.host : x.unshift(c.host)), c.host = "", a.protocol && (a.hostname = null, a.port = null, a.host && ("" === o[0] ? o[0] = a.host : o.unshift(a.host)), a.host = null), v = v && ("" === o[0] || "" === x[0])), u) c.host = a.host || "" === a.host ? a.host : c.host, c.hostname = a.hostname || "" === a.hostname ? a.hostname : c.hostname, c.search = a.search, c.query = a.query, x = o;
             else if (o.length) x || (x = []), x.pop(), x = x.concat(o), c.search = a.search, c.query = a.query;
             else if (!e.isNullOrUndefined(a.search)) {
                 if (y) {
                     c.hostname = c.host = x.shift();
                     var z = !!(c.host && c.host.indexOf("@") > 0) && c.host.split("@");
                     z && (c.auth = z.shift(), c.host = c.hostname = z.shift())
                 }
                 return c.search = a.search, c.query = a.query, e.isNull(c.pathname) && e.isNull(c.search) || (c.path = (c.pathname ? c.pathname : "") + (c.search ? c.search : "")), c.href = c.format(), c
             }
             if (!x.length) return c.pathname = null, c.search ? c.path = "/" + c.search : c.path = null, c.href = c.format(), c;
             for (var A = x.slice(-1)[0], B = (c.host || a.host || x.length > 1) && ("." === A || ".." === A) || "" === A, C = 0, D = x.length; D >= 0; D--) A = x[D], "." === A ? x.splice(D, 1) : ".." === A ? (x.splice(D, 1), C++) : C && (x.splice(D, 1), C--);
             if (!v && !w)
                 for (; C--; C) x.unshift("..");
             !v || "" === x[0] || x[0] && "/" === x[0].charAt(0) || x.unshift(""), B && "/" !== x.join("/").substr(-1) && x.push("");
             var E = "" === x[0] || x[0] && "/" === x[0].charAt(0);
             if (y) {
                 c.hostname = c.host = E ? "" : x.length ? x.shift() : "";
                 var z = !!(c.host && c.host.indexOf("@") > 0) && c.host.split("@");
                 z && (c.auth = z.shift(), c.host = c.hostname = z.shift())
             }
             return v = v || c.host && x.length, v && !E && x.unshift(""), x.length ? c.pathname = x.join("/") : (c.pathname = null, c.path = null), e.isNull(c.pathname) && e.isNull(c.search) || (c.path = (c.pathname ? c.pathname : "") + (c.search ? c.search : "")), c.auth = a.auth || c.auth, c.slashes = c.slashes || a.slashes, c.href = c.format(), c
         }, f.prototype.parseHost = function() {
             var a = this.host,
                 b = h.exec(a);
             b && (b = b[0], ":" !== b && (this.port = b.substr(1)), a = a.substr(0, a.length - b.length)), a && (this.hostname = a)
         }
     }, {
         "./util": 51,
         punycode: 33,
         querystring: 36
     }],
     51: [function(a, b, c) {
         "use strict";
         b.exports = {
             isString: function(a) {
                 return "string" == typeof a
             },
             isObject: function(a) {
                 return "object" == typeof a && null !== a
             },
             isNull: function(a) {
                 return null === a
             },
             isNullOrUndefined: function(a) {
                 return null == a
             }
         }
     }, {}],
     52: [function(a, b, c) {
         (function(a) {
             function c(a, b) {
                 function e() {
                     if (!c) {
                         if (d("throwDeprecation")) throw new Error(b);
                         d("traceDeprecation") ? console.trace(b) : console.warn(b), c = !0
                     }
                     return a.apply(this, arguments)
                 }
                 if (d("noDeprecation")) return a;
                 var c = !1;
                 return e
             }

             function d(b) {
                 try {
                     if (!a.localStorage) return !1
                 } catch (a) {
                     return !1
                 }
                 var c = a.localStorage[b];
                 return null != c && "true" === String(c).toLowerCase()
             }
             b.exports = c
         }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
     }, {}],
     53: [function(a, b, c) {
         (function(b, d) {
             var e = a("url"),
                 f = a("child_process").spawn,
                 g = a("fs");
             c.XMLHttpRequest = function() {
                 "use strict";
                 var j, k, c = this,
                     h = a("http"),
                     i = a("https"),
                     l = {},
                     m = !1,
                     n = {
                         "User-Agent": "node-XMLHttpRequest",
                         Accept: "*/*"
                     },
                     o = {},
                     p = {},
                     q = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "content-transfer-encoding", "cookie", "cookie2", "date", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "via"],
                     r = ["TRACE", "TRACK", "CONNECT"],
                     s = !1,
                     t = !1,
                     u = {};
                 this.UNSENT = 0, this.OPENED = 1, this.HEADERS_RECEIVED = 2, this.LOADING = 3, this.DONE = 4, this.readyState = this.UNSENT, this.onreadystatechange = null, this.responseText = "", this.responseXML = "", this.status = null, this.statusText = null, this.withCredentials = !1;
                 var v = function(a) {
                         return m || a && q.indexOf(a.toLowerCase()) === -1
                     },
                     w = function(a) {
                         return a && r.indexOf(a) === -1
                     };
                 this.open = function(a, b, c, d, e) {
                     if (this.abort(), t = !1, !w(a)) throw new Error("SecurityError: Request method not allowed");
                     l = {
                         method: a,
                         url: b.toString(),
                         async: "boolean" != typeof c || c,
                         user: d || null,
                         password: e || null
                     }, x(this.OPENED)
                 }, this.setDisableHeaderCheck = function(a) {
                     m = a
                 }, this.setRequestHeader = function(a, b) {
                     if (this.readyState !== this.OPENED) throw new Error("INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN");
                     if (!v(a)) return void console.warn('Refused to set unsafe header "' + a + '"');
                     if (s) throw new Error("INVALID_STATE_ERR: send flag is true");
                     a = p[a.toLowerCase()] || a, p[a.toLowerCase()] = a, o[a] = o[a] ? o[a] + ", " + b : b
                 }, this.getResponseHeader = function(a) {
                     return "string" == typeof a && this.readyState > this.OPENED && k && k.headers && k.headers[a.toLowerCase()] && !t ? k.headers[a.toLowerCase()] : null
                 }, this.getAllResponseHeaders = function() {
                     if (this.readyState < this.HEADERS_RECEIVED || t) return "";
                     var a = "";
                     for (var b in k.headers) "set-cookie" !== b && "set-cookie2" !== b && (a += b + ": " + k.headers[b] + "\r\n");
                     return a.substr(0, a.length - 2)
                 }, this.getRequestHeader = function(a) {
                     return "string" == typeof a && p[a.toLowerCase()] ? o[p[a.toLowerCase()]] : ""
                 }, this.send = function(a) {
                     if (this.readyState !== this.OPENED) throw new Error("INVALID_STATE_ERR: connection must be opened before send() is called");
                     if (s) throw new Error("INVALID_STATE_ERR: send has already been called");
                     var u, m = !1,
                         q = !1,
                         r = e.parse(l.url);
                     switch (r.protocol) {
                         case "https:":
                             m = !0;
                         case "http:":
                             u = r.hostname;
                             break;
                         case "file:":
                             q = !0;
                             break;
                         case void 0:
                         case null:
                         case "":
                             u = "localhost";
                             break;
                         default:
                             throw new Error("Protocol not supported.")
                     }
                     if (q) {
                         if ("GET" !== l.method) throw new Error("XMLHttpRequest: Only GET method is supported");
                         if (l.async) g.readFile(r.pathname, "utf8", function(a, b) {
                             a ? c.handleError(a) : (c.status = 200, c.responseText = b, x(c.DONE))
                         });
                         else try {
                             this.responseText = g.readFileSync(r.pathname, "utf8"), this.status = 200, x(c.DONE)
                         } catch (a) {
                             this.handleError(a)
                         }
                     } else {
                         var v = r.port || (m ? 443 : 80),
                             w = r.pathname + (r.search ? r.search : "");
                         for (var y in n) p[y.toLowerCase()] || (o[y] = n[y]);
                         if (o.Host = u, m && 443 === v || 80 === v || (o.Host += ":" + r.port), l.user) {
                             "undefined" == typeof l.password && (l.password = "");
                             var z = new d(l.user + ":" + l.password);
                             o.Authorization = "Basic " + z.toString("base64")
                         }
                         "GET" === l.method || "HEAD" === l.method ? a = null : a ? (o["Content-Length"] = d.isBuffer(a) ? a.length : d.byteLength(a), o["Content-Type"] || (o["Content-Type"] = "text/plain;charset=UTF-8")) : "POST" === l.method && (o["Content-Length"] = 0);
                         var A = {
                             host: u,
                             port: v,
                             path: w,
                             method: l.method,
                             headers: o,
                             agent: !1,
                             withCredentials: c.withCredentials
                         };
                         if (t = !1, l.async) {
                             var B = m ? i.request : h.request;
                             s = !0, c.dispatchEvent("readystatechange");
                             var C = function a(b) {
                                     if (k = b, 301 === k.statusCode || 302 === k.statusCode || 303 === k.statusCode || 307 === k.statusCode) {
                                         l.url = k.headers.location;
                                         var d = e.parse(l.url);
                                         u = d.hostname;
                                         var f = {
                                             hostname: d.hostname,
                                             port: d.port,
                                             path: d.path,
                                             method: 303 === k.statusCode ? "GET" : l.method,
                                             headers: o,
                                             withCredentials: c.withCredentials
                                         };
                                         return j = B(f, a).on("error", D), void j.end()
                                     }
                                     k.setEncoding("utf8"), x(c.HEADERS_RECEIVED), c.status = k.statusCode, k.on("data", function(a) {
                                         a && (c.responseText += a), s && x(c.LOADING)
                                     }), k.on("end", function() {
                                         s && (x(c.DONE), s = !1)
                                     }), k.on("error", function(a) {
                                         c.handleError(a)
                                     })
                                 },
                                 D = function(b) {
                                     c.handleError(b)
                                 };
                             j = B(A, C).on("error", D), a && j.write(a), j.end(), c.dispatchEvent("loadstart")
                         } else {
                             var E = ".node-xmlhttprequest-content-" + b.pid,
                                 F = ".node-xmlhttprequest-sync-" + b.pid;
                             g.writeFileSync(F, "", "utf8");
                             for (var G = "var http = require('http'), https = require('https'), fs = require('fs');var doRequest = http" + (m ? "s" : "") + ".request;var options = " + JSON.stringify(A) + ";var responseText = '';var req = doRequest(options, function(response) {response.setEncoding('utf8');response.on('data', function(chunk) {  responseText += chunk;});response.on('end', function() {fs.writeFileSync('" + E + "', JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText}}), 'utf8');fs.unlinkSync('" + F + "');});response.on('error', function(error) {fs.writeFileSync('" + E + "', JSON.stringify({err: error}), 'utf8');fs.unlinkSync('" + F + "');});}).on('error', function(error) {fs.writeFileSync('" + E + "', JSON.stringify({err: error}), 'utf8');fs.unlinkSync('" + F + "');});" + (a ? "req.write('" + JSON.stringify(a).slice(1, -1).replace(/'/g, "\\'") + "');" : "") + "req.end();", H = f(b.argv[0], ["-e", G]); g.existsSync(F););
                             var I = JSON.parse(g.readFileSync(E, "utf8"));
                             H.stdin.end(), g.unlinkSync(E), I.err ? c.handleError(I.err) : (k = I.data, c.status = I.data.statusCode, c.responseText = I.data.text, x(c.DONE))
                         }
                     }
                 }, this.handleError = function(a) {
                     this.status = 0, this.statusText = a, this.responseText = a.stack, t = !0, x(this.DONE), this.dispatchEvent("error")
                 }, this.abort = function() {
                     j && (j.abort(), j = null), o = n, this.status = 0, this.responseText = "", this.responseXML = "", t = !0, this.readyState === this.UNSENT || this.readyState === this.OPENED && !s || this.readyState === this.DONE || (s = !1, x(this.DONE)), this.readyState = this.UNSENT, this.dispatchEvent("abort")
                 }, this.addEventListener = function(a, b) {
                     a in u || (u[a] = []), u[a].push(b)
                 }, this.removeEventListener = function(a, b) {
                     a in u && (u[a] = u[a].filter(function(a) {
                         return a !== b
                     }))
                 }, this.dispatchEvent = function(a) {
                     if ("function" == typeof c["on" + a] && c["on" + a](), a in u)
                         for (var b = 0, d = u[a].length; b < d; b++) u[a][b].call(c)
                 };
                 var x = function(a) {
                     a != c.LOADING && c.readyState === a || (c.readyState = a, (l.async || c.readyState < c.OPENED || c.readyState === c.DONE) && c.dispatchEvent("readystatechange"), c.readyState !== c.DONE || t || (c.dispatchEvent("load"), c.dispatchEvent("loadend")))
                 }
             }
         }).call(this, a("_process"), a("buffer").Buffer)
     }, {
         _process: 32,
         buffer: 22,
         child_process: 20,
         fs: 20,
         http: 44,
         https: 26,
         url: 50
     }],
     54: [function(a, b, c) {
         function e() {
             for (var a = {}, b = 0; b < arguments.length; b++) {
                 var c = arguments[b];
                 for (var e in c) d.call(c, e) && (a[e] = c[e])
             }
             return a
         }
         b.exports = e;
         var d = Object.prototype.hasOwnProperty
     }, {}]
 }, {}, [1]);