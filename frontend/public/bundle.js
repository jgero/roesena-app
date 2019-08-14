
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function set_style(node, key, value) {
        node.style.setProperty(key, value);
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/Header.svelte generated by Svelte v3.8.0 */

    const file = "src/Header.svelte";

    function create_fragment(ctx) {
    	var nav, div0, span0, t1, div1, span1, t3, span2, t5, span3, t7, svg0, use0, t8, svg1, use1, t9, svg2, use2, t10, svg3, use3, dispose;

    	return {
    		c: function create() {
    			nav = element("nav");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "RöSeNa";
    			t1 = space();
    			div1 = element("div");
    			span1 = element("span");
    			span1.textContent = "Gruppen";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "Events";
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = "Archiv";
    			t7 = space();
    			svg0 = svg_element("svg");
    			use0 = svg_element("use");
    			t8 = space();
    			svg1 = svg_element("svg");
    			use1 = svg_element("use");
    			t9 = space();
    			svg2 = svg_element("svg");
    			use2 = svg_element("use");
    			t10 = space();
    			svg3 = svg_element("svg");
    			use3 = svg_element("use");
    			attr(span0, "class", "svelte-1txhi4p");
    			add_location(span0, file, 61, 4, 1043);
    			attr(div0, "class", "logo svelte-1txhi4p");
    			add_location(div0, file, 60, 2, 989);
    			attr(span1, "class", "navElem svelte-1txhi4p");
    			add_location(span1, file, 64, 4, 1100);
    			attr(span2, "class", "navElem svelte-1txhi4p");
    			add_location(span2, file, 65, 4, 1178);
    			attr(span3, "class", "navElem svelte-1txhi4p");
    			add_location(span3, file, 66, 4, 1255);
    			attr(use0, "href", "svg/calendar-alt-regular.svg#calendar");
    			attr(use0, "class", "svelte-1txhi4p");
    			add_location(use0, file, 68, 6, 1384);
    			attr(svg0, "class", "svelte-1txhi4p");
    			add_location(svg0, file, 67, 4, 1333);
    			attr(use1, "href", "svg/images-regular.svg#images");
    			attr(use1, "class", "svelte-1txhi4p");
    			add_location(use1, file, 71, 6, 1501);
    			attr(svg1, "class", "svelte-1txhi4p");
    			add_location(svg1, file, 70, 4, 1452);
    			attr(use2, "href", "svg/tasks-solid.svg#tasks");
    			attr(use2, "class", "svelte-1txhi4p");
    			add_location(use2, file, 74, 6, 1610);
    			attr(svg2, "class", "svelte-1txhi4p");
    			add_location(svg2, file, 73, 4, 1561);
    			attr(use3, "href", "svg/sign-in-alt-solid.svg#sign-in");
    			attr(use3, "class", "svelte-1txhi4p");
    			add_location(use3, file, 77, 6, 1714);
    			attr(svg3, "class", "svelte-1txhi4p");
    			add_location(svg3, file, 76, 4, 1666);
    			attr(div1, "class", "linkBox svelte-1txhi4p");
    			add_location(div1, file, 63, 2, 1074);
    			attr(nav, "class", "svelte-1txhi4p");
    			add_location(nav, file, 59, 0, 981);

    			dispose = [
    				listen(div0, "click", ctx.click_handler),
    				listen(span1, "click", ctx.click_handler_1),
    				listen(span2, "click", ctx.click_handler_2),
    				listen(span3, "click", ctx.click_handler_3),
    				listen(svg0, "click", ctx.click_handler_4),
    				listen(svg1, "click", ctx.click_handler_5),
    				listen(svg2, "click", ctx.click_handler_6),
    				listen(svg3, "click", ctx.click_handler_7)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, nav, anchor);
    			append(nav, div0);
    			append(div0, span0);
    			append(nav, t1);
    			append(nav, div1);
    			append(div1, span1);
    			append(div1, t3);
    			append(div1, span2);
    			append(div1, t5);
    			append(div1, span3);
    			append(div1, t7);
    			append(div1, svg0);
    			append(svg0, use0);
    			append(div1, t8);
    			append(div1, svg1);
    			append(svg1, use1);
    			append(div1, t9);
    			append(div1, svg2);
    			append(svg2, use2);
    			append(div1, t10);
    			append(div1, svg3);
    			append(svg3, use3);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(nav);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { navigate } = $$props;

    	const writable_props = ['navigate'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	function click_handler() {
    		return navigate('/');
    	}

    	function click_handler_1() {
    		return navigate('/groups');
    	}

    	function click_handler_2() {
    		return navigate('/events');
    	}

    	function click_handler_3() {
    		return navigate('/archive');
    	}

    	function click_handler_4() {
    		return navigate('/calendar');
    	}

    	function click_handler_5() {
    		return navigate('/images');
    	}

    	function click_handler_6() {
    		return navigate('/events');
    	}

    	function click_handler_7() {
    		return navigate('/login');
    	}

    	$$self.$set = $$props => {
    		if ('navigate' in $$props) $$invalidate('navigate', navigate = $$props.navigate);
    	};

    	return {
    		navigate,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7
    	};
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["navigate"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.navigate === undefined && !('navigate' in props)) {
    			console.warn("<Header> was created without expected prop 'navigate'");
    		}
    	}

    	get navigate() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navigate(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.8.0 */

    const file$1 = "src/Footer.svelte";

    function create_fragment$1(ctx) {
    	var div2, div0, t1, div1, span0, t3, span1, dispose;

    	return {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "breadcrumbs";
    			t1 = space();
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "Impressum";
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "Links";
    			attr(div0, "class", "svelte-1pt9fsb");
    			add_location(div0, file$1, 42, 2, 673);
    			attr(span0, "class", "svelte-1pt9fsb");
    			add_location(span0, file$1, 44, 4, 708);
    			attr(span1, "class", "svelte-1pt9fsb");
    			add_location(span1, file$1, 45, 4, 771);
    			attr(div1, "class", "svelte-1pt9fsb");
    			add_location(div1, file$1, 43, 2, 698);
    			attr(div2, "class", "root svelte-1pt9fsb");
    			add_location(div2, file$1, 41, 0, 652);

    			dispose = [
    				listen(span0, "click", ctx.click_handler),
    				listen(span1, "click", ctx.click_handler_1)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div2, t1);
    			append(div2, div1);
    			append(div1, span0);
    			append(div1, t3);
    			append(div1, span1);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div2);
    			}

    			run_all(dispose);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { navigate } = $$props;

    	const writable_props = ['navigate'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	function click_handler() {
    		return navigate('/about');
    	}

    	function click_handler_1() {
    		return navigate('/references');
    	}

    	$$self.$set = $$props => {
    		if ('navigate' in $$props) $$invalidate('navigate', navigate = $$props.navigate);
    	};

    	return { navigate, click_handler, click_handler_1 };
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["navigate"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.navigate === undefined && !('navigate' in props)) {
    			console.warn("<Footer> was created without expected prop 'navigate'");
    		}
    	}

    	get navigate() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navigate(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/calendar/Calendar.svelte generated by Svelte v3.8.0 */

    const file$2 = "src/calendar/Calendar.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx._ = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.weekday = list[i];
    	return child_ctx;
    }

    // (84:2) {#each weekdayStrings as weekday}
    function create_each_block_1(ctx) {
    	var h2, t_value = ctx.weekday + "", t;

    	return {
    		c: function create() {
    			h2 = element("h2");
    			t = text(t_value);
    			set_style(h2, "grid-area", ctx.weekday);
    			attr(h2, "class", "svelte-o5rau3");
    			add_location(h2, file$2, 84, 4, 1810);
    		},

    		m: function mount(target, anchor) {
    			insert(target, h2, anchor);
    			append(h2, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.weekdayStrings) {
    				set_style(h2, "grid-area", ctx.weekday);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(h2);
    			}
    		}
    	};
    }

    // (88:2) {#each new Array(daysInMonth()) as _, i}
    function create_each_block(ctx) {
    	var span, t_value = ctx.i + 1 + "", t;

    	return {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			set_style(span, "grid-area", ctx.getGridArea(ctx.i));
    			add_location(span, file$2, 88, 4, 1917);
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    			append(span, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.getGridArea) {
    				set_style(span, "grid-area", ctx.getGridArea(ctx.i));
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	var main, h1, t0_value = ctx.getMonthName() + "", t0, t1, t2, t3, t4;

    	var each_value_1 = ctx.weekdayStrings;

    	var each_blocks_1 = [];

    	for (var i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	var each_value = new Array(ctx.daysInMonth());

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(ctx.year);
    			t3 = space();

    			for (var i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr(h1, "class", "svelte-o5rau3");
    			add_location(h1, file$2, 82, 2, 1737);
    			attr(main, "class", "svelte-o5rau3");
    			add_location(main, file$2, 81, 0, 1728);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, main, anchor);
    			append(main, h1);
    			append(h1, t0);
    			append(h1, t1);
    			append(h1, t2);
    			append(main, t3);

    			for (var i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(main, null);
    			}

    			append(main, t4);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if (changed.year) {
    				set_data(t2, ctx.year);
    			}

    			if (changed.weekdayStrings) {
    				each_value_1 = ctx.weekdayStrings;

    				for (var i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(changed, child_ctx);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(main, t4);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}
    				each_blocks_1.length = each_value_1.length;
    			}

    			if (changed.getGridArea || changed.daysInMonth) {
    				each_value = new Array(ctx.daysInMonth());

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(main, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(main);
    			}

    			destroy_each(each_blocks_1, detaching);

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const weekdayStrings = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

      let { date = new Date() } = $$props;
      // save date as ISO string

      let month;
      let year;

      function daysInMonth() {
        return new Date(year, month, 0).getDate();
      }

      function getGridArea(ind) {
        const row = Math.round((new Date(month, year, 0).getDay() + ind) / 7) + 3;
        const column = new Date(year, month, ind).getDay() + 2;
        return `${row} / ${column} / ${row} / ${column}`;
      }

      function getMonthName() {
        switch (month) {
          case 0:
            return "Januar";
          case 1:
            return "Februar";
          case 2:
            return "März";
          case 3:
            return "April";
          case 4:
            return "Mai";
          case 5:
            return "Juni";
          case 6:
            return "Juli";
          case 7:
            return "August";
          case 8:
            return "September";
          case 9:
            return "Oktober";
          case 10:
            return "November";
          case 11:
            return "Dezember";
        }
      }

    	const writable_props = ['date'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Calendar> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('date' in $$props) $$invalidate('date', date = $$props.date);
    	};

    	$$self.$$.update = ($$dirty = { date: 1 }) => {
    		if ($$dirty.date) { {
            month = date.getMonth();
            $$invalidate('year', year = date.getFullYear());
          } }
    	};

    	return {
    		weekdayStrings,
    		date,
    		year,
    		daysInMonth,
    		getGridArea,
    		getMonthName
    	};
    }

    class Calendar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["date"]);
    	}

    	get date() {
    		throw new Error("<Calendar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<Calendar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/errorpage/NotFound.svelte generated by Svelte v3.8.0 */

    const file$3 = "src/errorpage/NotFound.svelte";

    function create_fragment$3(ctx) {
    	var div, dispose;

    	return {
    		c: function create() {
    			div = element("div");
    			div.textContent = "oops!";
    			add_location(div, file$3, 8, 0, 89);
    			dispose = listen(div, "click", ctx.click_handler);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { navigate } = $$props;

    	const writable_props = ['navigate'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	function click_handler() {
    		return navigate('/');
    	}

    	$$self.$set = $$props => {
    		if ('navigate' in $$props) $$invalidate('navigate', navigate = $$props.navigate);
    	};

    	return { navigate, click_handler };
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["navigate"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.navigate === undefined && !('navigate' in props)) {
    			console.warn("<NotFound> was created without expected prop 'navigate'");
    		}
    	}

    	get navigate() {
    		throw new Error("<NotFound>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navigate(value) {
    		throw new Error("<NotFound>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/startpage/InfoCard.svelte generated by Svelte v3.8.0 */

    const file$4 = "src/startpage/InfoCard.svelte";

    function create_fragment$4(ctx) {
    	var div1, img, img_src_value, t0, div0, h3, t1_value = ctx.article.title + "", t1, t2, p, t3_value = ctx.article.content + "", t3, dispose;

    	return {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			attr(img, "src", img_src_value = ctx.article.imagePaths[0]);
    			attr(img, "alt", "IMAGE");
    			attr(img, "class", "svelte-1wb2u4o");
    			add_location(img, file$4, 48, 2, 912);
    			add_location(h3, file$4, 50, 4, 992);
    			add_location(p, file$4, 51, 4, 1021);
    			attr(div0, "class", "textContent svelte-1wb2u4o");
    			add_location(div0, file$4, 49, 2, 962);
    			attr(div1, "class", "infoCard svelte-1wb2u4o");
    			add_location(div1, file$4, 47, 0, 831);
    			dispose = listen(div1, "click", ctx.click_handler);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, img);
    			append(div1, t0);
    			append(div1, div0);
    			append(div0, h3);
    			append(h3, t1);
    			append(div0, t2);
    			append(div0, p);
    			append(p, t3);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.article) && img_src_value !== (img_src_value = ctx.article.imagePaths[0])) {
    				attr(img, "src", img_src_value);
    			}

    			if ((changed.article) && t1_value !== (t1_value = ctx.article.title + "")) {
    				set_data(t1, t1_value);
    			}

    			if ((changed.article) && t3_value !== (t3_value = ctx.article.content + "")) {
    				set_data(t3, t3_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div1);
    			}

    			dispose();
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { article, navigate } = $$props;

    	const writable_props = ['article', 'navigate'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<InfoCard> was created with unknown prop '${key}'`);
    	});

    	function click_handler() {
    		return navigate('/article?id=' + article._id);
    	}

    	$$self.$set = $$props => {
    		if ('article' in $$props) $$invalidate('article', article = $$props.article);
    		if ('navigate' in $$props) $$invalidate('navigate', navigate = $$props.navigate);
    	};

    	return { article, navigate, click_handler };
    }

    class InfoCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["article", "navigate"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.article === undefined && !('article' in props)) {
    			console.warn("<InfoCard> was created without expected prop 'article'");
    		}
    		if (ctx.navigate === undefined && !('navigate' in props)) {
    			console.warn("<InfoCard> was created without expected prop 'navigate'");
    		}
    	}

    	get article() {
    		throw new Error("<InfoCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article(value) {
    		throw new Error("<InfoCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navigate() {
    		throw new Error("<InfoCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navigate(value) {
    		throw new Error("<InfoCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/startpage/SearchField.svelte generated by Svelte v3.8.0 */

    const file$5 = "src/startpage/SearchField.svelte";

    function create_fragment$5(ctx) {
    	var span, input, t, svg, use;

    	return {
    		c: function create() {
    			span = element("span");
    			input = element("input");
    			t = space();
    			svg = svg_element("svg");
    			use = svg_element("use");
    			attr(input, "spellcheck", "false");
    			attr(input, "class", "svelte-f165yy");
    			add_location(input, file$5, 37, 2, 662);
    			attr(use, "href", "svg/search-solid.svg#search");
    			add_location(use, file$5, 39, 4, 703);
    			attr(svg, "class", "svelte-f165yy");
    			add_location(svg, file$5, 38, 2, 693);
    			attr(span, "class", "searchContainer svelte-f165yy");
    			add_location(span, file$5, 36, 0, 629);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, span, anchor);
    			append(span, input);
    			append(span, t);
    			append(span, svg);
    			append(svg, use);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(span);
    			}
    		}
    	};
    }

    class SearchField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$5, safe_not_equal, []);
    	}
    }

    /* src/startpage/TitleElement.svelte generated by Svelte v3.8.0 */

    const file$6 = "src/startpage/TitleElement.svelte";

    function create_fragment$6(ctx) {
    	var div, span2, span0, t1, br, t2, span1, t4, svg, use;

    	return {
    		c: function create() {
    			div = element("div");
    			span2 = element("span");
    			span0 = element("span");
    			span0.textContent = "RöSeNa";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = "Röhlinger Sechtanarren e.V. 1970";
    			t4 = space();
    			svg = svg_element("svg");
    			use = svg_element("use");
    			attr(span0, "class", "title svelte-av66h2");
    			add_location(span0, file$6, 35, 4, 526);
    			add_location(br, file$6, 36, 4, 564);
    			attr(span1, "class", "subTitle svelte-av66h2");
    			add_location(span1, file$6, 37, 4, 575);
    			attr(span2, "class", "svelte-av66h2");
    			add_location(span2, file$6, 34, 2, 515);
    			attr(use, "href", "svg/RöSeNa.svg#roesena");
    			add_location(use, file$6, 40, 4, 660);
    			attr(svg, "class", "svelte-av66h2");
    			add_location(svg, file$6, 39, 2, 650);
    			attr(div, "class", "svelte-av66h2");
    			add_location(div, file$6, 33, 0, 507);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, span2);
    			append(span2, span0);
    			append(span2, t1);
    			append(span2, br);
    			append(span2, t2);
    			append(span2, span1);
    			append(div, t4);
    			append(div, svg);
    			append(svg, use);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    class TitleElement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$6, safe_not_equal, []);
    	}
    }

    /* src/startpage/Startpage.svelte generated by Svelte v3.8.0 */

    const file$7 = "src/startpage/Startpage.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.article = list[i];
    	return child_ctx;
    }

    // (51:4) {#each articles as article}
    function create_each_block$1(ctx) {
    	var current;

    	var infocard = new InfoCard({
    		props: {
    		article: ctx.article,
    		navigate: ctx.navigate
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			infocard.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(infocard, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var infocard_changes = {};
    			if (changed.articles) infocard_changes.article = ctx.article;
    			if (changed.navigate) infocard_changes.navigate = ctx.navigate;
    			infocard.$set(infocard_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(infocard.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(infocard.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(infocard, detaching);
    		}
    	};
    }

    function create_fragment$7(ctx) {
    	var div1, t0, t1, div0, current;

    	var searchfield = new SearchField({ $$inline: true });

    	var titleelement = new TitleElement({ $$inline: true });

    	var each_value = ctx.articles;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c: function create() {
    			div1 = element("div");
    			searchfield.$$.fragment.c();
    			t0 = space();
    			titleelement.$$.fragment.c();
    			t1 = space();
    			div0 = element("div");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr(div0, "class", "articleWrapper svelte-18omyot");
    			add_location(div0, file$7, 49, 2, 16227);
    			attr(div1, "class", "wrapper svelte-18omyot");
    			add_location(div1, file$7, 46, 0, 16166);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div1, anchor);
    			mount_component(searchfield, div1, null);
    			append(div1, t0);
    			mount_component(titleelement, div1, null);
    			append(div1, t1);
    			append(div1, div0);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.articles || changed.navigate) {
    				each_value = ctx.articles;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) out(i);
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchfield.$$.fragment, local);

    			transition_in(titleelement.$$.fragment, local);

    			for (var i = 0; i < each_value.length; i += 1) transition_in(each_blocks[i]);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(searchfield.$$.fragment, local);
    			transition_out(titleelement.$$.fragment, local);

    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) transition_out(each_blocks[i]);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div1);
    			}

    			destroy_component(searchfield);

    			destroy_component(titleelement);

    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	

      let { navigate } = $$props;

      let articles = [
        {
          title: "Article number one",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula non diam non varius. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. \\n Suspendisse vitae dolor quis eros maximus consequat. Nullam et rhoncus purus. Integer ornare augue vel leo sollicitudin, cursus faucibus ante maximus. Donec enim lacus, \n dictum vel lectus et, feugiat fermentum est. Nullam lacinia lectus sed semper      Aliquam malesuada tellus a sollicitudin placerat. Suspendisse potenti. Vivamus et tortor vel justo eleifend iaculis a eu metus. Integer et dolor lorem. Cras n nisi id libero efficitur dignissim vitae vitae lectus. Nullam ac neque ut. \n Donec enim lacus, dictum vel lectus et, feugiat fermentum est. Nullam lacinia lectus sed semper      Aliquam malesuada tellus a sollicitudin placerat. Suspendisse potenti. Vivamus et tortor vel justo eleifend iaculis a eu metus. Integer et dolor lorem. Cras n nisi id libero efficitur dignissim vitae vitae lectuss. Nullam ac neque ut.",
          imagePaths: [
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxQTEhUSExMWFRMXGBYbFxcXGBgYFRgWGBggLiAdHx8wIEAoJCYoJx8lODg4MTg2OjA6Iys6Ojs7OjQ7OjsBCgoKDg0OGxAQGyslHyYtNS0yNy8vLS0vLy0tLy0tLy03LS8tLS0tLS0vLS0tLS0tLS0rLS0tLS8tLS4tLS0tLf/AABEIAKwA1AMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAFBgMEBwIAAQj/xAA9EAACAQIEBAQDBQgCAgIDAAABAgMAEQQSITEFBkFREyJhcTKBkQcjobHBFEJSYnLR4fAkM0OCFfEWkqL/xAAaAQACAwEBAAAAAAAAAAAAAAACAwEEBQAG/8QALxEAAgEDAwIEBQUAAwAAAAAAAQIAAxEhBBIxQVETIrHwYXGBodEykcHh8QUUQv/aAAwDAQACEQMRAD8Aq4bFFgSVy2PyPrUU8griaaoYYzIbDbqe1ZOFFzNTLGwnUUJkNht1PQUbwuGCDKo/uT3rrCQBVyj/AE1ajjrG1OqNQ2HE0KNEILnmfIo6nmlSJDJIQqruTUeNxkcCeJIbDoOrHsB1pI4hj5MW+ZvLEPhQbD19T6/Sh0+mauey951asKY+M74txR8W9hdYVPlX9W7n8qpzxSAWiWw6m4zGr8SgCwFTXsLnYVvU0WmAqjEzXJY3JgyCbED4gbeq3q8OIHrb8q9Fj0NrBtTYaVPi50RSzkBfWjIJOJy2UZEr/wDyqjcGqPEOZEUWjGZ/XQD370F4txYSHLGoVe9rMf7UMC09KfeIqVAf0yXEYhpGzOxY/wC6DtXAFfQK6tTYmcGuamWImnPkjkOXFMsjxOYCLhrhVb57kfnQlgIaoTEyKK+pNl6k7f5qwMWqf9a6/wAbat8h0rdY/s4EcQSMqxD57SAMNtvagPF8FDFJkbBrHIWLSFf3gf4TtY0p6hHIlzT6ZarWVh9PwbTITiSDcsda+S4xm0JNvenXmvgeHbCvPBF4bxlc6i5NibX+u9ICmnU6hZcStqKBpPtbmSgV4iuQamijB9TRqpYxBNpCa5Jo1h+Hq1trWN9bHb+9fIOELI2hIUb9dOw9a5wFBJPEOnTaowVRkwXh8M8hsilj6VLicC8fxqVvt2p1wcIACRrp2H50I5mwkhOZmVY1tbXdj1qlT1JqVNoGJq6r/jqWmo7ma7/b8/WLoFerkNXqtzHj7AhkNht1NHcLAFAAFQYOGwsKKQR15XVak1DbpPQ0aIQfGdQx1X41xmPCrr5pCPKg39z2FD+OcyrDeKGzy9TuiH17n0+tK0cDOxkkYs5NyTuTR6XQmp56mF9f6i62o2+VeZ1PLJiH8SU3PQbKB2A6D86uRpXo46sIK2gAosOJSsTkz0a1OtcXsLmlPivMbPdYronf94/2olUtBYhOYa4rxxIrqPM/8I2HuaUsbjXlbM5v2HQewqsK6FWFUCVmYtOlFSCuUFTBQNW/yam8gKTPRoTU+VV31PYfqahM2mmg9P1NRSE2BscpuAehI3FRkwsLJJ5r6dOw2rU/s7+0d8seCKRqyIQjsxVGC9Dpva+29qyImvkcuVlb+Eg/Q0W3EHdnM/TMnFAUzyzYh7C//GQxx299z9aEwc04Np7DEuGiGYri1uliQLiQbbje++1E8DiWkjikByhluVI1sR5dPal7i/KGEkklnk+7jMdnAOQE5r5ifTLt1qutQk5j+OPf2jWcbgwWTEQxRh1Jzkq8Mi2uQH/Q27isO+1DDYOPFgYIAKUBdVN0DHa3bSqE82IxCx4KCRpY8xyRDc22J9Ow6VfH2bYtWVJGhjZgTZn2A67W/WmggZMWVLGwB9Ys8Pw+d7E2G57+1MkeFjUaKNu360ycr/ZQ0pcTsulrZH1U6G5HY7fOtSXlSBVVPu1VRbLkB3FtT1pVVWqG6mWtLq6dBSrJczDY8HmZUVytzYdQDRnAcACCzyX1ucotetB4n9mcEoUxTvFlFgy2bY0F4vwGXDL5nWYHTMLJ9egqrqE1G0AG/vvGrqaHib6Q2m0UuPcRC/8AHw69vEK6k/y3/OuuH8B/a4mOI8RSpOQXt+7va2tNEfDiroFt4OUmQgbEdNO9fDwTDXd1ZiLBiuZhlUi/ub0QoVVpBUWx73uf6/EQalN3LOxP0mKhq9RfiPCgHJiVyh1F9SNdtq9WoUINjKE0iCyjMxAUbk6AUB4zzE7gxwXVNjJszf09h61SxeNaU+c2Xog+Ee/c1GhFzqKwdPoAp31Mnt0mvV1W7CypFAy2yrf3NqtpK4/8f0Iqwlu4qQ+1aJlcESFcUesbD5V2MevYj3FdMbVUkx3a9ARGp5uBeXmxIt7is9I1puh87gNtrQmHgbFiW8q3Nu5F6KnVRb5iq9KoSMQSq1egwJOp0H40YkwkcajKNb7neqzyVBrlv0x1HSLbc+ZEkKrsNe9FuAcm4niDfcqBGps0jfCD29aZ+Vvs8lmTxZkujJeNQ2uY7Fuwo/gcFieHQiJWCxErmkWxZGPxHbr+FQpIO4wqm2opRCLw1wzk54MMkfhxSuIhE+mUOA1wfxN+9DsfyUkyGTE4dj4dxHDHoEX0sdb70ZwmJiYDOhY9GkmkLNbrbpXScWCs4Hj4Yx2JLnxsOVN9Tc3A01ta1N8pN7ymGKjbb7f2fS8w3j3J8kSPNGrGFGObNYOg6XH60qMK/T5x2Hlf7w5JSp/6/NFiEtuDaxHodR7UnD7MMGsX3ras+jZtSWOiC2npajDkYOYFUAtdRb4SbkjijPh0kmZo7IqZGFkLAWDg/wAwtUPMeO/aFkgWFpEB87C+UAb69KZOW+BLO7rOCyYZxGqf+JmQbnS5t7+9OGP4XHLH4LIPDa1wvl21G3tS1pMwvxGCulNhvF/f3mU8I4Rg8CBjxHIDIMqI5PX4iPT/AEVZn5pw2NQ4dmWJiwZJGHk32PY2ql9rWPtOY1PljREUds29C+WuTYpYDLM/xDyZWsV337k0BwSCccSwAEVXUeY5+WcRvTiuEzrh8NMFlsPNGfiI/Me9W3xeKdLpidUOsaqqD1FxresmxOBfCY4IpPlIZW7j9a0ng3F0eNmbKrA2IB3J629aF2sRtkCk7U/EORe2c+xA3NGJxOHeL/kO7SBsysQMpuLHT93XrfapF4mIIv8AnXlZDogN1Zv7VS5+W+XEqhyrZCSD5y35baXqjJwvO9pWLou1r5SfzqQWxKdSvRRN7HHwHPyjjwviEjedMKsayWZvvEDMLaEJbf51Tj5kWORpJ4JIvKqlrZk32Nv81LwnGoihWAuoyq1tQvaqnOVpMMNRkvcjTUD/AH8aaK73sV9fzApNRqruVvSXEbhs/wB6rqobcB8uvtevViEHCJ3GZYJWHcIxFeqyWcY3GCCO0ucHkdpVUsSD0v6U3vBoPlSxhOIQI6uImBH817f3o6eZMORuQfVTSGB7RykW5i3PxCRXYBhYMRqB3r4vGJPT6VxM8LEtdwSSbCx3qIpF0dv/ANaO0G/xhLCcSZw5OmUX0qxehWEkjQOM98ykaqRRJJNB7Cq2oHE0tA3MsYL4x8/yq9J/tqGYaTzr71p3InDoHiGIKv4sbteS10XTQEdrdbfOqmws1o3UsFzFbB8p4qZk/wCO+QsMxPl8vWpOKcrQxO0eaXMzMFWwzADbTr+taevEjdklYtJfQK5SKx+G1tWuLa3oNxfiBjtPJAVKMQHRzIyg21ytcEd9qfsUYBiKOpKnzDHv3xB/J/FcUqnDySMixZVT7oFstjvc2FrdjRriOJWNczTYi56lI2TU9VC6UGx3MnivHd41UgsJVOW410ynY36X9u1W3xUboxQ5r73N8vp70zcVxEvZjuAtf5fiVeA8TQERX8UmRiHCnQtc2IOq+WinMs4XDy+YC6lbHc3Gw+tKPCMBjG4lIIFQoTckjyCygancafOmPj3L6B2kllaTwwGmNrRppoiDqzHvsNTXWNiRJG1qg3G3v+YgcDxBRP2donckF0IkIsLgED0F+u9NXE2lESOxCiORSqgsRYbHe1BOKYgyEN4aIAPIFUCy9s25+dQyYp/CdLkqbHXoR2pDNmaFPRMLNfrxN6wosdEsGuxOlrm3zualSIh2YsSCAAOgt/egvJXHBisMjgEFQEa9vjUC/wBf1q9zBxBoYWeMK0n7itexPy1rUUjbeeeamyuUPPEwLnvHLPjpH1KeIQV2OVTb8bVqPK8OHj4aZ9GjRHOt8yhb+Q97HYje9AeL4TA4mEpIY8PiG8/iFGW8h+IeoJ+lMnLnKUowTYeScCOQhh4YvoQNz1Bt/mq6gk95o1Svh58uR34GJjUUMkmIbEEuozEqXPnt2HpRdscA0dkVpAwA0uXObt3ovx7ljEwyMixtIuuVlUm49qLfZzwNS7SSoVmVwPP8SC1xYdCaRtdmziaHj6ahRwd1/v8AP4fCOnNvDomwr50BVV8i7Kr9wO9ZniPLY2uOtq0D7QMXkhSK+rNc33IH+bUgyv8AMn6e9WHA3TxWtYkhe0hMyNrv6XP5Ub5U4NHjFmjkjbKCMrjQBrbe4/Wg2MQCLDZEDEvquxkOdvJffX9LVp3L/DxhcOECBGa7OATbOd7a3t71KA3vGUdGFIcm+PWBMHiIOHKMLIjsV1DKAQynqexr1exHBjimaZr6my208o2/v869UFrngy9tqdCJ+c6+Guc1fCadGXn0mpcDg5JpFiiUvI5sqjcmm7lj7OMRio1nZ0hhYXUsbuw9B/emvgf2eR4cDEsZS8ZJQqwGo/eOXYemvrS2qBYxKLNmJMP2e43PlmiMK5WbO2UpcDRbg6XNMnLPIckqXlkVCLjwxctp1JGw7VoONlWSEo7uAQLsrZ7HpcHf5VUxUM6FpIJFCWAkSwLAgGzKbag3/wBtVdnL/KWqdMKpANj/AJ1/eDZuSIkdAEjUAg5mkIY39OoHb13q5NgpcOxaB2R1KkEklWU/mO9Tu0gW4kRWs2ZsqudtCWYXNAeCcYnkR3eNnTMVDoipGQDYnewvS2AtcSS1z5rdoxzY8WuuUZHzZT+6jfFl9A1/ka4xuLgxEUoMiBRpmuLXtS9xxWndBHHlaTKqq5yu/wDPltdQNdTa4o9xPl+DB4dfL4sqgySOxuBtoq7DM1gNNBc0YFwTJ2BWCt14ma4vCgzQ+cZF8hIUk5SbltrfWtM5d5akZW8SQrCh2sM7+QEnN8+g6UhYjiLSOWc2zWDBf4QdB8ulbTj+IKuCkkjIYCEle9smhNTSs5uekdrqJobQv/r7cf3OeVMIiRqU2MaWF7m2pJPcknf0qhzfhSeGS2Uqb+IwO/x63+VVvspxrSYXKwP3TFFY7Fd7fK9OWPw/iRPH/ErL9RVpQGT6TNqFqNc35B9J+fIcRYZTqu4HY9xXWLw9hbdTqpHUf3qYcCxBzfdOApa7FSFAXc3Olq5w4Xw7btnGVdyxtWftPBnqzUX9Sm/f30jt9nfHkgi/ZWTNK0jZAg8zZrat2/xXuY/tAcStCsCjIxBYnObjew2Io5yLy6uFjM8xHjPuWsAg7e9ML8Ow65pfCj1uzNlBvbW9XkV9gF7TzdarQ8dm27vr1mOYrjMUolZ4iCfMEuRfQar2O/11p1wnOLhQPDFiUCHNZWUrcG1tNN9bA1FhOfMLJJaXDBVJt4llbroSLXozxbldJis0EgQaGyqrKR6dt6FByVNzJr2WyuhUdM3l3hvGY2jMmbUmwHW9tj677UFlyQ43xF8vjjXWxMi21A7WoFj+XJFDrhsU/hFz4ygjyevoR1271WwvBFw/EMNK8ryszHNmu1gq/EDTPnKNSy5Bk/P+Oz4rL/CoFvXrQnhfDJMS4RLDNpmY2UCqvGsSJMTK+uUubd8t96KYHjMEY8ota3fNf/fypROZmJTWrVYuwAEduD8nRwtE7OXeMEdAmY3N7el6rfaJxCaGELFGSHdFkkGuSJmsSe19vnVbAc/RnKj6HQa9ddTejmL5hwrkoxDIysrdVse/vrTxaaC8Yn3h0qiKMCwGVbDTQW2r1Y3xXgkiSuIos8V/uzk/d6A3Nzb8a+0wURb9U4tnic8D+zqHKrYqZw+7RKugW+lzv/amHC8l8Oh8xBYMwyFlYm/YXFfJ+JXZcxAv2uemut6gxGKXKfvMpKkWJsrDoSOvvvWYahJzNVKNuB6RnxE6oR4T5XPQuubL6dvlSvx3mGfCyKfEZw5sbWDeh7N8/kRXyXHeJGEVbSkXCgE2a+ntXPHMA0UYGIkzyEXUIACrH1t0/tQgkG/SOWiWOzqffvpCuGx8hjV2UsWJy5ENyF62/wBAoXhcoAXETujs1rLrmjkbW5HQdPwp04EyvhQ50V0uRfZAPhv20+d6y4Y8PiBKwP8A2BiAdxm0A7dPpUkEAfGM01AVt6tfy9vSP+K4dIqMsQQQquVWcm+9iAtrk9B3r5ykhYlDlaLCqAqiwBnPUi9vLt701cV8sLSm33as4v3Cmx+VJf2U4i5lU/yP8yT/AIp2wKwEqId9B2txb7+/vB0+MZOKeIDmKzBGvfNfZjbtqbe1OP2jxWwLsSMxaIe4DbD60k8U4a8XEVnlUrE+JzK29wGvfvT9zHGmKwbKkihGyG9idAb+XrUIDZhH6hlD0HHAA+x/iY+XD6/vgebTQgdf93rROW8ZG+AEUzOY3JRrHVbn4VP7o0/GkjimAGFmykq6lbhtrq19+1NuFwrRCGLNnzkHyjy3J2X0tagpAgmW9e6tTWx63Hv9obaVeGPFh8MDKuIN1jJBcPoLk9FP6VxD9oBZ5Y8ihkYqqg+ZrbkE6HY6UXwXKieOMU8jNIBZdsq2Ow9PzofzJwzAQvGCqJiHcFDr8Qa4J7AnTWrVmAxgTGDUnNiCWI5+P+QZzHj8Ti8MwijkZQy57W232G9LnIuCDY1PEU+Q2AIt950+mp+QrUcBiJgxBhKWGo0K5r9DSRzRxfw+I+IiIDGpGpCgyMurHuQCPpS3ThjLOlrtsaioAuCb3gnnLjj4iZkDEQxkqqjY5Tqx7kmmn7O+ZA6jBzamxEZPVbaqaX8c2FdAsKFnGmYkZL9fMNT8qGDCNEwdGKFSCDroR6gUvcyPe95b20a1Dw7bbcfmR8f4b+z4mWEahG8v9J1H4GmzlHiE2ChZpBeA+YIT5l9R79qBYYPPO0smVmbUm6kX7gX9PlUvMExdI0LWysb2GhFtDYdv1qUFrsPpOrN4m2g1ulzz+0s80cfi/aI8Tg3KyMpEoKkA+jDY0U5RmhkL4lz54xqGNljU9vQm+vYWpRw/DXlTygaHRSArnTfN39O3rXUHC5MrtfKo8r7i4vsem4239KMCoCDbBiK1LTVKJVT5l4v17fTt2j1BJw2ebJ90zEm9roCfQ9aKHlHCZxeLQjQXO9Z3j+X0sChybXudPx2/3SqMUmIRldJjmU+U526eh6U3jkTzpZwfMl/lNQxXKuG38ENbcG7HL6XpZ4jyhFhm8VLsrA2LO5IO40JtvVPjfOs8yBVXwuj5T5j7HtQRkmlQKfEeMgmMEknQ+a3sTv0riRxIOsVTtUEmaNhJiFFre19jXqyxTh0ukskWdTa6ozA263BAJr1GEXv9pZFW4v8AzGl+WIjKAwZkCkvmNwSdgO3X8KuYLBRKrhI0DXyjS5BPXvfX8KsLxKNz5SCrEgH+I26VBhOKxB5FZgCCB5tNbbfgapKFl/dVPf2ZcSJQpIC2uWb/ANNh8rD6Uv8APcBfwXWxIDErcaggdOugotguLxlAAfM5YAAE3a+vT1oTjsbE58SUtHlJADKSCR1XTWiYgi0dpxUSqHsTb73xDHKHEY1wUeZlA8wVSRf4jp60tvy7AjrJ+0ZbSB7FbKq5tPp66UZi5cwbxB1c2jzXcHQuu5PT6Vbbg0Iyid8xYqoUmxdh6b2NdtJAvaM8cU6jFCRcm4t7/iEMXx/DyWhDLIXGq6jykflalvAzJBinMSKkUhCdgMnxMB2uRRPG4TCDxpQ4Vi3hM17gMALgDsBbbtRbGS4eLDKWVWTJdARcsctx8zR2J5tiIBCDaoNmxnvPh4PC4z4twTJeOO5sAG6L/Me9TYrgiphTh0LEoLKT17A2/Osn4jxWaZxJI5LKbqOieijpWicI5lWcYh2ayxhDrochTX/+gfrUU6isbR2p0NeigN7+gPA9YuQ8ryY2QPPmiTKq5dMxt0HYD8abcRxXCYeAyREHwVMUQ3vKF0ynqB1NZ+OZJjLM6sQJNAvRVBFretvzqHAYMyuEYlQATY3va/Sg8QD9Alp9Gxsa7WA4A7dR/E1XhXMUMOBglmksTGNN3Yjew66iso49xFsTPJM2mY6Dso2FFMVwIbhzYC2uthQ/A4SN2YNLlABynKSCy7g2vaoZnqWAhaRNPRLVASSfh0jzyrzuPCijnPmVhGzHqhXyt8iAD70YwrQ+NNn8ISM7GzZc2W/lOvQisqXhUhI+EXP8Wn1sLfOi8XKs+Ml8s4cxqF8QNoqgaDN16/SnJUcDIvKlfT6Yncj2v8/fvEtx4dUnmjFsquSv9Lm4/wB9KsY0An0NDYuET4VzHiGubDIdMuS52NtdSfapcZiLA1XqW3G0hRkZvLHAILXHTMa+cUh8xte4vsSDaqfKGN8SIP1LPf3DGieMOpNESQIIsWvL2AxuFw+EQ4iaJD5mOZlzDMe2+1qXl4pFiX+7d5QrAiSQFbW/gTt60ucOwkIxoHgqWIYuzC/3jDMBr1tenGHhfizCRSBZVBHqL2qw9QldoiEG1i09xqQ2OU2tXuBvnSORSLOo171BzVhnGGmI0bIfqdP1ql9nTlsGI/3oZHT5XuPzpKliCTCYKLASfjcTwq0saoz2GXxFzJcnqL/nSv8Asr2eTFSXYDVlZlFtPi1AyjsBpTtzA1sO1+rov1alXmZAMNPrfy79De1GKhFoA09PJtmdcMlDJeEZkudSBuN7elepe5R4uI4Ch6O1vYgV6gepUDG0bSp0dgvNG/ZYGdYIX++iF81vKNgR71d4rw/DRgSTNsRc7MzDbQUnQAo65LoxFyVOo/xUEilmsbM2YeYsdSe4vr8qUGOcS8unpswPiEAfv8c8esaeLccTDm2GiF9g9rqOrAUv4+d8Y6M0h8oAbMNAPT3618wjOQY2clFFwP5s31tRHApliZn7sfW1c7Xh0XWkPKvm79fuJRlmZIZMPHISrlS2ltBvY9AfxtV3FSMpilAPjKF+8vmUDKRtfU0s8PZ5ZpJGJVPL4ahiBa/73e/6028YlEUTEj4VJsPbaifykARa6hnuT/uLZ+GIAjhZlt5mAZjpawv13301q5ipcRKI2vZIkCrfS3qQevt2qxy74jwBZSCRYaADKDqR671Px7E5Y8i/G+i26evyoMBtojP+058zWPbHeD+HxSvImYqU3YAZr6dzqPlV/F4CbES+FBGJLasPhsg6ZrjrtepOX8NkRPKwXJoxvrb160T5J4kkeMlVmAMoCqCd2S5sPqfpTEy9ukqVazBd45HaKfFYmwkqMIWYggtHchr9hRjl/Gu4dmWWJSRaKRs+XTdTvbX5VpHEeBR4xR4gs6/BIPiHp616XBxRQ+EyAqoIJO4NvivTvBNiBKrawuQXuZnnHZ/uyoNi1lB6gsaE8S4PEqCRc6sijQO2UherDY0J4hiZJMQGF/BiOf8AqUG1/wA6auJYe8LDe6MPwoU8ojXzLEMd47k729qbPs1KhJ1G4db+xXT9aRuWJ/EwkR6hAD7rofyoc/NcnDccH1aCVQJUG5AO6/zD8b2rqR88CuL0zabbxjAxzJ94mbLqOh+RrLOeuGjCqrLJnVjlNxYqTsK1rAYpJo0ljYMjqGVh1B2rN/tY4czzYZB/1u5d+33Y2+d6sVEBFzKlGoytYRS5JxNjiIzoUmJsP4W2/KmuZbj3pEwsngcTt+7Otv8A26fiPxp9j+GqzjMuIcROgFvClOjeKGc9LuSD+YFPnCo7SaaggH8TSdxfA3MsWyyqWU9nG/4/nVz7PuNmUmKTSaMWb1sdG+dSM5gtjEN89MfAYDYsoPtmpR5Dxfh4nERfxqkij1XRv0pw5rW+Hlv0W/01rL8djDh54MUuykZh3U7j6XqRnEHgTSOOrnhkW9zow/8AUg0q8xwXwcgG5W/0/wDqnbIpUONQQCPY0ExvDxkZeguPkaUTbJjlF8CYjnI2JFfK7mjsxHYkfQ16r8zczYMDwyWSWUgCyx5lb91rnYGqUEXlWTcEFvrtTFhRLBFJAEZ18NnDbZRbzA/paoOFcQgEXhBSxdVGR9iAx8obv29qzQoNtv1moK5Fyw+UDYKItfKCzyNZQN9NAB+NXcZILiE6GxuOtlpu4Dw/DjIyIVaMH4r5h3zdzSzxXhmIlxxcILOpINwBlFrD3o2okZnJqVY26RdWO2eym1wug0vbb3oxzJE6gxMpDdj2olw/hClVWSQKRMHdbXP3b/DfubUV4useKkKPdHU+Vh/CTe1MNPdY9YkagKxHSLHCFZY2lIIQnLmt5SR696r4bGCSWQHoot/SSb2+YFO+PhTwYsDHa7hrA/yC5PoT+tJfBOEk8Q8OVSnkdbXsdrj36UJo+Y2hjUDZmaFg8WskaslmiK6f02tWNcz4VsjOpIZJWNxuNdLH00p35Txv7HLiMC+YopaWJrX+7Y+Ye4b86r4fhIlgxGZXR8zWv/MNiPSmsLkWlemwUG/Ek+zn7RJFRExbZ1+ESnQqf5+/v9afeYb4iBlUgFhYEHQqfX/d6yTA8CsmIhUM4TKcwFyjMNvwo9gsGYvCaF2ACJlAYlL2FzbbXrS2r7Lhu8Z4KuFZObQVMLNNEwAK+Vh8v7Gj2EGaABv4R+Ven4QJDi5LkPnNjuLgDS3WpcbE0aklSF72Nql1K5hU6gfEEcmgKs8XSOdwP6WAI/M0K5+4f4kQkH/jNz7MQLfW1GuAYeT72YowR1je9tBqw196tYbDJMWSQZlOUEdNSf7CoVT4lpzOPCv75gb7EechA74KdrQsS0bE6I/Uegb8D71p3N7JNGgjIeQNcBdTktqfbasFx3Cf2TETjcX8mmmQ/wC/hTd9kuGKs8xbysStraa7a/8Ar+NWT2lMAfqi9zuTHLG1iHRwRfQ20rQMPNdbjYgEexqLnPh6SMQ1tUkybaswAtQ3gchEEYb4guU+66Umqu0CWaD7yZJxmS3hn1I+ope5bbJxRCP/ACZ4yPXLcflThwghplBtazXuL3BG1VsVho8JMsq2W+MisOwZQpA+RqaaXF4NapY7YZ5rwsngSrlIYobZtAfSsn4yM+GJ7Lf5A1unMeFaWLJHbPmU6nTTcGs1524WkWEkQIFYLY5e2h/QUYTMUamIT5Nx/i4GI9VXIfdNPytV7EKxViFYgAXIBIG9UOS+Fy5WTSzRwuNbXYpZgPmv401cCSSN5Y3FlshGoIJN7/pSWp7jaPWttF+s/OM48zf1N+deolzfDkx2JW1rSv8Aib/rXyrYlOabBx/HwyHCjDJKzLeyi5aPvcHagHG8bPIVmihClWVHRFcqumntVsc2YYNhpQs3jxhFnkuPPEBqPU7dBaisPGQzjC4HEqkUrM7yTi5Dte6i/fTfr1qqBtjDUvAkHOs4lRnewC5fKNWXsb70ywfaHhvFzmOQACwsVPz3oFFjsBHhXw8kDSzkuGmQXAcfCysdraaDeoMPyk6kS5WkgNrOuVbEi7XvoCNR2vYXoi/aQG6SlxbiDPjHmw0pjR3VvPsCd8yi9xWgjiWHMJAxkbz2BVmUouYdADsDWfcWGDbFKyRyJh7jMqtZyuXXfYg3969gOWZ8RHJJhv8AriBzM7AE7mw7m29de+JO8TS+WJi7ftM5iV8mREDqxAvqx7E6fSo+L8Tiwkry+GXeUCzBgq2A0W52+W9IH/4djvCWZNVtZ76lSNyB+8vqKH8wcODQWVizq6C1wVJym5Xub2otw4gkrNc4IMO0gxTPGspjKhWdMyhiCQdfQUD4vzWkOIaNYmmVidYyCc2xUj/d6xDLZfn+lFuCYkQSriAhJhZWF7Zc3TTrTDxIuJuXIvB1hhkl+8zYhszGTRrdBa+w/Gkrl/mARSYiCUooSR/DzE5wQTfS2x/CoV+1Sf8AeyW/o/zSvLxCN5HlLkM7FjoLXNJqoHXaY6k21rzTsXzPFFHGf+wyXPk1Ja+1gKa+JIV4fKALyGJjY75sp0+tZfy5zXDBlLwiYp8BzBcvra29Mj/aTA7WkhkCdQGU39N6JbgWMF7E4jP9nuFnXDu+JIJcjKoAsqBQLetI3MPGDh+JmFEQLIqk76EX6dKZsB9omBVBGiSRquiqEFgPSxpC55xMU+NixMBJAUB7gqQQfX0ozaAAZ1ieXcbj5LLcQE+aTLZNCdhuSKfFih4fho4BsBa50ZmHU1nvDeNGF2IVjfqGcC3sDaivEposTHmJGddQGOt/nUbpO20mbiD4mQfsiq8oazZlLrGtviJ6dKdeCcBjbxEljB+FgdiLjv7g/Wsx4NJiZY0w2HYq4dtFULcE7sw1IHrtWycs8MfC4dY5HMkmpZzfUnoPQVK55nHy8GK/GMPHhJCyI2wFgbi59z6Vm/PDPiskgRkkj1VQb5tRbQda0n7R8PI0IlR8ojYF1t8ak/pvQzgnFYUXzwxZtg+Yhz+Gnyrr2g2LZhXHcwRQxoZWtJZTlGrXtr7VW5m4bHK8c8jlI2QXjIJzXsRew0pJ/a7yNkRC1yAXLNsdKa8biDLEkWKmjiQ5blEYE22A10+lDuzJK4hvl6RHkzJcqoy7ELe99L185n4pHhc00jZVIAGm7dvc1NhcZhoYwqSLlAsMoY/pS3zTjosXDJAVc3y5Wy2FwdDrRYtBzeZTzvj4sTijLCSVKqCSCt2A10r1F5uVkBAF9tfevVG4Q9pgQJX3w9LdPwqQV1aukkT5HMygKD5e3TWjc/N+IfD/ALI2XwdelmIJvYnqAdtqC2r1q7aIBWEuXeJx4fEeNJCJU1vF082l9dNKcG56RGQ4SMxYYG80WVRe51C9BoBsdb1ntq6RrAgdRY+1SVxiRaP/AAXmOaadYcKRh4ZJWyhgCEBXUH31Nh1qwnBY4MfFHicrxxgvI0anXS4Li17d7dPSs4eVsuW/lHSp4+JzAMBLJ5hlbzG5Xtfeh8MmDaaPzJ/8TjJZFSMtiHWNImjDIvim+X06i5I2FLMHBFXxMM7RhDqHDGwa4uLEXtta9tt6r8oxZ3L5mDxkMrKbEMAbelSTYomUtlX4TpbQ5jY6H3pVRje0Hd0jFz1yjg4IEiRC2JOUmbMV06+XbX8O9UsP9k5k4euISW+IZc4U2yZbaL7/AN7Vzi8Y0ZKDzDMB5rk21Peq2A5xxTRrhy4yoWysLh8pQ+Qm9ivyv60SMTc9JIaD+P8AKBwKxidbyG5BU3jcC/8AihPLnLUuMlWONlDN0JNlA3v7CtC5Svj8QsGKZpI4o2Ki9jqRudzoBXuKctQwQYmWLOrRYkRrZtMhtodL/vUQvyJNzFHiXK37LJLFM7F0JyldipHkYe/4WtQ6TB+eIJJZWsHa9whJ7b0zcTiH7NhsQbtI5mDlvNcRPZd9dvWq3A8IpaIMLgyoDfqCV/uaWWO6RcyjzRg/2d4IoWaSR48zLbMcxOlrb6flX2XCumEE5+IXzqwItY/Dboa1L7W8IqYWKaMBJEmjysoAIGtIfFsQZiPE1FkJHRiRe7d7UTkraTubEUo+Klr2XYEmx6Cp4eYZF+F5VHo7W/OiP/x8ck8q5Qg8NL5PLe5/xVOPhyESR62EiAHqMzgX97VIqAzvEzadS82SMpR5pSp0IJLA1EeJowF3273FBuYMGIcQ8SklVOha1/yqkjU3bD3GP+A4RiWHiYfBTSjUhxoht271PxPjZ8iLLHI3hhiYwwMbdUa53HWrvMOMccJ4cFYi5lvYkfC2n0oRy3g1YSyEXYCUdNQB1oXsBxO3kS7wfmAs2RzRviLAJcelZ1hHIcWPWm7ETEx6mgOI4CWsQATfTavUMMh016V6lxthP//Z"
          ],
          _id: "2345702sdfa1234"
        },
        {
          title: "this is about dogs",
          content: "this article is all about dogs, nothing else matters",
          imagePaths: [
            "https://cdn.pixabay.com/photo/2018/05/07/10/48/husky-3380548__340.jpg",
            "https://www.google.de/url?sa=i&source=images&cd=&ved=2ahUKEwjYnqzY2ILkAhULPVAKHbhCA-YQjRx6BAgBEAQ&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fdog%2F&psig=AOvVaw1pTvfEurSVEeqTC8zDuZLz&ust=1565883310699950"
          ],
          _id: "23457asdf723495lkj"
        }
      ];

    	const writable_props = ['navigate'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Startpage> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('navigate' in $$props) $$invalidate('navigate', navigate = $$props.navigate);
    	};

    	return { navigate, articles };
    }

    class Startpage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$7, safe_not_equal, ["navigate"]);

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.navigate === undefined && !('navigate' in props)) {
    			console.warn("<Startpage> was created without expected prop 'navigate'");
    		}
    	}

    	get navigate() {
    		throw new Error("<Startpage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navigate(value) {
    		throw new Error("<Startpage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Router.svelte generated by Svelte v3.8.0 */
    const { Error: Error_1 } = globals;

    const file$8 = "src/Router.svelte";

    function create_fragment$8(ctx) {
    	var div, header1, t0, main, t1, footer1, current;

    	var header0 = new Header({
    		props: { navigate: ctx.injectables.navigate },
    		$$inline: true
    	});

    	var switch_instance_spread_levels = [
    		ctx.params
    	];

    	var switch_value = ctx.component;

    	function switch_props(ctx) {
    		let switch_instance_props = {};
    		for (var i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}
    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	var footer0 = new Footer({
    		props: { navigate: ctx.injectables.navigate },
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			div = element("div");
    			header1 = element("header");
    			header0.$$.fragment.c();
    			t0 = space();
    			main = element("main");
    			if (switch_instance) switch_instance.$$.fragment.c();
    			t1 = space();
    			footer1 = element("footer");
    			footer0.$$.fragment.c();
    			attr(header1, "class", "svelte-13bh124");
    			add_location(header1, file$8, 104, 2, 2627);
    			attr(main, "class", "svelte-13bh124");
    			add_location(main, file$8, 107, 2, 2697);
    			attr(footer1, "class", "svelte-13bh124");
    			add_location(footer1, file$8, 110, 2, 2770);
    			attr(div, "class", "svelte-13bh124");
    			add_location(div, file$8, 103, 0, 2619);
    		},

    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    			append(div, header1);
    			mount_component(header0, header1, null);
    			append(div, t0);
    			append(div, main);

    			if (switch_instance) {
    				mount_component(switch_instance, main, null);
    			}

    			append(div, t1);
    			append(div, footer1);
    			mount_component(footer0, footer1, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var header0_changes = {};
    			if (changed.injectables) header0_changes.navigate = ctx.injectables.navigate;
    			header0.$set(header0_changes);

    			var switch_instance_changes = (changed.params) ? get_spread_update(switch_instance_spread_levels, [
    									ctx.params
    								]) : {};

    			if (switch_value !== (switch_value = ctx.component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, main, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			var footer0_changes = {};
    			if (changed.injectables) footer0_changes.navigate = ctx.injectables.navigate;
    			footer0.$set(footer0_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(header0.$$.fragment, local);

    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			transition_in(footer0.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(header0.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			transition_out(footer0.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			destroy_component(header0);

    			if (switch_instance) destroy_component(switch_instance);

    			destroy_component(footer0);
    		}
    	};
    }

    function instance$6($$self, $$props, $$invalidate) {
    	

      // get the route
      let route = location.pathname;

      // if you would want to access the url params you would have to do it like that
      // let param = new URL(location.pathname).searchParams.get("test");

      // react when an entry of the browser history is accessed
      window.addEventListener("popstate", e => {
        injectables.navigate(e.state);
      });

      // the injectable functions and values are defined here
      let injectables = {
        navigate: nav => {
          $$invalidate('route', route = nav);
        },
        ROUTER_ANIMATION_DURATION: 250
      };

      const routes = [
        {
          route: "/",
          component: Startpage,
          props: ["ROUTER_ANIMATION_DURATION", "navigate"]
        },
        {
          route: "/calendar",
          component: Calendar,
          props: ["ROUTER_ANIMATION_DURATION"]
        },
        {
          route: "*",
          component: NotFound,
          props: ["navigate"]
        }
      ];

      let params = {};
      let component;

      function prepareAndSwitch() {
        // find the route that matches (starts with) the locations pathname
        let matchingRoute = routes.find(el => {
          if (el.route === "/") {
            // on the root location the path has to match exactly
            return location.pathname === "/";
          } else if (
            el.route.split("/").filter(el => el !== "").length ===
            location.pathname.split("/").filter(el => el !== "").length
          ) {
            // first check if the amount of sub-paths is the same, then match the strings
            return location.pathname.startsWith(el.route);
          }
          return false;
        });
        // if nothing matches take default name
        if (!matchingRoute) {
          matchingRoute = routes.filter(el => el.route === "*")[0];
        }
        // add all the configured props to the params object
        if (matchingRoute.props && matchingRoute.props.length > 0) {
          matchingRoute.props.forEach(prop => {
            if (injectables[prop]) {
              params[prop] = injectables[prop]; $$invalidate('params', params);
            } else {
              throw new Error("broken prop: " + prop);
            }
          });
        }
        // finally set the component so the routing takes place
        $$invalidate('component', component = matchingRoute.component);
      }

    	$$self.$$.update = ($$dirty = { route: 1 }) => {
    		if ($$dirty.route) { {
            history.pushState(route, "route", route);
            prepareAndSwitch();
          } }
    	};

    	return { injectables, params, component };
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$8, safe_not_equal, []);
    	}
    }

    const app = new Router({
      target: document.body,
      props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
