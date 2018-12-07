import React from 'react'

import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import Typography from '@material-ui/core/Typography'
import { TagDisplay } from 'src/pages/common/Tags/TagDisplay/TagDisplay'

import { Container, ContainerLeft, Padding } from './elements'
import Button from 'src/pages/common/Button/Button'

export default class TutorialDescription extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props)
  }
  public render() {
    const { tutorial } = this.props
    return (
      <Container>
        <ContainerLeft>
          <Padding>
            <Typography variant="h4" component="h4">
              {tutorial.tutorial_title}
            </Typography>
            <Typography component="p">
              {tutorial.tutorial_description}
            </Typography>
            <Typography component="p">
              <b>Workspace : {tutorial.workspace_name}</b>
            </Typography>
            <Typography component="p">
              <b>{tutorial.steps.length} Steps</b>
            </Typography>
            <Typography component="p">
              <b>Cost : {tutorial.tutorial_cost}</b>
            </Typography>
            <Typography component="p">
              <b>Difficulty : {tutorial.difficulty_level}</b>
            </Typography>
            <Typography component="p">
              <b>Time : {tutorial.tutorial_time}</b>
            </Typography>
            <div>
              {Object.keys(tutorial.tags).map(k => (
                <TagDisplay tagKey={k} key={k} />
              ))}
            </div>
            {tutorial.tutorial_files.length > 0 ? (
              <Button
                target="_blank"
                download
                text={'Download files'}
                href={
                  tutorial.tutorial_files[tutorial.tutorial_files.length - 1]
                    .downloadUrl
                }
                width={'200px'}
                height={'50px'}
              />
            ) : null}
          </Padding>
        </ContainerLeft>
        <div className="tutorial-infos__right">
          <img src={tutorial.cover_image_url} alt="tutorial cover" />
        </div>
      </Container>
    )
  }
}
