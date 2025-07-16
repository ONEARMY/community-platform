import chaiSubset from 'chai-subset'

import type { ILibrary, IUserDB, ProfileTypeName } from 'oa-shared'

declare global {
  namespace Chai {
    interface Assertion {
      eqProjectStep(expect: any, index: number)
    }
  }
}

chai.use((chaiObj) => {
  function assertIsInViewport(tolerance = 0) {
    const subject = this._obj

    cy.window().then((win) => {
      const bottom = Cypress.$(win).height()! + tolerance
      const width = Cypress.$(win).width()! + tolerance
      const rect = subject[0].getBoundingClientRect()

      expect(
        rect.top < bottom && rect.right <= width && rect.left >= 0,
        'expected #{this} to be in the viewport',
      ).to.eq(true)
    })
  }

  chaiObj.Assertion.addMethod('inViewport', assertIsInViewport)
})

const eqProject = (chaiObj) => {
  function compare(this: any, expected: any) {
    const subject: ILibrary.Item = this._obj
    const {
      _createdBy,
      _deleted,
      category,
      description,
      difficulty_level,
      slug,
      time,
      title,
      tags,
      previousSlugs,
      moderation,
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
      previousSlugs,
    })
    expect(subject.category!.label, 'Category').to.eq(category)

    expect(subject.moderation).to.equal(moderation)

    // We want to validate that uploaded filename matches that originally specified
    // by the user. The filename will include a timestamp to avoid collisions with
    // existing files that have been uploaded.
    // Rather than using a RegExp to validate as our fixture specifies the filename
    // using a plain, we can break filename into chunks and validate each of those are present.
    // note, full cover image meta won't match as uploaded image meta changes
    expect(subject.cover_image!.name, 'Cover images').to.satisfy((str) =>
      expected
        .cover_image!.name.split('.')
        .filter(Boolean)
        .every((chunk) => str.includes(chunk)),
    )

    expected.steps.forEach((step, index) => {
      expect(subject.steps[index], `Have step ${index}`).to.eqProjectStep(
        step,
        index,
      )
    })
  }
  chaiObj.Assertion.addMethod('eqProject', compare)
}
const eqProjectStep = (chaiObj) => {
  function compare(this: any, expected: any, index: number) {
    const subject: ILibrary.Step = this._obj
    const { _animationKey, text, title } = expected
    expect(subject, `Step ${index} with info`).to.containSubset({
      _animationKey,
      text,
      title,
    })
    // note, image meta won't match as uploaded image meta changes
    expect(subject!.images.length, `Step ${index} with images`).to.eq(
      expected!.images.length,
    )
  }

  chaiObj.Assertion.addMethod('eqProjectStep', compare)
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
  const basicInfoAssert: Assert<IUserDB, any> = (subject, expected) => {
    const { _deleted, about, displayName, profileType, verified } = expected
    expect(subject, 'Basic Info').to.containSubset({
      _deleted,
      displayName,
      verified,
      profileType,
      about,
    })
  }
  const basicMemberInfoAssert: Assert<IUserDB, any> = (subject, expected) => {
    const { _deleted, about, profileType, displayName, verified } = expected
    expect(subject, 'Basic Info').to.containSubset({
      _deleted,
      displayName,
      verified,
      profileType,
      about,
    })
  }
  const linkAssert: Assert<IUserDB, any> = (subject, expected) =>
    expect(subject!.links.length, 'Links').to.eq(expected.links.length)
  const coverImageAssert: Assert<IUserDB, any> = (subject, expected) =>
    // only test length as uploaded images get new url and meta
    expect(subject.coverImages, 'CoverImages').to.have.same.length(
      expected.coverImages.length,
    )
  const locationAssert: Assert<IUserDB, any> = (subject, expected) => {
    expect(subject.location, 'Location').to.containSubset(expected.location)
  }
  const workspaceAssert: Assert<IUserDB, any> = (subject, expected) =>
    expect(subject.workspaceType, 'workspaceType').to.containSubset(
      expected.workspaceType,
    )

  const assertMap: {
    [key in ProfileTypeName]: ChainAssert<IUserDB, any>
  } = {
    workspace: new ChainAssert<IUserDB, any>(
      workspaceAssert,
      basicInfoAssert,
      coverImageAssert,
      linkAssert,
      locationAssert,
    ),
    member: new ChainAssert<IUserDB, any>(
      basicMemberInfoAssert,
      coverImageAssert,
      linkAssert,
    ),
    'machine-builder': new ChainAssert<IUserDB, any>(
      basicInfoAssert,
      coverImageAssert,
      linkAssert,
      locationAssert,
    ),
    'community-builder': new ChainAssert<IUserDB, any>(
      basicInfoAssert,
      coverImageAssert,
      linkAssert,
      locationAssert,
    ),
    'collection-point': new ChainAssert<IUserDB, any>(
      basicInfoAssert,
      coverImageAssert,
      linkAssert,
      locationAssert,
    ),
    space: undefined,
  }

  function compare(this: any, expected: any) {
    assertMap[expected.profileType].assert(this._obj, expected)
  }

  chaiObj.Assertion.addMethod('eqSettings', compare)
}
chai.use(eqProject)
chai.use(eqProjectStep)
chai.use(eqSettings)
chai.use(chaiSubset)
