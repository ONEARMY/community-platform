import * as React from "react";
import Content from "./Content";

import MainLayout from '../common/MainLayout/'

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
    return (
      <MainLayout>
        {this.state.isLoaded ? <Content allTutorials={this.state.tutorials} /> : null }
      </MainLayout>
    )
  }
}

export default DocsPage;
