import type { IHowto, IHowtoStep } from '../../../../src/models/howto.models'
import chaiSubset from 'chai-subset'
import type { IUserPPDB } from '../../../../src/models/user_pp.models'

import type { ProfileTypeLabel } from '../../../../src/modules/profile/types'

declare global {
  namespace Chai {
    interface Assertion {
      containSubset(expect: any): any
      eqHowtoStep(expect: any, index: number)
    }
  }
}

chai.use((chaiObj) => {
  function assertIsInViewport(tolerance = 0) {
    const subject = this._obj

    const bottom = Cypress.$(cy.state('window')).height() + tolerance
    const width = Cypress.$(cy.state('window')).width() + tolerance
    const rect = subject[0].getBoundingClientRect()

    expect(
      rect.top < bottom && rect.right <= width && rect.left >= 0,
      'expected #{this} to be in the viewport',
    ).to.eq(true)
  }

  chaiObj.Assertion.addMethod('inViewport', assertIsInViewport)
})

const eqHowto = (chaiObj) => {
  function compare(this: any, expected: any) {
    const subject: IHowto = this._obj
    const {
      _createdBy,
      _deleted,
      description,
      difficulty_level,
      slug,
      time,
      title,
      tags,
    } = expected
    expect(subject, 'Basic info').to.containSubset({
      _createdBy,
      _deleted,
      description,
      difficulty_level,
      slug,
      time,
      title,
      tags,
    })

    // We want to validate that uploaded filename matches that originally specified
    // by the user. The filename will include a timestamp to avoid collisions with
    // existing files that have been uploaded.
    // Rather than using a RegExp to validate as our fixture specifies the filename
    // using a plain, we can break filename into chunks and validate each of those are present.
    // note, full cover image meta won't match as uploaded image meta changes
    expect(subject.cover_image.name, 'Cover images').to.satisfy((str) =>
      expected.cover_image.name
        .split('.')
        .filter(Boolean)
        .every((chunk) => str.includes(chunk)),
    )

    expected.steps.forEach((step, index) => {
      expect(subject.steps[index], `Have step ${index}`).to.eqHowtoStep(
        step,
        index,
      )
    })
  }
  chaiObj.Assertion.addMethod('eqHowto', compare)
}
const eqHowtoStep = (chaiObj) => {
  function compare(this: any, expected: any, index: number) {
    const subject: IHowtoStep = this._obj
    const { _animationKey, text, title } = expected
    expect(subject, `Step ${index} with info`).to.containSubset({
      _animationKey,
      text,
      title,
    })
    // note, image meta won't match as uploaded image meta changes
    expect(subject.images.length, `Step ${index} with images`).to.eq(
      expected.images.length,
    )
  }

  chaiObj.Assertion.addMethod('eqHowtoStep', compare)
}

const eqSettings = (chaiObj) => {
  type Assert<S, E> = (subject: S, expected: E) => void
  class ChainAssert<S, E> {
    asserts: Assert<S, E>[] = []
    assert: Assert<S, E> = (subject: S, expected: E) => {
      this.asserts.forEach((assert) => assert(subject, expected))
    }
    constructor(...asserts: Assert<S, E>[]) {
      this.asserts.push(...asserts)
    }
  }
  const basicInfoAssert: Assert<IUserPPDB, any> = (subject, expected) => {
    const { _authID, _deleted, _id, about, profileType, userName, verified } =
      expected
    expect(subject, 'Basic Info').to.containSubset({
      _authID,
      _deleted,
      _id,
      userName,
      verified,
      profileType,
      about,
    })
  }
  const basicMemberInfoAssert: Assert<IUserPPDB, any> = (subject, expected) => {
    const { _authID, _deleted, _id, about, profileType, userName, verified } =
      expected
    expect(subject, 'Basic Info').to.containSubset({
      _authID,
      _deleted,
      _id,
      userName,
      verified,
      profileType,
      about,
    })
  }
  const linkAssert: Assert<IUserPPDB, any> = (subject, expected) =>
    expect(subject.links.length, 'Links').to.eq(expected.links.length)
  const coverImageAssert: Assert<IUserPPDB, any> = (subject, expected) =>
    // only test length as uploaded images get new url and meta
    expect(subject.coverImages, 'CoverImages').to.have.same.length(
      expected.coverImages.length,
    )
  const locationAssert: Assert<IUserPPDB, any> = (subject, expected) => {
    expect(subject.location, 'Location').to.containSubset(expected.location)
    expect(subject.mapPinDescription, 'MapPinDescription').to.containSubset(
      expected.mapPinDescription,
    )
  }
  const workspaceAssert: Assert<IUserPPDB, any> = (subject, expected) =>
    expect(subject.workspaceType, 'workspaceType').to.containSubset(
      expected.workspaceType,
    )
  const machineExpertiseAssert: Assert<IUserPPDB, any> = (subject, expected) =>
    expect(subject.machineBuilderXp, 'MachineBuilderXp').to.containSubset(
      expected.machineBuilderXp,
    )
  const openingHoursAssert: Assert<IUserPPDB, any> = (subject, expected) =>
    expect(subject.openingHours, 'OpeningHours').to.containSubset(
      expected.openingHours,
    )
  const plasticTypeAssert: Assert<IUserPPDB, any> = (subject, expected) =>
    expect(
      subject.collectedPlasticTypes,
      'CollectedPlasticTypes',
    ).to.containSubset(expected.collectedPlasticTypes)

  const assertMap: {
    [key in ProfileTypeLabel]: ChainAssert<IUserPPDB, any>
  } = {
    workspace: new ChainAssert<IUserPPDB, any>(
      workspaceAssert,
      basicInfoAssert,
      coverImageAssert,
      linkAssert,
      locationAssert,
    ),
    member: new ChainAssert<IUserPPDB, any>(
      basicMemberInfoAssert,
      coverImageAssert,
      linkAssert,
    ),
    'machine-builder': new ChainAssert<IUserPPDB, any>(
      basicInfoAssert,
      coverImageAssert,
      linkAssert,
      locationAssert,
      machineExpertiseAssert,
    ),
    'community-builder': new ChainAssert<IUserPPDB, any>(
      basicInfoAssert,
      coverImageAssert,
      linkAssert,
      locationAssert,
    ),
    'collection-point': new ChainAssert<IUserPPDB, any>(
      basicInfoAssert,
      coverImageAssert,
      linkAssert,
      locationAssert,
      openingHoursAssert,
      plasticTypeAssert,
    ),
  }

  function compare(this: any, expected: any) {
    assertMap[expected.profileType].assert(this._obj, expected)
  }

  chaiObj.Assertion.addMethod('eqSettings', compare)
}
chai.use(eqHowto)
chai.use(eqHowtoStep)
chai.use(eqSettings)
chai.use(chaiSubset)
