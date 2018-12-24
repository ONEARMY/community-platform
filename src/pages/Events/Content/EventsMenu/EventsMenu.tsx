import * as React from 'react'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { IEventFilters } from 'src/models/events.models'
import './EventsMenu.scss'
import * as Mocks from 'src/mocks/events.mock'

type timePeriod = 'weekend' | 'week' | 'month' | 'year'

interface IState {
  filters: IEventFilters
  timePeriod: timePeriod
}

const d = new Date()

export class EventsMenu extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
    // initial state
    this.state = { filters: Mocks.EVENT_FILTERS, timePeriod: 'weekend' }
    console.log('state', this.state)
  }

  public filtersUpdated(e: React.ChangeEvent<HTMLSelectElement>) {
    const filters = { ...this.state.filters }
    filters[e.target.name] = e.target.value
    this.setState({ filters })
    console.log('state', this.state)
  }

  public updateEventType(type) {
    const filters = { ...this.state.filters }
    filters.type = type
    this.setState({ filters })
  }

  public clearFilters() {
    this.setState({ filters: Mocks.EVENT_FILTERS })
  }

  public render() {
    return (
      <div id="EventsMenu">
        <div className="container">
          <form autoComplete="off">
            {/* Project */}
            <FormControl className="form-control" variant="outlined">
              <Select
                displayEmpty
                disableUnderline
                value={this.state.filters.project}
                onChange={e => this.filtersUpdated(e)}
                inputProps={{
                  name: 'project',
                  id: 'project-id',
                }}
              >
                {Mocks.EVENT_PROJECTS.map(project => (
                  <MenuItem value={project.value} key={project.value}>
                    {project.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Location */}
            <FormControl className="form-control" variant="outlined">
              <Select
                displayEmpty
                disableUnderline
                value={this.state.filters.location}
                onChange={e => this.filtersUpdated(e)}
                inputProps={{
                  name: 'location',
                  id: 'location-id',
                }}
              >
                {Mocks.EVENT_LOCATIONS.map(location => (
                  <MenuItem value={location.value} key={location.value}>
                    {location.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Date */}
            <FormControl className="form-control" variant="outlined">
              <Select
                displayEmpty
                disableUnderline
                value={this.state.timePeriod}
                onChange={e => this.setDate(e.target.value as timePeriod)}
                inputProps={{
                  name: 'when',
                  id: 'when-id',
                }}
              >
                {Mocks.TIMEFRAMES.map(timeframe => (
                  <MenuItem value={timeframe.value} key={timeframe.value}>
                    {timeframe.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="sub-heading">Filter Events</div>
            {Mocks.EVENT_TYPES.map(type => (
              <Button
                key={type}
                onClick={() => this.updateEventType(type)}
                className={
                  this.state.filters.type === type
                    ? 'event-type active'
                    : 'event-type'
                }
              >
                {type}
              </Button>
            ))}
          </form>
          <Button className="clear-filters" onClick={() => this.clearFilters()}>
            Clear Filters
          </Button>
        </div>
      </div>
    )
  }

  // *** NOTE - WiP to convert named time period to specific dates
  private setDate(period: timePeriod) {
    const filters = { ...this.state.filters }
    const from = new Date()
    // let to: Date
    switch (period) {
      case 'weekend':
        break

      default:
        break
    }
    filters.dateFrom = d
    filters.dateTo = d
    this.setState({ timePeriod: period })
  }
}
