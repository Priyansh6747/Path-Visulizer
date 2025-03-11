import React from 'react';
import styled from 'styled-components';

const Radio = () => {
    return (
        <StyledWrapper>
            <div className="rating">
                <input defaultValue={10} name="rate" id="heart10" type="radio" />
                <label htmlFor="heart10" title="Выдающееся!">
                    <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </label>
                <input id="heart9" name="rate" defaultValue={9} type="radio" />
                <label htmlFor="heart9" title="Превосходно!">
                    <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </label>
                <input type="radio" id="heart8" name="rate" defaultValue={8} />
                <label htmlFor="heart8" title="Отлично!">
                    <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </label>
                <input type="radio" id="heart7" name="rate" defaultValue={7} />
                <label htmlFor="heart7" title="Хорошо">
                    <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </label>
                <input type="radio" id="heart6" name="rate" defaultValue={6} />
                <label htmlFor="heart6" title="Удовлетворительно">
                    <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </label>
                <input type="radio" id="heart5" name="rate" defaultValue={5} />
                <label htmlFor="heart5" title="Средне">
                    <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </label>
                <input type="radio" id="heart4" name="rate" defaultValue={4} />
                <label htmlFor="heart4" title="Ниже среднего">
                    <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </label>
                <input type="radio" id="heart3" name="rate" defaultValue={3} />
                <label htmlFor="heart3" title="Плохо">
                    <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </label>
                <input type="radio" id="heart2" name="rate" defaultValue={2} />
                <label htmlFor="heart2" title="Очень плохо">
                    <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </label>
                <input type="radio" id="heart1" name="rate" defaultValue={1} />
                <label htmlFor="heart1" title="Ужасно">
                    <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </label>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .rating > label {
    margin-right: 4px;
  }

  .rating:not(:checked) > input {
    display: none;
  }

  .rating:not(:checked) > label {
    float: right;
    cursor: pointer;
    font-size: 24px;
  }

  .rating:not(:checked) > label > svg {
    fill: #666;
    transition:
      fill 0.3s ease,
      transform 0.3s ease;
  }

  .rating > input:checked ~ label > svg {
    fill: #ff0000;
    transform: scale(1.1);
  }

  .rating:not(:checked) > label:hover ~ label > svg,
  .rating:not(:checked) > label:hover > svg {
    fill: #ff1a1a;
    transform: scale(1.05);
  }

  #heart1:checked ~ label > svg {
    fill: #ff0000;
  }

  #heart2:checked ~ label > svg {
    fill: #ff4d00;
  }

  #heart3:checked ~ label > svg {
    fill: #ff9900;
  }

  #heart4:checked ~ label > svg {
    fill: #ccff00;
  }

  #heart5:checked ~ label > svg {
    fill: #66ff00;
  }

  #heart6:checked ~ label > svg {
    fill: #00ff4d;
  }

  #heart7:checked ~ label > svg {
    fill: #00ff99;
  }

  #heart8:checked ~ label > svg {
    fill: #00ccff;
  }

  #heart9:checked ~ label > svg {
    fill: #0059ff;
  }

  #heart10:checked ~ label > svg {
    fill: #9900ff;
  }

  #heart1:hover ~ label > svg,
  #heart1:hover > svg {
    fill: #e60000 !important;
  }

  #heart2:hover ~ label > svg,
  #heart2:hover > svg {
    fill: #e66a00 !important;
  }

  #heart3:hover ~ label > svg,
  #heart3:hover > svg {
    fill: #e6b600 !important;
  }

  #heart4:hover ~ label > svg,
  #heart4:hover > svg {
    fill: #a6e600 !important;
  }

  #heart5:hover ~ label > svg,
  #heart5:hover > svg {
    fill: #00e600 !important;
  }

  #heart6:hover ~ label > svg,
  #heart6:hover > svg {
    fill: #00b3e6 !important;
  }

  #heart7:hover ~ label > svg,
  #heart7:hover > svg {
    fill: #00e6b3 !important;
  }

  #heart8:hover ~ label > svg,
  #heart8:hover > svg {
    fill: #00e6e6 !important;
  }

  #heart9:hover ~ label > svg,
  #heart9:hover > svg {
    fill: #0066e6 !important;
  }

  #heart10:hover ~ label > svg,
  #heart10:hover > svg {
    fill: #6600e6 !important;
  }`;

export default Radio;
