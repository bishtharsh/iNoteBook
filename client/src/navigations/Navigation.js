import React from 'react'
import ROUTES from './Routes'
import {BrowserRouter,Routes,Route} from "react-router-dom"


function Navigation() {
  return <>
    <BrowserRouter>
      <Routes>
          <Route path={ROUTES.about.name} element={ROUTES.about.component}/>
          <Route path={ROUTES.home.name} element={ROUTES.home.component}/>
          <Route path={ROUTES.contact.name} element={ROUTES.contact.component}/>
          <Route path={ROUTES.support.name} element={ROUTES.support.component}/>
          <Route path={ROUTES.login.name} element={ROUTES.login.component}/>
          <Route path={ROUTES.register.name} element={ROUTES.register.component}/>
          <Route path={ROUTES.profile.name} element={ROUTES.profile.component}/>
      </Routes>
    </BrowserRouter>
  </>
}

export default Navigation