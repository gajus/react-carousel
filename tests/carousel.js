/* global describe, it, before, global, require */
/* eslint-disable max-nested-callbacks */

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

        /* eslint-disable import/no-require, global-require */
        Carousel = require('../src/index.js').default;
        /* eslint-enable import/no-require, global-require */
        Carousel = new Carousel();
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('.getIndexToScrollTo', () => {
        it('never give index larger than total items', () => {
            let act1,
                act2;

            act1 = Carousel.getIndexToScrollTo({
                direction: 'next',
                firstVisibleIndex: 0,
                scrollStepDistance: 9,
                totalItems: 10,
                visibleItemsCount: 4
            });

            act2 = Carousel.getIndexToScrollTo({
                direction: 'next',
                firstVisibleIndex: 6,
                scrollStepDistance: 6,
                totalItems: 10,
                visibleItemsCount: 5
            });

            expect(act1).to.be.below(11);
            expect(act2).to.not.be.above(10);
        });

        it('never give index less than 0', () => {
            let act1,
                act2;

            act1 = Carousel.getIndexToScrollTo({
                direction: 'previous',
                firstVisibleIndex: 0,
                scrollStepDistance: 9,
                totalItems: 10,
                visibleItemsCount: 4
            });
            act2 = Carousel.getIndexToScrollTo({
                direction: 'previous',
                firstVisibleIndex: 4,
                scrollStepDistance: 6,
                totalItems: 10,
                visibleItemsCount: 4
            });

            expect(act1).to.not.be.below(0);
            expect(act2).to.not.be.below(0);
        });
    });

    describe('.isNextButtonVisible', () => {
        context('all items are visible', () => {
            it('returns false', () => {
                let firstVisibleIndex,
                    isNextButtonVisible,
                    totalItems,
                    visibleItemsCount;

                firstVisibleIndex = 0;
                totalItems = 10;
                visibleItemsCount = 10;

                isNextButtonVisible = Carousel.isNextButtonVisible(firstVisibleIndex, totalItems, visibleItemsCount);

                expect(isNextButtonVisible).to.equal(false);
            });
        });

        context('no more items to display', () => {
            it('returns false', () => {
                let firstVisibleIndex,
                    isNextButtonVisible,
                    totalItems,
                    visibleItemsCount;

                firstVisibleIndex = 6;
                totalItems = 10;
                visibleItemsCount = 4;

                isNextButtonVisible = Carousel.isNextButtonVisible(firstVisibleIndex, totalItems, visibleItemsCount);

                expect(isNextButtonVisible).to.equal(false);
            });
        });

        context('there are items to display', () => {
            it('returns true', () => {
                let firstVisibleIndex,
                    isNextButtonVisible,
                    totalItems,
                    visibleItemsCount;

                firstVisibleIndex = 5;
                totalItems = 10;
                visibleItemsCount = 4;

                isNextButtonVisible = Carousel.isNextButtonVisible(firstVisibleIndex, totalItems, visibleItemsCount);

                expect(isNextButtonVisible).to.equal(true);
            });
        });
    });

    describe('.isPrevButtonVisible', () => {
        it('returns false if carousel isn\'t scrolled', () => {
            let isPrevButtonVisible;

            isPrevButtonVisible = Carousel.isPrevButtonVisible(0);

            expect(isPrevButtonVisible).to.equal(false);
        });

        it('returns true if crousel is scrolled', () => {
            let isPrevButtonVisible;

            isPrevButtonVisible = Carousel.isPrevButtonVisible(4);

            expect(isPrevButtonVisible).to.equal(true);
        });
    });

    describe('getVisibleItemsCount', () => {
        // I dunno what to test for :-(
        it('returns correct results', () => {
            let countWithMargin,
                countWithNoMargin,
                expectedWithMargin,
                expectedWithNoMargin;

            expectedWithNoMargin = (500 - 20) / 40;
            expectedWithMargin = Math.floor((500 - 22) / 41);
            countWithNoMargin = Carousel.getVisibleItemsCount({
                controlWidth: 10,
                firstVisibleIndex: 4,
                itemMargin: 0,
                itemWidth: 40,
                maxWidth: 500,
                totalItems: 10
            });
            countWithMargin = Carousel.getVisibleItemsCount({
                controlWidth: 10,
                firstVisibleIndex: 4,
                itemMargin: 1,
                itemWidth: 40,
                maxWidth: 500,
                totalItems: 10
            });

            expect(countWithNoMargin).to.be.equal(expectedWithNoMargin);
            expect(countWithMargin).to.be.equal(expectedWithMargin);
        });
    });
});
