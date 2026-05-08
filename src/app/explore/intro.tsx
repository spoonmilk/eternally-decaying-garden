"use client";

import { ReactNode } from "react";

interface IntroContentProps {
  setId: number;
  onBegin: () => void;
}

const INTRO_COPY: Record<number, { heading: ReactNode; body: ReactNode }> = {
  1: {
    heading: (
      <h1>
        <span className="redac-reg">Prelude 1 // </span>
        <span className="redac-20">Timescales</span>
        <span className="redac-35"> of the </span>
        <span className="redac-50">Internet</span>
      </h1>
    ),
    body: (
      <>
        <p>
          Scrolling through these old digital haunts,
          <br />
          you can't help but feel you're intruding on something.
        </p>

        <p>
          Staring into a soul is a very naked thing,
          <br />
          even if it's your own.
        </p>

        <p>
          And as you flip through old stories and captions,
          <br />
          you also can't help but feel the pit of loss in your stomach.
          <br />
          And with that loss, jealousy.
        </p>

        <p>
          This thing — this camera and phone and website and company —<br />
          all remember so much <i>better</i> than you do.
        </p>

        <p>Why can't you have a camera behind your eyes?</p>
      </>
    ),
  },
  2: {
    heading: (
      <h1>
        <span className="redac-reg">Prelude 2 // </span>
        <span className="redac-20">Link rot,</span>
        <span className="redac-35"> consumption, </span>
        <span className="redac-50">mechanisms of loss</span>
      </h1>
    ),
    body: (
      <>
        <p>
          Your idle scrolling eventually takes you to a link
          <br />
          embedded in a message you have some faint remembrance of.
        </p>

        <p>
          Some old P2P file services.
          <br />
          MP3s from your friends,
          <br />
          sharing pirated music without any care for security.
        </p>

        <p>You click on the link.</p>

        <p>
          A digital storefront greets you,
          <br />
          offering the name <i>cooltunes.io</i> for 30 dollars a year.
        </p>

        <p>
          Everything once hosted here is lost to you —<br />
          probably some time ago, when whichever lonely developer
          <br />
          who ran this server didn't care to pay the renewal fee.
        </p>
      </>
    ),
  },
  3: {
    heading: (
      <h1>
        <span className="redac-reg">Prelude 3 // </span>
        <span className="redac-20">Bias & Justice</span>
        <span className="redac-35"> in </span>
        <span className="redac-50">Knowledge Work</span>
      </h1>
    ),
    body: (
      <p>
        Something something what does it mean for memory to be tied to capital
      </p>
    ),
  },
};

export default function IntroContent({ setId, onBegin }: IntroContentProps) {
  const copy = INTRO_COPY[setId] ?? INTRO_COPY[1];

  return (
    <div className="inter-content">
      {copy.heading}
      <div className="intro-body">{copy.body}</div>
      <button onClick={onBegin} className="inter-button">
        Continue
      </button>
    </div>
  );
}
