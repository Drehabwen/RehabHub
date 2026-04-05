import { S as Qt, s as ea, g as ta, n as Dt, r as Mt, p as aa, u as ia, a as c, b as Pt, R as na, j as i, c as Nt, d as oa, e as ra, f as sa, h as we, i as ue, k as rt, l as He, t as $e, H as la } from "./plugin-entry-C72LvDc1.mjs";
class ca extends Qt {
  constructor(t, a) {
    super(), this.client = t, this.setOptions(a), this.bindMethods(), this.updateResult();
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this), this.reset = this.reset.bind(this);
  }
  setOptions(t) {
    var a;
    const n = this.options;
    this.options = this.client.defaultMutationOptions(t), ea(n, this.options) || this.client.getMutationCache().notify({
      type: "observerOptionsUpdated",
      mutation: this.currentMutation,
      observer: this
    }), (a = this.currentMutation) == null || a.setOptions(this.options);
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      var t;
      (t = this.currentMutation) == null || t.removeObserver(this);
    }
  }
  onMutationUpdate(t) {
    this.updateResult();
    const a = {
      listeners: !0
    };
    t.type === "success" ? a.onSuccess = !0 : t.type === "error" && (a.onError = !0), this.notify(a);
  }
  getCurrentResult() {
    return this.currentResult;
  }
  reset() {
    this.currentMutation = void 0, this.updateResult(), this.notify({
      listeners: !0
    });
  }
  mutate(t, a) {
    return this.mutateOptions = a, this.currentMutation && this.currentMutation.removeObserver(this), this.currentMutation = this.client.getMutationCache().build(this.client, {
      ...this.options,
      variables: typeof t < "u" ? t : this.options.variables
    }), this.currentMutation.addObserver(this), this.currentMutation.execute();
  }
  updateResult() {
    const t = this.currentMutation ? this.currentMutation.state : ta(), a = t.status === "loading", n = {
      ...t,
      isLoading: a,
      isPending: a,
      isSuccess: t.status === "success",
      isError: t.status === "error",
      isIdle: t.status === "idle",
      mutate: this.mutate,
      reset: this.reset
    };
    this.currentResult = n;
  }
  notify(t) {
    Dt.batch(() => {
      if (this.mutateOptions && this.hasListeners()) {
        if (t.onSuccess) {
          var a, n, o, r;
          (a = (n = this.mutateOptions).onSuccess) == null || a.call(n, this.currentResult.data, this.currentResult.variables, this.currentResult.context), (o = (r = this.mutateOptions).onSettled) == null || o.call(r, this.currentResult.data, null, this.currentResult.variables, this.currentResult.context);
        } else if (t.onError) {
          var p, m, C, O;
          (p = (m = this.mutateOptions).onError) == null || p.call(m, this.currentResult.error, this.currentResult.variables, this.currentResult.context), (C = (O = this.mutateOptions).onSettled) == null || C.call(O, void 0, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
        }
      }
      t.listeners && this.listeners.forEach(({
        listener: E
      }) => {
        E(this.currentResult);
      });
    });
  }
}
var Ee = { exports: {} }, We = {};
var st;
function pa() {
  if (st) return We;
  st = 1;
  var e = Mt();
  function t(g, j) {
    return g === j && (g !== 0 || 1 / g === 1 / j) || g !== g && j !== j;
  }
  var a = typeof Object.is == "function" ? Object.is : t, n = e.useState, o = e.useEffect, r = e.useLayoutEffect, p = e.useDebugValue;
  function m(g, j) {
    var k = j(), D = n({ inst: { value: k, getSnapshot: j } }), _ = D[0].inst, P = D[1];
    return r(
      function() {
        _.value = k, _.getSnapshot = j, C(_) && P({ inst: _ });
      },
      [g, k, j]
    ), o(
      function() {
        return C(_) && P({ inst: _ }), g(function() {
          C(_) && P({ inst: _ });
        });
      },
      [g]
    ), p(k), k;
  }
  function C(g) {
    var j = g.getSnapshot;
    g = g.value;
    try {
      var k = j();
      return !a(g, k);
    } catch {
      return !0;
    }
  }
  function O(g, j) {
    return j();
  }
  var E = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? O : m;
  return We.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : E, We;
}
var Ve = {};
var lt;
function da() {
  return lt || (lt = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(k, D) {
      return k === D && (k !== 0 || 1 / k === 1 / D) || k !== k && D !== D;
    }
    function t(k, D) {
      E || o.startTransition === void 0 || (E = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var _ = D();
      if (!g) {
        var P = D();
        r(_, P) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), g = !0);
      }
      P = p({
        inst: { value: _, getSnapshot: D }
      });
      var z = P[0].inst, te = P[1];
      return C(
        function() {
          z.value = _, z.getSnapshot = D, a(z) && te({ inst: z });
        },
        [k, _, D]
      ), m(
        function() {
          return a(z) && te({ inst: z }), k(function() {
            a(z) && te({ inst: z });
          });
        },
        [k]
      ), O(_), _;
    }
    function a(k) {
      var D = k.getSnapshot;
      k = k.value;
      try {
        var _ = D();
        return !r(k, _);
      } catch {
        return !0;
      }
    }
    function n(k, D) {
      return D();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var o = Mt(), r = typeof Object.is == "function" ? Object.is : e, p = o.useState, m = o.useEffect, C = o.useLayoutEffect, O = o.useDebugValue, E = !1, g = !1, j = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? n : t;
    Ve.useSyncExternalStore = o.useSyncExternalStore !== void 0 ? o.useSyncExternalStore : j, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), Ve;
}
var ct;
function ua() {
  return ct || (ct = 1, process.env.NODE_ENV === "production" ? Ee.exports = pa() : Ee.exports = da()), Ee.exports;
}
var ma = ua();
const fa = ma.useSyncExternalStore;
function va(e, t) {
  return typeof e == "function" ? e(...t) : !!e;
}
function xa(e, t, a) {
  const n = aa(e, t), o = ia({
    context: n.context
  }), [r] = c.useState(() => new ca(o, n));
  c.useEffect(() => {
    r.setOptions(n);
  }, [r, n]);
  const p = fa(c.useCallback((C) => r.subscribe(Dt.batchCalls(C)), [r]), () => r.getCurrentResult(), () => r.getCurrentResult()), m = c.useCallback((C, O) => {
    r.mutate(C, O).catch(ha);
  }, [r]);
  if (p.error && va(r.options.useErrorBoundary, [p.error]))
    throw p.error;
  return {
    ...p,
    mutate: m,
    mutateAsync: p.mutate
  };
}
function ha() {
}
var Se = { exports: {} }, _e = { exports: {} }, L = {};
var pt;
function ga() {
  if (pt) return L;
  pt = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, a = e ? Symbol.for("react.portal") : 60106, n = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, r = e ? Symbol.for("react.profiler") : 60114, p = e ? Symbol.for("react.provider") : 60109, m = e ? Symbol.for("react.context") : 60110, C = e ? Symbol.for("react.async_mode") : 60111, O = e ? Symbol.for("react.concurrent_mode") : 60111, E = e ? Symbol.for("react.forward_ref") : 60112, g = e ? Symbol.for("react.suspense") : 60113, j = e ? Symbol.for("react.suspense_list") : 60120, k = e ? Symbol.for("react.memo") : 60115, D = e ? Symbol.for("react.lazy") : 60116, _ = e ? Symbol.for("react.block") : 60121, P = e ? Symbol.for("react.fundamental") : 60117, z = e ? Symbol.for("react.responder") : 60118, te = e ? Symbol.for("react.scope") : 60119;
  function H(f) {
    if (typeof f == "object" && f !== null) {
      var X = f.$$typeof;
      switch (X) {
        case t:
          switch (f = f.type, f) {
            case C:
            case O:
            case n:
            case r:
            case o:
            case g:
              return f;
            default:
              switch (f = f && f.$$typeof, f) {
                case m:
                case E:
                case D:
                case k:
                case p:
                  return f;
                default:
                  return X;
              }
          }
        case a:
          return X;
      }
    }
  }
  function W(f) {
    return H(f) === O;
  }
  return L.AsyncMode = C, L.ConcurrentMode = O, L.ContextConsumer = m, L.ContextProvider = p, L.Element = t, L.ForwardRef = E, L.Fragment = n, L.Lazy = D, L.Memo = k, L.Portal = a, L.Profiler = r, L.StrictMode = o, L.Suspense = g, L.isAsyncMode = function(f) {
    return W(f) || H(f) === C;
  }, L.isConcurrentMode = W, L.isContextConsumer = function(f) {
    return H(f) === m;
  }, L.isContextProvider = function(f) {
    return H(f) === p;
  }, L.isElement = function(f) {
    return typeof f == "object" && f !== null && f.$$typeof === t;
  }, L.isForwardRef = function(f) {
    return H(f) === E;
  }, L.isFragment = function(f) {
    return H(f) === n;
  }, L.isLazy = function(f) {
    return H(f) === D;
  }, L.isMemo = function(f) {
    return H(f) === k;
  }, L.isPortal = function(f) {
    return H(f) === a;
  }, L.isProfiler = function(f) {
    return H(f) === r;
  }, L.isStrictMode = function(f) {
    return H(f) === o;
  }, L.isSuspense = function(f) {
    return H(f) === g;
  }, L.isValidElementType = function(f) {
    return typeof f == "string" || typeof f == "function" || f === n || f === O || f === r || f === o || f === g || f === j || typeof f == "object" && f !== null && (f.$$typeof === D || f.$$typeof === k || f.$$typeof === p || f.$$typeof === m || f.$$typeof === E || f.$$typeof === P || f.$$typeof === z || f.$$typeof === te || f.$$typeof === _);
  }, L.typeOf = H, L;
}
var q = {};
var dt;
function ba() {
  return dt || (dt = 1, process.env.NODE_ENV !== "production" && (function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, a = e ? Symbol.for("react.portal") : 60106, n = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, r = e ? Symbol.for("react.profiler") : 60114, p = e ? Symbol.for("react.provider") : 60109, m = e ? Symbol.for("react.context") : 60110, C = e ? Symbol.for("react.async_mode") : 60111, O = e ? Symbol.for("react.concurrent_mode") : 60111, E = e ? Symbol.for("react.forward_ref") : 60112, g = e ? Symbol.for("react.suspense") : 60113, j = e ? Symbol.for("react.suspense_list") : 60120, k = e ? Symbol.for("react.memo") : 60115, D = e ? Symbol.for("react.lazy") : 60116, _ = e ? Symbol.for("react.block") : 60121, P = e ? Symbol.for("react.fundamental") : 60117, z = e ? Symbol.for("react.responder") : 60118, te = e ? Symbol.for("react.scope") : 60119;
    function H(u) {
      return typeof u == "string" || typeof u == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      u === n || u === O || u === r || u === o || u === g || u === j || typeof u == "object" && u !== null && (u.$$typeof === D || u.$$typeof === k || u.$$typeof === p || u.$$typeof === m || u.$$typeof === E || u.$$typeof === P || u.$$typeof === z || u.$$typeof === te || u.$$typeof === _);
    }
    function W(u) {
      if (typeof u == "object" && u !== null) {
        var K = u.$$typeof;
        switch (K) {
          case t:
            var G = u.type;
            switch (G) {
              case C:
              case O:
              case n:
              case r:
              case o:
              case g:
                return G;
              default:
                var le = G && G.$$typeof;
                switch (le) {
                  case m:
                  case E:
                  case D:
                  case k:
                  case p:
                    return le;
                  default:
                    return K;
                }
            }
          case a:
            return K;
        }
      }
    }
    var f = C, X = O, F = m, ne = p, V = t, M = E, oe = n, pe = D, ae = k, N = a, Y = r, Z = o, ie = g, re = !1;
    function U(u) {
      return re || (re = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), s(u) || W(u) === C;
    }
    function s(u) {
      return W(u) === O;
    }
    function d(u) {
      return W(u) === m;
    }
    function w(u) {
      return W(u) === p;
    }
    function v(u) {
      return typeof u == "object" && u !== null && u.$$typeof === t;
    }
    function R(u) {
      return W(u) === E;
    }
    function A(u) {
      return W(u) === n;
    }
    function y(u) {
      return W(u) === D;
    }
    function l(u) {
      return W(u) === k;
    }
    function b(u) {
      return W(u) === a;
    }
    function h(u) {
      return W(u) === r;
    }
    function S(u) {
      return W(u) === o;
    }
    function I(u) {
      return W(u) === g;
    }
    q.AsyncMode = f, q.ConcurrentMode = X, q.ContextConsumer = F, q.ContextProvider = ne, q.Element = V, q.ForwardRef = M, q.Fragment = oe, q.Lazy = pe, q.Memo = ae, q.Portal = N, q.Profiler = Y, q.StrictMode = Z, q.Suspense = ie, q.isAsyncMode = U, q.isConcurrentMode = s, q.isContextConsumer = d, q.isContextProvider = w, q.isElement = v, q.isForwardRef = R, q.isFragment = A, q.isLazy = y, q.isMemo = l, q.isPortal = b, q.isProfiler = h, q.isStrictMode = S, q.isSuspense = I, q.isValidElementType = H, q.typeOf = W;
  })()), q;
}
var ut;
function zt() {
  return ut || (ut = 1, process.env.NODE_ENV === "production" ? _e.exports = ga() : _e.exports = ba()), _e.exports;
}
var Be, mt;
function ya() {
  if (mt) return Be;
  mt = 1;
  var e = Object.getOwnPropertySymbols, t = Object.prototype.hasOwnProperty, a = Object.prototype.propertyIsEnumerable;
  function n(r) {
    if (r == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(r);
  }
  function o() {
    try {
      if (!Object.assign)
        return !1;
      var r = new String("abc");
      if (r[5] = "de", Object.getOwnPropertyNames(r)[0] === "5")
        return !1;
      for (var p = {}, m = 0; m < 10; m++)
        p["_" + String.fromCharCode(m)] = m;
      var C = Object.getOwnPropertyNames(p).map(function(E) {
        return p[E];
      });
      if (C.join("") !== "0123456789")
        return !1;
      var O = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(E) {
        O[E] = E;
      }), Object.keys(Object.assign({}, O)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return Be = o() ? Object.assign : function(r, p) {
    for (var m, C = n(r), O, E = 1; E < arguments.length; E++) {
      m = Object(arguments[E]);
      for (var g in m)
        t.call(m, g) && (C[g] = m[g]);
      if (e) {
        O = e(m);
        for (var j = 0; j < O.length; j++)
          a.call(m, O[j]) && (C[O[j]] = m[O[j]]);
      }
    }
    return C;
  }, Be;
}
var Ue, ft;
function nt() {
  if (ft) return Ue;
  ft = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return Ue = e, Ue;
}
var Ke, vt;
function Ft() {
  return vt || (vt = 1, Ke = Function.call.bind(Object.prototype.hasOwnProperty)), Ke;
}
var Ye, xt;
function wa() {
  if (xt) return Ye;
  xt = 1;
  var e = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var t = /* @__PURE__ */ nt(), a = {}, n = /* @__PURE__ */ Ft();
    e = function(r) {
      var p = "Warning: " + r;
      typeof console < "u" && console.error(p);
      try {
        throw new Error(p);
      } catch {
      }
    };
  }
  function o(r, p, m, C, O) {
    if (process.env.NODE_ENV !== "production") {
      for (var E in r)
        if (n(r, E)) {
          var g;
          try {
            if (typeof r[E] != "function") {
              var j = Error(
                (C || "React class") + ": " + m + " type `" + E + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof r[E] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw j.name = "Invariant Violation", j;
            }
            g = r[E](p, E, C, m, null, t);
          } catch (D) {
            g = D;
          }
          if (g && !(g instanceof Error) && e(
            (C || "React class") + ": type specification of " + m + " `" + E + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof g + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), g instanceof Error && !(g.message in a)) {
            a[g.message] = !0;
            var k = O ? O() : "";
            e(
              "Failed " + m + " type: " + g.message + (k ?? "")
            );
          }
        }
    }
  }
  return o.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (a = {});
  }, Ye = o, Ye;
}
var Ze, ht;
function ja() {
  if (ht) return Ze;
  ht = 1;
  var e = zt(), t = ya(), a = /* @__PURE__ */ nt(), n = /* @__PURE__ */ Ft(), o = /* @__PURE__ */ wa(), r = function() {
  };
  process.env.NODE_ENV !== "production" && (r = function(m) {
    var C = "Warning: " + m;
    typeof console < "u" && console.error(C);
    try {
      throw new Error(C);
    } catch {
    }
  });
  function p() {
    return null;
  }
  return Ze = function(m, C) {
    var O = typeof Symbol == "function" && Symbol.iterator, E = "@@iterator";
    function g(s) {
      var d = s && (O && s[O] || s[E]);
      if (typeof d == "function")
        return d;
    }
    var j = "<<anonymous>>", k = {
      array: z("array"),
      bigint: z("bigint"),
      bool: z("boolean"),
      func: z("function"),
      number: z("number"),
      object: z("object"),
      string: z("string"),
      symbol: z("symbol"),
      any: te(),
      arrayOf: H,
      element: W(),
      elementType: f(),
      instanceOf: X,
      node: M(),
      objectOf: ne,
      oneOf: F,
      oneOfType: V,
      shape: pe,
      exact: ae
    };
    function D(s, d) {
      return s === d ? s !== 0 || 1 / s === 1 / d : s !== s && d !== d;
    }
    function _(s, d) {
      this.message = s, this.data = d && typeof d == "object" ? d : {}, this.stack = "";
    }
    _.prototype = Error.prototype;
    function P(s) {
      if (process.env.NODE_ENV !== "production")
        var d = {}, w = 0;
      function v(A, y, l, b, h, S, I) {
        if (b = b || j, S = S || l, I !== a) {
          if (C) {
            var u = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw u.name = "Invariant Violation", u;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var K = b + ":" + l;
            !d[K] && // Avoid spamming the console because they are often not actionable except for lib authors
            w < 3 && (r(
              "You are manually calling a React.PropTypes validation function for the `" + S + "` prop on `" + b + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), d[K] = !0, w++);
          }
        }
        return y[l] == null ? A ? y[l] === null ? new _("The " + h + " `" + S + "` is marked as required " + ("in `" + b + "`, but its value is `null`.")) : new _("The " + h + " `" + S + "` is marked as required in " + ("`" + b + "`, but its value is `undefined`.")) : null : s(y, l, b, h, S);
      }
      var R = v.bind(null, !1);
      return R.isRequired = v.bind(null, !0), R;
    }
    function z(s) {
      function d(w, v, R, A, y, l) {
        var b = w[v], h = Z(b);
        if (h !== s) {
          var S = ie(b);
          return new _(
            "Invalid " + A + " `" + y + "` of type " + ("`" + S + "` supplied to `" + R + "`, expected ") + ("`" + s + "`."),
            { expectedType: s }
          );
        }
        return null;
      }
      return P(d);
    }
    function te() {
      return P(p);
    }
    function H(s) {
      function d(w, v, R, A, y) {
        if (typeof s != "function")
          return new _("Property `" + y + "` of component `" + R + "` has invalid PropType notation inside arrayOf.");
        var l = w[v];
        if (!Array.isArray(l)) {
          var b = Z(l);
          return new _("Invalid " + A + " `" + y + "` of type " + ("`" + b + "` supplied to `" + R + "`, expected an array."));
        }
        for (var h = 0; h < l.length; h++) {
          var S = s(l, h, R, A, y + "[" + h + "]", a);
          if (S instanceof Error)
            return S;
        }
        return null;
      }
      return P(d);
    }
    function W() {
      function s(d, w, v, R, A) {
        var y = d[w];
        if (!m(y)) {
          var l = Z(y);
          return new _("Invalid " + R + " `" + A + "` of type " + ("`" + l + "` supplied to `" + v + "`, expected a single ReactElement."));
        }
        return null;
      }
      return P(s);
    }
    function f() {
      function s(d, w, v, R, A) {
        var y = d[w];
        if (!e.isValidElementType(y)) {
          var l = Z(y);
          return new _("Invalid " + R + " `" + A + "` of type " + ("`" + l + "` supplied to `" + v + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return P(s);
    }
    function X(s) {
      function d(w, v, R, A, y) {
        if (!(w[v] instanceof s)) {
          var l = s.name || j, b = U(w[v]);
          return new _("Invalid " + A + " `" + y + "` of type " + ("`" + b + "` supplied to `" + R + "`, expected ") + ("instance of `" + l + "`."));
        }
        return null;
      }
      return P(d);
    }
    function F(s) {
      if (!Array.isArray(s))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? r(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : r("Invalid argument supplied to oneOf, expected an array.")), p;
      function d(w, v, R, A, y) {
        for (var l = w[v], b = 0; b < s.length; b++)
          if (D(l, s[b]))
            return null;
        var h = JSON.stringify(s, function(I, u) {
          var K = ie(u);
          return K === "symbol" ? String(u) : u;
        });
        return new _("Invalid " + A + " `" + y + "` of value `" + String(l) + "` " + ("supplied to `" + R + "`, expected one of " + h + "."));
      }
      return P(d);
    }
    function ne(s) {
      function d(w, v, R, A, y) {
        if (typeof s != "function")
          return new _("Property `" + y + "` of component `" + R + "` has invalid PropType notation inside objectOf.");
        var l = w[v], b = Z(l);
        if (b !== "object")
          return new _("Invalid " + A + " `" + y + "` of type " + ("`" + b + "` supplied to `" + R + "`, expected an object."));
        for (var h in l)
          if (n(l, h)) {
            var S = s(l, h, R, A, y + "." + h, a);
            if (S instanceof Error)
              return S;
          }
        return null;
      }
      return P(d);
    }
    function V(s) {
      if (!Array.isArray(s))
        return process.env.NODE_ENV !== "production" && r("Invalid argument supplied to oneOfType, expected an instance of array."), p;
      for (var d = 0; d < s.length; d++) {
        var w = s[d];
        if (typeof w != "function")
          return r(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + re(w) + " at index " + d + "."
          ), p;
      }
      function v(R, A, y, l, b) {
        for (var h = [], S = 0; S < s.length; S++) {
          var I = s[S], u = I(R, A, y, l, b, a);
          if (u == null)
            return null;
          u.data && n(u.data, "expectedType") && h.push(u.data.expectedType);
        }
        var K = h.length > 0 ? ", expected one of type [" + h.join(", ") + "]" : "";
        return new _("Invalid " + l + " `" + b + "` supplied to " + ("`" + y + "`" + K + "."));
      }
      return P(v);
    }
    function M() {
      function s(d, w, v, R, A) {
        return N(d[w]) ? null : new _("Invalid " + R + " `" + A + "` supplied to " + ("`" + v + "`, expected a ReactNode."));
      }
      return P(s);
    }
    function oe(s, d, w, v, R) {
      return new _(
        (s || "React class") + ": " + d + " type `" + w + "." + v + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + R + "`."
      );
    }
    function pe(s) {
      function d(w, v, R, A, y) {
        var l = w[v], b = Z(l);
        if (b !== "object")
          return new _("Invalid " + A + " `" + y + "` of type `" + b + "` " + ("supplied to `" + R + "`, expected `object`."));
        for (var h in s) {
          var S = s[h];
          if (typeof S != "function")
            return oe(R, A, y, h, ie(S));
          var I = S(l, h, R, A, y + "." + h, a);
          if (I)
            return I;
        }
        return null;
      }
      return P(d);
    }
    function ae(s) {
      function d(w, v, R, A, y) {
        var l = w[v], b = Z(l);
        if (b !== "object")
          return new _("Invalid " + A + " `" + y + "` of type `" + b + "` " + ("supplied to `" + R + "`, expected `object`."));
        var h = t({}, w[v], s);
        for (var S in h) {
          var I = s[S];
          if (n(s, S) && typeof I != "function")
            return oe(R, A, y, S, ie(I));
          if (!I)
            return new _(
              "Invalid " + A + " `" + y + "` key `" + S + "` supplied to `" + R + "`.\nBad object: " + JSON.stringify(w[v], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(s), null, "  ")
            );
          var u = I(l, S, R, A, y + "." + S, a);
          if (u)
            return u;
        }
        return null;
      }
      return P(d);
    }
    function N(s) {
      switch (typeof s) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !s;
        case "object":
          if (Array.isArray(s))
            return s.every(N);
          if (s === null || m(s))
            return !0;
          var d = g(s);
          if (d) {
            var w = d.call(s), v;
            if (d !== s.entries) {
              for (; !(v = w.next()).done; )
                if (!N(v.value))
                  return !1;
            } else
              for (; !(v = w.next()).done; ) {
                var R = v.value;
                if (R && !N(R[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function Y(s, d) {
      return s === "symbol" ? !0 : d ? d["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && d instanceof Symbol : !1;
    }
    function Z(s) {
      var d = typeof s;
      return Array.isArray(s) ? "array" : s instanceof RegExp ? "object" : Y(d, s) ? "symbol" : d;
    }
    function ie(s) {
      if (typeof s > "u" || s === null)
        return "" + s;
      var d = Z(s);
      if (d === "object") {
        if (s instanceof Date)
          return "date";
        if (s instanceof RegExp)
          return "regexp";
      }
      return d;
    }
    function re(s) {
      var d = ie(s);
      switch (d) {
        case "array":
        case "object":
          return "an " + d;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + d;
        default:
          return d;
      }
    }
    function U(s) {
      return !s.constructor || !s.constructor.name ? j : s.constructor.name;
    }
    return k.checkPropTypes = o, k.resetWarningCache = o.resetWarningCache, k.PropTypes = k, k;
  }, Ze;
}
var Ge, gt;
function ka() {
  if (gt) return Ge;
  gt = 1;
  var e = /* @__PURE__ */ nt();
  function t() {
  }
  function a() {
  }
  return a.resetWarningCache = t, Ge = function() {
    function n(p, m, C, O, E, g) {
      if (g !== e) {
        var j = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw j.name = "Invariant Violation", j;
      }
    }
    n.isRequired = n;
    function o() {
      return n;
    }
    var r = {
      array: n,
      bigint: n,
      bool: n,
      func: n,
      number: n,
      object: n,
      string: n,
      symbol: n,
      any: n,
      arrayOf: o,
      element: n,
      elementType: n,
      instanceOf: o,
      node: n,
      objectOf: o,
      oneOf: o,
      oneOfType: o,
      shape: o,
      exact: o,
      checkPropTypes: a,
      resetWarningCache: t
    };
    return r.PropTypes = r, r;
  }, Ge;
}
var bt;
function Ca() {
  if (bt) return Se.exports;
  if (bt = 1, process.env.NODE_ENV !== "production") {
    var e = zt(), t = !0;
    Se.exports = /* @__PURE__ */ ja()(e.isElement, t);
  } else
    Se.exports = /* @__PURE__ */ ka()();
  return Se.exports;
}
var Ea = /* @__PURE__ */ Ca();
const $ = /* @__PURE__ */ Pt(Ea);
function xe(e, t, a, n) {
  function o(r) {
    return r instanceof a ? r : new a(function(p) {
      p(r);
    });
  }
  return new (a || (a = Promise))(function(r, p) {
    function m(E) {
      try {
        O(n.next(E));
      } catch (g) {
        p(g);
      }
    }
    function C(E) {
      try {
        O(n.throw(E));
      } catch (g) {
        p(g);
      }
    }
    function O(E) {
      E.done ? r(E.value) : o(E.value).then(m, C);
    }
    O((n = n.apply(e, t || [])).next());
  });
}
const Sa = /* @__PURE__ */ new Map([
  // https://github.com/guzzle/psr7/blob/2d9260799e713f1c475d3c5fdc3d6561ff7441b2/src/MimeType.php
  ["1km", "application/vnd.1000minds.decision-model+xml"],
  ["3dml", "text/vnd.in3d.3dml"],
  ["3ds", "image/x-3ds"],
  ["3g2", "video/3gpp2"],
  ["3gp", "video/3gp"],
  ["3gpp", "video/3gpp"],
  ["3mf", "model/3mf"],
  ["7z", "application/x-7z-compressed"],
  ["7zip", "application/x-7z-compressed"],
  ["123", "application/vnd.lotus-1-2-3"],
  ["aab", "application/x-authorware-bin"],
  ["aac", "audio/x-acc"],
  ["aam", "application/x-authorware-map"],
  ["aas", "application/x-authorware-seg"],
  ["abw", "application/x-abiword"],
  ["ac", "application/vnd.nokia.n-gage.ac+xml"],
  ["ac3", "audio/ac3"],
  ["acc", "application/vnd.americandynamics.acc"],
  ["ace", "application/x-ace-compressed"],
  ["acu", "application/vnd.acucobol"],
  ["acutc", "application/vnd.acucorp"],
  ["adp", "audio/adpcm"],
  ["aep", "application/vnd.audiograph"],
  ["afm", "application/x-font-type1"],
  ["afp", "application/vnd.ibm.modcap"],
  ["ahead", "application/vnd.ahead.space"],
  ["ai", "application/pdf"],
  ["aif", "audio/x-aiff"],
  ["aifc", "audio/x-aiff"],
  ["aiff", "audio/x-aiff"],
  ["air", "application/vnd.adobe.air-application-installer-package+zip"],
  ["ait", "application/vnd.dvb.ait"],
  ["ami", "application/vnd.amiga.ami"],
  ["amr", "audio/amr"],
  ["apk", "application/vnd.android.package-archive"],
  ["apng", "image/apng"],
  ["appcache", "text/cache-manifest"],
  ["application", "application/x-ms-application"],
  ["apr", "application/vnd.lotus-approach"],
  ["arc", "application/x-freearc"],
  ["arj", "application/x-arj"],
  ["asc", "application/pgp-signature"],
  ["asf", "video/x-ms-asf"],
  ["asm", "text/x-asm"],
  ["aso", "application/vnd.accpac.simply.aso"],
  ["asx", "video/x-ms-asf"],
  ["atc", "application/vnd.acucorp"],
  ["atom", "application/atom+xml"],
  ["atomcat", "application/atomcat+xml"],
  ["atomdeleted", "application/atomdeleted+xml"],
  ["atomsvc", "application/atomsvc+xml"],
  ["atx", "application/vnd.antix.game-component"],
  ["au", "audio/x-au"],
  ["avi", "video/x-msvideo"],
  ["avif", "image/avif"],
  ["aw", "application/applixware"],
  ["azf", "application/vnd.airzip.filesecure.azf"],
  ["azs", "application/vnd.airzip.filesecure.azs"],
  ["azv", "image/vnd.airzip.accelerator.azv"],
  ["azw", "application/vnd.amazon.ebook"],
  ["b16", "image/vnd.pco.b16"],
  ["bat", "application/x-msdownload"],
  ["bcpio", "application/x-bcpio"],
  ["bdf", "application/x-font-bdf"],
  ["bdm", "application/vnd.syncml.dm+wbxml"],
  ["bdoc", "application/x-bdoc"],
  ["bed", "application/vnd.realvnc.bed"],
  ["bh2", "application/vnd.fujitsu.oasysprs"],
  ["bin", "application/octet-stream"],
  ["blb", "application/x-blorb"],
  ["blorb", "application/x-blorb"],
  ["bmi", "application/vnd.bmi"],
  ["bmml", "application/vnd.balsamiq.bmml+xml"],
  ["bmp", "image/bmp"],
  ["book", "application/vnd.framemaker"],
  ["box", "application/vnd.previewsystems.box"],
  ["boz", "application/x-bzip2"],
  ["bpk", "application/octet-stream"],
  ["bpmn", "application/octet-stream"],
  ["bsp", "model/vnd.valve.source.compiled-map"],
  ["btif", "image/prs.btif"],
  ["buffer", "application/octet-stream"],
  ["bz", "application/x-bzip"],
  ["bz2", "application/x-bzip2"],
  ["c", "text/x-c"],
  ["c4d", "application/vnd.clonk.c4group"],
  ["c4f", "application/vnd.clonk.c4group"],
  ["c4g", "application/vnd.clonk.c4group"],
  ["c4p", "application/vnd.clonk.c4group"],
  ["c4u", "application/vnd.clonk.c4group"],
  ["c11amc", "application/vnd.cluetrust.cartomobile-config"],
  ["c11amz", "application/vnd.cluetrust.cartomobile-config-pkg"],
  ["cab", "application/vnd.ms-cab-compressed"],
  ["caf", "audio/x-caf"],
  ["cap", "application/vnd.tcpdump.pcap"],
  ["car", "application/vnd.curl.car"],
  ["cat", "application/vnd.ms-pki.seccat"],
  ["cb7", "application/x-cbr"],
  ["cba", "application/x-cbr"],
  ["cbr", "application/x-cbr"],
  ["cbt", "application/x-cbr"],
  ["cbz", "application/x-cbr"],
  ["cc", "text/x-c"],
  ["cco", "application/x-cocoa"],
  ["cct", "application/x-director"],
  ["ccxml", "application/ccxml+xml"],
  ["cdbcmsg", "application/vnd.contact.cmsg"],
  ["cda", "application/x-cdf"],
  ["cdf", "application/x-netcdf"],
  ["cdfx", "application/cdfx+xml"],
  ["cdkey", "application/vnd.mediastation.cdkey"],
  ["cdmia", "application/cdmi-capability"],
  ["cdmic", "application/cdmi-container"],
  ["cdmid", "application/cdmi-domain"],
  ["cdmio", "application/cdmi-object"],
  ["cdmiq", "application/cdmi-queue"],
  ["cdr", "application/cdr"],
  ["cdx", "chemical/x-cdx"],
  ["cdxml", "application/vnd.chemdraw+xml"],
  ["cdy", "application/vnd.cinderella"],
  ["cer", "application/pkix-cert"],
  ["cfs", "application/x-cfs-compressed"],
  ["cgm", "image/cgm"],
  ["chat", "application/x-chat"],
  ["chm", "application/vnd.ms-htmlhelp"],
  ["chrt", "application/vnd.kde.kchart"],
  ["cif", "chemical/x-cif"],
  ["cii", "application/vnd.anser-web-certificate-issue-initiation"],
  ["cil", "application/vnd.ms-artgalry"],
  ["cjs", "application/node"],
  ["cla", "application/vnd.claymore"],
  ["class", "application/octet-stream"],
  ["clkk", "application/vnd.crick.clicker.keyboard"],
  ["clkp", "application/vnd.crick.clicker.palette"],
  ["clkt", "application/vnd.crick.clicker.template"],
  ["clkw", "application/vnd.crick.clicker.wordbank"],
  ["clkx", "application/vnd.crick.clicker"],
  ["clp", "application/x-msclip"],
  ["cmc", "application/vnd.cosmocaller"],
  ["cmdf", "chemical/x-cmdf"],
  ["cml", "chemical/x-cml"],
  ["cmp", "application/vnd.yellowriver-custom-menu"],
  ["cmx", "image/x-cmx"],
  ["cod", "application/vnd.rim.cod"],
  ["coffee", "text/coffeescript"],
  ["com", "application/x-msdownload"],
  ["conf", "text/plain"],
  ["cpio", "application/x-cpio"],
  ["cpp", "text/x-c"],
  ["cpt", "application/mac-compactpro"],
  ["crd", "application/x-mscardfile"],
  ["crl", "application/pkix-crl"],
  ["crt", "application/x-x509-ca-cert"],
  ["crx", "application/x-chrome-extension"],
  ["cryptonote", "application/vnd.rig.cryptonote"],
  ["csh", "application/x-csh"],
  ["csl", "application/vnd.citationstyles.style+xml"],
  ["csml", "chemical/x-csml"],
  ["csp", "application/vnd.commonspace"],
  ["csr", "application/octet-stream"],
  ["css", "text/css"],
  ["cst", "application/x-director"],
  ["csv", "text/csv"],
  ["cu", "application/cu-seeme"],
  ["curl", "text/vnd.curl"],
  ["cww", "application/prs.cww"],
  ["cxt", "application/x-director"],
  ["cxx", "text/x-c"],
  ["dae", "model/vnd.collada+xml"],
  ["daf", "application/vnd.mobius.daf"],
  ["dart", "application/vnd.dart"],
  ["dataless", "application/vnd.fdsn.seed"],
  ["davmount", "application/davmount+xml"],
  ["dbf", "application/vnd.dbf"],
  ["dbk", "application/docbook+xml"],
  ["dcr", "application/x-director"],
  ["dcurl", "text/vnd.curl.dcurl"],
  ["dd2", "application/vnd.oma.dd2+xml"],
  ["ddd", "application/vnd.fujixerox.ddd"],
  ["ddf", "application/vnd.syncml.dmddf+xml"],
  ["dds", "image/vnd.ms-dds"],
  ["deb", "application/x-debian-package"],
  ["def", "text/plain"],
  ["deploy", "application/octet-stream"],
  ["der", "application/x-x509-ca-cert"],
  ["dfac", "application/vnd.dreamfactory"],
  ["dgc", "application/x-dgc-compressed"],
  ["dic", "text/x-c"],
  ["dir", "application/x-director"],
  ["dis", "application/vnd.mobius.dis"],
  ["disposition-notification", "message/disposition-notification"],
  ["dist", "application/octet-stream"],
  ["distz", "application/octet-stream"],
  ["djv", "image/vnd.djvu"],
  ["djvu", "image/vnd.djvu"],
  ["dll", "application/octet-stream"],
  ["dmg", "application/x-apple-diskimage"],
  ["dmn", "application/octet-stream"],
  ["dmp", "application/vnd.tcpdump.pcap"],
  ["dms", "application/octet-stream"],
  ["dna", "application/vnd.dna"],
  ["doc", "application/msword"],
  ["docm", "application/vnd.ms-word.template.macroEnabled.12"],
  ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ["dot", "application/msword"],
  ["dotm", "application/vnd.ms-word.template.macroEnabled.12"],
  ["dotx", "application/vnd.openxmlformats-officedocument.wordprocessingml.template"],
  ["dp", "application/vnd.osgi.dp"],
  ["dpg", "application/vnd.dpgraph"],
  ["dra", "audio/vnd.dra"],
  ["drle", "image/dicom-rle"],
  ["dsc", "text/prs.lines.tag"],
  ["dssc", "application/dssc+der"],
  ["dtb", "application/x-dtbook+xml"],
  ["dtd", "application/xml-dtd"],
  ["dts", "audio/vnd.dts"],
  ["dtshd", "audio/vnd.dts.hd"],
  ["dump", "application/octet-stream"],
  ["dvb", "video/vnd.dvb.file"],
  ["dvi", "application/x-dvi"],
  ["dwd", "application/atsc-dwd+xml"],
  ["dwf", "model/vnd.dwf"],
  ["dwg", "image/vnd.dwg"],
  ["dxf", "image/vnd.dxf"],
  ["dxp", "application/vnd.spotfire.dxp"],
  ["dxr", "application/x-director"],
  ["ear", "application/java-archive"],
  ["ecelp4800", "audio/vnd.nuera.ecelp4800"],
  ["ecelp7470", "audio/vnd.nuera.ecelp7470"],
  ["ecelp9600", "audio/vnd.nuera.ecelp9600"],
  ["ecma", "application/ecmascript"],
  ["edm", "application/vnd.novadigm.edm"],
  ["edx", "application/vnd.novadigm.edx"],
  ["efif", "application/vnd.picsel"],
  ["ei6", "application/vnd.pg.osasli"],
  ["elc", "application/octet-stream"],
  ["emf", "image/emf"],
  ["eml", "message/rfc822"],
  ["emma", "application/emma+xml"],
  ["emotionml", "application/emotionml+xml"],
  ["emz", "application/x-msmetafile"],
  ["eol", "audio/vnd.digital-winds"],
  ["eot", "application/vnd.ms-fontobject"],
  ["eps", "application/postscript"],
  ["epub", "application/epub+zip"],
  ["es", "application/ecmascript"],
  ["es3", "application/vnd.eszigno3+xml"],
  ["esa", "application/vnd.osgi.subsystem"],
  ["esf", "application/vnd.epson.esf"],
  ["et3", "application/vnd.eszigno3+xml"],
  ["etx", "text/x-setext"],
  ["eva", "application/x-eva"],
  ["evy", "application/x-envoy"],
  ["exe", "application/octet-stream"],
  ["exi", "application/exi"],
  ["exp", "application/express"],
  ["exr", "image/aces"],
  ["ext", "application/vnd.novadigm.ext"],
  ["ez", "application/andrew-inset"],
  ["ez2", "application/vnd.ezpix-album"],
  ["ez3", "application/vnd.ezpix-package"],
  ["f", "text/x-fortran"],
  ["f4v", "video/mp4"],
  ["f77", "text/x-fortran"],
  ["f90", "text/x-fortran"],
  ["fbs", "image/vnd.fastbidsheet"],
  ["fcdt", "application/vnd.adobe.formscentral.fcdt"],
  ["fcs", "application/vnd.isac.fcs"],
  ["fdf", "application/vnd.fdf"],
  ["fdt", "application/fdt+xml"],
  ["fe_launch", "application/vnd.denovo.fcselayout-link"],
  ["fg5", "application/vnd.fujitsu.oasysgp"],
  ["fgd", "application/x-director"],
  ["fh", "image/x-freehand"],
  ["fh4", "image/x-freehand"],
  ["fh5", "image/x-freehand"],
  ["fh7", "image/x-freehand"],
  ["fhc", "image/x-freehand"],
  ["fig", "application/x-xfig"],
  ["fits", "image/fits"],
  ["flac", "audio/x-flac"],
  ["fli", "video/x-fli"],
  ["flo", "application/vnd.micrografx.flo"],
  ["flv", "video/x-flv"],
  ["flw", "application/vnd.kde.kivio"],
  ["flx", "text/vnd.fmi.flexstor"],
  ["fly", "text/vnd.fly"],
  ["fm", "application/vnd.framemaker"],
  ["fnc", "application/vnd.frogans.fnc"],
  ["fo", "application/vnd.software602.filler.form+xml"],
  ["for", "text/x-fortran"],
  ["fpx", "image/vnd.fpx"],
  ["frame", "application/vnd.framemaker"],
  ["fsc", "application/vnd.fsc.weblaunch"],
  ["fst", "image/vnd.fst"],
  ["ftc", "application/vnd.fluxtime.clip"],
  ["fti", "application/vnd.anser-web-funds-transfer-initiation"],
  ["fvt", "video/vnd.fvt"],
  ["fxp", "application/vnd.adobe.fxp"],
  ["fxpl", "application/vnd.adobe.fxp"],
  ["fzs", "application/vnd.fuzzysheet"],
  ["g2w", "application/vnd.geoplan"],
  ["g3", "image/g3fax"],
  ["g3w", "application/vnd.geospace"],
  ["gac", "application/vnd.groove-account"],
  ["gam", "application/x-tads"],
  ["gbr", "application/rpki-ghostbusters"],
  ["gca", "application/x-gca-compressed"],
  ["gdl", "model/vnd.gdl"],
  ["gdoc", "application/vnd.google-apps.document"],
  ["geo", "application/vnd.dynageo"],
  ["geojson", "application/geo+json"],
  ["gex", "application/vnd.geometry-explorer"],
  ["ggb", "application/vnd.geogebra.file"],
  ["ggt", "application/vnd.geogebra.tool"],
  ["ghf", "application/vnd.groove-help"],
  ["gif", "image/gif"],
  ["gim", "application/vnd.groove-identity-message"],
  ["glb", "model/gltf-binary"],
  ["gltf", "model/gltf+json"],
  ["gml", "application/gml+xml"],
  ["gmx", "application/vnd.gmx"],
  ["gnumeric", "application/x-gnumeric"],
  ["gpg", "application/gpg-keys"],
  ["gph", "application/vnd.flographit"],
  ["gpx", "application/gpx+xml"],
  ["gqf", "application/vnd.grafeq"],
  ["gqs", "application/vnd.grafeq"],
  ["gram", "application/srgs"],
  ["gramps", "application/x-gramps-xml"],
  ["gre", "application/vnd.geometry-explorer"],
  ["grv", "application/vnd.groove-injector"],
  ["grxml", "application/srgs+xml"],
  ["gsf", "application/x-font-ghostscript"],
  ["gsheet", "application/vnd.google-apps.spreadsheet"],
  ["gslides", "application/vnd.google-apps.presentation"],
  ["gtar", "application/x-gtar"],
  ["gtm", "application/vnd.groove-tool-message"],
  ["gtw", "model/vnd.gtw"],
  ["gv", "text/vnd.graphviz"],
  ["gxf", "application/gxf"],
  ["gxt", "application/vnd.geonext"],
  ["gz", "application/gzip"],
  ["gzip", "application/gzip"],
  ["h", "text/x-c"],
  ["h261", "video/h261"],
  ["h263", "video/h263"],
  ["h264", "video/h264"],
  ["hal", "application/vnd.hal+xml"],
  ["hbci", "application/vnd.hbci"],
  ["hbs", "text/x-handlebars-template"],
  ["hdd", "application/x-virtualbox-hdd"],
  ["hdf", "application/x-hdf"],
  ["heic", "image/heic"],
  ["heics", "image/heic-sequence"],
  ["heif", "image/heif"],
  ["heifs", "image/heif-sequence"],
  ["hej2", "image/hej2k"],
  ["held", "application/atsc-held+xml"],
  ["hh", "text/x-c"],
  ["hjson", "application/hjson"],
  ["hlp", "application/winhlp"],
  ["hpgl", "application/vnd.hp-hpgl"],
  ["hpid", "application/vnd.hp-hpid"],
  ["hps", "application/vnd.hp-hps"],
  ["hqx", "application/mac-binhex40"],
  ["hsj2", "image/hsj2"],
  ["htc", "text/x-component"],
  ["htke", "application/vnd.kenameaapp"],
  ["htm", "text/html"],
  ["html", "text/html"],
  ["hvd", "application/vnd.yamaha.hv-dic"],
  ["hvp", "application/vnd.yamaha.hv-voice"],
  ["hvs", "application/vnd.yamaha.hv-script"],
  ["i2g", "application/vnd.intergeo"],
  ["icc", "application/vnd.iccprofile"],
  ["ice", "x-conference/x-cooltalk"],
  ["icm", "application/vnd.iccprofile"],
  ["ico", "image/x-icon"],
  ["ics", "text/calendar"],
  ["ief", "image/ief"],
  ["ifb", "text/calendar"],
  ["ifm", "application/vnd.shana.informed.formdata"],
  ["iges", "model/iges"],
  ["igl", "application/vnd.igloader"],
  ["igm", "application/vnd.insors.igm"],
  ["igs", "model/iges"],
  ["igx", "application/vnd.micrografx.igx"],
  ["iif", "application/vnd.shana.informed.interchange"],
  ["img", "application/octet-stream"],
  ["imp", "application/vnd.accpac.simply.imp"],
  ["ims", "application/vnd.ms-ims"],
  ["in", "text/plain"],
  ["ini", "text/plain"],
  ["ink", "application/inkml+xml"],
  ["inkml", "application/inkml+xml"],
  ["install", "application/x-install-instructions"],
  ["iota", "application/vnd.astraea-software.iota"],
  ["ipfix", "application/ipfix"],
  ["ipk", "application/vnd.shana.informed.package"],
  ["irm", "application/vnd.ibm.rights-management"],
  ["irp", "application/vnd.irepository.package+xml"],
  ["iso", "application/x-iso9660-image"],
  ["itp", "application/vnd.shana.informed.formtemplate"],
  ["its", "application/its+xml"],
  ["ivp", "application/vnd.immervision-ivp"],
  ["ivu", "application/vnd.immervision-ivu"],
  ["jad", "text/vnd.sun.j2me.app-descriptor"],
  ["jade", "text/jade"],
  ["jam", "application/vnd.jam"],
  ["jar", "application/java-archive"],
  ["jardiff", "application/x-java-archive-diff"],
  ["java", "text/x-java-source"],
  ["jhc", "image/jphc"],
  ["jisp", "application/vnd.jisp"],
  ["jls", "image/jls"],
  ["jlt", "application/vnd.hp-jlyt"],
  ["jng", "image/x-jng"],
  ["jnlp", "application/x-java-jnlp-file"],
  ["joda", "application/vnd.joost.joda-archive"],
  ["jp2", "image/jp2"],
  ["jpe", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["jpf", "image/jpx"],
  ["jpg", "image/jpeg"],
  ["jpg2", "image/jp2"],
  ["jpgm", "video/jpm"],
  ["jpgv", "video/jpeg"],
  ["jph", "image/jph"],
  ["jpm", "video/jpm"],
  ["jpx", "image/jpx"],
  ["js", "application/javascript"],
  ["json", "application/json"],
  ["json5", "application/json5"],
  ["jsonld", "application/ld+json"],
  // https://jsonlines.org/
  ["jsonl", "application/jsonl"],
  ["jsonml", "application/jsonml+json"],
  ["jsx", "text/jsx"],
  ["jxr", "image/jxr"],
  ["jxra", "image/jxra"],
  ["jxrs", "image/jxrs"],
  ["jxs", "image/jxs"],
  ["jxsc", "image/jxsc"],
  ["jxsi", "image/jxsi"],
  ["jxss", "image/jxss"],
  ["kar", "audio/midi"],
  ["karbon", "application/vnd.kde.karbon"],
  ["kdb", "application/octet-stream"],
  ["kdbx", "application/x-keepass2"],
  ["key", "application/x-iwork-keynote-sffkey"],
  ["kfo", "application/vnd.kde.kformula"],
  ["kia", "application/vnd.kidspiration"],
  ["kml", "application/vnd.google-earth.kml+xml"],
  ["kmz", "application/vnd.google-earth.kmz"],
  ["kne", "application/vnd.kinar"],
  ["knp", "application/vnd.kinar"],
  ["kon", "application/vnd.kde.kontour"],
  ["kpr", "application/vnd.kde.kpresenter"],
  ["kpt", "application/vnd.kde.kpresenter"],
  ["kpxx", "application/vnd.ds-keypoint"],
  ["ksp", "application/vnd.kde.kspread"],
  ["ktr", "application/vnd.kahootz"],
  ["ktx", "image/ktx"],
  ["ktx2", "image/ktx2"],
  ["ktz", "application/vnd.kahootz"],
  ["kwd", "application/vnd.kde.kword"],
  ["kwt", "application/vnd.kde.kword"],
  ["lasxml", "application/vnd.las.las+xml"],
  ["latex", "application/x-latex"],
  ["lbd", "application/vnd.llamagraphics.life-balance.desktop"],
  ["lbe", "application/vnd.llamagraphics.life-balance.exchange+xml"],
  ["les", "application/vnd.hhe.lesson-player"],
  ["less", "text/less"],
  ["lgr", "application/lgr+xml"],
  ["lha", "application/octet-stream"],
  ["link66", "application/vnd.route66.link66+xml"],
  ["list", "text/plain"],
  ["list3820", "application/vnd.ibm.modcap"],
  ["listafp", "application/vnd.ibm.modcap"],
  ["litcoffee", "text/coffeescript"],
  ["lnk", "application/x-ms-shortcut"],
  ["log", "text/plain"],
  ["lostxml", "application/lost+xml"],
  ["lrf", "application/octet-stream"],
  ["lrm", "application/vnd.ms-lrm"],
  ["ltf", "application/vnd.frogans.ltf"],
  ["lua", "text/x-lua"],
  ["luac", "application/x-lua-bytecode"],
  ["lvp", "audio/vnd.lucent.voice"],
  ["lwp", "application/vnd.lotus-wordpro"],
  ["lzh", "application/octet-stream"],
  ["m1v", "video/mpeg"],
  ["m2a", "audio/mpeg"],
  ["m2v", "video/mpeg"],
  ["m3a", "audio/mpeg"],
  ["m3u", "text/plain"],
  ["m3u8", "application/vnd.apple.mpegurl"],
  ["m4a", "audio/x-m4a"],
  ["m4p", "application/mp4"],
  ["m4s", "video/iso.segment"],
  ["m4u", "application/vnd.mpegurl"],
  ["m4v", "video/x-m4v"],
  ["m13", "application/x-msmediaview"],
  ["m14", "application/x-msmediaview"],
  ["m21", "application/mp21"],
  ["ma", "application/mathematica"],
  ["mads", "application/mads+xml"],
  ["maei", "application/mmt-aei+xml"],
  ["mag", "application/vnd.ecowin.chart"],
  ["maker", "application/vnd.framemaker"],
  ["man", "text/troff"],
  ["manifest", "text/cache-manifest"],
  ["map", "application/json"],
  ["mar", "application/octet-stream"],
  ["markdown", "text/markdown"],
  ["mathml", "application/mathml+xml"],
  ["mb", "application/mathematica"],
  ["mbk", "application/vnd.mobius.mbk"],
  ["mbox", "application/mbox"],
  ["mc1", "application/vnd.medcalcdata"],
  ["mcd", "application/vnd.mcd"],
  ["mcurl", "text/vnd.curl.mcurl"],
  ["md", "text/markdown"],
  ["mdb", "application/x-msaccess"],
  ["mdi", "image/vnd.ms-modi"],
  ["mdx", "text/mdx"],
  ["me", "text/troff"],
  ["mesh", "model/mesh"],
  ["meta4", "application/metalink4+xml"],
  ["metalink", "application/metalink+xml"],
  ["mets", "application/mets+xml"],
  ["mfm", "application/vnd.mfmp"],
  ["mft", "application/rpki-manifest"],
  ["mgp", "application/vnd.osgeo.mapguide.package"],
  ["mgz", "application/vnd.proteus.magazine"],
  ["mid", "audio/midi"],
  ["midi", "audio/midi"],
  ["mie", "application/x-mie"],
  ["mif", "application/vnd.mif"],
  ["mime", "message/rfc822"],
  ["mj2", "video/mj2"],
  ["mjp2", "video/mj2"],
  ["mjs", "application/javascript"],
  ["mk3d", "video/x-matroska"],
  ["mka", "audio/x-matroska"],
  ["mkd", "text/x-markdown"],
  ["mks", "video/x-matroska"],
  ["mkv", "video/x-matroska"],
  ["mlp", "application/vnd.dolby.mlp"],
  ["mmd", "application/vnd.chipnuts.karaoke-mmd"],
  ["mmf", "application/vnd.smaf"],
  ["mml", "text/mathml"],
  ["mmr", "image/vnd.fujixerox.edmics-mmr"],
  ["mng", "video/x-mng"],
  ["mny", "application/x-msmoney"],
  ["mobi", "application/x-mobipocket-ebook"],
  ["mods", "application/mods+xml"],
  ["mov", "video/quicktime"],
  ["movie", "video/x-sgi-movie"],
  ["mp2", "audio/mpeg"],
  ["mp2a", "audio/mpeg"],
  ["mp3", "audio/mpeg"],
  ["mp4", "video/mp4"],
  ["mp4a", "audio/mp4"],
  ["mp4s", "application/mp4"],
  ["mp4v", "video/mp4"],
  ["mp21", "application/mp21"],
  ["mpc", "application/vnd.mophun.certificate"],
  ["mpd", "application/dash+xml"],
  ["mpe", "video/mpeg"],
  ["mpeg", "video/mpeg"],
  ["mpg", "video/mpeg"],
  ["mpg4", "video/mp4"],
  ["mpga", "audio/mpeg"],
  ["mpkg", "application/vnd.apple.installer+xml"],
  ["mpm", "application/vnd.blueice.multipass"],
  ["mpn", "application/vnd.mophun.application"],
  ["mpp", "application/vnd.ms-project"],
  ["mpt", "application/vnd.ms-project"],
  ["mpy", "application/vnd.ibm.minipay"],
  ["mqy", "application/vnd.mobius.mqy"],
  ["mrc", "application/marc"],
  ["mrcx", "application/marcxml+xml"],
  ["ms", "text/troff"],
  ["mscml", "application/mediaservercontrol+xml"],
  ["mseed", "application/vnd.fdsn.mseed"],
  ["mseq", "application/vnd.mseq"],
  ["msf", "application/vnd.epson.msf"],
  ["msg", "application/vnd.ms-outlook"],
  ["msh", "model/mesh"],
  ["msi", "application/x-msdownload"],
  ["msl", "application/vnd.mobius.msl"],
  ["msm", "application/octet-stream"],
  ["msp", "application/octet-stream"],
  ["msty", "application/vnd.muvee.style"],
  ["mtl", "model/mtl"],
  ["mts", "model/vnd.mts"],
  ["mus", "application/vnd.musician"],
  ["musd", "application/mmt-usd+xml"],
  ["musicxml", "application/vnd.recordare.musicxml+xml"],
  ["mvb", "application/x-msmediaview"],
  ["mvt", "application/vnd.mapbox-vector-tile"],
  ["mwf", "application/vnd.mfer"],
  ["mxf", "application/mxf"],
  ["mxl", "application/vnd.recordare.musicxml"],
  ["mxmf", "audio/mobile-xmf"],
  ["mxml", "application/xv+xml"],
  ["mxs", "application/vnd.triscape.mxs"],
  ["mxu", "video/vnd.mpegurl"],
  ["n-gage", "application/vnd.nokia.n-gage.symbian.install"],
  ["n3", "text/n3"],
  ["nb", "application/mathematica"],
  ["nbp", "application/vnd.wolfram.player"],
  ["nc", "application/x-netcdf"],
  ["ncx", "application/x-dtbncx+xml"],
  ["nfo", "text/x-nfo"],
  ["ngdat", "application/vnd.nokia.n-gage.data"],
  ["nitf", "application/vnd.nitf"],
  ["nlu", "application/vnd.neurolanguage.nlu"],
  ["nml", "application/vnd.enliven"],
  ["nnd", "application/vnd.noblenet-directory"],
  ["nns", "application/vnd.noblenet-sealer"],
  ["nnw", "application/vnd.noblenet-web"],
  ["npx", "image/vnd.net-fpx"],
  ["nq", "application/n-quads"],
  ["nsc", "application/x-conference"],
  ["nsf", "application/vnd.lotus-notes"],
  ["nt", "application/n-triples"],
  ["ntf", "application/vnd.nitf"],
  ["numbers", "application/x-iwork-numbers-sffnumbers"],
  ["nzb", "application/x-nzb"],
  ["oa2", "application/vnd.fujitsu.oasys2"],
  ["oa3", "application/vnd.fujitsu.oasys3"],
  ["oas", "application/vnd.fujitsu.oasys"],
  ["obd", "application/x-msbinder"],
  ["obgx", "application/vnd.openblox.game+xml"],
  ["obj", "model/obj"],
  ["oda", "application/oda"],
  ["odb", "application/vnd.oasis.opendocument.database"],
  ["odc", "application/vnd.oasis.opendocument.chart"],
  ["odf", "application/vnd.oasis.opendocument.formula"],
  ["odft", "application/vnd.oasis.opendocument.formula-template"],
  ["odg", "application/vnd.oasis.opendocument.graphics"],
  ["odi", "application/vnd.oasis.opendocument.image"],
  ["odm", "application/vnd.oasis.opendocument.text-master"],
  ["odp", "application/vnd.oasis.opendocument.presentation"],
  ["ods", "application/vnd.oasis.opendocument.spreadsheet"],
  ["odt", "application/vnd.oasis.opendocument.text"],
  ["oga", "audio/ogg"],
  ["ogex", "model/vnd.opengex"],
  ["ogg", "audio/ogg"],
  ["ogv", "video/ogg"],
  ["ogx", "application/ogg"],
  ["omdoc", "application/omdoc+xml"],
  ["onepkg", "application/onenote"],
  ["onetmp", "application/onenote"],
  ["onetoc", "application/onenote"],
  ["onetoc2", "application/onenote"],
  ["opf", "application/oebps-package+xml"],
  ["opml", "text/x-opml"],
  ["oprc", "application/vnd.palm"],
  ["opus", "audio/ogg"],
  ["org", "text/x-org"],
  ["osf", "application/vnd.yamaha.openscoreformat"],
  ["osfpvg", "application/vnd.yamaha.openscoreformat.osfpvg+xml"],
  ["osm", "application/vnd.openstreetmap.data+xml"],
  ["otc", "application/vnd.oasis.opendocument.chart-template"],
  ["otf", "font/otf"],
  ["otg", "application/vnd.oasis.opendocument.graphics-template"],
  ["oth", "application/vnd.oasis.opendocument.text-web"],
  ["oti", "application/vnd.oasis.opendocument.image-template"],
  ["otp", "application/vnd.oasis.opendocument.presentation-template"],
  ["ots", "application/vnd.oasis.opendocument.spreadsheet-template"],
  ["ott", "application/vnd.oasis.opendocument.text-template"],
  ["ova", "application/x-virtualbox-ova"],
  ["ovf", "application/x-virtualbox-ovf"],
  ["owl", "application/rdf+xml"],
  ["oxps", "application/oxps"],
  ["oxt", "application/vnd.openofficeorg.extension"],
  ["p", "text/x-pascal"],
  ["p7a", "application/x-pkcs7-signature"],
  ["p7b", "application/x-pkcs7-certificates"],
  ["p7c", "application/pkcs7-mime"],
  ["p7m", "application/pkcs7-mime"],
  ["p7r", "application/x-pkcs7-certreqresp"],
  ["p7s", "application/pkcs7-signature"],
  ["p8", "application/pkcs8"],
  ["p10", "application/x-pkcs10"],
  ["p12", "application/x-pkcs12"],
  ["pac", "application/x-ns-proxy-autoconfig"],
  ["pages", "application/x-iwork-pages-sffpages"],
  ["pas", "text/x-pascal"],
  ["paw", "application/vnd.pawaafile"],
  ["pbd", "application/vnd.powerbuilder6"],
  ["pbm", "image/x-portable-bitmap"],
  ["pcap", "application/vnd.tcpdump.pcap"],
  ["pcf", "application/x-font-pcf"],
  ["pcl", "application/vnd.hp-pcl"],
  ["pclxl", "application/vnd.hp-pclxl"],
  ["pct", "image/x-pict"],
  ["pcurl", "application/vnd.curl.pcurl"],
  ["pcx", "image/x-pcx"],
  ["pdb", "application/x-pilot"],
  ["pde", "text/x-processing"],
  ["pdf", "application/pdf"],
  ["pem", "application/x-x509-user-cert"],
  ["pfa", "application/x-font-type1"],
  ["pfb", "application/x-font-type1"],
  ["pfm", "application/x-font-type1"],
  ["pfr", "application/font-tdpfr"],
  ["pfx", "application/x-pkcs12"],
  ["pgm", "image/x-portable-graymap"],
  ["pgn", "application/x-chess-pgn"],
  ["pgp", "application/pgp"],
  ["php", "application/x-httpd-php"],
  ["php3", "application/x-httpd-php"],
  ["php4", "application/x-httpd-php"],
  ["phps", "application/x-httpd-php-source"],
  ["phtml", "application/x-httpd-php"],
  ["pic", "image/x-pict"],
  ["pkg", "application/octet-stream"],
  ["pki", "application/pkixcmp"],
  ["pkipath", "application/pkix-pkipath"],
  ["pkpass", "application/vnd.apple.pkpass"],
  ["pl", "application/x-perl"],
  ["plb", "application/vnd.3gpp.pic-bw-large"],
  ["plc", "application/vnd.mobius.plc"],
  ["plf", "application/vnd.pocketlearn"],
  ["pls", "application/pls+xml"],
  ["pm", "application/x-perl"],
  ["pml", "application/vnd.ctc-posml"],
  ["png", "image/png"],
  ["pnm", "image/x-portable-anymap"],
  ["portpkg", "application/vnd.macports.portpkg"],
  ["pot", "application/vnd.ms-powerpoint"],
  ["potm", "application/vnd.ms-powerpoint.presentation.macroEnabled.12"],
  ["potx", "application/vnd.openxmlformats-officedocument.presentationml.template"],
  ["ppa", "application/vnd.ms-powerpoint"],
  ["ppam", "application/vnd.ms-powerpoint.addin.macroEnabled.12"],
  ["ppd", "application/vnd.cups-ppd"],
  ["ppm", "image/x-portable-pixmap"],
  ["pps", "application/vnd.ms-powerpoint"],
  ["ppsm", "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"],
  ["ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow"],
  ["ppt", "application/powerpoint"],
  ["pptm", "application/vnd.ms-powerpoint.presentation.macroEnabled.12"],
  ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ["pqa", "application/vnd.palm"],
  ["prc", "application/x-pilot"],
  ["pre", "application/vnd.lotus-freelance"],
  ["prf", "application/pics-rules"],
  ["provx", "application/provenance+xml"],
  ["ps", "application/postscript"],
  ["psb", "application/vnd.3gpp.pic-bw-small"],
  ["psd", "application/x-photoshop"],
  ["psf", "application/x-font-linux-psf"],
  ["pskcxml", "application/pskc+xml"],
  ["pti", "image/prs.pti"],
  ["ptid", "application/vnd.pvi.ptid1"],
  ["pub", "application/x-mspublisher"],
  ["pvb", "application/vnd.3gpp.pic-bw-var"],
  ["pwn", "application/vnd.3m.post-it-notes"],
  ["pya", "audio/vnd.ms-playready.media.pya"],
  ["pyv", "video/vnd.ms-playready.media.pyv"],
  ["qam", "application/vnd.epson.quickanime"],
  ["qbo", "application/vnd.intu.qbo"],
  ["qfx", "application/vnd.intu.qfx"],
  ["qps", "application/vnd.publishare-delta-tree"],
  ["qt", "video/quicktime"],
  ["qwd", "application/vnd.quark.quarkxpress"],
  ["qwt", "application/vnd.quark.quarkxpress"],
  ["qxb", "application/vnd.quark.quarkxpress"],
  ["qxd", "application/vnd.quark.quarkxpress"],
  ["qxl", "application/vnd.quark.quarkxpress"],
  ["qxt", "application/vnd.quark.quarkxpress"],
  ["ra", "audio/x-realaudio"],
  ["ram", "audio/x-pn-realaudio"],
  ["raml", "application/raml+yaml"],
  ["rapd", "application/route-apd+xml"],
  ["rar", "application/x-rar"],
  ["ras", "image/x-cmu-raster"],
  ["rcprofile", "application/vnd.ipunplugged.rcprofile"],
  ["rdf", "application/rdf+xml"],
  ["rdz", "application/vnd.data-vision.rdz"],
  ["relo", "application/p2p-overlay+xml"],
  ["rep", "application/vnd.businessobjects"],
  ["res", "application/x-dtbresource+xml"],
  ["rgb", "image/x-rgb"],
  ["rif", "application/reginfo+xml"],
  ["rip", "audio/vnd.rip"],
  ["ris", "application/x-research-info-systems"],
  ["rl", "application/resource-lists+xml"],
  ["rlc", "image/vnd.fujixerox.edmics-rlc"],
  ["rld", "application/resource-lists-diff+xml"],
  ["rm", "audio/x-pn-realaudio"],
  ["rmi", "audio/midi"],
  ["rmp", "audio/x-pn-realaudio-plugin"],
  ["rms", "application/vnd.jcp.javame.midlet-rms"],
  ["rmvb", "application/vnd.rn-realmedia-vbr"],
  ["rnc", "application/relax-ng-compact-syntax"],
  ["rng", "application/xml"],
  ["roa", "application/rpki-roa"],
  ["roff", "text/troff"],
  ["rp9", "application/vnd.cloanto.rp9"],
  ["rpm", "audio/x-pn-realaudio-plugin"],
  ["rpss", "application/vnd.nokia.radio-presets"],
  ["rpst", "application/vnd.nokia.radio-preset"],
  ["rq", "application/sparql-query"],
  ["rs", "application/rls-services+xml"],
  ["rsa", "application/x-pkcs7"],
  ["rsat", "application/atsc-rsat+xml"],
  ["rsd", "application/rsd+xml"],
  ["rsheet", "application/urc-ressheet+xml"],
  ["rss", "application/rss+xml"],
  ["rtf", "text/rtf"],
  ["rtx", "text/richtext"],
  ["run", "application/x-makeself"],
  ["rusd", "application/route-usd+xml"],
  ["rv", "video/vnd.rn-realvideo"],
  ["s", "text/x-asm"],
  ["s3m", "audio/s3m"],
  ["saf", "application/vnd.yamaha.smaf-audio"],
  ["sass", "text/x-sass"],
  ["sbml", "application/sbml+xml"],
  ["sc", "application/vnd.ibm.secure-container"],
  ["scd", "application/x-msschedule"],
  ["scm", "application/vnd.lotus-screencam"],
  ["scq", "application/scvp-cv-request"],
  ["scs", "application/scvp-cv-response"],
  ["scss", "text/x-scss"],
  ["scurl", "text/vnd.curl.scurl"],
  ["sda", "application/vnd.stardivision.draw"],
  ["sdc", "application/vnd.stardivision.calc"],
  ["sdd", "application/vnd.stardivision.impress"],
  ["sdkd", "application/vnd.solent.sdkm+xml"],
  ["sdkm", "application/vnd.solent.sdkm+xml"],
  ["sdp", "application/sdp"],
  ["sdw", "application/vnd.stardivision.writer"],
  ["sea", "application/octet-stream"],
  ["see", "application/vnd.seemail"],
  ["seed", "application/vnd.fdsn.seed"],
  ["sema", "application/vnd.sema"],
  ["semd", "application/vnd.semd"],
  ["semf", "application/vnd.semf"],
  ["senmlx", "application/senml+xml"],
  ["sensmlx", "application/sensml+xml"],
  ["ser", "application/java-serialized-object"],
  ["setpay", "application/set-payment-initiation"],
  ["setreg", "application/set-registration-initiation"],
  ["sfd-hdstx", "application/vnd.hydrostatix.sof-data"],
  ["sfs", "application/vnd.spotfire.sfs"],
  ["sfv", "text/x-sfv"],
  ["sgi", "image/sgi"],
  ["sgl", "application/vnd.stardivision.writer-global"],
  ["sgm", "text/sgml"],
  ["sgml", "text/sgml"],
  ["sh", "application/x-sh"],
  ["shar", "application/x-shar"],
  ["shex", "text/shex"],
  ["shf", "application/shf+xml"],
  ["shtml", "text/html"],
  ["sid", "image/x-mrsid-image"],
  ["sieve", "application/sieve"],
  ["sig", "application/pgp-signature"],
  ["sil", "audio/silk"],
  ["silo", "model/mesh"],
  ["sis", "application/vnd.symbian.install"],
  ["sisx", "application/vnd.symbian.install"],
  ["sit", "application/x-stuffit"],
  ["sitx", "application/x-stuffitx"],
  ["siv", "application/sieve"],
  ["skd", "application/vnd.koan"],
  ["skm", "application/vnd.koan"],
  ["skp", "application/vnd.koan"],
  ["skt", "application/vnd.koan"],
  ["sldm", "application/vnd.ms-powerpoint.slide.macroenabled.12"],
  ["sldx", "application/vnd.openxmlformats-officedocument.presentationml.slide"],
  ["slim", "text/slim"],
  ["slm", "text/slim"],
  ["sls", "application/route-s-tsid+xml"],
  ["slt", "application/vnd.epson.salt"],
  ["sm", "application/vnd.stepmania.stepchart"],
  ["smf", "application/vnd.stardivision.math"],
  ["smi", "application/smil"],
  ["smil", "application/smil"],
  ["smv", "video/x-smv"],
  ["smzip", "application/vnd.stepmania.package"],
  ["snd", "audio/basic"],
  ["snf", "application/x-font-snf"],
  ["so", "application/octet-stream"],
  ["spc", "application/x-pkcs7-certificates"],
  ["spdx", "text/spdx"],
  ["spf", "application/vnd.yamaha.smaf-phrase"],
  ["spl", "application/x-futuresplash"],
  ["spot", "text/vnd.in3d.spot"],
  ["spp", "application/scvp-vp-response"],
  ["spq", "application/scvp-vp-request"],
  ["spx", "audio/ogg"],
  ["sql", "application/x-sql"],
  ["src", "application/x-wais-source"],
  ["srt", "application/x-subrip"],
  ["sru", "application/sru+xml"],
  ["srx", "application/sparql-results+xml"],
  ["ssdl", "application/ssdl+xml"],
  ["sse", "application/vnd.kodak-descriptor"],
  ["ssf", "application/vnd.epson.ssf"],
  ["ssml", "application/ssml+xml"],
  ["sst", "application/octet-stream"],
  ["st", "application/vnd.sailingtracker.track"],
  ["stc", "application/vnd.sun.xml.calc.template"],
  ["std", "application/vnd.sun.xml.draw.template"],
  ["stf", "application/vnd.wt.stf"],
  ["sti", "application/vnd.sun.xml.impress.template"],
  ["stk", "application/hyperstudio"],
  ["stl", "model/stl"],
  ["stpx", "model/step+xml"],
  ["stpxz", "model/step-xml+zip"],
  ["stpz", "model/step+zip"],
  ["str", "application/vnd.pg.format"],
  ["stw", "application/vnd.sun.xml.writer.template"],
  ["styl", "text/stylus"],
  ["stylus", "text/stylus"],
  ["sub", "text/vnd.dvb.subtitle"],
  ["sus", "application/vnd.sus-calendar"],
  ["susp", "application/vnd.sus-calendar"],
  ["sv4cpio", "application/x-sv4cpio"],
  ["sv4crc", "application/x-sv4crc"],
  ["svc", "application/vnd.dvb.service"],
  ["svd", "application/vnd.svd"],
  ["svg", "image/svg+xml"],
  ["svgz", "image/svg+xml"],
  ["swa", "application/x-director"],
  ["swf", "application/x-shockwave-flash"],
  ["swi", "application/vnd.aristanetworks.swi"],
  ["swidtag", "application/swid+xml"],
  ["sxc", "application/vnd.sun.xml.calc"],
  ["sxd", "application/vnd.sun.xml.draw"],
  ["sxg", "application/vnd.sun.xml.writer.global"],
  ["sxi", "application/vnd.sun.xml.impress"],
  ["sxm", "application/vnd.sun.xml.math"],
  ["sxw", "application/vnd.sun.xml.writer"],
  ["t", "text/troff"],
  ["t3", "application/x-t3vm-image"],
  ["t38", "image/t38"],
  ["taglet", "application/vnd.mynfc"],
  ["tao", "application/vnd.tao.intent-module-archive"],
  ["tap", "image/vnd.tencent.tap"],
  ["tar", "application/x-tar"],
  ["tcap", "application/vnd.3gpp2.tcap"],
  ["tcl", "application/x-tcl"],
  ["td", "application/urc-targetdesc+xml"],
  ["teacher", "application/vnd.smart.teacher"],
  ["tei", "application/tei+xml"],
  ["teicorpus", "application/tei+xml"],
  ["tex", "application/x-tex"],
  ["texi", "application/x-texinfo"],
  ["texinfo", "application/x-texinfo"],
  ["text", "text/plain"],
  ["tfi", "application/thraud+xml"],
  ["tfm", "application/x-tex-tfm"],
  ["tfx", "image/tiff-fx"],
  ["tga", "image/x-tga"],
  ["tgz", "application/x-tar"],
  ["thmx", "application/vnd.ms-officetheme"],
  ["tif", "image/tiff"],
  ["tiff", "image/tiff"],
  ["tk", "application/x-tcl"],
  ["tmo", "application/vnd.tmobile-livetv"],
  ["toml", "application/toml"],
  ["torrent", "application/x-bittorrent"],
  ["tpl", "application/vnd.groove-tool-template"],
  ["tpt", "application/vnd.trid.tpt"],
  ["tr", "text/troff"],
  ["tra", "application/vnd.trueapp"],
  ["trig", "application/trig"],
  ["trm", "application/x-msterminal"],
  ["ts", "video/mp2t"],
  ["tsd", "application/timestamped-data"],
  ["tsv", "text/tab-separated-values"],
  ["ttc", "font/collection"],
  ["ttf", "font/ttf"],
  ["ttl", "text/turtle"],
  ["ttml", "application/ttml+xml"],
  ["twd", "application/vnd.simtech-mindmapper"],
  ["twds", "application/vnd.simtech-mindmapper"],
  ["txd", "application/vnd.genomatix.tuxedo"],
  ["txf", "application/vnd.mobius.txf"],
  ["txt", "text/plain"],
  ["u8dsn", "message/global-delivery-status"],
  ["u8hdr", "message/global-headers"],
  ["u8mdn", "message/global-disposition-notification"],
  ["u8msg", "message/global"],
  ["u32", "application/x-authorware-bin"],
  ["ubj", "application/ubjson"],
  ["udeb", "application/x-debian-package"],
  ["ufd", "application/vnd.ufdl"],
  ["ufdl", "application/vnd.ufdl"],
  ["ulx", "application/x-glulx"],
  ["umj", "application/vnd.umajin"],
  ["unityweb", "application/vnd.unity"],
  ["uoml", "application/vnd.uoml+xml"],
  ["uri", "text/uri-list"],
  ["uris", "text/uri-list"],
  ["urls", "text/uri-list"],
  ["usdz", "model/vnd.usdz+zip"],
  ["ustar", "application/x-ustar"],
  ["utz", "application/vnd.uiq.theme"],
  ["uu", "text/x-uuencode"],
  ["uva", "audio/vnd.dece.audio"],
  ["uvd", "application/vnd.dece.data"],
  ["uvf", "application/vnd.dece.data"],
  ["uvg", "image/vnd.dece.graphic"],
  ["uvh", "video/vnd.dece.hd"],
  ["uvi", "image/vnd.dece.graphic"],
  ["uvm", "video/vnd.dece.mobile"],
  ["uvp", "video/vnd.dece.pd"],
  ["uvs", "video/vnd.dece.sd"],
  ["uvt", "application/vnd.dece.ttml+xml"],
  ["uvu", "video/vnd.uvvu.mp4"],
  ["uvv", "video/vnd.dece.video"],
  ["uvva", "audio/vnd.dece.audio"],
  ["uvvd", "application/vnd.dece.data"],
  ["uvvf", "application/vnd.dece.data"],
  ["uvvg", "image/vnd.dece.graphic"],
  ["uvvh", "video/vnd.dece.hd"],
  ["uvvi", "image/vnd.dece.graphic"],
  ["uvvm", "video/vnd.dece.mobile"],
  ["uvvp", "video/vnd.dece.pd"],
  ["uvvs", "video/vnd.dece.sd"],
  ["uvvt", "application/vnd.dece.ttml+xml"],
  ["uvvu", "video/vnd.uvvu.mp4"],
  ["uvvv", "video/vnd.dece.video"],
  ["uvvx", "application/vnd.dece.unspecified"],
  ["uvvz", "application/vnd.dece.zip"],
  ["uvx", "application/vnd.dece.unspecified"],
  ["uvz", "application/vnd.dece.zip"],
  ["vbox", "application/x-virtualbox-vbox"],
  ["vbox-extpack", "application/x-virtualbox-vbox-extpack"],
  ["vcard", "text/vcard"],
  ["vcd", "application/x-cdlink"],
  ["vcf", "text/x-vcard"],
  ["vcg", "application/vnd.groove-vcard"],
  ["vcs", "text/x-vcalendar"],
  ["vcx", "application/vnd.vcx"],
  ["vdi", "application/x-virtualbox-vdi"],
  ["vds", "model/vnd.sap.vds"],
  ["vhd", "application/x-virtualbox-vhd"],
  ["vis", "application/vnd.visionary"],
  ["viv", "video/vnd.vivo"],
  ["vlc", "application/videolan"],
  ["vmdk", "application/x-virtualbox-vmdk"],
  ["vob", "video/x-ms-vob"],
  ["vor", "application/vnd.stardivision.writer"],
  ["vox", "application/x-authorware-bin"],
  ["vrml", "model/vrml"],
  ["vsd", "application/vnd.visio"],
  ["vsf", "application/vnd.vsf"],
  ["vss", "application/vnd.visio"],
  ["vst", "application/vnd.visio"],
  ["vsw", "application/vnd.visio"],
  ["vtf", "image/vnd.valve.source.texture"],
  ["vtt", "text/vtt"],
  ["vtu", "model/vnd.vtu"],
  ["vxml", "application/voicexml+xml"],
  ["w3d", "application/x-director"],
  ["wad", "application/x-doom"],
  ["wadl", "application/vnd.sun.wadl+xml"],
  ["war", "application/java-archive"],
  ["wasm", "application/wasm"],
  ["wav", "audio/x-wav"],
  ["wax", "audio/x-ms-wax"],
  ["wbmp", "image/vnd.wap.wbmp"],
  ["wbs", "application/vnd.criticaltools.wbs+xml"],
  ["wbxml", "application/wbxml"],
  ["wcm", "application/vnd.ms-works"],
  ["wdb", "application/vnd.ms-works"],
  ["wdp", "image/vnd.ms-photo"],
  ["weba", "audio/webm"],
  ["webapp", "application/x-web-app-manifest+json"],
  ["webm", "video/webm"],
  ["webmanifest", "application/manifest+json"],
  ["webp", "image/webp"],
  ["wg", "application/vnd.pmi.widget"],
  ["wgt", "application/widget"],
  ["wks", "application/vnd.ms-works"],
  ["wm", "video/x-ms-wm"],
  ["wma", "audio/x-ms-wma"],
  ["wmd", "application/x-ms-wmd"],
  ["wmf", "image/wmf"],
  ["wml", "text/vnd.wap.wml"],
  ["wmlc", "application/wmlc"],
  ["wmls", "text/vnd.wap.wmlscript"],
  ["wmlsc", "application/vnd.wap.wmlscriptc"],
  ["wmv", "video/x-ms-wmv"],
  ["wmx", "video/x-ms-wmx"],
  ["wmz", "application/x-msmetafile"],
  ["woff", "font/woff"],
  ["woff2", "font/woff2"],
  ["word", "application/msword"],
  ["wpd", "application/vnd.wordperfect"],
  ["wpl", "application/vnd.ms-wpl"],
  ["wps", "application/vnd.ms-works"],
  ["wqd", "application/vnd.wqd"],
  ["wri", "application/x-mswrite"],
  ["wrl", "model/vrml"],
  ["wsc", "message/vnd.wfa.wsc"],
  ["wsdl", "application/wsdl+xml"],
  ["wspolicy", "application/wspolicy+xml"],
  ["wtb", "application/vnd.webturbo"],
  ["wvx", "video/x-ms-wvx"],
  ["x3d", "model/x3d+xml"],
  ["x3db", "model/x3d+fastinfoset"],
  ["x3dbz", "model/x3d+binary"],
  ["x3dv", "model/x3d-vrml"],
  ["x3dvz", "model/x3d+vrml"],
  ["x3dz", "model/x3d+xml"],
  ["x32", "application/x-authorware-bin"],
  ["x_b", "model/vnd.parasolid.transmit.binary"],
  ["x_t", "model/vnd.parasolid.transmit.text"],
  ["xaml", "application/xaml+xml"],
  ["xap", "application/x-silverlight-app"],
  ["xar", "application/vnd.xara"],
  ["xav", "application/xcap-att+xml"],
  ["xbap", "application/x-ms-xbap"],
  ["xbd", "application/vnd.fujixerox.docuworks.binder"],
  ["xbm", "image/x-xbitmap"],
  ["xca", "application/xcap-caps+xml"],
  ["xcs", "application/calendar+xml"],
  ["xdf", "application/xcap-diff+xml"],
  ["xdm", "application/vnd.syncml.dm+xml"],
  ["xdp", "application/vnd.adobe.xdp+xml"],
  ["xdssc", "application/dssc+xml"],
  ["xdw", "application/vnd.fujixerox.docuworks"],
  ["xel", "application/xcap-el+xml"],
  ["xenc", "application/xenc+xml"],
  ["xer", "application/patch-ops-error+xml"],
  ["xfdf", "application/vnd.adobe.xfdf"],
  ["xfdl", "application/vnd.xfdl"],
  ["xht", "application/xhtml+xml"],
  ["xhtml", "application/xhtml+xml"],
  ["xhvml", "application/xv+xml"],
  ["xif", "image/vnd.xiff"],
  ["xl", "application/excel"],
  ["xla", "application/vnd.ms-excel"],
  ["xlam", "application/vnd.ms-excel.addin.macroEnabled.12"],
  ["xlc", "application/vnd.ms-excel"],
  ["xlf", "application/xliff+xml"],
  ["xlm", "application/vnd.ms-excel"],
  ["xls", "application/vnd.ms-excel"],
  ["xlsb", "application/vnd.ms-excel.sheet.binary.macroEnabled.12"],
  ["xlsm", "application/vnd.ms-excel.sheet.macroEnabled.12"],
  ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ["xlt", "application/vnd.ms-excel"],
  ["xltm", "application/vnd.ms-excel.template.macroEnabled.12"],
  ["xltx", "application/vnd.openxmlformats-officedocument.spreadsheetml.template"],
  ["xlw", "application/vnd.ms-excel"],
  ["xm", "audio/xm"],
  ["xml", "application/xml"],
  ["xns", "application/xcap-ns+xml"],
  ["xo", "application/vnd.olpc-sugar"],
  ["xop", "application/xop+xml"],
  ["xpi", "application/x-xpinstall"],
  ["xpl", "application/xproc+xml"],
  ["xpm", "image/x-xpixmap"],
  ["xpr", "application/vnd.is-xpr"],
  ["xps", "application/vnd.ms-xpsdocument"],
  ["xpw", "application/vnd.intercon.formnet"],
  ["xpx", "application/vnd.intercon.formnet"],
  ["xsd", "application/xml"],
  ["xsl", "application/xml"],
  ["xslt", "application/xslt+xml"],
  ["xsm", "application/vnd.syncml+xml"],
  ["xspf", "application/xspf+xml"],
  ["xul", "application/vnd.mozilla.xul+xml"],
  ["xvm", "application/xv+xml"],
  ["xvml", "application/xv+xml"],
  ["xwd", "image/x-xwindowdump"],
  ["xyz", "chemical/x-xyz"],
  ["xz", "application/x-xz"],
  ["yaml", "text/yaml"],
  ["yang", "application/yang"],
  ["yin", "application/yin+xml"],
  ["yml", "text/yaml"],
  ["ymp", "text/x-suse-ymp"],
  ["z", "application/x-compress"],
  ["z1", "application/x-zmachine"],
  ["z2", "application/x-zmachine"],
  ["z3", "application/x-zmachine"],
  ["z4", "application/x-zmachine"],
  ["z5", "application/x-zmachine"],
  ["z6", "application/x-zmachine"],
  ["z7", "application/x-zmachine"],
  ["z8", "application/x-zmachine"],
  ["zaz", "application/vnd.zzazz.deck+xml"],
  ["zip", "application/zip"],
  ["zir", "application/vnd.zul"],
  ["zirz", "application/vnd.zul"],
  ["zmm", "application/vnd.handheld-entertainment+xml"],
  ["zsh", "text/x-scriptzsh"]
]);
function be(e, t, a) {
  const n = _a(e), { webkitRelativePath: o } = e, r = typeof t == "string" ? t : typeof o == "string" && o.length > 0 ? o : `./${e.name}`;
  return typeof n.path != "string" && yt(n, "path", r), yt(n, "relativePath", r), n;
}
function _a(e) {
  const { name: t } = e;
  if (t && t.lastIndexOf(".") !== -1 && !e.type) {
    const n = t.split(".").pop().toLowerCase(), o = Sa.get(n);
    o && Object.defineProperty(e, "type", {
      value: o,
      writable: !1,
      configurable: !1,
      enumerable: !0
    });
  }
  return e;
}
function yt(e, t, a) {
  Object.defineProperty(e, t, {
    value: a,
    writable: !1,
    configurable: !1,
    enumerable: !0
  });
}
const Oa = [
  // Thumbnail cache files for macOS and Windows
  ".DS_Store",
  // macOs
  "Thumbs.db"
  // Windows
];
function Ra(e) {
  return xe(this, void 0, void 0, function* () {
    return Te(e) && Aa(e.dataTransfer) ? Pa(e.dataTransfer, e.type) : Ta(e) ? Da(e) : Array.isArray(e) && e.every((t) => "getFile" in t && typeof t.getFile == "function") ? Ma(e) : [];
  });
}
function Aa(e) {
  return Te(e);
}
function Ta(e) {
  return Te(e) && Te(e.target);
}
function Te(e) {
  return typeof e == "object" && e !== null;
}
function Da(e) {
  return Qe(e.target.files).map((t) => be(t));
}
function Ma(e) {
  return xe(this, void 0, void 0, function* () {
    return (yield Promise.all(e.map((a) => a.getFile()))).map((a) => be(a));
  });
}
function Pa(e, t) {
  return xe(this, void 0, void 0, function* () {
    if (e.items) {
      const a = Qe(e.items).filter((o) => o.kind === "file");
      if (t !== "drop")
        return a;
      const n = yield Promise.all(a.map(Na));
      return wt(It(n));
    }
    return wt(Qe(e.files).map((a) => be(a)));
  });
}
function wt(e) {
  return e.filter((t) => Oa.indexOf(t.name) === -1);
}
function Qe(e) {
  if (e === null)
    return [];
  const t = [];
  for (let a = 0; a < e.length; a++) {
    const n = e[a];
    t.push(n);
  }
  return t;
}
function Na(e) {
  if (typeof e.webkitGetAsEntry != "function")
    return jt(e);
  const t = e.webkitGetAsEntry();
  return t && t.isDirectory ? Lt(t) : jt(e, t);
}
function It(e) {
  return e.reduce((t, a) => [
    ...t,
    ...Array.isArray(a) ? It(a) : [a]
  ], []);
}
function jt(e, t) {
  return xe(this, void 0, void 0, function* () {
    var a;
    if (globalThis.isSecureContext && typeof e.getAsFileSystemHandle == "function") {
      const r = yield e.getAsFileSystemHandle();
      if (r === null)
        throw new Error(`${e} is not a File`);
      if (r !== void 0) {
        const p = yield r.getFile();
        return p.handle = r, be(p);
      }
    }
    const n = e.getAsFile();
    if (!n)
      throw new Error(`${e} is not a File`);
    return be(n, (a = t?.fullPath) !== null && a !== void 0 ? a : void 0);
  });
}
function za(e) {
  return xe(this, void 0, void 0, function* () {
    return e.isDirectory ? Lt(e) : Fa(e);
  });
}
function Lt(e) {
  const t = e.createReader();
  return new Promise((a, n) => {
    const o = [];
    function r() {
      t.readEntries((p) => xe(this, void 0, void 0, function* () {
        if (p.length) {
          const m = Promise.all(p.map(za));
          o.push(m), r();
        } else
          try {
            const m = yield Promise.all(o);
            a(m);
          } catch (m) {
            n(m);
          }
      }), (p) => {
        n(p);
      });
    }
    r();
  });
}
function Fa(e) {
  return xe(this, void 0, void 0, function* () {
    return new Promise((t, a) => {
      e.file((n) => {
        const o = be(n, e.fullPath);
        t(o);
      }, (n) => {
        a(n);
      });
    });
  });
}
var Oe = {}, kt;
function Ia() {
  return kt || (kt = 1, Oe.__esModule = !0, Oe.default = function(e, t) {
    if (e && t) {
      var a = Array.isArray(t) ? t : t.split(",");
      if (a.length === 0)
        return !0;
      var n = e.name || "", o = (e.type || "").toLowerCase(), r = o.replace(/\/.*$/, "");
      return a.some(function(p) {
        var m = p.trim().toLowerCase();
        return m.charAt(0) === "." ? n.toLowerCase().endsWith(m) : m.endsWith("/*") ? r === m.replace(/\/.*$/, "") : o === m;
      });
    }
    return !0;
  }), Oe;
}
var La = Ia();
const Je = /* @__PURE__ */ Pt(La);
function Ct(e) {
  return $a(e) || Ha(e) || Ht(e) || qa();
}
function qa() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ha(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function $a(e) {
  if (Array.isArray(e)) return et(e);
}
function Et(e, t) {
  var a = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), a.push.apply(a, n);
  }
  return a;
}
function St(e) {
  for (var t = 1; t < arguments.length; t++) {
    var a = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Et(Object(a), !0).forEach(function(n) {
      qt(e, n, a[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : Et(Object(a)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(a, n));
    });
  }
  return e;
}
function qt(e, t, a) {
  return t in e ? Object.defineProperty(e, t, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = a, e;
}
function je(e, t) {
  return Ba(e) || Va(e, t) || Ht(e, t) || Wa();
}
function Wa() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ht(e, t) {
  if (e) {
    if (typeof e == "string") return et(e, t);
    var a = Object.prototype.toString.call(e).slice(8, -1);
    if (a === "Object" && e.constructor && (a = e.constructor.name), a === "Map" || a === "Set") return Array.from(e);
    if (a === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)) return et(e, t);
  }
}
function et(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var a = 0, n = new Array(t); a < t; a++)
    n[a] = e[a];
  return n;
}
function Va(e, t) {
  var a = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (a != null) {
    var n = [], o = !0, r = !1, p, m;
    try {
      for (a = a.call(e); !(o = (p = a.next()).done) && (n.push(p.value), !(t && n.length === t)); o = !0)
        ;
    } catch (C) {
      r = !0, m = C;
    } finally {
      try {
        !o && a.return != null && a.return();
      } finally {
        if (r) throw m;
      }
    }
    return n;
  }
}
function Ba(e) {
  if (Array.isArray(e)) return e;
}
var Ua = typeof Je == "function" ? Je : Je.default, Ka = "file-invalid-type", Ya = "file-too-large", Za = "file-too-small", Ga = "too-many-files", Ja = function() {
  var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", a = t.split(","), n = a.length > 1 ? "one of ".concat(a.join(", ")) : a[0];
  return {
    code: Ka,
    message: "File type must be ".concat(n)
  };
}, _t = function(t) {
  return {
    code: Ya,
    message: "File is larger than ".concat(t, " ").concat(t === 1 ? "byte" : "bytes")
  };
}, Ot = function(t) {
  return {
    code: Za,
    message: "File is smaller than ".concat(t, " ").concat(t === 1 ? "byte" : "bytes")
  };
}, Xa = {
  code: Ga,
  message: "Too many files"
};
function $t(e, t) {
  var a = e.type === "application/x-moz-file" || Ua(e, t);
  return [a, a ? null : Ja(t)];
}
function Wt(e, t, a) {
  if (ve(e.size))
    if (ve(t) && ve(a)) {
      if (e.size > a) return [!1, _t(a)];
      if (e.size < t) return [!1, Ot(t)];
    } else {
      if (ve(t) && e.size < t) return [!1, Ot(t)];
      if (ve(a) && e.size > a) return [!1, _t(a)];
    }
  return [!0, null];
}
function ve(e) {
  return e != null;
}
function Qa(e) {
  var t = e.files, a = e.accept, n = e.minSize, o = e.maxSize, r = e.multiple, p = e.maxFiles, m = e.validator;
  return !r && t.length > 1 || r && p >= 1 && t.length > p ? !1 : t.every(function(C) {
    var O = $t(C, a), E = je(O, 1), g = E[0], j = Wt(C, n, o), k = je(j, 1), D = k[0], _ = m ? m(C) : null;
    return g && D && !_;
  });
}
function De(e) {
  return typeof e.isPropagationStopped == "function" ? e.isPropagationStopped() : typeof e.cancelBubble < "u" ? e.cancelBubble : !1;
}
function Re(e) {
  return e.dataTransfer ? Array.prototype.some.call(e.dataTransfer.types, function(t) {
    return t === "Files" || t === "application/x-moz-file";
  }) : !!e.target && !!e.target.files;
}
function Rt(e) {
  e.preventDefault();
}
function ei(e) {
  return e.indexOf("MSIE") !== -1 || e.indexOf("Trident/") !== -1;
}
function ti(e) {
  return e.indexOf("Edge/") !== -1;
}
function ai() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : window.navigator.userAgent;
  return ei(e) || ti(e);
}
function me() {
  for (var e = arguments.length, t = new Array(e), a = 0; a < e; a++)
    t[a] = arguments[a];
  return function(n) {
    for (var o = arguments.length, r = new Array(o > 1 ? o - 1 : 0), p = 1; p < o; p++)
      r[p - 1] = arguments[p];
    return t.some(function(m) {
      return !De(n) && m && m.apply(void 0, [n].concat(r)), De(n);
    });
  };
}
function ii() {
  return "showOpenFilePicker" in window;
}
function ni(e) {
  if (ve(e)) {
    var t = Object.entries(e).filter(function(a) {
      var n = je(a, 2), o = n[0], r = n[1], p = !0;
      return Vt(o) || (console.warn('Skipped "'.concat(o, '" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.')), p = !1), (!Array.isArray(r) || !r.every(Bt)) && (console.warn('Skipped "'.concat(o, '" because an invalid file extension was provided.')), p = !1), p;
    }).reduce(function(a, n) {
      var o = je(n, 2), r = o[0], p = o[1];
      return St(St({}, a), {}, qt({}, r, p));
    }, {});
    return [{
      // description is required due to https://crbug.com/1264708
      description: "Files",
      accept: t
    }];
  }
  return e;
}
function oi(e) {
  if (ve(e))
    return Object.entries(e).reduce(function(t, a) {
      var n = je(a, 2), o = n[0], r = n[1];
      return [].concat(Ct(t), [o], Ct(r));
    }, []).filter(function(t) {
      return Vt(t) || Bt(t);
    }).join(",");
}
function ri(e) {
  return e instanceof DOMException && (e.name === "AbortError" || e.code === e.ABORT_ERR);
}
function si(e) {
  return e instanceof DOMException && (e.name === "SecurityError" || e.code === e.SECURITY_ERR);
}
function Vt(e) {
  return e === "audio/*" || e === "video/*" || e === "image/*" || e === "text/*" || e === "application/*" || /\w+\/[-+.\w]+/g.test(e);
}
function Bt(e) {
  return /^.*\.[\w]+$/.test(e);
}
var li = ["children"], ci = ["open"], pi = ["refKey", "role", "onKeyDown", "onFocus", "onBlur", "onClick", "onDragEnter", "onDragOver", "onDragLeave", "onDrop"], di = ["refKey", "onChange", "onClick"];
function ui(e) {
  return vi(e) || fi(e) || Ut(e) || mi();
}
function mi() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function fi(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function vi(e) {
  if (Array.isArray(e)) return tt(e);
}
function Xe(e, t) {
  return gi(e) || hi(e, t) || Ut(e, t) || xi();
}
function xi() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ut(e, t) {
  if (e) {
    if (typeof e == "string") return tt(e, t);
    var a = Object.prototype.toString.call(e).slice(8, -1);
    if (a === "Object" && e.constructor && (a = e.constructor.name), a === "Map" || a === "Set") return Array.from(e);
    if (a === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)) return tt(e, t);
  }
}
function tt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var a = 0, n = new Array(t); a < t; a++)
    n[a] = e[a];
  return n;
}
function hi(e, t) {
  var a = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (a != null) {
    var n = [], o = !0, r = !1, p, m;
    try {
      for (a = a.call(e); !(o = (p = a.next()).done) && (n.push(p.value), !(t && n.length === t)); o = !0)
        ;
    } catch (C) {
      r = !0, m = C;
    } finally {
      try {
        !o && a.return != null && a.return();
      } finally {
        if (r) throw m;
      }
    }
    return n;
  }
}
function gi(e) {
  if (Array.isArray(e)) return e;
}
function At(e, t) {
  var a = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), a.push.apply(a, n);
  }
  return a;
}
function B(e) {
  for (var t = 1; t < arguments.length; t++) {
    var a = arguments[t] != null ? arguments[t] : {};
    t % 2 ? At(Object(a), !0).forEach(function(n) {
      at(e, n, a[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : At(Object(a)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(a, n));
    });
  }
  return e;
}
function at(e, t, a) {
  return t in e ? Object.defineProperty(e, t, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = a, e;
}
function Me(e, t) {
  if (e == null) return {};
  var a = bi(e, t), n, o;
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    for (o = 0; o < r.length; o++)
      n = r[o], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (a[n] = e[n]);
  }
  return a;
}
function bi(e, t) {
  if (e == null) return {};
  var a = {}, n = Object.keys(e), o, r;
  for (r = 0; r < n.length; r++)
    o = n[r], !(t.indexOf(o) >= 0) && (a[o] = e[o]);
  return a;
}
var ot = /* @__PURE__ */ c.forwardRef(function(e, t) {
  var a = e.children, n = Me(e, li), o = Yt(n), r = o.open, p = Me(o, ci);
  return c.useImperativeHandle(t, function() {
    return {
      open: r
    };
  }, [r]), /* @__PURE__ */ na.createElement(c.Fragment, null, a(B(B({}, p), {}, {
    open: r
  })));
});
ot.displayName = "Dropzone";
var Kt = {
  disabled: !1,
  getFilesFromEvent: Ra,
  maxSize: 1 / 0,
  minSize: 0,
  multiple: !0,
  maxFiles: 0,
  preventDropOnDocument: !0,
  noClick: !1,
  noKeyboard: !1,
  noDrag: !1,
  noDragEventsBubbling: !1,
  validator: null,
  useFsAccessApi: !1,
  autoFocus: !1
};
ot.defaultProps = Kt;
ot.propTypes = {
  /**
   * Render function that exposes the dropzone state and prop getter fns
   *
   * @param {object} params
   * @param {Function} params.getRootProps Returns the props you should apply to the root drop container you render
   * @param {Function} params.getInputProps Returns the props you should apply to hidden file input you render
   * @param {Function} params.open Open the native file selection dialog
   * @param {boolean} params.isFocused Dropzone area is in focus
   * @param {boolean} params.isFileDialogActive File dialog is opened
   * @param {boolean} params.isDragActive Active drag is in progress
   * @param {boolean} params.isDragAccept Dragged files are accepted
   * @param {boolean} params.isDragReject Some dragged files are rejected
   * @param {File[]} params.acceptedFiles Accepted files
   * @param {FileRejection[]} params.fileRejections Rejected files and why they were rejected
   */
  children: $.func,
  /**
   * Set accepted file types.
   * Checkout https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker types option for more information.
   * Keep in mind that mime type determination is not reliable across platforms. CSV files,
   * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
   * Windows. In some cases there might not be a mime type set at all (https://github.com/react-dropzone/react-dropzone/issues/276).
   */
  accept: $.objectOf($.arrayOf($.string)),
  /**
   * Allow drag 'n' drop (or selection from the file dialog) of multiple files
   */
  multiple: $.bool,
  /**
   * If false, allow dropped items to take over the current browser window
   */
  preventDropOnDocument: $.bool,
  /**
   * If true, disables click to open the native file selection dialog
   */
  noClick: $.bool,
  /**
   * If true, disables SPACE/ENTER to open the native file selection dialog.
   * Note that it also stops tracking the focus state.
   */
  noKeyboard: $.bool,
  /**
   * If true, disables drag 'n' drop
   */
  noDrag: $.bool,
  /**
   * If true, stops drag event propagation to parents
   */
  noDragEventsBubbling: $.bool,
  /**
   * Minimum file size (in bytes)
   */
  minSize: $.number,
  /**
   * Maximum file size (in bytes)
   */
  maxSize: $.number,
  /**
   * Maximum accepted number of files
   * The default value is 0 which means there is no limitation to how many files are accepted.
   */
  maxFiles: $.number,
  /**
   * Enable/disable the dropzone
   */
  disabled: $.bool,
  /**
   * Use this to provide a custom file aggregator
   *
   * @param {(DragEvent|Event|Array<FileSystemFileHandle>)} event A drag event or input change event (if files were selected via the file dialog)
   */
  getFilesFromEvent: $.func,
  /**
   * Cb for when closing the file dialog with no selection
   */
  onFileDialogCancel: $.func,
  /**
   * Cb for when opening the file dialog
   */
  onFileDialogOpen: $.func,
  /**
   * Set to true to use the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
   * to open the file picker instead of using an `<input type="file">` click event.
   */
  useFsAccessApi: $.bool,
  /**
   * Set to true to focus the root element on render
   */
  autoFocus: $.bool,
  /**
   * Cb for when the `dragenter` event occurs.
   *
   * @param {DragEvent} event
   */
  onDragEnter: $.func,
  /**
   * Cb for when the `dragleave` event occurs
   *
   * @param {DragEvent} event
   */
  onDragLeave: $.func,
  /**
   * Cb for when the `dragover` event occurs
   *
   * @param {DragEvent} event
   */
  onDragOver: $.func,
  /**
   * Cb for when the `drop` event occurs.
   * Note that this callback is invoked after the `getFilesFromEvent` callback is done.
   *
   * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
   * `accept` must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) or a valid file extension.
   * If `multiple` is set to false and additional files are dropped,
   * all files besides the first will be rejected.
   * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
   *
   * Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
   * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
   *
   * `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
   * For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
   *
   * ```js
   * function onDrop(acceptedFiles) {
   *   const req = request.post('/upload')
   *   acceptedFiles.forEach(file => {
   *     req.attach(file.name, file)
   *   })
   *   req.end(callback)
   * }
   * ```
   *
   * @param {File[]} acceptedFiles
   * @param {FileRejection[]} fileRejections
   * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
   */
  onDrop: $.func,
  /**
   * Cb for when the `drop` event occurs.
   * Note that if no files are accepted, this callback is not invoked.
   *
   * @param {File[]} files
   * @param {(DragEvent|Event)} event
   */
  onDropAccepted: $.func,
  /**
   * Cb for when the `drop` event occurs.
   * Note that if no files are rejected, this callback is not invoked.
   *
   * @param {FileRejection[]} fileRejections
   * @param {(DragEvent|Event)} event
   */
  onDropRejected: $.func,
  /**
   * Cb for when there's some error from any of the promises.
   *
   * @param {Error} error
   */
  onError: $.func,
  /**
   * Custom validation function. It must return null if there's no errors.
   * @param {File} file
   * @returns {FileError|FileError[]|null}
   */
  validator: $.func
};
var it = {
  isFocused: !1,
  isFileDialogActive: !1,
  isDragActive: !1,
  isDragAccept: !1,
  isDragReject: !1,
  acceptedFiles: [],
  fileRejections: []
};
function Yt() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = B(B({}, Kt), e), a = t.accept, n = t.disabled, o = t.getFilesFromEvent, r = t.maxSize, p = t.minSize, m = t.multiple, C = t.maxFiles, O = t.onDragEnter, E = t.onDragLeave, g = t.onDragOver, j = t.onDrop, k = t.onDropAccepted, D = t.onDropRejected, _ = t.onFileDialogCancel, P = t.onFileDialogOpen, z = t.useFsAccessApi, te = t.autoFocus, H = t.preventDropOnDocument, W = t.noClick, f = t.noKeyboard, X = t.noDrag, F = t.noDragEventsBubbling, ne = t.onError, V = t.validator, M = c.useMemo(function() {
    return oi(a);
  }, [a]), oe = c.useMemo(function() {
    return ni(a);
  }, [a]), pe = c.useMemo(function() {
    return typeof P == "function" ? P : Tt;
  }, [P]), ae = c.useMemo(function() {
    return typeof _ == "function" ? _ : Tt;
  }, [_]), N = c.useRef(null), Y = c.useRef(null), Z = c.useReducer(yi, it), ie = Xe(Z, 2), re = ie[0], U = ie[1], s = re.isFocused, d = re.isFileDialogActive, w = c.useRef(typeof window < "u" && window.isSecureContext && z && ii()), v = function() {
    !w.current && d && setTimeout(function() {
      if (Y.current) {
        var T = Y.current.files;
        T.length || (U({
          type: "closeDialog"
        }), ae());
      }
    }, 300);
  };
  c.useEffect(function() {
    return window.addEventListener("focus", v, !1), function() {
      window.removeEventListener("focus", v, !1);
    };
  }, [Y, d, ae, w]);
  var R = c.useRef([]), A = function(T) {
    N.current && N.current.contains(T.target) || (T.preventDefault(), R.current = []);
  };
  c.useEffect(function() {
    return H && (document.addEventListener("dragover", Rt, !1), document.addEventListener("drop", A, !1)), function() {
      H && (document.removeEventListener("dragover", Rt), document.removeEventListener("drop", A));
    };
  }, [N, H]), c.useEffect(function() {
    return !n && te && N.current && N.current.focus(), function() {
    };
  }, [N, te, n]);
  var y = c.useCallback(function(x) {
    ne ? ne(x) : console.error(x);
  }, [ne]), l = c.useCallback(function(x) {
    x.preventDefault(), x.persist(), ke(x), R.current = [].concat(ui(R.current), [x.target]), Re(x) && Promise.resolve(o(x)).then(function(T) {
      if (!(De(x) && !F)) {
        var J = T.length, ee = J > 0 && Qa({
          files: T,
          accept: M,
          minSize: p,
          maxSize: r,
          multiple: m,
          maxFiles: C,
          validator: V
        }), ce = J > 0 && !ee;
        U({
          isDragAccept: ee,
          isDragReject: ce,
          isDragActive: !0,
          type: "setDraggedFiles"
        }), O && O(x);
      }
    }).catch(function(T) {
      return y(T);
    });
  }, [o, O, y, F, M, p, r, m, C, V]), b = c.useCallback(function(x) {
    x.preventDefault(), x.persist(), ke(x);
    var T = Re(x);
    if (T && x.dataTransfer)
      try {
        x.dataTransfer.dropEffect = "copy";
      } catch {
      }
    return T && g && g(x), !1;
  }, [g, F]), h = c.useCallback(function(x) {
    x.preventDefault(), x.persist(), ke(x);
    var T = R.current.filter(function(ee) {
      return N.current && N.current.contains(ee);
    }), J = T.indexOf(x.target);
    J !== -1 && T.splice(J, 1), R.current = T, !(T.length > 0) && (U({
      type: "setDraggedFiles",
      isDragActive: !1,
      isDragAccept: !1,
      isDragReject: !1
    }), Re(x) && E && E(x));
  }, [N, E, F]), S = c.useCallback(function(x, T) {
    var J = [], ee = [];
    x.forEach(function(ce) {
      var ye = $t(ce, M), ge = Xe(ye, 2), Pe = ge[0], Ne = ge[1], ze = Wt(ce, p, r), Ce = Xe(ze, 2), Fe = Ce[0], Ie = Ce[1], Le = V ? V(ce) : null;
      if (Pe && Fe && !Le)
        J.push(ce);
      else {
        var qe = [Ne, Ie];
        Le && (qe = qe.concat(Le)), ee.push({
          file: ce,
          errors: qe.filter(function(Xt) {
            return Xt;
          })
        });
      }
    }), (!m && J.length > 1 || m && C >= 1 && J.length > C) && (J.forEach(function(ce) {
      ee.push({
        file: ce,
        errors: [Xa]
      });
    }), J.splice(0)), U({
      acceptedFiles: J,
      fileRejections: ee,
      isDragReject: ee.length > 0,
      type: "setFiles"
    }), j && j(J, ee, T), ee.length > 0 && D && D(ee, T), J.length > 0 && k && k(J, T);
  }, [U, m, M, p, r, C, j, k, D, V]), I = c.useCallback(function(x) {
    x.preventDefault(), x.persist(), ke(x), R.current = [], Re(x) && Promise.resolve(o(x)).then(function(T) {
      De(x) && !F || S(T, x);
    }).catch(function(T) {
      return y(T);
    }), U({
      type: "reset"
    });
  }, [o, S, y, F]), u = c.useCallback(function() {
    if (w.current) {
      U({
        type: "openDialog"
      }), pe();
      var x = {
        multiple: m,
        types: oe
      };
      window.showOpenFilePicker(x).then(function(T) {
        return o(T);
      }).then(function(T) {
        S(T, null), U({
          type: "closeDialog"
        });
      }).catch(function(T) {
        ri(T) ? (ae(T), U({
          type: "closeDialog"
        })) : si(T) ? (w.current = !1, Y.current ? (Y.current.value = null, Y.current.click()) : y(new Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."))) : y(T);
      });
      return;
    }
    Y.current && (U({
      type: "openDialog"
    }), pe(), Y.current.value = null, Y.current.click());
  }, [U, pe, ae, z, S, y, oe, m]), K = c.useCallback(function(x) {
    !N.current || !N.current.isEqualNode(x.target) || (x.key === " " || x.key === "Enter" || x.keyCode === 32 || x.keyCode === 13) && (x.preventDefault(), u());
  }, [N, u]), G = c.useCallback(function() {
    U({
      type: "focus"
    });
  }, []), le = c.useCallback(function() {
    U({
      type: "blur"
    });
  }, []), se = c.useCallback(function() {
    W || (ai() ? setTimeout(u, 0) : u());
  }, [W, u]), Q = function(T) {
    return n ? null : T;
  }, de = function(T) {
    return f ? null : Q(T);
  }, he = function(T) {
    return X ? null : Q(T);
  }, ke = function(T) {
    F && T.stopPropagation();
  }, Zt = c.useMemo(function() {
    return function() {
      var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, T = x.refKey, J = T === void 0 ? "ref" : T, ee = x.role, ce = x.onKeyDown, ye = x.onFocus, ge = x.onBlur, Pe = x.onClick, Ne = x.onDragEnter, ze = x.onDragOver, Ce = x.onDragLeave, Fe = x.onDrop, Ie = Me(x, pi);
      return B(B(at({
        onKeyDown: de(me(ce, K)),
        onFocus: de(me(ye, G)),
        onBlur: de(me(ge, le)),
        onClick: Q(me(Pe, se)),
        onDragEnter: he(me(Ne, l)),
        onDragOver: he(me(ze, b)),
        onDragLeave: he(me(Ce, h)),
        onDrop: he(me(Fe, I)),
        role: typeof ee == "string" && ee !== "" ? ee : "presentation"
      }, J, N), !n && !f ? {
        tabIndex: 0
      } : {}), Ie);
    };
  }, [N, K, G, le, se, l, b, h, I, f, X, n]), Gt = c.useCallback(function(x) {
    x.stopPropagation();
  }, []), Jt = c.useMemo(function() {
    return function() {
      var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, T = x.refKey, J = T === void 0 ? "ref" : T, ee = x.onChange, ce = x.onClick, ye = Me(x, di), ge = at({
        accept: M,
        multiple: m,
        type: "file",
        style: {
          border: 0,
          clip: "rect(0, 0, 0, 0)",
          clipPath: "inset(50%)",
          height: "1px",
          margin: "0 -1px -1px 0",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          width: "1px",
          whiteSpace: "nowrap"
        },
        onChange: Q(me(ee, I)),
        onClick: Q(me(ce, Gt)),
        tabIndex: -1
      }, J, Y);
      return B(B({}, ge), ye);
    };
  }, [Y, a, m, I, n]);
  return B(B({}, re), {}, {
    isFocused: s && !n,
    getRootProps: Zt,
    getInputProps: Jt,
    rootRef: N,
    inputRef: Y,
    open: Q(u)
  });
}
function yi(e, t) {
  switch (t.type) {
    case "focus":
      return B(B({}, e), {}, {
        isFocused: !0
      });
    case "blur":
      return B(B({}, e), {}, {
        isFocused: !1
      });
    case "openDialog":
      return B(B({}, it), {}, {
        isFileDialogActive: !0
      });
    case "closeDialog":
      return B(B({}, e), {}, {
        isFileDialogActive: !1
      });
    case "setDraggedFiles":
      return B(B({}, e), {}, {
        isDragActive: t.isDragActive,
        isDragAccept: t.isDragAccept,
        isDragReject: t.isDragReject
      });
    case "setFiles":
      return B(B({}, e), {}, {
        acceptedFiles: t.acceptedFiles,
        fileRejections: t.fileRejections,
        isDragReject: t.isDragReject
      });
    case "reset":
      return B({}, it);
    default:
      return e;
  }
}
function Tt() {
}
const wi = ({ onFileSelect: e, accept: t = "video/*" }) => {
  const a = c.useCallback((p) => {
    p && p.length > 0 && e(p[0]);
  }, [e]), { getRootProps: n, getInputProps: o, isDragActive: r } = Yt({
    onDrop: a,
    accept: {
      [t]: []
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024
    // 100MB
  });
  return /* @__PURE__ */ i.jsxs(
    "div",
    {
      ...n(),
      role: "button",
      tabIndex: 0,
      "aria-label": "上传评估视频",
      "aria-describedby": "upload-help",
      className: `flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${r ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`,
      onKeyDown: (p) => {
        (p.key === "Enter" || p.key === " ") && p.preventDefault();
      },
      children: [
        /* @__PURE__ */ i.jsx("input", { ...o() }),
        /* @__PURE__ */ i.jsxs("div", { id: "upload-help", className: "flex flex-col items-center justify-center pt-5 pb-6", children: [
          /* @__PURE__ */ i.jsx(
            "svg",
            {
              className: "w-8 h-8 mb-4 text-gray-500",
              "aria-hidden": "true",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 20 16",
              children: /* @__PURE__ */ i.jsx(
                "path",
                {
                  stroke: "currentColor",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                }
              )
            }
          ),
          r ? /* @__PURE__ */ i.jsx("p", { className: "mb-2 text-sm text-gray-500", children: /* @__PURE__ */ i.jsx("span", { className: "font-semibold", children: "松开鼠标以上传文件" }) }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
            /* @__PURE__ */ i.jsxs("p", { className: "mb-2 text-sm text-gray-500", children: [
              /* @__PURE__ */ i.jsx("span", { className: "font-semibold", children: "点击选择" }),
              " 或拖拽到此处"
            ] }),
            /* @__PURE__ */ i.jsx("p", { className: "text-xs text-gray-500", children: "支持 MP4、AVI、MOV（最大 100MB）" })
          ] })
        ] })
      ]
    }
  );
}, ji = () => {
  const [e, t] = c.useState({});
  return {
    checkPermission: async (r) => e[r] || { granted: !1, canRequestAgain: !0 },
    requestPermission: async (r) => {
      const p = { granted: !0, canRequestAgain: !0 };
      return t((m) => ({ ...m, [r]: p })), p;
    },
    openAppSettings: async () => {
      try {
        window.Capacitor ? await (await import("./PermissionHelper-CnofyQXJ.mjs")).default.openAppSettings() : alert("请在浏览器设置中手动授予摄像头权限");
      } catch (r) {
        console.error("Failed to open app settings:", r), alert("无法自动打开设置页面，请手动在系统设置中授予摄像头权限");
      }
    }
  };
}, ki = ({
  onCapture: e,
  onError: t,
  keypoints: a = [],
  onVideoFrame: n,
  showSkeleton: o = !0,
  skeletonColor: r = "#8faa9d",
  // 更改为温和的绿灰色
  skeletonLineColor: p = "#a8c4b8"
  // 更改为中绿灰色
}) => {
  const {
    keypoints: m,
    isProcessing: C,
    isModelLoading: O,
    processFrame: E
  } = Nt(), { openAppSettings: g } = ji(), j = c.useRef(null), k = c.useRef(null), D = c.useRef(null), _ = c.useRef(0), P = c.useRef(0), z = c.useRef(100), te = c.useRef(0), H = c.useRef(0), W = c.useRef(0), f = c.useRef(0), X = c.useRef([]), [F, ne] = c.useState({ width: 0, height: 0 }), {
    videoRef: V,
    status: M,
    errorMessage: oe,
    requestPermission: pe,
    reloadCamera: ae
  } = oa(), N = a && a.length > 0 ? a : m;
  c.useEffect(() => {
    if (V.current && M === "active") {
      const s = () => {
        V.current && ne({
          width: V.current.videoWidth,
          height: V.current.videoHeight
        });
      };
      return s(), window.addEventListener("resize", s), () => window.removeEventListener("resize", s);
    }
  }, [M]), c.useEffect(() => {
    if (k.current && F.width > 0 && F.height > 0) {
      const s = k.current;
      s.width = F.width, s.height = F.height;
      const d = s.parentElement;
      if (d) {
        const w = d.getBoundingClientRect();
        s.style.width = `${w.width}px`, s.style.height = `${w.height}px`;
      }
    }
  }, [F]), c.useEffect(() => {
    console.log("CameraCapture收到的关键点数量:", N.length), N.length > 0 && console.log("关键点示例:", N.slice(0, 3));
  }, [N]);
  const Y = c.useCallback(() => {
    if (!o)
      return;
    const s = Date.now(), d = s - te.current;
    if (d < z.current)
      return;
    if (H.current++, s - W.current >= 1e3) {
      const A = H.current;
      H.current = 0, W.current = s, A < 20 ? z.current = Math.min(z.current + 5, 200) : A > 30 && (z.current = Math.max(z.current - 5, 30)), f.current = d;
    }
    if (te.current = s, !k.current || M !== "active")
      return;
    const w = k.current, v = w.getContext("2d");
    if (!v) {
      console.error("无法获取Canvas上下文");
      return;
    }
    if (!(N.length > 0 && (N.length !== X.current.length || JSON.stringify(N) !== JSON.stringify(X.current))) && w.width > 0 && w.height > 0 || (v.clearRect(0, 0, w.width, w.height), X.current = [...N]), N.length > 0 && w.width > 0 && w.height > 0) {
      const A = new Map(N.map((y) => [y.name, y]));
      try {
        const y = [
          // 肩线
          ["left_shoulder", "right_shoulder"],
          ["leftShoulder", "rightShoulder"],
          // 手臂
          ["left_shoulder", "left_elbow"],
          ["leftShoulder", "leftElbow"],
          ["right_shoulder", "right_elbow"],
          ["rightShoulder", "rightElbow"],
          ["left_elbow", "left_wrist"],
          ["leftElbow", "leftWrist"],
          ["right_elbow", "right_wrist"],
          ["rightElbow", "rightWrist"],
          // 躯干
          ["left_shoulder", "left_hip"],
          ["leftShoulder", "leftHip"],
          ["right_shoulder", "right_hip"],
          ["rightShoulder", "rightHip"],
          ["left_hip", "right_hip"],
          ["leftHip", "rightHip"],
          // 腿部
          ["left_hip", "left_knee"],
          ["leftHip", "leftKnee"],
          ["right_hip", "right_knee"],
          ["rightHip", "rightKnee"],
          ["left_knee", "left_ankle"],
          ["leftKnee", "leftAnkle"],
          ["right_knee", "right_ankle"],
          ["rightKnee", "rightAnkle"]
        ];
        v.strokeStyle = p, v.lineWidth = 3, v.lineCap = "round", v.lineJoin = "round", y.forEach(([l, b]) => {
          const h = A.get(l) || A.get(l.replace("_", "")), S = A.get(b) || A.get(b.replace("_", ""));
          if (h && S) {
            const u = h.score !== void 0 ? h.score : 1, K = S.score !== void 0 ? S.score : 1;
            if (u >= 0.2 && K >= 0.2) {
              const G = Math.max(0, Math.min(1, h.x)) * w.width, le = Math.max(0, Math.min(1, h.y)) * w.height, se = Math.max(0, Math.min(1, S.x)) * w.width, Q = Math.max(0, Math.min(1, S.y)) * w.height, de = (u + K) / 2;
              v.globalAlpha = de, v.beginPath(), v.moveTo(G, le), v.lineTo(se, Q), v.stroke();
            }
          }
        }), v.globalAlpha = 1;
      } catch (y) {
        console.error("绘制骨架连接线时出错:", y);
      }
      try {
        N.forEach((y) => {
          const l = Math.max(0, Math.min(1, y.x)) * w.width, b = Math.max(0, Math.min(1, y.y)) * w.height, h = y.score !== void 0 ? y.score : 1, S = 5, I = S + h * S * 0.5, u = h;
          v.globalAlpha = u, v.beginPath(), v.arc(l, b, I + 2, 0, 2 * Math.PI), v.fillStyle = "#FFFFFF", v.fill(), v.beginPath(), v.arc(l, b, I, 0, 2 * Math.PI), v.fillStyle = r, v.fill(), y.score !== void 0 && y.score < 0.8 && (v.globalAlpha = 1, v.fillStyle = "#FFFFFF", v.font = "10px Arial", v.fillText(`${Math.round(y.score * 100)}%`, l + 8, b - 8));
        }), v.globalAlpha = 1;
      } catch (y) {
        console.error("绘制关键点时出错:", y), v.globalAlpha = 1;
      }
    }
  }, [N, M, o, r, p]), Z = c.useCallback(() => {
    if (!V.current || M !== "active") {
      _.current = requestAnimationFrame(Z);
      return;
    }
    const s = V.current, d = Date.now();
    d - P.current > 100 && (P.current = d, n && (console.log("调用onVideoFrame回调处理视频帧"), n(s)), (!a || a.length === 0) && s && !C && E(s)), _.current = requestAnimationFrame(Z);
  }, [M, n, a, C, E]);
  c.useEffect(() => (M === "active" && (console.log("摄像头激活，开始处理视频帧"), _.current = requestAnimationFrame(Z)), () => {
    _.current && cancelAnimationFrame(_.current);
  }), [M, Z]), c.useEffect(() => {
    O && console.log("姿态检测模型正在加载...");
  }, [O]), c.useEffect(() => {
    (M === "error" || M === "permission_denied" || M === "not_supported") && (console.error("摄像头状态错误:", M, oe), t && t(oe || "摄像头启动失败"));
  }, [M, oe, t]), c.useEffect(() => {
    let s;
    const d = () => {
      M === "active" && o && (Y(), s = requestAnimationFrame(d));
    };
    return M === "active" && o && (s = requestAnimationFrame(d)), () => {
      s && cancelAnimationFrame(s);
    };
  }, [M, o, Y]);
  const ie = c.useRef(void 0);
  c.useEffect(() => {
    const s = /* @__PURE__ */ (() => {
      let d = !1;
      return () => {
        M === "active" && k.current && (d || (d = !0, setTimeout(() => {
          V.current && (V.current && ne({
            width: V.current.videoWidth,
            height: V.current.videoHeight
          })), d = !1;
        }, 200)));
      };
    })();
    return window.addEventListener("resize", s), () => {
      window.removeEventListener("resize", s);
    };
  }, [M]), c.useEffect(() => () => {
    X.current = [], ie.current && cancelAnimationFrame(ie.current);
  }, []);
  const re = () => {
    if (!V.current || !j.current || M !== "active")
      return;
    const s = V.current, d = j.current;
    d.width = s.videoWidth, d.height = s.videoHeight;
    const w = d.getContext("2d");
    if (w) {
      w.drawImage(s, 0, 0, d.width, d.height);
      const v = d.toDataURL("image/jpeg");
      e(v);
    }
  }, U = async () => {
    await pe();
  };
  return /* @__PURE__ */ i.jsxs("div", { className: "w-full p-4", children: [
    /* @__PURE__ */ i.jsxs("div", { className: "relative bg-black rounded-xl overflow-hidden mb-6 shadow-lg border border-gray-200 transition-all hover:shadow-xl w-full", style: { minHeight: "70vh" }, children: [
      M === "loading" && /* @__PURE__ */ i.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-900", children: /* @__PURE__ */ i.jsxs("div", { className: "text-white text-center space-y-4 p-4", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ i.jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-400 mx-auto" }),
          /* @__PURE__ */ i.jsx("div", { className: "animate-ping absolute inset-0 rounded-full h-16 w-16 bg-indigo-500 opacity-20 mx-auto" })
        ] }),
        /* @__PURE__ */ i.jsx("h3", { className: "text-base sm:text-xl font-medium tracking-wide", children: "正在启动摄像头..." }),
        /* @__PURE__ */ i.jsx("p", { className: "text-gray-300 text-sm", children: "请确保您的设备已授予摄像头访问权限" })
      ] }) }),
      (M === "error" || M === "not_supported") && /* @__PURE__ */ i.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-red-50 p-4", children: /* @__PURE__ */ i.jsxs("div", { className: "text-center p-6 rounded-xl bg-white shadow-lg w-full max-w-md", children: [
        /* @__PURE__ */ i.jsx("div", { className: "text-red-500 text-5xl mb-4 animate-pulse", children: "❌" }),
        /* @__PURE__ */ i.jsx("h3", { className: "text-base sm:text-xl font-bold text-red-700 mb-2", children: "摄像头启动失败" }),
        /* @__PURE__ */ i.jsx("p", { className: "text-red-600 mb-4 text-sm", children: oe }),
        /* @__PURE__ */ i.jsx(
          "button",
          {
            onClick: ae,
            className: "w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 shadow-md min-h-[48px]",
            children: "🔄 重新加载"
          }
        )
      ] }) }),
      M === "permission_denied" && /* @__PURE__ */ i.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-yellow-50 p-4", children: /* @__PURE__ */ i.jsxs("div", { className: "text-center p-6 rounded-xl bg-white shadow-lg w-full max-w-md", children: [
        /* @__PURE__ */ i.jsx("div", { className: "text-yellow-500 text-5xl mb-4 animate-bounce", children: "⚠️" }),
        /* @__PURE__ */ i.jsx("h3", { className: "text-base sm:text-xl font-bold text-yellow-700 mb-2", children: "摄像头权限被拒绝" }),
        /* @__PURE__ */ i.jsx("p", { className: "text-yellow-600 mb-4 text-sm", children: oe }),
        /* @__PURE__ */ i.jsxs("div", { className: "flex flex-col gap-3 w-full", children: [
          /* @__PURE__ */ i.jsx(
            "button",
            {
              onClick: U,
              className: "w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 shadow-md min-h-[48px]",
              children: "🔒 请求权限"
            }
          ),
          /* @__PURE__ */ i.jsx(
            "button",
            {
              onClick: g,
              className: "w-full px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 shadow-md min-h-[48px]",
              children: "⚙️ 应用设置"
            }
          ),
          /* @__PURE__ */ i.jsx(
            "button",
            {
              onClick: ae,
              className: "w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 shadow-md min-h-[48px]",
              children: "🔄 重新加载"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ i.jsx(
        "video",
        {
          ref: V,
          className: M === "active" ? "w-full h-full object-cover block" : "w-full h-full object-cover hidden",
          style: { minHeight: "70vh" }
        }
      ),
      M === "active" && o && /* @__PURE__ */ i.jsx(
        "canvas",
        {
          ref: k,
          className: "absolute top-0 left-0 w-full h-full pointer-events-none z-10",
          style: { minHeight: "70vh" }
        }
      )
    ] }),
    M === "active" && /* @__PURE__ */ i.jsx("div", { className: "text-center", children: /* @__PURE__ */ i.jsx(
      "button",
      {
        onClick: re,
        className: "w-full max-w-xs px-10 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 shadow-md hover:shadow-lg min-h-[56px]",
        children: /* @__PURE__ */ i.jsx("span", { className: "flex items-center justify-center", children: "📊 开始评估" })
      }
    ) }),
    /* @__PURE__ */ i.jsx("canvas", { ref: j, className: "hidden" }),
    /* @__PURE__ */ i.jsx("canvas", { ref: D, className: "hidden" })
  ] });
}, Ae = ({
  message: e = "正在处理...",
  size: t = "medium"
}) => {
  const a = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16"
  }, n = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  };
  return /* @__PURE__ */ i.jsxs("div", { className: "flex flex-col items-center justify-center", children: [
    /* @__PURE__ */ i.jsx("div", { className: `animate-spin rounded-full ${a[t]} border-t-2 border-b-2 border-emerald-500 mb-4` }),
    /* @__PURE__ */ i.jsx("p", { className: `text-emerald-700 ${n[t]}`, children: e })
  ] });
}, Ci = () => xa({
  mutationFn: ra,
  onError: (t) => {
    console.error("Analysis failed:", t);
  }
}), Pi = ({ movementType: e = "general", movementName: t = "通用" }) => {
  const [a, n] = c.useState(null), [o, r] = c.useState(!1), [p, m] = c.useState(!1), [C, O] = c.useState(null), [E, g] = c.useState(null), [j, k] = c.useState("upload"), [D] = c.useState(""), [_, P] = c.useState(!1), z = c.useRef(null), te = c.useRef(null), H = [
    {
      id: "video-source",
      title: "选择视频来源",
      content: /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsx("p", { children: "您可以通过两种方式提供分析素材：" }),
        /* @__PURE__ */ i.jsxs("ul", { className: "list-disc pl-5 mt-1 space-y-1", children: [
          /* @__PURE__ */ i.jsx("li", { children: "上传视频 - 从您的设备上传预先录制的视频" }),
          /* @__PURE__ */ i.jsx("li", { children: "拍摄视频 - 使用您的摄像头实时录制动作" })
        ] }),
        /* @__PURE__ */ i.jsx("p", { className: "mt-2", children: "确保视频清晰，光线充足，且被评估者全身可见。" })
      ] }),
      placement: "bottom"
    },
    {
      id: "analyze",
      title: "开始分析",
      content: /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsx("p", { children: '视频加载完成后，点击"开始分析"按钮：' }),
        /* @__PURE__ */ i.jsxs("ul", { className: "list-disc pl-5 mt-1 space-y-1", children: [
          /* @__PURE__ */ i.jsx("li", { children: "系统将自动检测人体姿态关键点" }),
          /* @__PURE__ */ i.jsx("li", { children: "分析动作完成的质量和规范性" }),
          /* @__PURE__ */ i.jsx("li", { children: "生成详细的评分和改进建议" })
        ] }),
        /* @__PURE__ */ i.jsx("p", { className: "mt-2", children: "分析过程可能需要几秒钟，请耐心等待。" })
      ] }),
      placement: "top"
    },
    {
      id: "results",
      title: "查看分析结果",
      content: /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsx("p", { children: "分析完成后，您将看到：" }),
        /* @__PURE__ */ i.jsxs("ul", { className: "list-disc pl-5 mt-1 space-y-1", children: [
          /* @__PURE__ */ i.jsx("li", { children: "总体评分 - 基于动作标准的0-100分评分" }),
          /* @__PURE__ */ i.jsx("li", { children: "动作细节评估 - 各个关键部位的表现评分" }),
          /* @__PURE__ */ i.jsx("li", { children: "改进建议 - 针对性的康复训练建议" })
        ] }),
        /* @__PURE__ */ i.jsx("p", { className: "mt-2", children: "您可以保存这些结果用于后续的康复跟踪。" })
      ] }),
      placement: "top"
    }
  ], { mutate: W } = Ci();
  c.useEffect(() => {
    r(!0), localStorage.getItem("hasUsedAnalysisFeature") || setTimeout(() => {
      P(!0), localStorage.setItem("hasUsedAnalysisFeature", "true");
    }, 1e3);
  }, []), c.useEffect(() => {
    const l = document.createElement("style");
    return l.textContent = sa, document.head.appendChild(l), () => {
      document.head.removeChild(l);
    };
  }, []);
  const {
    keypoints: f,
    isProcessing: X,
    movementEvaluation: F,
    processFrame: ne,
    isModelLoading: V,
    error: M
  } = Nt(), [oe, pe] = c.useState(!1), ae = E ? "error" : M && !oe ? "poseError" : V ? "modelLoading" : X ? "poseProcessing" : p ? "analyzing" : null;
  c.useEffect(() => {
    M && console.error("姿态估计错误:", M);
  }, [M]);
  const N = c.useCallback((l) => {
    l && !X && ne(l, e);
  }, [X, ne, e]), Y = (l) => {
    n(l), g(null), O(null);
  }, [Z, ie] = c.useState(null), re = c.useRef(null), U = c.useRef(null);
  c.useEffect(() => {
    if (a) {
      const l = URL.createObjectURL(a);
      return ie(l), () => URL.revokeObjectURL(l);
    } else
      ie(null);
  }, [a]);
  const s = () => {
    const l = re.current;
    if (!l) return;
    const b = () => {
      l.paused || l.ended || (ne(l, e), requestAnimationFrame(b));
    };
    b();
  };
  c.useEffect(() => {
    const l = U.current, b = re.current;
    if (!l || !b) return;
    const h = l.getContext("2d");
    if (!h || (b.videoWidth > 0 && b.videoHeight > 0 && (l.width !== b.videoWidth || l.height !== b.videoHeight) && (l.width = b.videoWidth, l.height = b.videoHeight), h.clearRect(0, 0, l.width, l.height), !f || f.length === 0)) return;
    const S = "#8faa9d", I = "#a8c4b8", u = [
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_elbow"],
      ["left_elbow", "left_wrist"],
      ["right_shoulder", "right_elbow"],
      ["right_elbow", "right_wrist"],
      ["left_shoulder", "left_hip"],
      ["right_shoulder", "right_hip"],
      ["left_hip", "right_hip"],
      ["left_hip", "left_knee"],
      ["left_knee", "left_ankle"],
      ["right_hip", "right_knee"],
      ["right_knee", "right_ankle"]
    ], K = new Map(f.map((G) => [G.name, G]));
    h.strokeStyle = I, h.lineWidth = 3, h.lineCap = "round", h.lineJoin = "round", u.forEach(([G, le]) => {
      const se = K.get(G), Q = K.get(le), de = se?.score ?? 1, he = Q?.score ?? 1;
      se && Q && de > 0.3 && he > 0.3 && (h.beginPath(), h.moveTo(se.x * l.width, se.y * l.height), h.lineTo(Q.x * l.width, Q.y * l.height), h.stroke());
    }), f.forEach((G) => {
      const le = G.x * l.width, se = G.y * l.height;
      (G.score ?? 1) > 0.3 && (h.beginPath(), h.arc(le, se, 5, 0, 2 * Math.PI), h.fillStyle = S, h.fill(), h.strokeStyle = "#fff", h.lineWidth = 2, h.stroke());
    });
  }, [f]);
  const d = (l) => {
    const b = (I, u) => {
      const K = I.split(","), G = K[0].match(/:(.*?);/), le = G ? G[1] : "image/jpeg", se = atob(K[1]);
      let Q = se.length;
      const de = new Uint8Array(Q);
      for (; Q--; )
        de[Q] = se.charCodeAt(Q);
      return new File([de], u, { type: le });
    }, h = `capture_${Date.now()}.jpg`, S = b(l, h);
    n(S), g(null), O(null), v();
  }, w = (l) => {
    try {
      const b = "analysis_history", h = localStorage.getItem(b), S = h ? JSON.parse(h) : [], I = {
        ...l,
        id: `analysis_${Date.now()}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        patientInfo: D
        // 添加患者信息
      };
      S.unshift(I);
      const u = S.slice(0, 10);
      localStorage.setItem(b, JSON.stringify(u));
    } catch (b) {
      console.error("保存分析结果到本地存储失败:", b);
    }
  }, v = async () => {
    if (a) {
      m(!0), g(null);
      try {
        W(
          { video: a },
          {
            onSuccess: (l) => {
              O(l), w(l);
            },
            onError: (l) => {
              g(
                l instanceof Error ? l.message : "视频分析失败，请重试"
              ), console.error("Video analysis error:", l);
            },
            onSettled: () => {
              m(!1);
            }
          }
        );
      } catch (l) {
        g(
          l instanceof Error ? l.message : "视频分析失败，请重试"
        ), console.error("Video analysis error:", l), m(!1);
      }
    }
  }, R = (l) => l < 1024 ? l + " B" : l < 1048576 ? (l / 1024).toFixed(1) + " KB" : (l / 1048576).toFixed(1) + " MB", A = (l) => l >= 80 ? { color: ue.primary[700], level: "良好" } : l >= 60 ? { color: ue.secondary[600], level: "可接受" } : { color: ue.primary[800], level: "需改进" }, y = () => ({
    upload: [
      "建议视频时长控制在10-30秒",
      "确保患者全身都在画面内",
      "拍摄环境光线充足",
      "使用稳定的拍摄设备"
    ],
    camera: [
      "请保持摄像头稳定",
      "确保全身都在画面内",
      "光线适中，避免过度曝光",
      "保持合适距离，确保清晰度"
    ]
  })[j];
  return /* @__PURE__ */ i.jsxs("div", { className: "video-analysis-container", "data-testid": "video-analysis-container", style: {
    ...o && we.fadeIn("0.4s")
  }, children: [
    /* @__PURE__ */ i.jsx("div", { className: "flex justify-end mb-4", children: /* @__PURE__ */ i.jsxs(
      "button",
      {
        onClick: () => P(!0),
        className: "help-button active:scale-95",
        children: [
          /* @__PURE__ */ i.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ i.jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ i.jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
            /* @__PURE__ */ i.jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
          ] }),
          "使用帮助"
        ]
      }
    ) }),
    /* @__PURE__ */ i.jsx("div", { className: "header-section", style: {
      borderColor: ue.primary[200],
      ...o && we.fadeInDown("0.5s", "0.1s")
    }, children: /* @__PURE__ */ i.jsxs("div", { className: "flex items-center mb-4", children: [
      /* @__PURE__ */ i.jsx("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4", children: /* @__PURE__ */ i.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-green-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" }) }) }),
      /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsxs("h1", { className: "text-2xl md:text-3xl font-bold mb-2", style: { color: ue.primary[800] }, children: [
          t,
          " 动作分析"
        ] }),
        /* @__PURE__ */ i.jsx("p", { className: "text-secondary-600", children: "专业康复评估系统 - 精确测量动作表现和姿态控制" })
      ] })
    ] }) }),
    /* @__PURE__ */ i.jsx("div", { className: "mb-6 grow", children: /* @__PURE__ */ i.jsxs("div", { className: "bg-white rounded-xl shadow-md p-4 sm:p-6 border border-green-100 overflow-hidden transition-all duration-300 hover:shadow-lg", children: [
      /* @__PURE__ */ i.jsxs("div", { ref: z, className: "video-source-tabs", style: {
        backgroundColor: ue.primary[50],
        borderRadius: rt.lg,
        ...o && we.fadeInUp("0.6s", "0.2s")
      }, role: "tablist", children: [
        /* @__PURE__ */ i.jsxs(
          "button",
          {
            className: "flex flex-1 items-center justify-center min-h-[48px] px-4 py-3 rounded-md text-sm font-medium transition-all sm:text-base",
            style: {
              backgroundColor: j === "upload" ? "#f7f9f7" : "transparent",
              color: j === "upload" ? "#6b8475" : "#5a6f61",
              fontWeight: j === "upload" ? $e.fontWeight.semibold : void 0,
              boxShadow: j === "upload" ? He.default : "none"
            },
            onClick: () => k("upload"),
            role: "tab",
            id: "upload-tab",
            "aria-selected": j === "upload" ? "true" : "false",
            "aria-controls": "upload-tabpanel",
            children: [
              /* @__PURE__ */ i.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 mr-2 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
              "上传视频"
            ]
          }
        ),
        /* @__PURE__ */ i.jsxs(
          "button",
          {
            className: "flex-1 px-4 py-3 rounded-md transition-all text-sm sm:text-base font-medium min-h-[48px] flex items-center justify-center",
            style: {
              backgroundColor: j === "camera" ? "#f7f9f7" : "transparent",
              color: j === "camera" ? "#6b8475" : "#5a6f61",
              fontWeight: j === "camera" ? $e.fontWeight.semibold : void 0,
              boxShadow: j === "camera" ? He.default : "none"
            },
            onClick: () => k("camera"),
            role: "tab",
            id: "camera-tab",
            "aria-selected": j === "camera" ? "true" : "false",
            "aria-controls": "camera-tabpanel",
            children: [
              /* @__PURE__ */ i.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: [
                /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" }),
                /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z" })
              ] }),
              "拍摄视频"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "video-display-area", children: [
        j === "upload" && /* @__PURE__ */ i.jsx("div", { id: "upload-tabpanel", role: "tabpanel", "aria-labelledby": "upload-tab", className: "w-full h-full", children: /* @__PURE__ */ i.jsx(wi, { onFileSelect: Y }) }),
        j === "camera" && /* @__PURE__ */ i.jsx("div", { id: "camera-tabpanel", role: "tabpanel", "aria-labelledby": "camera-tab", className: "w-full h-full", children: /* @__PURE__ */ i.jsx(
          ki,
          {
            onCapture: d,
            onError: (l) => {
              console.error("Camera error:", l), g(`摄像头错误: ${l}`);
            },
            keypoints: f,
            onVideoFrame: N,
            showSkeleton: !0
          }
        ) })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "mt-4 p-4 rounded-lg border", style: { backgroundColor: "#f4f7f0", borderColor: "#d0ddd5" }, children: /* @__PURE__ */ i.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ i.jsx("div", { className: "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", style: { backgroundColor: "#e8f0ec" }, children: /* @__PURE__ */ i.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-3 w-3", style: { color: "#8faa9d" }, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
        /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx("h4", { className: "text-sm font-medium mb-2", style: { color: "#6b8475" }, children: "拍摄建议" }),
          /* @__PURE__ */ i.jsx("ul", { className: "text-xs sm:text-sm space-y-1", style: { color: "#5a6f61" }, children: y().map((l, b) => /* @__PURE__ */ i.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ i.jsx("span", { style: { color: "#8faa9d" }, children: "•" }),
            /* @__PURE__ */ i.jsx("span", { children: l })
          ] }, b)) })
        ] })
      ] }) }),
      a && /* @__PURE__ */ i.jsxs("div", { className: "mt-4 p-4 rounded-lg border", style: { backgroundColor: "#f4f7f0", borderColor: "#d0ddd5" }, children: [
        Z && j === "upload" && /* @__PURE__ */ i.jsxs("div", { className: "relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4 border border-gray-200 shadow-inner", children: [
          /* @__PURE__ */ i.jsx(
            "video",
            {
              ref: re,
              src: Z,
              className: "absolute top-0 left-0 w-full h-full object-contain",
              controls: !0,
              onPlay: s,
              crossOrigin: "anonymous",
              playsInline: !0
            }
          ),
          /* @__PURE__ */ i.jsx(
            "canvas",
            {
              ref: U,
              className: "absolute top-0 left-0 w-full h-full pointer-events-none",
              style: { zIndex: 10 }
            }
          ),
          /* @__PURE__ */ i.jsx("div", { className: "absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-20", children: "播放视频以查看实时骨骼点分析" })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ i.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ i.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center", style: { backgroundColor: "#e8f0ec" }, children: /* @__PURE__ */ i.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", style: { color: "#8faa9d" }, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" }) }) }),
            /* @__PURE__ */ i.jsxs("div", { children: [
              /* @__PURE__ */ i.jsx("p", { className: "text-sm font-medium", style: { color: "#6b8475" }, children: a.name }),
              /* @__PURE__ */ i.jsx("p", { className: "text-xs", style: { color: "#5a6f61" }, children: R(a.size) })
            ] })
          ] }),
          /* @__PURE__ */ i.jsx(
            "button",
            {
              onClick: () => n(null),
              className: "text-sm p-2 rounded-full transition-colors",
              style: { color: "#5a6f61", backgroundColor: "#e8f0ec" },
              children: /* @__PURE__ */ i.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
            }
          )
        ] }),
        /* @__PURE__ */ i.jsx("div", { className: "mt-4 flex justify-center", children: /* @__PURE__ */ i.jsx(
          "button",
          {
            onClick: v,
            disabled: p,
            className: "px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 shadow-md",
            children: p ? /* @__PURE__ */ i.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ i.jsx(Ae, { size: "small", message: "" }),
              "分析中..."
            ] }) : "开始分析"
          }
        ) })
      ] })
    ] }) }),
    ae === "analyzing" && /* @__PURE__ */ i.jsxs("div", { className: "flex flex-col items-center justify-center my-12 py-8 border", style: { backgroundColor: "#ffffff", borderRadius: rt.lg, boxShadow: He.default, borderColor: "#8faa9d" }, children: [
      /* @__PURE__ */ i.jsx("div", { className: "mb-4 w-16 h-16 rounded-full flex items-center justify-center", style: { backgroundColor: "#f4f7f0" }, children: /* @__PURE__ */ i.jsx(Ae, { size: "large", message: "" }) }),
      /* @__PURE__ */ i.jsxs("h3", { className: "text-lg font-semibold mb-2", style: { color: "#6b8475", fontWeight: $e.fontWeight.semibold }, children: [
        "正在分析 ",
        t,
        " 动作..."
      ] }),
      /* @__PURE__ */ i.jsx("p", { className: "text-sm max-w-md text-center", style: { color: "#5a6f61" }, children: "系统正在进行精确的动作识别和姿态评估，请稍候..." })
    ] }),
    ae === "error" && /* @__PURE__ */ i.jsx("div", { className: "mb-8 p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md", style: { backgroundColor: "#f8f4f4", borderColor: "#e8d4d4" }, children: /* @__PURE__ */ i.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ i.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center shrink-0", style: { backgroundColor: "#e8d4d4", color: "#d45454" }, children: /* @__PURE__ */ i.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
      /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsx("h4", { className: "font-semibold text-lg mb-2", style: { color: "#d45454" }, children: "分析失败" }),
        /* @__PURE__ */ i.jsx("p", { className: "text-sm", style: { color: "#a04040" }, children: E }),
        /* @__PURE__ */ i.jsx(
          "button",
          {
            onClick: () => g(null),
            className: "mt-3 text-sm px-3 py-1 rounded transition-colors",
            style: { backgroundColor: "#d45454", color: "#ffffff" },
            children: "关闭错误"
          }
        )
      ] })
    ] }) }),
    ae === "poseError" && /* @__PURE__ */ i.jsx("div", { className: "mb-8 p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md", style: { backgroundColor: "#f8f4f4", borderColor: "#e8d4d4" }, children: /* @__PURE__ */ i.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ i.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center shrink-0", style: { backgroundColor: "#e8d4d4", color: "#d45454" }, children: /* @__PURE__ */ i.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
      /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsx("h4", { className: "font-semibold text-lg mb-2", style: { color: "#d45454" }, children: "姿态估计失败" }),
        /* @__PURE__ */ i.jsx("p", { className: "text-sm", style: { color: "#a04040" }, children: M }),
        /* @__PURE__ */ i.jsxs("div", { className: "mt-3 flex gap-2", children: [
          /* @__PURE__ */ i.jsx(
            "button",
            {
              onClick: () => {
                const l = re.current;
                l && ne(l, e), pe(!0);
              },
              className: "text-sm px-3 py-1 rounded transition-colors",
              style: { backgroundColor: "#2e7d32", color: "#ffffff" },
              children: "重试"
            }
          ),
          /* @__PURE__ */ i.jsx(
            "button",
            {
              onClick: () => pe(!0),
              className: "text-sm px-3 py-1 rounded transition-colors",
              style: { backgroundColor: "#d45454", color: "#ffffff" },
              children: "关闭"
            }
          )
        ] })
      ] })
    ] }) }),
    ae === "poseProcessing" && /* @__PURE__ */ i.jsxs("div", { className: "flex flex-col items-center justify-center my-12 py-8 rounded-xl shadow-sm border", style: { backgroundColor: "#ffffff", borderColor: "#d0ddd5" }, children: [
      /* @__PURE__ */ i.jsx("div", { className: "mb-4 w-16 h-16 rounded-full flex items-center justify-center", style: { backgroundColor: "#e8f0ec" }, children: /* @__PURE__ */ i.jsx(Ae, { size: "large", message: "" }) }),
      /* @__PURE__ */ i.jsx("h3", { className: "text-lg font-semibold mb-2", style: { color: "#6b8475" }, children: "正在进行姿态估计..." }),
      /* @__PURE__ */ i.jsx("p", { className: "text-sm max-w-md text-center", style: { color: "#5a6f61" }, children: "系统正在实时检测您的动作姿态，请保持标准姿势..." })
    ] }),
    ae === "modelLoading" && /* @__PURE__ */ i.jsxs("div", { className: "flex flex-col items-center justify中心 my-12 py-8 rounded-xl shadow-sm border", style: { backgroundColor: "#ffffff", borderColor: "#d0ddd5" }, children: [
      /* @__PURE__ */ i.jsx("div", { className: "mb-4 w-16 h-16 rounded-full flex items中心 justify中心", style: { backgroundColor: "#e8f0ec" }, children: /* @__PURE__ */ i.jsx(Ae, { size: "large", message: "" }) }),
      /* @__PURE__ */ i.jsx("h3", { className: "text-lg font-semibold mb-2", style: { color: "#6b8475" }, children: "正在加载姿态估计模型..." }),
      /* @__PURE__ */ i.jsx("p", { className: "text-sm max-w-md text中心", style: { color: "#5a6f61" }, children: "首次使用需要加载模型资源，请稍候..." })
    ] }),
    F && (j === "camera" || j === "upload" && Z) && /* @__PURE__ */ i.jsxs("div", { className: "mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-2xl ring-1 ring-black/5", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "bg-gradient-to-r from-green-50/80 to-emerald-50/30 p-5 border-b border-green-100/50 flex items-center justify-between", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ i.jsx("div", { className: "w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 ring-1 ring-green-100", children: /* @__PURE__ */ i.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }) }),
          /* @__PURE__ */ i.jsxs("div", { children: [
            /* @__PURE__ */ i.jsx("h3", { className: "text-lg font-bold text-gray-800 tracking-tight", children: "AI 姿态评估报告" }),
            /* @__PURE__ */ i.jsx("p", { className: "text-xs text-gray-500 font-medium", children: "基于深度学习的实时动作分析" })
          ] })
        ] }),
        /* @__PURE__ */ i.jsx("div", { className: "text-xs px-3 py-1 bg-white/80 rounded-full text-green-700 font-medium shadow-sm border border-green-100", children: "实时生成" })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "flex flex-col md:flex-row gap-8 mb-8", children: [
          /* @__PURE__ */ i.jsxs("div", { className: "flex-shrink-0 flex flex-col items-center justify-center relative w-full md:w-auto", children: [
            /* @__PURE__ */ i.jsxs("div", { className: "relative w-40 h-40", children: [
              /* @__PURE__ */ i.jsxs("svg", { className: "w-full h-full transform -rotate-90", children: [
                /* @__PURE__ */ i.jsx(
                  "circle",
                  {
                    cx: "80",
                    cy: "80",
                    r: "70",
                    stroke: "currentColor",
                    strokeWidth: "12",
                    fill: "transparent",
                    className: "text-gray-100"
                  }
                ),
                /* @__PURE__ */ i.jsx(
                  "circle",
                  {
                    cx: "80",
                    cy: "80",
                    r: "70",
                    stroke: "currentColor",
                    strokeWidth: "12",
                    fill: "transparent",
                    strokeDasharray: 440,
                    strokeDashoffset: 440 - 440 * Math.round(F.score * 100) / 100,
                    className: `transition-all duration-1000 ease-out ${A(Math.round(F.score * 100)).color === ue.primary[700] ? "text-emerald-500" : A(Math.round(F.score * 100)).color === ue.secondary[600] ? "text-amber-500" : "text-rose-500"}`,
                    strokeLinecap: "round"
                  }
                )
              ] }),
              /* @__PURE__ */ i.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
                /* @__PURE__ */ i.jsx("span", { className: "text-4xl font-black text-gray-800", children: Math.round(F.score * 100) }),
                /* @__PURE__ */ i.jsx("span", { className: "text-xs text-gray-400 font-medium uppercase tracking-wider mt-1", children: "Total Score" })
              ] })
            ] }),
            /* @__PURE__ */ i.jsx("div", { className: `mt-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${A(Math.round(F.score * 100)).color === ue.primary[700] ? "bg-emerald-100 text-emerald-800" : A(Math.round(F.score * 100)).color === ue.secondary[600] ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`, children: A(Math.round(F.score * 100)).level })
          ] }),
          /* @__PURE__ */ i.jsxs("div", { className: "flex-1 flex flex-col justify-center", children: [
            /* @__PURE__ */ i.jsxs("div", { className: "bg-slate-50 rounded-xl p-5 border border-slate-100 relative", children: [
              /* @__PURE__ */ i.jsx("div", { className: "absolute -left-2 top-6 w-4 h-4 bg-slate-50 transform rotate-45 border-l border-b border-slate-100 hidden md:block" }),
              /* @__PURE__ */ i.jsxs("h4", { className: "text-sm font-bold text-gray-700 mb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ i.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-500" }),
                "智能评估反馈"
              ] }),
              /* @__PURE__ */ i.jsx("p", { className: "text-gray-600 text-sm leading-relaxed", children: F.feedback })
            ] }),
            /* @__PURE__ */ i.jsx("div", { className: "mt-6 space-y-4", children: /* @__PURE__ */ i.jsxs("div", { children: [
              /* @__PURE__ */ i.jsxs("div", { className: "flex justify-between text-xs mb-1.5 font-medium", children: [
                /* @__PURE__ */ i.jsx("span", { className: "text-gray-500", children: "动作准确度" }),
                /* @__PURE__ */ i.jsxs("span", { className: "text-gray-700", children: [
                  Math.round(F.score * 100),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ i.jsx("div", { className: "w-full bg-gray-100 rounded-full h-2.5 overflow-hidden", children: /* @__PURE__ */ i.jsx(
                "div",
                {
                  className: "h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-emerald-400 to-green-500 shadow-sm",
                  style: { width: `${Math.round(F.score * 100)}%` }
                }
              ) })
            ] }) })
          ] })
        ] }),
        F.angles && Object.keys(F.angles).length > 0 && /* @__PURE__ */ i.jsxs("div", { className: "mt-8", children: [
          /* @__PURE__ */ i.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ i.jsx("div", { className: "h-4 w-1 bg-green-500 rounded-full" }),
            /* @__PURE__ */ i.jsx("h4", { className: "font-bold text-gray-800", children: "关键关节角度分析" })
          ] }),
          /* @__PURE__ */ i.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", children: Object.entries(F.angles).map(([l, b]) => {
            const h = F?.details?.targetRanges, [S, I] = h && h[l] ? h[l] : [80, 110], u = b >= S && b <= I;
            return /* @__PURE__ */ i.jsxs(
              "div",
              {
                className: `group p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${u ? "bg-emerald-50/50 border-emerald-100 hover:border-emerald-200" : "bg-amber-50/50 border-amber-100 hover:border-amber-200"}`,
                children: [
                  /* @__PURE__ */ i.jsxs("div", { className: "text-xs text-gray-500 mb-1.5 font-medium flex justify-between", children: [
                    l,
                    u ? /* @__PURE__ */ i.jsx("svg", { className: "w-3.5 h-3.5 text-emerald-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) : /* @__PURE__ */ i.jsx("svg", { className: "w-3.5 h-3.5 text-amber-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) })
                  ] }),
                  /* @__PURE__ */ i.jsxs("div", { className: "flex items-baseline gap-1", children: [
                    /* @__PURE__ */ i.jsxs("span", { className: `text-xl font-bold ${u ? "text-emerald-700" : "text-amber-700"}`, children: [
                      b,
                      "°"
                    ] }),
                    /* @__PURE__ */ i.jsxs("span", { className: "text-[10px] text-gray-500", children: [
                      "(目标 ",
                      S,
                      "–",
                      I,
                      "°)"
                    ] })
                  ] })
                ]
              },
              l
            );
          }) })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end", children: [
          /* @__PURE__ */ i.jsx(
            "button",
            {
              onClick: () => n(null),
              className: "px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200",
              children: "重新评估"
            }
          ),
          /* @__PURE__ */ i.jsxs(
            "button",
            {
              onClick: v,
              className: "px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-100 active:scale-95 flex items-center gap-2 justify-center",
              children: [
                /* @__PURE__ */ i.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" }) }),
                "保存详细报告"
              ]
            }
          )
        ] })
      ] })
    ] }),
    C && /* @__PURE__ */ i.jsx("div", { ref: te, className: "mt-8 overflow-auto", style: {
      ...we.fadeInUp("0.7s"),
      ...we.cardHover
    } }),
    /* @__PURE__ */ i.jsx("div", { className: "mt-auto pt-6 pb-2 text-center text-xs text-gray-500", children: /* @__PURE__ */ i.jsx("p", { children: "© 2023 康复评估系统 - 专业医疗级动作分析平台" }) }),
    _ && /* @__PURE__ */ i.jsx(
      la,
      {
        steps: H,
        targetRef: z,
        isOpen: _,
        onClose: () => P(!1)
      }
    )
  ] });
};
function fe(e, t) {
  if (e == null) return {};
  var a = {}, n = Object.keys(e), o, r;
  for (r = 0; r < n.length; r++)
    o = n[r], !(t.indexOf(o) >= 0) && (a[o] = e[o]);
  return a;
}
var Ei = ["color"], Ni = /* @__PURE__ */ c.forwardRef(function(e, t) {
  var a = e.color, n = a === void 0 ? "currentColor" : a, o = fe(e, Ei);
  return c.createElement("svg", Object.assign({
    width: "15",
    height: "15",
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, o, {
    ref: t
  }), c.createElement("path", {
    d: "M11.5 1C11.7761 1 12 1.22386 12 1.5V13.5C12 13.7761 11.7761 14 11.5 14C11.2239 14 11 13.7761 11 13.5V1.5C11 1.22386 11.2239 1 11.5 1ZM9.5 3C9.77614 3 10 3.22386 10 3.5V13.5C10 13.7761 9.77614 14 9.5 14C9.22386 14 9 13.7761 9 13.5V3.5C9 3.22386 9.22386 3 9.5 3ZM13.5 3C13.7761 3 14 3.22386 14 3.5V13.5C14 13.7761 13.7761 14 13.5 14C13.2239 14 13 13.7761 13 13.5V3.5C13 3.22386 13.2239 3 13.5 3ZM5.5 4C5.77614 4 6 4.22386 6 4.5V13.5C6 13.7761 5.77614 14 5.5 14C5.22386 14 5 13.7761 5 13.5V4.5C5 4.22386 5.22386 4 5.5 4ZM1.5 5C1.77614 5 2 5.22386 2 5.5V13.5C2 13.7761 1.77614 14 1.5 14C1.22386 14 1 13.7761 1 13.5V5.5C1 5.22386 1.22386 5 1.5 5ZM7.5 5C7.77614 5 8 5.22386 8 5.5V13.5C8 13.7761 7.77614 14 7.5 14C7.22386 14 7 13.7761 7 13.5V5.5C7 5.22386 7.22386 5 7.5 5ZM3.5 7C3.77614 7 4 7.22386 4 7.5V13.5C4 13.7761 3.77614 14 3.5 14C3.22386 14 3 13.7761 3 13.5V7.5C3 7.22386 3.22386 7 3.5 7Z",
    fill: n,
    fillRule: "evenodd",
    clipRule: "evenodd"
  }));
}), Si = ["color"], zi = /* @__PURE__ */ c.forwardRef(function(e, t) {
  var a = e.color, n = a === void 0 ? "currentColor" : a, o = fe(e, Si);
  return c.createElement("svg", Object.assign({
    width: "15",
    height: "15",
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, o, {
    ref: t
  }), c.createElement("path", {
    d: "M2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5V9.5C13 9.77614 12.7761 10 12.5 10H2.5C2.22386 10 2 9.77614 2 9.5V3.5ZM2 10.9146C1.4174 10.7087 1 10.1531 1 9.5V3.5C1 2.67157 1.67157 2 2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V9.5C14 10.1531 13.5826 10.7087 13 10.9146V11.5C13 12.3284 12.3284 13 11.5 13H3.5C2.67157 13 2 12.3284 2 11.5V10.9146ZM12 11V11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5V11H12Z",
    fill: n,
    fillRule: "evenodd",
    clipRule: "evenodd"
  }));
}), _i = ["color"], Fi = /* @__PURE__ */ c.forwardRef(function(e, t) {
  var a = e.color, n = a === void 0 ? "currentColor" : a, o = fe(e, _i);
  return c.createElement("svg", Object.assign({
    width: "15",
    height: "15",
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, o, {
    ref: t
  }), c.createElement("path", {
    d: "M0.877075 7.49991C0.877075 3.84222 3.84222 0.877075 7.49991 0.877075C11.1576 0.877075 14.1227 3.84222 14.1227 7.49991C14.1227 11.1576 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1576 0.877075 7.49991ZM7.49991 1.82708C4.36689 1.82708 1.82708 4.36689 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49991C13.1727 4.36689 10.6329 1.82708 7.49991 1.82708Z",
    fill: n,
    fillRule: "evenodd",
    clipRule: "evenodd"
  }));
}), Oi = ["color"], Ii = /* @__PURE__ */ c.forwardRef(function(e, t) {
  var a = e.color, n = a === void 0 ? "currentColor" : a, o = fe(e, Oi);
  return c.createElement("svg", Object.assign({
    width: "15",
    height: "15",
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, o, {
    ref: t
  }), c.createElement("path", {
    d: "M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z",
    fill: n
  }));
}), Ri = ["color"], Li = /* @__PURE__ */ c.forwardRef(function(e, t) {
  var a = e.color, n = a === void 0 ? "currentColor" : a, o = fe(e, Ri);
  return c.createElement("svg", Object.assign({
    width: "15",
    height: "15",
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, o, {
    ref: t
  }), c.createElement("path", {
    d: "M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z",
    fill: n,
    fillRule: "evenodd",
    clipRule: "evenodd"
  }));
}), Ai = ["color"], qi = /* @__PURE__ */ c.forwardRef(function(e, t) {
  var a = e.color, n = a === void 0 ? "currentColor" : a, o = fe(e, Ai);
  return c.createElement("svg", Object.assign({
    width: "15",
    height: "15",
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, o, {
    ref: t
  }), c.createElement("path", {
    d: "M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z",
    fill: n,
    fillRule: "evenodd",
    clipRule: "evenodd"
  }));
}), Ti = ["color"], Hi = /* @__PURE__ */ c.forwardRef(function(e, t) {
  var a = e.color, n = a === void 0 ? "currentColor" : a, o = fe(e, Ti);
  return c.createElement("svg", Object.assign({
    width: "15",
    height: "15",
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, o, {
    ref: t
  }), c.createElement("path", {
    d: "M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 5C3.01671 5 3.03323 4.99918 3.04952 4.99758C3.28022 6.1399 4.28967 7 5.5 7C6.71033 7 7.71978 6.1399 7.95048 4.99758C7.96677 4.99918 7.98329 5 8 5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H8C7.98329 4 7.96677 4.00082 7.95048 4.00242C7.71978 2.86009 6.71033 2 5.5 2C4.28967 2 3.28022 2.86009 3.04952 4.00242C3.03323 4.00082 3.01671 4 3 4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H3ZM11.9505 10.9976C11.7198 12.1399 10.7103 13 9.5 13C8.28967 13 7.28022 12.1399 7.04952 10.9976C7.03323 10.9992 7.01671 11 7 11H1.5C1.22386 11 1 10.7761 1 10.5C1 10.2239 1.22386 10 1.5 10H7C7.01671 10 7.03323 10.0008 7.04952 10.0024C7.28022 8.8601 8.28967 8 9.5 8C10.7103 8 11.7198 8.8601 11.9505 10.0024C11.9668 10.0008 11.9833 10 12 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12C11.9833 11 11.9668 10.9992 11.9505 10.9976ZM8 10.5C8 9.67157 8.67157 9 9.5 9C10.3284 9 11 9.67157 11 10.5C11 11.3284 10.3284 12 9.5 12C8.67157 12 8 11.3284 8 10.5Z",
    fill: n,
    fillRule: "evenodd",
    clipRule: "evenodd"
  }));
}), Di = ["color"], $i = /* @__PURE__ */ c.forwardRef(function(e, t) {
  var a = e.color, n = a === void 0 ? "currentColor" : a, o = fe(e, Di);
  return c.createElement("svg", Object.assign({
    width: "15",
    height: "15",
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, o, {
    ref: t
  }), c.createElement("path", {
    d: "M0.999878 0.5C0.999878 0.223858 1.22374 0 1.49988 0H13.4999C13.776 0 13.9999 0.223858 13.9999 0.5C13.9999 0.776142 13.776 1 13.4999 1H6H1.49988C1.22374 1 0.999878 0.776142 0.999878 0.5ZM9 14V1L6 1V14H1.49988C1.22374 14 0.999878 14.2239 0.999878 14.5C0.999878 14.7761 1.22374 15 1.49988 15H13.4999C13.776 15 13.9999 14.7761 13.9999 14.5C13.9999 14.2239 13.776 14 13.4999 14H9Z",
    fill: n,
    fillRule: "evenodd",
    clipRule: "evenodd"
  }));
});
export {
  Ni as B,
  zi as C,
  Ii as D,
  qi as I,
  Hi as M,
  $i as S,
  Pi as V,
  Li as a,
  Fi as b
};
