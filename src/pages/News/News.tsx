import { Suspense } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { NewsListing } from './Content/NewsListing'
import { NewsArticle } from './Content/NewsArticle'

const NewsPage = () => (
  <Suspense fallback={<div></div>}>
    <Switch>
      <Route exact path="/news">
        <NewsListing />
      </Route>
      <Route exact path="/news/:slug">
        <NewsArticle />
      </Route>
    </Switch>
  </Suspense>
)

export default withRouter(NewsPage)
