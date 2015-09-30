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

    describe('.getMeasurements', () => {
        it('should give correct measures', () => {
            let expected1,
                expected2,
                input1,
                input2,
                measurements1,
                measurements2;

            input1 = {
                maxWidth: 500,
                controlButtonWidth: 30,
                totalItems: 15,
                displayWindowSize: 5,
                itemMargin: 1,
                visibleIndex: 0
            };
            measurements1 = Carousel.prototype.getMeasurements(input1);
            expected1 = {
                cellWidth: 93.6,
                listPosition: -30,
                prevButtonActive: false,
                nextButtonActive: true,
                listWidth: 468,
                visibleCellIdeces: [0, 1, 2, 3, 4]
            };

            input2 = {
                maxWidth: 500,
                controlButtonWidth: 30,
                totalItems: 15,
                displayWindowSize: 5,
                itemMargin: 1,
                visibleIndex: 3
            };
            expected2 = {
                cellWidth: 87.6,
                listPosition: -262.79999999999995,
                prevButtonActive: true,
                nextButtonActive: true,
                listWidth: 438,
                visibleCellIdeces: [3, 4, 5, 6, 7]
            };
            measurements2 = Carousel.prototype.getMeasurements(input2);

            expect(measurements1).to.be.deep.equal(expected1);
            expect(measurements2).to.be.deep.equal(expected2);
        });
    });
});
