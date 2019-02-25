import * as React from 'react'
import { Link } from 'react-router-dom'
import CardActions from '@material-ui/core/CardActions'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import LinearProgress from '@material-ui/core/LinearProgress'
import { UsefulIcon, SaveIcon, TickIcon } from 'src/assets/icons/icon_components'
import { CreateButton } from './elements'
import { IHowto } from 'src/models/howto.models'
import { TagDisplay } from 'src/pages/common/Tags/TagDisplay/TagDisplay'

const styles: any = {
  cards: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none'
  },
  layout: {
    width: 'auto',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
  cardMedia: {
    paddingTop: '70%',
  },
  cardContent: {},
  labelContent: {}
}

interface IProps {
  allHowtos: IHowto[]
}

export class HowtoList extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }
  
  renderCardMedia(howto) {
    return (
    <CardMedia
      style={styles.cardMedia}
      image={
        howto.cover_image
        ? howto.cover_image.downloadUrl
        : howto.cover_image_url
      } // eslint-disable-line max-len
      title="Image title"
    /> 
    )
  }

  renderCardContent(howto) {
    return (
    <CardContent style={styles.cardContent}>
      <Typography 
        variant='h6'>
        {howto.tutorial_title}
      </Typography>
    </CardContent>
    ) 
  }

  renderLabelContent(howto) {
    return (
      <CardContent style={styles.labelContent}>
      {/* placeholder for tags */}
      <div>
        {Object.keys(howto.tags).map(k => (
          <TagDisplay tagKey={k} key={k} />
        ))}
      </div>
      </CardContent>
    )
  }

  renderCardActions(howto) {
    // use passed in howto for user info, other relevant props
    return (
      <CardActions>
      <Typography>username and coverimage</Typography>
        <UsefulIcon></UsefulIcon>
        <SaveIcon></SaveIcon>
        <TickIcon></TickIcon>
      </CardActions>
    )
  }

  public render() {
    const { allHowtos } = this.props
    return (
      <div>
        <Link to={'/how-to/create'}>
          <CreateButton icon={'add'}>create how-to</CreateButton>
        </Link>
        <React.Fragment>
          <div style={styles.layout}>
            {allHowtos.length === 0 ? (
              <LinearProgress />
            ) : (
              <Grid container spacing={16}>
                {allHowtos.map((howto: IHowto, index: number) => (
                  <Grid item key={index} xs={4}>
                    <Link
                      to={`/how-to/${encodeURIComponent(howto.slug)}`}
                      style={styles.link}
                    >
                      <Card
                        style={ styles.cards }
                        raised={ false }
                        square={ true }
                      >

                        { this.renderCardMedia(howto) }
                        { this.renderCardContent(howto) }
                        { this.renderLabelContent(howto) }
                        { this.renderCardActions(howto) }
                    
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            )}
          </div>
        </React.Fragment>
      </div>
    )
  }
}
