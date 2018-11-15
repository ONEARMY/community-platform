import { ITemplateData } from 'src/models/_template.model'

export const TemplateMock: ITemplateData[] = [
  {
    id: 1,
    message: { message: 'hello', read: true, type: 'short' },
    createdBy: {
      altName: 'chrismclarke',
      email: 'chris@email.com',
      firstName: 'Chris',
      id: '_demo_001',
      lastName: 'Clarke',
      verified: true,
      _created: new Date(),
      _modified: new Date(),
    },
    _created: new Date(),
    _modified: new Date(),
  },
  {
    id: 2,
    message: { message: 'ahoyhoy', read: false, type: 'short' },
    _created: new Date(),
    _modified: new Date(),
  },
]

/*************************************************************************************  
General Q & A

Q. What are mocks?
These are simply dummy datasets for use in development. They often mimic data that 
would be populated from the main database

Q. What does ITemplateData[] mean?
We have defined the shape of our data using ITemplateData model. The extra [] simply
means we expect an array of items all matching that data structure
(for more info see https://www.typescriptlang.org/docs/handbook/basic-types.html)

Q. Isn't the data incomplete?
No, createdBy is an optional field (denoted by ? in the model)


Anything else you want to know? Add it to a git issue and so we can make the 
template even more useful

**************************************************************************************/
