import React, { lazy, Suspense } from "react"
import { Switch, Route } from "react-router-dom"
import { Loader } from "../components"

// Code splitting
const HomePage = lazy(() =>
  import("../pages").then(module => ({
    default: module.HomePage,
  }))
)

const Routes: React.FC = () => {
  return (
    <div className="App">
      <Suspense
        fallback={
          <div>
            <Loader
              width="100%"
              height="100%"
              type="spinner"
              withBackground={false}
              iconSize={1.5}
              style={{ position: "fixed" }}
            />
          </div>
        }
      >
        <Switch>
          <Route exact path="/" component={HomePage}></Route>
          <Route exact path="*" component={(props: any) => <>Not Found</>} />
        </Switch>
      </Suspense>
    </div>
  )
}

export default Routes
