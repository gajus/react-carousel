/* global describe, it, before, global */
import chai, {
    expect
} from 'chai';
import sinonChai from 'sinon-chai';
import mockery from 'mockery';

chai.use(sinonChai);

describe('Carousel', () => {
    let Carousel;

    beforeEach(() => {
        mockery.enable({
            warnOnUnregistered: false
        });
        mockery.registerMock('./carousel.scss', {});

        Carousel = require('../src/index.js');
    });
    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('.getIndexToScrollTo', () => {
        it('never give index larger than total items', () => {
            let act1,
                act2;

            act1 = Carousel.prototype.getIndexToScrollTo({
                totalItems: 10,
                visibleIndex: 0,
                direction: 'next',
                displayWindowSize: 4,
                stepDistance: 9
            });

            act2 = Carousel.prototype.getIndexToScrollTo({
                totalItems: 10,
                visibleIndex: 6,
                direction: 'next',
                displayWindowSize: 5,
                stepDistance: 6
            });

            expect(act1).to.be.below(11);
            expect(act2).to.not.be.above(10);
        });

        it('never give index less than 0', () => {
            let act1,
                act2;

            act1 = Carousel.prototype.getIndexToScrollTo({
                totalItems: 10,
                visibleIndex: 0,
                direction: 'previous',
                displayWindowSize: 4,
                stepDistance: 9
            });
            act2 = Carousel.prototype.getIndexToScrollTo({
                totalItems: 10,
                visibleIndex: 4,
                direction: 'previous',
                displayWindowSize: 4,
                stepDistance: 6
            });

            expect(act1).to.not.be.below(0);
            expect(act2).to.not.be.below(0);
        });
    });

    describe('.isNextButtonVisible', () => {
        it(`doesn't give the wrong results`);
    });

    describe('.isPrevButtonVisible', () => {
        it(`doesn't give the wrong results`);
    });

    describe('getVisibleItemsCount', () => {
        it(`doesn't give the wrong results`);
    });
});
