import { IHowto, IHowtoStep } from '../../src/models/howto.models'
import chaiSubset from 'chai-subset'
import { IUserPPDB } from '../../src/models/user_pp.models'


declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion  {
      containSubset(expect: any): any;
      eqHowtoStep(expect: any, index: number)
    }
  }
}

const eqHowto =(chaiObj, utils) => {
  function compare(this: any, expected: any) {
    const subject: IHowto = this._obj
    const { _createdBy, _deleted, caption, description, difficulty_level, slug, time, title , tags} = expected
    expect(subject, 'Basic info').to.containSubset({ _createdBy, _deleted, caption, description, difficulty_level, slug, time, title , tags})
    expect(subject.cover_image, 'Cover images').to.containSubset(expected.cover_image)

    expected.steps.forEach((step, index) => {
      expect(subject.steps[index], `Have step ${index}`).to.eqHowtoStep(step, index)
    })
  }
  chaiObj.Assertion.addMethod('eqHowto', compare)
}
const eqHowtoStep = (chaiObj, utils) => {
  function compare(this: any, expected: any, index: number) {
    const subject: IHowtoStep = this._obj
    const {_animationKey, caption, text, title} = expected
    expect(subject, `Step ${index} with info`).to.containSubset({_animationKey, caption, text, title})
    expect(subject.images, `Step ${index} with images`).to.containSubset(expected.images)
  }

  chaiObj.Assertion.addMethod('eqHowtoStep', compare)
}


const eqSettings = (chaiObj, utils) => {
  function compare(this: any, expected: any, index: number) {
    const subject: IUserPPDB = this._obj
    const {_authID, _deleted, _id, about, country, profileType, userName, verified, workspaceType} = expected
    expect(subject, 'Basic Info').to.containSubset({_authID, _deleted, _id, userName, verified, profileType, workspaceType, about, country})
    const { links, location, mapPinDescription, openingHours} = expected
    expect(subject.links, 'Links').to.containSubset(links)
    expect(subject.location, 'Location').to.containSubset(location)
    expect(subject.mapPinDescription, 'Map Pin Description').to.containSubset(mapPinDescription)
    expect(subject.openingHours, 'Opening Hours').to.containSubset(openingHours)
  }

  chaiObj.Assertion.addMethod('eqSettings', compare)
}

chai.use(eqHowto);
chai.use(eqHowtoStep);
chai.use(eqSettings);
chai.use(chaiSubset)