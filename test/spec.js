//SETTINGS, VARS, UTILITY FUNCTIONS
jasmine.getFixtures().fixturesPath = 'fixtures';
$.waypoints.settings.scrollThrottle = 10;
$.waypoints.settings.resizeThrottle = 20;
var standardWait = 50,
wputil = {
	getScrollElement: function() {
		var scrollElement = 'html, body';
		$('html, body').each(function () {
			var initScrollTop = $(this).attr('scrollTop');
			$(this).attr('scrollTop', initScrollTop + 1);
			if ($(this).attr('scrollTop') == initScrollTop + 1) {
				scrollElement = this.nodeName.toLowerCase();
				$(this).attr('scrollTop', initScrollTop);
				return false;
			}    
		});
		return $(scrollElement);
	}
};

// Go tests, go
describe('jQuery Waypoints', function() {
	var $se,
	$e,
	hit = false;
	
	beforeEach(function() {
		loadFixtures('standard.html');
		$se = wputil.getScrollElement();
	});
	
	describe('.waypoint()', function() {
		beforeEach(function() {
			$e = $('#same1').waypoint();
			spyOnEvent($e, 'waypoint.reached');
			$e.bind('waypoint.reached', function() {
				hit = true;
			});
		});
		
		it('should create a waypoint', function() {
			expect($.waypoints().length).toEqual(1);
		});
		
		it('should be bindable through waypoint.reached', function() {
			runs(function() {
				$se.scrollTop($e.offset().top + 100);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
				expect(hit).toEqual(true);
			});
		});
		
		it('should use the default offset', function() {
			runs(function() {
				$se.scrollTop($e.offset().top - 1);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				expect(hit).toEqual(false);
				$se.scrollTop($e.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
			});
		});
	});
	
	describe('.waypoint(callback)', function() {
		var currentDirection;
		
		beforeEach(function() {
			$e = $('#same1').waypoint(function(event, direction) {
				currentDirection = direction;
				hit = true;
			});
			spyOnEvent($e, 'waypoint.reached');
		});
		
		it('should create a waypoint', function() {
			expect($.waypoints().length).toEqual(1);
		});
		
		it('should trigger the callback', function() {
			runs(function() {
				$se.scrollTop($e.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect(hit).toEqual(true);
			});
		});
		
		it('should pass correct directions', function() {
			runs(function() {
				$se.scrollTop($e.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect(currentDirection).toEqual('down');
				$se.scrollTop($e.offset().top - 1);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect(currentDirection).toEqual('up');
			});
		});
	});
	
	describe('.waypoint(options)', function() {
		beforeEach(function() {
			$e = $('#same1');
			spyOnEvent($e, 'waypoint.reached');
		});
		
		it('should create a waypoint', function() {
			$e.waypoint({
				offset: 1,
				triggerOnce: true
			});
			expect($.waypoints().length).toEqual(1);
		});
		
		it('should respect a px offset', function() {
			runs(function() {
				$e.waypoint({
					offset: 50
				});
				$se.scrollTop($e.offset().top - 51);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				$se.scrollTop($e.offset().top - 50);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
			});
		});
		
		it('should respect a % offset', function() {
			runs(function() {
				$e.waypoint({
					offset: '37%'
				});
				$se.scrollTop($e.offset().top - $.waypoints('viewportHeight') * .37 - 1);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				$se.scrollTop($e.offset().top - $.waypoints('viewportHeight') * .37);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
			});
		});
		
		it('should respect a function offset', function() {
			runs(function() {
				$e.waypoint({
					offset: function() {
						return $(this).height() * -1;
					}
				});
				$se.scrollTop($e.offset().top + $e.height() - 1);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				$se.scrollTop($e.offset().top + $e.height());
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
			});
		});
		
		it('should respect the bottom-in-view function alias', function() {
			var inview = $e.offset().top - $.waypoints('viewportHeight') + $e.outerHeight();
			
			runs(function() {
				$e.waypoint({
					offset: 'bottom-in-view'
				});
				$se.scrollTop(inview - 1);
			});
			
			waits(standardWait);

			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				$se.scrollTop(inview);
			});

			waits(standardWait);

			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
			});
		});
		
		it('should destroy the waypoint if triggerOnce is true', function() {
			runs(function() {
				$e.waypoint({
					triggerOnce: true
				});
				$se.scrollTop($e.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect($.waypoints().length).toBeFalsy();
			});
		});
		
		it('should trigger if continuous is true and waypoint is not last', function() {
			var $f = $('#near1'),
			$g = $('#near2'),
			hitcount = 0;
			
			spyOnEvent($f, 'waypoint.reached');
			
			runs(function() {
				$e.add($f).add($g).waypoint(function() {
					hitcount++;
				});
				$se.scrollTop($g.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect(hitcount).toEqual(3);
			});
		});
		
		it('should not trigger if continuous is false and waypoint is not last', function() {
			var $f = $('#near1'),
			$g = $('#near2'),
			hitcount = 0;
			
			spyOnEvent($f, 'waypoint.reached');
			
			runs(function() {
				$e.add($f).add($g).waypoint(function() {
					hitcount++;
				});
				$f.waypoint({
					continuous: false
				});
				$se.scrollTop($g.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect(hitcount).toEqual(2);
			});
		});
		
		it('should trigger if continuous is false but the waypoint is last', function() {
			var $f = $('#near1'),
			$g = $('#near2'),
			hitcount = 0;
			
			spyOnEvent($f, 'waypoint.reached');
			
			runs(function() {
				$e.add($f).add($g).waypoint(function() {
					hitcount++;
				});
				$g.waypoint({
					continuous: false
				});
				$se.scrollTop($g.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect(hitcount).toEqual(3);
			});
		});
		
		it('should use the handler option if provided', function() {
			var hitcount = 0;
			
			runs(function() {
				$e.waypoint({
					handler: function(e, dir) {
						hitcount++;
					}
				});
				$se.scrollTop($e.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect(hitcount).toEqual(1);
			});
		});
	});
	
	describe('.waypoint(callback, options)', function() {
		beforeEach(function() {
			$e = $('#same1').waypoint(function() {
				hit = true;
			}, {
				offset:-1
			});
			spyOnEvent($e, 'waypoint.reached');
		});
		
		it('should create a waypoint', function() {
			expect($.waypoints().length).toEqual(1);
		});
		
		it('should respect options', function() {
			runs(function() {
				$se.scrollTop($e.offset().top);
			});

			waits(standardWait);

			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				$se.scrollTop($e.offset().top + 1);
			});

			waits(standardWait);

			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
			});
		});
		
		it('should fire callback', function() {
			runs(function() {
				$se.scrollTop($e.offset().top + 1);
			});

			waits(standardWait);

			runs(function() {
				expect(hit).toEqual(true);
			});
		});
	});
	
	describe('.waypoint("remove")', function() {
		beforeEach(function() {
			$e = $('#same1').waypoint(function() {
				hit = true;
			});
			spyOnEvent($e, 'waypoint.reached');
			$e.waypoint('remove');
		});
		
		it('should remove waypoint from list of waypoints', function() {
			expect($.waypoints().length).toBeFalsy();
		});
		
		it('should no longer trigger waypoint.reached', function() {
			runs(function() {
				$se.scrollTop($e.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
			});
		});
		
		it('should preserve callbacks if .waypoint recalled', function() {
			runs(function() {
				$e.waypoint();
				$se.scrollTop($e.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect(hit).toEqual(true);
			});
		});
	});
	
	describe('.waypoint("destroy")', function() {
		beforeEach(function() {
			$e = $('#same1').waypoint(function() {
				hit = true;
			});
			spyOnEvent($e, 'waypoint.reached');
			$e.waypoint('destroy');
		});
		
		it('should remove waypoint from list of waypoints', function() {
			expect($.waypoints().length).toBeFalsy();
		});
		
		it('should no longer trigger waypoint.reached', function() {
			runs(function() {
				$se.scrollTop($e.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
			});
		});
		
		it('should not preserve callbacks if .waypoint recalled', function() {
			runs(function() {
				$e.waypoint();
				$se.scrollTop($e.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect(hit).toEqual(false);
			});
		});
	});
	
	describe('$.waypoints()', function() {
		it('should start as an empty jQuery object', function() {
			expect($.waypoints().length).toBeFalsy();
			expect($.waypoints()).toEqual($());
		});
		
		it('should return correct waypoint elements', function() {
			$e = $('#same1').waypoint();
			expect($.waypoints().get()).toEqual($e.get());
		});
		
		it('should work with multiple waypoints', function() {
			$e = $('.sameposition, #top').waypoint();
			expect($.waypoints().get()).toEqual($e.get());
			$e = $e.add($('#near1').waypoint());
			expect($.waypoints().get()).toEqual($e.get());
		});
	});
	
	describe('$.waypoints("refresh")', function() {
		var currentDirection;
		
		beforeEach(function() {
			$e = $('#same1').waypoint(function(event, direction) {
				currentDirection = direction;
			});
			spyOnEvent($e, 'waypoint.reached');
		});
		
		it('should trigger waypoint.reached when refresh crosses current scroll', function() {
			runs(function() {
				$se.scrollTop($e.offset().top - 1);
			});
			
			waits(standardWait);
			
			runs(function() {
				$e.css('top', ($e.offset().top - 50) + 'px');
				$.waypoints('refresh');
				expect(currentDirection).toEqual('down');
				$e.css('top', $e.offset().top + 50 + 'px');
				$.waypoints('refresh');
				expect(currentDirection).toEqual('up');
			});
		});
		
		it('should not trigger waypoint.reached when refresh crosses current scroll if prevented by option', function() {
			runs(function() {
				$se.scrollTop($e.offset().top - 1);
				$e.waypoint({ onlyOnScroll:true });
			});
			
			waits(standardWait);
			
			runs(function() {
				$e.css('top', ($e.offset().top - 50) + 'px');
				$.waypoints('refresh');
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				$e.css('top', $e.offset().top + 50 + 'px');
				$.waypoints('refresh');
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
			});
		});
		
		it('should update the offset', function() {
			runs(function() {
				$se.scrollTop($e.offset().top - 51);
				$e.css('top', ($e.offset().top - 50) + 'px');
				$.waypoints('refresh');
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				$se.scrollTop($e.offset().top);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
			});
		});
	});
	
	describe('$.waypoints("viewportHeight")', function() {
		it('should return window innerheight if it exists', function() {
			if (window.innerHeight) {
				expect($.waypoints('viewportHeight')).toEqual(window.innerHeight);
			}
			else {
				expect($.waypoints('viewportHeight')).toEqual($(window).height());
			}
		});
	});
	
	describe('$.waypoints.settings', function() {
		var count = 0;
		var curID;
		
		beforeEach(function() {
			$('.sameposition, #near1, #near2').waypoint(function() {
				count++;
				curID = $(this).attr('id');
			});
		});
		
		it('should throttle the scroll check', function() {
			runs(function() {
				$se.scrollTop($('#same1').offset().top);
				expect(count).toEqual(0);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect(count).toEqual(2);
			});
		});
		
		it('should throttle the resize event and call refresh', function() {
			runs(function() {
				$('#same1').css('top', "-1000px");
				$(window).resize();
				expect(count).toEqual(0);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect(count).toEqual(1);
			});
		});
		
		afterEach(function() {
			count = 0;
		});
	});
	
	describe('non-window scroll context', function() {
		var $inner;
		
		beforeEach(function() {
			$inner = $('#bottom');
		});
		
		it('should trigger the waypoint within its context', function() {
			$e = $('#inner3').waypoint({
				context: '#bottom'
			});
			
			runs(function() {
				spyOnEvent($e, 'waypoint.reached');
				$inner.scrollTop(199);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				$inner.scrollTop(200);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
			});
		});
		
		it('should respect % offsets within context', function() {
			$e = $('#inner3').waypoint({
				context: '#bottom',
				offset: '100%'
			});
			
			runs(function() {
				spyOnEvent($e, 'waypoint.reached');
				$inner.scrollTop(149);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				$inner.scrollTop(150);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
			});
		});
		
		it('should respect % offsets within context', function() {
			$e = $('#inner3').waypoint({
				context: '#bottom',
				offset: function() {
					return $(this).height() / 2;
				}
			});
			
			runs(function() {
				spyOnEvent($e, 'waypoint.reached');
				$inner.scrollTop(149);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				$inner.scrollTop(150);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
			});
		});
		
		it('should respect bottom-in-view alias', function() {
			$e = $('#inner3').waypoint({
				context: '#bottom',
				offset: 'bottom-in-view'
			});
			
			runs(function() {
				spyOnEvent($e, 'waypoint.reached');
				$inner.scrollTop(249);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').not.toHaveBeenTriggeredOn($e);
				$inner.scrollTop(250);
			});
			
			waits(standardWait);
			
			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
			});
		});
		
		afterEach(function() {
			$inner.scrollTop(0);
		});
	});
	
	afterEach(function() {
		$.waypoints().waypoint('destroy');
		$se.scrollTop(0);
		hit = false;
		waits(standardWait);
	});
	
	describe('Waypoints added after load, Issue #28', function() {
		it('should trigger down on new but already reached waypoints', function() {
			runs(function() {
				$e = $('#pretop');
				spyOnEvent($e, 'waypoint.reached');
			});
			
			runs(function() {
				$e.waypoint(function(e, dir) {
					if (dir === 'down') {
						hit = true;
					}
				});
			});

			waits(standardWait);

			runs(function() {
				expect('waypoint.reached').toHaveBeenTriggeredOn($e);
				expect(hit).toBeTruthy();
			});
		});
		
		
	});
});
