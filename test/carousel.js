/* global describe, it, global, require, context */
/* eslint-disable max-nested-callbacks */

import chai, {
  expect
} from 'chai';
import sinonChai from 'sinon-chai';
import {
  getIndexToScrollTo,
  isNextButtonVisible,
  isPrevButtonVisible
} from '../src/Carousel';

chai.use(sinonChai);

describe('Carousel', () => {
  describe('.getIndexToScrollTo', () => {
    it('never give index larger than total items', () => {
      const act1 = getIndexToScrollTo('next', 10, 4, 0, 9);

      const act2 = getIndexToScrollTo('next', 10, 5, 6, 6);

      expect(act1).to.be.below(11);
      expect(act2).to.not.be.above(10);
    });

    it('never give index less than 0', () => {
      const act1 = getIndexToScrollTo('previous', 10, 4, 0, 9);
      const act2 = getIndexToScrollTo('previous', 10, 4, 4, 6);

      expect(act1).to.not.be.below(0);
      expect(act2).to.not.be.below(0);
    });
  });

  describe('.isNextButtonVisible', () => {
    context('all items are visible', () => {
      it('returns false', () => {
        const nextButtonIsVisible = isNextButtonVisible(10, 10, 4);

        expect(nextButtonIsVisible).to.equal(false);
      });
    });

    context('no more items to display', () => {
      it('returns false', () => {
        const nextButtonIsVisible = isNextButtonVisible(10, 6, 4);

        expect(nextButtonIsVisible).to.equal(false);
      });
    });

    context('there are items to display', () => {
      it('returns true', () => {
        const nextButtonIsVisible = isNextButtonVisible(10, 5, 4);

        expect(nextButtonIsVisible).to.equal(true);
      });
    });
  });

  describe('.isPrevButtonVisible', () => {
    it('returns false if carousel isn\'t scrolled', () => {
      const prevButtonIsVisible = isPrevButtonVisible(0);

      expect(prevButtonIsVisible).to.equal(false);
    });

    it('returns true if crousel is scrolled', () => {
      const prevButtonIsVisible = isPrevButtonVisible(4);

      expect(prevButtonIsVisible).to.equal(true);
    });
  });
});
