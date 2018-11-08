import { IUser } from './user.models'

export interface ITemplateData {
  id: number
  message: ITemplateMessage
  createdBy?: IUser
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

Q. How do I define more complex structures?
You can define a field as another interface for nested properties like has been
done for message and createdBy. There's lots more ways for further advanced
types, such as providing a specific list of strings (e.g. ITemplateMessage type),
including unknown fields via [key]:valueType etc. (see link above for more) 

Q. Why is ITemplateData exported but not ITemplateMessage
Quite simply, anything that will be used in another file should be exported, as
the ITemplateMessage is really just a child of ITemplateData it doesn't need
and additional export.

Anything else you want to know? Add it to a git issue and so we can make the 
template even more useful

**************************************************************************************/
