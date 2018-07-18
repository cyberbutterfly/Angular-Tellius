;
(function () {
    "use strict";
    var root = this;

    /**
     * Provides a set of drawing tools to use in conjunction with a Surface in the Toolkit - select, drag, resize.
     * Everything this tool adds to the UI has an associated CSS class, so you can skin it very easily. There are no
     * methods on this class - you just construct one with the parameters you need.
     * @class jsPlumbToolkit.DrawingTools
     * @param {Object} params Constructor parameters.
     * @param {Surface} params.renderer Surface renderer to associate the tools with.
     * @param {String} [params.widthAttribute="w"] Name of the attribute used to store the node's width in its data.
     * @param {String} [params.heightAttribute="h"] Name of the attribute used to store the node's height in its data.
     * @param {String} [params.leftAttribute="left"] Name of the attribute used to store the node's left position in its data.
     * @param {String} [params.topAttribute="top"] Name of the attribute used to store the node's top position in its data.
     * @constructor
     */
    root.jsPlumbToolkit.DrawingTools = function (params) {

        var renderer = params.renderer,
            toolkit = renderer.getToolkit(),
            jsp = renderer.getJsPlumb(),
            skeletons = {},
            widthAtt = params.widthAttribute || "w",
            heightAtt = params.heightAttribute || "h",
            leftAtt = params.leftAttribute || "left",
            topAtt = params.topAttribute || "top",
            xAxis, yAxis;

        var _reset = function () {
            for (var id in skeletons) {
                var s = skeletons[id];
                if (s[0] && s[0].parentNode) {
                    s[0].parentNode.removeChild(s[0]);
                }
                delete skeletons[id];
            }
        };

        var _create = function (t, c, p, a) {
            var s = document.createElement(t);
            if (c) s.className = c;
            if (p) p.appendChild(s);
            if (a) {
                for (var i in a) {
                    s.setAttribute(i, a[i]);
                }
            }
            return s;
        };

        var _remove = function (id) {
            var s = skeletons[id];
            if (s && s[0] && s[0].parentNode) {
                s[0].parentNode.removeChild(s[0]);
            }
            delete skeletons[id];
        };

        var _deselect = function (node, renderer) {
            var el = renderer.getRenderedNode(node.id);
            _remove(node.id);
            return el;
        };

        var _select = function (node, renderer) {
            var el = _deselect(node, renderer);
            if (el != null) {
                var s = _create("div", "jtk-draw-skeleton", el),
                    x = el.getAttribute("jtk-x-resize"), y = el.getAttribute("jtk-y-resize");

                _create("div", "jtk-draw-drag", s);
                _create("div", "jtk-draw-handle jtk-draw-handle-tl", s, {"data-dir": "tl", "data-node-id": node.id });
                _create("div", "jtk-draw-handle jtk-draw-handle-tr", s, {"data-dir": "tr", "data-node-id": node.id });
                _create("div", "jtk-draw-handle jtk-draw-handle-bl", s, {"data-dir": "bl", "data-node-id": node.id });
                _create("div", "jtk-draw-handle jtk-draw-handle-br", s, {"data-dir": "br", "data-node-id": node.id });

                skeletons[node.id] = [ s, x !== "false", y !== "false" ];
            }
        };

        var downAt, handler, toolkitDragObject, x1, x2, y1, y2;

        var _dim = function (x, y, w, h) {
            var out = {};
            out[widthAtt] = xAxis ? w : (x2 - x1);
            out[heightAtt] = yAxis ? h : (y2 - y1);
            out[leftAtt] = xAxis ? x : x1;
            out[topAtt] = yAxis ? y : y1;
            return out;
        };

        var _dragHandlers = {
            "tl": function (dx, dy) {
                var x = x1 + dx, y = y1 + dy, w = x2 - x, h = y2 - y;
                if (x >= x2) {
                    w = x - x2;
                    x = x2;
                }

                if (y >= y2) {
                    h = y - y2;
                    y = y2;
                }

                return _dim(x, y, w, h);
            },
            "tr": function (dx, dy) {
                var w = (x2 - x1) + dx, y = y1 + dy, h = y2 - y, x = x1;
                if (w <= 0) {
                    x = x1 + w;
                    w *= -1;
                }

                if (y >= y2) {
                    h = y - y2;
                    y = y2;
                }

                return _dim(x, y, w, h);
            },
            "bl": function (dx, dy) {
                var x = x1 + dx, h = (y2 - y1) + dy, w = x2 - x, y = y1;
                if (x >= x2) {
                    w = x - x2;
                    x = x2;
                }
                if (h <= 0) {
                    y += h;
                    h *= -1;
                }
                return _dim(x, y, w, h);
            },
            "br": function (dx, dy) {
                var w = (x2 - x1) + dx, h = (y2 - y1) + dy, x = x1, y = y1;
                if (w <= 0) {
                    x = x1 + w;
                    w *= -1;
                }

                if (h <= 0) {
                    y += h;
                    h *= -1;
                }

                return _dim(x, y, w, h);
            }
        };

        toolkit.bind("selectionCleared", function () {
            _reset();
        });

        // - on select, add drawing primitives
        toolkit.bind("select", function (params) {
            _select(params.obj, renderer);
        });

        // - on deselect, remove drawing primitives.
        toolkit.bind("deselect", function (params) {
            _deselect(params.obj, renderer);
        });

        var moveListener = function (e) {
            var p = renderer.mapEventLocation(e),
                editingDx = (p.left - downAt.left),
                editingDy = (p.top - downAt.top);

            var newCoords = handler(editingDx, editingDy, "");
            toolkit.updateNode(toolkitDragObject, newCoords);
            renderer.setPosition(toolkitDragObject, newCoords[leftAtt], newCoords[topAtt], true);
        };

        var upListener = function (e) {
            renderer.storePositionInModel(toolkitDragObject.id);
            jsp.removeClass(document.body, "jtk-drag-select-defeat");
            jsp.off(document, "mousemove", moveListener);
            jsp.off(document, "mouseup", upListener);
            jsPlumbUtil.consume(e);
        };

        // - delegate bind to drag handles
        jsp.on(document, "mousedown", ".jtk-draw-handle", function (e) {
            var dir = this.getAttribute("data-dir"),
                nodeId = this.getAttribute("data-node-id");

            toolkitDragObject = toolkit.getNode(nodeId);
            xAxis = skeletons[nodeId][1];
            yAxis = skeletons[nodeId][2];

            downAt = renderer.mapEventLocation(e);
            // get the location and size of the element
            var c = renderer.getCoordinates(toolkitDragObject);
            x1 = c.x;
            y1 = c.y;
            x2 = x1 + c.w;
            y2 = y1 + c.h;

            handler = _dragHandlers[dir];

            jsp.addClass(document.body, "jtk-drag-select-defeat");

            jsp.on(document, "mousemove", moveListener);
            jsp.on(document, "mouseup", upListener);
        });

    };

}).call(typeof window !== 'undefined' ? window : this);
