/* global describe, it, before, global */
/* eslint-disable no-unused-expressions */
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
                firstVisibleIndex: 0,
                direction: 'next',
                visibleItemsCount: 4,
                scrollStepDistance: 9
            });

            act2 = Carousel.prototype.getIndexToScrollTo({
                totalItems: 10,
                firstVisibleIndex: 6,
                direction: 'next',
                visibleItemsCount: 5,
                scrollStepDistance: 6
            });

            expect(act1).to.be.below(11);
            expect(act2).to.not.be.above(10);
        });

        it('never give index less than 0', () => {
            let act1,
                act2;

            act1 = Carousel.prototype.getIndexToScrollTo({
                totalItems: 10,
                firstVisibleIndex: 0,
                direction: 'previous',
                visibleItemsCount: 4,
                scrollStepDistance: 9
            });
            act2 = Carousel.prototype.getIndexToScrollTo({
                totalItems: 10,
                firstVisibleIndex: 4,
                direction: 'previous',
                visibleItemsCount: 4,
                scrollStepDistance: 6
            });

            expect(act1).to.not.be.below(0);
            expect(act2).to.not.be.below(0);
        });
    });

    describe('.isNextButtonVisible', () => {
        context('all items are visible', () => {
            it(`returns false`, () => {
                let firstVisibleIndex,
                    isNextButtonVisible,
                    totalItems,
                    visibleItemsCount;

                firstVisibleIndex = 0;
                totalItems = 10;
                visibleItemsCount = 10;

                isNextButtonVisible = Carousel.prototype.isNextButtonVisible(firstVisibleIndex, totalItems, visibleItemsCount);

                expect(isNextButtonVisible).to.be.false;
            });
        });

        context('no more items to display', () => {
            it(`returns false`, () => {
                let firstVisibleIndex,
                    isNextButtonVisible,
                    totalItems,
                    visibleItemsCount;

                firstVisibleIndex = 6;
                totalItems = 10;
                visibleItemsCount = 4;

                isNextButtonVisible = Carousel.prototype.isNextButtonVisible(firstVisibleIndex, totalItems, visibleItemsCount);

                expect(isNextButtonVisible).to.be.false;
            });
        });

        context('there are items to display', () => {
            it(`returns true`, () => {
                let firstVisibleIndex,
                    isNextButtonVisible,
                    totalItems,
                    visibleItemsCount;

                firstVisibleIndex = 5;
                totalItems = 10;
                visibleItemsCount = 4;

                isNextButtonVisible = Carousel.prototype.isNextButtonVisible(firstVisibleIndex, totalItems, visibleItemsCount);

                expect(isNextButtonVisible).to.be.true;
            });
        });
    });

    describe('.isPrevButtonVisible', () => {
        it(`returns false if carousel isn't scrolled`, () => {
            let isPrevButtonVisible;

            isPrevButtonVisible = Carousel.prototype.isPrevButtonVisible(0);

            expect(isPrevButtonVisible).to.be.false;
        });

        it(`returns true if crousel is scrolled`, () => {
            let isPrevButtonVisible;

            isPrevButtonVisible = Carousel.prototype.isPrevButtonVisible(4);

            expect(isPrevButtonVisible).to.be.true;
        });
    });

    describe('getVisibleItemsCount', () => {
        // I dunno what to test for :-(
        it(`returns correct results`, () => {
            let countWithMargin,
                countWithNoMargin,
                expectedWithMargin,
                expectedWithNoMargin;

            expectedWithNoMargin = (500 - 20) / 40;
            expectedWithMargin = Math.floor((500 - 22) / 41 - 1);
            countWithNoMargin = Carousel.prototype.getVisibleItemsCount({
                firstVisibleIndex: 4,
                maxWidth: 500,
                totalItems: 10,
                itemWidth: 40,
                controlWidth: 10,
                itemMargin: 0
            });
            countWithMargin = Carousel.prototype.getVisibleItemsCount({
                firstVisibleIndex: 4,
                maxWidth: 500,
                totalItems: 10,
                itemWidth: 40,
                controlWidth: 10,
                itemMargin: 1
            });

            expect(countWithNoMargin).to.be.equal(expectedWithNoMargin);
            expect(countWithMargin).to.be.equal(expectedWithMargin);
        });
    });
});
