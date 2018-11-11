import * as React from 'react'
import './TutorialList.scss'
import { Link } from 'react-router-dom'
import { ClampLines } from '../../../../components/ClampLines/ClampLines'
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Grid,
  Typography,
  IconButton,
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import CommentIcon from '@material-ui/icons/Comment'
import TurnedInIcon from '@material-ui/icons/TurnedIn'
import { theme } from '../../../../themes/app.theme'
import AddIcon from '../../../../assets/icons/add.svg'
import { ITutorial } from 'src/models/models'

const styles: any = {
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    padding: `${theme.spacing.unit * 4}px 0`,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  link: {
    textDecoration: 'none',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}

interface IProps {
  allTutorials: ITutorial[]
}
class TutorialList extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    const { allTutorials } = this.props

    return (
      <div>
        <Typography
          style={{ margin: '30px auto', display: 'table' }}
          variant="h4"
          component="h4"
        >
          Documentation
        </Typography>
        <Link to={`/docs/create`} className="create-tutorial__button">
          <img src={AddIcon} alt="" />
          <span>create tutorial</span>
        </Link>
        <React.Fragment>
          <div style={styles.layout}>
            <Grid container spacing={40}>
              {allTutorials.map((card: any, index: number) => (
                <Grid item key={index} xs={4}>
                  <Link
                    to={`/docs/${encodeURIComponent(card.values.slug)}`}
                    style={styles.link}
                  >
                    <Card className="tutorial-list__card">
                      <CardMedia
                        style={styles.cardMedia}
                        image={card.values.cover_image_url} // eslint-disable-line max-len
                        title="Image title"
                      />
                      <CardContent style={styles.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {card.values.tutorial_title}
                        </Typography>
                        <div className="tutorial-list__card-description">
                          <ClampLines
                            text={card.values.tutorial_description}
                            lines={4}
                            ellipsis="..."
                            className="custom-class"
                          />
                        </div>
                        <Typography>by {card.values.workspace_name}</Typography>
                      </CardContent>
                      <CardActions>
                        <Typography>PRECIOUS PLASTIC</Typography>
                        <div
                          style={{
                            marginLeft: 'auto',
                          }}
                        >
                          <IconButton>
                            <Typography style={{ marginRight: '5px' }}>
                              {Math.trunc(Math.random() * (60 - 4) + 4) + ' '}
                            </Typography>
                            <TurnedInIcon />
                          </IconButton>
                          <IconButton>
                            <Typography style={{ marginRight: '5px' }}>
                              {Math.trunc(Math.random() * (60 - 4) + 4) + ' '}
                            </Typography>
                            <CommentIcon />
                          </IconButton>
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                        </div>
                      </CardActions>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </div>
          <Link to={`/docs/create`} className="create-tutorial__button">
            <img src={AddIcon} alt="" />
            <span>create tutorial</span>
          </Link>
        </React.Fragment>
      </div>
    )
  }
}

export default TutorialList
