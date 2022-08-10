import React from 'react'
import errorImage from './assets/images/404error.png' 
import './error-page.css';


const errorPage = () => {
  return (
    <div id="error-page" className="error-page">
        <div className="content">
          <img src={errorImage} alt="error image" className="error-img" />
        </div>
        <p>Nada, page not found 💩 
            <br />
          Go to <a href="https://community.preciousplastic.com/academy/intro.html">home page</a>
          </p>
    </div>
  )
}

export default errorPage;
