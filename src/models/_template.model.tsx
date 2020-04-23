import { IUser } from './user.models'

export interface ITemplateData {
  id: number
  message: ITemplateMessage
  _createdBy?: IUser['userName']
  _created: Date
  _modified: Date
}

interface ITemplateMessage {
  message: string
  read: boolean
  type: 'short' | 'long'
}

/*************************************************************************************  
General Q & A

Q. What are models?
These are data schemas to define the shape of specific data. This is incredibly useful
for autocompletion, debugging and ensuring good code consistency

Q. What does ITemplateData[] mean?
We have defined the shape of our data using ITemplateData model. The extra [] simply
means we expect an array of items all matching that data structure
(for more info see https://www.typescriptlang.org/docs/handbook/basic-types.html)

Q. Why are some keys starting with an underscore '_'?
It's generally good to keep track of some metadata in the database (particularly timestamps)
as by default data won't have automatic mechanisms to track data order or updates.
As these things aren't specified by the user but automated somewhere else it is good
to identify differently, namely starting with '_'

Q. How do I define more complex structures?
You can define a field as another interface for nested properties like has been
done for message and _createdBy. There's lots more ways for further advanced
types, such as providing a specific list of strings (e.g. ITemplateMessage type),
including unknown fields via [key]:valueType etc. (see link above for more) 

Q. Why is ITemplateData exported but not ITemplateMessage
Quite simply, anything that will be used in another file should be exported, as
the ITemplateMessage is really just a child of ITemplateData it doesn't need
and additional export.

Anything else you want to know? Add it to a git issue and so we can make the 
template even more useful

**************************************************************************************/
