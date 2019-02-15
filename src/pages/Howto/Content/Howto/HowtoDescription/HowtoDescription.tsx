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
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import { IHowto } from 'src/models/howto.models'

interface IProps {
  howto: IHowto
}

export default class HowtoDescription extends React.PureComponent<IProps, any> {
  constructor(props: any) {
    super(props)
  }
  public render() {
    const { howto } = this.props
    return (
      <Container>
        <ContainerLeft>
          <Padding>
            <Typography variant="h4" component="h4">
              {howto.tutorial_title}
            </Typography>
            <TutorialInfo component="p">
              {howto.tutorial_description}
            </TutorialInfo>
            <TutorialInfo component="p">
              <b>Workspace : {howto.workspace_name}</b>
            </TutorialInfo>
            <TutorialInfo component="p">
              <b>{howto.steps.length} Steps</b>
            </TutorialInfo>
            <TutorialInfo component="p">
              <b>Cost : {howto.tutorial_cost} €</b>
            </TutorialInfo>
            <TutorialInfo component="p">
              <b>Difficulty : {howto.difficulty_level}</b>
            </TutorialInfo>
            <TutorialInfo component="p">
              <b>Time : {howto.tutorial_time}</b>
            </TutorialInfo>
            <div>
              {Object.keys(howto.tags).map(k => (
                <TagDisplay tagKey={k} key={k} />
              ))}
            </div>
            {howto.tutorial_files.length > 0 && (
              <TutorialInfo component="p">
                <b>Files : </b>
              </TutorialInfo>
            )}
            {howto.tutorial_files.map(file => (
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
              howto.cover_image_url
                ? howto.cover_image_url
                : howto.cover_image.downloadUrl
            }
            alt="tutorial cover"
          />
        </ContainerRight>
      </Container>
    )
  }
}
