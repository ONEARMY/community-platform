import React from 'react'

import Typography from '@material-ui/core/Typography'
import { TagDisplay } from 'src/pages/common/Tags/TagDisplay/TagDisplay'

import {
  Container,
  ContainerLeft,
  Padding,
  ContainerRight,
  CoverImg,
  TutorialInfo,
} from './elements'
import Button from 'src/components/Button/Button'
import { ITutorial } from 'src/models/models'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'

interface IProps {
  tutorial: ITutorial
}

export default class TutorialDescription extends React.PureComponent<
  IProps,
  any
> {
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
            <TutorialInfo component="p">
              {tutorial.tutorial_description}
            </TutorialInfo>
            <TutorialInfo component="p">
              <b>Workspace : {tutorial.workspace_name}</b>
            </TutorialInfo>
            <TutorialInfo component="p">
              <b>{tutorial.steps.length} Steps</b>
            </TutorialInfo>
            <TutorialInfo component="p">
              <b>Cost : {tutorial.tutorial_cost}</b>
            </TutorialInfo>
            <TutorialInfo component="p">
              <b>Difficulty : {tutorial.difficulty_level}</b>
            </TutorialInfo>
            <TutorialInfo component="p">
              <b>Time : {tutorial.tutorial_time}</b>
            </TutorialInfo>
            <div>
              {Object.keys(tutorial.tags).map(k => (
                <TagDisplay tagKey={k} key={k} />
              ))}
            </div>
            {tutorial.tutorial_files.length > 0 && (
              <TutorialInfo component="p">
                <b>Files : </b>
              </TutorialInfo>
            )}
            {tutorial.tutorial_files.map(file => (
              <UploadedFile
                file={file}
                key={file.downloadUrl}
                showDelete={false}
              />
            ))}
          </Padding>
        </ContainerLeft>
        <ContainerRight>
          <CoverImg
            src={
              tutorial.cover_image_url
                ? tutorial.cover_image_url
                : tutorial.cover_image.downloadUrl
            }
            alt="tutorial cover"
          />
        </ContainerRight>
      </Container>
    )
  }
}
