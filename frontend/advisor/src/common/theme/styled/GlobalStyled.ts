// globalStyles.js
import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
  :root {
    --main-background: #e2e2e2;
    --main-bg-color-shadow: #c0c0c0;
    --main-bg-color-highlight: #ffffff;
    --primary-purple: #560BAD;
    --secondary-purple: #7209B7;
    --tertiary-purple: #3C096C;
    --primary-pink: #F72585;
    --secondary-pink: #B5179E;
    --primary-blue: #3F37C9;
    --secondary-blue: #3A0CA3;
    --tertiary-blue: #480CA8;
    --primary-cyan: #4CC9F0;
    --secondary-cyan: #4895EF;
    --tertiary-cyan: #4361EE;
    --primary-orange: #FF9E00;
    --secondary-orange: #FF9100;
    --tertiary-orange: #FF8500;
    --primary-black: #575757;
    --secondary-black: #000000;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', Helvetica, Sans-Serif;
  }

  .basicLightbox {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, .8);
    opacity: .01;
    transition: opacity .4s ease;
    z-index: 1000;
    will-change: opacity
  }

  .basicLightbox--visible {
    opacity: 1
  }

  .basicLightbox__placeholder {
    max-width: 100%;
    transform: scale(.9);
    transition: transform .4s ease;
    z-index: 1;
    will-change: transform
  }

  .basicLightbox__placeholder>iframe:first-child:last-child,
  .basicLightbox__placeholder>img:first-child:last-child,
  .basicLightbox__placeholder>video:first-child:last-child {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    max-width: 95%;
    max-height: 95%
  }

  .basicLightbox__placeholder>iframe:first-child:last-child,
  .basicLightbox__placeholder>video:first-child:last-child {
    pointer-events: auto
  }

  .basicLightbox__placeholder>img:first-child:last-child,
  .basicLightbox__placeholder>video:first-child:last-child {
    width: auto;
    height: auto
  }

  .basicLightbox--iframe .basicLightbox__placeholder,
  .basicLightbox--img .basicLightbox__placeholder,
  .basicLightbox--video .basicLightbox__placeholder {
    width: 100%;
    height: 100%;
    pointer-events: none
  }

  .basicLightbox--visible .basicLightbox__placeholder {
    transform: scale(1)
  }

  .modal {
    color: white;    
    img {
      top: 100%;
      left: 100%;
      transform: translate(20%, 0%);
      width: 70%;   
      height: auto;
      object-fit: cover;
    }
  }

  /**
  * CSS ANIMATIONS =========================
  */
  /**
  * Fade In Animation
  */
  @-webkit-keyframes fadeIn {
      0% {opacity: 0;}
      100% {opacity: 1;}
  }
  @keyframes fadeIn {
      0% {opacity: 0;}
      100% {opacity: 1;}
  }
  @media (max-width: 540px) {
      display: none;
      .modal {
        img {
          width: 100%;
          transform: translate(0%, 0%);
        }
      }
  }
`;
 
export default GlobalStyle;