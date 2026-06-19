
export class Poll {
  id: number;
  title: string;


  constructor(obj: Partial<Poll>) {
    Object.assign(this, obj);
  }
}
