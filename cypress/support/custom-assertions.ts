import chaiSubset from 'chai-subset'

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      containSubset(expect: any): any
      eqHowtoStep(expect: any, index: number)
    }
  }
}
