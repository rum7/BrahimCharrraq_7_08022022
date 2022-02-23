import React from 'react';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

class Title extends React.Component {
  render() {
    return (
      <>
        <h2 className="title is-6 has-text-light mb-2 px-2 pt-1 pb-2 has-background-info box">Messages récent</h2>
      </>
    );
  }
}

class LastMessages extends React.Component {
  render() {
    return (
      <section className="hero has-background-light box">
        <article className="media">
          <figure className="media-left">
            <p className="image is-64x64"><img src="https://bulma.io/images/placeholders/128x128.png"/></p>
          </figure>
          <div className="media-content">
            <div className="content">
              <p>
                <strong>Batman</strong>
                <br/>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis porta eros lacus, nec ultricies elit blandit non. 
                Suspendisse pellentesque mauris sit amet dolor blandit rutrum. Nunc in tempus turpis.
                <br/>
                <small><a>Like</a> · <a>Reply</a> · 3 hrs</small>
              </p>
            </div>

            <article className="media">
              <figure className="media-left">
                <p className="image is-48x48">
                  <img src="https://bulma.io/images/placeholders/96x96.png"/>
                </p>
              </figure>
              <div className="media-content">
                <div className="content">
                  <p>
                    <strong>Joker</strong>
                    <br/>
                    Donec sollicitudin urna eget eros malesuada sagittis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam blandit nisl a nulla sagittis, a lobortis leo feugiat.
                    <br/>
                    <small><a>Like</a> · <a>Reply</a> · 2 hrs</small>
                  </p>
                </div>
              </div>
            </article>

          </div>
        </article>

        <article className="media">
          <figure className="media-left">
            <p className="image is-64x64">
              <img src="https://bulma.io/images/placeholders/128x128.png"/>
            </p>
          </figure>
          <div className="media-content">
            <div className="field">
              <p className="control">
                <textarea className="textarea" placeholder="Add a comment..."></textarea>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button">Post comment</button>
              </p>
            </div>
          </div>
        </article>
      </section>
    );
  }
}

const Feed = () => {
  return(
    <>
      <Title />
      <LastMessages />
    </>
  );
};

export default Feed