import * as React from "react";
import Content from "./Content";

import { db } from "../../utils/firebase";

class DocsPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoaded: false,
      tutorials: []
    };
  }

  public componentDidMount() {
    this.getAllTutorials();
  }

  public getAllTutorials = async () => {
    const ref = await db.collection("tutorials").get();
    const docs: any[] = ref.docs.map(doc => doc.data());
    this.setState({
      isLoaded: true,
      tutorials: docs
    });
    return docs;
  };

  public render() {
    if (this.state.isLoaded) { return (<Content allTutorials={this.state.tutorials} />); }
    return null;
  }
}

export default DocsPage;
