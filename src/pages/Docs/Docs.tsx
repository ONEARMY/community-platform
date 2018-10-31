import * as React from "react";
import { inject, observer } from 'mobx-react';

import MainLayout from '../common/MainLayout/'
import Content from "./Content";

@inject("doc")
@observer
class DocsPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    this.props.doc.getDocList();
  }

  public render() {
    const { docs } = this.props.doc;
    return (
      <MainLayout>
        {docs ? <Content allTutorials={docs} /> : null }
      </MainLayout>
    )
  }
}

export default DocsPage;
