import { AcademyPage } from '../page-objects/academy-page'

context('how-to', () => {
  const academyPage = new AcademyPage()

  it('should navigate without login', () => {
    academyPage.navigate()
  })
})
